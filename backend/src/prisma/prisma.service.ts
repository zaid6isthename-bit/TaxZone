import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PrismaModel } from './prisma-model';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  supabase: SupabaseClient;

  user = null as any;
  organization = null as any;
  client = null as any;
  filing = null as any;
  documentRequest = null as any;
  document = null as any;
  notification = null as any;
  auditLog = null as any;
  task = null as any;
  employeeProfile = null as any;
  internalNote = null as any;
  role = null as any;
  permission = null as any;
  rolePermission = null as any;
  userRole = null as any;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    this.user = new PrismaModel('users', this.supabase);
    this.organization = new PrismaModel('organizations', this.supabase);
    this.client = new PrismaModel('clients', this.supabase);
    this.filing = new PrismaModel('filings', this.supabase);
    this.documentRequest = new PrismaModel('document_requests', this.supabase);
    this.document = new PrismaModel('documents', this.supabase);
    this.notification = new PrismaModel('notifications', this.supabase);
    this.auditLog = new PrismaModel('audit_logs', this.supabase);
    this.task = new PrismaModel('tasks', this.supabase);
    this.employeeProfile = new PrismaModel('employee_profiles', this.supabase);
    this.internalNote = new PrismaModel('internal_notes', this.supabase);
    this.role = new PrismaModel('roles', this.supabase);
    this.permission = new PrismaModel('permissions', this.supabase);
    this.rolePermission = new PrismaModel('role_permissions', this.supabase);
    this.userRole = new PrismaModel('user_roles', this.supabase);
  }

  async onModuleInit() {}

  async onModuleDestroy() {}
}
