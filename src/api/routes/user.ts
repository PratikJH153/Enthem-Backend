import { Router, Request, Response, NextFunction } from 'express';
import { driver, auth } from "neo4j-driver";
import config from "../../config";

const route = Router();

// email
// Photo -> URL
// Username
// Gender
// DOB
// Skills
// Interests
// Geo Location 

//! Solve Container.get(logger) issue
export default (app: Router) => {
    app.use('/user', route);

    const db = driver(config.databaseURL, auth.basic(config.dbUser, config.dbPass),
        {/* encrypted: 'ENCRYPTION_OFF' */ },);
    
    const session = db.session({ database: "neo4j" });
        
    // Get User Data
    route.get('/:sessionId', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query =
            `
            MATCH (n:User{sessionId:"${req.params.sessionId}"})
            RETURN n;
            `;
            
            const result = await session.run(query);
            console.log("RESULT:");
            const resultList = [];
            result.records.forEach(i=> resultList.push(i.get("n").properties));
            
            return res.status(201).json({ "status": 200, "data": resultList});
        } catch (e) {
            return next(e);
        }
    });  

    // Create User Data
    route.post('/:sessionId', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query =
                `
                MERGE (u:User {sessionId:"${req.params.sessionId}"})
                ON CREATE SET u.age = ${req.body.age}, 
                                u.gender = "${req.body.gender}",
                                u.sessionId="${req.params.sessionId}" ,
                                u.latitude = ${req.body.latitude},
                                u.longitude = ${req.body.longitude},
                                u.name = "${req.body.name}"
                RETURN u
                `;
    
                const result = await session.run(query);
                console.log("RESULT:");
                const resultList = [];
                result.records.forEach(i=> resultList.push(i.get("u").properties));
                
                return res.status(201).json({ "status": 200, "data": resultList});
        } catch (e) {
            return next(e);
        }
    });

    // Update User Data
    route.put('/:sessionId', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query =
                `
                MATCH (u:User {sessionId:"${req.params.sessionId}"}) SET u.age= ${req.body.age} RETURN u
                `;

                const result = await session.run(query);
                console.log("RESULT:");
                const resultList = [];
                result.records.forEach(i=> resultList.push(i.get("u").properties));
                
                return res.status(201).json({ "status": 200, "data": resultList});
        } catch (e) {
            return next(e);
        }
    });    

    // Delete User Data
    route.delete('/:sessionId', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query =
                `
                MATCH (u:User {sessionId: "${req.params.sessionId}"}) DETACH DELETE u
                `;

            const session = db.session({ database: "neo4j" });
            const result = await session.run(query);
            console.log("User Profile Deleted Successfully !");
        } catch (e) {
            return next(e);
        }
    });    
};
