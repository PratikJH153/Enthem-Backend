import mongoose from 'mongoose';
import { IRoom } from '../interfaces/IRoom';

const Room = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'title is required'],
      maxlength: 100,
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
    location: {
      type:{
        type:String,
        enum:["Point"]
      },
      coordinates:{
        type:[Number]
      }
    },
    votes: {
        type:Number,
        required: false,
        default: 0
    },
    memberlist: [{
      memberId: { type: String, required: false },
      permit: { type: Boolean, required: false }
    }],
    participants: {
      type: Number,
      required: false,
      default: 0
    }
  },
  { collection: 'rooms', timestamps: true }
);

Room.index({location: "2dsphere"})

export default mongoose.model<IRoom & mongoose.Document>('roomModel', Room);
