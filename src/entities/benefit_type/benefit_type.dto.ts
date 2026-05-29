import { BenefitTypeEntity } from "./benefit_type.entity";

export interface BenefitTypeDTO {
    id_type: string;
    name: string;
}

export interface BenefitTypeCreateDTO {
    id_type: string;
    name: string;
    active: boolean;
}

export interface BenefitTypeDeleteDTO {
    id_type: string
}

export class BenefitTypeMapper {
    static toDTO(benefit_type: BenefitTypeEntity): BenefitTypeDTO {
        return {
            id_type: benefit_type.id_type,
            name: benefit_type.name,
        }
    }
}
