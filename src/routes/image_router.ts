import { Router, Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import ImageResizer from '../misc/image_resizer';
import createError from 'http-errors';

const router = Router();

function getImage(req: Request, res: Response, next: NextFunction) {
	let image_path = path.join(ImageResizer.images_path, req.params.file_name);
	let resource_type = `image/${path.extname(image_path).substring(1)}`;
	// Check if the image exists first
	fs.exists(image_path, (exists) => {
		if (exists) {
			// If there's no size received , return the original image.
			if (!req.query.size) {
				fs.readFile(image_path, (err, image) => {
					if (err) next(err);
					res.type(resource_type);
					res.end(image, 'binary');
				});
			} else {
				let aspect: boolean = req.query.preserve_aspect === 'true';
				ImageResizer.resize(image_path, req.query.size, aspect)
					.then(result => { res.type(resource_type); res.end(result, 'binary') })
					.catch(err => next(createError('Cannot resize the image!')));
			}
		}
		else {
			next(createError(404, 'Image not found!'));
		}
	});
}


router.get('/:file_name', getImage);

export = router;