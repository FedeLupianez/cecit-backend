export interface jwt_payload {
    sub: string;
    email: string;
    jti?: string;
}

export interface RefreshTokenDTO {
    refresh_token: string;
}
