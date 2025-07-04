import { Response, NextFunction } from 'express';
import Users from '@src/models/user.model';
import jwt from 'jsonwebtoken';

const isAuthenticated = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { authorization } = req.headers;
        if (!authorization)
            return res.status(401).json({ error: 'Unauthorized' });

        const token = authorization.split(' ')[1];

        const payload = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET || 'falbackaccesssecret'
        );
        // console.log({ payload });

        /** This is done here so that we don't have to REPEATEDLY find user by id in the calling controller.
         * We can directly check if req.user exists or not
         */
        req.payload = payload;
        const user = await Users.findById(req?.payload?.userId);
        if (user) {
            req.user = user;
        }

        return next();
    } catch (error) {
        return res.status(401).json({ error: error.message });
    }
};

const isAdmin = (req: any, res: Response, next: NextFunction) => {
    try {
        const { role } = req.payload;
        if (role !== 'admin')
            return res
                .status(403)
                .json({ error: 'Access denied. You need to be an Admin' });
        return next();
    } catch (error) {
        return res.status(401).json({ error: error.message });
    }
};

export { isAuthenticated, isAdmin };