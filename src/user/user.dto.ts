/*
 * Los archivos .dto.ts son donde vamos a definir el tipo
 * de dato que vamos a retornar desde la API, de esta forma
 * podemos controlar qué datos se devuelven y cuáles no
 * */

export class UserDTO {
    id_user: number;
    email: string;
}
