/**
 * IMPORTANT:
 * ---------
 * Do not manually edit this file if you'd like to host your server on Colyseus Cloud
 *
 * If you're self-hosting (without Colyseus Cloud), you can manually
 * instantiate a Colyseus Server as documented here:
 *
 * See: https://docs.colyseus.io/server/api/#constructor-options
 */
import { listen } from "@colyseus/tools";

// Import Colyseus config
import app from "./app.config";

// Create and listen on 2567 (or PORT environment variable.)
listen(app);

// ==================================================== manual setup ====================================================
// // Colyseus + Express
// import { Server } from "colyseus";
// import { createServer } from "http";
// import express from "express";
// import { MyRoom } from "./rooms/MyRoom";
// import { monitor } from "@colyseus/monitor";
// const port = Number(process.env.port) || 3000;

// const app = express();
// app.use(express.json());

// const gameServer = new Server({
//   server: createServer(app),
// });
// gameServer.define("cardcasters", MyRoom);

// app.use("./colyseus", monitor());

// gameServer.listen(port);
// console.log(`listening on ws://localhost:${port}`);
