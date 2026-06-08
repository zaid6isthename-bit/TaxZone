import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto, UpdateClientDto, AssignClientDto } from './dto/create-client.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { RequirePermissions } from '../../common/require-permissions.decorator';
import { CurrentUser } from '../../common/current-user.decorator';

@Controller('clients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @Post()
  @RequirePermissions('clients:read_all')
  async create(@Body() dto: CreateClientDto, @CurrentUser() user: any) {
    return this.clientsService.create(dto, user.organizationId, user.id);
  }

  @Get()
  async findAll(
    @CurrentUser() user: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('assignedEmployeeId') assignedEmployeeId?: string,
  ) {
    const isEmployee = user.userType === 'employee' || user.userType === 'ca_reviewer';
    return this.clientsService.findAll(user.organizationId, {
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      search,
      status,
      assignedEmployeeId: isEmployee ? user.id : assignedEmployeeId,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.clientsService.findOne(user.organizationId, id);
  }

  @Patch(':id')
  @RequirePermissions('clients:read_all')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateClientDto,
    @CurrentUser() user: any,
  ) {
    return this.clientsService.update(user.organizationId, id, dto, user.id);
  }

  @Post(':id/assign')
  @RequirePermissions('clients:assign')
  async assign(
    @Param('id') id: string,
    @Body() dto: AssignClientDto,
    @CurrentUser() user: any,
  ) {
    return this.clientsService.assign(user.organizationId, id, dto, user.id);
  }

  @Delete(':id')
  @RequirePermissions('clients:read_all')
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.clientsService.remove(user.organizationId, id, user.id);
  }
}
