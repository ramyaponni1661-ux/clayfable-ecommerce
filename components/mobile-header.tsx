"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, ShoppingCart, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { UserProfile } from "@/components/user-profile"
import NotificationSystem from "@/components/notification-system"

interface MobileHeaderProps {
  showBackButton?: boolean
  backUrl?: string
  backText?: string
  showCart?: boolean
  cartCount?: number
  showNavigation?: boolean
}

export default function MobileHeader({
  showBackButton = false,
  backUrl = "/",
  backText = "Back",
  showCart = true,
  cartCount = 0,
  showNavigation = true
}: MobileHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-orange-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative">
              <img
                src="/icon-transparent.png"
                alt="Clayfable Logo"
                className="h-8 w-8 md:h-12 md:w-12 hover-glow"
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
              <div className="hidden w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-orange-600 to-red-700 rounded-full flex items-center justify-center hover-glow">
                <span className="text-white font-bold text-sm md:text-lg">C</span>
              </div>
            </div>
            <div className="block">
              <h1 className="text-sm sm:text-lg md:text-xl font-bold text-gray-900">Clayfable</h1>
              <p className="text-xs text-orange-600 font-medium">EST. 1952</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {showNavigation && (
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              <Link href="/products" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
                Products
              </Link>
              <Link href="/collections" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
                Collections
              </Link>
              <Link href="/b2b" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
                B2B Portal
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
                Our Story
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
                Contact
              </Link>
            </nav>
          )}

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-3">
              {showNavigation && <NotificationSystem />}
              <UserProfile />
            </div>

            {/* Back Button */}
            {showBackButton && (
              <Link href={backUrl}>
                <Button variant="outline" size="sm" className="flex items-center space-x-1 px-2 md:px-3">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">{backText}</span>
                </Button>
              </Link>
            )}

            {/* Cart Button */}
            {showCart && (
              <Link href="/cart">
                <Button size="sm" variant="outline" className="border-orange-200 hover:bg-orange-50 flex items-center space-x-1 px-2 md:px-3">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="hidden sm:inline">Cart</span>
                  {cartCount > 0 && (
                    <span className="bg-orange-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>
            )}

            {/* Mobile User Profile */}
            <div className="md:hidden">
              <UserProfile />
            </div>

            {/* Mobile Menu Button */}
            {showNavigation && (
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {showNavigation && isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-orange-100 shadow-lg animate-slideDown">
            <nav className="container mx-auto px-4 py-6 space-y-4">
              <Link
                href="/products"
                className="block text-gray-700 hover:text-orange-600 font-medium py-2 border-b border-gray-100 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/collections"
                className="block text-gray-700 hover:text-orange-600 font-medium py-2 border-b border-gray-100 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Collections
              </Link>
              <Link
                href="/b2b"
                className="block text-gray-700 hover:text-orange-600 font-medium py-2 border-b border-gray-100 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                B2B Portal
              </Link>
              <Link
                href="/about"
                className="block text-gray-700 hover:text-orange-600 font-medium py-2 border-b border-gray-100 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Our Story
              </Link>
              <Link
                href="/contact"
                className="block text-gray-700 hover:text-orange-600 font-medium py-2 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>

              {/* Mobile Notifications */}
              <div className="pt-4 border-t border-gray-100">
                <NotificationSystem />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}