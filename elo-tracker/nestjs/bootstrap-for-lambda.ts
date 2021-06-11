// lambda.ts
import { Handler, Context } from 'aws-lambda';
import { Server } from 'http';
import { createServer, proxy } from 'aws-serverless-express';
import { createApp } from './src/main';

const express = require('express');

// NOTE: If you get ERR_CONTENT_DECODING_FAILED in your browser, this is likely
// due to a compressed response (e.g. gzip) which has not been handled correctly
// by aws-serverless-express and/or API Gateway. Add the necessary MIME types to
// binaryMimeTypes below
const binaryMimeTypes: string[] = [];

let cachedServer: Server;

async function bootstrapServer(): Promise<void> {
    const expressApp = express();
    const nestApp = await createApp({
        lambdaConfiguration: {
            expressApp
        }
    });
    await nestApp.init();
    cachedServer = createServer(expressApp, undefined, binaryMimeTypes);
}

export const handler: Handler = async (event: any, context: Context) => {
    if (!cachedServer) {
        await bootstrapServer();
    }
    return proxy(cachedServer, event, context, 'PROMISE').promise;
}