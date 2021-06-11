import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { eventContext } from 'aws-serverless-express/middleware';

async function bootstrap() {
    const app = await createApp();
	await app.listen(3000);
}
export async function createApp( options : any = {}  ) {
	// has to be undefined, not null
	let adapter = null;
	if (options.lambdaConfiguration) {
		adapter = new ExpressAdapter(options.lambdaConfiguration.expressApp);
	}
	const app = await NestFactory.create(
		AppModule,
		adapter || undefined
	);
	if (options.lambdaConfiguration) {
    	app.use(eventContext());
	}
	app.useGlobalPipes(new ValidationPipe({
		forbidUnknownValues: true,
		whitelist: true
	}));
	return app;
}
if (require.main === module) {
	bootstrap();
}
