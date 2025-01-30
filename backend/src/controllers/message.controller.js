// internal imports
import cloudinary from '../config/cloudinary.js';
import Message from '../models/message.model.js';
import User from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getUsersForSidebar = asyncHandler(async (req, res) => {
    const loggedInUserId = req.user._id;

    try {
        const filteredUsers = await User.find({
            _id: { $ne: loggedInUserId },
        }).select('name avatar');

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    filteredUsers,
                    'Users fetched successfully'
                )
            );
    } catch (err) {
        throw new ApiError(
            err.statusCode || 500,
            err.message || 'Server Error'
        );
    }
});

export const getMessages = asyncHandler(async (req, res) => {
    const { id: userToChatId } = req.params;
    const loggedInUserId = req.user._id;

    try {
        const messages = await Message.find({
            $or: [
                { senderId: loggedInUserId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: loggedInUserId },
            ],
        });

        return res
            .status(200)
            .json(
                new ApiResponse(200, messages, 'Messages fetched successfully')
            );
    } catch (err) {
        throw new ApiError(
            err.statusCode || 500,
            err.message || 'Server Error'
        );
    }
});

export const sendMessage = asyncHandler(async (req, res) => {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    try {
        let imageUrl;
        if (image) {
            // upload base64 image to cloudinary
            const uploadedImage = await cloudinary.uploader.upload(image, {
                folder: 'chat/images',
            });
            imageUrl = uploadedImage.secure_url;
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        // real time message sending with socket.io

        return res
            .status(201)
            .json(
                new ApiResponse(200, newMessage, 'Message sent successfully')
            );
    } catch (err) {
        throw new ApiError(
            err.statusCode || 500,
            err.message || 'Server Error'
        );
    }
});
