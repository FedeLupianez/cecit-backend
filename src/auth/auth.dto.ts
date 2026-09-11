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

export interface ProfilePayload {
    user_id: string;
    email: string;
    role: string;
}

// Respuesta del refresh: incluye el perfil para que el cliente no necesite
// un segundo request a GET /auth/profile.
export interface RefreshResult extends TokensInterface {
    profile: ProfilePayload;
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
