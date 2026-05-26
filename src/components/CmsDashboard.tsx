import { useState, useEffect, FormEvent } from "react";
import { CmsData, Experience, Exhibition, EventItem, Booking, CustomPage } from "../types";
import { 
  X, Check, Trash2, Plus, LogOut, Settings, 
  BookOpen, Calendar, HelpCircle, Mail, Phone,
  Bookmark, Edit3, ArrowRight, ShieldCheck, Lock, Unlock,
  FileText, Globe, Palette, Type, UploadIcon
} from "lucide-react";
import {
  cmsLogin,
  updateCmsHeader,
  saveCmsExperience,
  deleteCmsExperience,
  saveCmsExhibition,
  deleteCmsExhibition,
  saveCmsEvent,
  deleteCmsEvent,
  updateCmsBookingStatus,
  deleteCmsBooking,
  saveCmsPage,
  deleteCmsPage,
  uploadCmsImage
} from "../lib/cmsClient";

interface CmsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  data: CmsData | null;
  onRefresh: () => void;
}

type TabType = "general" | "experiences" | "exhibitions" | "events" | "bookings" | "pages";

function FileInputButton({ onUploaded, label = "Upload from Computer" }: { onUploaded: (url: string) => void; label?: string }) {
  const [uploading, setUploading] = useState(false);
  return (
    <div className="flex items-center gap-2 mt-1.5">
      <label className="text-[10px] bg-clay hover:bg-terracotta text-white px-3 py-2 rounded-[2px] font-mono uppercase tracking-widest cursor-pointer font-bold inline-flex items-center gap-1.5 select-none transition-all shadow-sm hover:-translate-y-[0.5px] cursor-pointer">
        {uploading ? "Uploading file..." : label}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={uploading}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setUploading(true);
            const reader = new FileReader();
            reader.onloadend = async () => {
              const base64 = reader.result as string;
              try {
                const res = await uploadCmsImage(file.name, base64);
                if (res.success && res.url) {
                  onUploaded(res.url);
                } else {
                  alert("Upload failed: " + (res.error || "Integrity error"));
                }
              } catch (err) {
                alert("Upload backend connection failed.");
              } finally {
                setUploading(false);
              }
            };
            reader.readAsDataURL(file);
          }}
        />
      </label>
    </div>
  );
}

export default function CmsDashboard({ isOpen, onClose, data, onRefresh }: CmsDashboardProps) {
  const [sessionToken, setSessionToken] = useState<string | null>(
    localStorage.getItem("afro_baobab_cms_session")
  );

  // Auth local state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState<TabType>("general");

  // Edit Forms state
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSub, setHeroSub] = useState("");
  const [footerDesc, setFooterDesc] = useState("");
  const [footerTagline, setFooterTagline] = useState("");
  const [tickerInput, setTickerInput] = useState("");
  
  // Custom design states
  const [logoTextPrimary, setLogoTextPrimary] = useState("");
  const [logoTextSecondary, setLogoTextSecondary] = useState("");
  const [logoSub, setLogoSub] = useState("");
  const [logoMode, setLogoMode] = useState<"default-emblem" | "custom-text" | "image-url">("default-emblem");
  const [logoImageUrl, setLogoImageUrl] = useState("");
  const [logoEmblemColor, setLogoEmblemColor] = useState("");

  const [heroWallpaperMode, setHeroWallpaperMode] = useState<"sunrise-tribal" | "geometric-mesh" | "minimalist-gradient" | "custom-image">("sunrise-tribal");
  const [heroWallpaperUrl, setHeroWallpaperUrl] = useState("");
  const [heroGradientStart, setHeroGradientStart] = useState("");
  const [heroGradientEnd, setHeroGradientEnd] = useState("");

  const [aboutLabel, setAboutLabel] = useState("");
  const [aboutHeading, setAboutHeading] = useState("");
  const [aboutDesc1, setAboutDesc1] = useState("");
  const [aboutDesc2, setAboutDesc2] = useState("");
  const [aboutBtnText, setAboutBtnText] = useState("");
  const [aboutFeaturedBadge, setAboutFeaturedBadge] = useState("");
  const [aboutFeaturedTitle, setAboutFeaturedTitle] = useState("");
  const [aboutFeaturedDesc, setAboutFeaturedDesc] = useState("");
  const [aboutFeaturedImageMode, setAboutFeaturedImageMode] = useState<"pattern" | "custom-image">("pattern");
  const [aboutFeaturedImageUrl, setAboutFeaturedImageUrl] = useState("");
  const [aboutStatsNumber, setAboutStatsNumber] = useState("");
  const [aboutStatsLabel, setAboutStatsLabel] = useState("");

  // Section Visibilities and Custom texts
  const [showAbout, setShowAbout] = useState(true);
  const [showHeritage, setShowHeritage] = useState(true);
  const [showExperiences, setShowExperiences] = useState(true);
  const [showExhibitions, setShowExhibitions] = useState(true);
  const [showSchools, setShowSchools] = useState(true);
  const [showEvents, setShowEvents] = useState(true);

  // Heritage motifs texts & design styles
  const [heritageLabel, setHeritageLabel] = useState("");
  const [heritageTitle, setHeritageTitle] = useState("");
  const [heritageSubTitle, setHeritageSubTitle] = useState("");
  const [heritageDesign, setHeritageDesign] = useState<"default" | "dark" | "warm" | "minimal">("default");

  // What We Offer experiences texts
  const [experiencesLabel, setExperiencesLabel] = useState("");
  const [experiencesTitle, setExperiencesTitle] = useState("");
  const [experiencesSubTitle, setExperiencesSubTitle] = useState("");

  // Exhibitions texts
  const [exhibitionsLabel, setExhibitionsLabel] = useState("");
  const [exhibitionsTitle, setExhibitionsTitle] = useState("");
  const [exhibitionsSubTitle, setExhibitionsSubTitle] = useState("");

  // Schools/Organizations paths texts
  const [schoolsLabel, setSchoolsLabel] = useState("");
  const [schoolsTitle, setSchoolsTitle] = useState("");
  const [schoolsSubTitle, setSchoolsSubTitle] = useState("");

  // Events session calendar texts
  const [eventsLabel, setEventsLabel] = useState("");
  const [eventsTitle, setEventsTitle] = useState("");
  const [eventsSubTitle, setEventsSubTitle] = useState("");

  // Extended theme color states
  const [themeColorClay, setThemeColorClay] = useState("#CB6A4A");
  const [themeColorMoss, setThemeColorMoss] = useState("#202c1c");
  const [themeColorIndigo, setThemeColorIndigo] = useState("#0d1622");
  const [themeColorCharcoal, setThemeColorCharcoal] = useState("#19120c");
  const [themeColorIvory, setThemeColorIvory] = useState("#FAF8F4");

  // Custom font family states
  const [themeFontFamilyHeadings, setThemeFontFamilyHeadings] = useState("Space Grotesk");
  const [themeFontFamilyBody, setThemeFontFamilyBody] = useState("Inter");
  const [themeFontImportUrl, setThemeFontImportUrl] = useState("");

  // Custom Hero buttons states
  const [heroBtn1Text, setHeroBtn1Text] = useState("Explore Experience Zones");
  const [heroBtn1Link, setHeroBtn1Link] = useState("#experiences");
  const [heroBtn2Text, setHeroBtn2Text] = useState("Reserve a Visit");
  const [heroBtn2Link, setHeroBtn2Link] = useState("book");

  // Contact list states
  const [contactPhone, setContactPhone] = useState("+971 4 400 0000");
  const [contactEmail, setContactEmail] = useState("info@afrobaobab.com");
  const [contactAddress, setContactAddress] = useState("Alserkal Avenue, Al Quoz, Dubai, UAE");
  const [contactHours, setContactHours] = useState("Mon - Sun: 10:00 AM - 9:00 PM");

  // Social media link states
  const [socialInstagram, setSocialInstagram] = useState("");
  const [socialFacebook, setSocialFacebook] = useState("");
  const [socialTwitter, setSocialTwitter] = useState("");
  const [socialTiktok, setSocialTiktok] = useState("");
  const [socialYoutube, setSocialYoutube] = useState("");

  // Inquiry target email state
  const [inquiryRecipientEmail, setInquiryRecipientEmail] = useState("inquiry@afrobaobab.com");

  // Brand Logo scale dimensions
  const [navbarLogoSize, setNavbarLogoSize] = useState<number>(100);
  const [footerLogoSize, setFooterLogoSize] = useState<number>(100);

  // Footer Logo Customize
  const [footerLogoMode, setFooterLogoMode] = useState<"default-emblem" | "custom-text" | "image-url" | "match-header">("match-header");
  const [footerLogoImageUrl, setFooterLogoImageUrl] = useState("");

  // Hero text layout location and size states
  const [heroTextAlignment, setHeroTextAlignment] = useState<"left" | "center" | "right">("left");
  const [heroTitleSize, setHeroTitleSize] = useState<number>(72);
  const [heroSubSize, setHeroSubSize] = useState<number>(18);

  // Custom subpage manager states
  const [pageTitle, setPageTitle] = useState("");
  const [pageSlug, setPageSlug] = useState("");
  const [pageContent, setPageContent] = useState("");
  const [pageShownInNavbar, setPageShownInNavbar] = useState(true);

  // Dynamic Item states
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [expTitle, setExpTitle] = useState("");
  const [expDesc, setExpDesc] = useState("");
  const [expNum, setExpNum] = useState("");
  const [expImageUrl, setExpImageUrl] = useState("");

  const [exhBadge, setExhBadge] = useState("");
  const [exhTitle, setExhTitle] = useState("");
  const [exhType, setExhType] = useState("");
  const [exhStatus, setExhStatus] = useState("");
  const [exhIsNow, setExhIsNow] = useState(false);
  const [exhImageUrl, setExhImageUrl] = useState("");

  const [evDay, setEvDay] = useState("");
  const [evMonth, setEvMonth] = useState("");
  const [evTitle, setEvTitle] = useState("");
  const [evCat, setEvCat] = useState("");
  const [evTime, setEvTime] = useState("");
  const [evAudience, setEvAudience] = useState("");
  const [evTheme, setEvTheme] = useState<'clay' | 'moss' | 'indigo'>("clay");
  const [evImageUrl, setEvImageUrl] = useState("");

  // Load Initial states when data loads
  useEffect(() => {
    if (data) {
      setHeroTitle(data.header.heroTitle || "");
      setHeroSub(data.header.heroSub || "");
      setFooterDesc(data.header.footerDesc || "");
      setFooterTagline(data.header.footerTagline || "");
      setTickerInput((data.header.tickerItems || []).join(", "));

      // Brand Logo customizer initial values
      setLogoTextPrimary(data.header.logoTextPrimary || "AFRO");
      setLogoTextSecondary(data.header.logoTextSecondary || "BAOBAB");
      setLogoSub(data.header.logoSub || "CULTURAL HUB & ART GALLERY");
      setLogoMode(data.header.logoMode || "default-emblem");
      setLogoImageUrl(data.header.logoImageUrl || "");
      setLogoEmblemColor(data.header.logoEmblemColor || "#CB6A4A");

      // Background shapes initial values
      setHeroWallpaperMode(data.header.heroWallpaperMode || "sunrise-tribal");
      setHeroWallpaperUrl(data.header.heroWallpaperUrl || "");
      setHeroGradientStart(data.header.heroGradientStart || "#160e07");
      setHeroGradientEnd(data.header.heroGradientEnd || "#141d30");

      // Story block initial values
      setAboutLabel(data.header.aboutLabel || "Our Story");
      setAboutHeading(data.header.aboutHeading || "");
      setAboutDesc1(data.header.aboutDesc1 || "");
      setAboutDesc2(data.header.aboutDesc2 || "");
      setAboutBtnText(data.header.aboutBtnText || "Explore Experience Zones");
      setAboutFeaturedBadge(data.header.aboutFeaturedBadge || "Featured Immersive Zone");
      setAboutFeaturedTitle(data.header.aboutFeaturedTitle || "");
      setAboutFeaturedDesc(data.header.aboutFeaturedDesc || "");
      setAboutFeaturedImageMode(data.header.aboutFeaturedImageMode || "pattern");
      setAboutFeaturedImageUrl(data.header.aboutFeaturedImageUrl || "");
      setAboutStatsNumber(data.header.aboutStatsNumber || "6+");
      setAboutStatsLabel(data.header.aboutStatsLabel || "Immersive\nExperience Zones");

      setShowAbout(data.header.showAbout !== false);
      setShowHeritage(data.header.showHeritage !== false);
      setShowExperiences(data.header.showExperiences !== false);
      setShowExhibitions(data.header.showExhibitions !== false);
      setShowSchools(data.header.showSchools !== false);
      setShowEvents(data.header.showEvents !== false);

      setHeritageLabel(data.header.heritageLabel || "Living Visual Language");
      setHeritageTitle(data.header.heritageTitle || "Heritage <span class=\"text-clay italic\">Symbols & Artistry</span>");
      setHeritageSubTitle(data.header.heritageSubTitle || "Explore the traditional visual motifs of African storytelling. Click on the cultural designs below to learn their philosophy, and compose your own modern textiles using our digital weaving loom.");
      setHeritageDesign(data.header.heritageDesign || "default");

      setExperiencesLabel(data.header.experiencesLabel || "What We Offer");
      setExperiencesTitle(data.header.experiencesTitle || "Every Visit Is a <span class=\"text-clay italic\">New Journey</span>");
      setExperiencesSubTitle(data.header.experiencesSubTitle || "");

      setExhibitionsLabel(data.header.exhibitionsLabel || "Current & Upcoming");
      setExhibitionsTitle(data.header.exhibitionsTitle || "Where Every Wall <br />Tells a <span class=\"text-terracotta italic\">Story</span>");
      setExhibitionsSubTitle(data.header.exhibitionsSubTitle || "Our gallery rotates with living exhibitions that cross cultures, geographies, and generations. Touch, listen, edit, and discover.");

      setSchoolsLabel(data.header.schoolsLabel || "Who We Welcome");
      setSchoolsTitle(data.header.schoolsTitle || "Designed for Every <span class=\"text-clay italic\">Curious Mind</span>");
      setSchoolsSubTitle(data.header.schoolsSubTitle || "Whether you are an educator seeking curriculum-focused learning or a group seeking to build cultural intelligence, we have tailored path programs.");

      setEventsLabel(data.header.eventsLabel || "Upcoming Sessions");
      setEventsTitle(data.header.eventsTitle || "What's <span class=\"text-clay italic\">On</span>");
      setEventsSubTitle(data.header.eventsSubTitle || "");

      // Themes, Fonts, inquiry, social, buttons, contact list initial values
      setThemeColorClay(data.header.themeColorClay || "#CB6A4A");
      setThemeColorMoss(data.header.themeColorMoss || "#202c1c");
      setThemeColorIndigo(data.header.themeColorIndigo || "#0d1622");
      setThemeColorCharcoal(data.header.themeColorCharcoal || "#19120c");
      setThemeColorIvory(data.header.themeColorIvory || "#FAF8F4");

      setThemeFontFamilyHeadings(data.header.themeFontFamilyHeadings || "Space Grotesk");
      setThemeFontFamilyBody(data.header.themeFontFamilyBody || "Inter");
      setThemeFontImportUrl(data.header.themeFontImportUrl || "");

      setHeroBtn1Text(data.header.heroBtn1Text || "Explore Experience Zones");
      setHeroBtn1Link(data.header.heroBtn1Link || "#experiences");
      setHeroBtn2Text(data.header.heroBtn2Text || "Reserve a Visit");
      setHeroBtn2Link(data.header.heroBtn2Link || "book");

      setContactPhone(data.header.contactPhone || "+971 4 400 0000");
      setContactEmail(data.header.contactEmail || "info@afrobaobab.com");
      setContactAddress(data.header.contactAddress || "Alserkal Avenue, Al Quoz, Dubai, UAE");
      setContactHours(data.header.contactHours || "Mon - Sun: 10:00 AM - 9:00 PM");

      setSocialInstagram(data.header.socialInstagram || "");
      setSocialFacebook(data.header.socialFacebook || "");
      setSocialTwitter(data.header.socialTwitter || "");
      setSocialTiktok(data.header.socialTiktok || "");
      setSocialYoutube(data.header.socialYoutube || "");

      setInquiryRecipientEmail(data.header.inquiryRecipientEmail || "inquiry@afrobaobab.com");
      setNavbarLogoSize(data.header.navbarLogoSize || 100);
      setFooterLogoSize(data.header.footerLogoSize || 100);

      setFooterLogoMode(data.header.footerLogoMode || "match-header");
      setFooterLogoImageUrl(data.header.footerLogoImageUrl || "");

      setHeroTextAlignment(data.header.heroTextAlignment || "left");
      setHeroTitleSize(data.header.heroTitleSize || 72);
      setHeroSubSize(data.header.heroSubSize || 18);
    }
  }, [data]);

  if (!isOpen) return null;

  // Handle Login submission
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    try {
      const result = await cmsLogin(username, password);
      localStorage.setItem("afro_baobab_cms_session", result.token);
      setSessionToken(result.token);
      onRefresh();
    } catch (err: any) {
      setAuthError(err.message || "Failed to communicate with authentication server.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("afro_baobab_cms_session");
    setSessionToken(null);
    onRefresh();
  };

  // Save general header configuration
  const handleSaveHeader = async () => {
    try {
      const res = await updateCmsHeader({
        heroTitle,
        heroSub,
        footerDesc,
        footerTagline,
        tickerItems: tickerInput.split(",").map(x => x.trim()).filter(Boolean),

        logoTextPrimary,
        logoTextSecondary,
        logoSub,
        logoMode,
        logoImageUrl,
        logoEmblemColor,

        footerLogoMode,
        footerLogoImageUrl,

        heroWallpaperMode,
        heroWallpaperUrl,
        heroGradientStart,
        heroGradientEnd,

        heroTextAlignment,
        heroTitleSize: Number(heroTitleSize) || 72,
        heroSubSize: Number(heroSubSize) || 18,

        aboutLabel,
        aboutHeading,
        aboutDesc1,
        aboutDesc2,
        aboutBtnText,
        aboutFeaturedBadge,
        aboutFeaturedTitle,
        aboutFeaturedDesc,
        aboutFeaturedImageMode,
        aboutFeaturedImageUrl,
        aboutStatsNumber,
        aboutStatsLabel,

        // Vision Sections Control toggles
        showAbout,
        showHeritage,
        showExperiences,
        showExhibitions,
        showSchools,
        showEvents,

        // Section custom strings
        heritageLabel,
        heritageTitle,
        heritageSubTitle,
        heritageDesign,

        experiencesLabel,
        experiencesTitle,
        experiencesSubTitle,

        exhibitionsLabel,
        exhibitionsTitle,
        exhibitionsSubTitle,

        schoolsLabel,
        schoolsTitle,
        schoolsSubTitle,

        eventsLabel,
        eventsTitle,
        eventsSubTitle,

        // Theme Style Configurations
        themeColorClay,
        themeColorMoss,
        themeColorIndigo,
        themeColorCharcoal,
        themeColorIvory,
        themeFontFamilyHeadings,
        themeFontFamilyBody,
        themeFontImportUrl,

        // Sizing Slider Values
        navbarLogoSize: Number(navbarLogoSize) || 100,
        footerLogoSize: Number(footerLogoSize) || 100,

        // Custom Buttons Link-text configs
        heroBtn1Text,
        heroBtn1Link,
        heroBtn2Text,
        heroBtn2Link,

        // Custom Email
        inquiryRecipientEmail,

        // Contact particulars
        contactPhone,
        contactEmail,
        contactAddress,
        contactHours,

        // Social Connections
        socialInstagram,
        socialFacebook,
        socialTwitter,
        socialTiktok,
        socialYoutube,
      });
      if (res.success) {
        alert("Homepage configuration saved successfully!");
        onRefresh();
      }
    } catch (err) {
      alert("Failed to save changes.");
    }
  };

  // Add/Update Experience
  const handleSaveExperience = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await saveCmsExperience(editingItemId, {
        title: expTitle,
        description: expDesc,
        number: expNum,
        imageUrl: expImageUrl
      });

      if (res.success) {
        setExpTitle("");
        setExpDesc("");
        setExpNum("");
        setExpImageUrl("");
        setEditingItemId(null);
        onRefresh();
      }
    } catch (err) {
      alert("Failed to save experience.");
    }
  };

  const handleDeleteExperience = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience zone?")) return;
    try {
      const res = await deleteCmsExperience(id);
      if (res.success) onRefresh();
    } catch (err) {
      alert("Failed to delete.");
    }
  };

  // Add/Update Exhibition
  const handleSaveExhibition = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await saveCmsExhibition(editingItemId, {
        badge: exhBadge,
        title: exhTitle,
        type: exhType,
        status: exhStatus,
        isNow: exhIsNow,
        imageUrl: exhImageUrl
      });

      if (res.success) {
        setExhBadge("");
        setExhTitle("");
        setExhType("");
        setExhStatus("");
        setExhIsNow(false);
        setExhImageUrl("");
        setEditingItemId(null);
        onRefresh();
      }
    } catch (err) {
      alert("Failed to save exhibition.");
    }
  };

  const handleDeleteExhibition = async (id: string) => {
    if (!confirm("Delete this exhibition entry?")) return;
    try {
      const res = await deleteCmsExhibition(id);
      if (res.success) onRefresh();
    } catch (err) {
      alert("Failed to delete.");
    }
  };

  // Add/Update Event Item
  const handleSaveEvent = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await saveCmsEvent(editingItemId, { 
        day: evDay, 
        month: evMonth, 
        title: evTitle, 
        category: evCat, 
        time: evTime, 
        audience: evAudience, 
        theme: evTheme,
        imageUrl: evImageUrl
      });

      if (res.success) {
        setEvDay("");
        setEvMonth("");
        setEvTitle("");
        setEvCat("");
        setEvTime("");
        setEvAudience("");
        setEvTheme("clay");
        setEvImageUrl("");
        setEditingItemId(null);
        onRefresh();
      }
    } catch (err) {
      alert("Failed to save event.");
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Delete this event panel?")) return;
    try {
      const res = await deleteCmsEvent(id);
      if (res.success) onRefresh();
    } catch (err) {
      alert("Failed to delete.");
    }
  };

  // Inquiries / Bookings Status changes
  const handleUpdateBookingStatus = async (id: string, status: 'read' | 'completed' | 'unread') => {
    try {
      const res = await updateCmsBookingStatus(id, status);
      if (res.success) onRefresh();
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm("Delete this booking request forever?")) return;
    try {
      const res = await deleteCmsBooking(id);
      if (res.success) onRefresh();
    } catch (err) {
      alert("Failed to delete booking.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-ivory border border-sand/50 rounded-[4px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header bar */}
        <div className="bg-[#1f1610] text-white px-6 py-4 flex items-center justify-between border-b border-sand/20">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-clay animate-pulse" />
            <div>
              <h2 className="font-serif text-xl tracking-wide font-medium">
                Baobab CMS <span className="text-sand/50 text-sm font-light">Content Desk</span>
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {sessionToken && (
              <button
                onClick={handleLogout}
                className="text-white/60 hover:text-clay text-xs tracking-wider uppercase font-mono flex items-center gap-1 cursor-pointer transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            )}
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Not Logged In Case */}
        {!sessionToken ? (
          <div className="flex-1 bg-warm-white flex items-center justify-center p-8 sm:p-12">
            <div className="w-full max-w-md bg-white border border-sand/60 rounded-[3px] shadow-lg p-6 sm:p-8">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-clay/10 rounded-full flex items-center justify-center mx-auto mb-2 text-clay">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-2xl font-light text-charcoal">Security Verification</h3>
                <p className="text-xs text-charcoal/50 mt-1 font-sans">
                  Please verify credentials to manage the active Afro Baobab landing content.
                </p>
              </div>

              {authError && (
                <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs rounded-[2px] mb-4 font-sans">
                  {authError}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="E.g. admin"
                    className="w-full bg-ivory/50 border border-sand/40 px-4 py-2.5 text-xs text-charcoal rounded-[2px] focus:outline-none focus:border-clay transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-[#333]/60 mb-1 font-mono font-medium">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="E.g. admin"
                    className="w-full bg-ivory/50 border border-sand/40 px-4 py-2.5 text-xs text-charcoal rounded-[2px] focus:outline-none focus:border-clay transition-colors"
                  />
                </div>

                <div className="bg-sand/20 rounded-[2px] p-2.5 text-[10px] text-clay/90 flex gap-2 items-start font-mono leading-relaxed">
                  <Unlock className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  <div>
                    <span>Demo Credentials: Use username <strong className="font-bold">admin</strong> and password <strong className="font-bold">admin</strong></span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-clay hover:bg-terracotta disabled:bg-clay/50 text-white font-mono uppercase tracking-[0.12em] text-xs py-3 rounded-[2px] transition-colors cursor-pointer text-center font-medium shadow-md"
                >
                  {authLoading ? "Verifying Session ..." : "Unlock Content Manager"}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Logged In Dashboard Dashboard Workspace */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
            {/* Sidebar navigation tabs */}
            <div className="w-full md:w-60 bg-charcoal text-white flex flex-row md:flex-col border-b md:border-b-0 md:border-r border-sand/10 overflow-x-auto md:overflow-x-visible">
              <button
                onClick={() => setActiveTab("general")}
                className={`flex-1 md:flex-none py-3.5 px-5 text-left text-xs tracking-wider uppercase font-sans font-medium flex items-center gap-2.5 transition-all text-nowrap cursor-pointer ${
                  activeTab === "general"
                    ? "bg-clay text-white shadow-inner"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <Settings className="w-4 h-4 text-sand/60" /> General Settings
              </button>

              <button
                onClick={() => {
                  setActiveTab("experiences");
                  setEditingItemId(null);
                }}
                className={`flex-1 md:flex-none py-3.5 px-5 text-left text-xs tracking-wider uppercase font-sans font-medium flex items-center gap-2.5 transition-all text-nowrap cursor-pointer ${
                  activeTab === "experiences"
                    ? "bg-clay text-white shadow-inner"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <BookOpen className="w-4 h-4 text-sand/60" /> Experiences
              </button>

              <button
                onClick={() => {
                  setActiveTab("exhibitions");
                  setEditingItemId(null);
                }}
                className={`flex-1 md:flex-none py-3.5 px-5 text-left text-xs tracking-wider uppercase font-sans font-medium flex items-center gap-2.5 transition-all text-nowrap cursor-pointer ${
                  activeTab === "exhibitions"
                    ? "bg-clay text-white shadow-inner"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <HelpCircle className="w-4 h-4 text-sand/60" /> Exhibitions
              </button>

              <button
                onClick={() => {
                  setActiveTab("events");
                  setEditingItemId(null);
                }}
                className={`flex-1 md:flex-none py-3.5 px-5 text-left text-xs tracking-wider uppercase font-sans font-medium flex items-center gap-2.5 transition-all text-nowrap cursor-pointer ${
                  activeTab === "events"
                    ? "bg-clay text-white shadow-inner"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <Calendar className="w-4 h-4 text-sand/60" /> Events
              </button>

              <button
                onClick={() => setActiveTab("bookings")}
                className={`flex-1 md:flex-none py-3.5 px-5 text-left text-xs tracking-wider uppercase font-sans font-medium flex items-center gap-2.5 transition-all text-nowrap relative cursor-pointer ${
                  activeTab === "bookings"
                    ? "bg-clay text-white shadow-inner"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <Bookmark className="w-4 h-4 text-sand/60" /> Inquiries
                {data?.bookings && data.bookings.filter(b => b.status === 'unread').length > 0 && (
                  <span className="ml-auto bg-clay text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold animate-pulse">
                    {data.bookings.filter(b => b.status === 'unread').length}
                  </span>
                )}
              </button>
            </div>

            {/* Inner Desk Content */}
            <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-warm-white">
              {/* general */}
              {activeTab === "general" && (
                <div className="space-y-8 pb-10">
                  <div className="border-b border-sand/20 pb-4">
                    <h3 className="font-serif text-2xl text-charcoal">Design & Brand Customizer Desk</h3>
                    <p className="text-xs text-[#777] mt-1 font-sans">
                      Changes here update the branding, background wallpaper, interactive design palettes, and general page segments immediately.
                    </p>
                  </div>

                  {/* LOGO & BRAND SECTION */}
                  <div className="bg-white border border-sand/30 p-5 rounded-[3px] space-y-4 shadow-sm">
                    <h4 className="font-mono text-xs uppercase tracking-wider text-clay font-bold border-b border-sand/15 pb-2">1. Logo & Emblem Settings</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">Logo Mode</label>
                        <select
                          value={logoMode}
                          onChange={(e) => setLogoMode(e.target.value as any)}
                          className="w-full bg-ivory/35 border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                        >
                          <option value="default-emblem">Default Baobab Emblem & Text</option>
                          <option value="custom-text">Pure Custom Typography (No Emblem)</option>
                          <option value="image-url">Custom Logo Image (Asset URL)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">Emblem Vector Color</label>
                        <input
                          type="text"
                          value={logoEmblemColor}
                          onChange={(e) => setLogoEmblemColor(e.target.value)}
                          placeholder="E.g. #CB6A4A"
                          className="w-full bg-ivory/35 border border-sand/50 px-3 py-2.5 text-xs text-charcoal rounded-[2px]"
                        />
                      </div>
                    </div>

                    {logoMode === "image-url" && (
                      <div className="bg-sand/10 p-3 rounded-[2px] border border-sand/20 space-y-2">
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">Custom Logo Image URL / Path</label>
                        <div className="flex gap-4 items-start">
                          <div className="flex-1 space-y-1.5">
                            <input
                              type="text"
                              value={logoImageUrl}
                              onChange={(e) => setLogoImageUrl(e.target.value)}
                              placeholder="E.g. /images/my-logo.png"
                              className="w-full bg-white border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                            />
                            <div className="flex items-center gap-2">
                              <FileInputButton onUploaded={setLogoImageUrl} label="Upload Logo from Computer" />
                              <span className="text-[10px] text-charcoal/50 font-sans">Or browse a local JPG/PNG</span>
                            </div>
                          </div>
                          {logoImageUrl && (
                            <div className="w-16 h-16 bg-white border border-sand/30 rounded-[2px] p-1 flex items-center justify-center shrink-0 shadow-xs">
                              <img src={logoImageUrl} alt="Logo Preview" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">Primary Typography (E.g. AFRO)</label>
                        <input
                          type="text"
                          value={logoTextPrimary}
                          onChange={(e) => setLogoTextPrimary(e.target.value)}
                          className="w-full bg-ivory/35 border border-sand/50 px-3 py-2.5 text-xs text-charcoal rounded-[2px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">Secondary Typography (E.g. BAOBAB)</label>
                        <input
                          type="text"
                          value={logoTextSecondary}
                          onChange={(e) => setLogoTextSecondary(e.target.value)}
                          className="w-full bg-ivory/35 border border-sand/50 px-3 py-2.5 text-xs text-charcoal rounded-[2px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">Logo Subtitle row</label>
                        <input
                          type="text"
                          value={logoSub}
                          onChange={(e) => setLogoSub(e.target.value)}
                          className="w-full bg-ivory/35 border border-sand/50 px-3 py-2.5 text-xs text-charcoal rounded-[2px]"
                        />
                      </div>
                    </div>

                    {/* FOOTER SPECIFIC LOGO CONTROLS */}
                    <div className="border-t border-sand/15 pt-3 space-y-3">
                      <span className="text-[10px] font-mono font-bold tracking-wider text-clay uppercase block">Footer Specific Logo Configuration</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-sand/5 p-3 rounded-[2px] border border-sand/15">
                        <div>
                          <label className="block text-[9px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono">Footer Logo Mode</label>
                          <select
                            value={footerLogoMode}
                            onChange={(e) => setFooterLogoMode(e.target.value as any)}
                            className="w-full bg-white border border-sand/40 px-2 py-1.5 text-xs text-charcoal rounded-[2px]"
                          >
                            <option value="match-header">Same as Header Mode</option>
                            <option value="default-emblem">Default Baobab Emblem & Text</option>
                            <option value="custom-text">Pure Custom Typography (No Emblem)</option>
                            <option value="image-url">Custom Logo Image (Asset URL)</option>
                          </select>
                        </div>
                        {footerLogoMode === "image-url" ? (
                          <div className="space-y-1.5">
                            <label className="block text-[9px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono">Footer Custom Logo Image URL</label>
                            <div className="flex gap-2 items-start">
                              <div className="flex-1 space-y-1">
                                <input
                                  type="text"
                                  value={footerLogoImageUrl}
                                  onChange={(e) => setFooterLogoImageUrl(e.target.value)}
                                  placeholder="E.g. /images/footer-logo.png"
                                  className="w-full bg-white border border-sand/40 px-2 py-1 text-xs text-charcoal rounded-[2px]"
                                />
                                <FileInputButton onUploaded={setFooterLogoImageUrl} label="Upload Footer Logo" />
                              </div>
                              {footerLogoImageUrl && (
                                <div className="w-12 h-12 bg-white border border-sand/30 rounded-[2px] p-0.5 flex items-center justify-center shrink-0">
                                  <img src={footerLogoImageUrl} alt="Footer Logo Preview" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center text-[10px] text-charcoal/40 font-sans italic pt-4">
                            Footer logo matches the header mode.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* WALLPAPER & GRADIENT SECTION */}
                  <div className="bg-white border border-sand/30 p-5 rounded-[3px] space-y-4 shadow-sm">
                    <h4 className="font-mono text-xs uppercase tracking-wider text-clay font-bold border-b border-sand/15 pb-2">2. Homepage Wallpaper & Shape Backdrop</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">Hero Wallpaper Mode</label>
                        <select
                          value={heroWallpaperMode}
                          onChange={(e) => setHeroWallpaperMode(e.target.value as any)}
                          className="w-full bg-ivory/35 border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                        >
                          <option value="sunrise-tribal">Creative African Sunrise & Baobab Shape (Default)</option>
                          <option value="geometric-mesh">Geometric Tribal Mesh Grid Overlay</option>
                          <option value="minimalist-gradient">Pure Ambient Warm Dark Gradient</option>
                          <option value="custom-image">Custom Wallpaper Photo Background</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">Custom Wallpaper Image URL</label>
                        <div className="flex gap-4 items-start">
                          <div className="flex-1 space-y-1.5">
                            <input
                              type="text"
                              disabled={heroWallpaperMode !== "custom-image"}
                              value={heroWallpaperUrl}
                              onChange={(e) => setHeroWallpaperUrl(e.target.value)}
                              placeholder="Requires photo wallpaper background mode"
                              className="w-full bg-ivory/35 border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px] disabled:opacity-50"
                            />
                            {heroWallpaperMode === "custom-image" && (
                              <div className="flex items-center gap-2">
                                <FileInputButton onUploaded={setHeroWallpaperUrl} label="Upload Wallpaper" />
                                <span className="text-[10px] text-charcoal/50 font-sans">Or local file</span>
                              </div>
                            )}
                          </div>
                          {heroWallpaperUrl && (
                            <div className="w-20 h-14 bg-white border border-sand/30 rounded-[2px] overflow-hidden flex items-center justify-center shrink-0 shadow-xs relative">
                              <img src={heroWallpaperUrl} alt="Wallpaper Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">Hero Background Gradient Start</label>
                        <input
                          type="text"
                          value={heroGradientStart}
                          onChange={(e) => setHeroGradientStart(e.target.value)}
                          placeholder="E.g. #160e07"
                          className="w-full bg-ivory/35 border border-sand/50 px-3 py-2.5 text-xs text-charcoal rounded-[2px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">Hero Background Gradient End</label>
                        <input
                          type="text"
                          value={heroGradientEnd}
                          onChange={(e) => setHeroGradientEnd(e.target.value)}
                          placeholder="E.g. #141d30"
                          className="w-full bg-ivory/35 border border-sand/50 px-3 py-2.5 text-xs text-charcoal rounded-[2px]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* HERO HEADER TEXTS */}
                  <div className="bg-white border border-sand/30 p-5 rounded-[3px] space-y-4 shadow-sm">
                    <h4 className="font-mono text-xs uppercase tracking-wider text-clay font-bold border-b border-sand/15 pb-2">3. Hero Banner & Rotating Tick List</h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">Hero Main Title (HTML supported)</label>
                        <input
                          type="text"
                          value={heroTitle}
                          onChange={(e) => setHeroTitle(e.target.value)}
                          className="w-full bg-ivory/35 border border-sand/50 px-3 py-2.5 text-xs text-charcoal rounded-[2px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">Hero Secondary Tagline Slogan</label>
                        <textarea
                          rows={2}
                          value={heroSub}
                          onChange={(e) => setHeroSub(e.target.value)}
                          className="w-full bg-ivory/35 border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px] resize-none"
                        />
                      </div>

                      {/* Sizing & Position Layout customization */}
                      <div className="border-t border-sand/15 pt-3 space-y-3">
                        <span className="text-[10px] font-mono font-bold tracking-wider text-clay uppercase block">Typography Sizing & Position Layout</span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-sand/5 p-3 rounded-[2px] border border-sand/15">
                          <div>
                            <label className="block text-[9px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">Text Placement Alignment</label>
                            <select
                              value={heroTextAlignment}
                              onChange={(e) => setHeroTextAlignment(e.target.value as any)}
                              className="w-full bg-white border border-sand/40 px-2.5 py-1.5 text-xs text-charcoal rounded-[2px]"
                            >
                              <option value="left">Left Aligned (Default)</option>
                              <option value="center">Center Balanced</option>
                              <option value="right">Right Aligned</option>
                            </select>
                          </div>
                          <div>
                            <div className="flex justify-between items-center text-[9px] tracking-widest uppercase text-charcoal/60 font-mono font-medium mb-1">
                              <span>Headline Text Size</span>
                              <span className="font-mono text-clay font-bold">{heroTitleSize}px</span>
                            </div>
                            <input
                              type="range"
                              min="32"
                              max="120"
                              step="2"
                              value={heroTitleSize}
                              onChange={(e) => setHeroTitleSize(Number(e.target.value))}
                              className="w-full accent-clay cursor-pointer h-1.5 bg-sand/30 rounded"
                            />
                          </div>
                          <div>
                            <div className="flex justify-between items-center text-[9px] tracking-widest uppercase text-charcoal/60 font-mono font-medium mb-1">
                              <span>Tagline Text Size</span>
                              <span className="font-mono text-clay font-bold">{heroSubSize}px</span>
                            </div>
                            <input
                              type="range"
                              min="12"
                              max="32"
                              step="1"
                              value={heroSubSize}
                              onChange={(e) => setHeroSubSize(Number(e.target.value))}
                              className="w-full accent-clay cursor-pointer h-1.5 bg-sand/30 rounded"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">Hero Rotating Tickers (comma-separated)</label>
                        <input
                          type="text"
                          value={tickerInput}
                          onChange={(e) => setTickerInput(e.target.value)}
                          placeholder="E.g. Exhibitions, Ceramics, Storytelling"
                          className="w-full bg-ivory/35 border border-sand/50 px-3 py-2.5 text-xs text-charcoal rounded-[2px]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ABOUT / OUR STORY SECTION */}
                  <div className="bg-white border border-sand/30 p-5 rounded-[3px] space-y-4 shadow-sm">
                    <h4 className="font-mono text-xs uppercase tracking-wider text-clay font-bold border-b border-sand/15 pb-2">4. Our Story Segment Customization</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">Story Section Category Label</label>
                        <input
                          type="text"
                          value={aboutLabel}
                          onChange={(e) => setAboutLabel(e.target.value)}
                          className="w-full bg-ivory/35 border border-sand/50 px-3 py-2.5 text-xs text-charcoal rounded-[2px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">Story Action Button Headline</label>
                        <input
                          type="text"
                          value={aboutBtnText}
                          onChange={(e) => setAboutBtnText(e.target.value)}
                          className="w-full bg-ivory/35 border border-sand/50 px-3 py-2.5 text-xs text-charcoal rounded-[2px]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">Story Big Heading (HTML Supported)</label>
                      <input
                        type="text"
                        value={aboutHeading}
                        onChange={(e) => setAboutHeading(e.target.value)}
                        className="w-full bg-ivory/35 border border-sand/50 px-3 py-2.5 text-xs text-charcoal rounded-[2px]"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">Paragraph Description 1</label>
                        <textarea
                          rows={4}
                          value={aboutDesc1}
                          onChange={(e) => setAboutDesc1(e.target.value)}
                          className="w-full bg-ivory/35 border border-sand/50 p-3 text-xs text-charcoal rounded-[2px] resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">Paragraph Description 2</label>
                        <textarea
                          rows={4}
                          value={aboutDesc2}
                          onChange={(e) => setAboutDesc2(e.target.value)}
                          className="w-full bg-ivory/35 border border-sand/50 p-3 text-xs text-charcoal rounded-[2px] resize-none"
                        />
                      </div>
                    </div>

                    <div className="border-t border-sand/10 pt-3 mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">Featured Badge Indicator</label>
                        <input
                          type="text"
                          value={aboutFeaturedBadge}
                          onChange={(e) => setAboutFeaturedBadge(e.target.value)}
                          className="w-full bg-ivory/35 border border-sand/50 px-3 py-2.5 text-xs text-charcoal rounded-[2px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium font-bold text-clay">Featured Card Graphic Style</label>
                        <select
                          value={aboutFeaturedImageMode}
                          onChange={(e) => setAboutFeaturedImageMode(e.target.value as any)}
                          className="w-full bg-ivory/35 border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                        >
                          <option value="pattern">Authentic Baobab SVG Pattern Outline</option>
                          <option value="custom-image">Custom Uploaded Image preview URL</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">Featured Block Main Heading</label>
                        <input
                          type="text"
                          value={aboutFeaturedTitle}
                          onChange={(e) => setAboutFeaturedTitle(e.target.value)}
                          className="w-full bg-ivory/35 border border-sand/50 px-3 py-2.5 text-xs text-charcoal rounded-[2px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">Featured Graphic Portrait image URL</label>
                        <div className="flex gap-4 items-start">
                          <div className="flex-1 space-y-1.5">
                            <input
                              type="text"
                              disabled={aboutFeaturedImageMode !== "custom-image"}
                              value={aboutFeaturedImageUrl}
                              onChange={(e) => setAboutFeaturedImageUrl(e.target.value)}
                              placeholder="Requires Custom Uploaded Image mode"
                              className="w-full bg-ivory/35 border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px] disabled:opacity-50"
                            />
                            {aboutFeaturedImageMode === "custom-image" && (
                              <div className="flex items-center gap-2">
                                <FileInputButton onUploaded={setAboutFeaturedImageUrl} label="Upload Portrait" />
                              </div>
                            )}
                          </div>
                          {aboutFeaturedImageUrl && (
                            <div className="w-16 h-16 bg-white border border-sand/30 rounded-[2px] overflow-hidden flex items-center justify-center shrink-0 shadow-xs relative">
                              <img src={aboutFeaturedImageUrl} alt="Story Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">Featured Block Outline description</label>
                      <textarea
                        rows={2}
                        value={aboutFeaturedDesc}
                        onChange={(e) => setAboutFeaturedDesc(e.target.value)}
                        className="w-full bg-ivory/35 border border-sand/50 p-3 text-xs text-charcoal rounded-[2px] resize-none"
                      />
                    </div>
                  </div>

                  {/* INTERACTIVE PAGE SECTIONS CONTROLLER */}
                  <div className="bg-white border border-sand/30 p-5 rounded-[3px] space-y-6 shadow-sm">
                    <h4 className="font-mono text-xs uppercase tracking-wider text-clay font-bold border-b border-sand/15 pb-2">
                      5. Content blocks: Show/Hide, Customize Titles, & Choose Design
                    </h4>

                    <p className="text-[11px] text-charcoal/60 leading-relaxed font-sans">
                      Complete content management control for all major page sections. Decide if they are displayed, alter local section titles/labels, or change designs dynamically.
                    </p>

                    {/* STORY / ABOUT SECTION CONTROL */}
                    <div className="border border-sand/20 rounded-[2px] p-4 bg-sand/5 space-y-3">
                      <div className="flex items-center justify-between border-b border-sand/10 pb-2">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-charcoal">A. "Our Story" Block</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={showAbout}
                            onChange={(e) => setShowAbout(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-charcoal/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-moss"></div>
                          <span className="ml-2 text-[10px] font-mono font-medium">{showAbout ? "Visible" : "Hidden"}</span>
                        </label>
                      </div>
                      
                      {showAbout && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          <div>
                            <label className="block text-[9px] font-mono uppercase text-charcoal/50 mb-1">Stats Big Number Label</label>
                            <input
                              type="text"
                              value={aboutStatsNumber}
                              onChange={(e) => setAboutStatsNumber(e.target.value)}
                              placeholder="e.g. 6+"
                              className="w-full bg-white border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-mono uppercase text-charcoal/50 mb-1">Stats Caption text (use \n for line-breaks)</label>
                            <input
                              type="text"
                              value={aboutStatsLabel}
                              onChange={(e) => setAboutStatsLabel(e.target.value)}
                              placeholder="e.g. Immersive Zones"
                              className="w-full bg-white border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* HERITAGE MOTIFS / LIVING VISUAL LANGUAGE CONTROL */}
                    <div className="border border-sand/20 rounded-[2px] p-4 bg-sand/5 space-y-3">
                      <div className="flex items-center justify-between border-b border-sand/10 pb-2">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-charcoal">B. "Living Visual Language" (Heritage Motifs)</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={showHeritage}
                            onChange={(e) => setShowHeritage(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-charcoal/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-moss"></div>
                          <span className="ml-2 text-[10px] font-mono font-medium">{showHeritage ? "Visible" : "Hidden"}</span>
                        </label>
                      </div>

                      {showHeritage && (
                        <div className="space-y-3 pt-1">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[9px] font-mono uppercase text-charcoal/50 mb-1">Section Tag Label</label>
                              <input
                                type="text"
                                value={heritageLabel}
                                onChange={(e) => setHeritageLabel(e.target.value)}
                                className="w-full bg-white border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono font-medium text-clay/90 uppercase mb-1">Active Design Style Layout</label>
                              <select
                                value={heritageDesign}
                                onChange={(e) => setHeritageDesign(e.target.value as any)}
                                className="w-full bg-white border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                              >
                                <option value="default">Default (Artistic high contrast pattern sand)</option>
                                <option value="dark">Cosmic Dark (Deep charcoal backdrop style)</option>
                                <option value="warm">Spicy Terracotta (Vibrant earthy terracotta colorway)</option>
                                <option value="minimal">Minimal Sleek (Sparsely decorated monochrome plain space)</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="block text-[9px] font-mono uppercase text-charcoal/50 mb-1">Section Big Title (HTML Supported)</label>
                            <input
                              type="text"
                              value={heritageTitle}
                              onChange={(e) => setHeritageTitle(e.target.value)}
                              className="w-full bg-white border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-mono uppercase text-charcoal/50 mb-1">Section Description / Subtitle</label>
                            <textarea
                              rows={2}
                              value={heritageSubTitle}
                              onChange={(e) => setHeritageSubTitle(e.target.value)}
                              className="w-full bg-white border border-sand/50 p-2 text-xs text-charcoal rounded-[2px] resize-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* EXPERIENCES / WHAT WE OFFER CONTROL */}
                    <div className="border border-sand/20 rounded-[2px] p-4 bg-sand/5 space-y-3">
                      <div className="flex items-center justify-between border-b border-sand/10 pb-2">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-charcoal">C. "What We Offer" (Experiences)</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={showExperiences}
                            onChange={(e) => setShowExperiences(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-charcoal/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-moss"></div>
                          <span className="ml-2 text-[10px] font-mono font-medium">{showExperiences ? "Visible" : "Hidden"}</span>
                        </label>
                      </div>

                      {showExperiences && (
                        <div className="space-y-3 pt-1">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[9px] font-mono uppercase text-charcoal/50 mb-1">Section Tag Label</label>
                              <input
                                type="text"
                                value={experiencesLabel}
                                onChange={(e) => setExperiencesLabel(e.target.value)}
                                className="w-full bg-white border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono uppercase text-charcoal/50 mb-1">Section Big Title (HTML Supported)</label>
                              <input
                                type="text"
                                value={experiencesTitle}
                                onChange={(e) => setExperiencesTitle(e.target.value)}
                                className="w-full bg-white border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[9px] font-mono uppercase text-charcoal/50 mb-1">Section Description / Subtitle</label>
                            <textarea
                              rows={2}
                              value={experiencesSubTitle}
                              onChange={(e) => setExperiencesSubTitle(e.target.value)}
                              placeholder="Optional descriptive intro under the main header"
                              className="w-full bg-white border border-sand/50 p-2 text-xs text-charcoal rounded-[2px] resize-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* EXHIBITIONS CONTROL */}
                    <div className="border border-sand/20 rounded-[2px] p-4 bg-sand/5 space-y-3">
                      <div className="flex items-center justify-between border-b border-sand/10 pb-2">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-charcoal">D. "Exhibitions" Section</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={showExhibitions}
                            onChange={(e) => setShowExhibitions(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-charcoal/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-moss"></div>
                          <span className="ml-2 text-[10px] font-mono font-medium">{showExhibitions ? "Visible" : "Hidden"}</span>
                        </label>
                      </div>

                      {showExhibitions && (
                        <div className="space-y-3 pt-1">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[9px] font-mono uppercase text-charcoal/50 mb-1">Section Tag Label</label>
                              <input
                                type="text"
                                value={exhibitionsLabel}
                                onChange={(e) => setExhibitionsLabel(e.target.value)}
                                className="w-full bg-white border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono uppercase text-charcoal/50 mb-1">Section Big Title (HTML Supported)</label>
                              <input
                                type="text"
                                value={exhibitionsTitle}
                                onChange={(e) => setExhibitionsTitle(e.target.value)}
                                className="w-full bg-white border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[9px] font-mono uppercase text-charcoal/50 mb-1">Section Description / Subtitle</label>
                            <textarea
                              rows={2}
                              value={exhibitionsSubTitle}
                              onChange={(e) => setExhibitionsSubTitle(e.target.value)}
                              className="w-full bg-white border border-sand/50 p-2 text-xs text-charcoal rounded-[2px] resize-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* SCHOOLS CONTROL */}
                    <div className="border border-sand/20 rounded-[2px] p-4 bg-sand/5 space-y-3">
                      <div className="flex items-center justify-between border-b border-sand/10 pb-2">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-charcoal">E. "Designed for Curious Minds" (Schools & Organizations)</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={showSchools}
                            onChange={(e) => setShowSchools(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-charcoal/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-moss"></div>
                          <span className="ml-2 text-[10px] font-mono font-medium">{showSchools ? "Visible" : "Hidden"}</span>
                        </label>
                      </div>

                      {showSchools && (
                        <div className="space-y-3 pt-1">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[9px] font-mono uppercase text-charcoal/50 mb-1">Section Tag Label</label>
                              <input
                                type="text"
                                value={schoolsLabel}
                                onChange={(e) => setSchoolsLabel(e.target.value)}
                                className="w-full bg-white border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono uppercase text-charcoal/50 mb-1">Section Big Title (HTML Supported)</label>
                              <input
                                type="text"
                                value={schoolsTitle}
                                onChange={(e) => setSchoolsTitle(e.target.value)}
                                className="w-full bg-white border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[9px] font-mono uppercase text-charcoal/50 mb-1">Section Description / Subtitle</label>
                            <textarea
                              rows={2}
                              value={schoolsSubTitle}
                              onChange={(e) => setSchoolsSubTitle(e.target.value)}
                              className="w-full bg-white border border-sand/50 p-2 text-xs text-charcoal rounded-[2px] resize-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* EVENTS CONTROL */}
                    <div className="border border-sand/20 rounded-[2px] p-4 bg-sand/5 space-y-3">
                      <div className="flex items-center justify-between border-b border-sand/10 pb-2">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-charcoal">F. "What's On" (Events Calendar Hub)</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={showEvents}
                            onChange={(e) => setShowEvents(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-charcoal/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-moss"></div>
                          <span className="ml-2 text-[10px] font-mono font-medium">{showEvents ? "Visible" : "Hidden"}</span>
                        </label>
                      </div>

                      {showEvents && (
                        <div className="space-y-3 pt-1">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[9px] font-mono uppercase text-charcoal/50 mb-1">Section Tag Label</label>
                              <input
                                type="text"
                                value={eventsLabel}
                                onChange={(e) => setEventsLabel(e.target.value)}
                                className="w-full bg-white border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono uppercase text-charcoal/50 mb-1">Section Big Title (HTML Supported)</label>
                              <input
                                type="text"
                                value={eventsTitle}
                                onChange={(e) => setEventsTitle(e.target.value)}
                                className="w-full bg-white border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[9px] font-mono uppercase text-charcoal/50 mb-1">Section Description / Subtitle</label>
                            <textarea
                              rows={2}
                              value={eventsSubTitle}
                              onChange={(e) => setEventsSubTitle(e.target.value)}
                              placeholder="Optional descriptive intro under the main header"
                              className="w-full bg-white border border-sand/50 p-2 text-xs text-charcoal rounded-[2px] resize-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CENTRAL PALETTE & INTERACTION DESK */}
                  <div className="bg-white border border-sand/30 p-5 rounded-[3px] space-y-4 shadow-sm">
                    <h4 className="font-mono text-xs uppercase tracking-wider text-clay font-bold border-b border-sand/15 pb-2">3. Design Color Palette & Custom Typography</h4>
                    
                    <p className="text-[11px] text-charcoal/60 leading-relaxed font-sans mb-2">
                       Define the dynamic global style system of your site. Modify colors using hex values or the color pickers, and embed custom Google Fonts directly.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      <div className="bg-sand/10 p-2 border border-sand/20 rounded-[2px] flex flex-col items-center col-span-1">
                        <label className="block text-[9px] tracking-wider uppercase text-charcoal/60 mb-1 font-mono font-bold text-center">Clay Accent</label>
                        <input
                          type="color"
                          value={themeColorClay}
                          onChange={(e) => setThemeColorClay(e.target.value)}
                          className="w-10 h-8 rounded cursor-pointer border-0 bg-transparent"
                        />
                        <input
                          type="text"
                          value={themeColorClay}
                          onChange={(e) => setThemeColorClay(e.target.value)}
                          className="w-full text-center text-[10px] font-mono mt-1 px-1 bg-white border border-sand/30 rounded"
                        />
                      </div>
                      <div className="bg-sand/10 p-2 border border-sand/20 rounded-[2px] flex flex-col items-center col-span-1">
                        <label className="block text-[9px] tracking-wider uppercase text-charcoal/60 mb-1 font-mono font-bold text-center">Moss Deep</label>
                        <input
                          type="color"
                          value={themeColorMoss}
                          onChange={(e) => setThemeColorMoss(e.target.value)}
                          className="w-10 h-8 rounded cursor-pointer border-0 bg-transparent"
                        />
                        <input
                          type="text"
                          value={themeColorMoss}
                          onChange={(e) => setThemeColorMoss(e.target.value)}
                          className="w-full text-center text-[10px] font-mono mt-1 px-1 bg-white border border-sand/30 rounded"
                        />
                      </div>
                      <div className="bg-sand/10 p-2 border border-sand/20 rounded-[2px] flex flex-col items-center col-span-1">
                        <label className="block text-[9px] tracking-wider uppercase text-charcoal/60 mb-1 font-mono font-bold text-center">Indigo Midnight</label>
                        <input
                          type="color"
                          value={themeColorIndigo}
                          onChange={(e) => setThemeColorIndigo(e.target.value)}
                          className="w-10 h-8 rounded cursor-pointer border-0 bg-transparent"
                        />
                        <input
                          type="text"
                          value={themeColorIndigo}
                          onChange={(e) => setThemeColorIndigo(e.target.value)}
                          className="w-full text-center text-[10px] font-mono mt-1 px-1 bg-white border border-sand/30 rounded"
                        />
                      </div>
                      <div className="bg-sand/10 p-2 border border-sand/20 rounded-[2px] flex flex-col items-center col-span-1">
                        <label className="block text-[9px] tracking-wider uppercase text-charcoal/60 mb-1 font-mono font-bold text-center">Charcoal Noir</label>
                        <input
                          type="color"
                          value={themeColorCharcoal}
                          onChange={(e) => setThemeColorCharcoal(e.target.value)}
                          className="w-10 h-8 rounded cursor-pointer border-0 bg-transparent"
                        />
                        <input
                          type="text"
                          value={themeColorCharcoal}
                          onChange={(e) => setThemeColorCharcoal(e.target.value)}
                          className="w-full text-center text-[10px] font-mono mt-1 px-1 bg-white border border-sand/30 rounded"
                        />
                      </div>
                      <div className="bg-sand/10 p-2 border border-sand/20 rounded-[2px] flex flex-col items-center col-span-1">
                        <label className="block text-[9px] tracking-wider uppercase text-charcoal/60 mb-1 font-mono font-bold text-center">Ivory White</label>
                        <input
                          type="color"
                          value={themeColorIvory}
                          onChange={(e) => setThemeColorIvory(e.target.value)}
                          className="w-10 h-8 rounded cursor-pointer border-0 bg-transparent"
                        />
                        <input
                          type="text"
                          value={themeColorIvory}
                          onChange={(e) => setThemeColorIvory(e.target.value)}
                          className="w-full text-center text-[10px] font-mono mt-1 px-1 bg-white border border-sand/30 rounded"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-sand/10 pt-3 mt-2">
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">Headings Font Family Name</label>
                        <input
                          type="text"
                          value={themeFontFamilyHeadings}
                          onChange={(e) => setThemeFontFamilyHeadings(e.target.value)}
                          placeholder="E.g. Space Grotesk"
                          className="w-full bg-ivory/35 border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">Body Font Family Name</label>
                        <input
                          type="text"
                          value={themeFontFamilyBody}
                          onChange={(e) => setThemeFontFamilyBody(e.target.value)}
                          placeholder="E.g. Inter"
                          className="w-full bg-ivory/35 border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium font-bold text-clay">Google Font Embed Import URL</label>
                        <input
                          type="text"
                          value={themeFontImportUrl}
                          onChange={(e) => setThemeFontImportUrl(e.target.value)}
                          placeholder="E.g. https://fonts.googleapis.com/css2?family=Space+Grotesk..."
                          className="w-full bg-ivory/35 border border-sand/50 px-3 py-2.5 text-xs text-charcoal rounded-[2px]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* LOGO SIZING RANGE SLIDERS */}
                  <div className="bg-white border border-sand/30 p-5 rounded-[3px] space-y-4 shadow-sm">
                    <h4 className="font-mono text-xs uppercase tracking-wider text-clay font-bold border-b border-sand/15 pb-2">4. Logo Size & Sizing Controls</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="bg-sand/10 p-3 rounded-[2px] space-y-2 border border-sand/20">
                        <div className="flex justify-between items-center text-[10px] tracking-widest uppercase text-charcoal/60 font-mono font-medium">
                          <span>Navbar Header Logo Size</span>
                          <span className="font-mono text-clay font-bold">{navbarLogoSize}%</span>
                        </div>
                        <input
                          type="range"
                          min="45"
                          max="250"
                          step="5"
                          value={navbarLogoSize}
                          onChange={(e) => setNavbarLogoSize(Number(e.target.value))}
                          className="w-full accent-clay cursor-pointer h-1.5 bg-sand/30 rounded"
                        />
                        <span className="block text-[9px] text-[#888] leading-none">Slider adjusts the header navbar brand logo scale</span>
                      </div>
                      <div className="bg-sand/10 p-3 rounded-[2px] space-y-2 border border-sand/20">
                        <div className="flex justify-between items-center text-[10px] tracking-widest uppercase text-charcoal/60 font-mono font-medium">
                          <span>Footer Logo Size</span>
                          <span className="font-mono text-clay font-bold">{footerLogoSize}%</span>
                        </div>
                        <input
                          type="range"
                          min="45"
                          max="250"
                          step="5"
                          value={footerLogoSize}
                          onChange={(e) => setFooterLogoSize(Number(e.target.value))}
                          className="w-full accent-clay cursor-pointer h-1.5 bg-sand/30 rounded"
                        />
                        <span className="block text-[9px] text-[#888] leading-none">Slider adjusts the footer brand logo scale</span>
                      </div>
                    </div>
                  </div>

                  {/* ACTION HERO HERO BUTTONS */}
                  <div className="bg-white border border-sand/30 p-5 rounded-[3px] space-y-4 shadow-sm">
                    <h4 className="font-mono text-xs uppercase tracking-wider text-clay font-bold border-b border-sand/15 pb-2">5. Landing Hero Action Buttons</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-sand/10 p-3 rounded-[2px] space-y-3">
                        <span className="text-[10px] font-mono font-bold tracking-wider text-clay uppercase block">Primary Action Button (Button 1)</span>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[9px] tracking-widest uppercase text-charcoal/50 mb-1 font-mono">Btn Text</label>
                            <input
                              type="text"
                              value={heroBtn1Text}
                              onChange={(e) => setHeroBtn1Text(e.target.value)}
                              className="w-full bg-white border border-sand/40 p-2 text-xs text-charcoal"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] tracking-widest uppercase text-charcoal/50 mb-1 font-mono">Btn Link/Anchor</label>
                            <input
                              type="text"
                              value={heroBtn1Link}
                              onChange={(e) => setHeroBtn1Link(e.target.value)}
                              className="w-full bg-white border border-sand/40 p-2 text-xs text-charcoal"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="bg-sand/10 p-3 rounded-[2px] space-y-3">
                        <span className="text-[10px] font-mono font-bold tracking-wider text-clay uppercase block">Secondary Action Button (Button 2)</span>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[9px] tracking-widest uppercase text-charcoal/50 mb-1 font-mono">Btn Text</label>
                            <input
                              type="text"
                              value={heroBtn2Text}
                              onChange={(e) => setHeroBtn2Text(e.target.value)}
                              className="w-full bg-white border border-sand/40 p-2 text-xs text-charcoal"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] tracking-widest uppercase text-charcoal/50 mb-1 font-mono">Btn Link/Anchor</label>
                            <input
                              type="text"
                              value={heroBtn2Link}
                              onChange={(e) => setHeroBtn2Link(e.target.value)}
                              className="w-full bg-white border border-sand/40 p-2 text-xs text-charcoal"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SOCIAL CONNECTIONS AND EMAIL TARGET */}
                  <div className="bg-white border border-sand/30 p-5 rounded-[3px] space-y-4 shadow-sm">
                    <h4 className="font-mono text-xs uppercase tracking-wider text-clay font-bold border-b border-sand/15 pb-2">6. Contacts, Booking recipient Email & Social Accounts</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3 flex flex-col justify-between">
                        <h5 className="text-[10px] font-mono font-bold uppercase tracking-wider text-clay border-b border-sand/10 pb-1">General Contact Info</h5>
                        <div>
                          <label className="block text-[9px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">Inquiries Forwarding Recipient Email</label>
                          <input
                            type="text"
                            value={inquiryRecipientEmail}
                            onChange={(e) => setInquiryRecipientEmail(e.target.value)}
                            placeholder="Email address where website inquiries are forwarded to"
                            className="w-full bg-ivory/35 border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">Site Public Support Email</label>
                          <input
                            type="text"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            className="w-full bg-ivory/35 border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">Contact Phone Line</label>
                          <input
                            type="text"
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                            className="w-full bg-ivory/35 border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">Address Place Description</label>
                          <input
                            type="text"
                            value={contactAddress}
                            onChange={(e) => setContactAddress(e.target.value)}
                            className="w-full bg-ivory/35 border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">Operational Opening Hours</label>
                          <input
                            type="text"
                            value={contactHours}
                            onChange={(e) => setContactHours(e.target.value)}
                            className="w-full bg-ivory/35 border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                          />
                        </div>
                      </div>

                      <div className="space-y-3 border-t md:border-t-0 md:border-l border-sand/15 pt-3 md:pt-0 md:pl-4">
                        <h5 className="text-[10px] font-mono font-bold uppercase tracking-wider text-clay border-b border-sand/10 pb-1">Social Media Accounts Links</h5>
                        <div>
                          <label className="block text-[9px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">Instagram Account URL</label>
                          <input
                            type="text"
                            value={socialInstagram}
                            onChange={(e) => setSocialInstagram(e.target.value)}
                            placeholder="E.g. https://instagram.com/afrobaobab"
                            className="w-full bg-ivory/35 border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">Facebook Public URL</label>
                          <input
                            type="text"
                            value={socialFacebook}
                            onChange={(e) => setSocialFacebook(e.target.value)}
                            className="w-full bg-ivory/35 border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">Twitter / X Page Link</label>
                          <input
                            type="text"
                            value={socialTwitter}
                            onChange={(e) => setSocialTwitter(e.target.value)}
                            className="w-full bg-ivory/35 border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">TikTok Channel Link</label>
                          <input
                            type="text"
                            value={socialTiktok}
                            onChange={(e) => setSocialTiktok(e.target.value)}
                            className="w-full bg-ivory/35 border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">YouTube Channel URL</label>
                          <input
                            type="text"
                            value={socialYoutube}
                            onChange={(e) => setSocialYoutube(e.target.value)}
                            className="w-full bg-ivory/35 border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* FOOTER VALUES */}
                  <div className="bg-white border border-sand/30 p-5 rounded-[3px] space-y-4 shadow-sm">
                    <h4 className="font-mono text-xs uppercase tracking-wider text-clay font-bold border-b border-sand/15 pb-2">7. Footer Identity & slogan lines</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">Footer Brief Branding paragraph</label>
                        <input
                          type="text"
                          value={footerDesc}
                          onChange={(e) => setFooterDesc(e.target.value)}
                          className="w-full bg-ivory/35 border border-sand/50 px-3 py-2.5 text-xs text-charcoal rounded-[2px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">Footer Artistic slogan proverb</label>
                        <input
                          type="text"
                          value={footerTagline}
                          onChange={(e) => setFooterTagline(e.target.value)}
                          className="w-full bg-ivory/35 border border-sand/50 px-3 py-2.5 text-xs text-charcoal rounded-[2px]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleSaveHeader}
                      className="bg-clay hover:bg-terracotta text-white font-mono uppercase tracking-widest text-xs px-10 py-4 rounded-[2px] transition-colors cursor-pointer shadow-lg font-bold hover:translate-y-[-1px]"
                    >
                      Save Configuration Settings
                    </button>
                  </div>
                </div>
              )}

              {/* experiences */}
              {activeTab === "experiences" && (
                <div className="space-y-6">
                  {/* form */}
                  <form onSubmit={handleSaveExperience} className="bg-white border border-sand/40 p-4 rounded-[2px] space-y-4">
                    <h4 className="font-serif text-lg font-medium text-charcoal">
                      {editingItemId ? "Edit Experience Zone" : "+ Add Experience Zone"}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">
                          Serial Display Code (E.g. 01)
                        </label>
                        <input
                          type="text"
                          required
                          value={expNum}
                          onChange={(e) => setExpNum(e.target.value)}
                          placeholder="E.g. 07"
                          className="w-full bg-ivory/30 border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">
                          Title
                        </label>
                        <input
                          type="text"
                          required
                          value={expTitle}
                          onChange={(e) => setExpTitle(e.target.value)}
                          placeholder="Zone Title name"
                          className="w-full bg-ivory/30 border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">
                        Brief description
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={expDesc}
                        onChange={(e) => setExpDesc(e.target.value)}
                        placeholder="Say what visitors can learn or experience here..."
                        className="w-full bg-ivory/30 border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">
                        Experience Card Image URL (Optional)
                      </label>
                      <div className="flex gap-4 items-start">
                        <div className="flex-1 space-y-1.5">
                          <input
                            type="text"
                            value={expImageUrl}
                            onChange={(e) => setExpImageUrl(e.target.value)}
                            placeholder="E.g. https://images.unsplash.com/photo-... or relative image URL"
                            className="w-full bg-ivory/30 border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                          />
                          <div className="mt-1">
                            <FileInputButton onUploaded={setExpImageUrl} label="Upload Experience Image from Computer" />
                          </div>
                        </div>
                        {expImageUrl && (
                          <div className="w-16 h-16 bg-white border border-sand/30 rounded-[2px] overflow-hidden flex items-center justify-center shrink-0 shadow-xs relative">
                            <img src={expImageUrl} alt="Experience Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-clay hover:bg-terracotta text-white font-mono uppercase text-xs tracking-widest px-4 py-2 rounded-[2px] transition-colors cursor-pointer"
                      >
                        {editingItemId ? "Update Zone" : "Add Experience Zone"}
                      </button>
                      {editingItemId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingItemId(null);
                            setExpTitle("");
                            setExpDesc("");
                            setExpNum("");
                            setExpImageUrl("");
                          }}
                          className="bg-[#eee] hover:bg-[#ddd] text-[#333] font-mono uppercase text-xs tracking-widest px-4 py-2 rounded-[2px]"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>

                  {/* List */}
                  <div className="space-y-2">
                    <h4 className="font-serif text-lg text-charcoal font-medium">Current Experience Cards ({data?.experiences.length})</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {data?.experiences.map((exp) => (
                        <div key={exp.id} className="p-4 bg-white border border-sand/30 rounded-[2px] flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-1.5 border-b border-sand/10 pb-1.5">
                              <span className="font-serif text-clay text-sm font-medium">{exp.number}</span>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setEditingItemId(exp.id);
                                    setExpTitle(exp.title);
                                    setExpDesc(exp.description);
                                    setExpNum(exp.number);
                                    setExpImageUrl(exp.imageUrl || "");
                                  }}
                                  className="text-charcoal/40 hover:text-clay transition-colors cursor-pointer"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteExperience(exp.id)}
                                  className="text-charcoal/40 hover:text-red-500 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            <h5 className="font-serif text-charcoal font-medium text-base mb-1">{exp.title}</h5>
                            <p className="text-charcoal/60 text-xs leading-relaxed font-sans">{exp.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* exhibitions */}
              {activeTab === "exhibitions" && (
                <div className="space-y-6">
                  {/* form */}
                  <form onSubmit={handleSaveExhibition} className="bg-white border border-sand/40 p-4 rounded-[2px] space-y-4">
                    <h4 className="font-serif text-lg font-medium text-charcoal">
                      {editingItemId ? "Edit Exhibition" : "+ Add New Exhibition"}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">
                          Badge Code (E.g. I, II, III)
                        </label>
                        <input
                          type="text"
                          required
                          value={exhBadge}
                          onChange={(e) => setExhBadge(e.target.value)}
                          placeholder="E.g. IV"
                          className="w-full bg-ivory/30 border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">
                          Exhibition Headline
                        </label>
                        <input
                          type="text"
                          required
                          value={exhTitle}
                          onChange={(e) => setExhTitle(e.target.value)}
                          placeholder="Title name"
                          className="w-full bg-ivory/30 border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">
                          Media/Type Categories
                        </label>
                        <input
                          type="text"
                          required
                          value={exhType}
                          onChange={(e) => setExhType(e.target.value)}
                          placeholder="E.g. Textile · Ceramics"
                          className="w-full bg-ivory/30 border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">
                          Time Slot Status / Tag
                        </label>
                        <input
                          type="text"
                          required
                          value={exhStatus}
                          onChange={(e) => setExhStatus(e.target.value)}
                          placeholder="E.g. Now, Soon, Jun 2025"
                          className="w-full bg-ivory/30 border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isNowChk"
                        checked={exhIsNow}
                        onChange={(e) => setExhIsNow(e.target.checked)}
                        className="accent-clay"
                      />
                      <label htmlFor="isNowChk" className="text-xs text-charcoal font-sans font-medium">
                        Active exhibition (Displays active tag style)
                      </label>
                    </div>

                    <div>
                      <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">
                        Exhibition Preview Image URL (Optional)
                      </label>
                      <div className="flex gap-4 items-start">
                        <div className="flex-1 space-y-1.5">
                          <input
                            type="text"
                            value={exhImageUrl}
                            onChange={(e) => setExhImageUrl(e.target.value)}
                            placeholder="E.g. https://images.unsplash.com/photo-... or relative image URL"
                            className="w-full bg-ivory/30 border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                          />
                          <div className="mt-1">
                            <FileInputButton onUploaded={setExhImageUrl} label="Upload Exhibition Image from Computer" />
                          </div>
                        </div>
                        {exhImageUrl && (
                          <div className="w-16 h-16 bg-white border border-sand/30 rounded-[2px] overflow-hidden flex items-center justify-center shrink-0 shadow-xs relative">
                            <img src={exhImageUrl} alt="Exhibition Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-clay hover:bg-terracotta text-white font-mono uppercase text-xs tracking-widest px-4 py-2 rounded-[2px] transition-colors cursor-pointer"
                      >
                        {editingItemId ? "Update Entry" : "Create Entry"}
                      </button>
                      {editingItemId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingItemId(null);
                            setExhBadge("");
                            setExhTitle("");
                            setExhType("");
                            setExhStatus("");
                            setExhIsNow(false);
                            setExhImageUrl("");
                          }}
                          className="bg-[#eee] hover:bg-[#ddd] text-[#333] font-mono uppercase text-xs tracking-widest px-4 py-2 rounded-[2px]"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>

                  {/* List */}
                  <div className="space-y-2">
                    <h4 className="font-serif text-lg text-charcoal font-medium">Active Exhibitions ({data?.exhibitions.length})</h4>
                    <div className="bg-white border border-sand/30 rounded-[2px] divide-y divide-sand/10">
                      {data?.exhibitions.map((exh) => (
                        <div key={exh.id} className="p-4 flex items-center justify-between gap-4 hover:bg-ivory/10 transition-colors">
                          <div className="flex items-center gap-4">
                            <span className="w-8 h-8 rounded-full bg-clay text-white font-serif flex items-center justify-center text-xs font-medium">
                              {exh.badge}
                            </span>
                            <div>
                              <p className="font-serif text-charcoal text-sm font-medium">{exh.title}</p>
                              <p className="text-[11px] text-charcoal/40 font-mono mt-0.5">{exh.type}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-2.5 py-0.5 rounded-[2px] text-[10px] font-mono uppercase ${
                              exh.isNow ? "bg-clay text-white" : "bg-moss/10 text-moss"
                            }`}>
                              {exh.status}
                            </span>
                            <button
                              onClick={() => {
                                setEditingItemId(exh.id);
                                setExhBadge(exh.badge);
                                setExhTitle(exh.title);
                                setExhType(exh.type);
                                setExhStatus(exh.status);
                                setExhIsNow(exh.isNow);
                                setExhImageUrl(exh.imageUrl || "");
                              }}
                              className="text-charcoal/40 hover:text-clay transition-colors cursor-pointer"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteExhibition(exh.id)}
                              className="text-charcoal/40 hover:text-red-500 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* events */}
              {activeTab === "events" && (
                <div className="space-y-6">
                  {/* form */}
                  <form onSubmit={handleSaveEvent} className="bg-white border border-sand/40 p-4 rounded-[2px] space-y-4">
                    <h4 className="font-serif text-lg font-medium text-charcoal">
                      {editingItemId ? "Edit Event" : "+ Add Planned Event"}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">
                          Date Num (E.g. 24)
                        </label>
                        <input
                          type="text"
                          required
                          value={evDay}
                          onChange={(e) => setEvDay(e.target.value)}
                          placeholder="E.g. 24"
                          className="w-full bg-ivory/30 border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">
                          Month Tag (E.g. May)
                        </label>
                        <input
                          type="text"
                          required
                          value={evMonth}
                          onChange={(e) => setEvMonth(e.target.value)}
                          placeholder="E.g. May"
                          className="w-full bg-ivory/30 border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">
                          Event Category
                        </label>
                        <input
                          type="text"
                          required
                          value={evCat}
                          onChange={(e) => setEvCat(e.target.value)}
                          placeholder="E.g. Spoken Word, Talk, Concert"
                          className="w-full bg-ivory/30 border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">
                          Event Headline Title
                        </label>
                        <input
                          type="text"
                          required
                          value={evTitle}
                          onChange={(e) => setEvTitle(e.target.value)}
                          placeholder="Headline name"
                          className="w-full bg-ivory/30 border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">
                          Event Theme Gradient
                        </label>
                        <select
                          value={evTheme}
                          onChange={(e) => setEvTheme(e.target.value as any)}
                          className="w-full bg-ivory/30 border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px] h-[34px]"
                        >
                          <option value="clay">Clay (Terracotta Warm)</option>
                          <option value="moss">Moss (Organic Sage)</option>
                          <option value="indigo">Indigo (Heritage Deep)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">
                          Time Schedule
                        </label>
                        <input
                          type="text"
                          required
                          value={evTime}
                          onChange={(e) => setEvTime(e.target.value)}
                          placeholder="E.g. 7:00 PM"
                          className="w-full bg-ivory/30 border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">
                          Target Audience
                        </label>
                        <input
                          type="text"
                          required
                          value={evAudience}
                          onChange={(e) => setEvAudience(e.target.value)}
                          placeholder="E.g. Families, Adults, Kids"
                          className="w-full bg-ivory/30 border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">
                        Event Core Image Cover URL (Optional)
                      </label>
                      <div className="flex gap-4 items-start">
                        <div className="flex-1 space-y-1.5">
                          <input
                            type="text"
                            value={evImageUrl}
                            onChange={(e) => setEvImageUrl(e.target.value)}
                            placeholder="E.g. https://images.unsplash.com/... (Overrides gradient card background)"
                            className="w-full bg-ivory/30 border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                          />
                          <div className="mt-1">
                            <FileInputButton onUploaded={setEvImageUrl} label="Upload Event Image from Computer" />
                          </div>
                        </div>
                        {evImageUrl && (
                          <div className="w-16 h-16 bg-white border border-sand/30 rounded-[2px] overflow-hidden flex items-center justify-center shrink-0 shadow-xs relative">
                            <img src={evImageUrl} alt="Event Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 font-mono">
                      <button
                        type="submit"
                        className="bg-clay hover:bg-terracotta text-white uppercase text-xs tracking-widest px-4 py-2 rounded-[2px] transition-colors cursor-pointer"
                      >
                        {editingItemId ? "Save Event" : "Create Event"}
                      </button>
                      {editingItemId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingItemId(null);
                            setEvDay("");
                            setEvMonth("");
                            setEvTitle("");
                            setEvCat("");
                            setEvTime("");
                            setEvAudience("");
                            setEvTheme("clay");
                            setEvImageUrl("");
                          }}
                          className="bg-[#eee] hover:bg-[#ddd] text-[#333] uppercase text-xs tracking-widest px-4 py-2 rounded-[2px]"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>

                  {/* List */}
                  <div className="space-y-3">
                    <h4 className="font-serif text-lg text-charcoal font-medium">Listed Events ({data?.events.length})</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {data?.events.map((ev) => (
                        <div key={ev.id} className="bg-white border border-sand/20 rounded-[2px] overflow-hidden flex flex-col justify-between shadow-sm">
                          {/* Top background theme */}
                          <div className={`h-24 p-3 relative flex justify-end items-start ${
                            ev.theme === 'clay' ? 'bg-gradient-to-br from-clay to-terracotta' :
                            ev.theme === 'moss' ? 'bg-gradient-to-br from-moss to-[#202c1c]' :
                            'bg-gradient-to-br from-indigo to-[#0d1622]'
                          }`}>
                            {/* Date Badge */}
                            <div className="bg-black/30 backdrop-blur-sm text-white px-2 py-1 text-center rounded-[2px] min-w-[40px]">
                              <span className="font-serif text-sm font-semibold block leading-tight">{ev.day}</span>
                              <span className="text-[9px] tracking-wider uppercase opacity-80 block">{ev.month}</span>
                            </div>

                            <div className="absolute left-3 bottom-2 flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingItemId(ev.id);
                                  setEvDay(ev.day);
                                  setEvMonth(ev.month);
                                  setEvTitle(ev.title);
                                  setEvCat(ev.category);
                                  setEvTime(ev.time);
                                  setEvAudience(ev.audience);
                                  setEvTheme(ev.theme);
                                  setEvImageUrl(ev.imageUrl || "");
                                }}
                                className="text-white bg-black/40 hover:bg-black/60 p-1.5 rounded-full transition-colors cursor-pointer"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteEvent(ev.id)}
                                className="text-white bg-black/40 hover:bg-black/60 p-1.5 rounded-full transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Body details */}
                          <div className="p-3.5 space-y-1">
                            <span className="text-[9px] font-mono tracking-widest text-clay uppercase block font-semibold">{ev.category}</span>
                            <h5 className="font-serif text-charcoal font-medium text-sm leading-tight line-clamp-1">{ev.title}</h5>
                            <div className="text-[10px] text-charcoal/50 flex gap-2 font-mono">
                              <span>{ev.time}</span>
                              <span>·</span>
                              <span>{ev.audience}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* bookings */}
              {activeTab === "bookings" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-2xl text-charcoal">Inquiries &amp; Booking Desk</h3>
                    <p className="text-xs text-[#777] mt-1 font-sans">
                      Track and manage incoming visitor bookings, corporate proposals, and educators scheduling requests.
                    </p>
                  </div>

                  <div className="space-y-3.5">
                    {data?.bookings && data.bookings.length === 0 ? (
                      <div className="text-center py-10 bg-white border border-sand/20 rounded-[2px]">
                        <p className="text-sm text-charcoal/40 font-serif">Inbox is currently empty.</p>
                      </div>
                    ) : (
                      data?.bookings.slice().reverse().map((bk) => (
                        <div key={bk.id} className={`p-5 bg-white border rounded-[3px] space-y-3 shadow-sm transition-all ${
                          bk.status === 'unread' ? 'border-clay/60 bg-clay/[0.01]' : 'border-sand/30'
                        }`}>
                          {/* Booking general details */}
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[9px] font-mono tracking-widest uppercase font-semibold text-white px-2 py-0.5 rounded-[2px] ${
                                  bk.type === 'school' ? 'bg-indigo' : bk.type === 'corporate' ? 'bg-charcoal' : 'bg-clay'
                                }`}>
                                  {bk.type === 'school' ? 'School Visit' : bk.type === 'corporate' ? 'Corporate DEI' : 'Public Inquiry'}
                                </span>
                                <span className="text-[10px] text-charcoal/40 font-mono">
                                  {new Date(bk.timestamp).toLocaleString()}
                                </span>
                              </div>
                              <h4 className="font-serif text-charcoal font-medium text-lg leading-tight">{bk.name}</h4>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
                              {/* Status toggles */}
                              <button
                                onClick={() => handleUpdateBookingStatus(bk.id, bk.status === 'unread' ? 'read' : 'unread')}
                                className={`px-2.5 py-1 rounded-[2px] border transition-colors cursor-pointer ${
                                  bk.status === 'unread' 
                                    ? 'bg-clay/10 text-clay border-clay/20 hover:bg-clay/20' 
                                    : 'bg-[#eee] text-[#555] border-[#ddd] hover:bg-[#e4e4e4]'
                                }`}
                              >
                                {bk.status === 'unread' ? 'Mark Read' : 'Unread'}
                              </button>

                              <button
                                onClick={() => handleUpdateBookingStatus(bk.id, bk.status === 'completed' ? 'read' : 'completed')}
                                className={`px-2.5 py-1 rounded-[2px] border transition-all cursor-pointer ${
                                  bk.status === 'completed'
                                    ? 'bg-moss text-white border-moss hover:bg-moss/90'
                                    : 'border-sand/60 text-charcoal/60 hover:border-moss hover:text-moss'
                                }`}
                              >
                                {bk.status === 'completed' ? 'Completed ✓' : 'Mark Completed'}
                              </button>

                              <button
                                onClick={() => handleDeleteBooking(bk.id)}
                                className="p-1 px-2 border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-400 rounded-[2px] transition-colors cursor-pointer"
                                title="Delete Inquiry"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* contact desk details */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs border-y border-sand/10 py-2.5 mt-2 bg-ivory-[0.1] font-mono">
                            <div className="flex items-center gap-2 text-charcoal/70">
                              <Mail className="w-3.5 h-3.5 text-charcoal/40" />
                              <span>{bk.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-charcoal/70">
                              <Phone className="w-3.5 h-3.5 text-charcoal/40" />
                              <span>{bk.phone}</span>
                            </div>
                          </div>

                          {/* user notes */}
                          <div className="pt-2 text-xs text-charcoal/80 font-sans tracking-wide leading-relaxed pl-3 border-l-2 border-clay/30 italic">
                            "{bk.notes}"
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
