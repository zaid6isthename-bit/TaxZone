import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { CreateDocumentRequestDto, VerifyDocumentDto } from './dto/create-request.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { RequirePermissions } from '../../common/require-permissions.decorator';
import { CurrentUser } from '../../common/current-user.decorator';

@Controller('documents')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Post('requests')
  @RequirePermissions('documents:request')
  async createRequest(@Body() dto: CreateDocumentRequestDto, @CurrentUser() user: any) {
    return this.documentsService.createRequest(dto, user.organizationId, user.id);
  }

  @Get('requests')
  async getRequests(
    @CurrentUser() user: any,
    @Query('clientId') clientId?: string,
    @Query('filingId') filingId?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.documentsService.getRequests(user.organizationId, {
      clientId, filingId, status,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    });
  }

  @Post('requests/:id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Param('id') requestId: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
  ) {
    if (!file) throw new Error('File is required');
    if (file.size > 10 * 1024 * 1024) throw new Error('File too large (max 10MB)');
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
    if (!allowedTypes.includes(file.mimetype)) throw new Error('Invalid file type');

    return this.documentsService.upload(user.organizationId, requestId, user.id, file);
  }

  @Patch(':id/verify')
  @RequirePermissions('documents:review')
  async verify(
    @Param('id') id: string,
    @Body() dto: VerifyDocumentDto,
    @CurrentUser() user: any,
  ) {
    return this.documentsService.verify(user.organizationId, id, dto, user.id);
  }

  @Get()
  async listDocuments(
    @CurrentUser() user: any,
    @Query('clientId') clientId?: string,
    @Query('filingId') filingId?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.documentsService.listDocuments(user.organizationId, {
      clientId, filingId, status,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    });
  }
}
