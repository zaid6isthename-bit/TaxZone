import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDocumentRequestDto, VerifyDocumentDto } from './dto/create-request.dto';
import { assertDocumentTransition } from './document-lifecycle';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async createRequest(dto: CreateDocumentRequestDto, orgId: string, actorId: string) {
    const request = await this.prisma.documentRequest.create({
      data: {
        organizationId: orgId,
        clientId: dto.clientId,
        filingId: dto.filingId,
        requestedById: actorId,
        documentType: dto.documentType,
        description: dto.description,
        dueAt: dto.dueAt ? new Date(dto.dueAt) : undefined,
        status: 'requested',
      },
      include: {
        client: { select: { displayName: true } },
        requestedBy: { select: { name: true } },
      },
    });

    await this.prisma.notification.create({
      data: {
        organizationId: orgId,
        recipientId: dto.clientId,
        channel: 'in_app',
        eventType: 'document.requested',
        title: 'Document Requested',
        body: `${request.requestedBy.name} requested ${dto.documentType}`,
        status: 'sent',
        sentAt: new Date(),
      },
    });

    await this.prisma.auditLog.create({
      data: {
        organizationId: orgId,
        actorUserId: actorId,
        actionType: 'document.requested',
        entityType: 'document_request',
        entityId: request.id,
        metadata: { documentType: dto.documentType, clientId: dto.clientId },
      },
    });

    return request;
  }

  async getRequests(orgId: string, query: { clientId?: string; filingId?: string; status?: string; page?: number; limit?: number }) {
    const page = query.page || 1;
    const limit = query.limit || 25;
    const skip = (page - 1) * limit;

    const where: any = { organizationId: orgId, deletedAt: null };
    if (query.clientId) where.clientId = query.clientId;
    if (query.filingId) where.filingId = query.filingId;
    if (query.status) where.status = query.status;

    const [data, total] = await Promise.all([
      this.prisma.documentRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          client: { select: { id: true, displayName: true } },
          requestedBy: { select: { id: true, name: true } },
          documents: {
            where: { deletedAt: null },
            orderBy: { createdAt: 'desc' },
            select: { id: true, originalFilename: true, verificationStatus: true, createdAt: true },
          },
        },
      }),
      this.prisma.documentRequest.count({ where }),
    ]);

    return { data, meta: { page, limit, total } };
  }

  async upload(
    orgId: string,
    requestId: string,
    userId: string,
    file: Express.Multer.File,
  ) {
    const request = await this.prisma.documentRequest.findFirst({
      where: { id: requestId, organizationId: orgId, deletedAt: null },
    });
    if (!request) throw new NotFoundException('Document request not found');

    const storageKey = `${orgId}/${request.clientId}/${randomUUID()}${path.extname(file.originalname)}`;
    const uploadDir = path.join(process.cwd(), 'uploads', orgId, request.clientId);
    fs.mkdirSync(uploadDir, { recursive: true });
    fs.writeFileSync(path.join(uploadDir, path.basename(storageKey)), file.buffer);

    const doc = await this.prisma.document.create({
      data: {
        organizationId: orgId,
        clientId: request.clientId,
        requestId: request.id,
        filingId: request.filingId,
        uploadedById: userId,
        storageKey,
        originalFilename: file.originalname,
        mimeType: file.mimetype,
        fileSizeBytes: file.size,
        verificationStatus: 'pending_verification',
      },
    });

    await this.prisma.documentRequest.update({
      where: { id: requestId },
      data: { status: 'uploaded' },
    });

    await this.prisma.notification.create({
      data: {
        organizationId: orgId,
        recipientId: request.requestedById,
        channel: 'in_app',
        eventType: 'document.uploaded',
        title: 'Document Uploaded',
        body: `${file.originalname} has been uploaded`,
        status: 'sent',
        sentAt: new Date(),
      },
    });

    await this.prisma.auditLog.create({
      data: {
        organizationId: orgId,
        actorUserId: userId,
        actionType: 'document.uploaded',
        entityType: 'document',
        entityId: doc.id,
        metadata: { originalFilename: file.originalname, fileSize: file.size },
      },
    });

    return doc;
  }

  async verify(orgId: string, docId: string, dto: VerifyDocumentDto, actorId: string) {
    const doc = await this.prisma.document.findFirst({
      where: { id: docId, organizationId: orgId, deletedAt: null },
      include: { request: true },
    });
    if (!doc) throw new NotFoundException('Document not found');

    const newStatus = dto.status === 'approved' ? 'approved' : 'rejected';
    assertDocumentTransition(doc.verificationStatus as any, newStatus as any);

    const updated = await this.prisma.document.update({
      where: { id: docId },
      data: {
        verificationStatus: newStatus as any,
      },
    });

    if (doc.request) {
      await this.prisma.documentRequest.update({
        where: { id: doc.request.id },
        data: {
          status: newStatus as any,
          rejectionReason: dto.status === 'rejected' ? dto.rejectionReason : undefined,
        },
      });
    }

    await this.prisma.notification.create({
      data: {
        organizationId: orgId,
        recipientId: doc.clientId,
        channel: 'in_app',
        eventType: `document.${dto.status}`,
        title: `Document ${dto.status === 'approved' ? 'Approved' : 'Rejected'}`,
        body: `${doc.originalFilename} was ${dto.status === 'approved' ? 'approved' : 'rejected'}${dto.rejectionReason ? ': ' + dto.rejectionReason : ''}`,
        status: 'sent',
        sentAt: new Date(),
      },
    });

    if (dto.status === 'rejected' && doc.request) {
      await this.prisma.documentRequest.update({
        where: { id: doc.request.id },
        data: { status: 'requested' },
      });
    }

    await this.prisma.auditLog.create({
      data: {
        organizationId: orgId,
        actorUserId: actorId,
        actionType: `document.${dto.status}`,
        entityType: 'document',
        entityId: docId,
        metadata: { status: newStatus, rejectionReason: dto.rejectionReason },
      },
    });

    return updated;
  }

  async listDocuments(orgId: string, query: { clientId?: string; filingId?: string; status?: string; page?: number; limit?: number }) {
    const page = query.page || 1;
    const limit = query.limit || 25;
    const skip = (page - 1) * limit;

    const where: any = { organizationId: orgId, deletedAt: null };
    if (query.clientId) where.clientId = query.clientId;
    if (query.filingId) where.filingId = query.filingId;
    if (query.status) where.verificationStatus = query.status;

    const [data, total] = await Promise.all([
      this.prisma.document.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          client: { select: { id: true, displayName: true } },
          uploadedBy: { select: { id: true, name: true } },
          request: { select: { id: true, documentType: true } },
        },
      }),
      this.prisma.document.count({ where }),
    ]);

    return { data, meta: { page, limit, total } };
  }
}
