import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuditModule } from './modules/audit/audit.module';
import { ClientsModule } from './modules/clients/clients.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { FilingsModule } from './modules/filings/filings.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { WorkflowModule } from './modules/workflow/workflow.module';
import { SearchModule } from './modules/search/search.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { MobileModule } from './modules/mobile/mobile.module';
import { SupabaseModule } from './modules/supabase/supabase.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { RolesGuard } from './modules/auth/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    AuditModule,
    ClientsModule,
    DocumentsModule,
    FilingsModule,
    TasksModule,
    NotificationsModule,
    WorkflowModule,
    SearchModule,
    EmployeesModule,
    MobileModule,
    SupabaseModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
