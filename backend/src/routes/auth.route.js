// external imports
import { Router } from 'express';
import {
    getUser,
    login,
    logout,
    signup,
    updateAvatar,
} from '../controllers/auth.controller.js';
import verifyToken from '../middlewares/auth.middleware.js';

const authRouter = Router();

// signup route
authRouter.route('/signup').post(signup);

// signin route
authRouter.route('/login').post(login);

// logout route
authRouter.route('/logout').get(logout);

// update avatar route
authRouter.route('/update-avatar').put(verifyToken, updateAvatar);

// get user route
authRouter.route('/user').get(verifyToken, getUser);

export default authRouter;
