/*
 * Los archivos .service.ts son los encargados de interactuar con la base de datos para realizar
 * consultas y devolver los resultados de estas, pueden recibir argumentos para hacer consultas
 * que se ajusten a estos.
 * */

import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UsersCreateDTO, UsersDeleteDTO, UsersDTO, UsersMapper } from './users.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';
import { hash } from 'argon2';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UsersEntity)
        private readonly userRepository: Repository<UsersEntity>,
    ) { };

    async get_by_user_id(partner_id: string): Promise<UsersDTO> {
        const user = await this.userRepository.findOneBy({ id_user: partner_id })
        if (!user) {
            throw new NotFoundException(`User does not exists`);
        }
        return UsersMapper.toDTO(user);
    }

    async get_all(): Promise<UsersDTO[]> {
        const users = await this.userRepository.find();
        if (!users)
            throw new InternalServerErrorException('Users is empty');
        // Cambio los usuarios al DTO
        let users_list = users.map((u) => UsersMapper.toDTO(u));
        return users_list;
    }

    async get_by_email(email: string): Promise<UsersEntity> {
        if (!email)
            throw new BadRequestException('Email is not valid');
        const user = await this.userRepository.findOneBy({
            email
        })
        if (!user)
            throw new NotFoundException('User not found');
        return user;
    }

    async create(user: UsersCreateDTO) {
        if (!user.email || !user.password || !user.id_user) {
            throw new BadRequestException('Data incomplete');
        }
        const new_user = await this.userRepository.findOneBy({ id_user: user.id_user });
        if (!new_user) {
            throw new NotFoundException('User is not partner');
        }
        if (new_user.email) {
            throw new BadRequestException('The user already exists');
        }
        new_user.email = user.email;
        new_user.password = await hash(user.password);
        await this.userRepository.save(new_user);
        return new_user;
    }

    async delete(user: UsersDeleteDTO): Promise<boolean> {
        const result = await this.userRepository.delete({ id_user: user.id_user })
        if (!result) {
            throw new NotFoundException('User not exists')
        }
        return true;
    }
}
