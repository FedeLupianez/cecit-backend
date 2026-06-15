import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { PartnersAdminsEntity } from "./partnersadmins.entity";

export interface PartnersAdminsDTO {
    id_p_admin: string;
    id_partner: string;
    email: string;
    active: boolean;
};

export class PartnersAdminsCreateDTO {
    partner: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}

export class PartnersAdminsMapper {
    static toDTO(admin: PartnersAdminsEntity): PartnersAdminsDTO {
        return {
            id_p_admin: admin.id_p_admin,
            id_partner: admin.id_partner,
            email: admin.email,
            active: admin.active
        }
    }
}
