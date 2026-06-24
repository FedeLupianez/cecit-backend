import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CecitAdminsService } from 'src/entities/cecit-admins/cecit-admins.service';
import { PartnersAdminsService } from 'src/entities/partnersadmins/partnersadmins.service';
import { UsersService } from 'src/entities/users/users.service';
import type { Consumer, ConsumerGet } from './consumer.dto';
import { CecitAdminsCreateDTO, CecitAdminsMapper } from 'src/entities/cecit-admins/cecit-admins.dto';
import { PartnersAdminsCreateDTO, PartnersAdminsMapper } from 'src/entities/partnersadmins/partnersadmins.dto';
import { UsersCreateDTO, UsersMapper } from 'src/entities/users/users.dto';
import { DbService } from 'src/common/database/db.service';

export enum ConsumerType {
    USER = 'USER',
    PARTNER_ADMIN = 'PARTNER_ADMIN',
    CECIT_ADMIN = 'CECIT_ADMIN'
}

@Injectable()
export class ConsumerService {
    constructor(
        private readonly cecitAdminsService: CecitAdminsService,
        private readonly partnerAdminsService: PartnersAdminsService,
        private readonly usersService: UsersService,
        private readonly dbService: DbService
    ) { }

    async get_consumer(consumer: ConsumerGet): Promise<Consumer> {
        if (!consumer.id_consumer && !consumer.email)
            throw new BadRequestException('Data is empty');
        if (!consumer.id_consumer && consumer.email)
            return this.dbService.get_user_email(consumer.email);
        if (!consumer.email && consumer.id_consumer)
            return this.dbService.get_user_id(consumer.id_consumer);
        throw new NotFoundException('User not found');
    }

    async create(userType: ConsumerType, data: UsersCreateDTO | PartnersAdminsCreateDTO | CecitAdminsCreateDTO): Promise<Consumer> {
        if (userType == ConsumerType.USER) {
            const newUser = data as UsersCreateDTO;
            const user = await this.usersService.create(newUser);
            if (!user)
                throw new InternalServerErrorException('Error creating new User');
            return UsersMapper.toConsumer(user);
        }

        if (userType == ConsumerType.PARTNER_ADMIN) {
            const newUser = data as PartnersAdminsCreateDTO;
            const user = await this.partnerAdminsService.create(newUser);
            if (!user)
                throw new InternalServerErrorException('Error creating new User');
            return PartnersAdminsMapper.toConsumer(user);
        }

        if (userType == ConsumerType.CECIT_ADMIN) {
            const newUser = data as CecitAdminsCreateDTO;
            const user = await this.cecitAdminsService.create(newUser);
            if (!user)
                throw new InternalServerErrorException('Error creating new User');
            return CecitAdminsMapper.toConsumer(user);
        }
        throw new BadRequestException('User type not valid');
    }
}
