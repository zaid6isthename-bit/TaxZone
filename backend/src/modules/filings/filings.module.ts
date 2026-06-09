import { Module } from '@nestjs/common';
import { FilingsController } from './filings.controller';
import { FilingsService } from './filings.service';
import { WorkflowModule } from '../workflow/workflow.module';

@Module({
  imports: [WorkflowModule],
  controllers: [FilingsController],
  providers: [FilingsService],
  exports: [FilingsService],
})
export class FilingsModule {}
