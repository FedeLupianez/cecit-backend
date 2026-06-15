import { IsNotEmpty, IsString, IsUrl, IsEmail } from "class-validator";

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
    @IsString()
    new_name: string;
}

export class PartnersCreateDTO {

    @IsNotEmpty()
    partner_name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsUrl()
    logo: string;

    @IsString()
    direction: string;
}
