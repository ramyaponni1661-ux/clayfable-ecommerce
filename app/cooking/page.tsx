"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function CookingPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to collections page with cooking filter
    router.replace("/collections?category=cooking")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Redirecting to Cooking Collection...</h1>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
      </div>
    </div>
  )
}