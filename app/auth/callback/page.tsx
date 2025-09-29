"use client";

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleAuthCallback = async () => {
      const supabase = createClient()

      try {
        // Handle the OAuth callback
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Auth callback error:", error)
          setError(error.message)
          setTimeout(() => {
            router.push("/auth/login?error=callback_error")
          }, 3000)
          return
        }

        if (data.session) {
          // Get user profile or create one if it doesn't exist
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.session.user.id)
            .single()

          // If profile doesn't exist, create it
          if (profileError && profileError.code === 'PGRST116') {
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: data.session.user.id,
                email: data.session.user.email,
                full_name: data.session.user.user_metadata?.full_name || data.session.user.user_metadata?.name || '',
                avatar_url: data.session.user.user_metadata?.avatar_url || data.session.user.user_metadata?.picture || '',
                user_type: 'customer',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })

            if (insertError) {
              console.error('Error creating profile:', insertError)
            }
          }

          // Redirect to intended destination or dashboard
          const redirectTo = searchParams.get('redirect_to') || '/account/dashboard'
          router.push(redirectTo)
        } else {
          router.push("/auth/login")
        }
      } catch (error) {
        console.error("Auth callback error:", error)
        setError("An unexpected error occurred during sign in")
        setTimeout(() => {
          router.push("/auth/login?error=callback_error")
        }, 3000)
      }
    }

    handleAuthCallback()
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-orange-50">
      <div className="text-center">
        {error ? (
          <div className="max-w-md mx-auto">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sign In Failed</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">Redirecting to login page...</p>
          </div>
        ) : (
          <div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Completing Sign In</h3>
            <p className="text-gray-600">Please wait while we set up your account...</p>
          </div>
        )}
      </div>
    </div>
  )
}
