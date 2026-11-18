import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";
const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db(process.env.DB_NAME);
export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [
    process.env.BETTER_AUTH_URL as string,
    "http://localhost:3000",
  ],
  emailAndPassword: { enabled: true },
  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "customer" },
      phone: { type: "string", required: false },
      area: { type: "string", required: false },
      bio: { type: "string", required: false },
    },
  },
  databaseHooks: {
    user: {
      create: {
        // Sign up-এর সময়: technician ছাড় া সব িকছু 'customer' হেয় যােব
        before: async (user) => {
          const role = user.role === "technician" ? "technician" : "customer";
          return { data: { ...user, role } };
        },
      },
      update: {
        // কউ BetterAuth-এর update-user িদেয় িনেজর role বদলােত চাইেল আটকাও
        before: async (data) => {
          if ("role" in data) return false;
          return { data };
        },
      },
    },
  },
  plugins: [nextCookies()], // সবসময় শেষ
});
