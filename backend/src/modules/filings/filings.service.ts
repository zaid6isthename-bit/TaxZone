import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFilingDto, UpdateFilingStatusDto } from './dto/create-filing.dto';
import { WorkflowService } from '../workflow/workflow.service';

@Injectable()
export class FilingsService {
  constructor(
    private prisma: PrismaService,
    private workflowService: WorkflowService,
  ) {}

  async create(dto: CreateFilingDto, orgId: string, actorId: string) {
    const client = await this.prisma.client.findFirst({
      where: { id: dto.clientId, organizationId: orgId, deletedAt: null },
    });
    if (!client) throw new NotFoundException('Client not found');

    const filing = await this.prisma.filing.create({
      data: {
        organizationId: orgId,
        clientId: dto.clientId,
        category: dto.category,
        periodStart: new Date(dto.periodStart),
        periodEnd: new Date(dto.periodEnd),
        dueAt: new Date(dto.dueAt),
        status: 'not_started',
        assignedEmployeeId: dto.assignedEmployeeId,
      },
      include: {
        client: { select: { displayName: true } },
        assignedEmployee: { select: { id: true, name: true } },
      },
    });

    await this.prisma.auditLog.create({
      data: {
        organizationId: orgId,
        actorUserId: actorId,
        actionType: 'filing.created',
        entityType: 'filing',
        entityId: filing.id,
        metadata: { category: dto.category, clientId: dto.clientId },
      },
    });

    return filing;
  }

  async findAll(orgId: string, query: { clientId?: string; status?: string; category?: string; page?: number; limit?: number; assignedEmployeeId?: string }) {
    const page = query.page || 1;
    const limit = query.limit || 25;
    const skip = (page - 1) * limit;

    const where: any = { organizationId: orgId, deletedAt: null };
    if (query.clientId) where.clientId = query.clientId;
    if (query.status) where.status = query.status;
    if (query.category) where.category = query.category;
    if (query.assignedEmployeeId) where.assignedEmployeeId = query.assignedEmployeeId;

    const [data, total] = await Promise.all([
      this.prisma.filing.findMany({
        where,
        skip,
        take: limit,
        orderBy: { dueAt: 'asc' },
        include: {
          client: { select: { id: true, displayName: true, pan: true, gstin: true } },
          assignedEmployee: { select: { id: true, name: true } },
          _count: { select: { documents: true, tasks: true } },
        },
      }),
      this.prisma.filing.count({ where }),
    ]);

    return { data, meta: { page, limit, total } };
  }

  async findOne(orgId: string, id: string) {
    const filing = await this.prisma.filing.findFirst({
      where: { id, organizationId: orgId, deletedAt: null },
      include: {
        client: {
          select: { id: true, displayName: true, pan: true, gstin: true, businessType: true },
        },
        assignedEmployee: { select: { id: true, name: true, email: true } },
        reviewer: { select: { id: true, name: true } },
        docRequests: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
          include: {
            documents: { where: { deletedAt: null }, select: { id: true, originalFilename: true, verificationStatus: true, createdAt: true } },
          },
        },
        documents: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
        },
        tasks: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!filing) throw new NotFoundException('Filing not found');
    return filing;
  }

  async updateStatus(orgId: string, id: string, dto: UpdateFilingStatusDto, actorId: string) {
    const filing = await this.findOne(orgId, id);

    const event = this.workflowService.transitionFiling(
      { organizationId: orgId, actorUserId: actorId, roles: [], permissions: [] },
      id,
      filing.status as any,
      dto.status as any,
    );

    const updated = await this.prisma.filing.update({
      where: { id },
      data: { status: dto.status as any },
      include: {
        client: { select: { displayName: true } },
      },
    });

    await this.prisma.notification.create({
      data: {
        organizationId: orgId,
        recipientId: filing.clientId,
        channel: 'in_app',
        eventType: 'filing.status_changed',
        title: 'Filing Status Updated',
        body: `Filing ${filing.category} status changed to ${dto.status}`,
        status: 'sent',
        sentAt: new Date(),
      },
    });

    await this.prisma.auditLog.create({
      data: {
        organizationId: orgId,
        actorUserId: actorId,
        actionType: 'filing.status_changed',
        entityType: 'filing',
        entityId: id,
        metadata: { from: filing.status, to: dto.status },
      },
    });

    return updated;
  }

  async getDashboardStats(orgId: string) {
    const [totalFilings, byStatus, upcomingDeadlines] = await Promise.all([
      this.prisma.filing.count({ where: { organizationId: orgId, deletedAt: null } }),
      this.prisma.filing.groupBy({
        by: ['status'],
        where: { organizationId: orgId, deletedAt: null },
        _count: true,
      }),
      this.prisma.filing.findMany({
        where: { organizationId: orgId, deletedAt: null, dueAt: { gte: new Date() } },
        orderBy: { dueAt: 'asc' },
        take: 10,
        include: { client: { select: { displayName: true } } },
      }),
    ]);

    return { totalFilings, byStatus, upcomingDeadlines };
  }
}
