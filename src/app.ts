import path from 'path';
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import index_routes from './routes/index_routes';
import image_routes from './routes/image_routes';

// Creates and configures an ExpressJS web server.
class App {

	public express: express.Application;

	//Run configuration methods on the Express instance.
	constructor() {
		this.express = express();
		this.middleware();
		this.routes();
	}

	// Configure Express middleware.
	private middleware(): void {
		var dir = path.join(__dirname, 'images');
		this.express.use(express.static(dir));
		this.express.use(logger('dev'));
		this.express.use(bodyParser.json());
		this.express.use(bodyParser.urlencoded({ extended: false }));
	}

	// Configure API endpoints.
	private routes(): void {
		this.express.use('/', index_routes);
		this.express.use('/image', image_routes);
	}

}

export default new App().express;