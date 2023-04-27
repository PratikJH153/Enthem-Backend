import config from '../../config'
import debugError from "../../services/debug_error";
import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";

const attachCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization']
    if (!authHeader) {
      throw new Error("no Authorization header found")
    }
    
    try{
      if (authHeader && authHeader.includes('Bearer')) {
        const token =  authHeader.split(' ')[1];
        const decoded = jwt.verify(token, config.jwtSecret);
        return next();
      }else{
        return res.sendStatus(401).send('Access denied')
      }
    }catch(err){
        debugError(err);
        return next(err);
    }
  } catch (e) {
    debugError(e);
    return next(e);
  }
};

export default attachCurrentUser;
