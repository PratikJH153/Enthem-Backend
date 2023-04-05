import dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

if(process.env.NODE_ENV === 'dev'){
  const envFound = dotenv.config();
  if (envFound.error) {
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
  }
} 

export default {
  port: parseInt(process.env.PORT, 10),
  socketPort: process.env.SOCKET_PORT,

  databaseURL: process.env.DB_HOST,
  dbUser: process.env.DB_USER,
  dbPass: process.env.DB_PASSWORD,
  progressToken: process.env.PROGRESS_TOKEN,
  
  mongoDB: process.env.MONGO_DB_URL,
  mongoServer: process.env.MONGO_SERVER_NAME,

  jwtSecret: process.env.JWT_SECRET,

  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },

  api: {
    prefix: '',
  },
  
};
