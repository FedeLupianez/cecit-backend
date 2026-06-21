/*
 * Los archivos .dto.ts son donde vamos a definir el tipo
 * de dato que vamos a retornar desde la API, de esta forma
 * podemos controlar qué datos se devuelven y cuáles no
 * */

import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { UsersEntity } from "./users.entity";

export interface UsersDTO {
    id_user: string;
    email: string;
    name: string;
    dni: string;
    lastname: string;
    last_activity: Date;
}

export class UsersCreateDTO {
    @IsNotEmpty()
    id_user: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}

export interface UsersDeleteDTO {
    id_user: string;
}

export class UserLoginDTO {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}

export class ByEmailDTO {
    @IsNotEmpty()
    @IsEmail()
    email: string;
}

export class UsersMapper {
    static toDTO(user: UsersEntity): UsersDTO {
        return {
            id_user: user.id_user,
            email: user.email,
            dni: user.dni,
            name: user.name,
            lastname: user.lastname,
            last_activity: user.last_activity
        }
    }
}
