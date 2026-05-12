/*
 * Los archivos .dto.ts son donde vamos a definir el tipo
 * de dato que vamos a retornar desde la API, de esta forma
 * podemos controlar qué datos se devuelven y cuáles no
 * */

import { UsersEntity } from "./users.entity";

export interface UsersDTO {
    id_user: string;
    email: string;
    name: string;
    dni: string;
    lastname: string;
    last_activity: string;
}

export interface UsersCreateDTO {
    id_user: string;
    email: string;
    password: string;
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
