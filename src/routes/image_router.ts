import { NextFunction, Request, Response, Router } from 'express';
import fs from 'fs';
import createError from 'http-errors';
import path from 'path';
import ImageResizer from '../misc/image_resizer';

const router = Router();

function getImage(req: Request, res: Response, next: NextFunction) {
	const imagePath = path.join(ImageResizer.imagesPath, req.params.file_name);
	const resourceType = `image/${path.extname(imagePath).substring(1)}`;
	// Check if the image exists first
	fs.exists(imagePath, (exists) => {
		if (exists) {
			// If there's no size received , return the original image.
			if (!req.query.size) {
				fs.readFile(imagePath, (err, image) => {
					if (err) { next(err); }
					res.type(resourceType);
					res.end(image, 'binary');
				});
			} else {
				const aspect: boolean = req.query.preserve_aspect === 'true';
				ImageResizer.resize(imagePath, req.query.size, aspect)
					.then(result => { res.type(resourceType); res.end(result, 'binary'); })
					.catch(err => next(createError(err)));
			}
		} else {
			next(createError(404, 'Image not found!'));
		}
	});
}

router.get('/:file_name', getImage);

export = router;
