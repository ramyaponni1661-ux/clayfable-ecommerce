import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Traditional Pottery | Clayfable',
  description: 'Authentic clay cooking vessels and traditional pottery handcrafted by skilled artisans. Discover our collection of traditional pottery pieces.',
  openGraph: {
    title: 'Traditional Pottery | Clayfable',
    description: 'Authentic clay cooking vessels and traditional pottery handcrafted by skilled artisans.',
    type: 'website',
  },
}

export default function TraditionalPotteryPage() {
  // Redirect to the dynamic category route
  redirect('/category/traditional-pottery')
}