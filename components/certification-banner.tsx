"use client";

import { Award, CheckCircle, Truck, Globe, Phone, Video } from "lucide-react"

export default function CertificationBanner() {
  return (
    <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-6 mb-6">
      {/* Certification Badges */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-orange-100">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <Award className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">Artisan Certified</p>
            <p className="text-xs text-gray-600">by Central Pottery Board of India</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-orange-100">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">Handloom Mark</p>
            <p className="text-xs text-gray-600">from Ministry of Textiles</p>
          </div>
        </div>
      </div>

      {/* Service Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-2">
            <Truck className="h-5 w-5 text-white" />
          </div>
          <p className="font-bold text-sm text-gray-900">🚚</p>
          <p className="font-semibold text-sm text-gray-900">Free Shipping</p>
          <p className="text-xs text-gray-600">All across India</p>
        </div>

        <div className="text-center">
          <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-2">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <p className="font-bold text-sm text-gray-900">✈️</p>
          <p className="font-semibold text-sm text-gray-900">Free International Shipping</p>
          <p className="text-xs text-gray-600">on orders above ₹999</p>
        </div>

        <div className="text-center">
          <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-2">
            <Video className="h-5 w-5 text-white" />
          </div>
          <p className="font-bold text-sm text-gray-900">📹</p>
          <p className="font-semibold text-sm text-gray-900">Schedule Video Call</p>
          <p className="text-xs text-gray-600">to view our collection</p>
        </div>

        <div className="text-center">
          <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-2">
            <Phone className="h-5 w-5 text-white" />
          </div>
          <p className="font-bold text-sm text-gray-900">📱</p>
          <p className="font-semibold text-sm text-gray-900">Call +917418160520</p>
          <p className="text-xs text-gray-600">or WhatsApp for more info</p>
        </div>
      </div>

      {/* Trust Statement */}
      <div className="mt-6 pt-4 border-t border-orange-200 text-center">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Clayfable</span> is a Certified member of Artisan Pottery Organization of India and Handloom Mark,
          an initiative of Central Pottery Board, Ministry of Textiles, Government of India.
        </p>
      </div>
    </div>
  )
}