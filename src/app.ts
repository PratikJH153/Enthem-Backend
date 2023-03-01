import express from "express";
import config from "./config";

async function startServer() {
    const app = express();

    await require('./loaders').default({ expressApp: app });

    app.listen(config.port, () => {
        console.log(`🔥🔥 Database Server connected on : ${config.databaseURL}🔥🔥 `);
        console.log(`🔥🔥 Server listening on port: ${config.port}🔥🔥 `);
    }).on('error', (err: any) => {
        console.log(err);
        process.exit(1);
    });
}

startServer();
