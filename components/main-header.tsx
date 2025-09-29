"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, ShoppingCart, User } from "lucide-react"
import Link from "next/link"
import { UserProfile } from "@/components/user-profile"

interface MainHeaderProps {
  cartCount?: number
  className?: string
}

export default function MainHeader({ cartCount = 0, className = "" }: MainHeaderProps) {
  const { data: session, status } = useSession()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [currentCartCount, setCurrentCartCount] = useState(cartCount)
  const pathname = usePathname()

  useEffect(() => {
    // Load cart count from localStorage if not provided
    if (cartCount === 0) {
      const cartItems = localStorage.getItem("cartItems")
      if (cartItems) {
        const parsed = JSON.parse(cartItems)
        const totalCount = Object.values(parsed).reduce((sum: number, qty: any) => sum + qty, 0)
        setCurrentCartCount(totalCount)
      }
    } else {
      setCurrentCartCount(cartCount)
    }
  }, [cartCount])

  const isActivePath = (path: string) => {
    return pathname === path
  }

  return (
    <header className={`bg-white/90 backdrop-blur-md shadow-sm border-b border-orange-100 sticky top-0 z-50 transition-all duration-300 ${className}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo - Responsive */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative">
              <img
                src="/icon-transparent.png"
                alt="Clayfable Logo"
                className="h-10 w-10 md:h-14 md:w-14 hover:scale-105 transition-transform"
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
              <div className="hidden w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-orange-600 to-red-700 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg md:text-xl">C</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="text-lg md:text-2xl font-bold text-gray-900">Clayfable</div>
              <p className="text-xs text-orange-600 font-medium">EST. 1952</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/products" className={`font-medium transition-colors ${
              isActivePath('/products')
                ? 'text-orange-600 border-b-2 border-orange-600 pb-1'
                : 'text-gray-700 hover:text-orange-600'
            }`}>
              Products
            </Link>
            <Link href="/collections" className={`font-medium transition-colors ${
              isActivePath('/collections')
                ? 'text-orange-600 border-b-2 border-orange-600 pb-1'
                : 'text-gray-700 hover:text-orange-600'
            }`}>
              Collections
            </Link>
            <Link href="/b2b" className={`font-medium transition-colors ${
              isActivePath('/b2b')
                ? 'text-orange-600 border-b-2 border-orange-600 pb-1'
                : 'text-gray-700 hover:text-orange-600'
            }`}>
              B2B Portal
            </Link>
            <Link href="/about" className={`font-medium transition-colors ${
              isActivePath('/about')
                ? 'text-orange-600 border-b-2 border-orange-600 pb-1'
                : 'text-gray-700 hover:text-orange-600'
            }`}>
              Our Story
            </Link>
            <Link href="/contact" className={`font-medium transition-colors ${
              isActivePath('/contact')
                ? 'text-orange-600 border-b-2 border-orange-600 pb-1'
                : 'text-gray-700 hover:text-orange-600'
            }`}>
              Contact
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {status === "loading" ? (
              <div className="w-20 h-9 bg-gray-200 rounded-md animate-pulse" />
            ) : session ? (
              <UserProfile />
            ) : (
              <Link href="/auth/signin">
                <Button variant="outline" size="sm" className="border-orange-200 hover:bg-orange-50 hover:border-orange-300 transition-all duration-200 hover:scale-105">
                  <User className="h-4 w-4 mr-1" />
                  Sign In
                </Button>
              </Link>
            )}
            <Link href="/cart">
              <Button className="bg-orange-600 hover:bg-orange-700" size="sm">
                <ShoppingCart className="h-4 w-4 mr-1" />
                Cart ({currentCartCount})
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-orange-100">
            <nav className="flex flex-col space-y-3 mt-4">
              <Link
                href="/products"
                className={`font-medium py-2 px-2 rounded transition-colors ${
                  isActivePath('/products')
                    ? 'text-orange-600 bg-orange-100 border-l-4 border-orange-600'
                    : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/collections"
                className={`font-medium py-2 px-2 rounded transition-colors ${
                  isActivePath('/collections')
                    ? 'text-orange-600 bg-orange-100 border-l-4 border-orange-600'
                    : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Collections
              </Link>
              <Link
                href="/b2b"
                className={`font-medium py-2 px-2 rounded transition-colors ${
                  isActivePath('/b2b')
                    ? 'text-orange-600 bg-orange-100 border-l-4 border-orange-600'
                    : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                B2B Portal
              </Link>
              <Link
                href="/about"
                className={`font-medium py-2 px-2 rounded transition-colors ${
                  isActivePath('/about')
                    ? 'text-orange-600 bg-orange-100 border-l-4 border-orange-600'
                    : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Our Story
              </Link>
              <Link
                href="/contact"
                className={`font-medium py-2 px-2 rounded transition-colors ${
                  isActivePath('/contact')
                    ? 'text-orange-600 bg-orange-100 border-l-4 border-orange-600'
                    : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>

            {/* Mobile Actions */}
            <div className="flex flex-col space-y-2 mt-4 pt-4 border-t border-orange-100">
              {session ? (
                <div className="p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{session.user?.name || 'User'}</p>
                      <p className="text-xs text-gray-600">{session.user?.email}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Link href="/account/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="flex-1 border-orange-200">
                        Dashboard
                      </Button>
                    </Link>
                    <Link href="/account/orders" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="flex-1 border-orange-200">
                        Orders
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <Link href="/auth/signin" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full border-orange-200 hover:bg-orange-50">
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
              )}
              <Link href="/cart" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full bg-orange-600 hover:bg-orange-700" size="sm">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart ({currentCartCount})
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}