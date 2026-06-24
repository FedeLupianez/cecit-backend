import { IsEmail, IsString } from "class-validator";

export interface Consumer {
    id_consumer: string;
    email: string;
    password: string;
    id_partner?: string;
    dni?: string;
    name?: string;
    lastname?: string;
}

export class ConsumerGet {
    @IsString()
    id_consumer?: string;
    @IsEmail()
    email?: string;
}
