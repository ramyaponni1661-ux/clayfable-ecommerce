"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Home, RefreshCw } from "lucide-react"

const errorMessages: Record<string, { title: string; description: string; suggestion: string }> = {
  AccessDenied: {
    title: "Access Denied",
    description: "You denied access to your account, or there was an issue with the OAuth configuration.",
    suggestion: "Please try signing in again or contact support if the issue persists."
  },
  Configuration: {
    title: "Configuration Error",
    description: "There is a problem with the OAuth configuration.",
    suggestion: "Please contact support to resolve this issue."
  },
  Verification: {
    title: "Verification Error",
    description: "The sign-in link was invalid or has expired.",
    suggestion: "Please request a new sign-in link."
  },
  Default: {
    title: "Authentication Error",
    description: "An unexpected error occurred during authentication.",
    suggestion: "Please try again or contact support if the problem continues."
  }
}

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error") || "Default"

  const errorInfo = errorMessages[error] || errorMessages.Default

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center p-4">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 bg-white shadow-sm border-b border-orange-100">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative">
              <img
                src="/icon-transparent.png"
                alt="Clayfable Logo"
                className="h-10 w-10"
                style={{
                  display: 'block',
                  objectFit: 'contain'
                }}
                onError={(e) => {
                  e.currentTarget.src = '/icon.png';
                  e.currentTarget.onerror = function() {
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.nextElementSibling) {
                      e.currentTarget.nextElementSibling.style.display = 'block';
                    }
                  };
                }}
              />
              <div className="hidden w-10 h-10 bg-gradient-to-br from-orange-600 to-red-700 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Clayfable</h1>
              <p className="text-xs text-orange-600 font-medium">EST. 1952</p>
            </div>
          </Link>
        </div>
      </header>

      <div className="w-full max-w-md">
        <Card className="border-orange-100 shadow-xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {errorInfo.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 text-center">
              {errorInfo.description}
            </p>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-sm text-orange-800">
                <strong>What to do next:</strong> {errorInfo.suggestion}
              </p>
            </div>

            {error === "AccessDenied" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Google OAuth Setup Required</h4>
                <p className="text-sm text-blue-800">
                  If you're a developer, ensure that <code className="bg-blue-100 px-1 rounded">http://localhost:3000/api/auth/callback/google</code> is added to the authorized redirect URIs in your Google Cloud Console.
                </p>
              </div>
            )}

            <div className="flex flex-col space-y-3 pt-4">
              <Link href="/auth/signin">
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </Link>

              <Link href="/">
                <Button variant="outline" className="w-full border-orange-200 hover:bg-orange-50">
                  <Home className="h-4 w-4 mr-2" />
                  Return Home
                </Button>
              </Link>
            </div>

            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Still having trouble?{" "}
                <Link href="/contact" className="text-orange-600 hover:text-orange-700 font-medium">
                  Contact Support
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}