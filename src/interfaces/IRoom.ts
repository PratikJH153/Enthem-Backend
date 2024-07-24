export interface IRoom{
    id: string;
    title: string;
    desc: string;
    ownerID: string;
    createdAt: Date;
    latitude: number;
    longitude: number;
    votes: number;
  }

  export class RoomFactory {
    static createRoomFromFactory(record: any): IRoom {
      return {
        id: record.get('id'),
        title: record.get('title'),
        desc: record.get('desc'),
        ownerID: record.get('owner_id'),
        createdAt: record.get('created_at'),
        latitude: record.get('latitude'),
        longitude: record.get('longitude'),
        votes: record.get('votes'),
    };
    }
  }