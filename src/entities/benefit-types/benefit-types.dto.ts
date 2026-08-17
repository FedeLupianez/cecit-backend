import { BenefitTypeEntity } from './benefit-types.entity';

export interface BenefitTypeDTO {
    id_type: number;
    name: string;
}

export interface BenefitTypeCreateDTO {
    name: string;
    active: boolean;
}

export interface BenefitTypeDeleteDTO {
    id_type: number;
}

export class BenefitTypeMapper {
    static toDTO(benefitType: BenefitTypeEntity): BenefitTypeDTO {
        return {
            id_type: benefitType.id_type,
            name: benefitType.name,
        };
    }
}
