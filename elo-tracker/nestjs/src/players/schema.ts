import { IsString, IsNumber, Length } from 'class-validator';
export class PlayerSchema {
    @IsString()
    @Length(0, 36)
    name: string;

    @IsNumber()
    elo: number;
}