import expressLoader from './express';
// import mongooseLoader from './mongoose';

export default async ({ expressApp }) => {
  expressLoader({ app: expressApp });
  // const mongoConnection = await mongooseLoader();
  console.log("🔥🔥 Db loaded and connected! 🔥🔥");
};
