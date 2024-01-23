import { IMessage } from "./IMessage"

export interface IChat{
    user1ID: string,   
    user2ID: string,
    isDisabled: string,
    messages: Array<IMessage>,
    createdAt: Date
  }