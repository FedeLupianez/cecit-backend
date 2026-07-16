import { PartnersDTO } from './partners.dto';
import { PartnersEntity } from './partners.entity';

export class PartnersMapper {
    static dtoToEntity(dto: PartnersDTO): PartnersEntity {
        const entity = new PartnersEntity();

        entity.id_partner = dto.id_partner;
        entity.name = dto.name.toLowerCase();
        entity.logo = dto.logo;
        entity.direction = dto.direction;
        entity.active = dto.active;

        return entity;
    }

    static entityToDto(entity: PartnersEntity): PartnersDTO {
        return {
            id_partner: entity.id_partner,
            name: entity.name,
            logo: entity.logo,
            direction: entity.direction,
            active: entity.active,
        };
    }
}
