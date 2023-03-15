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

  const { logger } = await dependencyInjectorLoader({
    mongoConnection,
    models: [
      roomModel
    ],
  });
  
  Logger.info('✌️ Dependency Injector loaded');

  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};
