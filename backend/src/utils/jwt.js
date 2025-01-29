// external imports
import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {
    // generate jwt token
    const token = jwt.sign({ userId }, process.env.JWT_TOKEN_SECRET, {
        expiresIn: process.env.JWT_TOKEN_EXPIRY,
    });

    // cookie options
    const options = {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        httpOnly: true, // cookie cannot be accessed by client side scripts, prevents XSS attacks
        sameSite: 'strict', // cookie is not sent on cross-origin requests, mitigates CSRF attacks
        secure: process.env.NODE_ENV === 'production',
    };

    // set cookie
    res.cookie('token', token, options);

    return token;
};
