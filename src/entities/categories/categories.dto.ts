import { CategoriesEntity } from './categories.entity';

export class CategoriesDTO {
    name: string;
    icon_url: string;
    active?: boolean;
}

export class CategoriesMapper {
    static toDTO(category: CategoriesEntity): CategoriesDTO {
        return {
            name: category.name,
            icon_url: category.icon_url,
            active: category.active,
        };
    }
}
