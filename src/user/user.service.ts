/*
 * Los archivos .service.ts son los encargados de interactuar con la base de datos para realizar
 * consultas y devolver los resultados de estas, pueden recibir argumentos para hacer consultas
 * que se ajusten a estos.
 * */

import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UserDTO } from './user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity'; // Se importa la entidad, la que define cómo es la tabla
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) { };

    async get_all(): Promise<UserDTO[]> {
        const users = await this.userRepository.find();
        if (!users)
            throw new InternalServerErrorException('Users is empty');
        return users;
    }

    async get_by_email(email: string): Promise<UserDTO | null> {
        const user = await this.userRepository.findOneBy({
            email
        })
        if (!user)
            throw new NotFoundException(`User with email ${email} not found`);
        return user;
    }
}
