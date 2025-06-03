import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise from '@/lib/mongodb-client'

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    {
      id: 'instagram',
      name: 'Instagram',
      type: 'oauth' as const,
      clientId: process.env.INSTAGRAM_CLIENT_ID!,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET!,
      authorization: {
        url: 'https://api.instagram.com/oauth/authorize',
        params: { scope: 'user_profile,user_media' },
      },
      token: 'https://api.instagram.com/oauth/access_token',
      userinfo: {
        url: 'https://graph.instagram.com/me?fields=id,username,account_type',
        async request({ tokens }: { tokens: any }) {
          const res = await fetch(`https://graph.instagram.com/me?fields=id,username,account_type&access_token=${tokens.access_token}`)
          return res.json()
        },
      },
      profile(profile: any) {
        return {
          id: profile.id,
          name: profile.username,
          email: null,
          image: null,
        }
      },
    },
  ],
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: 'jwt' as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST } 