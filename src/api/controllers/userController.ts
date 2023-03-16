import { Router, Request, Response, NextFunction } from 'express';
import { driver, auth, Driver, Session } from "neo4j-driver";
import { Inject, Service } from 'typedi';
import config from "../../config";
import debugError from '../../services/debug_error';

@Service()
export default class UserController {
  private db: Driver;
  constructor(
    @Inject('logger') private logger,
  ) {
    this.db = driver(config.databaseURL, auth.basic(config.dbUser, config.dbPass),
      {/* encrypted: 'ENCRYPTION_OFF' */ },);
    
  }

  public async test(req: Request, res: Response, next: NextFunction) {
    return res.status(200).json({ status: 200, data: "User Routes Working!" });
  }


  public async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const session = this.db.session({ database: "neo4j" });
      const { id, ...params } = req.body;
      const existingUser = await session.run(`
      MATCH (u:User {id: "${req.body.id}"})
      RETURN u
    `, { id });

      if (!existingUser.records.length) {
        console.log('Sorry, No such user exists!');
        return res.status(404).json({ status: 404, message: 'User not found' });
      }

      const setStatements = Object.entries(params).map(([key, value]) => `u.${key} = $${key}`);
      const setQuery = setStatements.join(', ');

      const updateQuery = `
      MATCH (u:User {id: "${req.body.id}"})
      SET ${setQuery}
      RETURN u.username AS username, u.age AS age, u. photoURL as photoURL, u.latitude AS latitude, u.longitude AS longitude, u.gender AS gender
    `;

      const result = await session.run(updateQuery, { id, ...params });
      const resultList = result.records.map(record => ({
        username: record.get('username'),
        age: record.get('age').toNumber(),
        gender: record.get('gender'),
        photoURL: record.get('photoURL'),
        latitude: record.get('latitude'),
        longitude: record.get('longitude')
      }));

      session.close();
      return res.status(200).json({ status: 200, data: resultList });
    } catch (e) {
      debugError(e.toString());
      return next(e);
    }
  };


  public async getUserBySessionId(req: Request, res: Response, next: NextFunction) {
    try {
      const session = this.db.session({ database: "neo4j" });
      const query = `
      MATCH (n:User {id:"${req.body.id}"})
      RETURN n.id AS id, n.username AS username, n.email AS email, n.age AS age,
        n.gender AS gender, n.photoURL AS photoURL,
        n.latitude AS latitude, n.longitude AS longitude;
    `;
      const result = await session.run(query);
      if (result.records.length > 0) {
        const record = result.records[0];
        const data = {
          id: record.get('id'),
          username: record.get('username'),
          email: record.get('email'),
          age: record.get('age').toNumber(),
          gender: record.get('gender'),
          photoURL: record.get('photoURL'),
          latitude: record.get('latitude'),
          longitude: record.get('longitude')
        };
        session.close();
        return res.status(200).json({ status: 200, data: data });
      } else {
        return res.status(404).json({ status: 404, data: "Sorry, No User Exists with this ID !" });
      }
    } catch (e) {
      debugError(e.toString());
      return next(e);
    }
  };


  public async isUserExists(req: Request, res: Response, next: NextFunction) {
    try {
      const session = this.db.session({ database: "neo4j" });
      const query = `
      MATCH (n:User {id:"${req.body.id}"})
      RETURN n.id AS id;
    `;
      const result = await session.run(query);
      const record = result.records[0];
      session.close();
      if (record != null) {
        return res.status(200).json({ status: 200, data: true });
      }
      return res.status(404).json({ status: 404, data: false });
    } catch (e) {
      debugError(e.toString());
      return next(e);
    }
  };


  public async isUsernameExists(req: Request, res: Response, next: NextFunction) {
    try {
      const session = this.db.session({ database: "neo4j" });
      const query = `
      MATCH (n:User {name:"${req.body.username}"})
      RETURN n.id AS id;
    `;
      const result = await session.run(query);
      const record = result.records[0];
      session.close();
      if (record != null) {
        return res.status(200).json({ status: 200, data: true });
      }
      return res.status(404).json({ status: 404, data: false });
    } catch (e) {
      debugError(e.toString());
      return next(e);
    }
  };


  public async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const session = this.db.session({ database: "neo4j" });
      const max: number = +req.query.max || 10;
      const offset: number = +req.query.offset || 0;
      const skip: number = offset * max;

      const query = `
      MATCH (n:User)
      RETURN n.id AS id, n.username AS username, n.email AS email, n.age AS age,
        n.gender AS gender, n.photoURL AS photoURL,
        n.latitude AS latitude, n.longitude AS longitude
      SKIP ${skip} LIMIT ${max};
    `;

      const result = await session.run(query);

      const resultList = result.records.map(record => ({
        id: record.get('id'),
        username: record.get('username'),
        email: record.get('email'),
        age: record.get('age').toNumber(),
        gender: record.get('gender'),
        photoURL: record.get('photoURL'),
        latitude: record.get('latitude'),
        longitude: record.get('longitude')
      }));
      session.close();
      return res.status(200).json({ status: 200, data: resultList });

    } catch (e) {
      debugError(e.toString());
      return next(e);
    }

  };


  public async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const session = this.db.session({ database: "neo4j" });
      const userInput = req.body;

      // Check if all required properties are present
      if (!userInput.id || !userInput.username || !userInput.email || !userInput.latitude || !userInput.longitude) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const checkEmailQuery = `
      MATCH (u:User)
      WHERE u.email = "${userInput.email}" OR u.id = "${userInput.id}"
      RETURN DISTINCT u.username as username, u.email as email, u.age as age, u.gender as gender, u.photoURL as photoURL
    `;
      const emailResult = await session.run(checkEmailQuery);
      if (emailResult.records.length > 0) {
        const resultListEmail = emailResult.records.map(record => ({
          username: record.get('username'),
          email: record.get('email'),
          age: record.get('age').toNumber(),
          gender: record.get('gender'),
          photoURL: record.get('photoURL'),
        }));
        return res.status(409).json({
          status: 409,
          message: 'User already exists',
          data: resultListEmail
        });
      }

      const createQuery = `
      CREATE (u:User {
        id: "${userInput.id}",
        username: "${userInput.username}",
        email: "${userInput.email}",
        photoURL: "${userInput.photoURL}",
        gender: COALESCE("${userInput.gender}", "Unknown"),
        age: COALESCE(${userInput.age}, 20),
        latitude: ${userInput.latitude},
        longitude: ${userInput.longitude}
      })
      RETURN u.username as username, u.age as age, u.email as email, u.photoURL as photoURL, u.gender as gender
    `;
      const createResult = await session.run(createQuery);
      const resultList = createResult.records.map(record => ({
        username: record.get('username'),
        email: record.get('email'),
        age: record.get('age').toNumber(),
        gender: record.get('gender'),
        photoURL: record.get('photoURL'),
      }));
      session.close();
      return res.status(200).json({ status: 200, data: resultList });
    } catch (e) {
      debugError(e.toString());
      return next(e);
    }
  };


  public async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const session = this.db.session({ database: "neo4j" });
      const query = `
      MATCH (u:User {id: "${req.body.id}"})
      WITH u LIMIT 1
      OPTIONAL MATCH (u)-[r]-()
      DELETE u, r
      RETURN COUNT(u) as deleted
    `;
      const result = await session.run(query);
      const deleted = result.records[0].get("deleted").toNumber();
      session.close();
      if (deleted === 0) {
        return res.status(404).json({ status: 404, data: "User does not exist and cannot be deleted." });
      } else {
        return res.status(201).json({ status: 201, data: "User Profile Deleted Successfully !" });
      }
    } catch (e) {
      debugError(e.toString());
      return res.status(500).json({ status: 500, data: "Sorry, there was an error deleting the user." });
    }
  };


  public async locRecommend(req: Request, res: Response, next: NextFunction) {
    try {
      const session = this.db.session({ database: "neo4j" });
      const max: number = +req.query.max || 10;
      const offset: number = +req.query.offset || 0;
      const skip: number = offset * max;

      const query = `
      MATCH (u:User)
      WHERE u.id = "${req.body.id}" 
      AND u.latitude IS NOT NULL AND u.longitude IS NOT NULL 
      MATCH (u2:User)
      WHERE u2.id <> u.id 
      AND u2.latitude IS NOT NULL AND u2.longitude IS NOT NULL 
      WITH u, u2,
          toFloat(u.latitude) * pi() / 180.0 AS lat1, 
          toFloat(u.longitude) * pi() / 180.0 AS lon1,
          toFloat(u2.latitude) * pi() / 180.0 AS lat2, 
          toFloat(u2.longitude) * pi() / 180.0 AS lon2,
          3959.0 AS r
      WITH u, u2, r * asin(sqrt(sin((lat2 - lat1) / 2)^2 + cos(lat1) * cos(lat2) * sin((lon2 - lon1) / 2)^2)) * 2.0 AS distance
      WHERE distance <= 10000
      RETURN DISTINCT u2.username as username, u2.email as email, u2.gender as gender, 
      u2.age as age, u2.latitude as latitude, u2.longitude as longitude, u2.photoURL as photoURL 
      SKIP ${skip} LIMIT ${max}
    
    `;

      const result = await session.run(query);
      if (result.records.length > 0) {
        const resultList = result.records.map(record => ({
          username: record.get('username'),
          email: record.get('email'),
          age: record.get('age').toNumber(),
          gender: record.get('gender'),
          photoURL: record.get('photoURL'),
          latitude: record.get('latitude'),
          longitude: record.get('longitude')
        }));
        session.close();
        return res.status(200).json({ status: 200, data: resultList });
      } else {
        return res.status(404).json({ status: 404, data: [] });
      }
    } catch (e) {
      debugError(e.toString());
      return next(e);
    }
  };


  public async recommendUser(req: Request, res: Response, next: NextFunction) {
    try {
      const session = this.db.session({ database: "neo4j" });
      const max: number = +req.query.max || 10;
      const offset: number = +req.query.offset || 0;
      const skip: number = offset * max;

      const query = `
      MATCH (u:User)-[:HAS_INTEREST]->(s:Activity)<-[:HAS_INTEREST]-(u2:User)
      WHERE u.id = "${req.body.id}"
      AND u.latitude IS NOT NULL AND u.longitude IS NOT NULL 
      AND u2.id <> u.id 
      AND u2.latitude IS NOT NULL AND u2.longitude IS NOT NULL 
      WITH u, u2, s, u.latitude * pi() / 180 AS lat1, u.longitude * pi() / 180 AS lon1,
          u2.latitude * pi() / 180 AS lat2, u2.longitude * pi() / 180 AS lon2,
          6371 * 2 AS r 
      WITH u, u2, s, lat1, lon1, lat2, lon2, r,
          sin((lat2 - lat1) / 2) AS a,
          sin((lon2 - lon1) / 2) AS b,
          cos(lat1) AS c,
          cos(lat2) AS d
      WITH u, u2, s, r * asin(sqrt(a^2 + c * d * b^2)) AS distance
      WHERE distance <=10000
      RETURN DISTINCT u2.username as username, u2.email as email, 
      u2.gender as gender, u2.age as age, u2.latitude as latitude, u2.longitude as longitude, u2.photoURL as photoURL
      SKIP ${skip} LIMIT ${max}
    `;

      const result = await session.run(query);
      if (result.records.length > 0) {
        const resultList = result.records.map(record => ({
          username: record.get('username'),
          email: record.get('email'),
          age: record.get('age').toNumber(),
          gender: record.get('gender'),
          photoURL: record.get('photoURL'),
          latitude: record.get('latitude'),
          longitude: record.get('longitude')
        }));
        session.close();
        return res.status(200).json({ status: 200, data: resultList });
      } else {
        return res.status(404).json({ status: 404, data: [] });
      }
    } catch (e) {
      debugError(e.toString());
      return next(e);
    }

  };

  public async compatibleUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const session = this.db.session({ database: "neo4j" });
      const max: number = +req.query.max || 10;
      const offset: number = +req.query.offset || 0;
      const skip: number = offset * max;

      const query = `

      MATCH (u:User)-[:HAS_INTEREST]->(s:Activity)
      WHERE u.id = "${req.body.id}"
      WITH u, COLLECT(s) AS interests
      MATCH (u2:User)-[:HAS_INTEREST]->(s2:Activity)
      WHERE u2.id <> u.id
      WITH u, u2, interests, COLLECT(s2) AS interests2,
        radians(u.latitude) AS u_lat, radians(u.longitude) AS u_lon,
        radians(u2.latitude) AS u2_lat, radians(u2.longitude) AS u2_lon
      WITH u, u2, 
        REDUCE(s = [], x IN interests | 
                s + CASE WHEN x IN interests2 THEN x ELSE [] END) AS common_interests,
        toFloat(size(REDUCE(s = [], x IN interests | s + x))) AS u_interests,
        toFloat(size(interests2)) AS u2_interests,
        u_lat, u_lon, u2_lat, u2_lon
      WITH u, u2, common_interests,
        toFloat(size(common_interests)) / u_interests AS u_similarity,
        toFloat(size(common_interests)) / u2_interests AS u2_similarity,
        round(6371 * acos(sin(u_lat) * sin(u2_lat) + cos(u_lat) * cos(u2_lat) * cos(u2_lon - u_lon)) * 0.621371, 2) AS distance_in_miles
      RETURN u2.username AS username, u2.email AS email, u2.age AS age, u2.gender AS gender, u2.latitude AS latitude, 
        u2.longitude AS longitude, u2.photoURL AS photoURL, 
        toInteger(((u_similarity + u2_similarity) / 2) * 100) AS match_percentage,
        distance_in_miles
      ORDER BY match_percentage DESC
      SKIP ${skip} LIMIT ${max}    
    `;

      const result = await session.run(query);
      if (result.records.length > 0) {
        const resultList = result.records.map(record => ({
          username: record.get('username'),
          email: record.get('email'),
          age: record.get('age').toNumber(),
          gender: record.get('gender'),
          photoURL: record.get('photoURL'),
          latitude: record.get('latitude'),
          longitude: record.get('longitude'),
          distance: record.get('distance_in_miles'),
          compatibility: record.get('match_percentage').toNumber()
        }));
        session.close();
        return res.status(200).json({ status: 200, data: resultList });
      } else {
        return res.status(404).json({ status: 404, data: [] });
      }
    } catch (e) {
      debugError(e.toString());
      return next(e);
    }
  };


  public async createSkills(req: Request, res: Response, next: NextFunction) {
    try {
      const session = this.db.session({ database: "neo4j" });
      const skills = req.body.skills.map(skill => `"${skill}"`).join(', ');
      const query = `
      WITH [${skills}] AS skillsList
      UNWIND skillsList AS skill
      MERGE (s:Activity {name:skill})
      WITH s
      MATCH (u:User {id:"${req.body.id}"})
      MERGE (u)-[:HAS_SKILL]->(s)
    `;

      const result = await session.run(query);
      session.close();
      return res.status(201).json({ status: 201, data: "Done creating skills" });
    } catch (e) {
      debugError(e.toString());
      return next(e);
    }
  };


  public async createInterests(req: Request, res: Response, next: NextFunction) {
    try {
      const session = this.db.session({ database: "neo4j" });
      const interests = req.body.interests.map(interest => `"${interest}"`).join(', ');
      const query = `
      WITH [${interests}] AS interestsList
      UNWIND interestsList AS interest
      MERGE (s:Activity {name:interest})
      WITH s
      MATCH (u:User {id:"${req.body.id}"})
      MERGE (u)-[:HAS_INTEREST]->(s)
    `;

      const result = await session.run(query);
      session.close();
      return res.status(201).json({ status: 201, data: "Done creating Interests" });
    } catch (e) {
      debugError(e.toString());
      return next(e);
    }
  };


  public async interestsUser(req: Request, res: Response, next: NextFunction) {
    try {
      const session = this.db.session({ database: "neo4j" });
      const query1 = `
      MATCH (n:User{id:"${req.body.id}"})
      RETURN n.id AS id
    `;
      const result1 = await session.run(query1);
      if (result1.records.length === 0) {
        return res.status(404).json({ status: 404, message: "Sorry, no user with the given ID exists." });
      }
      const query2 = `
      MATCH (n:User{id:"${req.body.id}"})-[r:HAS_INTEREST]->(n2:Activity)
      RETURN DISTINCT n2.name AS interest
    `;
      const result2 = await session.run(query2);
      session.close();
      if (result2.records.length > 0) {
        return res.status(200).json({ status: 200, data: true });
      } else {
        return res.status(404).json({ status: 404, data: false });
      }
    } catch (e) {
      debugError(e.toString());
      return next(e);
    }
  };
}
