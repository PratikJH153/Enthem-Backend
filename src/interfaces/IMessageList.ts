import { IMessage } from "./IMessage";


export interface IMessageList{
    _id: string,
    messages: Array<IMessage>,
    createdAt: Date
}