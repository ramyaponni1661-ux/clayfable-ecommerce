import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import { createClient } from "@supabase/supabase-js"

// Use service role for admin operations in auth callbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

export const authOptions: NextAuthOptions = {
  debug: true,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!.trim(),
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile"
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
      console.log("SignIn callback:", { user, account, profile })
      if (!user.email || !supabaseAdmin) {
        console.log("Sign in failed: No email or supabase admin not configured")
        return false
      }

      try {
        // Check if profile exists first using provider info
        const { data: existingProfile, error: fetchError } = await supabaseAdmin
          .from('profiles')
          .select('*')
          .eq('email', user.email)
          .single()

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('Error checking profile:', fetchError)
        }

        let supabaseUserId = existingProfile?.id

        // Create user in Supabase Auth if no profile exists
        if (!existingProfile) {
          const { data: newAuthUser, error: createAuthError } = await supabaseAdmin.auth.admin.createUser({
            email: user.email!,
            email_confirm: true,
            user_metadata: {
              full_name: user.name || profile?.name || '',
              avatar_url: user.image || profile?.picture || '',
              provider: account?.provider || 'google',
              provider_id: account?.providerAccountId
            }
          })

          if (createAuthError) {
            console.error('Error creating auth user:', createAuthError)
            return false
          }

          supabaseUserId = newAuthUser.user.id
          user.id = newAuthUser.user.id

          // Create profile for new user
          const { error: insertError } = await supabaseAdmin
            .from('profiles')
            .insert({
              id: supabaseUserId,
              email: user.email,
              full_name: user.name || profile?.name || '',
              avatar_url: user.image || profile?.picture || '',
              user_type: 'customer',
              provider: account?.provider || 'google',
              provider_id: account?.providerAccountId || user.id,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })

          if (insertError) {
            console.error('Error creating profile:', insertError)
            return false
          }
        } else {
          // Update existing profile and use existing Supabase user ID
          user.id = supabaseUserId

          const { error: updateError } = await supabaseAdmin
            .from('profiles')
            .update({
              full_name: user.name || profile?.name || existingProfile.full_name,
              avatar_url: user.image || profile?.picture || existingProfile.avatar_url,
              updated_at: new Date().toISOString()
            })
            .eq('email', user.email)

          if (updateError) {
            console.error('Error updating profile:', updateError)
          }
        }

        return true
      } catch (error) {
        console.error('Sign in error:', error)
        return false
      }
    },
    async jwt({ token, user, account }) {
      if (account && user && supabaseAdmin) {
        // Store additional user info in token
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('*')
          .eq('email', user.email!)
          .single()

        if (profile) {
          token.userId = profile.id
          token.userType = profile.user_type
          token.isAdmin = profile.user_type === 'admin'
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
        provider: token.provider as string,
      }
      session.accessToken = token.accessToken as string
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
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