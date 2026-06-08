import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { RequirePermissions } from '../../common/require-permissions.decorator';
import { CurrentUser } from '../../common/current-user.decorator';

@Controller('employees')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployeesController {
  constructor(private employeesService: EmployeesService) {}

  @Post()
  @RequirePermissions('admin:manage_users')
  async create(@Body() dto: { email: string; name: string; phone?: string; department?: string; userType: string }, @CurrentUser() user: any) {
    return this.employeesService.create(dto, user.organizationId, user.id);
  }

  @Get()
  @RequirePermissions('admin:manage_users')
  async findAll(
    @CurrentUser() user: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('department') department?: string,
  ) {
    return this.employeesService.findAll(user.organizationId, {
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      department,
    });
  }

  @Get(':id')
  @RequirePermissions('admin:manage_users')
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.employeesService.findOne(user.organizationId, id);
  }

  @Delete(':id')
  @RequirePermissions('admin:manage_users')
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.employeesService.remove(user.organizationId, id, user.id);
  }
}
