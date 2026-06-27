/*
 * Los archivos .service.ts son los encargados de interactuar con la base de datos para realizar
 * consultas y devolver los resultados de estas, pueden recibir argumentos para hacer consultas
 * que se ajusten a estos.
 * */

import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UsersDeleteDTO, UsersDTO, UsersMapper } from './users.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UsersEntity)
        private readonly userRepository: Repository<UsersEntity>,
    ) { };

    async get_by_user_id(partner_id: string): Promise<UsersEntity> {
        const user = await this.userRepository.findOneBy({ id_user: partner_id })
        if (!user) {
            throw new NotFoundException(`User does not exists`);
        }
        return user;
    }

    async get_all(): Promise<UsersDTO[]> {
        const users = await this.userRepository.find();
        if (!users)
            throw new InternalServerErrorException('Users is empty');
        // Cambio los usuarios al DTO
        let users_list = users.map((u) => UsersMapper.toDTO(u));
        return users_list;
    }


    async delete(user: UsersDeleteDTO): Promise<boolean> {
        const result = await this.userRepository.delete({ id_user: user.id_user })
        if (!result) {
            throw new NotFoundException('User not exists')
        }
        return true;
    }
}
