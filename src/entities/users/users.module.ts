/*
 * En los archivos .module.ts vamos a registrar las entidades,
 * controllers, services y exports (estos en caso de que alguna
 * otra parte del sistema necesite usar el service de la tabla)
 * */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersEntity } from './users.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DbModule } from 'src/common/database/db.module';

@Module({
    imports: [TypeOrmModule.forFeature([UsersEntity]), DbModule],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService]
    // Ejemplo: Si se debe buscar el usuario que generó un beneficio desde la parte de Benefit, se necesita el Service de User.
})
export class UsersModule { }
