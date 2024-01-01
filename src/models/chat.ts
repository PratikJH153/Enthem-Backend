import mongoose from 'mongoose';
import { IRoom } from '../interfaces/IRoom';
import { IMessage } from 'src/interfaces/IMessage';

const Chat = new mongoose.Schema(
  {
    user1ID: {
      type: String,
      required: [true, 'id is required'],
    },    
    user2ID: {
        type: String,
        required: [true, 'id is required'],
    },
    isDisabled: {
        type: Boolean,
        required: false,
        default: false
    },
    messages: {
        type: Array<IMessage>,
        required: false,
        default: []
    },   
    createdAt: {
        type: Date,
        required:false,
        default: Date.now
    },
  },
  { collection: 'chats', timestamps: true }
);

export default mongoose.model<IRoom & mongoose.Document>('chatModel', Chat);
