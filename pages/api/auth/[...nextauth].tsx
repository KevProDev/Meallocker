import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../lib/prisma";
import { server } from "../../../config";

import { OAuthConfig } from "next-auth/providers";

// const prisma = new PrismaClient();

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    // EmailProvider({
    //   server: {
    //     host: process.env.EMAIL_SERVER_HOST,
    //     port: process.env.EMAIL_SERVER_PORT,
    //     auth: {
    //       user: process.env.EMAIL_SERVER_USER,
    //       pass: process.env.EMAIL_SERVER_PASSWORD,
    //     },
    //   },
    // }),
    CredentialsProvider({
      id: "domain-login",
      name: "Meallocker Account",
      async authorize(credentials, req) {
        const res = await fetch(`${server}/api/account/signIn`, {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" },
        });
        const user = await res.json();

        // If no error and we have user data, return it
        if (res.ok && user) {
          return user;
        }
        // Return null if user data could not be retrieved
        return null;
      },
      credentials: {
        email: {
          label: "email",
          type: "email",
          placeholder: "jsmith@example.com",
        },
        username: {
          label: "Username",
          type: "text ",
          placeholder: "jsmith",
          // value: "Demo",
        },
        password: { label: "Password", type: "password" },
      },
    }),
    CredentialsProvider({
      id: "create-account",
      name: "Meallocker Account",
      async authorize(credentials, req) {
        const res = await fetch(`${server}/api/account/createUser`, {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" },
        });
        const user = await res.json();

        // If no error and we have user data, return it
        if (res.ok && user) {
          return user;
        }
        // Return null if user data could not be retrieved
        return null;
      },
      credentials: {
        email: {
          label: "email",
          type: "email",
          placeholder: "jsmith@example.com",
        },
        name: {
          label: "name",
          type: "text ",
          placeholder: "jsmith",
          // value: "Demo",
        },
        password: { label: "Password", type: "password" },
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET,
  database: process.env.DATABASE_URL,
  jwt: {
    // encryption: true,
    secret: process.env.SECRET,
  },
  session: {
    // Use JSON Web Tokens for session instead of database sessions.
    jwt: true,
    strategy: "jwt",

    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      // first time jwt callback is run, user object is available
      if (account && user) {
        token.accessToken = account.access_token;
        token.id = user.id;

        // return {
        //   ...token,
        //   accessToken: user.data.token,
        //   refreshToken: user.data.refreshToken,
        // };
      }

      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, user, token }) {
      if (token) {
        // session.accessToken = token.accessToken;
        session.id = token.id;
        return session;
      }
    },
  },
  pages: {
    signIn: "/loginSignIn",
  },
});
