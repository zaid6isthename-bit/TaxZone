import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async search(orgId: string, query: string) {
    const searchTerm = `%${query}%`;

    const [clients, filings, documents, tasks, users] = await Promise.all([
      this.prisma.client.findMany({
        where: {
          organizationId: orgId,
          deletedAt: null,
          OR: [
            { displayName: { contains: query, mode: 'insensitive' } },
            { pan: { contains: query, mode: 'insensitive' } },
            { gstin: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 10,
        select: { id: true, displayName: true, pan: true, gstin: true, businessType: true },
      }),
      this.prisma.filing.findMany({
        where: {
          organizationId: orgId,
          deletedAt: null,
          OR: [
            { category: { contains: query, mode: 'insensitive' } },
            { client: { displayName: { contains: query, mode: 'insensitive' } } },
          ],
        },
        take: 10,
        select: { id: true, category: true, status: true, dueAt: true, client: { select: { displayName: true } } },
      }),
      this.prisma.document.findMany({
        where: {
          organizationId: orgId,
          deletedAt: null,
          OR: [
            { originalFilename: { contains: query, mode: 'insensitive' } },
            { client: { displayName: { contains: query, mode: 'insensitive' } } },
          ],
        },
        take: 10,
        select: { id: true, originalFilename: true, mimeType: true, verificationStatus: true, client: { select: { displayName: true } } },
      }),
      this.prisma.task.findMany({
        where: {
          organizationId: orgId,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { assignedTo: { name: { contains: query, mode: 'insensitive' } } },
          ],
        },
        take: 10,
        select: { id: true, title: true, status: true, priority: true, assignedTo: { select: { name: true } } },
      }),
      this.prisma.user.findMany({
        where: {
          organizationId: orgId,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 10,
        select: { id: true, name: true, email: true, userType: true },
      }),
    ]);

    return { clients, filings, documents, tasks, users };
  }
}
