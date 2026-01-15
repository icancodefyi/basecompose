import { type NextAuthOptions, type Session } from "next-auth";
import { type JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { MongoClient } from "mongodb";
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
  ],
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 60, // Update session every minute
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Only allow google provider
      if (account?.provider !== "google") {
        return false;
      }

      // The adapter will handle duplicate prevention
      // Just verify it's a valid Google auth
      if (profile?.email && account?.providerAccountId) {
        console.log(
          `[AUTH] Google sign-in for: ${profile.email} (Provider ID: ${account.providerAccountId})`
        );
        return true;
      }

      return false;
    },
    async session({ session, user }: { session: Session; user: User }) {
      // CRITICAL: Always fetch fresh user data from database to prevent stale sessions
      if (session?.user) {
        // Ensure user ID is set correctly
        session.user.id = user.id;
        // Use the database user data, not cached session data
        session.user.email = user.email;
        session.user.name = user.name;
        session.user.image = user.image;
        
        // Debug logging in development
        if (process.env.NODE_ENV === "development") {
          console.log(`[AUTH] Session updated for user: ${user.email} (ID: ${user.id})`);
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
      // Refresh token if account is present (during sign in)
      if (account) {
        token.accessToken = account.access_token;
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
