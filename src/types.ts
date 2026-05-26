export interface CmsHeader {
  heroTitle: string;
  heroSub: string;
  tickerItems: string[];
  footerDesc: string;
  footerTagline: string;

  // --- Brand Logo Customization ---
  logoTextPrimary?: string;     // e.g., "AFRO"
  logoTextSecondary?: string;   // e.g., "BAOBAB"
  logoSub?: string;             // e.g., "CULTURAL HUB & ART GALLERY"
  logoMode?: "default-emblem" | "custom-text" | "image-url";
  logoImageUrl?: string;        // An uploaded/custom URL for the brand logo
  logoEmblemColor?: string;     // Color like '#CB6A4A' (clay)

  footerLogoMode?: "default-emblem" | "custom-text" | "image-url" | "match-header";
  footerLogoImageUrl?: string;

  // --- Hero Wallpaper / Shapes Customize ---
  heroWallpaperMode?: "sunrise-tribal" | "geometric-mesh" | "minimalist-gradient" | "custom-image";
  heroWallpaperUrl?: string;    // Custom image overlay
  heroGradientStart?: string;   // Dark background hex (e.g., "#160e07")
  heroGradientEnd?: string;     // Dark background hex (e.g., "#141d30")

  // --- Hero Headline Properties ---
  heroTextAlignment?: "left" | "center" | "right";
  heroTitleSize?: number;
  heroSubSize?: number;

  // --- Story Text Customization ---
  aboutLabel?: string;          // "Our Story"
  aboutHeading?: string;        // "A Place Where Culture Is Experienced..."
  aboutDesc1?: string;          // First paragraph
  aboutDesc2?: string;          // Second paragraph
  aboutBtnText?: string;        // Link button text
  aboutFeaturedBadge?: string;  // "Featured Immersive Zone"
  aboutFeaturedTitle?: string;  // "The Living Baobab Story Room"
  aboutFeaturedDesc?: string;   // Description of the story room
  aboutFeaturedImageMode?: "pattern" | "custom-image"; // Style of background
  aboutFeaturedImageUrl?: string; // Custom image URL for the about block

  // --- Core Theme Color Customization ---
  themeColorClay?: string;
  themeColorMoss?: string;
  themeColorIndigo?: string;
  themeColorCharcoal?: string;
  themeColorIvory?: string;

  // --- Core Theme Font Customization ---
  themeFontFamilyHeadings?: string; // e.g. "Space Grotesk"
  themeFontFamilyBody?: string;     // e.g. "Inter"
  themeFontImportUrl?: string;      // Optional Google Font embed snippet or @import url

  // --- Custom Hero Action Buttons ---
  heroBtn1Text?: string;
  heroBtn1Link?: string;
  heroBtn2Text?: string;
  heroBtn2Link?: string;

  // --- Contact Information List ---
  contactPhone?: string;
  contactEmail?: string;
  contactAddress?: string;
  contactHours?: string;

  // --- Social Media Connections ---
  socialInstagram?: string;
  socialFacebook?: string;
  socialTwitter?: string;
  socialTiktok?: string;
  socialYoutube?: string;

  // --- Inquiry Booking Notification Target Email ---
  inquiryRecipientEmail?: string;

  // --- Brand Logo Sizes ---
  navbarLogoSize?: number; // scale multiplier, default 100 (%)
  footerLogoSize?: number; // scale multiplier, default 100 (%)
}

export interface CustomPage {
  id: string;
  slug: string;
  title: string;
  content: string; // Dynamic markdown or plain/HTML text
  shownInNavbar: boolean;
  createdAt: string;
}

export interface Experience {
  id: string;
  number: string;
  title: string;
  description: string;
  imageUrl?: string;            // Keep it optional! Show image in detail grid if present
}

export interface Exhibition {
  id: string;
  badge: string;
  title: string;
  type: string;
  status: string;
  isNow: boolean;
  imageUrl?: string;            // Optional cover image for the current exhibitions
}

export interface EventItem {
  id: string;
  day: string;
  month: string;
  category: string;
  title: string;
  time: string;
  audience: string;
  theme: 'clay' | 'moss' | 'indigo';
  imageUrl?: string;            // Optional banner / thumbnail image
}

export interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'school' | 'corporate' | 'general';
  notes: string;
  status: 'unread' | 'read' | 'completed';
  timestamp: string;
}

export interface CmsData {
  header: CmsHeader;
  experiences: Experience[];
  exhibitions: Exhibition[];
  events: EventItem[];
  bookings: Booking[];
  customPages?: CustomPage[]; // Newly dynamic custom subpages list
}
