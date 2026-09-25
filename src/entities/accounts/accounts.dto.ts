import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export enum AccountRole {
  USER = 'USER',
  CECIT_ADMIN = 'CECIT_ADMIN',
  PARTNER_ADMIN = 'PARTNER_ADMIN',
}

export class AccountCreateDTO {
  @IsNotEmpty()
  id_account: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
  role: AccountRole;
}

export class LoginDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
}

export interface Account {
  id_account: string;
  email: string;
  password: string;
  last_activity: string;
  active: string;
}

export interface AccountsDTO {
  id_account: string;
  email: string | null;
  role: AccountRole;
  active: boolean;
  name: string;
  lastname: string;
  dni: string;
}

export class UpdateRoleDTO {
  @IsNotEmpty()
  @IsString()
  id_account: string;

  @IsNotEmpty()
  @IsEnum(AccountRole)
  newRole: AccountRole;

  @IsOptional()
  @IsString()
  id_partner?: string;
}

export class AccountsUpdateDTO {
  @IsNotEmpty()
  id_account: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
