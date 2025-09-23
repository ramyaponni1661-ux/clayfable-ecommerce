import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import { createClient } from "@supabase/supabase-js"

// Use service role for admin operations in auth callbacks
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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
        // Check if user exists in auth.users (Supabase Auth)
        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(user.id)

        if (authError && authError.message !== 'User not found') {
          console.error('Error checking auth user:', authError)
        }

        // Create or update user in Supabase Auth if needed
        if (!authUser?.user) {
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
          user.id = newAuthUser.user.id
        }

        // Check if profile exists in public.profiles
        const { data: existingProfile, error: fetchError } = await supabaseAdmin
          .from('profiles')
          .select('*')
          .eq('email', user.email)
          .single()

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('Error checking profile:', fetchError)
        }

        // Create profile if doesn't exist
        if (!existingProfile) {
          const { error: insertError } = await supabaseAdmin
            .from('profiles')
            .insert({
              id: user.id,
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
            console.error('Error creating profile:', insertError)
            return false
          }
        } else {
          // Update existing profile
          const { error: updateError } = await supabaseAdmin
            .from('profiles')
            .update({
              full_name: user.name || profile?.name || existingProfile.full_name,
              avatar_url: user.image || profile?.picture || existingProfile.avatar_url,
              last_sign_in_at: new Date().toISOString(),
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
      if (account && user) {
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