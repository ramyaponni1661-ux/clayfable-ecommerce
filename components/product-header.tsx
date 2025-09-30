"use client";

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  ShoppingCart,
  ChevronDown,
  Menu,
  X
} from "lucide-react"
import Link from "next/link"
import { UserProfile } from "@/components/user-profile"
import NotificationSystem from "@/components/notification-system"
import CartSidebar from "@/components/cart-sidebar"
import { useCartCount } from "@/contexts/CartContext"

interface ProductHeaderProps {
  className?: string
  cartCount?: number // Legacy prop, now optional since we use context
}

interface NavigationItem {
  name: string
  href: string
  description: string
  price?: number
}

interface NavigationCategory {
  name: string
  href?: string
  items: NavigationItem[]
}

interface NavigationData {
  productCategories: NavigationCategory[]
  collections: NavigationCategory[]
}


export default function ProductHeader({ className = "" }: ProductHeaderProps) {
  const { data: session } = useSession()
  const cartCount = useCartCount()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isCartSidebarOpen, setIsCartSidebarOpen] = useState(false)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [navigationData, setNavigationData] = useState<NavigationData | null>(null)
  const [isLoadingNavigation, setIsLoadingNavigation] = useState(true)

  const handleDropdownClick = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown)
  }

  const handleDropdownClose = () => {
    setActiveDropdown(null)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      try {
        const target = event.target as Element
        if (!target?.closest('.dropdown-container')) {
          setActiveDropdown(null)
        }
      } catch (error) {
        console.warn('ProductHeader: Error in handleClickOutside:', error)
      }
    }

    if (activeDropdown && typeof window !== 'undefined' && document) {
      document.addEventListener('click', handleClickOutside)
      return () => {
        if (typeof window !== 'undefined' && document) {
          document.removeEventListener('click', handleClickOutside)
        }
      }
    }
  }, [activeDropdown])

  useEffect(() => {
    const handleScroll = () => {
      try {
        const currentScrollY = window.scrollY

        if (currentScrollY < lastScrollY || currentScrollY < 100) {
          // Scrolling up or near top - show header
          setIsHeaderVisible(true)
        } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
          // Scrolling down and past 100px - hide header
          setIsHeaderVisible(false)
        }

        setLastScrollY(currentScrollY)
      } catch (error) {
        console.warn('ProductHeader: Error in handleScroll:', error)
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll, { passive: true })
      return () => {
        if (typeof window !== 'undefined') {
          window.removeEventListener('scroll', handleScroll)
        }
      }
    }
  }, [lastScrollY])
  const pathname = usePathname()



  // Load navigation data
  useEffect(() => {
    async function fetchNavigationData() {
      try {
        const response = await fetch('/api/navigation')
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setNavigationData(data.navigation)
          }
        }
      } catch (error) {
        console.error('Failed to load navigation data:', error)
      } finally {
        setIsLoadingNavigation(false)
      }
    }

    fetchNavigationData()
  }, [])


  // Fallback data while loading or if API fails
  const fallbackProductCategories = [
    {
      name: "Traditional Pottery",
      items: [
        { name: "Cooking Pots", href: "/cooking", description: "Authentic clay cooking vessels" },
        { name: "Water Storage Vessels", href: "/water-storage", description: "Cool and pure water storage" },
        { name: "Clay Ovens", href: "/ovens", description: "Traditional tandoor and baking ovens" },
        { name: "Storage Containers", href: "/storage", description: "Keep food fresh naturally" },
        { name: "Tandoor Accessories", href: "/tandoor-accessories", description: "Complete tandoor setup items" },
        { name: "Traditional Griddles", href: "/traditional-griddles", description: "Clay tawa and cooking surfaces" },
        { name: "Fermentation Pots", href: "/fermentation-pots", description: "For traditional food preparation" }
      ]
    },
    {
      name: "Decorative Items",
      items: [
        { name: "Vases & Planters", href: "/vases-planters", description: "Beautiful home and garden decor" },
        { name: "Wall Art", href: "/wall-art", description: "Handcrafted terracotta wall pieces" },
        { name: "Garden Decor", href: "/garden-decor", description: "Transform your outdoor space" },
        { name: "Figurines", href: "/figurines", description: "Traditional and modern sculptures" },
        { name: "Table Centerpieces", href: "/table-centerpieces", description: "Elegant dining table decor" },
        { name: "Wind Chimes", href: "/wind-chimes", description: "Musical terracotta ornaments" },
        { name: "Hanging Planters", href: "/hanging-planters", description: "Suspended garden pottery" },
        { name: "Decorative Lamps", href: "/decorative-lamps", description: "Traditional clay lighting" }
      ]
    },
    {
      name: "Serving Ware",
      items: [
        { name: "Bowls & Plates", href: "/serving", description: "Elegant dining essentials" },
        { name: "Cups & Mugs", href: "/cups-mugs", description: "Perfect for beverages" },
        { name: "Serving Sets", href: "/serving-sets", description: "Complete serving solutions" },
        { name: "Dinnerware", href: "/dinnerware", description: "Complete dining sets" },
        { name: "Tea Sets", href: "/tea-sets", description: "Traditional clay tea service" },
        { name: "Wine & Bar Accessories", href: "/wine-bar-accessories", description: "Clay wine coolers and glasses" },
        { name: "Spice Containers", href: "/spice-containers", description: "Keep spices fresh and flavorful" },
        { name: "Butter Churns", href: "/butter-churns", description: "Traditional dairy equipment" }
      ]
    }
  ]

  const fallbackCollections = [
    { name: "Heritage Collection", href: "/collections/heritage", description: "Traditional designs from 1952" },
    { name: "Modern Fusion", href: "/collections/modern", description: "Contemporary meets traditional" },
    { name: "Wedding Collection", href: "/collections/wedding", description: "Special occasion pottery" },
    { name: "Artisan Specials", href: "/collections/artisan", description: "Exclusive handcrafted pieces" }
  ]

  // Use fallback categories for consistent navigation - no dynamic changes
  const productCategories = fallbackProductCategories
  // For collections, prefer fallback data for richer navigation experience
  // Only use dynamic collections if they have more comprehensive data
  const collections = (navigationData?.collections && navigationData.collections.length > 4)
    ? navigationData.collections
    : fallbackCollections

  return (
    <>
      <div className={`sticky top-0 z-50 transition-transform duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <header className={`bg-gradient-to-b from-orange-50 to-white shadow-lg border-b border-orange-100 ${className}`}>
      {/* Advanced Promotional Top Bar */}
      <div className="relative bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 text-white overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-pattern-dots-white animate-pulse"></div>
        </div>

        {/* Full Width Marquee - breaks out of container */}
        <div className="absolute inset-0 flex items-center">
          <div className="w-full overflow-hidden">
            <div className="flex animate-marquee-smooth whitespace-nowrap">
              {/* Simplified set - 8 key messages */}
              {[1, 2].map((set) => (
                <div key={set} className="flex items-center space-x-4 md:space-x-6 mr-4 md:mr-6">
                  <div className="flex items-center space-x-1.5 md:space-x-2 bg-white/10 rounded-full px-2 md:px-3 py-1">
                    <span className="text-xs md:text-sm font-medium">📦 New Drop Thu</span>
                  </div>
                  <div className="flex items-center space-x-1.5 md:space-x-2 bg-white/10 rounded-full px-2 md:px-3 py-1">
                    <span className="text-xs md:text-sm font-medium">🚚 Free Ship ₹1,499+</span>
                  </div>
                  <div className="flex items-center space-x-1.5 md:space-x-2 bg-white/10 rounded-full px-2 md:px-3 py-1">
                    <span className="text-xs md:text-sm font-medium">✨ GI Tagged</span>
                  </div>
                  <div className="flex items-center space-x-1.5 md:space-x-2 bg-white/10 rounded-full px-2 md:px-3 py-1">
                    <span className="text-xs md:text-sm font-medium">🏆 ISO Certified</span>
                  </div>
                  <div className="flex items-center space-x-1.5 md:space-x-2 bg-white/10 rounded-full px-2 md:px-3 py-1">
                    <span className="text-xs md:text-sm font-medium">⭐ 50k+ Customers</span>
                  </div>
                  <div className="flex items-center space-x-1.5 md:space-x-2 bg-white/10 rounded-full px-2 md:px-3 py-1">
                    <span className="text-xs md:text-sm font-medium">🎨 Handcrafted</span>
                  </div>
                  <div className="flex items-center space-x-1.5 md:space-x-2 bg-white/10 rounded-full px-2 md:px-3 py-1">
                    <span className="text-xs md:text-sm font-medium">♻️ Eco-Friendly</span>
                  </div>
                  <div className="flex items-center space-x-1.5 md:space-x-2 bg-white/10 rounded-full px-2 md:px-3 py-1">
                    <span className="text-xs md:text-sm font-medium">🛡️ 30-Day Return</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* LIVE Indicator - Positioned as overlay on the right */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
          <div className="flex items-center space-x-1.5 md:space-x-2 bg-white/15 rounded-lg px-2.5 md:px-3 py-1.5 md:py-2 border border-white/20">
            <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-[11px] md:text-xs font-mono font-medium">LIVE</span>
          </div>
        </div>

        {/* Invisible content for height - keeps the bar's height */}
        <div className="relative py-3 px-4 opacity-0 pointer-events-none">
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <span className="text-sm">Height placeholder</span>
              </div>
            </div>
          </div>
        </div>

        {/* Animated Bottom Border */}
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse"></div>
      </div>
      {/* Modern Navigation */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Left Side - Search */}
          <div className="flex-1">
            <button
              onClick={() => setIsSearchExpanded(true)}
              className="p-2 md:p-3 bg-gray-50 hover:bg-gray-100 rounded-full transition-all duration-200 group"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-500 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
          </div>

          {/* Center - Modern Clean Brand */}
          <div className="flex-1 flex justify-center">
            <Link href="/" className="flex items-center space-x-1 md:space-x-2 group hover:opacity-80 transition-opacity duration-200">
              {/* Clean Logo Icon */}
              <div className="relative">
                <img
                  src="/icon-transparent.png"
                  alt="Clayfable Logo"
                  className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10"
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
                <div className="hidden w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-xs sm:text-sm md:text-base">C</span>
                </div>
              </div>

              {/* Modern Typography - Responsive */}
              <div className="block">
                <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 leading-tight uppercase tracking-wide">
                  Clayfable
                </div>
                <p className="text-[10px] sm:text-xs md:text-sm text-orange-600 font-medium uppercase tracking-wider">
                  Est. 1952
                </p>
              </div>
            </Link>
          </div>

          {/* Right Side - User Actions */}
          <div className="flex-1 flex items-center justify-end space-x-2 md:space-x-4">
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-3">
              <NotificationSystem />
              <UserProfile />
            </div>

            {/* Cart */}
            <button
              onClick={() => setIsCartSidebarOpen(true)}
              className="relative p-2.5 md:p-3 bg-gray-50 rounded-full hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 group min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <ShoppingCart className="h-5 w-5 md:h-6 md:w-6 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 bg-orange-600 text-white text-[10px] md:text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-bounce">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            {/* Mobile User Profile */}
            <div className="md:hidden">
              <UserProfile />
            </div>

            {/* Mobile Menu */}
            <button
              className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5 md:h-6 md:w-6" /> : <Menu className="h-5 w-5 md:h-6 md:w-6" />}
            </button>
          </div>
        </div>

        {/* Secondary Navigation Bar */}
        <div className="border-t border-gray-100 py-3 md:py-4">
          <nav className="hidden lg:flex items-center justify-center space-x-6 xl:space-x-8">
            {/* New Arrivals */}
            <Link
              href="/new-arrivals"
              className="px-4 py-2 rounded-full text-gray-700 hover:text-orange-600 hover:bg-orange-50 font-medium transition-all duration-200"
            >
              <span className="text-sm font-bold tracking-widest uppercase">NEW ARRIVALS</span>
            </Link>

            {/* All Pottery */}
            <Link
              href="/all-pottery"
              className="px-4 py-2 rounded-full text-gray-700 hover:text-orange-600 hover:bg-orange-50 font-medium transition-all duration-200"
            >
              <span className="text-sm font-bold tracking-widest uppercase">ALL POTTERY</span>
            </Link>

            {/* Dynamic Category Dropdowns */}
            {productCategories.map((category, index) => (
              <div key={category.name} className="relative dropdown-container">
                <button
                  onClick={() => handleDropdownClick(`category-${index}`)}
                  className={`flex items-center space-x-2 font-medium transition-all duration-200 px-4 py-2 rounded-full ${
                    activeDropdown === `category-${index}`
                      ? 'text-orange-600 bg-orange-50 shadow-md'
                      : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                  }`}
                >
                  <span className="text-sm font-bold tracking-widest uppercase">{category.name}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                    activeDropdown === `category-${index}` ? 'rotate-180' : ''
                  }`} />
                </button>
                {activeDropdown === `category-${index}` && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white shadow-xl border rounded-lg py-4 animate-in slide-in-from-top-5">
                    <div className="grid gap-1">
                      {category.items.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={handleDropdownClose}
                          className="block px-4 py-3 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        >
                          <div className="font-medium uppercase text-sm tracking-wide">{item.name}</div>
                          <div className="text-xs text-gray-500 mt-1 font-medium" style={{fontVariant: 'small-caps'}}>{item.description}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Collections Dropdown */}
            <div className="relative dropdown-container">
              <button
                onClick={() => handleDropdownClick('collections')}
                className={`flex items-center space-x-2 font-medium transition-all duration-200 px-4 py-2 rounded-full ${
                  activeDropdown === 'collections'
                    ? 'text-orange-600 bg-orange-50 shadow-md'
                    : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                }`}
              >
                <span className="text-sm font-bold tracking-widest uppercase">COLLECTIONS</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                  activeDropdown === 'collections' ? 'rotate-180' : ''
                }`} />
              </button>
              {activeDropdown === 'collections' && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white shadow-xl border rounded-lg py-4 animate-in slide-in-from-top-5">
                  <div className="grid gap-1">
                    {collections.map((collection) => (
                      <Link
                        key={collection.name}
                        href={collection.href}
                        onClick={handleDropdownClose}
                        className="block px-4 py-3 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      >
                        <div className="font-medium uppercase text-sm tracking-wide">{collection.name}</div>
                        <div className="text-xs text-gray-500 mt-1 font-medium" style={{fontVariant: 'small-caps'}}>{collection.description}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* B2B Portal */}
            <Link
              href="/b2b"
              className="px-4 py-2 rounded-full text-gray-700 hover:text-orange-600 hover:bg-orange-50 font-medium transition-all duration-200"
            >
              <span className="text-sm font-bold tracking-widest uppercase">B2B PORTAL</span>
            </Link>
          </nav>
        </div>

        {/* Enhanced Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-0 z-50 bg-white shadow-lg border-b" style={{marginTop: `${isHeaderVisible ? '0' : '-100px'}`}}>
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <img src="/icon-transparent.png" alt="Clayfable" className="h-6 w-6" />
                <span className="text-lg font-bold text-gray-900">Menu</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close mobile menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Menu Content */}
            <div className="max-h-[calc(100vh-120px)] overflow-y-auto">
              <nav className="px-4 py-6 space-y-6">
                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/new-arrivals"
                    className="flex items-center justify-center px-4 py-3 bg-orange-50 text-orange-600 rounded-lg font-medium text-sm hover:bg-orange-100 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    🆕 New Arrivals
                  </Link>
                  <Link
                    href="/all-pottery"
                    className="flex items-center justify-center px-4 py-3 bg-blue-50 text-blue-600 rounded-lg font-medium text-sm hover:bg-blue-100 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    🏺 All Pottery
                  </Link>
                </div>

                {/* Dynamic Mobile Categories */}
                {productCategories.map((category, index) => (
                  <div key={category.name} className="border-b border-gray-100 pb-4">
                    <p className="font-bold text-gray-900 mb-3 text-lg">{category.name}</p>
                    <div className="grid grid-cols-1 gap-2">
                      {category.items.slice(0, 6).map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center justify-between px-3 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <span className="font-medium">{item.name}</span>
                          <span className="text-xs text-gray-400">→</span>
                        </Link>
                      ))}
                      {category.items.length > 6 && (
                        <Link
                          href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                          className="text-orange-600 font-medium text-sm py-1 px-3"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          View all {category.items.length - 6} more →
                        </Link>
                      )}
                    </div>
                  </div>
                ))}

                {/* Collections */}
                <div className="border-b border-gray-100 pb-4">
                  <p className="font-bold text-gray-900 mb-3 text-lg">Collections</p>
                  <div className="grid grid-cols-1 gap-2">
                    {collections.map((collection) => (
                      <Link
                        key={collection.name}
                        href={collection.href}
                        className="flex items-center justify-between px-3 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span className="font-medium">{collection.name}</span>
                        <span className="text-xs text-gray-400">→</span>
                      </Link>
                    ))}
                  </div>
                </div>

                <Link
                  href="/b2b"
                  className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg font-bold text-center hover:from-orange-700 hover:to-red-700 transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  🏢 B2B Portal
                </Link>

                {/* Mobile Notifications */}
                <div className="pt-4 border-t border-gray-100">
                  <NotificationSystem />
                </div>
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartSidebarOpen}
        onClose={() => setIsCartSidebarOpen(false)}
      />
    </header>
      </div>

    {/* Beautiful Search Overlay */}
    {isSearchExpanded && (
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-start justify-center pt-20"
        onClick={() => setIsSearchExpanded(false)}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden animate-in slide-in-from-top-10 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input
                  type="search"
                  placeholder="Search terracotta products, categories, collections..."
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:bg-white transition-all duration-200"
                  autoFocus
                />
              </div>
              <button
                onClick={() => setIsSearchExpanded(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {/* Dynamic Quick Suggestions */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Popular Searches</h3>
              <div className="flex flex-wrap gap-2">
                {(navigationData?.productCategories || fallbackProductCategories)
                  .flatMap(cat => cat.items.slice(0, 2).map(item => item.name))
                  .slice(0, 6)
                  .map((term) => (
                    <button
                      key={term}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-orange-50 hover:text-orange-600 rounded-full text-sm transition-colors"
                      onClick={() => setIsSearchExpanded(false)}
                    >
                      {term}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  )
}