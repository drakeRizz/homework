import path from 'path';
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import image_routes from './routes/image_routes';
import createError from 'http-errors';

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
		this.app.use(express.static(path.join(__dirname, 'public')));

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
			res.render('index', { title: 'Image Resizer', message: '\n Please use /image endpoint to retrieve/resize an image.' });
		})
	}

	//	Set error handlers
	private errorHandlers(): void {
		// catch 404 and forward to error handler
		this.app.use(function (req, res, next) {
			next(createError(404));
		});

		// error handler
		this.app.use(function (err: any, req: any, res: any, next: any) {
			// set locals, only providing error in development
			res.locals.message = err.message;
			res.locals.error = req.app.get('env') === 'development' ? err : {};

			// render the error page
			res.status(err.status || 500);
			res.render('error');
		});
	}

}

export default new App().app;