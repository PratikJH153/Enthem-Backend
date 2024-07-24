import { Driver } from "neo4j-driver"
import debugError from "../../services/debug_error";
import { NextFunction, Request, Response } from "express";
import { RoomFactory } from "../../interfaces/IRoom";

export default class TestRoomController {
    private db: Driver
    constructor(db: Driver){
        this.db = db;
    }

    public testGetAllRooms =  async (req:Request, res: Response, next:NextFunction) => {
        const session = this.db.session();
        const max: number = +req.query.max || 10;
        const offset: number = +req.query.offset || 0;
        const skip: number = offset * max;
    
        try{
          const query = `
          MATCH (room:Room)-[:HAS_OWNER]->(u2:User)
          MATCH (u:User)-[:HAS_INTEREST]->(s:Interest)<-[:HAS_INTEREST]-(u2)
          WHERE u.uid = 106
            AND u.latitude IS NOT NULL AND u.longitude IS NOT NULL 
            AND u2.uid <> u.uid 
          WITH u, u2, room,
               u.latitude * pi() / 180 AS lat1, u.longitude * pi() / 180 AS lon1,
               room.latitude * pi() / 180 AS lat2, room.longitude * pi() / 180 AS lon2,
               3959 AS r,
               CASE WHEN u.nationality = u2.nationality THEN 1 ELSE 0 END AS nationality_similarity,
               CASE WHEN u.language = u2.language THEN 1 ELSE 0 END AS language_similarity,
               COLLECT(DISTINCT s) AS interests_in_common
          WITH u, u2, lat1, lon1, lat2, lon2, r, room,
               sin((lat2 - lat1) / 2) ^ 2 + cos(lat1) * cos(lat2) * sin((lon2 - lon1) / 2) ^ 2 AS a,
               nationality_similarity, language_similarity, SIZE(interests_in_common) AS interests_in_common
          RETURN DISTINCT ID(room) AS id, room.title AS title, room.desc AS desc, room.default_room AS default_room, room.owner_id AS owner_id, room.created_at AS created_at, room.participants AS participants, room.latitude AS latitude, room.longitude AS longitude, room.votes AS votes,
                 r * 2 * atan2(sqrt(a), sqrt(1 - a)) AS distance, interests_in_common AS interests
          ORDER BY distance ASC, interests
          SKIP ${skip} LIMIT ${max};`
    
    
          const result = await session.run(query);

          const data = result.records.map((record) => RoomFactory.createRoomFromFactory(record));

          if (result.records.length > 0){
              return res.status(200).json({status: 200, data: data});
          }

          return  res.status(404).json({status: 404, data: []});;
    
        } catch(error){
          debugError(error.toString());
          return next(error);
        } finally{
          session.close();
        }
      }
  
}