import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTaskDto, orgId: string, actorId: string) {
    const task = await this.prisma.task.create({
      data: {
        organizationId: orgId,
        title: dto.title,
        description: dto.description,
        assignedToId: dto.assignedToId,
        createdById: actorId,
        clientId: dto.clientId,
        filingId: dto.filingId,
        priority: (dto.priority as any) || 'normal',
        dueAt: dto.dueAt ? new Date(dto.dueAt) : undefined,
      },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });

    await this.prisma.notification.create({
      data: {
        organizationId: orgId,
        recipientId: dto.assignedToId,
        channel: 'in_app',
        eventType: 'task.assigned',
        title: 'New Task Assigned',
        body: dto.title,
        status: 'sent',
        sentAt: new Date(),
      },
    });

    await this.prisma.auditLog.create({
      data: {
        organizationId: orgId,
        actorUserId: actorId,
        actionType: 'task.created',
        entityType: 'task',
        entityId: task.id,
        metadata: { title: dto.title, assignedTo: dto.assignedToId },
      },
    });

    return task;
  }

  async findAll(orgId: string, query: { status?: string; assignedToId?: string; clientId?: string; priority?: string; page?: number; limit?: number }) {
    const page = query.page || 1;
    const limit = query.limit || 25;
    const skip = (page - 1) * limit;

    const where: any = { organizationId: orgId };
    if (query.status) where.status = query.status;
    if (query.assignedToId) where.assignedToId = query.assignedToId;
    if (query.clientId) where.clientId = query.clientId;
    if (query.priority) where.priority = query.priority;

    const [data, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          assignedTo: { select: { id: true, name: true, email: true } },
          client: { select: { id: true, displayName: true } },
        },
      }),
      this.prisma.task.count({ where }),
    ]);

    return { data, meta: { page, limit, total } };
  }

  async findOne(orgId: string, id: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, organizationId: orgId },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        client: { select: { id: true, displayName: true } },
        filing: { select: { id: true, category: true } },
      },
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(orgId: string, id: string, dto: UpdateTaskDto, actorId: string) {
    await this.findOne(orgId, id);
    const updated = await this.prisma.task.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status as any,
        priority: dto.priority as any,
        assignedToId: dto.assignedToId,
        dueAt: dto.dueAt ? new Date(dto.dueAt) : undefined,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        organizationId: orgId,
        actorUserId: actorId,
        actionType: 'task.updated',
        entityType: 'task',
        entityId: id,
        metadata: { changes: Object.keys(dto) },
      },
    });

    return updated;
  }
}
