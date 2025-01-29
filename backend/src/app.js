// external imports
import express from 'express';
import morgan from 'morgan';
import logger from './utils/logger.js';

// internal imports
import ApiError from './utils/ApiError.js';
import { API_V } from './utils/constants.js';

// app initialization
const app = express();

// middlewares
app.use(express.json());

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

// routes declaration
app.use(API_V + '/auth', authRouter);

// error handling middleware
app.use((err, req, res, next) => {
    console.error(err);

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            statusCode: err.statusCode,
            success: err.success,
            message: err.message,
            errors: err.errors,
            // stack: err.stack
        });
    }

    console.error(err); // Log the error
    res.status(500).json({
        success: false,
        message: 'An unexpected error occurred',
    });
});

export default app;
