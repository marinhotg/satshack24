import { LightsparkClient, AccountTokenAuthProvider } from "@lightsparkdev/lightspark-sdk";

if (!process.env.LIGHTSPARK_API_TOKEN_CLIENT_ID || !process.env.LIGHTSPARK_API_TOKEN_CLIENT_SECRET) {
  throw new Error('Missing Lightspark credentials in environment variables');
}

export const lightsparkClient = new LightsparkClient(
  new AccountTokenAuthProvider(
    process.env.LIGHTSPARK_API_TOKEN_CLIENT_ID,
    process.env.LIGHTSPARK_API_TOKEN_CLIENT_SECRET
  )
);