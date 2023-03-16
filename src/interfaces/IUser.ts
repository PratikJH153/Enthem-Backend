export interface IUser {
    id: string;
    username: string;
    email: string;
    photoURL: string;
    gender: string;
    age: number;
    interests: Array<String>;
    latitude: number;
    longitude: number;
}
