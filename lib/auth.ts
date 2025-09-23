import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import { createClient } from "@/lib/supabase/server"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile https://www.googleapis.com/auth/youtube.readonly"
        }
      }
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false

      try {
        const supabase = createClient()

        // Check if user exists
        const { data: existingUser, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', user.email)
          .single()

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('Error checking user:', fetchError)
          return false
        }

        // Create user if doesn't exist
        if (!existingUser) {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              email: user.email,
              full_name: user.name || profile?.name || '',
              avatar_url: user.image || profile?.picture || '',
              user_type: 'customer',
              is_active: true,
              provider: account?.provider || 'google',
              provider_id: account?.providerAccountId || user.id,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })

          if (insertError) {
            console.error('Error creating user:', insertError)
            return false
          }
        } else {
          // Update existing user
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              full_name: user.name || profile?.name || existingUser.full_name,
              avatar_url: user.image || profile?.picture || existingUser.avatar_url,
              last_sign_in_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('email', user.email)

          if (updateError) {
            console.error('Error updating user:', updateError)
          }
        }

        return true
      } catch (error) {
        console.error('Sign in error:', error)
        return false
      }
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        // Store additional user info in token
        const supabase = createClient()
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', user.email!)
          .single()

        if (profile) {
          token.userId = profile.id
          token.userType = profile.user_type
          token.isAdmin = profile.user_type === 'admin'
          token.isActive = profile.is_active
          token.provider = account.provider
        }

        // Store OAuth tokens for API access
        if (account.provider === 'google') {
          token.accessToken = account.access_token
          token.refreshToken = account.refresh_token
          token.accessTokenExpires = account.expires_at
        }
      }

      // Refresh access token if expired
      if (token.accessTokenExpires && Date.now() / 1000 > token.accessTokenExpires) {
        return await refreshAccessToken(token)
      }

      return token
    },
    async session({ session, token }) {
      // Send properties to the client
      session.user = {
        ...session.user,
        id: token.userId as string,
        userType: token.userType as string,
        isAdmin: token.isAdmin as boolean,
        isActive: token.isActive as boolean,
        provider: token.provider as string,
      }
      session.accessToken = token.accessToken as string
      return session
    },
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  events: {
    async signIn(message) {
      console.log('User signed in:', message.user.email)
    },
    async signOut(message) {
      console.log('User signed out:', message.token?.email)
    },
  },
}

async function refreshAccessToken(token: any) {
  try {
    const url = "https://oauth2.googleapis.com/token?" +
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      })

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    })

    const refreshedTokens = await response.json()

    if (!response.ok) {
      throw refreshedTokens
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() / 1000 + refreshedTokens.expires_in,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    }
  } catch (error) {
    console.error('Error refreshing access token:', error)
    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}