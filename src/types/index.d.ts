import { Document, Model } from 'mongoose';
import {type} from "os";
import { IRoom } from '../../interfaces/IRoom';
import { IChat } from 'src/interfaces/IChat';
import { IMessage } from 'src/interfaces/IMessage';
import { IMessageList } from 'src/interfaces/IMessageList';

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
    export type messageListModel = Model<IMessageList & Document>;
   }
}
