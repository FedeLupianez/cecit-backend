export class PartnersCategoriesDto {
    id_partner: string;
    id_category: number;
}

export class PartnersCategoriesReturn {
    id_partner: string;
    partner: string;
    id_categories: string[];
    categories: string[];
}
