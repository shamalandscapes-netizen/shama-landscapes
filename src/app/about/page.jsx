import Navbar from "@/components/Navbar";
import AboutUs from "@/components/AboutUs";

export const metadata = {
  title: "About Us | Shama Landscape Architects - Kenya's Premier Design Firm",
  description:
    "Discover Shama Landscape Architects — Kenya's leading landscape design firm. Founded by John Shamala Mulievi, we create sustainable, innovative outdoor spaces across East Africa. Meet our team of 16+ professionals.",
  keywords: [
    "about shama landscape architects",
    "landscape design firm Kenya",
    "Kenyan landscape architects",
    "sustainable design team",
    "landscape firms in Kenya",
    "John Shamala Mulievi",
    "Noel Syambi",
    "Shama team",
    "landscape architecture company",
    "Kenya landscape design",
    "East Africa landscape architecture",
    "environmental planning Kenya",
    "landscape architecture company"
  ],
  authors: [{ name: "Shama Landscape Architects" }],
  creator: "Shama Landscape Architects",
  publisher: "Shama Landscape Architects",
  metadataBase: new URL("https://shamalandscapes.co.ke"),
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Us | Shama Landscape Architects",
    description:
      "Kenya's premier landscape architecture firm. Creating sustainable, inspiring landscapes that harmonize people, place, and planet.",
    url: "/about",
    siteName: "Shama Landscape Architects",
    images: [
      {
        url: "/assets/about-hero.jpg",
        width: 1200,
        height: 630,
        alt: "Shama Landscape Architects Team",
      },
    ],
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Shama Landscape Architects",
    description:
      "Kenya's leading landscape design firm. 12+ years of creating sustainable outdoor spaces across East Africa.",
    images: ["/assets/about-hero.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "s1hmnEnZDlU_2uOnGR6IBmI5mLcGT7N2cXizGYuhWiM",
  },
};

// Structured data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Shama Landscape Architects Limited",
  alternateName: "Shama Landscapes",
  url: "https://shamalandscapes.co.ke/about",
  logo: "https://shamalandscapes.co.ke/logo.png",
  founder: {
    "@type": "Person",
    name: "John Shamala Mulievi",
    jobTitle: "Principal Landscape Architect",
  },
  description: "Premier landscape architecture firm based in Kenya, delivering bespoke landscape design across East Africa.",
  address: {
    "@type": "PostalAddress",
    addressCountry: "KE",
    addressRegion: "Nairobi",
  },
  sameAs: [
    "https://facebook.com/shamalandscapes",
    "https://instagram.com/shamalandscapes",
    "https://linkedin.com/company/shama-landscape-architects",
  ],
  areaServed: {
    "@type": "GeoCircle",
    geoMidpoint: {
      "@type": "GeoCoordinates",
      latitude: 0.2829,
      longitude: 34.7520,
    },
    geoRadius: "500000",
  },
  serviceType: [
    "Landscape Architecture",
    "Landscape Design",
    "Environmental Planning",
    "Landscape Maintenance",
  ],
};

export default function AboutPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <main className="min-h-screen bg-white">
        <Navbar />
        
        {/* Skip to main content link for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-shama-green focus:text-white focus:rounded-lg"
        >
          Skip to main content
        </a>
        
        <div id="main-content">
          <AboutUs />
        </div>
        
      </main>
    </>
  );
}