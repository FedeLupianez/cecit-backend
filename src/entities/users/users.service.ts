/*
 * Los archivos .service.ts son los encargados de interactuar con la base de datos para realizar
 * consultas y devolver los resultados de estas, pueden recibir argumentos para hacer consultas
 * que se ajusten a estos.
 * */

import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UsersCreateDTO, UsersDTO, UsersMapper } from './users.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UsersEntity)
        private readonly userRepository: Repository<UsersEntity>,
    ) { };

    async get_all(): Promise<UsersDTO[]> {
        const users = await this.userRepository.find();
        if (!users)
            throw new InternalServerErrorException('Users is empty');
        // Cambio los usuarios al DTO
        let users_list = users.map((u) => UsersMapper.toDTO(u));
        return users_list;
    }

    async get_by_email(email: string): Promise<UsersDTO | null> {
        const user = await this.userRepository.findOneBy({
            email
        })
        if (!user)
            throw new NotFoundException(`User with email ${email} not found`);
        return UsersMapper.toDTO(user);
    }

    async create(user: UsersCreateDTO) {
        const partner: UsersEntity | null = await this.userRepository.findOneBy({ id_user: user.id_user })

        if (!partner) {
            throw new NotFoundException('El usuario no es socio');
        }

        partner.email = user.email;
        // Falta encriptar la contraseña, en otra feature se agrega
        partner.password = user.password;
        return await this.userRepository.save(partner);
    }
}
