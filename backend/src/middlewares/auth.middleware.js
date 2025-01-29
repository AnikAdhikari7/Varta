// external imports
import jwt from 'jsonwebtoken';

// internal imports
import User from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

const verifyToken = asyncHandler(async (req, _, next) => {
    try {
        // get token from cookies or authorization header
        const token =
            req.cookies?.token ||
            req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new ApiError(401, 'Unauthorized - No token provided');
        }

        // verify token
        const decodedToken = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

        if (!decodedToken) {
            throw new ApiError(401, 'Unauthorized - Invalid token');
        }

        // find user
        const user = await User.findById(decodedToken?.userId).select(
            '-password'
        );

        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        // set user in request object
        req.user = user;

        // call next middleware
        next();
    } catch (err) {
        throw new ApiError(
            err.statusCode || 500,
            err.message || 'Internal server error'
        );
    }
});

export default verifyToken;
