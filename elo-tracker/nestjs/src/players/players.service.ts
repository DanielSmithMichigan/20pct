import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PlayerSchema } from './schema';
import { CreatePlayerDto } from './dto';
import { v4 as uuidv4 } from 'uuid';

import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import * as AWS from 'aws-sdk';

import { defaultElo } from '../common/config';

AWS.config.update({
	region: 'us-west-2'
})

const documentClient = new DocumentClient();

function isPlayerSchema( obj : any ) : obj is PlayerSchema {
    if (typeof obj !== 'object') {
        return false;
    }
    return true;
}

@Injectable()
export class PlayersService {
    async getPlayer( playerId: string ) : Promise<PlayerSchema|null> {
        const result = await documentClient.get({
            TableName: process.env.PLAYERS_TABLE_NAME,
            Key: {
                playerId
            }
        }).promise();

        if (!result.Item) {
            return null;
        }

        if (!isPlayerSchema(result.Item)) {
            throw new InternalServerErrorException("Malformed player object returned from database");
        }

        return result.Item;
    }

    async create( createPlayerDto : CreatePlayerDto ) : Promise<PlayerSchema> {
        const player = Object.assign({
            playerId: uuidv4(),
            elo: defaultElo
        }, createPlayerDto);
        await documentClient.put({
            TableName: process.env.PLAYERS_TABLE_NAME,
            Item: player
        }).promise();
        return player;
    }

    async update( createPlayerDto : CreatePlayerDto ) : Promise<PlayerSchema> {
        return this.create( createPlayerDto );
    }
}
