import { Document, Model } from 'mongoose';
import {type} from "os";
import { IRoom } from '../../interfaces/IRoom';

declare global {
  namespace Express {
    export interface Request {
    }    
  }

  namespace Models {
    export type TestModel = Model<ITest & Document>;
    export type roomModel = Model<IRoom & Document>;
   }
}
