import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { AuditModule } from './modules/audit/audit.module';
import { ClientsModule } from './modules/clients/clients.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { FilingsModule } from './modules/filings/filings.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { WorkflowModule } from './modules/workflow/workflow.module';

@Module({
  imports: [
    AuthModule,
    AuditModule,
    ClientsModule,
    DocumentsModule,
    FilingsModule,
    NotificationsModule,
    WorkflowModule,
  ],
})
export class AppModule {}

