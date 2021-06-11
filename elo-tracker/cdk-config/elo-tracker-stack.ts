import * as cdk from '@aws-cdk/core';

import { PlayersTable } from './players-table';
import { NestJsLambda } from './nestjs';

export class EloTrackerStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const playersTable = PlayersTable( this );
    const nestJsLambda = NestJsLambda( this, playersTable );

    const outputs = new cdk.CfnOutput(this, 'playersTableNameExport', {
      value: playersTable.tableName,
      exportName: 'playersTableName',
    });
  }
}
