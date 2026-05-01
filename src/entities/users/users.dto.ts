/*
 * Los archivos .dto.ts son donde vamos a definir el tipo
 * de dato que vamos a retornar desde la API, de esta forma
 * podemos controlar qué datos se devuelven y cuáles no
 * */

export class UsersDTO {
    id_user: number;
    email: string;
    name: string;
    dni: string;
    lastname: string;
    last_activity: string;
}
