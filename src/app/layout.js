import { Montserrat } from "next/font/google";
import "./globals.css";
import LayoutVisibility from "@/components/LayoutVisibility"; // ✅ NEW
import '@fortawesome/fontawesome-free/css/all.min.css';

// ============================================
// FONT CONFIGURATION
// ============================================

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
  preload: true,
});

// ============================================
// METADATA CONFIGURATION
// ============================================

const siteConfig = {
  name: "Shama Landscape Architects",
  url: "https://shamalandscapes.co.ke",
  logo: "/assets/shama_landscape_logo.png",
  description:
    "Shama Landscape Architects blends design, sustainability, and innovation to create timeless outdoor spaces. Based in Kakamega, Kenya — we bring landscapes to life through creative vision and ecological harmony.",
  contact: {
    phone: "+254735184292",
    email: "info@shamalandscapes.co.ke",
  },
  address: {
    street: "Ambwere Plaza, 1st Floor",
    city: "Kakamega",
    region: "Western",
    postalCode: "50100",
    country: "KE",
  },
  social: {
    instagram: "https://www.instagram.com/shama.landscape.architects",
    linkedin: "https://www.linkedin.com/company/shama-landscape-architects",
  },
};

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Imagine it. Build it. Have it.`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "landscape architecture",
    "Shama Landscape Architects",
    "Kenya landscape design",
    "Kakamega architects",
    "urban design",
    "sustainable landscapes",
    "green architecture",
    "East Africa landscape",
    "environmental planning",
    "garden design Kenya",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: `${siteConfig.name} | Imagine it. Build it. Have it.`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Shama Landscape Architects",
      },
    ],
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description:
      "Creating sustainable outdoor spaces that connect people, nature, and design.",
    images: [siteConfig.logo],
  },
  alternates: {
    canonical: siteConfig.url,
    languages: {
      "en-KE": siteConfig.url,
    },
  },
  verification: {
    google: "s1hmnEnZDlU_2uOnGR6IBmI5mLcGT7N2cXizGYuhWiM",
  },
  other: {
    "msapplication-TileColor": "#2A9D8F",
    "theme-color": "#0F7F40",
  },
};

// ============================================
// STRUCTURED DATA (JSON-LD)
// ============================================

function generateStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "ArchitecturalFirm",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    alternateName: "Shama Landscape Architects Ltd",
    url: siteConfig.url,
    logo: `${siteConfig.url}${siteConfig.logo}`,
    image: `${siteConfig.url}${siteConfig.logo}`,
    description: siteConfig.description,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.region,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 0.2827,
      longitude: 34.7523,
    },
    sameAs: Object.values(siteConfig.social),
    areaServed: {
      "@type": "Country",
      name: "Kenya",
      alternateName: "East Africa",
    },
    openingHours: ["Mo-Fr 08:00-17:00", "Sat 09:00-13:00"],
    founder: {
      "@type": "Person",
      name: "John Mulievi",
      jobTitle: "Principal Landscape Architect",
    },
    architect: {
      "@type": "Person",
      name: "Noel Syambi",
      jobTitle: "Architect",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Landscape Architecture Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Landscape Design and Planning",
            description:
              "Comprehensive landscape architecture and master planning services",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Sustainable Site Development",
            description:
              "Eco-friendly site development and environmental planning",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Irrigation and Garden Design",
            description:
              "Custom irrigation systems and garden landscape design",
          },
        },
      ],
    },
    priceRange: "$$",
    currenciesAccepted: "KES, USD",
    paymentAccepted: "Cash, Credit Card, Bank Transfer",
  };
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0F7F40",
};

// ============================================
// ROOT LAYOUT
// ============================================

export default function RootLayout({ children }) {
  const structuredData = generateStructuredData();

  return (
    <html lang="en" dir="ltr" className={montserrat.variable}>
      <head>
        <link rel="icon" href={siteConfig.logo} type="image/png" />
        <link rel="apple-touch-icon" href={siteConfig.logo} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>

      <body className="flex flex-col min-h-screen antialiased font-montserrat bg-shama-clay text-shama-black">
        {/* Skip Link */}
        <a
          href="#main-content"
          className="transition-all sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-shama-green focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-shama-green"
        >
          Skip to main content
        </a>

        {/* ✅ CONDITIONAL UI CONTROL */}
        <LayoutVisibility>
          {children}
        </LayoutVisibility>
      </body>
    </html>
  );
}