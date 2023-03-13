import { Document, Model } from 'mongoose';
import { IRoom } from '../../interfaces/IRoom';

declare global {
  namespace Express {
    export interface Request {
      currentUser: IUser & Document; 
    }    
  }

  namespace Models {
    export type TestModel = Model<ITest & Document>;
    export type RoomModel = Model<IRoom & Document>;
   }
}
