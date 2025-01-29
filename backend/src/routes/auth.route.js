// external imports
import { Router } from 'express';
import { login, logout, signup } from '../controllers/auth.controller.js';

const authRouter = Router();

// signup route
authRouter.route('/signup').post(signup);

// signin route
authRouter.route('/login').post(login);

// logout route
authRouter.route('/logout').get(logout);

export default authRouter;
