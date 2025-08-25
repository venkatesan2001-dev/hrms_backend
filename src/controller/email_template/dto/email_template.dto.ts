import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateEmailTemplateDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly subject: string;

  @IsNotEmpty()
  readonly content: string;
}

export class UpdateEmailTemplateDto {
  @IsNotEmpty()
  readonly name: string;

  @IsOptional()
  readonly subject: string;

  @IsOptional()
  readonly content: string;
}
