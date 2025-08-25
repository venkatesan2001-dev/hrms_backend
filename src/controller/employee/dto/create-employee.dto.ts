import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export enum Role {
  ADMIN = 'ADMIN',
  STANDARD = 'STANDARD',
}

class AddressDetail {
  @IsOptional()
  readonly address: string;

  @IsOptional()
  readonly country: string;

  @IsOptional()
  readonly state: string;

  @IsOptional()
  readonly city: string;

  @IsOptional()
  readonly zipcode: number;
}

export class CreateEmployeeDto {
  @IsNotEmpty()
  readonly first_name: string;

  @IsOptional()
  readonly last_name: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsOptional()
  readonly phone_number: string;

  @IsOptional()
  readonly address_detail: AddressDetail;

  @IsOptional()
  readonly status: boolean;

  @IsOptional()
  @IsEnum(Role)
  readonly role: string;
}

export class UpdateEmployeeDto {
  @IsOptional()
  readonly first_name: string;

  @IsOptional()
  readonly last_name: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsOptional()
  readonly phone_number: string;

  @IsOptional()
  readonly address_detail: AddressDetail;

  @IsOptional()
  readonly status: boolean;

  @IsOptional()
  @IsEnum(Role)
  readonly role: string;
}

export class GetState {
  @IsNotEmpty()
  readonly country_name: string;
}
