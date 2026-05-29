import { BenefitTypeEntity } from "./benefit_type.entity";

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
    static toDTO(benefit_type: BenefitTypeEntity): BenefitTypeDTO {
        return {
            id_type: benefit_type.id_type,
            name: benefit_type.name,
        }
    }
}
