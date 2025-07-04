import HttpStatusCodes from '@src/common/HttpStatusCodes';
import { NextFunction, Response } from 'express';

const getDynamicPath = (dynamicPath: string) => {
    return async (req: any, res: Response, next: NextFunction) => {
        try {
            req.dynamicPath = dynamicPath;
            return next();
        } catch (error) {
            return res
                .status(HttpStatusCodes.BAD_REQUEST)
                .json({ error: error.message });
        }
    };
};

export {getDynamicPath}