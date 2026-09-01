import { IsAlpha, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export interface jwt_payload {
    sub: string;
    email: string;
    role: string;
    jti?: string;
}

export interface RefreshTokenDTO {
    refresh_token: string;
    id_user: string;
}

export interface TokensInterface {
    access_token: string;
    refresh_token: string;
}

export class RefreshTokenSaveDTO {
    @IsEmail()
    @IsNotEmpty()
    email: string;
    @IsNotEmpty()
    token: string;
}

export class UpdateProfileDTO {
    process: 'PASSWD' | 'EMAIL';
    @IsEmail()
    @IsNotEmpty()
    email: string;
    @IsEmail()
    new_email?: string;
    @IsString()
    @IsNotEmpty()
    current_password: string;
    new_password?: string;
}
