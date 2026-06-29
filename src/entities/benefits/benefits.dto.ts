import { BenefitsEntity } from "./benefits.entity";


export interface BenefitsDTO {
    id_benefit: string;
    id_admin: string;
    id_partner: string;
    date_entered: Date;
    start_date: Date;
    end_date: Date;
    image: string;
    title: string;
    description: string;
    id_type: number;
    status: string;
    coupons: number;
    max_coupons: number;
}

export interface BenefitsCreateDTO {
    id_admin: string;
    id_partner: string;
    id_type: number;
    start_date: Date;
    end_date: Date;
    image: string;
    title: string;
    description: string;
    coupons: number;
    max_coupons: number;
}

export interface BenefitsDeleteDTO {
    id_benefit: string;
}

export interface BenefitsReturn {
    id_benefit: string;
    id_admin: string;
    id_partner: string;
    type: string;
    categories: string[];
    start_date: Date;
    end_date: Date;
    image: string;
    title: string;
    description: string;
    coupons: number;
    max_coupons: number;
}

export class BenefitsMapper {
    static toDTO(benefit: BenefitsEntity): BenefitsDTO {
        return {
            id_benefit: benefit.id_benefit,
            id_admin: benefit.id_admin,
            id_partner: benefit.id_partner,
            date_entered: benefit.date_entered,
            start_date: benefit.start_date,
            end_date: benefit.end_date,
            image: benefit.image,
            title: benefit.title,
            description: benefit.description,
            id_type: benefit.id_type,
            status: benefit.status,
            coupons: benefit.coupons,
            max_coupons: benefit.max_coupons
        }
    }
}
