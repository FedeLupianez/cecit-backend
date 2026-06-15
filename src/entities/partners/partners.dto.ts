import { IsNotEmpty, IsString } from "class-validator";
import { PartnersAdminsCreateDTO } from "../partnersadmins/partnersadmins.dto";

export interface PartnersDTO {
    id_partner: string;
    name: string;
    logo: string;
    direction: string;
    active: boolean;
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
