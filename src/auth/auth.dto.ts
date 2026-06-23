import type { ConsumerType } from "src/consumer/consumer.service";
import { CecitAdminsCreateDTO } from "src/entities/cecit-admins/cecit-admins.dto";
import { PartnersAdminsCreateDTO } from "src/entities/partnersadmins/partnersadmins.dto";
import { UsersCreateDTO } from "src/entities/users/users.dto";

export interface jwt_payload {
    sub: string;
    email: string;
    jti?: string;
}

export interface RefreshTokenDTO {
    refresh_token: string;
    id_user: string;
}

export interface RegisterDTO {
    user_type: ConsumerType;
    data: UsersCreateDTO | CecitAdminsCreateDTO | PartnersAdminsCreateDTO
}
