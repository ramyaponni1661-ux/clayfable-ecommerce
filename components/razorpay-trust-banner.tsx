"use client";

import { Shield, CheckCircle, Clock, Headphones } from "lucide-react"

export default function RazorpayTrustBanner() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        {/* Razorpay Logo and Badge */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-7 w-7 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">✓</span>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Razorpay</h3>
            <p className="text-sm text-blue-600 font-medium">Trusted Business</p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-sm">
              <p className="font-semibold text-gray-900">Verified</p>
              <p className="text-gray-600">Business</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-sm">
              <p className="font-semibold text-gray-900">Secured</p>
              <p className="text-gray-600">Payments</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Headphones className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-sm">
              <p className="font-semibold text-gray-900">Prompt</p>
              <p className="text-gray-600">Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Trust Information */}
      <div className="mt-3 pt-3 border-t border-blue-200">
        <p className="text-sm text-gray-700 text-center">
          <span className="font-medium">Clayfable</span> is a trusted business verified by Razorpay.{" "}
          <button className="text-blue-600 hover:text-blue-700 underline font-medium">
            Tap to know more
          </button>
        </p>
      </div>
    </div>
  )
}