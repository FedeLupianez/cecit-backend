import { IsEmail, IsNotEmpty } from 'class-validator';

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
