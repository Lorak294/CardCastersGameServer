import {
  Schema,
  ArraySchema,
  MapSchema,
  Context,
  type,
} from "@colyseus/schema";

// player object
export class Player extends Schema {
  @type("string") username: string;
  @type("number") score: number;
  @type("string") sessionId: string;
  @type("boolean") connected: boolean;

  constructor(username: string, sessionId: string) {
    super();
    this.username = username;
    this.sessionId = sessionId;
    this.score = 0;
    this.connected = true;
  }
}
// card object
export class Card extends Schema {
  @type("string") text: string;
  @type("string") id: string;
  @type("boolean") isAnswer: boolean;

  constructor(id: string, text: string, isAnswer: boolean) {
    super();
    this.id = id;
    this.text = text;
    this.isAnswer = isAnswer;
  }
}

// gamestate (wierd workaround due to lack of enum support - may be slow idk)
export class GameState extends Schema {
  @type("number") gameState: number;

  constructor() {
    super();
    this.gameState = this.SETUP();
  }

  CHOOSING_BEST_ANSWER(): number {
    return 0;
  }
  WAITING_FOR_ANSWERS(): number {
    return 1;
  }
  SETUP(): number {
    return 2;
  }
}

// room state
export class RoomState extends Schema {
  @type([Card]) answersDeck = new ArraySchema<Card>();
  @type([Card]) questionsDeck = new ArraySchema<Card>();
  @type({ map: Player }) players = new MapSchema<Player>();
  @type(GameState) gameState = new GameState();

  removePlayer(sessionId: string) {
    const id = this.getPlayerIdFromSessionId(sessionId);
    if (id) this.players.delete(id);
  }

  getPlayerIdFromSessionId(sId: string): string | undefined {
    const playerEntry = [...this.players.entries()].find(
      ([, { sessionId }]) => sessionId === sId
    );
    if (playerEntry) return playerEntry[0];
    else return undefined;
  }
}
