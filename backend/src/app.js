// external imports
import express from 'express';
import morgan from 'morgan';
import logger from './utils/logger.js';

// internal imports
import authRouter from './routes/auth.route.js';
import { API_V } from './utils/constants.js';

// app initialization
const app = express();


// logging with morgan
(() => {
    const morganFormat = ':method :url :status :response-time ms';
    app.use(
        morgan(morganFormat, {
            stream: {
                write: (message) => {
                    const logObject = {
                        method: message.split(' ')[0],
                        url: message.split(' ')[1],
                        status: message.split(' ')[2],
                        responseTime: message.split(' ')[3],
                    };
                    logger.info(JSON.stringify(logObject));
                },
            },
        })
    );
})()

// middlewares

app.use(API_V + '/auth', authRouter);

export default app;
