/*
 * Los archivos .dto.ts son donde vamos a definir el tipo
 * de dato que vamos a retornar desde la API, de esta forma
 * podemos controlar qué datos se devuelven y cuáles no
 * */

import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { UsersEntity } from './users.entity';

export interface UsersDTO {
    id_user: string;
    name: string;
    dni: string;
    last_name: string;
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

export class UsersMapper {
    static toDTO(user: UsersEntity): UsersDTO {
        return {
            id_user: user.id_user,
            dni: user.dni,
            name: user.name,
            last_name: user.lastname,
        };
    }
}
