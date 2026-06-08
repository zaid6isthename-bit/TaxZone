import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FilingsService } from './filings.service';
import { CreateFilingDto, UpdateFilingStatusDto } from './dto/create-filing.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { RequirePermissions } from '../../common/require-permissions.decorator';
import { CurrentUser } from '../../common/current-user.decorator';

@Controller('filings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FilingsController {
  constructor(private filingsService: FilingsService) {}

  @Post()
  @RequirePermissions('filings:read')
  async create(@Body() dto: CreateFilingDto, @CurrentUser() user: any) {
    return this.filingsService.create(dto, user.organizationId, user.id);
  }

  @Get()
  async findAll(
    @CurrentUser() user: any,
    @Query('clientId') clientId?: string,
    @Query('status') status?: string,
    @Query('category') category?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const isEmployee = user.userType === 'employee' || user.userType === 'ca_reviewer';
    return this.filingsService.findAll(user.organizationId, {
      clientId,
      status,
      category,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      assignedEmployeeId: isEmployee ? user.id : undefined,
    });
  }

  @Get('stats')
  async getDashboardStats(@CurrentUser() user: any) {
    return this.filingsService.getDashboardStats(user.organizationId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.filingsService.findOne(user.organizationId, id);
  }

  @Patch(':id/status')
  @RequirePermissions('filings:update_status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateFilingStatusDto,
    @CurrentUser() user: any,
  ) {
    return this.filingsService.updateStatus(user.organizationId, id, dto, user.id);
  }
}
