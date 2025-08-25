import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  readonly employee_id: string;

  @IsNotEmpty()
  readonly password: string;
}

export class ForgotPasswordDto {
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  readonly redirect_url: string;
}

export class ResetPasswordParamsDto {
  @IsNotEmpty()
  readonly id: string;

  @IsNotEmpty()
  readonly token: string;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  readonly password: string;
}

export class ChnagePasswordDto {
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  readonly old_password: string;

  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  readonly new_password: string;
}
