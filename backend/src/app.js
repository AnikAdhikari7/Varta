// external imports
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import logger from './utils/logger.js';

// internal imports
import { app } from './config/socket.js';
import ApiError from './utils/ApiError.js';
import { API_V, MAX_LIMIT } from './utils/constants.js';

// app initialization
// const app = express();

// middlewares
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);
app.use(express.json({ limit: MAX_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: MAX_LIMIT }));
app.use(cookieParser());

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
})();

// routes import
import authRouter from './routes/auth.route.js';
import messageRouter from './routes/message.route.js';

// routes declaration
app.use(API_V + '/auth', authRouter);
app.use(API_V + '/message', messageRouter)

// error handling middleware
app.use((err, req, res, next) => {
    console.error(err);

    if (err instanceof ApiError || err.type === 'entity.too.large') {
        return res.status(err.statusCode).json({
            statusCode: err.statusCode,
            success: err.success || false,
            message: err.message,
            errors: err.errors,
            // stack: err.stack
        });
    }

    res.status(500).json({
        statusCode: 500,
        success: false,
        message: 'An unexpected error occurred',
    });
});

export default app;
