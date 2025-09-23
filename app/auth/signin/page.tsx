"use client"

import { signIn, getSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/account/dashboard'
  const errorParam = searchParams.get('error')

  useEffect(() => {
    if (errorParam) {
      switch (errorParam) {
        case 'OAuthSignin':
          setError('Error constructing OAuth URL')
          break
        case 'OAuthCallback':
          setError('Error handling OAuth callback')
          break
        case 'OAuthCreateAccount':
          setError('Could not create OAuth account')
          break
        case 'EmailCreateAccount':
          setError('Could not create email account')
          break
        case 'Callback':
          setError('Error in OAuth callback')
          break
        case 'OAuthAccountNotLinked':
          setError('Email already exists with different provider')
          break
        case 'SessionRequired':
          setError('Please sign in to access this page')
          break
        case 'unauthorized':
          setError('You are not authorized to access this page')
          break
        default:
          setError('An authentication error occurred')
      }
    }

    // Check if user is already signed in
    getSession().then((session) => {
      if (session) {
        router.push(callbackUrl)
      }
    })
  }, [errorParam, callbackUrl, router])

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const result = await signIn('google', {
        callbackUrl,
        redirect: false
      })

      if (result?.error) {
        setError('Failed to sign in with Google')
      } else if (result?.url) {
        router.push(result.url)
      }
    } catch (error) {
      console.error('Google sign in error:', error)
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFacebookSignIn = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const result = await signIn('facebook', {
        callbackUrl,
        redirect: false
      })

      if (result?.error) {
        setError('Failed to sign in with Facebook')
      } else if (result?.url) {
        router.push(result.url)
      }
    } catch (error) {
      console.error('Facebook sign in error:', error)
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailSignIn = () => {
    router.push(`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`)
  }

  const handleTestConnection = async () => {
    try {
      setError(null)
      const response = await fetch('/api/auth/session')
      const data = await response.json()
      console.log('Session test:', data)

      // Test Supabase connection
      const supabaseResponse = await fetch('/api/test-supabase')
      const supabaseData = await supabaseResponse.json()
      console.log('Supabase test:', supabaseData)

    } catch (error) {
      console.error('Connection test failed:', error)
      setError('Connection test failed - check console for details')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-red-700 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Clayfable</h1>
              <p className="text-sm text-orange-600 font-medium">EST. 1952</p>
            </div>
          </Link>
        </div>

        <Card className="border-orange-100 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
              Welcome Back
            </CardTitle>
            <p className="text-gray-600">
              Sign in to your Clayfable account
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Social Login Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300"
                variant="outline"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                Continue with Google
              </Button>

              <Button
                onClick={handleFacebookSignIn}
                disabled={isLoading}
                className="w-full bg-[#1877F2] hover:bg-[#166fe5] text-white"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                )}
                Continue with Facebook
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or</span>
              </div>
            </div>

            {/* Email Login Button */}
            <Button
              onClick={handleEmailSignIn}
              disabled={isLoading}
              variant="outline"
              className="w-full border-orange-200 hover:bg-orange-50"
            >
              <Mail className="h-4 w-4 mr-2" />
              Continue with Email
            </Button>

            {/* Test Connection Button - Development only */}
            {process.env.NODE_ENV === 'development' && (
              <Button
                onClick={handleTestConnection}
                disabled={isLoading}
                variant="outline"
                className="w-full border-gray-200 hover:bg-gray-50 text-sm"
              >
                Test Connections (Dev)
              </Button>
            )}

            {/* Footer */}
            <div className="text-center text-sm text-gray-600 mt-6">
              Don't have an account?{' '}
              <Link
                href="/auth/signup"
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Terms */}
        <p className="text-center text-xs text-gray-500 mt-4">
          By continuing, you agree to our{' '}
          <Link href="/terms" className="text-orange-600 hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-orange-600 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}