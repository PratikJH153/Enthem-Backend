export interface IRoom{
    _id: string;
    title: string;
    des: string;
    ownerID: string;
    createdAt: Date;
    latitude: number;
    longitude: number;
    votes: number;
  }