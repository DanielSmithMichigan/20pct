import { Controller, Post, Body } from '@nestjs/common';
import { SuccessResponse } from '../common/responses';
import { PlayersService } from '../players/players.service';
import { MatchesService } from './matches.service';
import { ReportMatchDto } from './dto';
import { MatchSchema } from './schema';

@Controller('matches')
export class MatchesController {
    constructor(private playersService : PlayersService, private matchesService : MatchesService ) {}

    @Post()
    async create(@Body() reportMatchDto : ReportMatchDto) {
        console.log(reportMatchDto)
        const playerOne = await this.playersService.getPlayer(reportMatchDto.players[0]);
        const playerTwo = await this.playersService.getPlayer(reportMatchDto.players[1]);

        const [ playerOneEloAdjustment, playerTwoEloAdjustment ] = this.matchesService.calculateRatingAdjustment(
            [ playerOne, playerTwo ],
            [ reportMatchDto.scores[0], reportMatchDto.scores[1] ]
        )

        playerOne.elo += playerOneEloAdjustment;
        playerTwo.elo += playerTwoEloAdjustment;

        const [ playerOneUpdated, playerTwoUpdated ] = await Promise.all([
            this.playersService.update(playerOne),
            this.playersService.update(playerTwo),
        ]);
        
        return SuccessResponse({
            players: [ playerOneUpdated, playerTwoUpdated ],
            adjustments: [ playerOneEloAdjustment, playerTwoEloAdjustment ]
        });
    }
}
