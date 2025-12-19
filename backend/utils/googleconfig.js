import {google} from "googleapis"

const GOOGLE_CLIENT_ID= process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

const redirectUri =
  process.env.NODE_ENV === "production"
    ? "https://fitnow-zsfx.onrender.com/auth/google/callback"
    : "http://localhost:3000/auth/google/callback";

export const oauth2client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  redirectUri
);
