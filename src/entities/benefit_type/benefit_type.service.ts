import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { BenefitTypeDTO, BenefitTypeMapper, BenefitTypeCreateDTO, BenefitTypeDeleteDTO } from './benefit_type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BenefitTypeEntity } from './benefit_type.entity';
import { Repository } from 'typeorm';


@Injectable()
export class BenefitTypeService {
    constructor(
        @InjectRepository(BenefitTypeEntity)
        private readonly benefit_typeRepository: Repository<BenefitTypeEntity>,
    ) { };

    async get_all(): Promise<BenefitTypeDTO[]> {
        const benefit_type = await this.benefit_typeRepository.find();
        if (!benefit_type)
            throw new InternalServerErrorException('There is no benefits types yet');
        let benefits_types_list = benefit_type.map((u) => BenefitTypeMapper.toDTO(u));
        return benefits_types_list;
    }

    async create(benefit_type: BenefitTypeCreateDTO) {
        const newBenefitType = this.benefit_typeRepository.create(benefit_type);
        return await this.benefit_typeRepository.save(newBenefitType);
    }

    async delete(benefit_type: BenefitTypeDeleteDTO): Promise<boolean> {
        const result = await this.benefit_typeRepository.delete({ id_type: benefit_type.id_type })
        if (!result) {
            throw new NotFoundException('El tipo de beneficio que se quiere borrar no fué encontrado')
        }
        return true;
    }

    async get_by_id(id_type: number): Promise<BenefitTypeEntity> {
        if (!id_type)
            throw new BadRequestException('Id is required');
        const type = await this.benefit_typeRepository.findOneBy({ id_type: id_type });
        if (!type)
            throw new NotFoundException('BenefitType not found');
        return type;
    }
}
