import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { BenefitTypeDTO, BenefitTypeMapper, BenefitTypeCreateDTO, BenefitTypeDeleteDTO } from './benefit-types.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BenefitTypeEntity } from './benefit-types.entity';
import { Repository } from 'typeorm';


@Injectable()
export class BenefitTypeService {
    constructor(
        @InjectRepository(BenefitTypeEntity)
        private readonly benefitTypeRepository: Repository<BenefitTypeEntity>,
    ) { };

    async get_all(): Promise<BenefitTypeDTO[]> {
        const benefitTypes = await this.benefitTypeRepository.find();
        if (!benefitTypes)
            throw new InternalServerErrorException('There is no benefits types yet');
        let benefitsTypesList = benefitTypes.map((u) => BenefitTypeMapper.toDTO(u));
        return benefitsTypesList;
    }

    async create(benefitType: BenefitTypeCreateDTO) {
        const newBenefitType = this.benefitTypeRepository.create(benefitType);
        return await this.benefitTypeRepository.save(newBenefitType);
    }

    async delete(benefitType: BenefitTypeDeleteDTO): Promise<boolean> {
        const result = await this.benefitTypeRepository.delete({ id_type: benefitType.id_type })
        if (!result) {
            throw new NotFoundException('El tipo de beneficio que se quiere borrar no fué encontrado')
        }
        return true;
    }

    async get_by_id(id_type: number): Promise<BenefitTypeEntity> {
        if (!id_type)
            throw new BadRequestException('Id is required');
        const type = await this.benefitTypeRepository.findOneBy({ id_type: id_type });
        if (!type)
            throw new NotFoundException('BenefitType not found');
        return type;
    }
}
