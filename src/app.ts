import path from 'path';
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import index_routes from './routes/index_routes';
import image_routes from './routes/image_routes';


// Creates and configures an ExpressJS web server.
class App {

	public app: express.Application;

	//Run configuration methods on the Express instance.
	constructor() {
		this.app = express();
		this.middleware();
		this.routes();
	}

	// Configure Express middleware.
	private middleware(): void {
		this.app.use(logger('dev'));
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: false }));
	}

	// Configure API endpoints.
	private routes(): void {
		this.app.use('/', index_routes);
		this.app.use('/image', image_routes);
	}

}

export default new App().app;