import mongoose from 'mongoose';
import { IMessageList } from '../interfaces/IMessageList';

const MessageList = new mongoose.Schema(
  {
    messages: {
        type: Array,
        required: false,
        default: []
    },  
    createdAt: {
        type: Date,
        required:false,
        default: Date.now
    },
  },
  { collection: 'messageList', timestamps: true }
);

export default mongoose.model<IMessageList & mongoose.Document>('messageListModel', MessageList);
