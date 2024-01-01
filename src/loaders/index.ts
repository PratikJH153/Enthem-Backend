import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import mongooseLoader from './mongoose';
import Logger from './logger';

export default async ({ expressApp }) => {
  const mongoConnection = await mongooseLoader();
  Logger.info('✌️ DB loaded and connected!');

  const roomModel = {
    name: 'roomModel',
    model: require('../models/room').default, 
  };
  
  const chatModel = {
    name: 'chatModel',
    model: require('../models/chat').default,
  };
    
  const messageModel = {
    name: 'messageModel',
    model: require('../models/message').default,
  };

  const messageListModel = {
    name: 'messageListModel',
    model: require('../models/messageList').default,
  };

  const { logger } = await dependencyInjectorLoader({
    mongoConnection,
    models: [
      roomModel,
      chatModel,
      messageModel,
      messageListModel
    ],
  });
  
  Logger.info('✌️ Dependency Injector loaded');

  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};
