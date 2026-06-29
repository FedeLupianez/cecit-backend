/*
 * En los archivos .module.ts vamos a registrar las entidades,
 * controllers, services y exports (estos en caso de que alguna
 * otra parte del sistema necesite usar el service de la tabla)
 * */

import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersEntity } from './users.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AccountsModule } from '../accounts/accounts.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([UsersEntity]), AccountsModule, forwardRef(() => AuthModule)],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService]
})
export class UsersModule { }
