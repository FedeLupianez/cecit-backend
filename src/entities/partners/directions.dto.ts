import { IsNotEmpty, IsString } from 'class-validator';

export class DirectionsCreateDTO {
    @IsNotEmpty()
    @IsString()
    id_partner: string;

    @IsNotEmpty()
    @IsString()
    direction: string;
}

export class DirectionsUpdateDTO {
    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    @IsString()
    direction: string;
}

export class DirectionsDeleteDTO {
    @IsNotEmpty()
    id: number;
}
