import { Stack } from '@aws-cdk/core';
import * as core from "@aws-cdk/core";
import * as dynamodb from '@aws-cdk/aws-dynamodb';

export function PlayersTable( scope : Stack ) {
    return new dynamodb.Table(scope, 'PlayersTable', {
        partitionKey: { name: 'playerId', type: dynamodb.AttributeType.STRING },
        billingMode: dynamodb.BillingMode.PAY_PER_REQUEST
    });
}