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

  constructor(username: string, sessionId: string) {
    super();
    this.username = username;
    this.sessionId = sessionId;
    this.score = 0;
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
// room state
export class RoomState extends Schema {
  @type([Card]) answersDeck = new ArraySchema<Card>();
  @type([Card]) questionsDeck = new ArraySchema<Card>();
  @type({ map: Player }) players = new MapSchema<Player>();
}
