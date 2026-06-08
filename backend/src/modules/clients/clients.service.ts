import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClientDto, UpdateClientDto, AssignClientDto } from './dto/create-client.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateClientDto, orgId: string, actorId: string) {
    if (dto.pan) {
      const existing = await this.prisma.client.findFirst({
        where: { organizationId: orgId, pan: dto.pan, deletedAt: null },
      });
      if (existing) throw new ConflictException('Client with this PAN already exists');
    }
    if (dto.gstin) {
      const existing = await this.prisma.client.findFirst({
        where: { organizationId: orgId, gstin: dto.gstin, deletedAt: null },
      });
      if (existing) throw new ConflictException('Client with this GSTIN already exists');
    }

    const tempPassword = Math.random().toString(36).slice(-10);
    const passwordHash = await bcrypt.hash(tempPassword, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.displayName,
        phone: dto.phone,
        passwordHash,
        userType: 'client',
        status: 'active',
        organizationId: orgId,
        firstLoginRequired: true,
      },
    });

    const client = await this.prisma.client.create({
      data: {
        organizationId: orgId,
        userId: user.id,
        displayName: dto.displayName,
        businessType: dto.businessType || 'individual',
        filingCategory: dto.filingCategory || 'gst',
        pan: dto.pan,
        gstin: dto.gstin,
        assignedEmployeeId: dto.assignedEmployeeId,
        onboardingStatus: 'active',
      },
      include: {
        clientUser: { select: { id: true, email: true, name: true, phone: true, status: true } },
        assignedEmployee: { select: { id: true, name: true, email: true } },
      },
    });

    await this.prisma.auditLog.create({
      data: {
        organizationId: orgId,
        actorUserId: actorId,
        actionType: 'client.created',
        entityType: 'client',
        entityId: client.id,
        metadata: { clientName: dto.displayName },
      },
    });

    return { client, tempPassword };
  }

  async findAll(orgId: string, query: { page?: number; limit?: number; search?: string; status?: string; assignedEmployeeId?: string }) {
    const page = query.page || 1;
    const limit = query.limit || 25;
    const skip = (page - 1) * limit;

    const where: any = { organizationId: orgId, deletedAt: null };
    if (query.status) where.onboardingStatus = query.status;
    if (query.assignedEmployeeId) where.assignedEmployeeId = query.assignedEmployeeId;
    if (query.search) {
      where.OR = [
        { displayName: { contains: query.search, mode: 'insensitive' } },
        { pan: { contains: query.search, mode: 'insensitive' } },
        { gstin: { contains: query.search, mode: 'insensitive' } },
        { user: { email: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.client.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          clientUser: { select: { id: true, email: true, name: true, phone: true, status: true } },
          assignedEmployee: { select: { id: true, name: true, email: true } },
          _count: { select: { filings: true, documents: true } },
        },
      }),
      this.prisma.client.count({ where }),
    ]);

    return { data, meta: { page, limit, total } };
  }

  async findOne(orgId: string, id: string) {
    const client = await this.prisma.client.findFirst({
      where: { id, organizationId: orgId, deletedAt: null },
      include: {
        clientUser: { select: { id: true, email: true, name: true, phone: true, status: true } },
        assignedEmployee: { select: { id: true, name: true, email: true, phone: true } },
        assignedManager: { select: { id: true, name: true, email: true } },
        filings: {
          where: { deletedAt: null },
          orderBy: { dueAt: 'asc' },
          include: { assignedEmployee: { select: { id: true, name: true } } },
        },
        documents: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: { select: { filings: true, documents: true, tasks: true } },
      },
    });
    if (!client) throw new NotFoundException('Client not found');
    return client;
  }

  async update(orgId: string, id: string, dto: UpdateClientDto, actorId: string) {
    const client = await this.findOne(orgId, id);
    const data: any = {};
    if (dto.displayName !== undefined) data.displayName = dto.displayName;
    if (dto.businessType !== undefined) data.businessType = dto.businessType;
    if (dto.filingCategory !== undefined) data.filingCategory = dto.filingCategory;
    if (dto.pan !== undefined) data.pan = dto.pan;
    if (dto.gstin !== undefined) data.gstin = dto.gstin;
    if (dto.assignedEmployeeId !== undefined) data.assignedEmployeeId = dto.assignedEmployeeId;
    if (dto.onboardingStatus !== undefined) data.onboardingStatus = dto.onboardingStatus;

    const updated = await this.prisma.client.update({
      where: { id },
      data,
    });

    await this.prisma.auditLog.create({
      data: {
        organizationId: orgId,
        actorUserId: actorId,
        actionType: 'client.updated',
        entityType: 'client',
        entityId: id,
        metadata: { changes: Object.keys(dto) },
      },
    });

    return updated;
  }

  async assign(orgId: string, id: string, dto: AssignClientDto, actorId: string) {
    const client = await this.findOne(orgId, id);
    const updated = await this.prisma.client.update({
      where: { id },
      data: { assignedEmployeeId: dto.employeeId },
      include: {
        assignedEmployee: { select: { id: true, name: true, email: true } },
      },
    });

    await this.prisma.auditLog.create({
      data: {
        organizationId: orgId,
        actorUserId: actorId,
        actionType: 'client.assigned',
        entityType: 'client',
        entityId: id,
        metadata: { employeeId: dto.employeeId },
      },
    });

    return updated;
  }

  async remove(orgId: string, id: string, actorId: string) {
    await this.findOne(orgId, id);
    await this.prisma.client.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await this.prisma.auditLog.create({
      data: {
        organizationId: orgId,
        actorUserId: actorId,
        actionType: 'client.deleted',
        entityType: 'client',
        entityId: id,
      },
    });

    return { message: 'Client deleted' };
  }
}
