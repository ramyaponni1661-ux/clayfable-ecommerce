import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface InternalLinksProps {
  currentCategory?: string
  className?: string
}

const CATEGORY_LINKS = [
  { href: "/cooking", title: "Traditional Cooking Pots", description: "Clay cookware for healthy meals" },
  { href: "/table-centerpieces", title: "Table Centerpieces", description: "Elegant dining decor" },
  { href: "/wind-chimes", title: "Musical Wind Chimes", description: "Soothing terracotta sounds" },
  { href: "/tea-sets", title: "Clay Tea Sets", description: "Authentic chai experience" },
  { href: "/spice-containers", title: "Spice Storage Jars", description: "Keep spices fresh naturally" },
  { href: "/tandoor-accessories", title: "Tandoor Tools", description: "Complete tandoor setup" },
  { href: "/traditional-griddles", title: "Clay Tawa & Griddles", description: "Perfect for flatbreads" },
  { href: "/fermentation-pots", title: "Fermentation Vessels", description: "Traditional food preparation" },
  { href: "/hanging-planters", title: "Garden Planters", description: "Beautiful suspended pottery" },
  { href: "/decorative-lamps", title: "Clay Lighting", description: "Traditional illumination" },
  { href: "/wine-bar-accessories", title: "Bar Accessories", description: "Elegant serving pieces" },
  { href: "/butter-churns", title: "Butter Churns", description: "Traditional dairy tools" },
]

const OTHER_LINKS = [
  { href: "/", title: "Homepage", description: "Discover our pottery heritage" },
  { href: "/all-pottery", title: "All Pottery", description: "Browse complete collection" },
  { href: "/collections", title: "Collections", description: "Curated pottery sets" },
  { href: "/contact", title: "Contact Us", description: "Get in touch for queries" },
  { href: "/about", title: "About Clayfable", description: "72 years of craftsmanship" },
]

export default function InternalLinks({ currentCategory, className = "" }: InternalLinksProps) {
  // Filter out current category and select relevant links
  const categoryLinks = CATEGORY_LINKS.filter(link => link.href !== currentCategory).slice(0, 6)
  const otherLinks = OTHER_LINKS.slice(0, 3)
  const allLinks = [...categoryLinks, ...otherLinks]

  return (
    <div className={`bg-white rounded-2xl p-8 border border-gray-100 ${className}`}>
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Explore More Categories</h3>
        <p className="text-gray-600">
          Discover our complete collection of handcrafted terracotta pottery
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allLinks.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className="group block p-4 rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                {link.title}
              </h4>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-orange-600 transition-colors" />
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {link.description}
            </p>
          </Link>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link
          href="/all-pottery"
          className="inline-flex items-center px-6 py-3 bg-orange-600 text-white font-semibold rounded-full hover:bg-orange-700 transition-colors"
        >
          View All Products
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}