import { Service, Inject } from 'typedi';
import { IRoom } from '../interfaces/IRoom';
import { startSession } from 'mongoose';
import { Driver } from 'neo4j-driver';
import debugError from './debug_error';

@Service()
export default class RoomService {
  // private db: Driver;
  constructor(
    @Inject('roomModel') private room: Models.roomModel,
    // db: Driver
  ) {
    // this.db = db;
  }

  public async getAllRooms(page: number = 1, miles: number, coordinates: Array<Number>): Promise<any> {
    try {
      const skip = (page - 1) * 5;
      const data = await this.room.find(
        {
          location: {
            $near: {
              $maxDistance: 5 * miles * 1609.344, // distance in meters (CHANGE IN MILES)
              $geometry: {
                type: 'Point',
                coordinates: coordinates
              }
            }
          }
        }
      ).where(
        {_id: {$ne: "6447eefcb4a2662c84158478"}},)
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


  public async getPopularRooms(page: number = 1): Promise<any> {
    try {
      const skip = (page - 1) * 5;
      const data = await this.room.find()
        .where(
          {_id: {$ne: "646c7ef4c83d11d64909d21c"}},)
        .sort({ createdAt: "desc", participants: -1 })
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

  public async getIntroduceRoom(): Promise<any> {
    try {
      const data = await this.room.findById("646c7ef4c83d11d64909d21c");
      console.log(data);
      return {
        data: data
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  public async getRoomsByOwnerID(ownerID: string): Promise<any> {
    try {
      const data = await this.room.find({ ownerID: ownerID });
      return {
        data: data
      }
    } catch (err) {
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
    try {
      const data = await this.room.deleteOne({ _id: roomID, ownerID: { $eq: ownerID } });
      if (data["deletedCount"] > 0) {
        return { status: 200, data: "Room deleted successfully!" };
      } else {
        return { status: 404, data: "RoomID or OwnerID is incorrect!" };
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  public async deleteManyRooms(createdAt: string): Promise<any> {
    try {
      const data = await this.room.deleteMany({ createdAt: {$gte: createdAt} });
      if (data["deletedCount"] > 0) {
        return { status: 200, data: "Room deleted successfully!" };
      } else {
        return { status: 404, data: "RoomID or OwnerID is incorrect!" };
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  public async addMember(roomID: string, memberID: string): Promise<any> {
    const session = await startSession();
    session.startTransaction();
    try {
      const data = { status: 200, data: `Member added successfully!` };
      const isExist = await this.room.findById(roomID).where("memberlist.memberId").in([memberID]).exec();
      if (!isExist) {
        await this.room.updateOne(
          { _id: roomID }, 
          { $push: { memberlist: { memberId: memberID, permit: false }, }},
          { $inc: { participants: 1}}
          );
      } else {
        data["status"] = 409;
        data["data"] = "Member already exists";
      }
      await session.commitTransaction();
      return data;
    } catch (err) {
      await session.abortTransaction();
      throw new Error(err);
    } finally {
      session.endSession();
    }
  }

  public async removeMember(roomID: string, memberID: string): Promise<any> {
    try {
      const updatedRoom = await this.room.findByIdAndUpdate(
        roomID,
        { $pull: { memberlist: { memberId: memberID } } },
        { $inc: { participants: -1}}
      );

      if (!updatedRoom) {
        return {data: "Room not found or you are not the owner of the room."}
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