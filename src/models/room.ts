import mongoose from 'mongoose';
import { IRoom } from '../interfaces/IRoom';
const Schema = mongoose.Schema;

const Room = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'title is required'],
      maxlength: 30,
      minlength: 3
    },    
    des: {
      type: String,
      required: false,
      default: "Welcome to the Room!",
      maxlength: 200,
      minlength: 3
    },
    ownerID: {
      type: String,
      required:[true, 'ownerID is required']
    },
    createdAt: {
      type: Date,
      required:false,
      default: Date.now
    },
    latitude: {
        type:Number,
        required: false,
        default: 100
    },
    longitude: {
        type:Number,
        required: false,
        default: 100
    },
    votes: {
        type:Number,
        required: false,
        default: 0
    },
  },
  { timestamps: true }
);

export default mongoose.model<IRoom & mongoose.Document>('Room', Room);
