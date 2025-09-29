"use client";

import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, Linkedin } from "lucide-react"

export default function ProductFooter() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 items-start">
          {/* Contact Us */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact us</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>Address: Traditional Pottery Workshop,</p>
              <p>Artisan Village, Chennai - 600001</p>
              <p className="mt-3">Mobile: +917418160520</p>
              <p>WhatsApp: +917418160520</p>
              <p>Email: support@clayfable.com</p>
            </div>
          </div>

          {/* Main Menu */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Main menu</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/products?sort=newest" className="hover:text-white">New Arrivals</Link></li>
              <li><Link href="/products?category=cooking" className="hover:text-white">Traditional Pottery</Link></li>
              <li><Link href="/products?category=vases-planters" className="hover:text-white">Decorative Items</Link></li>
              <li><Link href="/products?category=bowls-plates" className="hover:text-white">Serving Ware</Link></li>
              <li><Link href="/collections" className="hover:text-white">Collections</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/about" className="hover:text-white">About</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              <li><Link href="/b2b" className="hover:text-white">B2B Enquiry</Link></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Policies</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/refund" className="hover:text-white">Refund Policy</Link></li>
              <li><Link href="/shipping" className="hover:text-white">Shipping Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Logo Section */}
          <div className="flex justify-center lg:justify-start">
            <img
              src="/icon-transparent.png"
              alt="Clayfable"
              className="h-40 w-40 opacity-80 hover:opacity-100 transition-opacity duration-200"
              onError={(e) => {
                e.currentTarget.src = '/icon.png'
              }}
            />
          </div>
        </div>

        {/* Social Media */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h4 className="text-sm font-semibold mb-2">Social</h4>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-400 hover:text-white">
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  <Youtube className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  <Linkedin className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Explore Our Terracotta */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <h4 className="text-lg font-semibold mb-4">Explore our Terracotta</h4>
          <div className="text-sm text-gray-300 leading-relaxed">
            <p className="mb-2">
              <Link href="/products?category=cooking" className="hover:text-white">Traditional cooking pots</Link> |
              <Link href="/products?category=water-storage" className="hover:text-white"> Water storage vessels</Link> |
              <Link href="/products?category=bowls-plates" className="hover:text-white"> Serving bowls and plates</Link> |
              <Link href="/products?category=vases-planters" className="hover:text-white"> Decorative vases</Link> |
              <Link href="/products?category=garden-decor" className="hover:text-white"> Garden planters</Link> |
              <Link href="/collections/artisan" className="hover:text-white"> Handcrafted items</Link> |
              <Link href="/collections/wedding" className="hover:text-white"> Wedding pottery</Link> |
              <Link href="/collections/modern" className="hover:text-white"> Modern designs</Link>
            </p>
          </div>
        </div>

        {/* Explore Our Categories */}
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-4">Explore our Categories</h4>
          <div className="text-sm text-gray-300 leading-relaxed">
            <p>
              <Link href="/products?type=cookware" className="hover:text-white">Clay Cookware</Link> |
              <Link href="/products?type=decorative" className="hover:text-white"> Decorative Pottery</Link> |
              <Link href="/products?type=storage" className="hover:text-white"> Storage Containers</Link> |
              <Link href="/products?type=planters" className="hover:text-white"> Garden Pottery</Link> |
              <Link href="/products?type=dinnerware" className="hover:text-white"> Dinnerware Sets</Link> |
              <Link href="/products?type=artisan" className="hover:text-white"> Artisan Crafts</Link> |
              <Link href="/collections/heritage" className="hover:text-white"> Heritage Collection</Link>
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-sm text-gray-400">
            © 2025 Clayfable | All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  )
}