// external imports
import { Router } from 'express';

// internal imports
import {
    getMessages,
    getUsersForSidebar,
    sendMessage,
} from '../controllers/message.controller.js';
import verifyToken from '../middlewares/auth.middleware.js';

const messageRouter = Router();

// get users for sidebar route
messageRouter.route('/users').get(verifyToken, getUsersForSidebar);

// get messages route
messageRouter.route('/:id').get(verifyToken, getMessages);

// send message route
messageRouter.route('/send/:id').post(verifyToken, sendMessage);

export default messageRouter;
