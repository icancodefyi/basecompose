import { NextAuthOptions } from "next-auth";

export const authConfig: NextAuthOptions = {
  providers: [
    {
      id: "github",
      name: "GitHub",
      type: "oauth",
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      wellKnown: "https://github.com/login/oauth/authorize"
    }
  ]
};
