import { Router, Request, Response, NextFunction } from 'express';

let router = Router();

function welcome(req: Request, res: Response, next: NextFunction) {
	res.json({ message: 'This is an image resizer node server application' });
}

router.get('/', welcome);

export = router;