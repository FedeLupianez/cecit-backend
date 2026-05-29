import { BenefitsEntity } from "./benefits.entity";


export interface BenefitsDTO {
    id_benefit: string;
    id_admin: string;
    id_partner: string;
    admin: string;
    partner: string;
    date_entered: string;
    start_date: string;
    end_date: string;
    image: string;
    title: string;
    description: string;
    id_type: string;
    type: string;
    status: string;
    coupons: number;
    max_cupouns: number;
}

export interface BenefitsCreateDTO {
    id_admin: string;
    id_partner: string;
    id_type: string;
    date_entered: string;
    start_date: string;
    end_date: string;
    image: string;
    title: string;
    description: string;
    coupons: number;
}

export interface BenefitsDeleteDTO {
    id_benefit: string;
}

export class BenefitsMapper {
    static toDTO(benefit: BenefitsEntity): BenefitsDTO {
        return {
            id_benefit: benefit.id_benefit,
            id_admin: benefit.id_admin,
            id_partner: benefit.id_partner,
            admin: benefit.admin.id_c_admin,
            partner: benefit.partner.id_partner,
            date_entered: benefit.date_entered,
            start_date: benefit.start_date,
            end_date: benefit.end_date,
            image: benefit.image,
            title: benefit.title,
            description: benefit.description,
            id_type: benefit.id_type,
            type: benefit.type.id_type,
            status: benefit.status,
            coupons: benefit.coupons,
            max_cupouns: benefit.max_cupouns
        }
    }
}
