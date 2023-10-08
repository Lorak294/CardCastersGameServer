import { Room, Client } from "@colyseus/core";
import { Card, Player, RoomState } from "./schema/RoomState";
import { IncomingMessage } from "http";
import { db } from "../database";
import { auth } from "../auth/lucia";
import { LuciaError } from "lucia";

export class CardcastersRoom extends Room<RoomState> {
  maxClients = 10;

  onCreate(options: any) {
    this.setState(new RoomState());

    this.onMessage("addDeck", async (client, data) => {
      try {
        // get deck from the db
        const deck = await db.deck.findFirstOrThrow({
          where: { id: data.deckId },
          include: { Card: true },
        });
        console.log("Deck found!", deck);
        // add deck to room state
        deck.Card.forEach((card) => {
          let newCard = new Card(card.id, card.text, card.isAnswer);
          if (newCard.isAnswer) this.state.answersDeck.push(newCard);
          else this.state.questionsDeck.push(newCard);
        });
        console.log("Cards added!");
      } catch (err) {
        console.error(`Error adding deck for id:${data.deckId}`, err);
        return;
      }
    });
  }

  async onAuth(client: Client, options: any, request?: IncomingMessage) {
    //console.log("auth cookie", request.headers.cookie);

    try {
      const session = await auth.validateSession(request.headers.cookie);
      if (session.state === "active") {
        // session valid
        return true;
      }
      // idle session
      // should be reset
      return false;
    } catch (err) {
      if (
        err instanceof LuciaError &&
        err.message === `AUTH_INVALID_SESSION_ID`
      ) {
        // invalid session
        console.log("invalid session!");
      }
      // database errors
      console.log("db error!");
    }
  }

  onJoin(client: Client, options: any) {
    // check if player already has been connected to the room
    if (this.state.players.has(options.id)) {
      // end previous connection and overwrite the players sessionId
      let player = this.state.players.get(options.id);

      this.clients.getById(player.sessionId)?.leave();
      player.sessionId = client.sessionId;
      this.state.players.set(options.id, player);
      console.log(
        client.sessionId,
        "re-joined as:",
        `${options.username}[${options.id}]`
      );
      return;
    }
    // new connection for a new player
    let player = new Player(options.username, client.sessionId);
    this.state.players.set(options.id, player);
    console.log(
      client.sessionId,
      "joined as:",
      `${options.username}[${options.id}]`
    );
  }

  onLeave(client: Client, consented: boolean) {
    //if (consented) this.state.removePlayer(client.sessionId);
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
