import { useState, useEffect } from "react";
import { Sparkles, Calendar, BookOpen, Clock, Heart, Users, ArrowUpRight, CheckCircle2, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CmsData, Exhibition, CustomPage } from "./types";
import Navbar from "./components/Navbar";
import CmsDashboard from "./components/CmsDashboard";
import ContactForm from "./components/ContactForm";
import HeritageMotifs from "./components/HeritageMotifs";
import AfroBaobabLogo from "./components/AfroBaobabLogo";
import { getCmsAll } from "./lib/cmsClient";

// Reusable elegant tribal geometric separator to enrich spacing and design focus
const TribalDivider = ({ light = false }: { light?: boolean }) => (
  <div className={`w-full flex justify-center items-center gap-3 py-16 overflow-hidden select-none ${light ? 'opacity-20 text-white' : 'opacity-30 text-clay bg-ivory'}`}>
    <div className={`h-[1px] bg-gradient-to-r from-transparent ${light ? 'to-white' : 'to-clay'} flex-grow`}></div>
    <div className="flex gap-2.5 items-center text-[0.6rem] tracking-[0.45em] font-mono uppercase font-bold">
      <span>✦</span>
      <span>▼</span>
      <span>▲</span>
      <span>▼</span>
      <span>▲</span>
      <span>▼</span>
      <span>✦</span>
    </div>
    <div className={`h-[1px] bg-gradient-to-l from-transparent ${light ? 'to-white' : 'to-clay'} flex-grow`}></div>
  </div>
);

export default function App() {
  const [data, setData] = useState<CmsData | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isCmsOpen, setIsCmsOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingType, setBookingType] = useState<'school' | 'corporate' | 'general'>('general');
  const [selectedCustomPage, setSelectedCustomPage] = useState<CustomPage | null>(null);

  // Interactive exhibition tab selector
  const [selectedExhibitionId, setSelectedExhibitionId] = useState<string | null>(null);

  // Authenticated state matching local storage
  const [isAdmin, setIsAdmin] = useState(
    !!localStorage.getItem("afro_baobab_cms_session")
  );

  const fetchCmsData = async () => {
    try {
      const result = await getCmsAll();
      setData(result);
      if (result.exhibitions.length > 0 && !selectedExhibitionId) {
        setSelectedExhibitionId(result.exhibitions[0].id);
      }
    } catch (err) {
      console.error("Failed to load CMS data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCmsData();
  }, []);

  const handleRefresh = () => {
    setIsAdmin(!!localStorage.getItem("afro_baobab_cms_session"));
    fetchCmsData();
  };

  const handleLogout = () => {
    localStorage.removeItem("afro_baobab_cms_session");
    setIsAdmin(false);
    fetchCmsData();
  };

  const triggerBooking = (type: 'school' | 'corporate' | 'general') => {
    setBookingType(type);
    setIsBookingOpen(true);
  };

  const activeExhibition = data?.exhibitions.find(x => x.id === selectedExhibitionId);

  return (
    <div className="bg-ivory text-charcoal min-h-screen font-sans selection:bg-clay selection:text-white">
      {data?.header?.themeFontImportUrl && (
        <link rel="stylesheet" href={data.header.themeFontImportUrl} />
      )}
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          ${data?.header?.themeColorClay ? `--color-clay-hex: ${data.header.themeColorClay};` : ''}
          ${data?.header?.themeColorMoss ? `--color-moss-hex: ${data.header.themeColorMoss};` : ''}
          ${data?.header?.themeColorIndigo ? `--color-indigo-hex: ${data.header.themeColorIndigo};` : ''}
          ${data?.header?.themeColorCharcoal ? `--color-charcoal-hex: ${data.header.themeColorCharcoal};` : ''}
          ${data?.header?.themeColorIvory ? `--color-ivory-hex: ${data.header.themeColorIvory};` : ''}
          
          ${data?.header?.themeFontFamilyHeadings ? `--font-headings-custom: "${data.header.themeFontFamilyHeadings}", serif;` : ''}
          ${data?.header?.themeFontFamilyBody ? `--font-body-custom: "${data.header.themeFontFamilyBody}", sans-serif;` : ''}
        }
        
        /* Overwriting the dynamic theme utility classes in real-time */
        ${data?.header?.themeColorClay ? `
          .bg-clay { background-color: var(--color-clay-hex) !important; }
          .text-clay { color: var(--color-clay-hex) !important; }
          .border-clay { border-color: var(--color-clay-hex) !important; }
          .hover\\:bg-clay:hover { background-color: var(--color-clay-hex) !important; }
          .hover\\:text-clay:hover { color: var(--color-clay-hex) !important; }
          .hover\\:border-clay:hover { border-color: var(--color-clay-hex) !important; }
          .selection\\:bg-clay::selection { background-color: var(--color-clay-hex) !important; }
        ` : ''}
        
        ${data?.header?.themeColorMoss ? `
          .bg-moss { background-color: var(--color-moss-hex) !important; }
          .text-moss { color: var(--color-moss-hex) !important; }
          .border-moss { border-color: var(--color-moss-hex) !important; }
          .hover\\:bg-moss:hover { background-color: var(--color-moss-hex) !important; }
          .hover\\:text-moss:hover { color: var(--color-moss-hex) !important; }
        ` : ''}
        
        ${data?.header?.themeColorIndigo ? `
          .bg-indigo { background-color: var(--color-indigo-hex) !important; }
          .text-indigo { color: var(--color-indigo-hex) !important; }
          .border-indigo { border-color: var(--color-indigo-hex) !important; }
        ` : ''}
        
        ${data?.header?.themeColorCharcoal ? `
          .bg-charcoal { background-color: var(--color-charcoal-hex) !important; }
          .text-charcoal { color: var(--color-charcoal-hex) !important; }
          .border-charcoal { border-color: var(--color-charcoal-hex) !important; }
        ` : ''}
        
        ${data?.header?.themeColorIvory ? `
          .bg-ivory { background-color: var(--color-ivory-hex) !important; }
          .text-ivory { color: var(--color-ivory-hex) !important; }
          .border-ivory { border-color: var(--color-ivory-hex) !important; }
        ` : ''}

        ${data?.header?.themeFontFamilyHeadings ? `
          h1, h2, h3, h4, h5, h6, .font-serif {
            font-family: var(--font-headings-custom) !important;
          }
        ` : ''}
        
        ${data?.header?.themeFontFamilyBody ? `
          body, p, span, div:not(.font-mono), section, a, button, label, input, textarea {
            font-family: var(--font-body-custom) !important;
          }
        ` : ''}

        /* Responsive custom sizes for homepage hero title & subtitle */
        .hero-custom-title {
          font-size: ${data?.header.heroTitleSize ? `${data.header.heroTitleSize}px` : '72px'};
        }
        .hero-custom-sub {
          font-size: ${data?.header.heroSubSize ? `${data.header.heroSubSize}px` : '16px'};
        }
        
        @media (max-width: 640px) {
          .hero-custom-title {
            font-size: ${data?.header.heroTitleSize ? `${Math.max(30, Math.round(data.header.heroTitleSize * 0.65))}px` : '40px'} !important;
            line-height: 1.15 !important;
          }
          .hero-custom-sub {
            font-size: ${data?.header.heroSubSize ? `${Math.max(12, Math.round(data.header.heroSubSize * 0.85))}px` : '14px'} !important;
          }
        }
      ` }} />

      {/* Dynamic Navbar */}
      <Navbar
        onOpenCms={() => setIsCmsOpen(true)}
        onOpenBooking={triggerBooking}
        isAdmin={isAdmin}
        onLogout={handleLogout}
        header={data?.header}
        customPages={data?.customPages}
        onSelectPage={setSelectedCustomPage}
      />

      {loading ? (
        // Elegant loading skeleton keeping brand colors
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-charcoal text-sand space-y-4">
          <svg className="animate-spin h-8 w-8 text-clay" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="font-serif italic font-light text-lg">Seeding Baobab Cultural roots ...</p>
        </div>
      ) : (
        <>
          {/* HERO */}
          <section className="relative min-h-screen flex flex-col justify-end overflow-hidden pb-20 pt-28">
            {/* Background Layer with absolute transitions */}
            {data?.header.heroWallpaperMode === "custom-image" && data?.header.heroWallpaperUrl ? (
              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                style={{
                  backgroundImage: `linear-gradient(rgba(10, 6, 4, 0.75), rgba(15, 10, 8, 0.85)), url(${data.header.heroWallpaperUrl})`
                }}
              />
            ) : (
              <div
                className="absolute inset-0 bg-gradient-to-br transition-all duration-700"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${data?.header.heroGradientStart || "#160e07"}, ${data?.header.heroGradientEnd || "#141d30"})`
                }}
              />
            )}
            
            {/* Ambient Noise / Orbs */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#FAF8F4_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>
            <div className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r from-terracotta/35 to-transparent top-[-100px] right-[-100px] blur-3xl animate-orb1"></div>
            <div className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-r from-[#CB6A4A]/25 to-transparent bottom-[60px] left-[-100px] blur-3xl animate-orb2"></div>

            {/* Geometric Mesh Overlay */}
            {data?.header.heroWallpaperMode === "geometric-mesh" && (
              <div className="absolute inset-0 opacity-20 pointer-events-none select-none">
                <svg className="w-full h-full" style={{ color: data?.header.logoEmblemColor || "#CB6A4A" }} viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <pattern id="meshGrid" width="16" height="16" patternUnits="userSpaceOnUse">
                      <path d="M 8,0 L 16,8 L 8,16 L 0,8 Z" fill="none" stroke="currentColor" strokeWidth="0.2" />
                      <circle cx="8" cy="8" r="1.2" fill="currentColor" opacity="0.25" />
                    </pattern>
                  </defs>
                  <rect width="100" height="100" fill="url(#meshGrid)" />
                </svg>
              </div>
            )}

            {/* Artistic African Sunrise SVG Background */}
            {(!data?.header.heroWallpaperMode || data?.header.heroWallpaperMode === "sunrise-tribal") && (
              <div className="absolute right-0 bottom-0 top-0 w-full lg:w-3/5 opacity-40 pointer-events-none flex justify-end items-end overflow-hidden z-2 select-none">
                <svg
                  className="w-[85%] h-auto select-none min-w-[500px]"
                  style={{ color: data?.header.logoEmblemColor || "#CB6A4A" }}
                  viewBox="0 0 500 500"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Sun with custom tribal geometry */}
                  <circle cx="350" cy="300" r="140" stroke="currentColor" strokeWidth="1" strokeDasharray="8 6" opacity="0.3" />
                  <circle cx="350" cy="300" r="110" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
                  <circle cx="350" cy="300" r="80" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.8" />
                  <circle cx="350" cy="300" r="50" fill="currentColor" opacity="0.1" />
                  
                  {/* Traditional geometric rays */}
                  <path d="M 350,110 L 350,140 M 350,460 L 350,490" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 160,300 L 190,300 M 510,300 L 540,300" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 215,165 L 235,185 M 485,435 L 505,455" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 215,435 L 235,415 M 485,165 L 505,185" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  
                  {/* Tribal chevron sun detail */}
                  <path d="M 310,300 L 330,285 L 350,300 L 370,285 L 390,300" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
                  <path d="M 310,315 L 330,300 L 350,315 L 370,300 L 390,315" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
                  
                  {/* Giant Baobab Tree Lineart Silhouette */}
                  <path
                    d="M 280,500 
                       C 280,440 250,430 250,380 
                       C 250,320 280,310 300,280 
                       C 270,270 230,290 200,310 
                       C 180,330 160,330 140,310 
                       C 165,290 200,290 220,300
                       C 250,310 270,295 285,270
                       C 260,250 220,260 200,240
                       C 175,220 150,180 170,150
                       C 190,175 210,200 240,210
                       C 270,220 285,200 295,170
                       C 305,130 295,90 325,60
                       C 345,90 335,130 350,165
                       C 360,195 380,210 410,200
                       C 440,190 460,160 490,140
                       C 500,170 480,210 450,230
                       C 420,250 405,260 415,290
                       C 445,280 485,280 515,300
                       C 530,310 540,340 515,360
                       C 490,350 460,330 430,330
                       C 405,360 415,400 410,440
                       C 410,480 390,500 390,500 
                       Z"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="#160e07"
                    fillOpacity="0.4"
                  />

                  {/* Ground horizon lines */}
                  <path d="M 50,500 H 450" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 20,490 H 480" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="15 8" opacity="0.5" />
                </svg>
              </div>
            )}

            {/* Vertical text helper */}
            <div className="absolute bottom-24 right-10 text-[0.65rem] tracking-[0.35em] text-white/20 uppercase whitespace-nowrap rotate-90 origin-right-bottom hidden md:block select-none font-mono">
              Experience · Connect · Belong
            </div>

            {(() => {
              const alignment = data?.header.heroTextAlignment || "left";
              let containerAlignClass = "self-start text-left ml-0 mr-auto items-start";
              let buttonAlignClass = "justify-start";
              let labelAlignClass = "justify-start";

              if (alignment === "center") {
                containerAlignClass = "self-center text-center mx-auto items-center flex flex-col";
                buttonAlignClass = "justify-center";
                labelAlignClass = "justify-center";
              } else if (alignment === "right") {
                containerAlignClass = "self-end text-right mr-0 ml-auto items-end flex flex-col";
                buttonAlignClass = "justify-end";
                labelAlignClass = "justify-end";
              }

              return (
                <div className={`relative z-10 max-w-4xl mx-auto px-[5vw] space-y-6 ${containerAlignClass}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className={`text-clay text-[0.7rem] tracking-[0.38em] uppercase flex items-center gap-3 ${labelAlignClass}`}
                  >
                    {alignment !== "right" && <span className="w-10 h-[1px] bg-clay block"></span>}
                    <span>Dubai's Immersive Cultural Hub</span>
                    {alignment !== "left" && <span className="w-10 h-[1px] bg-clay block"></span>}
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.1 }}
                    className="font-serif font-light text-white leading-[1.08] tracking-tight hero-custom-title"
                    dangerouslySetInnerHTML={{ __html: data?.header.heroTitle || "Deep Roots.<br><em>Open Horizons.</em>" }}
                  />

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.2 }}
                    className="text-white/60 font-light max-w-xl leading-relaxed hero-custom-sub"
                  >
                    {data?.header.heroSub}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className={`flex gap-4 flex-wrap pt-6 w-full ${buttonAlignClass}`}
                  >
                    <a
                      href={data?.header.heroBtn1Link || "#experiences"}
                      className="bg-clay hover:bg-terracotta text-white px-8 py-3.5 rounded-[2px] text-xs tracking-widest uppercase font-medium transition-all shadow-md hover:-translate-y-[1px] inline-flex items-center"
                    >
                      {data?.header.heroBtn1Text || "Plan a Visit"}
                    </a>
                    {data?.header.heroBtn2Text ? (
                      <a
                        href={data.header.heroBtn2Link || "#contact"}
                        className="bg-transparent hover:border-clay hover:text-clay text-white/80 border border-white/20 px-8 py-3.5 rounded-[2px] text-xs tracking-widest uppercase font-light transition-all cursor-pointer inline-flex items-center"
                      >
                        {data.header.heroBtn2Text}
                      </a>
                    ) : (
                      <>
                        <button
                          onClick={() => triggerBooking('school')}
                          className="bg-transparent hover:border-clay hover:text-clay text-white/80 border border-white/20 px-8 py-3.5 rounded-[2px] text-xs tracking-widest uppercase font-light transition-all cursor-pointer"
                        >
                          For Schools
                        </button>
                        <button
                          onClick={() => triggerBooking('corporate')}
                          className="bg-transparent hover:border-clay hover:text-clay text-white/80 border border-white/20 px-8 py-3.5 rounded-[2px] text-xs tracking-widest uppercase font-light transition-all cursor-pointer"
                        >
                          For Corporates
                        </button>
                      </>
                    )}
                  </motion.div>
                </div>
              );
            })()}

            <div className="absolute bottom-10 left-[5vw] z-10 flex items-center gap-3 text-white/30 text-[0.65rem] tracking-[0.25em] uppercase pointer-events-none select-none">
              <span>Scroll</span>
              <div className="w-[1px] h-12 bg-gradient-to-b from-transparent to-clay animate-pulse"></div>
            </div>
          </section>

          {/* DYNAMIC TICKER */}
          {data?.header.tickerItems && data.header.tickerItems.length > 0 && (
            <div className="bg-charcoal py-3 overflow-hidden whitespace-nowrap shadow-md">
              <div className="inline-flex animate-[tick_40s_linear_infinite] group">
                {Array(4).fill(data.header.tickerItems).flat().map((item, idx) => (
                  <span key={item + idx} className="inline-flex items-center gap-6 text-[0.68rem] tracking-[0.28em] text-sand uppercase px-6">
                    <span>{item}</span>
                    <span className="text-clay text-sm select-none">✦</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* INTRO STORY */}
          <section className="py-24 px-[5vw] max-w-7xl mx-auto relative bg-pattern-mudcloth/40 rounded-[6px] border border-sand/15 bg-white/40 my-16 shadow-xs" id="about">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
              <div className="space-y-6">
                <div className="label">{data?.header.aboutLabel || "Our Story"}</div>
                <h2
                  className="font-serif text-4xl sm:text-5xl font-light leading-[1.15] text-charcoal"
                  dangerouslySetInnerHTML={{ __html: data?.header.aboutHeading || "A Place Where Culture <br />Is Not Only Seen, <br />But <span className=\"text-clay italic\">Experienced</span>" }}
                />
                <p className="text-charcoal/70 text-sm leading-relaxed font-sans max-w-lg">
                  {data?.header.aboutDesc1 || "Afro Baobab Cultural Hub is more than a venue. It is an immersive cultural learning destination where exhibitions, storytelling, rhythm, movement, creativity, and food become portals into human connection and discovery."}
                </p>
                <p className="text-charcoal/70 text-sm leading-relaxed font-sans max-w-lg">
                  {data?.header.aboutDesc2 || "Rooted in African heritage and open to the world, the hub is designed for curious minds — children, families, professionals, artists, and communities who believe culture has the power to transform."}
                </p>
                <div className="pt-4">
                  <a
                    href="#experiences"
                    className="bg-clay hover:bg-terracotta text-white px-7 py-3 rounded-[2px] text-xs font-mono uppercase tracking-widest transition-all inline-block shadow-sm"
                  >
                    {data?.header.aboutBtnText || "Explore Experience Zones"}
                  </a>
                </div>
              </div>

              {/* Graphical illustration zone */}
              <div className="relative p-6 sm:p-10 lg:p-12">
                <div className="absolute inset-0 bg-[#A64836]/10 rounded-tr-[100px] rounded-bl-[100px] border border-sand/30 transform rotate-1 select-none"></div>
                
                <div
                  className="relative aspect-[4/3] rounded-[4px] overflow-hidden flex flex-col justify-end p-6 shadow-2xl group border border-sand/20 clay-inset-border bg-cover bg-center"
                  style={{
                    backgroundImage: data?.header.aboutFeaturedImageMode === "custom-image" && data?.header.aboutFeaturedImageUrl
                      ? `linear-gradient(rgba(10, 6, 4, 0.45), rgba(15, 10, 8, 0.9)), url(${data.header.aboutFeaturedImageUrl})`
                      : "linear-gradient(135deg, #3a1f12, #CB6A4A, #1c1208)"
                  }}
                >
                  {/* Decorative mesh */}
                  {data?.header.aboutFeaturedImageMode !== "custom-image" && (
                    <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,#E7D6BA_1px,transparent_1px),linear-gradient(-45deg,#E7D6BA_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>
                  )}
                  
                  <div className="relative space-y-2 z-10">
                    <span className="text-sand/70 text-[10px] tracking-widest uppercase font-mono block">
                      {data?.header.aboutFeaturedBadge || "Featured Immersive Zone"}
                    </span>
                    <h4
                      className="font-serif text-white text-3xl font-light leading-snug"
                      dangerouslySetInnerHTML={{ __html: data?.header.aboutFeaturedTitle || "The Living Baobab <span className=\"text-clay italic\">Story Room</span>" }}
                    />
                    <p className="text-white/70 text-xs font-light leading-relaxed max-w-md">
                      {data?.header.aboutFeaturedDesc || "Sit under the giant woven Baobab canopy where surround-sound rhythm, projection-mapping story sheets, and live actors combine to share heritage tales."}
                    </p>
                  </div>
                  <span className="absolute bottom-6 right-6 text-white/40 text-[9px] tracking-widest uppercase font-mono select-none z-10">DUBAI · UAE</span>
                </div>

                <div className="absolute -bottom-6 -left-2 bg-charcoal text-white rounded-[3px] p-5 shadow-xl border border-sand/10 space-y-1 hidden sm:block">
                  <span className="font-serif text-3xl text-clay font-medium block leading-none">6+</span>
                  <span className="text-[10px] tracking-wider uppercase text-white/50 block font-mono">Immersive<br />Experience Zones</span>
                </div>
              </div>
            </div>
          </section>

          {/* HERITAGE SYMBOLS & PATTERNS INTERACTIVE CANVAS */}
          <HeritageMotifs />

          <TribalDivider />

          {/* DYNAMIC EXPERIENCES */}
          <section className="bg-charcoal text-white py-24 px-[5vw] relative overflow-hidden" id="experiences">
            {/* Soft geometric kente lines in background */}
            <div className="absolute inset-0 bg-pattern-kente opacity-10 pointer-events-none"></div>
            
            <div className="max-w-7xl mx-auto space-y-12 relative z-10">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 boarder-b border-white/10 pb-6">
                <div>
                  <div className="label text-clay/70">What We Offer</div>
                  <h2 className="font-serif text-3xl sm:text-5xl font-light text-white">
                    Every Visit Is a <span className="text-clay italic">New Journey</span>
                  </h2>
                </div>
                <button
                  onClick={() => triggerBooking('general')}
                  className="bg-transparent hover:border-clay hover:text-clay text-white/50 border border-white/10 px-6 py-2.5 rounded-[2px] text-xs font-mono uppercase tracking-widest transition-all cursor-pointer"
                >
                  Book Private Tour
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1.5px] bg-[#2e2318] border border-sand/10">
                {data?.experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-8 min-h-[290px] flex flex-col justify-end relative overflow-hidden group hover:opacity-95 transition-all duration-300 border border-sand/5 bg-cover bg-center"
                    style={{
                      backgroundImage: exp.imageUrl
                        ? `linear-gradient(rgba(25, 18, 12, 0.45), rgba(25, 18, 12, 0.9)), url(${exp.imageUrl})`
                        : "none",
                      backgroundColor: "#19120c"
                    }}
                  >
                    {/* Geometric Diamond Accent */}
                    <span className="text-clay/20 text-[9px] font-mono tracking-widest absolute top-6 left-8 group-hover:text-clay transition-colors duration-300">
                      ✦ ◈ ✦
                    </span>
                    <div className="absolute top-6 right-6 w-9 h-9 border border-white/10 rounded-full flex items-center justify-center text-white/30 text-sm group-hover:border-clay group-hover:text-clay group-hover:rotate-45 transition-all duration-300">
                      ↗
                    </div>
                    <div>
                      <span className="font-serif text-clay text-xs tracking-widest uppercase font-semibold block mb-2">
                        Zone {exp.number}
                      </span>
                      <h3 className="font-serif text-white text-xl font-medium mb-2">{exp.title}</h3>
                      <p className="text-white/40 text-xs leading-relaxed font-light font-sans max-w-sm">
                        {exp.description}
                      </p>
                    </div>
                    {/* Orange underline hover */}
                    <div className="absolute bottom-0 left-0 h-[2px] bg-clay w-0 group-hover:w-full transition-all duration-500"></div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* DYNAMIC EXHIBITIONS */}
          <section className="bg-sand text-charcoal py-24 px-[5vw] relative overflow-hidden" id="exhibitions">
            {/* Textured woven mudcloth background */}
            <div className="absolute inset-0 bg-pattern-mudcloth opacity-[0.25] pointer-events-none"></div>
            
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center relative z-10">
              <div>
                <div className="label !text-moss">Current &amp; Upcoming</div>
                <h2 className="font-serif text-4xl sm:text-5xl font-light text-charcoal leading-tight">
                  Where Every Wall <br />Tells a <span className="text-terracotta italic">Story</span>
                </h2>
                <p className="text-charcoal/70 text-sm leading-relaxed mt-4 max-w-md">
                  Our gallery rotates with living exhibitions that cross cultures, geographies, and generations. Touch, listen, edit, and discover.
                </p>

                {/* Left Active Exhibition details card preview */}
                {activeExhibition && (
                  <div className="mt-8 bg-white/60 backdrop-blur-sm border border-sand rounded-[2px] max-w-md overflow-hidden shadow-md animate-fadeIn clay-inset-border">
                    {activeExhibition.imageUrl && (
                      <div className="h-44 w-full bg-charcoal/10 overflow-hidden relative">
                        <img
                          src={activeExhibition.imageUrl}
                          alt={activeExhibition.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-6 space-y-3">
                      <span className="text-[10px] tracking-widest uppercase font-mono text-clay font-bold block">
                        {activeExhibition.status === 'Now' ? "ACTIVE EXHIBITION" : `UPCOMING EXHIBITION: ${activeExhibition.status}`}
                      </span>
                      <h4 className="font-serif text-charcoal text-xl font-medium leading-snug">
                        {activeExhibition.title}
                      </h4>
                      <p className="text-charcoal/60 text-xs font-mono font-medium">{activeExhibition.type}</p>
                      <button
                        onClick={() => triggerBooking('general')}
                        className="text-clay hover:text-terracotta text-xs font-mono tracking-widest uppercase flex items-center gap-1.5 pt-2 cursor-pointer"
                      >
                        Plan Visit For This Exhibition <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic Exhibitions interactive list wrapper */}
              <div className="space-y-2">
                {data?.exhibitions.map((exh) => (
                  <div
                    key={exh.id}
                    onClick={() => setSelectedExhibitionId(exh.id)}
                    className={`p-5 rounded-[2px] flex items-center justify-between gap-4 cursor-pointer transition-all duration-200 border-l-[3px] ${
                      selectedExhibitionId === exh.id
                        ? "bg-white border-l-terracotta shadow-md translate-x-1"
                        : "bg-white/40 border-l-transparent hover:bg-white/70"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full font-serif flex items-center justify-center text-xs font-medium ${
                        selectedExhibitionId === exh.id ? "bg-clay text-white" : "bg-charcoal/10 text-charcoal/60"
                      }`}>
                        {exh.badge}
                      </div>
                      <div>
                        <h4 className="font-serif text-charcoal font-medium text-sm sm:text-base leading-tight">
                          {exh.title}
                        </h4>
                        <span className="text-[10px] text-charcoal/40 font-mono mt-0.5 block">{exh.type}</span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-[2px] text-[9px] font-mono uppercase text-nowrap font-medium ${
                      exh.isNow ? "bg-clay text-white" : "bg-moss/10 text-moss"
                    }`}>
                      {exh.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <TribalDivider />

          {/* PATHWAYS FOR SCHOOLS & CORPS */}
          <section className="py-24 px-[5vw]" id="schools">
            <div className="max-w-7xl mx-auto space-y-12">
              <div className="text-center max-w-xl mx-auto space-y-4">
                <div className="label justify-center">Who We Welcome</div>
                <h2 className="font-serif text-4xl sm:text-5xl font-light text-charcoal">
                  Designed for Every <span className="text-clay italic">Curious Mind</span>
                </h2>
                <p className="text-[#6a6059] text-sm leading-relaxed max-w-md mx-auto">
                  Whether you are an educator seeking curriculum-focused learning or a group seeking to build cultural intelligence, we have tailored path programs.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* School card */}
                <div className="bg-indigo text-white p-8 sm:p-12 rounded-[4px] relative overflow-hidden flex flex-col justify-end min-h-[420px] shadow-lg border border-sand/5 clay-inset-border group">
                  <div className="absolute inset-0 opacity-[0.12] pointer-events-none bg-pattern-kente"></div>
                  <div className="relative space-y-4 max-w-md z-10">
                    <span className="text-[#E7D6BA]/60 text-[10px] tracking-widest uppercase font-mono block font-semibold">For Schools</span>
                    <h3 className="font-serif text-3xl font-light leading-snug group-hover:text-sand transition-colors">School &amp; Educational Visits</h3>
                    <p className="text-[#E7D6BA]/70 text-xs leading-relaxed font-sans font-light">
                      Interactive school field-trips for all grades. Modules combine Gallery walk, Baobab Storytelling under canopy, Rhythm circles, and raw clay workshops matching UAE social studies.
                    </p>
                    <div className="flex gap-2 flex-wrap pt-2">
                      <span className="bg-white/10 px-2 py-0.5 rounded-[2px] text-[9px] font-mono">Curriculum Linked</span>
                      <span className="bg-white/10 px-2 py-0.5 rounded-[2px] text-[9px] font-mono">Hands-on Workshops</span>
                      <span className="bg-white/10 px-2 py-0.5 rounded-[2px] text-[9px] font-mono">All Grades</span>
                    </div>
                    <div className="pt-2">
                      <button
                        onClick={() => triggerBooking('school')}
                        className="bg-transparent hover:bg-white/5 border border-[#E7D6BA]/30 hover:border-clay text-[0.68rem] font-mono tracking-widest text-[#E7D6BA] hover:text-clay uppercase py-2.5 px-6 rounded-[2px] transition-all cursor-pointer"
                      >
                        Request School Pack
                      </button>
                    </div>
                  </div>
                </div>

                {/* Corp card */}
                <div className="bg-charcoal text-white p-8 sm:p-12 rounded-[4px] relative overflow-hidden flex flex-col justify-end min-h-[420px] shadow-lg border border-sand/5 clay-inset-border group">
                  <div className="absolute inset-0 opacity-[0.08] pointer-events-none bg-pattern-mudcloth"></div>
                  <div className="relative space-y-4 max-w-md z-10">
                    <span className="text-clay/80 text-[10px] tracking-widest uppercase font-mono block font-semibold animate-pulse">For Organizations</span>
                    <h3 className="font-serif text-3xl font-light leading-snug group-hover:text-clay transition-colors">Corporate Team Integration</h3>
                    <p className="text-white/50 text-xs leading-relaxed font-sans font-light">
                      DEI retreats, global team-building workshops, and client appreciation hosting opportunities. Built around shared creative challenge, food storytelling, and cultural intelligence.
                    </p>
                    <div className="flex gap-2 flex-wrap pt-2">
                      <span className="bg-white/10 px-2 py-0.5 rounded-[2px] text-[9px] font-mono">Cultural Intelligence</span>
                      <span className="bg-white/10 px-2 py-0.5 rounded-[2px] text-[9px] font-mono">DEI Focus</span>
                      <span className="bg-white/10 px-2 py-0.5 rounded-[2px] text-[9px] font-mono">Private Dinners</span>
                    </div>
                    <div className="pt-2">
                      <button
                        onClick={() => triggerBooking('corporate')}
                        className="bg-clay hover:bg-terracotta text-white text-[0.68rem] font-mono tracking-widest uppercase py-2.5 px-6 rounded-[2px] transition-colors cursor-pointer shadow-md inline-block"
                      >
                        Design An Experience
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <TribalDivider />

          {/* QUOTE BANNER */}
          <div className="bg-terracotta py-24 text-center px-[5vw] relative overflow-hidden">
            <div className="absolute left-10 top-0 text-[18rem] text-black/5 leading-none select-none font-serif opacity-40">“</div>
            <div className="relative z-10 max-w-3xl mx-auto space-y-4">
              <p className="font-serif text-xl sm:text-3xl italic font-light text-white leading-relaxed">
                "Culture is not a luxury. It is the language through which we understand ourselves and each other."
              </p>
              <p className="text-white/40 tracking-[0.25em] text-[10px] font-mono uppercase">
                {data?.header.footerTagline}
              </p>
            </div>
          </div>

          {/* EVENTS CALENDAR */}
          <section className="bg-warm-white py-24 px-[5vw]" id="events">
            <div className="max-w-7xl mx-auto space-y-12">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-6 border-b border-sand/20">
                <div>
                  <div className="label">Upcoming Sessions</div>
                  <h2 className="font-serif text-3xl sm:text-5xl font-light text-charcoal">
                    What's <span className="text-clay italic">On</span>
                  </h2>
                </div>
                <button
                  onClick={() => triggerBooking('general')}
                  className="bg-clay hover:bg-terracotta text-white font-mono uppercase text-xs tracking-widest px-6 py-3 rounded-[2px] transition-colors cursor-pointer shadow-sm"
                >
                  Book Events Custom Seat
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.events.map((evItem) => (
                  <div
                    key={evItem.id}
                    className="bg-white border border-sand/20 rounded-[3px] overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div
                      className="h-48 p-4 relative flex justify-end items-start bg-cover bg-center"
                      style={{
                        backgroundImage: evItem.imageUrl
                          ? `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.45)), url(${evItem.imageUrl})`
                          : "none",
                        backgroundColor: evItem.theme === 'moss' ? '#202c1c' : evItem.theme === 'indigo' ? '#0d1622' : '#CB6A4A'
                      }}
                    >
                      {!evItem.imageUrl && (
                        <div className={`absolute inset-0 bg-gradient-to-br ${
                          evItem.theme === 'clay' ? 'from-clay to-terracotta' :
                          evItem.theme === 'moss' ? 'from-moss to-[#202c1c]' :
                          'from-indigo to-[#0d1622]'
                        }`} />
                      )}
                      {/* Grid Decoration */}
                      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(45deg,#FAF8F4_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none"></div>
                      
                      {/* Date Badge */}
                      <div className="bg-black/40 backdrop-blur-md text-white px-3 py-1.5 text-center rounded-[2px] min-w-[50px] shadow-md border border-white/10 relative z-10">
                        <span className="font-serif text-lg font-semibold block leading-tight">{evItem.day}</span>
                        <span className="text-[10px] tracking-wider uppercase opacity-85 block font-mono font-medium">{evItem.month}</span>
                      </div>
                    </div>

                    <div className="p-5 space-y-2 flex-grow flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono tracking-widest text-clay uppercase block font-bold">
                          {evItem.category}
                        </span>
                        <h4 className="font-serif text-charcoal font-medium text-lg leading-snug line-clamp-2">
                          {evItem.title}
                        </h4>
                      </div>

                      <div className="text-[10px] text-charcoal/50 flex gap-2 pt-3 border-t border-sand/10 font-mono">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {evItem.time}</span>
                        <span>·</span>
                        <span>{evItem.audience}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* NEWSLETTER */}
          <section className="bg-charcoal text-white py-24 px-[5vw]">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <div className="label justify-center text-clay/60">Stay Connected</div>
              <h2 className="font-serif text-3xl sm:text-4xl text-white font-light">
                Be First to <span className="text-clay italic">Experience</span> What's Coming
              </h2>
              <p className="text-white/40 text-xs leading-relaxed font-sans max-w-md mx-auto">
                Join our private mailing index list to receive early schedule requests, preview slots, and custom newsletters.
              </p>
              <form onSubmit={(e) => {
                e.preventDefault();
                alert("Subscribed successfully!");
              }} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  placeholder="Your dynamic email address"
                  className="flex-grow bg-white/5 border border-white/10 px-4 py-3 rounded-[2.5px] text-white text-xs select-text focus:outline-none focus:border-clay transition-all"
                />
                <button
                  type="submit"
                  className="bg-clay hover:bg-terracotta text-white font-mono uppercase tracking-widest py-3 px-6 rounded-[2.5px] text-xs transition-colors cursor-pointer"
                >
                  Join the Hub
                </button>
              </form>
            </div>
          </section>

          {/* PARTNERS */}
          <div className="bg-ivory py-14 px-[5vw] border-t border-sand/20 text-center space-y-4">
            <span className="text-[10px] tracking-widest uppercase text-charcoal/40 font-mono font-medium block">
              Trusted by leading organizations, educational institutions, and embassies globally.
            </span>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-charcoal/30 text-xs font-mono font-medium select-none">
              <span>Dubai Schools</span>
              <span>·</span>
              <span>GEMS Education Group</span>
              <span>·</span>
              <span>Embassies &amp; Consulates</span>
              <span>·</span>
              <span>Community Alliances</span>
            </div>
          </div>

          {/* FOOTER */}
          <footer className="bg-[#0f0b08] text-white/50 pt-20 pb-10 px-[5vw] font-sans">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-14 border-b border-white/5">
              {/* Logo block left side */}
              <div className="lg:col-span-2 space-y-4">
                {(() => {
                  const isMatchHeader = !data?.header.footerLogoMode || data.header.footerLogoMode === "match-header";
                  const finalFooterLogoMode = isMatchHeader ? data?.header.logoMode : data?.header.footerLogoMode;
                  const finalFooterLogoImageUrl = isMatchHeader ? data?.header.logoImageUrl : data?.header.footerLogoImageUrl;
                  return (
                    <AfroBaobabLogo
                      variant="full"
                      color="#CB6A4A"
                      textClassName="text-[#FAF8F4]"
                      logoTextPrimary={data?.header.logoTextPrimary}
                      logoTextSecondary={data?.header.logoTextSecondary}
                      logoSub={data?.header.logoSub}
                      logoMode={finalFooterLogoMode}
                      logoImageUrl={finalFooterLogoImageUrl}
                      logoEmblemColor={data?.header.logoEmblemColor}
                      scalePercent={data?.header.footerLogoSize}
                    />
                  );
                })()}
                <p className="text-white/30 text-xs leading-relaxed max-w-sm font-sans pt-3">
                  {data?.header.footerDesc}
                </p>
                <div className="font-serif italic text-white/10 text-xl tracking-wide select-none">
                  {data?.header.footerTagline}
                </div>
              </div>

              {/* Navigation links blocks matching exact details */}
              <div>
                <div className="text-[10px] tracking-widest text-white/40 uppercase font-mono font-medium mb-4">Visit Hub</div>
                <ul className="space-y-2 list-none p-0 m-0 text-xs">
                  <li><a href="#experiences" className="hover:text-clay transition-colors">Experiences</a></li>
                  <li><a href="#exhibitions" className="hover:text-clay transition-colors">Exhibitions</a></li>
                  <li><a href="#events" className="hover:text-clay transition-colors">Calendar</a></li>
                  <li><a href="#about" className="hover:text-clay transition-colors">About Us</a></li>
                </ul>
              </div>

              <div>
                <div className="text-[10px] tracking-widest text-white/40 uppercase font-mono font-medium mb-4">Programs</div>
                <ul className="space-y-2 list-none p-0 m-0 text-xs">
                  <li><button onClick={() => triggerBooking('school')} className="hover:text-clay transition-colors text-left">Schools Field Trip</button></li>
                  <li><button onClick={() => triggerBooking('corporate')} className="hover:text-clay transition-colors text-left">DEI Corporate Team</button></li>
                  <li><button onClick={() => triggerBooking('general')} className="hover:text-clay transition-colors text-left">Inquire Custom Spot</button></li>
                </ul>
              </div>

              <div>
                <div className="text-[10px] tracking-widest text-white/40 uppercase font-mono font-medium mb-4">Location</div>
                <div className="text-xs leading-relaxed space-y-1 font-mono text-white/30">
                  <p>{data?.header.contactAddress || "Al Quoz Creative Zone, Dubai, UAE"}</p>
                  {data?.header.contactHours && <p className="text-white/25 text-[11px]">Hours: {data.header.contactHours}</p>}
                  {data?.header.contactPhone && <p className="text-white/25 text-[11px]">Phone: {data.header.contactPhone}</p>}
                  {data?.header.contactEmail && <p className="text-clay text-[11px] block hover:underline"><a href={`mailto:${data.header.contactEmail}`}>{data.header.contactEmail}</a></p>}
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-white/25">
              <span>© {new Date().getFullYear()} Afro Baobab Cultural Hub. Active Content Desk setup.</span>
              <div className="flex gap-4">
                {data?.header.socialInstagram ? (
                  <a href={data.header.socialInstagram} target="_blank" rel="noreferrer" className="hover:text-clay transition-colors">Instagram</a>
                ) : (
                  <a href="#" className="hover:text-clay transition-colors">Instagram</a>
                )}
                {data?.header.socialFacebook ? (
                  <a href={data.header.socialFacebook} target="_blank" rel="noreferrer" className="hover:text-clay transition-colors">Facebook</a>
                ) : (
                  <a href="#" className="hover:text-clay transition-colors">Facebook</a>
                )}
                {data?.header.socialTwitter && (
                  <a href={data.header.socialTwitter} target="_blank" rel="noreferrer" className="hover:text-clay transition-colors">Twitter</a>
                )}
                {data?.header.socialTiktok && (
                  <a href={data.header.socialTiktok} target="_blank" rel="noreferrer" className="hover:text-clay transition-colors">TikTok</a>
                )}
                {data?.header.socialYoutube && (
                  <a href={data.header.socialYoutube} target="_blank" rel="noreferrer" className="hover:text-clay transition-colors">YouTube</a>
                )}
              </div>
            </div>
          </footer>
        </>
      )}

      {/* MODAL SYSTEM */}
      <AnimatePresence>
        {isCmsOpen && (
          <CmsDashboard
            isOpen={isCmsOpen}
            onClose={() => setIsCmsOpen(false)}
            data={data}
            onRefresh={handleRefresh}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isBookingOpen && (
          <ContactForm
            isOpen={isBookingOpen}
            onClose={() => setIsBookingOpen(false)}
            defaultType={bookingType}
            recipientEmail={data?.header?.inquiryRecipientEmail}
          />
        )}
      </AnimatePresence>

      {/* CUSTOM CMS PAGES VIEWER MODAL */}
      <AnimatePresence>
        {selectedCustomPage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-white border border-sand rounded-[3px] shadow-2xl p-6 sm:p-10 max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedCustomPage(null)}
                className="absolute top-4 right-4 text-charcoal/50 hover:text-clay transition-colors cursor-pointer p-1 bg-transparent border-0"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-6">
                <div>
                  <div className="text-[10px] tracking-widest text-clay uppercase font-mono font-bold mb-1">
                    African Baobab Hub · Page Custom View
                  </div>
                  <h1 className="font-serif text-3xl sm:text-4xl font-light text-charcoal tracking-tight leading-none mt-1">
                    {selectedCustomPage.title}
                  </h1>
                </div>

                <div className="h-[1px] bg-sand/20" />

                <div className="text-charcoal/80 text-sm leading-relaxed whitespace-pre-wrap font-sans max-w-prose">
                  {selectedCustomPage.content}
                </div>

                <div className="pt-6 flex justify-end">
                  <button
                    onClick={() => setSelectedCustomPage(null)}
                    className="bg-charcoal text-white hover:bg-clay font-mono uppercase tracking-widest text-[10px] px-6 py-2.5 rounded-[2px] transition-colors cursor-pointer border-0"
                  >
                    Close Page
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
