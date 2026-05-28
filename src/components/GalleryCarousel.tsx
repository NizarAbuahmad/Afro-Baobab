import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CarouselSlide as DbCarouselSlide } from "../types";

interface CarouselSlide {
  candidates: string[];
  title: string;
  desc: string;
}

interface GalleryCarouselProps {
  title?: string;
  titleHighlight?: string;
  slides?: DbCarouselSlide[];
}

const GALLERY_SLIDES: CarouselSlide[] = [
  {
    candidates: [
      "/uploads/gallery-1.png",
      "/uploads/gallery-1.jpg",
      "/uploads/gallery-1.jpeg",
      "/uploads/carousel-1.png",
      "/uploads/carousel-1.jpg",
      "/uploads/carousel-1.jpeg",
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1400&q=80"
    ],
    title: "African Rhythms & Dance Performance",
    desc: "Capturing the vibrant pulse of seasonal celebratory dance, rhythm loops, and performance art."
  },
  {
    candidates: [
      "/uploads/gallery-2.png",
      "/uploads/gallery-2.jpg",
      "/uploads/gallery-2.jpeg",
      "/uploads/carousel-2.png",
      "/uploads/carousel-2.jpg",
      "/uploads/carousel-2.jpeg",
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1400&q=80"
    ],
    title: "Interactive Drumming Circles",
    desc: "Curated workshops teaching coordinating pulse, hand position, and tempo under our master percussion team."
  },
  {
    candidates: [
      "/uploads/gallery-3.png",
      "/uploads/gallery-3.jpg",
      "/uploads/gallery-3.jpeg",
      "/uploads/carousel-3.png",
      "/uploads/carousel-3.jpg",
      "/uploads/carousel-3.jpeg",
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1400&q=80"
    ],
    title: "Clay Pottery & Sculpting",
    desc: "Moulding raw clay into symbolic traditional artifacts and geometrical vessel layouts."
  },
  {
    candidates: [
      "/uploads/gallery-4.png",
      "/uploads/gallery-4.jpg",
      "/uploads/gallery-4.jpeg",
      "/uploads/carousel-4.png",
      "/uploads/carousel-4.jpg",
      "/uploads/carousel-4.jpeg",
      "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=1400&q=80"
    ],
    title: "Intricate Sacred Bead Threading",
    desc: "Participants explore symmetrical design and ethnic lore by assembling gorgeous glass beads."
  },
  {
    candidates: [
      "/uploads/gallery-5.png",
      "/uploads/gallery-5.jpg",
      "/uploads/gallery-5.jpeg",
      "/uploads/carousel-5.png",
      "/uploads/carousel-5.jpg",
      "/uploads/carousel-5.jpeg",
      "https://images.unsplash.com/photo-1543731068-7e0f5beff43a?auto=format&fit=crop&w=1400&q=80"
    ],
    title: "Authentic Djembe Courtyards",
    desc: "Hundreds of hand-carved West African djembes lining our lush green villa lawns in Dubai."
  }
];

export default function GalleryCarousel({ title = "Immersive Hub Gallery", titleHighlight = "Carousel", slides }: GalleryCarouselProps) {
  const activeSlides = useMemo(() => {
    return (slides && slides.length > 0)
      ? slides.map(s => {
          const list: string[] = [];
          if (s.imageUrl) {
            list.push(s.imageUrl);
          }
          // Fallbacks as safety
          list.push("https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1400&q=80");
          return {
            candidates: list,
            title: s.title,
            desc: s.desc
          };
        })
      : GALLERY_SLIDES;
  }, [slides]);

  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [candidateIndices, setCandidateIndices] = useState<number[]>([]);

  // Sync candidateIndices length and contents when activeSlides length changes
  const activeSlidesLength = activeSlides.length;
  useEffect(() => {
    setCandidateIndices((prev) => {
      if (prev.length === activeSlidesLength) return prev;
      return activeSlides.map(() => 0);
    });
    setIndex((prevIndex) => {
      if (prevIndex >= activeSlidesLength) return 0;
      return prevIndex;
    });
  }, [activeSlidesLength]);

  useEffect(() => {
    if (!isPlaying || activeSlidesLength === 0) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % activeSlidesLength);
    }, 5500);

    return () => clearInterval(interval);
  }, [isPlaying, activeSlidesLength]);

  const handleNext = () => {
    if (activeSlides.length === 0) return;
    setIndex((prev) => (prev + 1) % activeSlides.length);
  };

  const handlePrev = () => {
    if (activeSlides.length === 0) return;
    setIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const handleImageError = (slideIdx: number) => {
    setCandidateIndices((prev) => {
      const next = [...prev];
      if (next[slideIdx] !== undefined && next[slideIdx] < activeSlides[slideIdx].candidates.length - 1) {
        next[slideIdx] += 1;
      }
      return next;
    });
  };

  return (
    <section className="bg-charcoal text-white py-24 px-[5vw] relative overflow-hidden" id="gallery-carousel">
      {/* Dynamic background lighting orb */}
      <div className="absolute w-[400px] h-[400px] rounded-full bg-clay/5 bottom-[-100px] right-[-100px] blur-3xl pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-6 border-b border-white/15">
          <div>
            <span className="text-clay/60 text-[10px] tracking-widest uppercase font-mono font-bold block mb-1">Interactive Showcase</span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light text-white leading-none">
              {title} <span className="text-clay italic font-normal">{titleHighlight}</span>
            </h2>
            <p className="text-white/45 text-xs font-sans mt-2 max-w-md leading-relaxed">
              Slide and explore real moments, crafts, and interactive educational workspaces within our Dubai villa grounds.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 sm:p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/60 hover:text-white transition-all cursor-pointer flex items-center justify-center"
              title={isPlaying ? "Pause Slideshow" : "Resume Slideshow"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-clay" />}
            </button>
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 p-1 rounded-full">
              <button
                onClick={handlePrev}
                className="p-1.5 hover:bg-white/10 rounded-full text-white/50 hover:text-clay transition-all cursor-pointer"
                title="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-1.5 hover:bg-white/10 rounded-full text-white/50 hover:text-clay transition-all cursor-pointer"
                title="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Visual Frame */}
        <div className="relative h-[280px] sm:h-[480px] w-full bg-[#1b1510] border border-white/10 rounded-[3px] overflow-hidden group/frame shadow-xl clay-inset-border">
          {activeSlides.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 1.015 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.985 }}
                transition={{ duration: 0.65, ease: "easeInOut" }}
                className="absolute inset-0 select-none overflow-hidden"
              >
                <img
                  src={activeSlides[index]?.candidates?.[candidateIndices[index] || 0] || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1400&q=80"}
                  alt={activeSlides[index]?.title || ""}
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={() => handleImageError(index)}
                />
                {/* Overlay Linear Gradient */}
                <div 
                  className="absolute inset-0"
                  style={{
                    backgroundImage: "linear-gradient(rgba(10, 8, 6, 0.25), rgba(10, 8, 6, 0.82))"
                  }}
                />
                {/* Overlay Content layout */}
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-12 flex flex-col justify-end space-y-3 max-w-2xl bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <span className="text-[10px] tracking-[0.3em] text-clay uppercase font-mono font-bold block mb-1">
                    ✦ Slide {index + 1} of {activeSlides.length}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-4xl font-light text-white tracking-tight leading-tight">
                    {activeSlides[index]?.title || ""}
                  </h3>
                  <p className="text-white/70 text-xs sm:text-sm font-light font-sans leading-relaxed max-w-xl">
                    {activeSlides[index]?.desc || ""}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Quick Slider control chevrons directly on images */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/35 hover:bg-clay backdrop-blur-sm text-white/70 hover:text-white transition-all select-none opacity-0 group-hover/frame:opacity-100 z-10 cursor-pointer hidden sm:block"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/35 hover:bg-clay backdrop-blur-sm text-white/70 hover:text-white transition-all select-none opacity-0 group-hover/frame:opacity-100 z-10 cursor-pointer hidden sm:block"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Hand-woven geometric overlay at base of frames */}
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[radial-gradient(#CB6A4A_1px,transparent_1px)] bg-[size:8px_3px] opacity-60 z-10"></div>
        </div>

        {/* Bullet Progress indicators */}
        <div className="flex justify-center items-center gap-2.5">
          {activeSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 transition-all rounded-full cursor-pointer ${
                index === i ? "w-8 bg-clay" : "w-2.5 bg-white/20 hover:bg-white/40"
              }`}
              title={`Jump to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
