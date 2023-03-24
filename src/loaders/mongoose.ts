import config from '../config';
import mongoose from 'mongoose';

export default async (): Promise<any> => {
  const connection = await mongoose.connect(config.mongoDB, {
    ssl: true,
    sslValidate: true,
    // sslCA: require('fs').readFileSync(`${__dirname}/mongocerts.crt`)
  });
 
  return connection.connection.db;
};
