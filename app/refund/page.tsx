"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Footer from "@/components/footer"
import ProductHeader from "@/components/product-header"
import ProductFooter from "@/components/product-footer"
import CanonicalLink from "@/components/seo/canonical-link"

export default function RefundPolicy() {
  return (
    <>
      <CanonicalLink />
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
        <ProductHeader cartCount={0} />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="border-orange-100 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                Refund & Return Policy
              </CardTitle>
              <p className="text-gray-600">Last updated: September 23, 2025</p>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-bold text-orange-800 mb-4">1. Our Commitment</h2>
                  <p className="text-gray-700 leading-relaxed">
                    At Clayfable, we stand behind the quality of our handcrafted terracotta products. With over 70 years of craftsmanship
                    since 1952, we ensure each piece meets our high standards. This policy outlines our commitment to customer satisfaction
                    through fair returns and refunds.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-orange-800 mb-4">2. Return Eligibility</h2>
                  <div className="text-gray-700 leading-relaxed space-y-4">
                    <h3 className="text-lg font-semibold text-orange-700">Eligible for Return:</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Items damaged during shipping</li>
                      <li>Defective products with manufacturing flaws</li>
                      <li>Items significantly different from description</li>
                      <li>Wrong items shipped by our error</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-orange-700 mt-6">Not Eligible for Return:</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Custom or personalized pottery items</li>
                      <li>Items damaged due to misuse or normal wear</li>
                      <li>Products returned after 7 days from delivery</li>
                      <li>Items without original packaging</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-orange-800 mb-4">3. Return Process</h2>
                  <div className="text-gray-700 leading-relaxed space-y-3">
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-orange-700 mb-2">Step-by-Step Return Process:</h3>
                      <ol className="list-decimal list-inside space-y-2">
                        <li><strong>Contact Us:</strong> Email support@clayfable.com within 7 days of delivery</li>
                        <li><strong>Provide Details:</strong> Order number, photos of damaged/defective items</li>
                        <li><strong>Return Authorization:</strong> We'll provide return instructions and shipping label</li>
                        <li><strong>Package Securely:</strong> Use original packaging and pack items carefully</li>
                        <li><strong>Ship Back:</strong> Use our prepaid shipping label for eligible returns</li>
                        <li><strong>Processing:</strong> Refund processed within 5-7 business days after we receive the item</li>
                      </ol>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-orange-800 mb-4">4. Refund Policy</h2>
                  <div className="text-gray-700 leading-relaxed space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-orange-700 mb-2">Full Refunds:</h3>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Items damaged during shipping</li>
                        <li>Manufacturing defects</li>
                        <li>Wrong items shipped by our error</li>
                        <li>Cancelled orders before shipment</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-orange-700 mb-2">Refund Methods:</h3>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Original payment method (Credit/Debit cards, UPI)</li>
                        <li>Bank transfer for cash on delivery orders</li>
                        <li>Store credit (optional, with 10% bonus)</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-orange-700 mb-2">Processing Time:</h3>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>5-7 business days after we receive the returned item</li>
                        <li>Bank transfer: 3-5 additional business days</li>
                        <li>Credit/Debit cards: 7-14 business days depending on bank</li>
                        <li>UPI: 1-2 business days</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-orange-800 mb-4">5. Exchange Policy</h2>
                  <div className="text-gray-700 leading-relaxed space-y-3">
                    <p>We offer exchanges for:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Size or color variations (subject to availability)</li>
                      <li>Defective items with like-for-like replacement</li>
                      <li>Wrong items shipped by our error</li>
                    </ul>
                    <p className="mt-3">
                      <strong>Note:</strong> Exchanges follow the same 7-day timeline and process as returns.
                      If the replacement item has a different price, we'll refund or charge the difference.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-orange-800 mb-4">6. Shipping Costs</h2>
                  <div className="text-gray-700 leading-relaxed space-y-3">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h3 className="text-lg font-semibold text-green-700 mb-2">We Cover Return Shipping For:</h3>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Damaged items during shipping</li>
                        <li>Defective or wrong products</li>
                        <li>Our shipping errors</li>
                      </ul>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <h3 className="text-lg font-semibold text-orange-700 mb-2">Customer Covers Return Shipping For:</h3>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Change of mind (where applicable)</li>
                        <li>Size/color exchanges</li>
                        <li>Items ordered by mistake</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-orange-800 mb-4">7. Special Considerations</h2>
                  <div className="text-gray-700 leading-relaxed space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-orange-700 mb-2">Handcrafted Nature:</h3>
                      <p>
                        Our terracotta products are handcrafted, so slight variations in color, texture, and size are natural
                        characteristics, not defects. These variations make each piece unique and are part of the traditional
                        pottery charm.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-orange-700 mb-2">Fragile Items:</h3>
                      <p>
                        Pottery items are fragile by nature. We pack all items with extreme care using protective materials.
                        If items arrive damaged, please photograph the damage and packaging before unpacking further.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-orange-700 mb-2">Custom Orders:</h3>
                      <p>
                        Custom pottery pieces made to your specifications are generally non-returnable unless they arrive
                        damaged or have manufacturing defects. Please review custom orders carefully before confirming.
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-orange-800 mb-4">8. Quality Assurance</h2>
                  <div className="text-gray-700 leading-relaxed space-y-3">
                    <p>Before shipping, every item undergoes quality checks:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Visual inspection for cracks or defects</li>
                      <li>Proper firing and finishing verification</li>
                      <li>Secure packaging with protective materials</li>
                      <li>Final quality approval by our craftspeople</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-orange-800 mb-4">9. Customer Support</h2>
                  <div className="text-gray-700 leading-relaxed space-y-2">
                    <p>Our customer support team is here to help with any return or refund questions:</p>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <p><strong>Email:</strong> support@clayfable.com</p>
                      <p><strong>Phone:</strong> +91 7418160520</p>
                      <p><strong>Hours:</strong> Monday - Saturday, 9:00 AM - 6:00 PM IST</p>
                      <p><strong>Response Time:</strong> Within 24 hours on business days</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-orange-800 mb-4">10. Cancellation Policy</h2>
                  <div className="text-gray-700 leading-relaxed space-y-3">
                    <ul className="list-disc list-inside space-y-2">
                      <li><strong>Before Shipment:</strong> Full refund within 2 hours of order placement</li>
                      <li><strong>After Shipment:</strong> Return process applies once delivered</li>
                      <li><strong>Custom Orders:</strong> Can be cancelled within 4 hours of confirmation</li>
                      <li><strong>In Production:</strong> 50% refund for orders already in production</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-orange-800 mb-4">11. Policy Updates</h2>
                  <p className="text-gray-700 leading-relaxed">
                    This refund policy may be updated from time to time to reflect changes in our practices or applicable laws.
                    The latest version will always be available on our website with the updated date clearly marked.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-orange-800 mb-4">12. Legal Rights</h2>
                  <p className="text-gray-700 leading-relaxed">
                    This policy does not affect your statutory rights under applicable consumer protection laws.
                    In case of disputes, the laws of India shall apply, and courts in Tamil Nadu shall have jurisdiction.
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

      <ProductFooter />
      </div>
    </>
  )
}