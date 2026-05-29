import { Injectable } from '@nestjs/common';
import { PartnersDTO } from './partners.dto';
import { PartnersEntity } from './partners.entity';
import { PartnersMapper } from './partners.mapper';

@Injectable()
export class PartnersService {

    create(dto: PartnersDTO): PartnersEntity {
        const entity = PartnersMapper.dtoToEntity(dto);

        return entity;
    }

    remove(id: string): string {
        return `Partner ${id} deleted`;
    }
}