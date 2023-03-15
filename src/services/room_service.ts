import { range } from 'lodash';
import { Service, Inject, Container } from 'typedi';
import { IRoom } from '../interfaces/IRoom';

@Service()
export default class RoomService {

  constructor(
    @Inject('logger') private logger,
    @Inject('roomModel') private room: Models.roomModel
    ) 
    {
  }

  public async addRoom(title: string): Promise<any> {
    const room:IRoom = await this.room.findOne({ title: title });

    if (room) {
      throw new Error("Room with that name already exists!");
    }

    const data:IRoom = await this.room.create({ title: title, ownerID: "asdfsadfsdaf" });
    if (!data) {
      throw new Error("Could not create room!");
    }

    return { data: `Room with name ${title} created successfully!` };
  }

  public async getAllRoooms(): Promise<any> {
    const data:Array<IRoom> = await this.room.find().sort({"createdAt": "desc"}).exec();
    if (!data) {
      throw new Error("Could not get room!");
    }

    return {data: data};
  }

  public async getRoom(): Promise<any> {
    const data:Array<IRoom> = await this.room.find();

    if (!data) {
      throw new Error("Could not get room!");
    }

    return {data: data};
  }

  public async deleteRoom(name: string): Promise<any> {
    const room = await this.room.findOneAndDelete({ name: name });

    if (!room) {
      throw new Error("Room doesn't exist!");
    }

    return { data: "Group deleted successfully!" };
  }

}