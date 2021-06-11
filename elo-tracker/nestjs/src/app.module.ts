import { Module } from '@nestjs/common';
import { PlayersController } from './players/players.controller';
import { PlayersService } from './players/players.service';
import { MatchesController } from './matches/matches.controller';
import { MatchesService } from './matches/matches.service';

@Module({
	imports: [],
	controllers: [PlayersController, MatchesController],
	providers: [PlayersService, MatchesService],
})
export class AppModule {}
