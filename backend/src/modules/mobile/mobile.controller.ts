import { Controller, Get, Post, Param, NotFoundException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { CurrentUser } from '../../common/current-user.decorator';
import { PrismaService } from '../../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';

@Controller('mobile')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MobileController {
  constructor(
    private prisma: PrismaService,
    private supabase: SupabaseService,
  ) {}

  private async resolveClient(userId: string) {
    const client = await this.prisma.client.findFirst({
      where: { userId, deletedAt: null },
    });
    if (!client) {
      throw new NotFoundException('Client profile not found');
    }
    return client;
  }

  @Get('dashboard')
  async getDashboard(@CurrentUser() user: any) {
    const client = await this.resolveClient(user.id);

    const pendingDocs = await this.prisma.documentRequest.count({
      where: { clientId: client.id, status: 'requested', deletedAt: null },
    });

    const filings = await this.prisma.filing.findMany({
      where: { clientId: client.id, deletedAt: null },
      orderBy: { dueAt: 'asc' },
      take: 5,
    });

    const totalFilings = filings.length;
    const completedFilings = filings.filter((f: any) => f.status === 'completed' || f.status === 'filed').length;
    const filingProgress = totalFilings > 0 ? Math.round((completedFilings / totalFilings) * 100) : 0;

    const actions = filings
      .filter((f: any) => f.status !== 'completed' && f.status !== 'filed')
      .map((f: any) => ({
        id: f.id,
        title: `${f.category} filing`,
        description: `Due ${f.dueAt.toLocaleDateString()}`,
        dueLabel: `Due ${f.dueAt.toLocaleDateString()}`,
      }));

    return {
      title: `Welcome back, ${user.name || 'User'}`,
      summary: `You have ${actions.length} pending compliance actions.`,
      pendingDocuments: String(pendingDocs),
      filingProgress: `${filingProgress}%`,
      actions,
      consultant: {
        name: 'TaxZone Team',
        role: 'Tax Compliance',
        lastUpdate: filings.length > 0 ? `${filings.length} active filings` : 'No active filings',
      },
    };
  }

  @Get('documents')
  async getDocuments(@CurrentUser() user: any) {
    const client = await this.resolveClient(user.id);

    const requests = await this.prisma.documentRequest.findMany({
      where: { clientId: client.id, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: {
        documents: { where: { deletedAt: null } },
      },
    });

    return {
      documents: requests.map((r: any) => ({
        id: r.id,
        name: r.documentType,
        status: r.status === 'approved' ? 'Approved' : r.status === 'rejected' ? 'Rejected' : r.status === 'uploaded' ? 'Uploaded' : 'Pending upload',
        description: r.description || `Required document: ${r.documentType}`,
      })),
    };
  }

  @Post('documents/:id/upload-intent')
  async uploadIntent(@Param('id') id: string, @CurrentUser() user: any) {
    const client = await this.resolveClient(user.id);

    const request = await this.prisma.documentRequest.findFirst({
      where: { id, clientId: client.id, deletedAt: null },
    });
    if (!request) {
      throw new NotFoundException('Document request not found');
    }

    const storagePath = `${user.organizationId || 'none'}/clients/${client.id}/requests/${id}/${Date.now()}`;

    let signedUploadUrl: string | null = null;
    try {
      const { data, error } = await this.supabase.storage
        .from('taxzone-documents')
        .createSignedUploadUrl(storagePath);
      if (data && !error) signedUploadUrl = data.signedUrl;
    } catch {}

    return {
      documentId: id,
      uploadUrl: `${process.env.PUBLIC_API_BASE_URL || 'http://localhost:4000'}/api/v1/documents/requests/${id}/upload`,
      supabaseUploadUrl: signedUploadUrl,
      supabaseStoragePath: storagePath,
      expiresIn: 3600,
    };
  }

  @Get('filings')
  async getFilings(@CurrentUser() user: any) {
    const client = await this.resolveClient(user.id);

    const filings = await this.prisma.filing.findMany({
      where: { clientId: client.id, deletedAt: null },
      orderBy: { dueAt: 'asc' },
      include: {
        docRequests: {
          where: { deletedAt: null },
          include: { documents: true },
        },
      },
    });

    return {
      filings: filings.map((f: any) => ({
        heading: f.category,
        description: `${f.periodStart.toLocaleDateString()} - ${f.periodEnd.toLocaleDateString()}`,
        stages: [
          { title: 'Documents uploaded', status: f.docRequests.every((dr: any) => dr.status === 'approved') ? 'Complete' : 'Pending', complete: f.docRequests.every((dr: any) => dr.status === 'approved') },
          { title: 'Under Review', status: f.status === 'documents_under_review' || f.status === 'in_progress' ? 'In Progress' : 'Pending', complete: f.status === 'completed' || f.status === 'filed' },
          { title: 'Filed', status: f.status === 'filed' || f.status === 'completed' ? 'Complete' : 'Pending', complete: f.status === 'completed' },
        ],
      })),
    };
  }

  @Get('notifications')
  async getNotifications(@CurrentUser() user: any) {
    const notifications = await this.prisma.notification.findMany({
      where: { recipientId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return {
      notifications: notifications.map((n: any) => ({
        id: n.id,
        title: n.title,
        body: n.body,
        createdAt: n.createdAt.toISOString(),
      })),
    };
  }

  @Post('notifications/:id/read')
  async markRead(@Param('id') id: string, @CurrentUser() user: any) {
    await this.prisma.notification.updateMany({
      where: { id, recipientId: user.id },
      data: { readAt: new Date(), status: 'read' },
    });
    return { message: 'Notification marked as read' };
  }

  @Get('profile')
  async getProfile(@CurrentUser() user: any) {
    const client = await this.prisma.client.findFirst({
      where: { userId: user.id, deletedAt: null },
    });

    return {
      name: user.name || 'User',
      organization: client?.businessType || 'TaxZone client',
      verificationSummary: 'Email verified\nPhone verified',
      businessSummary: client ? `PAN: ${client.pan || 'N/A'}\nGSTIN: ${client.gstin || 'N/A'}` : 'No business details',
    };
  }
}
