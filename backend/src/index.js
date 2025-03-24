// external imports
import { } from 'dotenv/config';
import express from 'express';
import path from 'path';

// internal imports
import app from './app.js';
import connectDB from './config/db.js';
import { server } from './config/socket.js';

const port = process.env.PORT || 8080;

const __dirname = path.resolve();

// connect to database
connectDB()
    .then(() => {
        // handle app errors
        app.on('error', (err) => {
            console.error('Express server ERROR: ', err);
            process.exit(1);
        });

        if (process.env.NODE_ENV === 'production') {
            // serve static files
            app.use(express.static(path.join(__dirname, '../../frontend/dist')));

            // handle SPA
            app.get('*', (req, res) => {
                res.sendFile(path.join(__dirname, '../../frontend', 'dist', 'index.html'));
            });
        }

        // start server
        server.listen(port, () => {
            console.log(`⚙️  Server running on port: ${port}\n`);
        });
    })
    .catch((err) => {
        console.error('Server startup ERROR: ', err);
        process.exit(1);
    });
