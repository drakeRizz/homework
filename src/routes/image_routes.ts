import { Router, Request, Response } from 'express';
import fs from 'fs';

import ImageResizer from '../misc/image_resizer';

const router = Router();

const image_resizer = new ImageResizer();

function getImage(req: Request, res: Response) {
	res.type('image/*');
	let image_path = image_resizer.images_path + '\\' + req.params.file_name;
	fs.exists(image_path, (exists) => {
		if (exists) {
			let aspect: boolean = req.query.preserve_aspect === 'true';
			image_resizer.resize(image_path, req.query.size, aspect)
				.then(result => res.end(result, 'binary'))
				.catch(err => { res.type('json'); res.json('An error occured while resizing the image: ' + err) });
		}
		else {
			res.sendStatus(404);
		}
	});
}

function getStats(req: Request, res: Response) {
	res.json({ message: 'This is just an API endpoint for images', stats: image_resizer.stats });
}

router.get('/', getStats);
router.get('/:file_name', getImage);

export = router;