import path from 'path';
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import image_routes from './routes/image_routes';


// Creates and configures an ExpressJS web server.
class App {

	public app: express.Application;

	//Run configuration methods on the Express instance.
	constructor() {
		this.app = express();
		this.viewEngine();
		this.middleware();
		this.routes();
		this.errorHandlers();
	}

	//	Configure Express middleware.
	private middleware(): void {
		this.app.use(logger('dev'));
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: false }));

	}

	//	Configure API endpoints.
	private routes(): void {
		//this.app.use('/', index_routes);
		this.app.use('/image', image_routes);
	}
	private viewEngine(): void {
		this.app.set('views', path.join(__dirname, 'views'));
		this.app.set('view engine', 'pug')
		this.app.get('/', function (req, res) {
			res.render('index', { title: 'Image Resizer', message: 'Welcome! \n Please use /image endpoint to retrieve/resize an image.' });
		})
	}
	//	Set error handlers
	private errorHandlers(): void {
		// Handle 404
		this.app.use((_req, res) => {
			res.render('error', { title: 'Error :(', message: '404: Page not Found' });
		});

		// Handle 500
		this.app.use((_req, res, _next) => {
			res.render('error', { title: 'Error :(', message: '500: Internal Server Error' });
		});
	}

}

export default new App().app;