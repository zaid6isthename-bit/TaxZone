import { IsString, IsDateString, IsOptional, IsEnum } from 'class-validator';

export class CreateFilingDto {
  @IsString()
  clientId: string;

  @IsString()
  category: string;

  @IsDateString()
  periodStart: string;

  @IsDateString()
  periodEnd: string;

  @IsDateString()
  dueAt: string;

  @IsOptional()
  @IsString()
  assignedEmployeeId?: string;
}

export class UpdateFilingStatusDto {
  @IsString()
  status: string;
}
