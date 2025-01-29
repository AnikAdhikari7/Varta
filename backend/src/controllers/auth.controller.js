// external imports
import bcrypt from 'bcryptjs';

// internal imports
import User from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { generateToken } from '../utils/jwt.js';

// signup controller
export const signup = asyncHandler(async (req, res) => {
    const { email, fullName, password } = req.body;

    if (!email || !fullName || !password) {
        throw new ApiError(400, 'Please provide all fields');
    } else if (
        [email, fullName, password].some((field) => field.trim() === '')
    ) {
        throw new ApiError(400, 'Fields cannot be empty');
    } else if (password.length < 6 || password.length > 50) {
        throw new ApiError(400, 'Password must be between 6 and 50 characters');
    }

    try {
        // check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new ApiError(400, 'User already exists');
        }

        // hash the password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // create new user
        const newUser = await User.create({
            email,
            fullName,
            password: hashPassword,
        });

        // check if user created
        if (!newUser) {
            throw new ApiError(500, 'User could not be created');
        } else {
            // generate jwt token and set cookie
            generateToken(newUser._id, res);

            // remove password from user object
            const userWithoutPassword = newUser.toObject();
            delete userWithoutPassword.password;

            // send response
            return res
                .status(201)
                .json(
                    new ApiResponse(
                        200,
                        userWithoutPassword,
                        'User created successfully'
                    )
                );
        }
    } catch (err) {
        throw new ApiError(
            err.statusCode || 500,
            err.message || 'Server Error'
        );
    }
});

// login controller
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, 'Please provide email and password');
    } else if ([email, password].some((field) => field.trim() === '')) {
        throw new ApiError(400, 'Fields cannot be empty');
    } else if (password.length < 6 || password.length > 50) {
        throw new ApiError(400, 'Password must be between 6 and 50 characters');
    }

    try {
        // check if user exists
        const existingUser = await User.findOne({ email }).lean();

        if (!existingUser) {
            throw new ApiError(400, 'Invalid credentials');
        }

        // check if password is correct
        const isPasswordCorrect = await bcrypt.compare(
            password,
            existingUser.password
        );

        if (!isPasswordCorrect) {
            throw new ApiError(400, 'Invalid credentials');
        }

        // generate jwt token and set cookie
        generateToken(existingUser._id, res);

        // remove password from user object
        delete existingUser.password;

        // send response
        return res
            .status(200)
            .json(new ApiResponse(200, existingUser, 'Logged in successfully'));
    } catch (err) {
        throw new ApiError(
            err.statusCode || 500,
            err.message || 'Server Error'
        );
    }
});

// logout controller
export const logout = asyncHandler(async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
        });
        
        return res
            .status(200)
            .json(new ApiResponse(200, null, 'Logged out successfully'));
    } catch (err) {
        throw new ApiError(
            err.statusCode || 500,
            err.message || 'Server Error'
        );
    }
});
