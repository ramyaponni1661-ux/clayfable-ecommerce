import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Decorative Items | Clayfable',
  description: 'Beautiful handcrafted decorative pottery pieces. Explore our collection of decorative items crafted by skilled artisans.',
  openGraph: {
    title: 'Decorative Items | Clayfable',
    description: 'Beautiful handcrafted decorative pottery pieces crafted by skilled artisans.',
    type: 'website',
  },
}

export default function DecorativeItemsPage() {
  // Redirect to the dynamic category route
  redirect('/category/decorative-items')
}