import mongoose from 'mongoose';

// connection instance
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            process.env.MONGODB_URI
        );

        console.log(
            `\n🌩️  MongoDB connected || DB HOST: ${connectionInstance.connection.host}\n`
        );
    } catch (err) {
        console.error('MongoDB connection FAILED: ', err);
        process.exit(1);
    }
};

export default connectDB;
