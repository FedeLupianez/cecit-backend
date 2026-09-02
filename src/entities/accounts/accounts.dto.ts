import {
    IsBoolean,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';

export enum AccountRole {
    USER = 'USER',
    CECIT_ADMIN = 'CECIT_ADMIN',
    PARTNER_ADMIN = 'PARTNER_ADMIN'
}

export class AccountCreateDTO {
    @IsNotEmpty()
    id_user: string;
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
    id_user: string;
    email: string;
    password: string;
    last_activity: string;
    active: string;
}

export interface AccountsDTO {
    id_user: string;
    email: string | null;
    role: AccountRole;
    active: boolean;
    last_activity: Date;
    name: string;
    lastname: string;
    dni: string;
}

export class AccountsUpdateDTO {
    @IsNotEmpty()
    id_user: string;

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
