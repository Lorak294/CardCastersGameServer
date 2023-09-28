import { Room, Client, ClientArray } from "@colyseus/core";
import { Player, RoomState } from "./schema/MyRoomState";
import { IncomingMessage } from "http";

export class MyRoom extends Room<RoomState> {
  maxClients = 4;

  onCreate(options: any) {
    this.setState(new RoomState());

    this.onMessage("introduce", (client, data) => {
      let player = new Player(data.username, client.sessionId);
      this.state.players.set(data.id, player);
      console.log(
        client.sessionId,
        "introduced as:",
        `${data.username}[${data.id}]`
      );
    });
  }

  onAuth(client: Client, options: any, request?: IncomingMessage) {
    console.log("auth cookie", request.headers.cookie);
    return true;
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
