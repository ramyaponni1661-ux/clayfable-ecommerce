"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Footer from "@/components/footer"

export default function PrivacyPolicy() {
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
                Privacy Policy
              </CardTitle>
              <p className="text-gray-600">Last updated: September 23, 2025</p>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-bold text-orange-800 mb-4">1. Introduction</h2>
                  <p className="text-gray-700 leading-relaxed">
                    At Clayfable, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect,
                    use, and safeguard your information when you visit our website or use our services. Clayfable has been a trusted name in
                    handcrafted terracotta products since 1952.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-orange-800 mb-4">2. Information We Collect</h2>
                  <div className="text-gray-700 leading-relaxed space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-orange-700 mb-2">Personal Information:</h3>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Name, email address, phone number</li>
                        <li>Billing and shipping addresses</li>
                        <li>Payment information (processed securely via Razorpay)</li>
                        <li>Account credentials and preferences</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-orange-700 mb-2">Usage Information:</h3>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Browser type, IP address, device information</li>
                        <li>Pages visited, time spent on site</li>
                        <li>Shopping behavior and preferences</li>
                        <li>Cookies and similar tracking technologies</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-orange-800 mb-4">3. How We Use Your Information</h2>
                  <div className="text-gray-700 leading-relaxed space-y-3">
                    <p>We use your information to:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Process and fulfill your orders</li>
                      <li>Provide customer support and service</li>
                      <li>Send order confirmations and shipping updates</li>
                      <li>Improve our website and user experience</li>
                      <li>Send promotional offers (with your consent)</li>
                      <li>Comply with legal obligations</li>
                      <li>Prevent fraud and ensure security</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-orange-800 mb-4">4. Information Sharing</h2>
                  <div className="text-gray-700 leading-relaxed space-y-3">
                    <p>We may share your information with:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li><strong>Payment Processors:</strong> Razorpay for secure payment processing</li>
                      <li><strong>Shipping Partners:</strong> For order delivery</li>
                      <li><strong>Service Providers:</strong> For website maintenance and analytics</li>
                      <li><strong>Legal Authorities:</strong> When required by law</li>
                    </ul>
                    <p className="mt-3">
                      We do not sell, rent, or trade your personal information to third parties for marketing purposes.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-orange-800 mb-4">5. Data Security</h2>
                  <div className="text-gray-700 leading-relaxed space-y-3">
                    <p>We implement appropriate security measures to protect your data:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>SSL encryption for data transmission</li>
                      <li>Secure payment processing via Razorpay</li>
                      <li>Regular security audits and updates</li>
                      <li>Access controls and authentication</li>
                      <li>Data backup and recovery procedures</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-orange-800 mb-4">6. Cookies and Tracking</h2>
                  <div className="text-gray-700 leading-relaxed space-y-3">
                    <p>We use cookies and similar technologies to:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Remember your preferences and login status</li>
                      <li>Analyze website traffic and user behavior</li>
                      <li>Personalize content and recommendations</li>
                      <li>Enable social media features</li>
                    </ul>
                    <p className="mt-3">
                      You can control cookie settings through your browser preferences.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-orange-800 mb-4">7. Your Rights</h2>
                  <div className="text-gray-700 leading-relaxed space-y-3">
                    <p>You have the right to:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Access your personal data</li>
                      <li>Correct inaccurate information</li>
                      <li>Delete your account and data</li>
                      <li>Opt-out of marketing communications</li>
                      <li>Data portability</li>
                      <li>Object to certain data processing</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-orange-800 mb-4">8. Data Retention</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We retain your personal data only as long as necessary for the purposes outlined in this policy or as required by law.
                    Order information is typically retained for 7 years for tax and accounting purposes.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-orange-800 mb-4">9. Third-Party Services</h2>
                  <div className="text-gray-700 leading-relaxed space-y-3">
                    <p>Our website integrates with third-party services:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li><strong>Razorpay:</strong> Payment processing (subject to Razorpay's privacy policy)</li>
                      <li><strong>Google Analytics:</strong> Website analytics</li>
                      <li><strong>Social Media:</strong> Login and sharing features</li>
                      <li><strong>Shipping Partners:</strong> Order tracking and delivery</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-orange-800 mb-4">10. International Data Transfers</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Your data is primarily stored and processed in India. If we transfer data internationally, we ensure appropriate
                    safeguards are in place to protect your information.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-orange-800 mb-4">11. Children's Privacy</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Our services are not intended for children under 16. We do not knowingly collect personal information from children.
                    If you believe we have collected information from a child, please contact us immediately.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-orange-800 mb-4">12. Changes to This Policy</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new
                    policy on our website and updating the "Last updated" date.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-orange-800 mb-4">13. Contact Information</h2>
                  <div className="text-gray-700 leading-relaxed space-y-2">
                    <p>For questions about this Privacy Policy or to exercise your rights, contact us:</p>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <p><strong>Email:</strong> privacy@clayfable.com</p>
                      <p><strong>Support Email:</strong> support@clayfable.com</p>
                      <p><strong>Phone:</strong> +91 98765 43210</p>
                      <p><strong>Address:</strong> Clayfable Pottery Works, India</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-orange-800 mb-4">14. Compliance</h2>
                  <p className="text-gray-700 leading-relaxed">
                    This policy complies with applicable Indian data protection laws, including the Information Technology Act, 2000
                    and applicable data protection regulations. We are committed to maintaining the highest standards of data protection.
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