import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { BenefitTypeDTO, BenefitTypeMapper, BenefitTypeCreateDTO, BenefitTypeDeleteDTO } from './benefit_type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BenefitTypeEntity } from './benefit_type.entity';
import { Repository } from 'typeorm';
import { DbService } from 'src/common/database/db.service';


@Injectable()
export class BenefitTypeService {
    constructor(
        @InjectRepository(BenefitTypeEntity)
        private readonly benefit_typeRepository: Repository<BenefitTypeEntity>,
        private readonly db_service: DbService
    ) { };

    async get_all(): Promise<BenefitTypeDTO[]> {
        const benefit_type = await this.benefit_typeRepository.find();
        if (!benefit_type)
            throw new InternalServerErrorException('There is no benefits types yet');
        let benefits_types_list = benefit_type.map((u) => BenefitTypeMapper.toDTO(u));
        return benefits_types_list;
    }

    async create(benefit_type: BenefitTypeCreateDTO) {
        const new_id = await this.db_service.get_new_id('BenefitType', 'id_type');
        const newBenefitType = new BenefitTypeEntity()

        if (!new_id) {
            throw new InternalServerErrorException('No se pudo generar el tipo de beneficio');
        }
        newBenefitType.id_type = new_id;
        newBenefitType.name = benefit_type.name
        newBenefitType.active = benefit_type.active
        return await this.benefit_typeRepository.save(newBenefitType);
    }

    async delete(benefit_type: BenefitTypeDeleteDTO): Promise<boolean> {
        const result = await this.benefit_typeRepository.delete({ id_type: benefit_type.id_type })
        if (!result) {
            throw new NotFoundException('El tipo de beneficio que se quiere borrar no fué encontrado')
        }
        return true;
    }
}
