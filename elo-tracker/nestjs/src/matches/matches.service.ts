import { Injectable } from '@nestjs/common';
import { PlayerSchema } from 'src/players/schema';
import { learningRate } from '../common/config';

function transformedRating(rating) {
    return Math.pow(10, rating / 400);
}

@Injectable()
export class MatchesService {
    calculateExpectedScore( player : PlayerSchema, opposingPlayer : PlayerSchema ) : number {
        const playerRating = transformedRating(player.elo);
        const opposingPlayerRating = transformedRating(opposingPlayer.elo);
        return playerRating / (playerRating + opposingPlayerRating);
    }
    calculateRatingAdjustment( players : [PlayerSchema, PlayerSchema], scores : [number, number] ) : [number, number] {
        const actualScorePlayerOne = scores[0] / scores.reduce((a, b) => a+b, 0);
        const expectedScorePlayerOne = this.calculateExpectedScore(players[0], players[1]);
        const adjustmentPlayerOne = Math.round(learningRate * (actualScorePlayerOne - expectedScorePlayerOne));
        return [ adjustmentPlayerOne, -adjustmentPlayerOne ];
    }
}
