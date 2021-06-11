import { Body, Controller, Get, Param, Post, UseFilters, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Request, Response } from 'express';
import { CreatePlayerDto } from './dto';
import { PlayerSchema } from './schema';
import { SuccessResponse } from '../common/responses';
import { PlayersService } from './players.service';
import { HttpExceptionFilter } from '../common/error-handling';

@Controller('players')
export class PlayersController {
    constructor(private playersService : PlayersService) {}

    @Get(':playerId')
    async get(
        @Param('playerId') playerId: string
    ) : Promise<object> {
        const player = await this.playersService.getPlayer(playerId);
        if (null === player) {
            throw new NotFoundException();
        }
        return SuccessResponse({
            player
        });
    }

    @Post()
    @UseFilters(new HttpExceptionFilter())
    async create(@Body() createPlayerDto : CreatePlayerDto) {
        const player = await this.playersService.create(
            createPlayerDto
        );
        return SuccessResponse({
            player
        });
    }
}
