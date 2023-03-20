import mongoose from 'mongoose';
import { range } from 'lodash';
import { Service, Inject, Container } from 'typedi';
import { IRoom } from '../interfaces/IRoom';
import { IUser} from '../interfaces/IUser';

@Service()
export default class RoomService {

  constructor(
    @Inject('logger') private logger,
    @Inject('roomModel') private room: Models.roomModel
    ) 
    {
  }

  public async getAllRooms(page: number = 1, limit: number = 10, maxPages: number = 10): Promise<any> {
    const skip = (page - 1) * limit;
    const count = await this.room.countDocuments();
    const data = await this.room.find()
        .sort({ createdAt: "desc" })
        .skip(skip)
        .limit(limit)
        .exec();
    if (!data) {
      return {data: []}
    }
    const totalPages = Math.ceil(count / limit);
    const currentPage = Math.min(page, totalPages);
    const startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
    const endPage = Math.min(totalPages, startPage + maxPages - 1);
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return {
        data: data
    };
  }


  public async addRoom(ownerID: string, latitude: number, longitude: number, title: string): Promise<any> {
    // Check if ownerID exists in MongoDB database - later
    // Create new room with specified title and ownerID
    const data: IRoom = await this.room.create({ title: title, ownerID: ownerID, latitude:latitude, longitude:longitude } );
    if (!data) {
      throw new Error("Could not create room!");
    }
  
    return { data: `Room with name ${title} created successfully!` };
  }
  

  public async getRoom(id: String): Promise<any> {
    const data:Array<IRoom> = await this.room.findById(id);
    if (!data) {
      throw new Error("Could not get room!");
    }
    return {data: data};
  }

  public async deleteRoom(roomID: string): Promise<any> {
    await this.room.deleteOne({ _id: roomID});
    // if (!room) {
    //   throw new Error("Room doesn't exist or the owner is not an admin!");
    // }
    //await this.room.deleteOne({ _id: roomID });
    return { data: "Room deleted successfully!" };
    //Todo - work on ownerID auth to delete.
  }

  public async addMember(roomID: string, memberID: string): Promise<any> {
    await this.room.updateOne({ _id: roomID }, { $push: { memberlist: { memberId: memberID, permit: false } } });
    return { data: `Member with ID ${memberID} added to room with ID ${roomID} successfully!` };
  }

  public async removeMember(roomID: string, ownerID: string, memberID: string): Promise<any> {
    const updatedRoom = await this.room.findOneAndUpdate(
      { _id: roomID, ownerID },
      { $pull: { memberlist: { memberId: memberID } } },
      { new: true }
    );
  
    if (!updatedRoom) {
      throw new Error("Room not found or you are not the owner of the room.");
    }
  
    return { data: `Member with ID ${memberID} removed from room with ID ${roomID} successfully!` };
  }
  
  
  
  
  

}