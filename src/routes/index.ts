import express, { Request, Response, NextFunction } from 'express';
const router = express.Router();
import path from 'path';

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    return res.sendFile(path.join(__dirname, '../../src/views/index.html'));
});

export default router;