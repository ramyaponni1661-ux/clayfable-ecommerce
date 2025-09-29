"use client";

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Smartphone, RotateCcw, ZoomIn, ZoomOut, X, Info } from "lucide-react"

interface ARViewerProps {
  productName: string
  productImage: string
  modelUrl?: string
}

export default function ARViewer({ productName, productImage, modelUrl }: ARViewerProps) {
  const [isAROpen, setIsAROpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleARView = () => {
    setIsLoading(true)
    // Simulate AR loading
    setTimeout(() => {
      setIsLoading(false)
      setIsAROpen(true)
    }, 2000)
  }

  const handleCloseAR = () => {
    setIsAROpen(false)
  }

  if (isAROpen) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        {/* AR Header */}
        <div className="bg-black bg-opacity-50 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Badge className="bg-orange-600 text-white">AR View</Badge>
            <span className="font-medium">{productName}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCloseAR}
            className="text-white hover:bg-white hover:bg-opacity-20"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* AR Viewer Area */}
        <div className="flex-1 relative bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
          {/* Simulated AR View */}
          <div className="relative">
            <img
              src={productImage || "/placeholder.svg"}
              alt={productName}
              className="w-80 h-80 object-contain filter drop-shadow-2xl animate-pulse"
            />

            {/* AR Overlay Effects */}
            <div className="absolute inset-0 border-2 border-orange-400 border-dashed rounded-lg animate-pulse"></div>

            {/* AR Info Overlay */}
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-orange-600 text-white px-4 py-2 rounded-lg text-sm">
              Tap to place in your space
            </div>
          </div>

          {/* AR Instructions */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center text-white">
            <div className="bg-black bg-opacity-50 rounded-lg p-4 max-w-sm">
              <Smartphone className="h-8 w-8 mx-auto mb-2 text-orange-400" />
              <p className="text-sm mb-2">Move your device to explore the product in 3D</p>
              <p className="text-xs opacity-75">Tap and drag to rotate • Pinch to zoom</p>
            </div>
          </div>
        </div>

        {/* AR Controls */}
        <div className="bg-black bg-opacity-50 p-4">
          <div className="flex items-center justify-center space-x-6">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white hover:bg-opacity-20 flex flex-col items-center"
            >
              <RotateCcw className="h-5 w-5 mb-1" />
              <span className="text-xs">Reset</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white hover:bg-opacity-20 flex flex-col items-center"
            >
              <ZoomIn className="h-5 w-5 mb-1" />
              <span className="text-xs">Zoom In</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white hover:bg-opacity-20 flex flex-col items-center"
            >
              <ZoomOut className="h-5 w-5 mb-1" />
              <span className="text-xs">Zoom Out</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white hover:bg-opacity-20 flex flex-col items-center"
            >
              <Info className="h-5 w-5 mb-1" />
              <span className="text-xs">Info</span>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Button
        onClick={handleARView}
        disabled={isLoading}
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
      >
        <Eye className="h-4 w-4 mr-2" />
        {isLoading ? "Loading AR..." : "View in AR"}
      </Button>

      {/* AR Loading Modal */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <Card className="border-orange-100 max-w-sm mx-4">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Preparing AR View</h3>
              <p className="text-gray-600 mb-4">Loading 3D model and initializing camera...</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full animate-pulse"
                  style={{ width: "75%" }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
