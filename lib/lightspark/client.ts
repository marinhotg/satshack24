import { LightsparkClient } from "@lightsparkdev/lightspark-sdk";

export const lightsparkClient = new LightsparkClient({
  apiTokenClientId: process.env.LIGHTSPARK_API_TOKEN_CLIENT_ID!,
  apiTokenClientSecret: process.env.LIGHTSPARK_API_TOKEN_CLIENT_SECRET!,
});