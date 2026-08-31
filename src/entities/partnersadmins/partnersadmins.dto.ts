import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { PartnersAdminsEntity } from './partnersadmins.entity';

export interface PartnersAdminsDTO {
    id_admin: string;
    id_partner: string;
}

export class PartnersAdminsCreateDTO {
    @IsNotEmpty()
    partner_name: string;

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
            id_admin: admin.id_account,
            id_partner: admin.id_partner,
        };
    }
}
