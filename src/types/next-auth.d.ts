import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

interface InstagramProfile {
  id: string
  username: string
  account_type: string
}

interface InstagramTokens {
  access_token: string
  token_type: string
  expires_in: number
} 