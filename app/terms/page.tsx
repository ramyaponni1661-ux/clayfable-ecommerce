"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Footer from "@/components/footer"

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-orange-100">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-red-700 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Clayfable</h1>
              <p className="text-xs text-orange-600 font-medium">EST. 1952</p>
            </div>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="border-orange-100 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                Terms of Service
              </CardTitle>
              <p className="text-gray-600">Last updated: September 23, 2025</p>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-bold text-orange-800 mb-4">1. Introduction</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Welcome to Clayfable ("we," "our," or "us"). These Terms of Service ("Terms") govern your use of our website and services.
                    Clayfable has been crafting authentic terracotta products since 1952, bringing traditional craftsmanship to modern homes.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-orange-800 mb-4">2. Acceptance of Terms</h2>
                  <p className="text-gray-700 leading-relaxed">
                    By accessing or using our website and services, you agree to be bound by these Terms. If you do not agree to these Terms,
                    please do not use our services.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-orange-800 mb-4">3. Products and Services</h2>
                  <div className="text-gray-700 leading-relaxed space-y-3">
                    <p>Clayfable offers:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Handcrafted terracotta cookware</li>
                      <li>Decorative pottery and vases</li>
                      <li>Garden planters and accessories</li>
                      <li>Custom pottery solutions</li>
                      <li>Educational content about traditional pottery</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-orange-800 mb-4">4. Orders and Payment</h2>
                  <div className="text-gray-700 leading-relaxed space-y-3">
                    <p>When you place an order with us:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>All prices are in Indian Rupees (INR) unless otherwise stated</li>
                      <li>We accept payments via credit/debit cards, UPI, net banking, and cash on delivery</li>
                      <li>Payment processing is handled securely through Razorpay</li>
                      <li>We reserve the right to refuse or cancel any order</li>
                      <li>Product availability is subject to stock</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-orange-800 mb-4">5. Shipping and Delivery</h2>
                  <div className="text-gray-700 leading-relaxed space-y-3">
                    <ul className="list-disc list-inside space-y-2">
                      <li>Free shipping on orders above ₹999</li>
                      <li>Standard shipping charges: ₹99</li>
                      <li>Express shipping charges: ₹199</li>
                      <li>Delivery times vary by location</li>
                      <li>We pack items carefully to prevent damage during transit</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-orange-800 mb-4">6. Returns and Refunds</h2>
                  <div className="text-gray-700 leading-relaxed space-y-3">
                    <p>Our return policy:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>7-day return policy for damaged or defective items</li>
                      <li>Items must be in original condition</li>
                      <li>Custom orders are non-returnable unless defective</li>
                      <li>Refunds processed within 5-7 business days</li>
                      <li>Return shipping costs covered for defective items</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-orange-800 mb-4">7. User Accounts</h2>
                  <div className="text-gray-700 leading-relaxed space-y-3">
                    <p>When creating an account:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Provide accurate and complete information</li>
                      <li>Maintain the security of your password</li>
                      <li>Notify us immediately of any unauthorized use</li>
                      <li>You are responsible for all activities under your account</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-orange-800 mb-4">8. Intellectual Property</h2>
                  <p className="text-gray-700 leading-relaxed">
                    All content on this website, including images, text, designs, and logos, is the property of Clayfable and protected by
                    applicable intellectual property laws. Traditional pottery techniques and designs represent our 70+ years of craftsmanship heritage.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-orange-800 mb-4">9. Limitation of Liability</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Clayfable shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection
                    with your use of our services, except as required by applicable law.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-orange-800 mb-4">10. Changes to Terms</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on our website.
                    Your continued use of our services constitutes acceptance of the modified Terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-orange-800 mb-4">11. Contact Information</h2>
                  <div className="text-gray-700 leading-relaxed space-y-2">
                    <p>For questions about these Terms, contact us:</p>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <p><strong>Email:</strong> support@clayfable.com</p>
                      <p><strong>Phone:</strong> +91 98765 43210</p>
                      <p><strong>Address:</strong> Clayfable Pottery Works, India</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-orange-800 mb-4">12. Governing Law</h2>
                  <p className="text-gray-700 leading-relaxed">
                    These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising under these Terms
                    shall be subject to the exclusive jurisdiction of the courts in India.
                  </p>
                </section>
              </div>

              <div className="mt-12 pt-8 border-t border-orange-200 text-center">
                <Link href="/" className="text-orange-600 hover:text-orange-700 font-medium">
                  ← Back to Home
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}