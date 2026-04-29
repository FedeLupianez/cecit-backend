/*
 * En los archivos .module.ts vamos a registrar las entidades,
 * controllers, services y exports (estos en caso de que alguna
 * otra parte del sistema necesite usar el service de la tabla)
 * */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
    // Ejemplo: Si se debe buscar el usuario que generó un beneficio desde la parte de Benefit, se necesita el Service de User.
})
export class UserModule { }
