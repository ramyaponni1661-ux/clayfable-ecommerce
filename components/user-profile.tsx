"use client";

import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { User, Settings, LogOut, Shield, Crown, Package, Heart, Bell, HelpCircle, Gift, ChevronRight } from "lucide-react"
import Link from "next/link"

export function UserProfile() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
        <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex items-center space-x-2">
        <Link href="/auth/signin">
          <Button variant="outline" size="sm">
            Sign In
          </Button>
        </Link>
        <Link href="/auth/signup">
          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
            Sign Up
          </Button>
        </Link>
      </div>
    )
  }

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: '/', redirect: true })
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative group">
          {/* Avatar with Gradient Ring */}
          <div className="relative p-0.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all duration-300 hover:scale-105">
            <Avatar className="h-9 w-9 md:h-10 md:w-10 border-2 border-white">
              <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
              <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white font-bold">
                {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            {/* Online Indicator */}
            <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full animate-pulse" />
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-80 z-[100] bg-white border-none shadow-2xl rounded-2xl overflow-hidden p-0"
        align="end"
        sideOffset={8}
        forceMount
      >
        {/* Profile Header with Gradient */}
        <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 p-6 pb-16">
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-12 -mb-12" />
          </div>

          <div className="relative flex items-start space-x-4">
            <Avatar className="h-14 w-14 border-3 border-white shadow-xl">
              <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
              <AvatarFallback className="bg-white text-orange-600 font-bold text-xl">
                {session?.user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-white font-bold text-lg leading-tight">
                  {session?.user?.name || "User"}
                </h3>
                {session?.user?.isAdmin && (
                  <Badge className="bg-yellow-400 text-yellow-900 border-none font-bold px-2 py-0.5 text-xs">
                    <Crown className="w-3 h-3 mr-0.5" />
                    Admin
                  </Badge>
                )}
              </div>
              <p className="text-white/90 text-sm truncate max-w-[180px]">
                {session?.user?.email}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse" />
                  Active
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="flex justify-center -mt-12 relative z-10 mx-4">
          <Link href="/account/orders" className="bg-white rounded-lg p-4 text-center hover:bg-orange-50 transition-colors cursor-pointer shadow-lg flex-1 max-w-[200px]">
            <Package className="h-6 w-6 text-orange-600 mx-auto mb-1" />
            <p className="text-sm font-semibold text-gray-900">My Orders</p>
            <p className="text-xs text-gray-500 mt-0.5">View all orders</p>
          </Link>
        </div>

        {/* Menu Items */}
        <div className="p-2 mt-2">
          <DropdownMenuItem asChild>
            <Link href="/account/dashboard" className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-orange-50 transition-all duration-200 group cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                  <User className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">Account Dashboard</p>
                  <p className="text-xs text-gray-500">View profile and orders</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-orange-600 transition-colors" />
            </Link>
          </DropdownMenuItem>

          {session?.user?.isAdmin && (
            <>
              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuItem asChild>
                <Link href="/admin" className="flex items-center justify-between px-4 py-3 rounded-lg bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 transition-all duration-200 group cursor-pointer border border-orange-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-600 rounded-lg">
                      <Shield className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-orange-900">Admin Panel</p>
                      <p className="text-xs text-orange-700">Manage store</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-orange-600" />
                </Link>
              </DropdownMenuItem>
            </>
          )}
        </div>

        {/* Footer */}
        <DropdownMenuSeparator className="my-0" />
        <div className="p-2">
          <DropdownMenuItem
            onClick={handleSignOut}
            className="flex items-center justify-center px-4 py-3 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-semibold cursor-pointer transition-all duration-200 group"
          >
            <LogOut className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}