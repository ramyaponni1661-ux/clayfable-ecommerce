import Link from "next/link"
import { Phone, Mail, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="relative">
                <img
                  src="/icon-transparent.png"
                  alt="Clayfable Logo"
                  className="h-8 w-8"
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
                <div className="hidden w-8 h-8 bg-gradient-to-br from-orange-600 to-red-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">C</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold">Clayfable</h3>
                <p className="text-xs text-orange-400">EST. 1952</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Authentic terracotta crafted with 72 years of heritage and excellence.
            </p>
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-600 transition-colors">
                <span className="text-sm">f</span>
              </div>
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-600 transition-colors">
                <span className="text-sm">t</span>
              </div>
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-600 transition-colors">
                <span className="text-sm">i</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Products</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/cooking" className="hover:text-white">
                  Cooking Collection
                </Link>
              </li>
              <li>
                <Link href="/serving" className="hover:text-white">
                  Serving Collection
                </Link>
              </li>
              <li>
                <Link href="/decor" className="hover:text-white">
                  Decor Collection
                </Link>
              </li>
              <li>
                <Link href="/custom" className="hover:text-white">
                  Custom Orders
                </Link>
              </li>
              <li>
                <Link href="/videos" className="hover:text-white">
                  Educational Videos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/about" className="hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/heritage" className="hover:text-white">
                  Our Heritage
                </Link>
              </li>
              <li>
                <Link href="/b2b" className="hover:text-white">
                  B2B Portal
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>support@clayfable.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Clayfable. All rights reserved. | {" "}
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link> | {" "}
            <Link href="/terms" className="hover:text-white">Terms of Service</Link> | {" "}
            <Link href="/refund" className="hover:text-white">Refund Policy</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}