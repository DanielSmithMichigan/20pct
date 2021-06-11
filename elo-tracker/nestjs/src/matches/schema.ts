import { IsString, IsNumber, ArrayMaxSize, ArrayMinSize, Length, Min, Max } from 'class-validator';

export class MatchSchema {
    @IsString({ each: true })
    @ArrayMaxSize(2)
    @ArrayMinSize(2)
    @Length(36, 36, { each: true })
    players: string[];

    @IsNumber({}, { each: true })
    @Min(0, { each: true })
    @Max(0, { each: true })
    @ArrayMaxSize(2)
    @ArrayMinSize(2)
    scores: number[];
}