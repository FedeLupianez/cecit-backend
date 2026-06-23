import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CecitAdminsService } from 'src/entities/cecit-admins/cecit-admins.service';
import { PartnersAdminsService } from 'src/entities/partnersadmins/partnersadmins.service';
import { UsersService } from 'src/entities/users/users.service';
import type { Consumer, ConsumerGet } from './consumer.dto';
import { CecitAdminsCreateDTO, CecitAdminsMapper } from 'src/entities/cecit-admins/cecit-admins.dto';
import { PartnersAdminsCreateDTO, PartnersAdminsMapper } from 'src/entities/partnersadmins/partnersadmins.dto';
import { UsersCreateDTO, UsersMapper } from 'src/entities/users/users.dto';

export enum ConsumerType {
    USER,
    PARTNER_ADMIN,
    CECIT_ADMIN
}

@Injectable()
export class ConsumerService {
    constructor(
        private readonly cecitAdminsService: CecitAdminsService,
        private readonly partnerAdminsService: PartnersAdminsService,
        private readonly usersService: UsersService
    ) { }

    async get_consumer(consumer: ConsumerGet): Promise<Consumer> {
        if (!consumer.id_consumer)
            throw new BadRequestException('Id is required');

        try {
            const cecitadmin = await this.cecitAdminsService.get_by_id(consumer.id_consumer);
            return CecitAdminsMapper.toConsumer(cecitadmin);
        } catch { }

        try {
            const partnerAdmin = await this.partnerAdminsService.get_by_id(consumer.id_consumer);
            return PartnersAdminsMapper.toConsumer(partnerAdmin);
        } catch { }

        try {
            const user = await this.usersService.get_by_user_id(consumer.id_consumer);
            return UsersMapper.toConsumer(user);
        } catch { }

        throw new NotFoundException('User not found');
    }

    async get_by_email(consumer: ConsumerGet): Promise<Consumer> {
        if (!consumer.email)
            throw new BadRequestException('Email is required');
        try {
            const cecitAdmin = await this.cecitAdminsService.get_by_email(consumer.email);
            return CecitAdminsMapper.toConsumer(cecitAdmin);
        } catch { }

        try {
            const partnerAdmin = await this.partnerAdminsService.get_by_email(consumer.email);
            return PartnersAdminsMapper.toConsumer(partnerAdmin);
        } catch { }

        try {
            const user = await this.usersService.get_by_email(consumer.email);
            return UsersMapper.toConsumer(user);
        } catch { }

        throw new NotFoundException('User not found');
    }

    async create(userType: ConsumerType, data: UsersCreateDTO | PartnersAdminsCreateDTO | CecitAdminsCreateDTO): Promise<boolean> {
        if (userType == ConsumerType.USER) {
            const newUser = data as UsersCreateDTO;
            const user = await this.usersService.create(newUser);
            if (!user)
                throw new InternalServerErrorException('Error creating new User');
            return true;
        }

        if (userType == ConsumerType.PARTNER_ADMIN) {
            const newUser = data as PartnersAdminsCreateDTO;
            const user = await this.partnerAdminsService.create(newUser);
            if (!user)
                throw new InternalServerErrorException('Error creating new User');
            return true;
        }

        if (userType == ConsumerType.CECIT_ADMIN) {
            const newUser = data as CecitAdminsCreateDTO;
            const user = await this.cecitAdminsService.create(newUser);
            if (!user)
                throw new InternalServerErrorException('Error creating new User');
            return true;
        }
        throw new BadRequestException('User type not valid');
    }
}
