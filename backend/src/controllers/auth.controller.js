// external imports
import bcrypt from 'bcryptjs';

// internal imports
import cloudinary from '../config/cloudinary.js';
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
        const user = await User.findOne({ email }).lean();

        if (!user) {
            throw new ApiError(400, 'Invalid credentials');
        }

        // check if password is correct
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            throw new ApiError(400, 'Invalid credentials');
        }

        // generate jwt token and set cookie
        generateToken(user._id, res);

        // remove password from user object
        delete user.password;

        // send response
        return res
            .status(200)
            .json(new ApiResponse(200, user, 'Logged in successfully'));
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

// update avatar controller
export const updateAvatar = asyncHandler(async (req, res) => {
    try {
        // get user from request object
        const { avatar } = req.body;
        

        if (!avatar) {
            throw new ApiError(400, 'Avatar is required');
        }

        // get the user from request object
        const userId = req.user._id;

        // upload avatar to cloudinary
        const uploadedAvatar = await cloudinary.uploader.upload(avatar, {
            folder: 'varta/avatars',
            width: 500,
            crop: 'scale',
        });

        if (!uploadedAvatar) {
            throw new ApiError(500, 'Avatar could not be uploaded');
        }

        // update user avatar
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { avatar: uploadedAvatar.secure_url },
            { new: true }
        ).select('-password');

        // check if user updated
        if (!updatedUser) {
            throw new ApiError(500, 'Avatar could not be updated');
        }

        // send response
        return res
            .status(200)
            .json(
                new ApiResponse(200, updatedUser, 'Avatar updated successfully')
            );
    } catch (err) {
        throw new ApiError(
            err.statusCode || 500,
            err.message || 'Server Error'
        );
    }
});

// get user profile controller
export const getUser = asyncHandler(async (req, res) => {
    try {
        return res
            .status(200)
            .json(new ApiResponse(200, req.user, 'User details'));
    } catch (err) {
        throw new ApiError(
            err.statusCode || 500,
            err.message || 'Server Error'
        );
    }
});
