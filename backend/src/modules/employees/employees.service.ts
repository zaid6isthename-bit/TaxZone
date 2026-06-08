import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: { email: string; name: string; phone?: string; department?: string; userType: string }, orgId: string, actorId: string) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already exists');

    const tempPassword = Math.random().toString(36).slice(-10);
    const passwordHash = await bcrypt.hash(tempPassword, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        phone: dto.phone,
        passwordHash,
        userType: dto.userType as any,
        status: 'active',
        organizationId: orgId,
        firstLoginRequired: true,
      },
    });

    await this.prisma.employeeProfile.create({
      data: {
        organizationId: orgId,
        userId: user.id,
        department: dto.department,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        organizationId: orgId,
        actorUserId: actorId,
        actionType: 'employee.created',
        entityType: 'user',
        entityId: user.id,
        metadata: { name: dto.name, userType: dto.userType },
      },
    });

    return { user: { id: user.id, email: user.email, name: user.name, userType: user.userType }, tempPassword };
  }

  async findAll(orgId: string, query: { page?: number; limit?: number; department?: string }) {
    const page = query.page || 1;
    const limit = query.limit || 25;
    const skip = (page - 1) * limit;

    const where: any = { organizationId: orgId };
    where.userType = { in: ['employee', 'ca_reviewer', 'manager', 'org_admin'] };

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        include: {
          employeeProfile: true,
          _count: { select: { clients: true, assignedFilings: true, tasks: true } },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    const sanitized = data.map(({ passwordHash, ...rest }) => rest);
    return { data: sanitized, meta: { page, limit, total } };
  }

  async findOne(orgId: string, id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, organizationId: orgId },
      include: {
        employeeProfile: true,
        clients: { where: { deletedAt: null }, select: { id: true, displayName: true, pan: true } },
        assignedFilings: { where: { deletedAt: null }, select: { id: true, category: true, status: true, dueAt: true } },
        tasks: { select: { id: true, title: true, status: true, priority: true, dueAt: true } },
      },
    });
    if (!user) throw new NotFoundException('Employee not found');
    const { passwordHash, ...rest } = user;
    return rest;
  }

  async remove(orgId: string, id: string, actorId: string) {
    await this.findOne(orgId, id);
    await this.prisma.user.update({
      where: { id },
      data: { status: 'disabled' },
    });

    await this.prisma.auditLog.create({
      data: {
        organizationId: orgId,
        actorUserId: actorId,
        actionType: 'employee.deactivated',
        entityType: 'user',
        entityId: id,
      },
    });

    return { message: 'Employee deactivated' };
  }
}
