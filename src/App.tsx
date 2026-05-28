import { useState, useEffect, useRef } from "react";
import { Sparkles, Calendar, BookOpen, Clock, Heart, Users, ArrowUpRight, CheckCircle2, X, Music, Volume2, VolumeX, Play, Pause, MessageCircle, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CmsData, Exhibition, CustomPage } from "./types";
import Navbar from "./components/Navbar";
import CmsDashboard from "./components/CmsDashboard";
import ContactForm from "./components/ContactForm";
import HeritageMotifs from "./components/HeritageMotifs";
import AfroBaobabLogo from "./components/AfroBaobabLogo";
import GalleryCarousel from "./components/GalleryCarousel";
import ComingSoonBaobabPage from "./components/ComingSoonBaobabPage";
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

  // Background Audio states & ref
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0.45);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  // Guest visitor interactive hides (stored in component state, remembers visitor preference)
  const [isMusicPlayerHiddenByVisitor, setIsMusicPlayerHiddenByVisitor] = useState(false);

  // Modals state
  const [isCmsOpen, setIsCmsOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingType, setBookingType] = useState<'school' | 'corporate' | 'general'>('general');
  const [selectedCustomPage, setSelectedCustomPage] = useState<CustomPage | null>(null);
  const [activePath, setActivePath] = useState(() => {
    if (typeof window !== "undefined") {
      return window.location.pathname;
    }
    return "/";
  });

  // Client-side router listening to popstate (back/forward)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handlePopState = () => {
        setActivePath(window.location.pathname);
      };
      window.addEventListener("popstate", handlePopState);
      return () => window.removeEventListener("popstate", handlePopState);
    }
  }, []);

  const navigateTo = (path: string) => {
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", path);
      setActivePath(path);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Interactive exhibition tab selector
  const [selectedExhibitionId, setSelectedExhibitionId] = useState<string | null>(null);

  // Dynamic share toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleShareEvent = async (evTitle: string, evDay: string, evMonth: string) => {
    // Elegant sharing caption with location and hub details
    const textToShare = `Come check out "${evTitle}" on ${evDay} ${evMonth} at Afro Baobab Cultural Hub, Dubai!\n\nExplore African heritage, djembe circles, and spectacular modern art exhibitions. Check schedule at Alserkal Avenue: ${window.location.origin}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: evTitle,
          text: textToShare,
          url: window.location.href
        });
        return;
      } catch (err) {
        console.log("Web share api declined or skipped, using copy clipboard alternative", err);
      }
    }
    
    try {
      await navigator.clipboard.writeText(textToShare);
      setToastMessage(`"Invite" copied to clipboard! Share it with friends.`);
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      alert(`Sharing details:\n${textToShare}`);
    }
  };

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

  // Sync background audio settings with actual HTML Audio element
  useEffect(() => {
    if (!data?.header?.audioUrl || data?.header?.hideMusicPlayer || isMusicPlayerHiddenByVisitor) {
      setIsAudioPlaying(false);
      try {
        audioRef.current?.pause();
      } catch (e) {
        console.warn(e);
      }
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    // Load track
    audio.src = data.header.audioUrl;
    audio.load();
    audio.volume = audioVolume;
    audio.muted = isAudioMuted;

    const playAudioOnGesture = () => {
      audio.play()
        .then(() => {
          setIsAudioPlaying(true);
          setHasUserInteracted(true);
          window.removeEventListener("click", playAudioOnGesture);
          window.removeEventListener("touchstart", playAudioOnGesture);
        })
        .catch((err) => {
          console.warn("Audio play gesture request was unsuccessful:", err);
        });
    };

    if (data.header.audioAutoplay) {
      // Autoplay attempt
      audio.play()
        .then(() => {
          setIsAudioPlaying(true);
          setHasUserInteracted(true);
        })
        .catch(() => {
          // Setup micro-listener wait for user's interaction click anywhere
          window.addEventListener("click", playAudioOnGesture);
          window.addEventListener("touchstart", playAudioOnGesture);
        });
    }

    return () => {
      window.removeEventListener("click", playAudioOnGesture);
      window.removeEventListener("touchstart", playAudioOnGesture);
    };
  }, [data?.header?.audioUrl, data?.header?.audioAutoplay, isMusicPlayerHiddenByVisitor]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = audioVolume;
    }
  }, [audioVolume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isAudioMuted;
    }
  }, [isAudioMuted]);

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

  const openCustomPageBySlug = (slug: string) => {
    const page = data?.customPages?.find(p => p.slug === slug);
    if (page) {
      setSelectedCustomPage(page);
    }
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

        @keyframes bounceEqualizer {
          0% { height: 3px; }
          100% { height: 16px; }
        }
        .anim-eq-1 { animation: bounceEqualizer 0.5s ease-in-out infinite alternate; }
        .anim-eq-2 { animation: bounceEqualizer 0.8s ease-in-out infinite alternate 0.15s; }
        .anim-eq-3 { animation: bounceEqualizer 0.6s ease-in-out infinite alternate 0.3s; }
        .anim-eq-4 { animation: bounceEqualizer 0.7s ease-in-out infinite alternate 0.05s; }
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
        onSelectPageBySlug={navigateTo}
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
      ) : activePath === "/coming-soon" ? (
        <ComingSoonBaobabPage navigateTo={navigateTo} header={data?.header} />
      ) : activePath === "/schools" ? (
        <div className="pt-24 min-h-screen bg-[#110a05] text-[#FAF8F4] overflow-hidden relative pb-20 selection:bg-clay selection:text-white flex flex-col justify-between">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1c120a] to-[#0c0805] -z-10" />
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#FAF8F4_1.5px,transparent_1.5px)] [background-size:24px_24px] -z-10 animate-pulse"></div>
          
          <div className="max-w-5xl mx-auto px-6 sm:px-10 py-12 sm:py-20 w-full space-y-16">
            {/* Page Header */}
            <div className="space-y-4 text-center sm:text-left">
              <div className="text-[10px] tracking-widest text-[#CB6A4A] uppercase font-mono font-bold">
                African Cultural Hub Dubai · School Field Trips
              </div>
              <h1 className="font-serif text-4xl sm:text-6xl font-light text-[#FAF8F4] tracking-tight leading-tight">
                Educational Field Trips
              </h1>
              <p className="text-white/70 font-sans text-sm sm:text-base max-w-2xl leading-relaxed">
                Our curriculum-aligned, hands-on immersive modules are custom-tailored to spark wonder, creativity, and deep cultural intelligence in students. Here is a preview of the interactive activities we conduct.
              </p>
            </div>

            <TribalDivider light={true} />

            {/* Practical Modules Grid with Real Images */}
            <div className="space-y-8">
              <h2 className="text-lg font-mono tracking-wider text-moss uppercase">✧ Core Field Trip Workshops</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Workshop 1 */}
                <div className="bg-white/5 border border-white/10 rounded-[4px] overflow-hidden hover:border-clay/50 transition-all duration-300 group flex flex-col justify-between">
                  <div className="relative h-48 overflow-hidden bg-black/40">
                    <img 
                      src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80" 
                      alt="African drumming circle"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-clay text-white text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-[1px]">
                      Rhythm Circle
                    </div>
                  </div>
                  <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-serif font-light text-white group-hover:text-clay transition-colors">Master Rhythm & Drumming</h3>
                      <p className="text-xs text-white/70 leading-relaxed font-sans mt-2 font-light">
                        Authentic djembe drum alignment workshops led by our hub master percussionists. Students learn sequence, tempo, coordination, and cooperative pulse while sitting on pattern-woven stools in outdoor interactive drumming circles.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Workshop 2 */}
                <div className="bg-white/5 border border-white/10 rounded-[4px] overflow-hidden hover:border-clay/50 transition-all duration-300 group flex flex-col justify-between">
                  <div className="relative h-48 overflow-hidden bg-black/40">
                    <img 
                      src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80" 
                      alt="Ancestral Face Paint dot art"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-moss text-white text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-[1px]">
                      Face Paint & Lore
                    </div>
                  </div>
                  <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-serif font-light text-white group-hover:text-moss transition-colors">Traditional Dot Painting</h3>
                      <p className="text-xs text-white/70 leading-relaxed font-sans mt-2 font-light">
                        Students learn ancestral design styles by receiving beautiful face paint motifs of fine white clay-based dots on their cheeks and foreheads. Sessions match safe organic cosmetic standards and pair face painting with local African children's folklore stories.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Workshop 3 */}
                <div className="bg-white/5 border border-white/10 rounded-[4px] overflow-hidden hover:border-clay/50 transition-all duration-300 group flex flex-col justify-between">
                  <div className="relative h-48 overflow-hidden bg-black/40">
                    <img 
                      src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80" 
                      alt="Clay painting & Mask moulding"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-indigo text-white text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-[1px]">
                      Art & Ceramics
                    </div>
                  </div>
                  <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-serif font-light text-white group-hover:text-indigo-400 transition-colors">Clay Pot & Mask Painting</h3>
                      <p className="text-xs text-white/70 leading-relaxed font-sans mt-2 font-light">
                        A highly interactive hands-on art session where children mould classic clay vessels and use black, terracotta, and ochre paint tones to craft geometric African tribal shields and mask layouts, developing physical creative skills.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Workshop 4 */}
                <div className="bg-white/5 border border-white/10 rounded-[4px] overflow-hidden hover:border-clay/50 transition-all duration-300 group flex flex-col justify-between">
                  <div className="relative h-48 overflow-hidden bg-black/40">
                    <img 
                      src="https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=800&q=80" 
                      alt="Beading craft work"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-clay text-white text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-[1px]">
                      Handcrafted Beads
                    </div>
                  </div>
                  <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-serif font-light text-white group-hover:text-terracotta transition-colors">Mathematical Bead Threading</h3>
                      <p className="text-xs text-white/70 leading-relaxed font-sans mt-2 font-light">
                        Students discover geometrical symmetry, math structures, and ethnic meanings by assembling gorgeous vibrant beads onto necklaces and strings, matching real historical patterns under local UAE study topics.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Showcase Item - Djembe line on Grass */}
            <div className="bg-[#1c120a] border border-[#CB6A4A]/25 rounded-[4px] overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="h-64 lg:h-auto min-h-[240px] relative bg-black">
                  <img 
                    src="https://images.unsplash.com/photo-1543731068-7e0f5beff43a?auto=format&fit=crop&w=800&q=80" 
                    alt="Row of detailed African djembe drums on grass"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1c120a]/80 hidden lg:block" />
                </div>
                <div className="p-8 flex flex-col justify-center space-y-4">
                  <div className="text-[9px] tracking-[0.2em] text-[#CB6A4A] font-mono uppercase font-bold">Featured Hub Instrument Showcase</div>
                  <h3 className="text-2xl font-serif text-white font-light">Laid Out Djembe Choir Gardens</h3>
                  <p className="text-xs text-white/75 leading-relaxed font-sans font-light">
                    Observe our magnificent array of authentic hand-carved ethnic djembe drums sitting neat on the lush lawns of our Dubai villa grounds. Students learn the rich construction parameters, regional wood craftmanship, and the dynamic musical dialogues passed down through centuries of West African heritage.
                  </p>
                </div>
              </div>
            </div>

            {/* Curricular & Logistics Specs banner */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <div className="border border-[#CB6A4A]/20 bg-[#cb6a4a]/5 rounded-[3px] p-6 sm:p-8 space-y-4">
                <h3 className="text-xl font-serif font-light text-white text-left">Curriculum Integration</h3>
                <p className="text-xs text-white/80 font-sans leading-relaxed">
                  Our programs are aligned carefully with standard world frameworks:
                </p>
                <ul className="space-y-2 text-xs text-white/70 list-disc list-inside font-sans pl-1">
                  <li>Fully integrated with IB, American, British, CBSE, and MOE guidelines</li>
                  <li>UAE Social Studies linked craftwork elements and heritage references</li>
                  <li>In-depth teacher worksheets provided to continue the learnings in classrooms</li>
                </ul>
              </div>

              <div className="border border-moss/20 bg-moss/5 rounded-[3px] p-6 sm:p-8 space-y-4">
                <h3 className="text-xl font-serif font-light text-white text-left">Logistics & Capacity</h3>
                <p className="text-xs text-white/80 font-sans leading-relaxed">
                  Everything you need for a safe and synchronized visit setup:
                </p>
                <ul className="space-y-2 text-xs text-white/70 list-disc list-inside font-sans pl-1">
                  <li>Accommodates student capacities of 20 up to 60 per active session</li>
                  <li>Flexible morning field trip programs from 9:00 AM – 1:00 PM</li>
                  <li>Dedicated bus parking and safe private courtyard spaces in Dubai</li>
                </ul>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 justify-center sm:justify-start">
              <button
                onClick={() => triggerBooking('school')}
                className="w-full sm:w-auto bg-clay hover:bg-terracotta text-white font-mono uppercase tracking-widest text-[11px] px-8 py-4 rounded-[2px] transition-colors cursor-pointer shadow-md text-center"
              >
                Inquire School Visit ✦
              </button>
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('/');
                }}
                className="w-full sm:w-auto text-center border border-white/20 hover:border-white text-white/80 hover:text-white font-mono uppercase tracking-widest text-[11px] px-8 py-4 rounded-[2px] transition-all cursor-pointer"
              >
                ↩ Return to Main Hub
              </a>
            </div>
          </div>
          
          <footer className="border-t border-white/5 py-8 text-center text-white/40 text-[10px] uppercase font-mono tracking-widest">
            Afro Baobab Dubai · All Rights Reserved
          </footer>
        </div>
      ) : activePath === "/corporate" ? (
        <div className="pt-24 min-h-screen bg-[#0a0705] text-[#FAF8F4] overflow-hidden relative pb-20 selection:bg-clay selection:text-white flex flex-col justify-between">
          <div className="absolute inset-0 bg-gradient-to-br from-[#120d09] to-[#060403] -z-10" />
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#FAF8F4_1.5px,transparent_1.5px)] [background-size:24px_24px] -z-10"></div>
          
          <div className="max-w-4xl mx-auto px-6 sm:px-10 py-12 sm:py-20 w-full space-y-12">
            {/* Page Header */}
            <div className="space-y-4 text-center sm:text-left">
              <div className="text-[10px] tracking-widest text-clay uppercase font-mono font-bold">
                African Cultural Hub Dubai · Corporate Solutions
              </div>
              <h1 className="font-serif text-4xl sm:text-6xl font-light text-[#FAF8F4] tracking-tight leading-tight">
                Corporate
              </h1>
              <p className="text-white/70 font-sans text-sm sm:text-base max-w-2xl leading-relaxed">
                Grow collective resonance, deepen global mindset sensitivity, and ignite strategic innovation with tailored executive retreats at Dubai's premium cultural experience space.
              </p>
            </div>

            <TribalDivider light={true} />

            {/* Corporate Programs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="bg-white/5 border border-white/10 rounded-[4px] p-6 hover:border-clay/50 transition-all duration-300 space-y-3">
                <div className="w-10 h-10 rounded-full bg-clay/20 flex items-center justify-center text-clay border border-clay/30">
                  <Music className="w-5 h-5 text-clay animate-pulse" />
                </div>
                <h3 className="text-lg font-serif font-light text-white">Dynamic Rhythmic Synergy</h3>
                <p className="text-xs text-white/70 leading-relaxed font-sans">
                  Highly energetic djembe percussion sessions focusing on listening, non-verbal group response, and team alignment. Build a singular, synchronized brand pulse.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-[4px] p-6 hover:border-moss/50 transition-all duration-300 space-y-3">
                <div className="w-10 h-10 rounded-full bg-moss/20 flex items-center justify-center text-moss border border-moss/30">
                  <CheckCircle2 className="w-5 h-5 text-moss" />
                </div>
                <h3 className="text-lg font-serif font-light text-white">Collaborative Bead Tapestry</h3>
                <p className="text-xs text-white/70 leading-relaxed font-sans">
                  An artistic visual assignment where team participants collaborate to build a majestic, large-scale beaded canvas reflecting the core synergistic vision of your organization.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-[4px] p-6 hover:border-[#cb6a4a]/50 transition-all duration-300 space-y-3">
                <div className="w-10 h-10 rounded-full bg-[#cb6a4a]/20 flex items-center justify-center text-[#cb6a4a] border border-[#cb6a4a]/30">
                  <Users className="w-5 h-5 text-[#cb6a4a]" />
                </div>
                <h3 className="text-lg font-serif font-light text-white">Narrative Leadership Seminars</h3>
                <p className="text-xs text-white/70 leading-relaxed font-sans px-0.5">
                  Cultural training drawing insights from ancient council wisdom (Lezgara) to teach story-driven leadership, team empathy, and inclusive dialogue frameworks.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-[4px] p-6 hover:border-indigo/50 transition-all duration-300 space-y-3">
                <div className="w-10 h-10 rounded-full bg-indigo/20 flex items-center justify-center text-indigo border border-indigo/30">
                  <Sparkles className="w-5 h-5 text-indigo" />
                </div>
                <h3 className="text-lg font-serif font-light text-white">communal Dining Experiences</h3>
                <p className="text-xs text-white/70 leading-relaxed font-sans">
                  Immersive sensory journeys incorporating ancestral storytelling, slow coffee roasting rituals, collaborative food sharing, and organic musical performance.
                </p>
              </div>
            </div>

            {/* Service Specs Banner */}
            <div className="border border-moss/20 bg-moss/5 rounded-[3px] p-6 sm:p-8 space-y-4">
              <h3 className="text-xl font-serif font-light text-white">Corporate buyouts & Amenities</h3>
              <ul className="space-y-2 text-xs text-white/80 list-disc list-inside font-sans">
                <li>Exclusive private access to our active Art Gallery, Meeting Salon, and Canopy Story room</li>
                <li>Flexible setups accommodating up to 50 executives per team event</li>
                <li>Fully integrated surround audio systems, modern presentation screens, and custom mocktail catering</li>
              </ul>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <button
                onClick={() => triggerBooking('corporate')}
                className="w-full sm:w-auto bg-clay hover:bg-terracotta text-white font-mono uppercase tracking-widest text-[11px] px-8 py-4 rounded-[2px] transition-colors cursor-pointer shadow-md text-center"
              >
                Inquire Team Retreat ✦
              </button>
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('/');
                }}
                className="w-full sm:w-auto text-center border border-white/20 hover:border-white text-white/80 hover:text-white font-mono uppercase tracking-widest text-[11px] px-8 py-4 rounded-[2px] transition-all cursor-pointer"
              >
                ↩ Return to Main Hub
              </a>
            </div>
          </div>
          
          <footer className="border-t border-white/5 py-8 text-center text-white/40 text-[10px] uppercase font-mono tracking-widest">
            Afro Baobab Dubai · All Rights Reserved
          </footer>
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
                      {data?.header.heroBtn1Text || "Explore Experiences"}
                    </a>
                    {data?.header.heroBtn2Text && !data.header.heroBtn2Text.toLowerCase().includes("reserve a visit") && (
                      <a
                        href={data.header.heroBtn2Link || "#contact"}
                        className="bg-transparent hover:border-clay hover:text-clay text-white/80 border border-white/20 px-8 py-3.5 rounded-[2px] text-xs tracking-widest uppercase font-light transition-all cursor-pointer inline-flex items-center"
                      >
                        {data.header.heroBtn2Text}
                      </a>
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
          {data?.header.showAbout !== false && (
            <section className="py-24 px-[5vw] max-w-7xl mx-auto relative bg-pattern-mudcloth/40 rounded-[6px] border border-sand/15 bg-white/40 my-16 shadow-xs" id="about">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                <div className="space-y-6">
                  <div className="label">{data?.header.aboutLabel || "Our Story"}</div>
                  <h2
                    className="font-serif text-4xl sm:text-5xl font-light leading-[1.15] text-charcoal"
                    dangerouslySetInnerHTML={{ __html: data?.header.aboutHeading || "A Place Where Culture <br />Is Not Only Seen, <br />But <span class=\"text-clay italic\">Experienced</span>" }}
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
                        dangerouslySetInnerHTML={{ __html: data?.header.aboutFeaturedTitle || "The Living Baobab <span class=\"text-clay italic\">Story Room</span>" }}
                      />
                      <p className="text-white/70 text-xs font-light leading-relaxed max-w-md">
                        {data?.header.aboutFeaturedDesc || "Sit under the giant woven Baobab canopy where surround-sound rhythm, projection-mapping story sheets, and live actors combine to share heritage tales."}
                      </p>
                    </div>
                    <span className="absolute bottom-6 right-6 text-white/40 text-[9px] tracking-widest uppercase font-mono select-none z-10">DUBAI · UAE</span>
                  </div>

                  <div className="absolute -bottom-6 -left-2 bg-charcoal text-white rounded-[3px] p-5 shadow-xl border border-sand/10 space-y-1 hidden sm:block">
                    <span className="font-serif text-3xl text-clay font-medium block leading-none">{data?.header.aboutStatsNumber || "6+"}</span>
                    <span className="text-[10px] tracking-wider uppercase text-white/50 block font-mono whitespace-pre-line">{data?.header.aboutStatsLabel || "Immersive\nExperience Zones"}</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          <TribalDivider />

          {/* DYNAMIC EXPERIENCES */}
          {data?.header.showExperiences !== false && (
            <section className="bg-charcoal text-white py-24 px-[5vw] relative overflow-hidden" id="experiences">
              {/* Soft geometric kente lines in background */}
              <div className="absolute inset-0 bg-pattern-kente opacity-10 pointer-events-none"></div>
              
              <div className="max-w-7xl mx-auto space-y-12 relative z-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 boarder-b border-white/10 pb-6">
                  <div>
                    <div className="label text-clay/70">{data?.header.experiencesLabel || "What We Offer"}</div>
                    <h2
                      className="font-serif text-3xl sm:text-5xl font-light text-white"
                      dangerouslySetInnerHTML={{ __html: data?.header.experiencesTitle || "Every Visit Is a <span class=\"text-clay italic\">New Journey</span>" }}
                    />
                    {data?.header.experiencesSubTitle && (
                      <p className="text-white/60 text-xs mt-2 max-w-md font-sans leading-relaxed">
                        {data.header.experiencesSubTitle}
                      </p>
                    )}
                  </div>
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
          )}

          {/* THEMES & CONTENT PILLARS (HOMEPAGE BRAND IDENTITY INTEGRATION) */}
          <section className="bg-ivory border-t border-b border-sand/30 py-24 px-[5vw] relative overflow-hidden" id="brand-pillars">
            {/* Hand-drawn geometric pattern grid backdrops */}
            <div className="absolute left-6 top-12 opacity-5 select-none text-clay font-mono text-[9px] tracking-widest leading-none pointer-events-none">
              ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦<br/>
              ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦<br/>
              ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦<br/>
              ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦<br/>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Visual Label Column */}
                <div className="lg:col-span-12 xl:col-span-5 space-y-6">
                  <div className="label">The Baobab DNA</div>
                  <h2 className="font-serif text-4xl sm:text-5xl font-light text-[#301C11] leading-tight">
                    Themes &amp;<br/>
                    <span className="italic text-clay">Content Pillars</span>
                  </h2>
                  <p className="text-sm font-sans text-[#5F564F] leading-relaxed max-w-md">
                    Afro Baobab is built upon five foundational storytelling themes. They anchor our contemporary culture, ensuring everything is rooted in authentic heritage and designed for tomorrow.
                  </p>
                  
                  {/* Subtle checklist panel matching 'DESIGN ELEMENTS' column */}
                  <div className="pt-6 border-t border-sand/20 space-y-3">
                    <span className="text-[10px] tracking-widest font-mono font-bold text-clay uppercase block">
                      OUR BRAND DESIGN DNA
                    </span>
                    <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] font-sans text-[#5F564F] font-medium uppercase tracking-wider">
                      <li className="flex items-center gap-1.5"><span className="text-clay text-xs">✦</span> Bold Typography</li>
                      <li className="flex items-center gap-1.5"><span className="text-clay text-xs">✦</span> Organic Shapes</li>
                      <li className="flex items-center gap-1.5"><span className="text-clay text-xs">✦</span> Earth Textures</li>
                      <li className="flex items-center gap-1.5"><span className="text-clay text-xs">✦</span> Matrix Patterns</li>
                      <li className="flex items-center gap-1.5"><span className="text-clay text-xs">✦</span> Deep Contrasts</li>
                      <li className="flex items-center gap-1.5"><span className="text-clay text-xs">✦</span> Negative Space</li>
                    </ul>
                  </div>
                </div>

                {/* Vertical Pillars Showcase */}
                <div className="lg:col-span-12 xl:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      id: "01",
                      title: "JOURNEY",
                      desc: "Experiences that transform.",
                      color: "bg-[#713f27] text-white",
                      svg: (
                        <svg className="w-5 h-5 text-sand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <circle cx="12" cy="12" r="10" strokeDasharray="3 3" />
                          <circle cx="12" cy="12" r="5" strokeDasharray="1.5 1.5" />
                          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                        </svg>
                      )
                    },
                    {
                      id: "02",
                      title: "STORIES",
                      desc: "Sharing voices, history and wisdom.",
                      color: "bg-[#1F2A44] text-white",
                      svg: (
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M2 10q5-4 10 0t10 0" strokeLinecap="round" />
                          <path d="M2 14q5-4 10 0t10 0" strokeLinecap="round" opacity="0.7" />
                        </svg>
                      )
                    },
                    {
                      id: "03",
                      title: "CREATIVITY",
                      desc: "Art, music, craft and expression.",
                      color: "bg-[#55624A] text-white",
                      svg: (
                        <svg className="w-5 h-5 text-sand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <circle cx="12" cy="12" r="4" stroke="currentColor" />
                          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeDasharray="2 2" />
                        </svg>
                      )
                    },
                    {
                      id: "04",
                      title: "COMMUNITY",
                      desc: "People, connection and belonging.",
                      color: "bg-[#CB6A4A] text-white",
                      svg: (
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                        </svg>
                      )
                    },
                    {
                      id: "05",
                      title: "HERITAGE",
                      desc: "Rooted in culture, inspired by tomorrow.",
                      color: "bg-[#0a0604] border border-[#F7F4EF]/25 text-white",
                      svg: (
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="1" />
                          <path d="M3 12h18M12 3v18" strokeLinecap="round" opacity="0.4" />
                        </svg>
                      )
                    }
                  ].map((p) => (
                    <div
                      key={p.title}
                      className="flex items-center gap-4 p-5 bg-white border border-sand/20 hover:border-clay/35 transition-all rounded-[3px] group shadow-xs"
                    >
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${p.color} shadow-sm`}>
                        {p.svg}
                      </div>
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="font-mono text-[8px] tracking-wider text-clay font-bold">{p.id}</span>
                          <h4 className="font-serif text-base font-semibold text-charcoal uppercase group-hover:text-clay transition-colors">
                            {p.title}
                          </h4>
                        </div>
                        <p className="text-xs text-[#5F564F] leading-normal font-light">
                          {p.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Digital shuttle micro-banner element */}
                  <div className="flex items-center justify-between p-5 bg-clay/[0.04] border border-dashed border-clay/20 rounded-[3px] sm:col-span-2">
                    <span className="font-mono text-[9px] tracking-widest text-[#CB6A4A] font-bold uppercase">✦ IMMERSIVE RECRUITS</span>
                    <a href="#heritage-art" className="font-mono text-[9px] text-[#CB6A4A] hover:underline font-bold uppercase transition-all">Weave Textiles Now →</a>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* GALLERY CAROUSEL */}
          <GalleryCarousel slides={data?.carouselSlides || []} />

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
          {data?.header.showEvents !== false && (
            <section className="bg-warm-white py-24 px-[5vw]" id="events">
              <div className="max-w-7xl mx-auto space-y-12">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-6 border-b border-sand/20">
                  <div>
                    <div className="label">{data?.header.eventsLabel || "Upcoming Sessions"}</div>
                    <h2
                      className="font-serif text-3xl sm:text-5xl font-light text-charcoal"
                      dangerouslySetInnerHTML={{ __html: data?.header.eventsTitle || "What's <span class=\"text-clay italic\">On</span>" }}
                    />
                    {data?.header.eventsSubTitle && (
                      <p className="text-charcoal/60 text-xs mt-2 max-w-md font-sans leading-relaxed">
                        {data.header.eventsSubTitle}
                      </p>
                    )}
                  </div>
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

                        <div className="pt-3 border-t border-sand/10 flex items-center justify-between gap-2">
                          <div className="text-[10px] text-charcoal/50 flex gap-2 font-mono">
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {evItem.time}</span>
                            <span>·</span>
                            <span>{evItem.audience}</span>
                          </div>
                          
                          <button
                            onClick={() => handleShareEvent(evItem.title, evItem.day, evItem.month)}
                            className="text-[#cb6a4a] hover:text-terracotta p-1 hover:bg-[#cb6a4a]/5 rounded transition-all flex items-center gap-1 text-[10px] font-mono font-medium cursor-pointer border border-[#cb6a4a]/10"
                            title="Share/Copy Invite Details"
                          >
                            <Share2 className="w-3.5 h-3.5" /> Share
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

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
                  <li>
                    <a
                      href="/schools"
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo('/schools');
                      }}
                      className="hover:text-clay transition-colors text-left cursor-pointer"
                    >
                      Schools
                    </a>
                  </li>
                  <li>
                    <a
                      href="/corporate"
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo('/corporate');
                      }}
                      className="hover:text-clay transition-colors text-left cursor-pointer"
                    >
                      Corporate
                    </a>
                  </li>
                  <li><button onClick={() => triggerBooking('general')} className="hover:text-clay transition-colors text-left cursor-pointer">Inquire Custom Spot</button></li>
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
                {data?.header.socialLinkedin && (
                  <a href={data.header.socialLinkedin} target="_blank" rel="noreferrer" className="hover:text-clay transition-colors">LinkedIn</a>
                )}
                {data?.header.customSocials && data.header.customSocials.map((social) => (
                  <a key={social.id} href={social.url} target="_blank" rel="noreferrer" className="hover:text-clay transition-colors">{social.name}</a>
                ))}
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

      {/* BACKGROUND MUSIC DYNAMIC FLOATING WIDGET */}
      {data?.header?.audioUrl && !data?.header?.hideMusicPlayer && (
        !isMusicPlayerHiddenByVisitor ? (
          <div 
            className="fixed bottom-6 left-6 md:left-8 z-45 bg-[#120b06]/95 border border-sand/30 shadow-2xl pl-3 pr-4 py-2.5 rounded-full flex items-center gap-3 backdrop-blur-md transition-all duration-300 select-none hover:border-clay group"
            id="ambient-music-floating-capsule"
          >
            {/* <audio> element definition */}
            <audio ref={audioRef} loop className="hidden" />

            {/* Equalizer animation and Play/Pause trigger */}
            <button
              onClick={() => {
                const audio = audioRef.current;
                if (!audio) return;
                if (isAudioPlaying) {
                  audio.pause();
                  setIsAudioPlaying(false);
                } else {
                  audio.play()
                    .then(() => setIsAudioPlaying(true))
                    .catch(() => alert("Click page first to allow music playback."));
                }
              }}
              className="w-10 h-10 rounded-full bg-clay hover:bg-clay/90 text-white flex items-center justify-center cursor-pointer transition-all shrink-0 hover:scale-[1.05] relative shadow-md shadow-clay/20 border-0"
              title={isAudioPlaying ? "Pause ambient sound" : "Play ambient sound"}
            >
              {isAudioPlaying ? (
                <div className="flex items-end justify-center gap-[2.5px] w-4 h-4 overflow-hidden">
                  <span className="w-[2.5px] bg-white rounded-full anim-eq-1"></span>
                  <span className="w-[2.5px] bg-white rounded-full anim-eq-2"></span>
                  <span className="w-[2.5px] bg-white rounded-full anim-eq-3"></span>
                  <span className="w-[2.5px] bg-white rounded-full anim-eq-4"></span>
                </div>
              ) : (
                <Play className="w-4 h-4 fill-white text-white ml-0.5" />
              )}
            </button>

            {/* Title and sliders */}
            <div className="flex flex-col min-w-[100px] max-w-[130px] sm:max-w-[160px] overflow-hidden">
              <span className="text-[9px] tracking-wider uppercase font-mono font-bold text-clay/90 block">
                Ambient Audio
              </span>
              <span className="text-[11px] font-sans text-white/90 truncate font-medium block leading-tight" title={data.header.audioTitle}>
                {data.header.audioTitle || "Tribal Rhythm"}
              </span>
            </div>

            <div className="h-6 w-[1px] bg-sand/15 shrink-0" />

            {/* Mute/Volume action slider container */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsAudioMuted(!isAudioMuted);
                }}
                className="text-white/60 hover:text-clay p-1 cursor-pointer transition-colors shrink-0 bg-transparent border-0"
                title={isAudioMuted ? "Unmute" : "Mute"}
              >
                {isAudioMuted || audioVolume === 0 ? (
                  <VolumeX className="w-4 h-4 text-clay" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>

              {/* Slider with state sync */}
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isAudioMuted ? 0 : audioVolume}
                onChange={(e) => {
                  const vol = parseFloat(e.target.value);
                  setAudioVolume(vol);
                  if (vol > 0 && isAudioMuted) {
                    setIsAudioMuted(false);
                  }
                }}
                className="w-12 sm:w-16 h-[3px] accent-clay bg-white/20 rounded-lg cursor-pointer h-1 outline-none transition-all group-hover:w-16 sm:group-hover:w-20"
                style={{ background: `linear-gradient(to right, #CB6A4A 0%, #CB6A4A ${isAudioMuted ? 0 : audioVolume * 100}%, rgba(255,255,255,0.2) ${isAudioMuted ? 0 : audioVolume * 100}%, rgba(255,255,255,0.2) 100%)` }}
                title={`Volume: ${Math.round((isAudioMuted ? 0 : audioVolume) * 100)}%`}
              />
            </div>

            <div className="h-6 w-[1px] bg-sand/15 shrink-0" />

            {/* Interactive Close handle */}
            <button
              onClick={() => {
                setIsMusicPlayerHiddenByVisitor(true);
                try {
                  setIsAudioPlaying(false);
                  audioRef.current?.pause();
                } catch (e) {
                  console.warn(e);
                }
              }}
              className="text-white/40 hover:text-[#CB6A4A] hover:bg-white/10 p-1.5 rounded-full cursor-pointer transition-colors border-0 shrink-0"
              title="Hide Music Player"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsMusicPlayerHiddenByVisitor(false)}
            className="fixed bottom-6 left-6 md:left-8 z-45 bg-[#120b06]/95 border border-sand/30 shadow-2xl p-3 rounded-full flex items-center justify-center text-clay hover:text-white hover:border-clay cursor-pointer transition-all duration-300 hover:scale-105"
            title="Restore Music Player"
          >
            <Music className="w-4 h-4 text-clay animate-pulse" />
          </button>
        )
      )}

      {/* FLOATING WHATSAPP CHAT BUTTON */}
      {data?.header?.showWhatsApp && data?.header?.whatsAppNumber && (
        <a
          href={`https://wa.me/${data.header.whatsAppNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(data.header.whatsAppMessage || "Hello! I am getting in touch from the Afro Baobab Hub website.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 md:right-8 z-45 bg-[#25D366] hover:bg-[#20BA56] text-white shadow-[0_4px_30px_rgba(37,211,102,0.35)] px-4 py-2.5 rounded-full flex items-center gap-2 backdrop-blur-md transition-all duration-300 select-none hover:scale-105 active:scale-95 group border border-white/10"
          id="whatsapp-chat-floating-button"
          title="Chat on WhatsApp"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-xs font-sans font-semibold tracking-wide text-white font-serif">
            WhatsApp Chat
          </span>
        </a>
      )}

      {/* Toast Notification Portal */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-5 md:right-8 z-55 bg-[#120b06] border border-[#cb6a4a]/30 text-white py-3 px-4 rounded-[2px] shadow-2xl flex items-center gap-3 max-w-sm backdrop-blur-md"
          >
            <div className="bg-[#cb6a4a]/10 p-1.5 rounded-full border border-[#cb6a4a]/20 text-[#cb6a4a] shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="flex-grow">
              <p className="text-[9px] font-mono tracking-widest uppercase text-white/40 font-bold">HUB MESSAGE</p>
              <p className="text-xs font-sans font-medium text-white/90 leading-tight mt-0.5">{toastMessage}</p>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-white/40 hover:text-[#cb6a4a] p-1 rounded-full cursor-pointer transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
