import { IsString, IsOptional } from 'class-validator';

export class CreateDocumentRequestDto {
  @IsString()
  clientId: string;

  @IsOptional()
  @IsString()
  filingId?: string;

  @IsString()
  documentType: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  dueAt?: string;
}

export class VerifyDocumentDto {
  @IsString()
  status: 'approved' | 'rejected';

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
