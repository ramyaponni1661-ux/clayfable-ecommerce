"use client";

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Star,
  ThumbsUp,
  MessageSquare,
  CheckCircle,
  User,
  Calendar
} from "lucide-react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

interface Review {
  id: string
  rating: number
  title?: string
  review_text?: string
  is_verified_purchase: boolean
  helpful_count: number
  created_at: string
  users: {
    full_name: string
    email: string
  }
}

interface ReviewSummary {
  averageRating: number
  totalReviews: number
  ratingCounts: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}

interface ProductReviewsProps {
  productId: string
  productName: string
}

export default function ProductReviews({ productId, productName }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [summary, setSummary] = useState<ReviewSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [showWriteReview, setShowWriteReview] = useState(false)
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: "",
    reviewText: ""
  })
  const [submitting, setSubmitting] = useState(false)
  const { data: session } = useSession()

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/products/${productId}/reviews`)
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews || [])
        setSummary(data.summary || null)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [productId])

  const handleSubmitReview = async () => {
    if (!session) {
      toast.error("Please sign in to write a review")
      return
    }

    if (newReview.rating === 0) {
      toast.error("Please select a rating")
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: newReview.rating,
          title: newReview.title,
          reviewText: newReview.reviewText
        })
      })

      if (response.ok) {
        toast.success("Review submitted successfully!")
        setShowWriteReview(false)
        setNewReview({ rating: 0, title: "", reviewText: "" })
        fetchReviews() // Refresh reviews
      } else {
        const data = await response.json()
        toast.error(data.error || "Failed to submit review")
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      toast.error("Failed to submit review")
    } finally {
      setSubmitting(false)
    }
  }

  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "sm") => {
    const sizeClass = size === "lg" ? "h-6 w-6" : size === "md" ? "h-4 w-4" : "h-3 w-3"

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= rating
                ? 'fill-orange-400 text-orange-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="h-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-24 bg-gray-200 rounded animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      {summary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Customer Reviews ({summary.totalReviews})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Overall Rating */}
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">
                  {summary.averageRating}
                </div>
                {renderStars(Math.round(summary.averageRating), "lg")}
                <p className="text-gray-600 mt-2">
                  Based on {summary.totalReviews} review{summary.totalReviews !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Rating Breakdown */}
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = summary.ratingCounts[rating as keyof typeof summary.ratingCounts]
                  const percentage = summary.totalReviews > 0 ? (count / summary.totalReviews) * 100 : 0

                  return (
                    <div key={rating} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 min-w-[80px]">
                        <span className="text-sm">{rating}</span>
                        <Star className="h-3 w-3 fill-orange-400 text-orange-400" />
                      </div>
                      <Progress value={percentage} className="flex-1" />
                      <span className="text-sm text-gray-600 min-w-[30px]">
                        {count}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Write Review Button */}
            <div className="mt-6 flex justify-center">
              <Dialog open={showWriteReview} onOpenChange={setShowWriteReview}>
                <DialogTrigger asChild>
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                    Write a Review
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Write a Review</DialogTitle>
                    <DialogDescription>
                      Share your experience with {productName}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    {/* Rating */}
                    <div>
                      <Label className="text-sm font-medium">Rating *</Label>
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                            className="p-1"
                          >
                            <Star
                              className={`h-6 w-6 ${
                                star <= newReview.rating
                                  ? 'fill-orange-400 text-orange-400'
                                  : 'text-gray-300 hover:text-orange-200'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                          {newReview.rating > 0 && `${newReview.rating} star${newReview.rating !== 1 ? 's' : ''}`}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <Label htmlFor="title" className="text-sm font-medium">
                        Review Title (Optional)
                      </Label>
                      <Input
                        id="title"
                        placeholder="Summarize your experience"
                        value={newReview.title}
                        onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                        className="mt-1"
                      />
                    </div>

                    {/* Review Text */}
                    <div>
                      <Label htmlFor="review" className="text-sm font-medium">
                        Your Review (Optional)
                      </Label>
                      <Textarea
                        id="review"
                        placeholder="Tell others about your experience with this product"
                        value={newReview.reviewText}
                        onChange={(e) => setNewReview(prev => ({ ...prev, reviewText: e.target.value }))}
                        className="mt-1"
                        rows={4}
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setShowWriteReview(false)}
                        disabled={submitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSubmitReview}
                        disabled={submitting || newReview.rating === 0}
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        {submitting ? "Submitting..." : "Submit Review"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* Individual Reviews */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
              <p className="text-gray-600">Be the first to review this product!</p>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-orange-600" />
                  </div>

                  <div className="flex-1">
                    {/* Review Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">
                            {review.users.full_name || 'Anonymous'}
                          </span>
                          {review.is_verified_purchase && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified Purchase
                            </Badge>
                          )}
                        </div>
                        {renderStars(review.rating)}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="h-3 w-3" />
                        {formatDate(review.created_at)}
                      </div>
                    </div>

                    {/* Review Content */}
                    {review.title && (
                      <h4 className="font-medium text-gray-900 mb-2">
                        {review.title}
                      </h4>
                    )}
                    {review.review_text && (
                      <p className="text-gray-700 mb-3 whitespace-pre-wrap">
                        {review.review_text}
                      </p>
                    )}

                    {/* Review Actions */}
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                        <ThumbsUp className="h-4 w-4" />
                        Helpful ({review.helpful_count})
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}