import { Request, Response, Router } from 'express';
import ImageResizer from '../misc/image_resizer';

const router = Router();

function getStats(req: Request, res: Response) {
	res.render('stats', {
		message: 'This is an API endpoint for images. It also provides some quick stats.',
		stats: ImageResizer.stats,
		title: 'Stats',
	});
}

router.get('/', getStats);

export = router;
