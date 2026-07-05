import { IsEmail, IsNotEmpty } from "class-validator";

export enum AccountRole {
    USER = 'USER',
    CECIT_ADMIN = 'CECIT_ADMIN',
    PARTNER_ADMIN = 'PARTNER_ADMIN'
};

export class AccountCreateDTO {
    @IsNotEmpty()
    id_user: string;
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @IsNotEmpty()
    password: string;
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
