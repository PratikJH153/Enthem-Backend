import "reflect-metadata";
import express from "express";
import config from "./config";
import socketLoader from "./loaders/socket";

async function startServer() {
    const app = express();
    await require('./loaders').default({ expressApp: app });

    app.listen(config.port, () => {
        console.log(`🔥🔥 Database Server connected & available on : ${config.databaseURL}🔥🔥 `);
        console.log(`🔥🔥 Server listening on port: ${config.port}🔥🔥 `);
    }).on('error', (err: any) => {
        console.log(err);
        process.exit(1);
    });
    const socket = socketLoader(app);
}

startServer();
