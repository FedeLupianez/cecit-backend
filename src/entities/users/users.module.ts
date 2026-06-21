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
import { CecitAdminsModule } from 'src/entities/cecit-admins/cecit-admins.module';

@Module({
    imports: [TypeOrmModule.forFeature([UsersEntity]), CecitAdminsModule],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService]
})
export class UsersModule { }
