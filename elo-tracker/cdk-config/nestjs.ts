import * as path from 'path';
import { Stack } from '@aws-cdk/core';

import * as core from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as iam from '@aws-cdk/aws-iam';
import * as apigateway from '@aws-cdk/aws-apigateway';
import { Table } from '@aws-cdk/aws-dynamodb';


export function NestJsLambda(scope : Stack, playersTable : Table) {
    const role = new iam.Role(scope, 'Role', {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    
    role.addToPolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: [playersTable.tableArn],
        actions: ['dynamodb:PutItem', 'dynamodb:Query', 'dynamodb:GetItem', 'dynamodb:DeleteItem']
    }));

    role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole"));

    const nestJsLambda = new lambda.Function(scope, 'NestJsLambdaHandler', {
        runtime: lambda.Runtime.NODEJS_10_X,
        code: lambda.Code.fromAsset('nestjs'),
        handler: 'dist/bootstrap-for-lambda.handler',
        role,
        environment: {
            PLAYERS_TABLE_NAME: playersTable.tableName
        },
        timeout: core.Duration.seconds(25)
    });

    const nestJsApi = new apigateway.LambdaRestApi(scope, 'nest-js-api', {
        handler: nestJsLambda,
        proxy: false,
        restApiName: 'NestJs Api'
    });

    const playersResource = nestJsApi.root.addResource('players');
    playersResource.addMethod('POST');

    const playerResource = playersResource.addResource('{playerId+}');
    playerResource.addMethod('GET');
}