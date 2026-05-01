/*
 * En los archivos .controller.ts es donde vamos a definir los 
 * endpoints de nuestra api. El string que se encuentra dentro 
 * de @Controler() es el camino que sigue la api para encontrar los endpoints.
 * Ej: /api/user/<endpoint>
 *
 * Cada función con decorador es un endpoint definido con su método,
 * el string que se encuentra dentro de los paréntesis es el nombre
 * de este.
 * En estas funciones casi siempre solo se deben de obtener los
 * queryparams en caso de que los pase por allí o los 
 * contenidos del body en caso del post, hacer verificaciones de seguridad, etc,
 * pero nunca se interactúa con la base de datos en este punto.
 * Posteriormente se usan las funciones definidas en el Service para que estas 
 * nos devuelvan los registros necesarios para la tarea.
 * Por último se manipulan los datos que nos devolvió el service
 * y retornamos.
 * */

import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
    constructor(private readonly userService: UsersService) { };

    @Get('all')
    get_all() {
        // Se llama al service para obtener los registros
        return this.userService.get_all();
    }

    @Get('byemail')
    get_by_email(@Query('email') email: string) {
        return this.userService.get_by_email(email);
    }
}
