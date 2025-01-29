// external imports
import { Schema, model } from 'mongoose';

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: [true, 'This email is already registered'],
            lowercase: true,
            maxlength: [50, 'Email cannot exceed 50 characters'],
            trim: true,
        },
        fullName: {
            type: String,
            required: [true, 'Full name is required'],
            maxlength: [50, 'Full name cannot exceed 50 characters'],
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
        },
        avatar: {
            type: String,
            default: '',
            validate: {
                validator: function (v) {
                    // Simple URL validation
                    return v === '' || /^https?:\/\/.+\..+$/.test(v);
                },
                message: 'Avatar must be a valid URL',
            },
        },
    },
    {
        timestamps: true,
    }
);

const User = model('User', userSchema);

export default User;
