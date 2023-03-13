import { Models } from 'mongoose';
import { IRoom } from 'src/interfaces/IRoom';
import { Service, Inject } from 'typedi';


@Service()
export default class RoomService {

  constructor(
    @Inject('invoiceModel') private roomModel: Models.RoomModel,
  ) {
  }

  public async getAllRooms(req: any): Promise<any> {
    return this.roomModel.find();
  }
 
}
