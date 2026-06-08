import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(orgId: string, userId: string, query: { status?: string; page?: number; limit?: number }) {
    const page = query.page || 1;
    const limit = query.limit || 25;
    const skip = (page - 1) * limit;

    const where: any = { organizationId: orgId, recipientId: userId };
    if (query.status === 'unread') where.readAt = null;
    if (query.status === 'read') where.readAt = { not: null };

    const [data, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where }),
    ]);

    const unreadCount = await this.prisma.notification.count({
      where: { organizationId: orgId, recipientId: userId, readAt: null },
    });

    return { data, meta: { page, limit, total, unreadCount } };
  }

  async markRead(orgId: string, userId: string, id: string) {
    await this.prisma.notification.updateMany({
      where: { id, organizationId: orgId, recipientId: userId },
      data: { readAt: new Date(), status: 'read' },
    });
    return { message: 'Notification marked as read' };
  }

  async markAllRead(orgId: string, userId: string) {
    await this.prisma.notification.updateMany({
      where: { organizationId: orgId, recipientId: userId, readAt: null },
      data: { readAt: new Date(), status: 'read' },
    });
    return { message: 'All notifications marked as read' };
  }

  async getUnreadCount(orgId: string, userId: string) {
    const count = await this.prisma.notification.count({
      where: { organizationId: orgId, recipientId: userId, readAt: null },
    });
    return { unreadCount: count };
  }
}
