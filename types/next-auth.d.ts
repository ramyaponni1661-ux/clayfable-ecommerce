import { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      userType: string
      isAdmin: boolean
      isActive: boolean
      provider: string
    } & DefaultSession["user"]
    accessToken?: string
  }

  interface User extends DefaultUser {
    userType?: string
    isAdmin?: boolean
    isActive?: boolean
    provider?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    userId?: string
    userType?: string
    isAdmin?: boolean
    isActive?: boolean
    provider?: string
    accessToken?: string
    refreshToken?: string
    accessTokenExpires?: number
  }
}