// external imports
import { } from 'dotenv/config';

// internal imports
import app from './app.js';
import connectDB from './config/db.js';
import { server } from './config/socket.js';

const port = process.env.PORT || 8080;

// connect to database
connectDB()
    .then(() => {
        // handle app errors
        app.on('error', (err) => {
            console.error('Express server ERROR: ', err);
            process.exit(1);
        });

        // start server
        server.listen(port, () => {
            console.log(`⚙️  Server running on port: ${port}\n`);
        });
    })
    .catch((err) => {
        console.error('Server startup ERROR: ', err);
        process.exit(1);
    });
