import { IsNotEmpty, IsString, IsUrl } from "class-validator";
import { PartnersAdminsCreateDTO } from "../partnersadmins/partnersadmins.dto";

export interface PartnersDTO {
    id_partner: string;
    name: string;
    logo: string;
    direction: string;
    active: boolean;
}

export class PartnersUpdateLogoDTO {
    @IsNotEmpty()
    id_partner: string;
    @IsNotEmpty()
    @IsUrl()
    new_logo: string;
}


export class PartnersUpdateNameDTO {
    @IsNotEmpty()
    id_partner: string;
    @IsNotEmpty()
    @IsUrl()
    new_name: string;
}

export class PartnersCreateDTO extends PartnersAdminsCreateDTO {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsString()
    logo: string;

    @IsString()
    direction: string;
}
