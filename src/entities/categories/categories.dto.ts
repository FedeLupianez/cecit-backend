import { CategoriesEntity } from './categories.entity';

export class CategoriesDTO {
    id_category?: number;
    name: string;
    icon_url: string;
    active?: boolean;
}

export class CategoriesMapper {
    static toDTO(category: CategoriesEntity): CategoriesDTO {
        return {
            id_category: category.id_category,
            name: category.name,
            icon_url: category.icon_url,
            active: category.active,
        };
    }
}
