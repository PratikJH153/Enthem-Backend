import { Service, Inject } from 'typedi';
import { IRoom } from '../interfaces/IRoom';
import { startSession } from 'mongoose';

@Service()
export default class RoomService {

  constructor(
    @Inject('roomModel') private room: Models.roomModel
  ) {
  }

  public async getAllRooms(page: number = 1, miles: number, coordinates: Array<Number>): Promise<any> {
    try {
      const skip = (page - 1) * 5;
      const data = await this.room.find(
        {
          location: {
            $near: {
              $maxDistance: 1 * miles * 1609.344, // distance in meters
              $geometry: {
                type: 'Point',
                coordinates: coordinates
              }
            }
          }
        }
      )
        .sort({ createdAt: "desc" })
        .skip(skip)
        .limit(5)
        .exec();
      
      return {
        data: data ?? []
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  public async getRoom(id: string): Promise<any> {
    try {
      const data = await this.room.findById(id);
      return {
        data: data
      };
    } catch (err) {
      throw new Error(err);
    }

  }

  public async getRoomsByOwnerID(ownerID: string): Promise<any>{
    try{
      const data = await this.room.find({ownerID: ownerID});
      return {
        data: data
      }
    } catch(err){
      throw new Error(err);
    }
  }


  public async addRoom(roomData: Map<String, Object>): Promise<any> {
    try {
      const data: IRoom = await this.room.create(roomData);
      if (!data) {
        throw new Error("Could not create room!");
      }
      return { data: `Room created successfully!` };
    } catch (err) {
      throw new Error(err);
    }

  }

  public async deleteRoom(roomID: string, ownerID: string): Promise<any> {
    try{
      const data = await this.room.deleteOne({ _id: roomID, ownerID: {$eq: ownerID} });
      if (data["deletedCount"] > 0){
        return { status: 200, data: "Room deleted successfully!" };
      } else{
        return { status: 404, data: "RoomID or OwnerID is incorrect!"};
      }
    } catch(err){
      throw new Error(err);
    }
  }

  public async addMember(roomID: string, memberID: string): Promise<any> {
    const session  = await startSession();
    session.startTransaction();
    try {
      const data = {status: 200, data: `Member added successfully!`};
      const isExist = await this.room.findById(roomID).where("memberlist.memberId").in([memberID]).exec();
      if (!isExist){
        await this.room.updateOne({ _id: roomID }, { $push: { memberlist: { memberId: memberID, permit: false } } });
      } else{
        data["status"] = 409;
        data["data"] = "Member already exists";
      }
      await session.commitTransaction();
      return data;
    } catch (err) {
      await session.abortTransaction();
      throw new Error(err);
    } finally{
      session.endSession();
    }
  }

  public async removeMember(roomID: string, memberID: string): Promise<any> {
    try {
      const updatedRoom = await this.room.findByIdAndUpdate(
        roomID,
        { $pull: { memberlist: { memberId: memberID } } },
      );

      if (!updatedRoom) {
        throw new Error("Room not found or you are not the owner of the room.");
      }

      return { data: `Member removed successfully!` };
    } catch (err) {
      throw new Error(err);
    }
  }
  
  public async searchRoom(substring: string): Promise<any> {
    try {
      const rooms = await this.room.find({
        $or: [
          { title: { $regex: substring, $options: 'i' } },
          { description: { $regex: substring, $options: 'i' } }
        ]
      });
  
      return { data: rooms };
    } catch (err) {
      throw new Error(err);
    }
  }  
}