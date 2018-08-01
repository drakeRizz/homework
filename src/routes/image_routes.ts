import { Router, Request, Response, NextFunction } from 'express';
import fs from 'fs';
import process from 'process';
import { isNumber } from 'util';

const router = Router();
const images_path = process.env.IMAGES_PATH || '../images';
const sharp = require('sharp');

function getImage(req: Request, res: Response, next: NextFunction) {
	let image_path = images_path + '/' + req.params.file_name;
	fs.exists(image_path, (exists) => {
		if (exists) {
			processImage(image_path, req.query.size)
				.then(result => res.end(result))
				.catch(err => res.send(err));
		}
		else {
			res.sendStatus(404);
		}
	});
}

function get(req: Request, res: Response, next: NextFunction) {
	res.json({ message: 'This is just an API endpoint for images' });
}

function processImage(image: string, size?: string): Promise<Buffer> {
	console.log(image);
	if (size) {
		let [width, height] = size.split('x');
		if (isNumber(width) && isNumber(height))
			return sharp(image).resize(width, height).toBuffer();
		else
			throw new Error('Invalid size!');
	} else {
		return Promise.resolve(fs.readFileSync(image));
	}
}

router.get('/', get);
router.get('/:file_name', getImage);

export = router;