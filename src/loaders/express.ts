import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from '../api';
import config from '../config';
import {Request, Response} from "express";
import morgan from "morgan";

export default ({ app }: { app: express.Application }) => {
  app.use(morgan("dev"));
  
  app.get('/status', (req: Request, res: Response) => {
    res.status(200).send({status:200, message:"Server is running successfully!"});
  });

  app.head('/status', (req: Request, res: Response) => {
    res.status(200).end();
  });

  app.use(cors());
  
  app.set("view engine", "ejs");

  app.use(require('method-override')());

  app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.use(bodyParser.json({}));

  app.use(config.api.prefix, routes());

  app.use((req: Request, res: Response, next: Function) => {
    const err = new Error('Not Found');
    err['status'] = 404;
    next(err);
  });

  app.use((err: any, req: Request, res: Response, next: Function) => {
    if (err.name === 'UnauthorizedError') {
      return res
        .status(err.status)
        .send({ message: err.message })
        .end();
    }
    return next(err);
  });

  app.use((err: any, req: Request, res: Response, next: Function) => {
    return res.status(err.status || 500).json({
      errors: {
        message: err.message,
      },
    });
  });
};
