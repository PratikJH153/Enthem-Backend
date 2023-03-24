import "reflect-metadata";
import express from "express";
import config from "./config";
import socketLoader from "./loaders/socket";

async function startServer() {
    const app = express();
    await require('./loaders').default({ expressApp: app });

    //TODO: CHANGE THIS '0.0.0.0'
    app.listen(config.port, '0.0.0.0', () => {
        console.log(`🔥🔥 Database Server connected on : ${config.databaseURL}🔥🔥 `);
        console.log(`🔥🔥 Server listening on port: ${config.port}🔥🔥 `);
    }).on('error', (err: any) => {
        console.log(err);
        process.exit(1);
    });
    const socket = socketLoader(app);
}

startServer();
