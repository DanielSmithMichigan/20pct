import { IsString, Length } from 'class-validator';

export class CreatePlayerDto {
    @IsString()
    @Length(0, 36)
    name: string;
}