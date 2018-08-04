import { Router, Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import ImageResizer from '../misc/image_resizer';

const router = Router();
const image_resizer = new ImageResizer();

function getImage(req: Request, res: Response, next: NextFunction) {

	let image_path = path.join(image_resizer.images_path, req.params.file_name);
	res.type(`image/${path.extname(image_path).substring(1)}`);
	// Check if the image exists first
	fs.exists(image_path, (exists) => {
		if (exists) {
			// If there's no size received , return the original image.
			if (!req.query.size) {
				fs.readFile(image_path, (err, image) => {
					if (err) next(err);
					res.end(image, 'binary');
				});
			} else {
				let aspect: boolean = req.query.preserve_aspect === 'true';
				image_resizer.resize(image_path, req.query.size, aspect)
					.then(result => res.end(result, 'binary'))
					.catch(err => next(err));
			}
		}
		else {
			res.render('error', { message: '404: Page not Found' });
		}
	});
}

function getStats(req: Request, res: Response) {
	res.render('stats', {
		title: 'Stats',
		message: 'This is an API endpoint for images. It also provides some quick stats.',
		stats: image_resizer.stats
	});
}

router.get('/', getStats);
router.get('/:file_name', getImage);

export = router;