/**
 * EBL Store Visuals & Banners Configuration
 * Cleanly decouples image assets from UI layout so admin/client can replace
 * or update images anytime without altering the layout geometry or UX/UI.
 */

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  desktopImage: string;
  mobileImage: string;
  link: string;
  alt: string;
  badge?: string;
  btnText?: string;
  bgColor?: string;
  themeColor?: string;
  isEditorial?: boolean;
}

export interface DesireZoneCard {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  alt: string;
}

export interface ComparisonConfig {
  beforeImage: string;
  afterImage: string;
  beforeLabel: string;
  afterLabel: string;
  title: string;
  subtitle: string;
}

export interface VideoHeroConfig {
  videoUrl: string;
  posterUrl: string;
  badge: string;
  heading: string;
  subtext: string;
  buttonText: string;
  buttonLink: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  badge: string;
  rating: number;
}

export interface FeaturedProductVisuals {
  productId: string;
  brandTag: string;
  title: string;
  ratingAvg: number;
  ratingCount: number;
  pricePaise: number;
  mrpPaise: number;
  discountBadge: string;
  stockStatus: string;
  thumbnails: { id: number; img: string; alt: string }[];
}

export const STORE_VISUALS = {
  // 1. Hero Slideshow (High-fidelity complete banner showcases - 100% full coverage, continuous loop)
  heroSlides: [
    {
      id: "slide-ebl-raft",
      title: "EBL RAFT Antacid Suspension",
      subtitle: "Rapid Acid Fight Therapy · Dual-action foaming raft barrier & instant GERD relief",
      desktopImage: "/images/store/ebl-banner-raft.jpg",
      mobileImage: "/images/store/ebl-banner-raft.jpg",
      link: "/shop/collections/gastro-care",
      alt: "EBL RAFT Rapid Acid Fight Therapy Antacid Suspension 200ml",
      badge: "RAPID ACID FIGHT THERAPY",
      btnText: "Shop Gastro Care",
      bgColor: "#E2F1F8",
      themeColor: "#0284C7",
    },
    {
      id: "slide-ebl-pantop",
      title: "EBL Pantop-DSR Gastro Resistant",
      subtitle: "Gastro-Resistant Pantoprazole & Domperidone Sustained-Release Capsules",
      desktopImage: "/images/store/ebl-banner-pantop.jpg",
      mobileImage: "/images/store/ebl-banner-pantop.jpg",
      link: "/shop/collections/gastro-care",
      alt: "EBL Pantop-DSR Gastro Resistant Capsules",
      badge: "DIGESTIVE CLINICAL THERAPY",
      btnText: "Shop Gastro Care",
      bgColor: "#F0FDF4",
      themeColor: "#16A34A",
    },
    {
      id: "slide-ebl-cilalong",
      title: "EBL Cilalong 10mg Cilnidipine IP",
      subtitle: "Dual L/N-type calcium channel blocker for smooth 24-hour blood pressure regulation",
      desktopImage: "/images/store/ebl-banner-cilalong.jpg",
      mobileImage: "/images/store/ebl-banner-cilalong.jpg",
      link: "/shop/collections/cardio-care",
      alt: "EBL Cilalong 10mg Cilnidipine Tablets IP",
      badge: "CARDIOVASCULAR CARE",
      btnText: "Explore Formulations",
      bgColor: "#EFF6FF",
      themeColor: "#2563EB",
    },
    {
      id: "slide-ebl-vitaplus",
      title: "EBL VitaPlus Women Multivitamin",
      subtitle: "Daily Multivitamin, essential minerals, Iron, Calcium & Biotin for female vitality",
      desktopImage: "/images/store/ebl-banner-vitaplus.jpg",
      mobileImage: "/images/store/ebl-banner-vitaplus.jpg",
      link: "/shop/collections/womens-health",
      alt: "EBL VitaPlus Women Daily Multivitamin & Minerals",
      badge: "WOMEN'S VITALITY",
      btnText: "Shop Women's Range",
      bgColor: "#FDF2F8",
      themeColor: "#DB2777",
    },
  ] as HeroSlide[],

  // 2. Desire Zone (PDF Page 18 exact match)
  desireZone: [
    {
      id: "dz-gastro",
      title: "Gastro & Reflux Care",
      subtitle: "Rapid Foaming Raft",
      image: "/images/products/ebl-raft-3d.jpg",
      link: "/shop/collections/gastro-care",
      alt: "EBL RAFT Antacid Suspension",
    },
    {
      id: "dz-cardio",
      title: "Cardiovascular Care",
      subtitle: "24-Hour BP Regulation",
      image: "/images/products/ebl-cilalong-3d.jpg",
      link: "/shop/collections/cardio-care",
      alt: "EBL Cilalong Tablets",
    },
    {
      id: "dz-vitality",
      title: "Women's Vitality",
      subtitle: "Daily Micronutrients",
      image: "/images/products/ebl-vitaplus-3d.jpg",
      link: "/shop/collections/womens-health",
      alt: "EBL VitaPlus Women Tablets",
    },
  ] as DesireZoneCard[],

  // 3. Switch to EBL RAFT Comparison (PDF Page 17 exact match)
  comparison: {
    beforeImage: "/images/products/ebl-raft-3d.jpg",
    afterImage: "/images/products/ebl-pantop-3d.jpg",
    beforeLabel: "Chalky Antacids?",
    afterLabel: "Foaming Raft Relief",
    title: "Switch to EBL RAFT",
    subtitle: "Drag the slider to compare conventional chalky antacids vs instant raft barrier protection",
  } as ComparisonConfig,

  // 4. Video Hero (PDF Page 14 exact match)
  videoHero: {
    videoUrl:
      "https://epiclovestore.com/cdn/shop/videos/c/vp/615fd20c92ce4e38ade617654fd1a9e9/615fd20c92ce4e38ade617654fd1a9e9.HD-1080p-7.2Mbps-48496120.mp4?v=0",
    posterUrl: "/images/products/ebl-raft-3d.jpg",
    badge: "WHO-GMP CERTIFIED FORMULATION",
    heading: "Engineered for Clinical Precision",
    subtext:
      "From liquid raft suspension technology to micronized dual calcium channel blockers, Eastern Biochemicals delivers hospital-trusted pharmaceuticals with zero compromise on quality.",
    buttonText: "Explore Pharmacy Range",
    buttonLink: "/shop/collections",
  } as VideoHeroConfig,

  // 5. Featured Product Visuals (PDF Pages 11 & 13)
  featuredProduct: {
    productId: "eb-prod-001",
    brandTag: "EBL Pharmaceuticals",
    title: "EBL RAFT Rapid Acid Fight Therapy Antacid Suspension (200 ml)",
    ratingAvg: 4.9,
    ratingCount: 48,
    pricePaise: 16500,
    mrpPaise: 21000,
    discountBadge: "Save 21%",
    stockStatus: "In Stock · Dispatches within 24 hours",
    thumbnails: [
      { id: 0, img: "/images/products/ebl-raft-3d.jpg", alt: "EBL RAFT Suspension 3D Render" },
      { id: 1, img: "/images/products/ebl-cilalong-3d.jpg", alt: "EBL Cilalong 10mg 3D Render" },
      { id: 2, img: "/images/products/ebl-pantop-3d.jpg", alt: "EBL Pantop-DSR 3D Render" },
      { id: 3, img: "/images/products/ebl-vitaplus-3d.jpg", alt: "EBL VitaPlus 3D Render" },
    ],
  } as FeaturedProductVisuals,

  // 6. Testimonials Banner (PDF Page 12 exact match)
  testimonials: {
    backgroundImage: "/images/store/ebl-banner-raft.jpg",
    reviews: [
      {
        id: "rev-1",
        quote: "EBL RAFT provided instant relief from night-time acidity. Within 90 seconds the burning sensation was completely gone with zero chalkiness.",
        author: "Dr. Rajesh Sen",
        badge: "Gastroenterologist, Kolkata",
        rating: 5,
      },
      {
        id: "rev-2",
        quote: "Cilalong 10mg has been remarkably consistent for managing patient hypertension with zero ankle edema compared to older calcium blockers.",
        author: "Dr. Sharmila Roy",
        badge: "Consultant Cardiologist",
        rating: 5,
      },
      {
        id: "rev-3",
        quote: "EBL Pantop-DSR is our standard first-line recommendation for chronic GERD; patient adherence has been outstanding due to gentle gastric tolerance.",
        author: "Dr. A. K. Choudhury",
        badge: "Senior Physician",
        rating: 5,
      },
    ] as TestimonialItem[],
  },
};
