import { Document, Model } from 'mongoose';
import {type} from "os";
import { IRoom } from '../../interfaces/IRoom';
import { IChat } from 'src/interfaces/IChat';
import { IMessage } from 'src/interfaces/IMessage';

declare global {
  namespace Express {
    export interface Request {
    }    
  }

  namespace Models {
    export type TestModel = Model<ITest & Document>;
    export type roomModel = Model<IRoom & Document>;
    export type chatModel = Model<IChat & Document>;
    export type messageModel = Model<IMessage & Document>;
   }
}
