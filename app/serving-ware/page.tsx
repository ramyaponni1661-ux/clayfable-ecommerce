import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Serving Ware | Clayfable',
  description: 'Elegant serving dishes and tableware handcrafted from clay. Explore our collection of serving ware for your dining needs.',
  openGraph: {
    title: 'Serving Ware | Clayfable',
    description: 'Elegant serving dishes and tableware handcrafted from clay.',
    type: 'website',
  },
}

export default function ServingWarePage() {
  // Redirect to the dynamic category route
  redirect('/category/serving-ware')
}