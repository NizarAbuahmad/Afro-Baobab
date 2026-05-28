import React, { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ArrowDown, ChevronRight, Mail, Instagram, Linkedin, Facebook } from "lucide-react";
import { CmsHeader } from "../types";

interface ComingSoonProps {
  navigateTo: (path: string) => void;
  header?: CmsHeader;
}

export default function ComingSoonBaobabPage({ navigateTo, header }: ComingSoonProps) {
  // Extract CMS or Default strings
  const eyebrow = header?.csHeroEyebrow || "Dubai · Opening September 2026";
  const headline = header?.csHeroHeadline || "Where culture becomes<br><em>something you feel</em>";
  const sub = header?.csHeroSub || "An immersive cultural hub designed for curiosity, creativity, and human connection — through storytelling, rhythm, movement, and shared experience.";
  const targetDateStr = header?.csTargetDate || "2026-09-01T10:00:00";
  const sectionLabel = header?.csSectionLabel || "What awaits you";
  const sectionTitle = header?.csSectionTitle || "A living space where culture is experienced, not observed";
  
  const exp1Title = header?.csExp1Title || "Storytelling & Exhibitions";
  const exp1Desc = header?.csExp1Desc || "Rotating cultural exhibitions and immersive storytelling environments that invite participation and emotional discovery.";
  
  const exp2Title = header?.csExp2Title || "Rhythm & Movement";
  const exp2Desc = header?.csExp2Desc || "Live drumming, music, and movement experiences that connect through sound and shared physical expression.";
  
  const exp3Title = header?.csExp3Title || "Creative Workshops";
  const exp3Desc = header?.csExp3Desc || "Hands-on experiences in mask-making, jewellery, visual arts, poetry, and cultural craft — for all ages and backgrounds.";
  
  const exp4Title = header?.csExp4Title || "Connection & Community";
  const exp4Desc = header?.csExp4Desc || "Gatherings, corporate experiences, school programmes, and cultural events designed to bridge backgrounds and generations.";
  
  const quoteText = header?.csQuoteText || "Some experiences are remembered because they are seen. Others are remembered because they are felt. This is the kind of space we are building.";
  const quoteAttr = header?.csQuoteAttr || "The Afro Baobab Vision";

  // State managers
  const [email, setEmail] = useState("");
  const [interestTags, setInterestTags] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Countdown timer calculations
  const [timeLeft, setTimeLeft] = useState({
    days: "000",
    hours: "00",
    mins: "00",
    secs: "00"
  });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(targetDateStr).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (isNaN(target) || diff <= 0) {
        setTimeLeft({ days: "000", hours: "00", mins: "00", secs: "00" });
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(d).padStart(3, "0"),
        hours: String(h).padStart(2, "0"),
        mins: String(m).padStart(2, "0"),
        secs: String(s).padStart(2, "0")
      });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDateStr]);

  // Support interest tag toggle
  const toggleInterestTag = (tag: string) => {
    if (interestTags.includes(tag)) {
      setInterestTags(interestTags.filter(t => t !== tag));
    } else {
      setInterestTags([...interestTags, tag]);
    }
  };

  // Submit Founding Circle Notification Form
  const handleNotifySubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMessage("Please supply a valid email address.");
      return;
    }
    setErrorMessage("");
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#1a0d07] text-[#F7F4EF] selection:bg-[#A7522C] selection:text-[#F7F4EF] relative overflow-x-hidden font-sans pt-16">
      
      {/* Dynamic Floating Particles simulation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        {[...Array(18)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-[#A7522C] rounded-full opacity-0 animate-float"
            style={{
              width: `${Math.random() * 2.5 + 0.8}px`,
              height: `${Math.random() * 2.5 + 0.8}px`,
              left: `${Math.random() * 100}%`,
              bottom: "-10px",
              animationDuration: `${Math.random() * 18 + 12}s`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Hero Workspace Segment */}
      <section id="hero" className="relative min-h-[95vh] flex flex-col items-center justify-center text-center px-6 sm:px-12 py-20 z-10">
        
        {/* Giant native watermark baobab tree background */}
        <div className="absolute bottom-[-5%] left-1/2 -translate-x-1/2 w-[700px] max-w-full opacity-[0.03] pointer-events-none z-0">
          <svg viewBox="0 0 400 420" xmlns="http://www.w3.org/2000/svg" className="fill-[#F7F4EF]">
            <rect x="180" y="250" width="40" height="130" rx="20"/>
            <path d="M180 370 Q140 400 100 390" stroke="#F7F4EF" strokeWidth="12" fill="none" strokeLinecap="round"/>
            <path d="M220 370 Q260 400 300 390" stroke="#F7F4EF" strokeWidth="12" fill="none" strokeLinecap="round"/>
            <path d="M200 250 Q150 200 100 160 Q150 150 180 190"/>
            <path d="M200 250 Q250 200 300 160 Q250 150 220 190"/>
            <path d="M200 230 Q160 160 155 80 Q185 110 200 190"/>
            <path d="M200 230 Q240 160 245 80 Q215 110 200 190"/>
            <path d="M200 225 Q130 190 90 120 Q140 130 190 190"/>
            <path d="M200 225 Q270 190 310 120 Q260 130 210 190"/>
            <ellipse cx="200" cy="85" rx="70" ry="55"/>
            <ellipse cx="140" cy="120" rx="55" ry="42"/>
            <ellipse cx="260" cy="120" rx="55" ry="42"/>
            <ellipse cx="95" cy="160" rx="44" ry="36"/>
            <ellipse cx="305" cy="160" rx="44" ry="36"/>
          </svg>
        </div>

        {/* Elegant pulsing line accent */}
        <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-[#A7522C] to-transparent mb-12 animate-pulse" />

        <p className="font-sans text-[10px] sm:text-xs font-semibold tracking-[0.45em] text-[#C87B4E] uppercase mb-6 relative z-10">
          {eyebrow}
        </p>

        <h1 
          className="font-serif text-5xl sm:text-7xl font-light text-[#F7F4EF] leading-tight max-w-4xl tracking-tight mb-8 relative z-10"
          dangerouslySetInnerHTML={{ __html: headline }}
        />

        <p className="font-sans font-light text-sm sm:text-base text-[#F7F4EF]/70 leading-relaxed max-w-lg mb-16 relative z-10">
          {sub}
        </p>

        {/* Countdowns grid ticking dynamically */}
        <div className="relative z-10 mb-20">
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#C87B4E] mb-6 font-medium">Opening in</p>
          <div className="flex gap-2 sm:gap-4 justify-center items-end select-none font-mono">
            <div className="flex flex-col items-center min-w-[70px] sm:min-w-[88px]">
              <span className="font-serif text-4xl sm:text-7xl font-light mb-2 border-b border-[#F7F4EF]/15 pb-2 min-w-full text-center tracking-normal">
                {timeLeft.days}
              </span>
              <span className="text-[8px] sm:text-[9px] tracking-[0.35em] text-[#F7F4EF]/60 uppercase font-sans">Days</span>
            </div>
            
            <span className="font-serif text-3xl sm:text-5xl text-[#A7522C] opacity-60 pb-5 leading-none animate-pulse">:</span>
            
            <div className="flex flex-col items-center min-w-[60px] sm:min-w-[80px]">
              <span className="font-serif text-4xl sm:text-7xl font-light mb-2 border-b border-[#F7F4EF]/15 pb-2 min-w-full text-center tracking-normal">
                {timeLeft.hours}
              </span>
              <span className="text-[8px] sm:text-[9px] tracking-[0.35em] text-[#F7F4EF]/60 uppercase font-sans">Hours</span>
            </div>

            <span className="font-serif text-3xl sm:text-5xl text-[#A7522C] opacity-60 pb-5 leading-none animate-pulse">:</span>

            <div className="flex flex-col items-center min-w-[60px] sm:min-w-[80px]">
              <span className="font-serif text-4xl sm:text-7xl font-light mb-2 border-b border-[#F7F4EF]/15 pb-2 min-w-full text-center tracking-normal">
                {timeLeft.mins}
              </span>
              <span className="text-[8px] sm:text-[9px] tracking-[0.35em] text-[#F7F4EF]/60 uppercase font-sans">Minutes</span>
            </div>

            <span className="font-serif text-3xl sm:text-5xl text-[#A7522C] opacity-60 pb-5 leading-none animate-pulse">:</span>

            <div className="flex flex-col items-center min-w-[60px] sm:min-w-[80px]">
              <span className="font-serif text-4xl sm:text-7xl font-light mb-2 border-b border-[#F7F4EF]/15 pb-2 min-w-full text-center tracking-normal">
                {timeLeft.secs}
              </span>
              <span className="text-[8px] sm:text-[9px] tracking-[0.35em] text-[#F7F4EF]/60 uppercase font-sans">Seconds</span>
            </div>
          </div>
          <p className="text-[9px] tracking-[0.3em] font-medium uppercase text-[#F7F4EF]/30 mt-6 font-sans">Target Date: {new Date(targetDateStr).toLocaleDateString()} — Dubai</p>
        </div>

        {/* Scroll cue layout element */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#F7F4EF]/40 font-mono text-[9px] tracking-[0.3em] uppercase select-none">
          <span>Discover</span>
          <div className="w-[1px] h-11 bg-gradient-to-b from-[#A7522C] to-transparent animate-bounce mt-1" />
        </div>
      </section>

      {/* Elegant faded content separator line */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#F7F4EF]/10 to-transparent" />

      {/* EXPERIENCE ZONES SECTION */}
      <section id="experiences" className="relative px-6 sm:px-12 py-24 bg-[#301C11] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#A7522C]/5 to-transparent pointer-events-none" />
        
        <div className="max-w-6xl mx-auto space-y-16 relative z-10">
          <div className="text-center space-y-4 max-w-xl mx-auto">
            <p className="text-[9px] sm:text-[10px] font-semibold tracking-[0.45em] text-[#C87B4E] uppercase">{sectionLabel}</p>
            <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#F7F4EF] leading-tight italic">
              {sectionTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1 */}
            <div className="p-8 bg-white/[0.015] border border-[#F7F4EF]/5 hover:border-[#A7522C]/20 hover:bg-[#A7522C]/5 transition-all duration-300 relative group overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-[#A7522C] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
              <span className="font-serif text-sm font-semibold tracking-[0.2em] text-[#A7522C] block mb-8">01</span>
              <svg className="w-10 h-10 mb-6 text-[#A7522C] opacity-80" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 10 Q20 4 32 10 L32 28 Q20 34 8 28 Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <path d="M20 4 L20 34" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2" className="opacity-40"/>
                <circle cx="20" cy="19" r="2" fill="currentColor" className="opacity-60"/>
              </svg>
              <h3 className="font-serif text-xl font-normal text-[#F7F4EF] mb-3">{exp1Title}</h3>
              <p className="text-xs text-[#F7F4EF]/60 leading-relaxed font-light">{exp1Desc}</p>
            </div>

            {/* Card 2 */}
            <div className="p-8 bg-white/[0.015] border border-[#F7F4EF]/5 hover:border-[#A7522C]/20 hover:bg-[#A7522C]/5 transition-all duration-300 relative group overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-[#A7522C] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
              <span className="font-serif text-sm font-semibold tracking-[0.2em] text-[#A7522C] block mb-8">02</span>
              <svg className="w-10 h-10 mb-6 text-[#A7522C] opacity-80" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="24" r="7" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <circle cx="28" cy="24" r="7" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <path d="M12 10 L12 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M28 10 L28 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M12 8 Q20 5 28 8" stroke="currentColor" strokeWidth="1" fill="none" className="opacity-50"/>
              </svg>
              <h3 className="font-serif text-xl font-normal text-[#F7F4EF] mb-3">{exp2Title}</h3>
              <p className="text-xs text-[#F7F4EF]/60 leading-relaxed font-light">{exp2Desc}</p>
            </div>

            {/* Card 3 */}
            <div className="p-8 bg-white/[0.015] border border-[#F7F4EF]/5 hover:border-[#A7522C]/20 hover:bg-[#A7522C]/5 transition-all duration-300 relative group overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-[#A7522C] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
              <span className="font-serif text-sm font-semibold tracking-[0.2em] text-[#A7522C] block mb-8">03</span>
              <svg className="w-10 h-10 mb-6 text-[#A7522C] opacity-80" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="6" y="14" width="18" height="22" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <path d="M14 14 L14 8 Q20 5 26 8 L26 14" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <path d="M10 20 L20 20 M10 25 L18 25" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className="opacity-60"/>
                <circle cx="30" cy="30" r="6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <path d="M28 30 L30 32 L34 27" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h3 className="font-serif text-xl font-normal text-[#F7F4EF] mb-3">{exp3Title}</h3>
              <p className="text-xs text-[#F7F4EF]/60 leading-relaxed font-light">{exp3Desc}</p>
            </div>

            {/* Card 4 */}
            <div className="p-8 bg-white/[0.015] border border-[#F7F4EF]/5 hover:border-[#A7522C]/20 hover:bg-[#A7522C]/5 transition-all duration-300 relative group overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-[#A7522C] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
              <span className="font-serif text-sm font-semibold tracking-[0.2em] text-[#A7522C] block mb-8">04</span>
              <svg className="w-10 h-10 mb-6 text-[#A7522C] opacity-80" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 28 Q14 20 20 22 Q26 24 32 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                <circle cx="12" cy="14" r="5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <circle cx="28" cy="14" r="5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <line x1="17" y1="14" x2="23" y2="14" stroke="currentColor" strokeWidth="1" strokeDasharray="1.5 1.5"/>
              </svg>
              <h3 className="font-serif text-xl font-normal text-[#F7F4EF] mb-3">{exp4Title}</h3>
              <p className="text-xs text-[#F7F4EF]/60 leading-relaxed font-light">{exp4Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Elegant faded content separator line */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#F7F4EF]/10 to-transparent" />

      {/* THEMES & CONTENT PILLARS */}
      <section id="pillars" className="relative py-24 px-6 sm:px-12 bg-[#1a0d07] overflow-hidden">
        {/* Decorative tribal dot grid matrix */}
        <div className="absolute right-10 top-10 opacity-15 select-none text-[#C87B4E] font-mono text-xs tracking-widest leading-none pointer-events-none">
          ✦ ✦ ✦ ✦ ✦<br/>
          ✦ ✦ ✦ ✦ ✦<br/>
          ✦ ✦ ✦ ✦ ✦<br/>
          ✦ ✦ ✦ ✦ ✦<br/>
        </div>
        
        <div className="max-w-6xl mx-auto space-y-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Info Column */}
            <div className="lg:col-span-12 xl:col-span-5 space-y-6">
              <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.45em] text-[#C87B4E] uppercase block">
                The Foundation
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl font-light text-[#F7F4EF] leading-tight">
                Themes &amp;<br/>
                <span className="italic text-[#C87B4E]">Content Pillars</span>
              </h2>
              <p className="text-sm font-light text-[#F7F4EF]/70 leading-relaxed max-w-md">
                Our hub is structured around five strategic content pillars. Together, they guide every storytelling room, rhythm workshop, creative residency, and cultural experience.
              </p>
              
              {/* Symbolic motif container */}
              <div className="pt-6 hidden lg:block">
                <div className="inline-flex gap-1.5 items-center opacity-30 text-[#F7F4EF] font-mono text-[9px] tracking-[0.3em]">
                  <span>▲</span>
                  <span>▼</span>
                  <span>▲</span>
                  <span className="text-xs">✦</span>
                  <span>▼</span>
                  <span>▲</span>
                  <span>▼</span>
                </div>
              </div>
            </div>

            {/* Right Pillars List Column */}
            <div className="lg:col-span-12 xl:col-span-7 space-y-4">
              {[
                {
                  id: "01",
                  title: "JOURNEY",
                  desc: "Experiences that transform.",
                  color: "bg-[#713f27] text-[#FAF8F4]",
                  svg: (
                    <svg className="w-6 h-6 text-[#E7D6BA]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10" strokeDasharray="3 3" />
                      <circle cx="12" cy="12" r="5" strokeDasharray="1.5 1.5" />
                      <path d="M12 2v20M2 12h20" strokeLinecap="round" opacity="0.3" />
                      <circle cx="12" cy="12" r="2" fill="currentColor" />
                    </svg>
                  )
                },
                {
                  id: "02",
                  title: "STORIES",
                  desc: "Sharing voices, history and wisdom.",
                  color: "bg-[#1F2A44] text-[#FAF8F4]",
                  svg: (
                    <svg className="w-6 h-6 text-[#FAF8F4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M2 10q5-4 10 0t10 0" strokeLinecap="round" />
                      <path d="M2 14q5-4 10 0t10 0" strokeLinecap="round" opacity="0.7" />
                      <path d="M2 18q5-4 10 0t10 0" strokeLinecap="round" opacity="0.4" />
                    </svg>
                  )
                },
                {
                  id: "03",
                  title: "CREATIVITY",
                  desc: "Art, music, craft and expression.",
                  color: "bg-[#55624A] text-[#FAF8F4]",
                  svg: (
                    <svg className="w-6 h-6 text-[#E7D6BA]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="4" stroke="currentColor" />
                      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeDasharray="2 2" />
                      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                    </svg>
                  )
                },
                {
                  id: "04",
                  title: "COMMUNITY",
                  desc: "People, connection and belonging.",
                  color: "bg-[#CB6A4A] text-[#FAF8F4]",
                  svg: (
                    <svg className="w-6 h-6 text-[#FAF8F4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 00-3-3.87" />
                      <path d="M16 3.13a4 4 0 010 7.75" />
                    </svg>
                  )
                },
                {
                  id: "05",
                  title: "HERITAGE",
                  desc: "Rooted in culture, inspired by tomorrow.",
                  color: "bg-[#0a0604] border border-[#F7F4EF]/25 text-[#FAF8F4]",
                  svg: (
                    <svg className="w-6 h-6 text-[#FAF8F4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="1" />
                      <path d="M3 12h18M12 3v18M3 3l18 18M21 3L3 21" strokeLinecap="round" opacity="0.5" />
                    </svg>
                  )
                }
              ].map((p, idx) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="flex items-center gap-5 p-4 sm:p-5 bg-white/[0.012] border border-[#F7F4EF]/5 hover:border-[#C87B4E]/30 bg-[#301C11]/30 hover:bg-[#A7522C]/5 transition-all rounded-[3px] group"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${p.color} shadow-md`}>
                    {p.svg}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-baseline gap-2.5">
                      <span className="font-mono text-[9px] tracking-wider text-[#C87B4E] font-medium">{p.id}</span>
                      <h4 className="font-serif text-base tracking-wider font-semibold text-[#F7F4EF] uppercase group-hover:text-[#C87B4E] transition-colors">
                        {p.title}
                      </h4>
                    </div>
                    <p className="text-xs text-[#F7F4EF]/60 leading-normal font-light mt-1 font-sans">
                      {p.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Elegant faded content separator line */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#F7F4EF]/10 to-transparent" />

      {/* PHILOSOPHY QUOTE SEGMENT */}
      <section id="quote" className="relative py-28 px-6 sm:px-12 bg-[#1a0d07] text-center overflow-hidden">
        {/* Subtle large quotation watermark */}
        <div className="absolute top-[-30px] left-1/2 -translate-x-1/2 text-[320px] font-serif font-light text-[#A7522C] opacity-5 pointer-events-none select-none leading-none">
          “
        </div>
        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <p className="font-serif text-xl sm:text-3xl font-light italic leading-relaxed text-[#F7F4EF]">
            "{quoteText}"
          </p>
          <p className="font-sans text-[10px] sm:text-xs font-semibold tracking-[0.35em] uppercase text-[#C87B4E]">
            — {quoteAttr}
          </p>
        </div>
      </section>

      {/* Elegant faded content separator line */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#F7F4EF]/10 to-transparent" />

      {/* CULTURAL AUDIENCE GRID ("WHO IT'S FOR") */}
      <section id="for-you" className="px-6 sm:px-12 py-24 bg-[#301C11]">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <p className="text-[9px] sm:text-[10px] font-semibold tracking-[0.45em] text-[#C87B4E] uppercase">A space for</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#F7F4EF]">
              Everyone who believes culture should be <span className="italic">lived</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-1 border border-[#F7F4EF]/5 bg-[#F7F4EF]/5 overflow-hidden">
            <div className="p-8 text-center bg-[#301C11] hover:bg-[#A7522C]/5 transition-colors duration-300 flex flex-col items-center justify-center space-y-4">
              <span className="text-3xl select-none">🎒</span>
              <span className="text-[9px] font-semibold tracking-[0.3em] uppercase text-[#F7F4EF]/60">Schools</span>
              <p className="font-serif italic text-sm text-[#F7F4EF]">Learning beyond classroom borders</p>
            </div>

            <div className="p-8 text-center bg-[#301C11] hover:bg-[#A7522C]/5 transition-colors duration-300 flex flex-col items-center justify-center space-y-4">
              <span className="text-3xl select-none">🌿</span>
              <span className="text-[9px] font-semibold tracking-[0.3em] uppercase text-[#F7F4EF]/60">Families</span>
              <p className="font-serif italic text-sm text-[#F7F4EF]">Shared ancestral discovery together</p>
            </div>

            <div className="p-8 text-center bg-[#301C11] hover:bg-[#A7522C]/5 transition-colors duration-300 flex flex-col items-center justify-center space-y-4">
              <span className="text-3xl select-none">🏛️</span>
              <span className="text-[9px] font-semibold tracking-[0.3em] uppercase text-[#F7F4EF]/60">Corporates</span>
              <p className="font-serif italic text-sm text-[#F7F4EF]">True connection through team experiences</p>
            </div>

            <div className="p-8 text-center bg-[#301C11] hover:bg-[#A7522C]/5 transition-colors duration-300 flex flex-col items-center justify-center space-y-4">
              <span className="text-3xl select-none">✦</span>
              <span className="text-[9px] font-semibold tracking-[0.3em] uppercase text-[#F7F4EF]/60">Artists</span>
              <p className="font-serif italic text-sm text-[#F7F4EF]">A living platform for creative voices</p>
            </div>

            <div className="p-8 text-center col-span-2 md:col-span-1 bg-[#301C11] hover:bg-[#A7522C]/5 transition-colors duration-300 flex flex-col items-center justify-center space-y-4">
              <span className="text-3xl select-none">🌍</span>
              <span className="text-[9px] font-semibold tracking-[0.3em] uppercase text-[#F7F4EF]/60">Curious Minds</span>
              <p className="font-serif italic text-sm text-[#F7F4EF]">Open and warm to anyone, always</p>
            </div>
          </div>
        </div>
      </section>

      {/* Elegant faded content separator line */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#F7F4EF]/10 to-transparent" />

      {/* INTEREST-INFUSED WHitelist NOTIFY SEGMENT */}
      <section id="notify" className="relative py-28 px-6 sm:px-12 bg-[#1a0d07] overflow-hidden text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(167,82,44,0.09)_0%,transparent_70%)] pointer-events-none" />
        <div className="max-w-xl mx-auto space-y-8 relative z-10">
          <p className="text-[9px] sm:text-[10px] font-semibold tracking-[0.45em] text-[#C87B4E] uppercase">Join the Founding Circle</p>
          <h2 className="font-serif text-4xl sm:text-6xl font-light text-[#F7F4EF]">Be among the first<br/>to step inside.</h2>
          <p className="text-xs sm:text-sm text-[#F7F4EF]/70 leading-relaxed font-light">
            We're building something unlike anything in Dubai. If culture, creativity, and human connection matter to you — we'd love to keep you close.
          </p>

          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="form-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <form onSubmit={handleNotifySubmit} className="flex flex-col sm:flex-row max-w-md mx-auto relative group">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="flex-1 bg-[#F7F4EF]/5 border border-[#F7F4EF]/20 focus:border-[#A7522C] text-sm text-[#F7F4EF] font-light px-5 py-4 outline-none rounded-t-[2px] sm:rounded-l-[2px] sm:rounded-tr-none border-b-0 sm:border-b sm:border-r-0 transition-colors placeholder:text-[#F7F4EF]/25"
                  />
                  <button
                    type="submit"
                    className="bg-[#A7522C] hover:bg-[#C87B4E] text-white text-[10px] font-semibold uppercase tracking-[0.3em] px-8 py-4 rounded-b-[2px] sm:rounded-r-[2px] sm:rounded-bl-none transition-colors cursor-pointer select-none"
                  >
                    Notify Me
                  </button>
                </form>

                {errorMessage && (
                  <p className="text-xs text-[#C87B4E] font-medium">{errorMessage}</p>
                )}

                <p className="text-[10px] font-light tracking-[0.1em] text-[#F7F4EF]/30">
                  No noise. Just meaningful moments when they happen.
                </p>

                {/* Interest Filter Tabs */}
                <div className="flex flex-wrap gap-2 justify-center pt-2">
                  {[
                    "School Programmes",
                    "Corporate Experiences",
                    "Family Visits",
                    "Cultural Events",
                    "Artist & Collaborations"
                  ].map((tag) => {
                    const isActive = interestTags.includes(tag);
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => toggleInterestTag(tag)}
                        className={`text-[9px] font-medium tracking-widest uppercase border transition-all duration-300 px-4 py-2 rounded-[1px] cursor-pointer select-none ${
                          isActive
                            ? "border-[#A7522C] text-[#C87B4E] bg-[#A7522C]/10"
                            : "border-[#F7F4EF]/15 text-[#F7F4EF]/60 hover:text-[#C87B4E] hover:border-[#A7522C]/40 bg-transparent"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success-container"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 border border-[#A7522C]/35 bg-[#A7522C]/5 rounded-[2px]"
              >
                <p className="font-serif text-2xl font-light italic text-[#C87B4E] mb-2">
                  Welcome to the circle. We'll be in touch.
                </p>
                <p className="text-xs text-[#F7F4EF]/60 font-sans">
                  We have registered <strong className="text-[#F7F4EF]">{email}</strong> on our alerts whitelist.
                  {interestTags.length > 0 && (
                    <span className="block mt-2">
                      Channels subscribed: <strong className="text-[#C87B4E]">{interestTags.join(", ")}</strong>
                    </span>
                  )}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail("");
                    setInterestTags([]);
                  }}
                  className="mt-6 border border-[#F7F4EF]/10 px-4 py-1.5 text-[9px] font-semibold tracking-widest uppercase text-[#F7F4EF]/50 hover:text-[#F7F4EF] rounded-[1px] transition-colors"
                >
                  Register Another Address
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* HOME LINK ACCENT */}
      <div className="flex justify-center pb-12 pt-4 relative z-10 bg-[#1a0d07]">
        <button
          onClick={() => navigateTo("/")}
          className="border border-[#F7F4EF]/15 hover:border-[#F7F4EF]/50 text-[#F7F4EF]/75 hover:text-[#F7F4EF] font-sans uppercase tracking-[0.25em] text-[10px] px-8 py-4.5 rounded-[1px] transition-all cursor-pointer flex items-center gap-2"
        >
          ↩ Return to Cultural Hub Home
        </button>
      </div>

      {/* FOOTER */}
      <footer className="py-14 bg-[#0a0604] relative z-10 flex flex-col items-center gap-6 text-center text-[#F7F4EF]/50 px-6 sm:px-12 border-t border-[#F7F4EF]/5">
        <p className="font-serif text-sm font-semibold uppercase tracking-[0.25em] text-[#F7F4EF]/35">
          Afro Baobab Cultural Hub
        </p>
        <p className="font-sans text-[9px] font-bold tracking-[0.5em] text-[#A7522C] uppercase opacity-80">
          Experience · Connect · Belong
        </p>

        <div className="flex flex-wrap justify-center gap-6 items-center py-2 font-sans font-normal text-[9px] tracking-[0.3em] uppercase">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#C87B4E] transition-colors">
            Instagram
          </a>
          <div className="w-[1px] h-3 bg-[#F7F4EF]/15" />
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#C87B4E] transition-colors">
            LinkedIn
          </a>
          <div className="w-[1px] h-3 bg-[#F7F4EF]/15" />
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#C87B4E] transition-colors">
            Facebook
          </a>
          <div className="w-[1px] h-3 bg-[#F7F4EF]/15" />
          <a href="mailto:hello@afrobaobab.com" className="hover:text-[#C87B4E] transition-colors font-medium">
            hello@afrobaobab.com
          </a>
        </div>

        <p className="font-sans text-[9px] font-light tracking-[0.3em] uppercase text-[#F7F4EF]/20 max-w-xs leading-relaxed">
          Dubai, United Arab Emirates · © 2026 Afro Baobab Cultural Hub
        </p>
      </footer>
    </div>
  );
}
