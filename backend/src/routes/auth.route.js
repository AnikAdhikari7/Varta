// external imports
import { Router } from "express";

const authRouter = Router();

// signup route
authRouter.get('/signup', (req, res) => {
    res.send('signup route');
});

// signin route
authRouter.post('/signin', (req, res) => {
    res.send('signin route');
});

// logout route
authRouter.post('/logout', (req, res) => {
    res.send('logout route');
});

export default authRouter;