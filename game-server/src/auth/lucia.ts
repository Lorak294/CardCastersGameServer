import { prisma } from "@lucia-auth/adapter-prisma";
import { lucia } from "lucia";
import { express } from "lucia/middleware";
import { db } from "..";

export const auth = lucia({
  env: process.env.NODE_ENV === "developement" ? "DEV" : "PROD",
  middleware: express(),
  adapter: prisma(db),

  getUserAttributes: (data) => {
    return {
      username: data.username,
    };
  },
});

export type Auth = typeof auth;
