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
//import { listen } from "@colyseus/tools";

// Import Colyseus config
//import app from "./app.config";

// Create and listen on 2567 (or PORT environment variable.)
//listen(app);

// ==================================================== manual setup ====================================================
// Colyseus + Express
import { Server } from "colyseus";
import { createServer } from "http";
import express from "express";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";
import { CardcastersRoom } from "./rooms/CardcastersRoom";
import { PrismaClient } from "@prisma/client/edge";

require("dotenv").config();
export const db = new PrismaClient();

const port = Number(process.env.PORT) || 3000;

// init express
const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use("/colyseus", monitor());
if (process.env.NODE_ENV !== "production") {
  app.use("/", playground);
}

// define rooms
const gameServer = new Server({
  server: createServer(app),
});
// define room handlers
gameServer.define("cardcasters", CardcastersRoom).filterBy(["roomCode"]);

// listen
gameServer.listen(port);
console.log(`listening on ws://localhost:${port}`);
