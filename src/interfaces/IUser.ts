import { defaultPhotoURL } from "../constants/production_mode";

export interface IUser {
    uid: string;
    username: string;
    email: string;
    photoURL: string;
    gender: string;
    age: number;
    interests: Array<String>;
    latitude: number;
    longitude: number;
    languages: Array<String>;
    college: String;
}

export class UserFactory {
    static createUserFromRecord(record: any): IUser {
      return {
        uid: record.get('uid'),
        username: record.get('username'),
        age: record.get('age').toNumber() ?? 20,
        email: record.get('email'),
        photoURL: record.get('photoURL') ?? defaultPhotoURL,
        latitude: record.get('latitude'),
        longitude: record.get('longitude'),
        languages: record.get('languages'),
        college: record.get('college') ?? "Illinois Institute of Technology",
        gender: record.get('gender'),
        interests: record.get('interests')
    };
    }
  }