// external imports
import { Schema, model } from 'mongoose';

const messageSchema = new Schema(
    {
        senderId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Sender is required'],
        },
        receiverId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Receiver is required'],
        },
        text: String,
        image: String,
    },
    { timestamps: true }
);

const Message = model('Message', messageSchema);

export default Message;
