import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CecitAdminsEntity } from './cecit-admins.entity';
import { Repository } from 'typeorm';
import { CecitAdminsDTO } from './cecit-admins.dto';

@Injectable()
export class CecitAdminsService {
    constructor(
        @InjectRepository(CecitAdminsEntity)
        private readonly cecitAdminsRepository: Repository<CecitAdminsEntity>
    ) { };

    async get_all(): Promise<CecitAdminsDTO[]> {
        const admins = await this.cecitAdminsRepository.find();
        if (!admins)
            throw new InternalServerErrorException('Admins is empty');
        return admins;
    }

}
