"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function CustomPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to contact page for custom orders
    router.replace("/contact?inquiry=custom-orders")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Redirecting to Custom Orders...</h1>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
      </div>
    </div>
  )
}