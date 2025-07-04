import jwt from 'jsonwebtoken';
import crypto from 'crypto';

function hashToken(token: string) {
    return crypto.createHash('sha512').update(token).digest('hex');
}

const generateAccessToken = (payload: any) => {
    return jwt.sign(
        {
            userId: payload._id,
            //   role: payload.role,
            email: payload.email,
            mobile: payload.mobile,
            firstname: payload.firstName
        },
        process.env.JWT_ACCESS_SECRET || 'fallbackjwtsecret',
        {
            expiresIn: '1d'
        }
    );
};

const generateRefreshToken = (payload: any, jti: string) => {
    return jwt.sign(
        {
            userId: payload._id,
            mobile: payload.mobile,
            email: payload.email,
            firstname: payload.firstName,
            jti
        },
        process.env.JWT_REFRESH_SECRET || 'fallbackjwtrefreshsecret'
        // {
        //   expiresIn: "8h",
        // }
    );
};

const generateTokens = (payload: any, jti: string) => {
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload, jti);
    return {
        accessToken,
        refreshToken
    };
};

export {
    generateTokens,
    generateAccessToken,
    generateRefreshToken,
    hashToken,
};
