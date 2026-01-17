import { type NextAuthOptions, type Session } from "next-auth";
import { type JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { MongoClient, ObjectId } from "mongodb";
import { type User } from "next-auth";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add MONGODB_URI to .env.local");
}

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Please add Google OAuth credentials to .env.local");
}

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("Please add NEXTAUTH_SECRET to .env.local");
}

let cachedClient: MongoClient | null = null;

async function getMongoClient() {
  if (!cachedClient) {
    cachedClient = new MongoClient(process.env.MONGODB_URI!);
    await cachedClient.connect();
  }
  return cachedClient;
}

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(getMongoClient()),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: false,
    }),
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            allowDangerousEmailAccountLinking: true,
            authorization: {
              params: {
                scope: "read:user user:email repo",
              },
            },
          }),
        ]
      : []),
  ] as any,
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 60, // Update session every minute
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Allow both Google and GitHub providers
      if (account?.provider === "google" || account?.provider === "github") {
        if (profile?.email && account?.providerAccountId) {
          console.log(
            `[AUTH] ${account.provider} sign-in for: ${profile.email} (Provider ID: ${account.providerAccountId})`
          );
          return true;
        }
      }

      return false;
    },
    async session({ session, user, token }: { session: Session; user: User; token: any }) {
      // CRITICAL: Always fetch fresh user data from database to prevent stale sessions
      if (session?.user) {
        // Ensure user ID is set correctly
        session.user.id = user.id;
        // Use the database user data, not cached session data
        session.user.email = user.email;
        session.user.name = user.name;
        session.user.image = user.image;
        
        // Fetch GitHub access token from database for existing sessions
        // This is needed because with database strategy, the JWT token isn't always passed to session callback
        try {
          const client = await getMongoClient();
          const db = client.db("basecompose");
          
          // Convert user.id string to MongoDB ObjectId
          let userObjectId;
          try {
            userObjectId = new ObjectId(user.id);
          } catch (e) {
            console.error("[AUTH] Failed to convert user ID to ObjectId:", user.id, e);
            userObjectId = user.id as any; // Fallback to string
          }
          
          // Try to find GitHub account
          const account = await db.collection("accounts").findOne({
            userId: userObjectId,
            provider: "github",
          });
          
          if (process.env.NODE_ENV === "development") {
            if (account) {
              console.log(`[AUTH] ✅ Found GitHub account for userId: ${userObjectId}`);
            } else {
              console.log(`[AUTH] ❌ No GitHub account found for userId: ${userObjectId}`);
            }
          }
          
          if (account?.access_token) {
            (session as any).accessToken = account.access_token;
            (session as any).provider = "github";
          }
        } catch (error) {
          console.error("[AUTH] Failed to fetch GitHub token from database:", error);
        }
        
        // Fallback: check token param (for JWT strategy or fresh sign-ins)
        if (token?.accessToken && !((session as any).accessToken)) {
          (session as any).accessToken = token.accessToken;
          (session as any).provider = token.provider;
        }
        
        // Debug logging in development
        if (process.env.NODE_ENV === "development") {
          console.log(`[AUTH] Session updated for user: ${user.email} (ID: ${user.id})`);
          if ((session as any).accessToken) {
            console.log(`[AUTH] ✅ GitHub access token available for: ${user.email}`);
          } else {
            console.log(`[AUTH] ⚠️ No GitHub access token available for: ${user.email}`);
          }
        }
      }
      return session;
    },
    async jwt({ token, user, account }) {
      // Add user info to JWT on sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      // Store provider access tokens for later use
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }
      return token;
    },
  },
  events: {
    async signIn({ user, account }) {
      console.log(`[AUTH] User signed in: ${user.email} via ${account?.provider}`);
    },
    async signOut() {
      console.log("[AUTH] User signed out");
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  debug: process.env.NODE_ENV === "development",
};
