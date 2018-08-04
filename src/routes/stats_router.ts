import { Router, Request, Response } from 'express';
import ImageResizer from '../misc/image_resizer';

const router = Router();

function getStats(req: Request, res: Response) {
	res.render('stats', {
		title: 'Stats',
		message: 'This is an API endpoint for images. It also provides some quick stats.',
		stats: ImageResizer.stats
	});
}

router.get('/', getStats);

export = router;