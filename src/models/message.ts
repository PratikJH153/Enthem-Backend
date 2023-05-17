import mongoose from 'mongoose';
import { IRoom } from '../interfaces/IRoom';

const Message = new mongoose.Schema(
    {
        message: {
            type: String,
            required: [true, 'message is required'],
        },
        senderID: {
            type: String,
            required: [true, "id is required"]
        },
        timestamp: {
            type: Date,
            required: false,
            default: Date.now
        },
    },
    { collection: 'messages', timestamps: true }
);

export default mongoose.model<IRoom & mongoose.Document>('messageModel', Message);
