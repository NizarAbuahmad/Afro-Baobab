import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Motif {
  id: string;
  name: string;
  pronunciation: string;
  meaning: string;
  origin: string;
  proverb: string;
  description: string;
  svg: (color: string) => ReactNode;
}

export default function HeritageMotifs() {
  const [selectedId, setSelectedId] = useState("sankofa");
  const [stampColor, setStampColor] = useState("#CB6A4A"); // clay/orange
  const [patternDensity, setPatternDensity] = useState<"sparse" | "medium" | "dense">("medium");

  const colors = [
    { value: "#CB6A4A", name: "Ochre Clay" },
    { value: "#A64836", name: "Terracotta" },
    { value: "#E7D6BA", name: "Kalahari Sand" },
    { value: "#55624A", name: "Forest Moss" },
    { value: "#1F2A44", name: "Royal Indigo" },
  ];

  const motifs: Motif[] = [
    {
      id: "sankofa",
      name: "Sankofa",
      pronunciation: "Sahn-koh-fah",
      meaning: "Wisdom of Historical Patterns",
      origin: "Akan People of Ghana (Adinkra)",
      proverb: "\"Se wo were fi na wosankofa a yenkyi\"",
      description: "Literally meaning 'go back and fetch it.' Symbolized as a mythical bird with its head turned backward to take an egg from its spine. It represents the vital philosophy of honoring our heritage, learning from historical patterns, and harvesting past wisdom as we grow and move forward.",
      svg: (color) => (
        <svg viewBox="0 0 100 100" className="w-full h-full transition-colors duration-300" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="50" cy="50" r="44" strokeDasharray="3 4" opacity="0.25" strokeWidth="1" />
          <path d="M 68,58 C 72,55 75,46 72,38 C 69,30 60,25 50,30 C 42,34 32,32 30,22 C 34,20 40,22 45,26" />
          <path d="M 68,58 C 65,70 52,78 40,74 C 28,70 20,53 28,40 C 32,34 34,26 28,18 C 21,26 18,36 18,48 C 18,66 32,80 50,80 C 64,80 76,70 79,56" />
          <path d="M 28,18 C 29,15 32,15 34,16" />
          <circle cx="48" cy="27" r="5.5" fill={color} />
          <path d="M 55,42 Q 62,48 68,54" />
          <path d="M 50,48 Q 58,54 64,60" />
          <path d="M 45,54 Q 52,60 58,66" />
          <path d="M 48,74 L 46,84 M 52,74 L 54,84" />
        </svg>
      )
    },
    {
      id: "gyenyame",
      name: "Gye Nyame",
      pronunciation: "Jee Nya-meh",
      meaning: "Cosmic Unity & Resilience",
      origin: "Akan People of Ghana (Adinkra)",
      proverb: "\"Abode santann yi mu nsrahwe, Gye Nyame\"",
      description: "Meaning 'except God.' A beautiful asymmetrical symbol of divine guidance, ultimate cosmic unity, and deep human resilience. It is a visual cornerstone of West African patterns, celebrating that while structures change and life twisted pathways unfold, an overarching, universal force preserves balance and harmony.",
      svg: (color) => (
        <svg viewBox="0 0 100 100" className="w-full h-full transition-colors duration-300" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="50" cy="50" r="44" strokeDasharray="3 4" opacity="0.25" strokeWidth="1" />
          <circle cx="50" cy="50" r="10" strokeWidth="2" />
          <path d="M 15,50 L 85,50" strokeWidth="3" opacity="0.8" />
          <path d="M 50,22 C 32,22 30,38 30,50 C 30,62 32,78 50,78" strokeWidth="4.5" />
          <path d="M 50,22 C 68,22 70,38 70,50 C 70,62 68,78 50,78" strokeWidth="4.5" />
          <path d="M 36,26 L 30,12 M 43,23 L 40,10 M 50,22 L 50,8 M 57,23 L 60,10 M 64,26 L 70,12" strokeWidth="2.5" />
          <path d="M 36,74 L 30,88 M 43,77 L 40,90 M 50,78 L 50,92 M 57,77 L 60,90 M 64,74 L 70,88" strokeWidth="2.5" />
        </svg>
      )
    },
    {
      id: "nkyinkyim",
      name: "Nkyinkyim",
      pronunciation: "N-chin-chim",
      meaning: "Life's Journey & Initiative",
      origin: "Kente Weaving & Woodcarving Traditions",
      proverb: "\"Obra kwan ye nkyinkyimee\"",
      description: "Literally meaning 'twisting' or 'zigzag.' This highly geometric design represents life's dynamic, winding path. It honors versatility, creative initiative, and the strength to navigate unpredictable turns. It teaches that the journey of learning and self-expression is never straight, but beautiful, rich, and full of shape.",
      svg: (color) => (
        <svg viewBox="0 0 100 100" className="w-full h-full transition-colors duration-300" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="50" cy="50" r="44" strokeDasharray="3 4" opacity="0.25" strokeWidth="1" />
          <path d="M 22,22 H 45 V 45 H 22 V 68 H 45 V 78" strokeWidth="4" />
          <path d="M 78,78 H 55 V 55 H 78 V 32 H 55 V 22" strokeWidth="4" />
          <circle cx="33" cy="33" r="3.5" fill={color} />
          <circle cx="67" cy="67" r="3.5" fill={color} />
          <circle cx="33" cy="55" r="3.5" fill={color} />
          <circle cx="67" cy="45" r="3.5" fill={color} />
        </svg>
      )
    },
    {
      id: "cowri",
      name: "Cowrie Core",
      pronunciation: "Kow-ree Core",
      meaning: "Abundance & Communal Dialogue",
      origin: "Pan-African Trademarks",
      proverb: "\"Akwaba koraa, sika mpo aso\"",
      description: "The cowrie shell is a historic symbol of prosperity, trade, and protective grace across Africa. It represents the sacred wealth of human connection, fertile ideas, and dialogue. In textile art, the cowrie motif is used as a beautiful seal of greeting, warmth, and mutual respect.",
      svg: (color) => (
        <svg viewBox="0 0 100 100" className="w-full h-full transition-colors duration-300" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="50" cy="50" r="44" strokeDasharray="3 4" opacity="0.25" strokeWidth="1" />
          <path d="M 50,15 C 28,15 28,45 28,50 C 28,55 28,85 50,85 C 72,85 72,55 72,50 C 72,45 72,15 50,15 Z" strokeWidth="3.5" />
          <path d="M 50,22 V 78" strokeWidth="2" strokeDasharray="3 3" opacity="0.5" />
          <path d="M 46,25 C 44,30 44,70 46,75" strokeWidth="2.5" />
          <path d="M 54,25 C 56,30 56,70 54,75" strokeWidth="2.5" />
          <path d="M 38,36 H 45 M 36,46 H 45 M 35,50 H 45 M 36,54 H 45 M 38,64 H 45" strokeWidth="1.5" />
          <path d="M 55,36 H 62 M 55,46 H 64 M 55,50 H 65 M 55,54 H 64 M 55,64 H 62" strokeWidth="1.5" />
        </svg>
      )
    }
  ];

  const activeMotif = motifs.find((m) => m.id === selectedId) || motifs[0];

  // Helper patterns count based on density
  const getGridSize = () => {
    switch (patternDensity) {
      case "sparse": return 6;
      case "medium": return 12;
      case "dense": return 24;
    }
  };

  return (
    <section className="bg-ivory border-t border-b border-sand/30 py-24 px-[5vw] relative overflow-hidden" id="heritage-art">
      {/* Background Mudcloth Pattern overlay */}
      <div className="absolute inset-0 bg-pattern-mudcloth opacity-35 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-xl mx-auto space-y-4 mb-16">
          <div className="label justify-center">Living Visual Language</div>
          <h2 className="font-serif text-4xl sm:text-5xl font-light text-charcoal">
            Heritage <span className="text-clay italic">Symbols &amp; Artistry</span>
          </h2>
          <p className="text-charcoal/70 text-sm leading-relaxed max-w-md mx-auto">
            Explore the traditional visual motifs of African storytelling. Click on the cultural designs below to learn their philosophy, and compose your own modern textiles using our digital weaving loom.
          </p>
        </div>

        {/* Core Interactive Board */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT COLUMN: Symbol Selector (Grid of 4) */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[10px] tracking-widest text-[#CB6A4A] font-mono font-bold uppercase block mb-2">Select a Sacred Emblem</span>
            <div className="grid grid-cols-2 gap-4">
              {motifs.map((motif) => (
                <button
                  key={motif.id}
                  onClick={() => setSelectedId(motif.id)}
                  id={`motif-btn-${motif.id}`}
                  className={`p-6 bg-white border rounded-[3px] text-center transition-all flex flex-col items-center justify-center gap-4 cursor-pointer hover:shadow-md ${
                    selectedId === motif.id
                      ? "border-clay shadow-md ring-1 ring-clay/20"
                      : "border-sand/20 hover:border-sand/60"
                  }`}
                >
                  <div className={`w-14 h-14 ${selectedId === motif.id ? "text-clay" : "text-charcoal/30 hover:text-charcoal/60"} transition-colors`}>
                    {motif.svg(selectedId === motif.id ? stampColor : "#888888")}
                  </div>
                  <div>
                    <span className="font-serif text-charcoal font-medium block text-base leading-none">{motif.name}</span>
                    <span className="text-[9px] text-[#8C837C] tracking-wide font-mono block mt-1">{motif.origin.split(" ")[0]} Tradition</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Color Loom Swapper */}
            <div className="bg-white/70 backdrop-blur-sm border border-sand/20 p-5 rounded-[3px] space-y-3 mt-6">
              <div className="flex justify-between items-center">
                <span className="text-[10px] tracking-widest text-charcoal/50 font-mono font-semibold uppercase">Cultural Loom Colors</span>
                <span className="text-[10px] text-clay font-mono">{colors.find((c) => c.value === stampColor)?.name}</span>
              </div>
              <div className="flex gap-2">
                {colors.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setStampColor(c.value)}
                    className={`w-8 h-8 rounded-full border-2 cursor-pointer transition-all ${
                      stampColor === c.value ? "border-charcoal scale-110" : "border-transparent"
                    }`}
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  />
                ))}
              </div>

              {/* Pattern Density Swapper */}
              <div className="space-y-2 pt-2 border-t border-sand/10">
                <span className="text-[10px] tracking-widest text-charcoal/50 font-mono font-semibold uppercase block">Composition Grid</span>
                <div className="grid grid-cols-3 gap-2">
                  {(["sparse", "medium", "dense"] as const).map((density) => (
                    <button
                      key={density}
                      onClick={() => setPatternDensity(density)}
                      className={`py-1.5 px-3 rounded-[2px] text-[10px] font-mono capitalize border transition-all cursor-pointer ${
                        patternDensity === density
                          ? "bg-charcoal text-white border-charcoal"
                          : "bg-white border-sand/30 text-charcoal/60 hover:bg-neutral-50"
                      }`}
                    >
                      {density}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* MIDDLE COLUMN: Philosphy Card & Proverb */}
          <div className="lg:col-span-4 bg-[#FAF8F4] border border-sand p-8 rounded-[4px] min-h-[440px] flex flex-col justify-between shadow-sm relative">
            <span className="absolute top-4 right-4 text-white/5 bg-clay/5 p-1 text-[8px] font-mono tracking-widest uppercase">PHILOSOPHY</span>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMotif.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <div>
                  <span className="text-clay/80 text-[10px] tracking-widest uppercase font-mono block">Cultural Art Registry</span>
                  <h3 className="font-serif text-charcoal text-3xl font-light leading-none pt-1">
                    {activeMotif.name}
                  </h3>
                  <span className="text-xs text-charcoal/40 italic block font-mono font-medium pt-1">
                    Pronounced: {activeMotif.pronunciation} · {activeMotif.origin}
                  </span>
                </div>

                {/* Cultural Proverb Callout */}
                <div className="border-l-[3px] border-clay bg-clay/[0.04] p-4 rounded-[2px] italic">
                  <p className="font-serif text-charcoal text-sm leading-relaxed">
                    {activeMotif.proverb}
                  </p>
                  <span className="text-[9px] font-mono tracking-wider text-clay/90 uppercase block mt-1">
                    — Traditional Philosophy proverb
                  </span>
                </div>

                <div className="space-y-3">
                  <span className="font-serif font-light text-[10px] tracking-widest text-clay uppercase block border-b border-sand/30 pb-1">Meaning &amp; Metaphor</span>
                  <p className="text-[#5F564F] text-xs leading-relaxed font-sans font-light">
                    {activeMotif.description}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="pt-6 border-t border-sand/20 text-[10px] font-mono text-charcoal/40 leading-relaxed">
              *Displayed interactive vector graphics representing authenticated research archives.
            </div>
          </div>

          {/* RIGHT COLUMN: Live Composition Fabric Canvas */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-[10px] tracking-widest text-charcoal/50 font-mono font-bold uppercase block mb-1">Canvas Grid Composition</span>
            
            {/* The woven fabric screen container */}
            <div className="aspect-square bg-white border border-sand shadow-inner p-6 rounded-[4px] relative flex flex-col justify-between overflow-hidden group">
              
              {/* Vertical weave thread threads decoration */}
              <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#000_1px,transparent_1px)] [background-size:8px_100%] pointer-events-none"></div>
              {/* Horizontal weave thread threads decoration */}
              <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_bottom,#000_1px,transparent_1px)] [background-size:100%_8px] pointer-events-none"></div>

              {/* The Live Motif Tiles grid */}
              <div className="grid grid-cols-3 sm:grid-cols-3 gap-4 h-full items-center justify-center p-2">
                {Array.from({ length: getGridSize() }).map((_, index) => (
                  <motion.div
                    key={`${selectedId}-${index}-${stampColor}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.4,
                      delay: (index % 6) * 0.05
                    }}
                    className="aspect-square w-full h-full flex items-center justify-center p-2.5 bg-neutral-50/50 rounded-[2px] hover:bg-white hover:shadow-xs transition-shadow"
                  >
                    {activeMotif.svg(stampColor)}
                  </motion.div>
                ))}
              </div>

              {/* Info ribbon at bottom of grid */}
              <div className="relative text-center border-t border-sand/30 pt-3 select-none">
                <span className="text-[9px] tracking-widest uppercase font-mono text-charcoal/40 font-bold block">
                  DIGITAL TEXTILE SHUTTLE
                </span>
                <span className="text-[8px] tracking-wide font-mono text-clay block mt-0.5">
                  STAMP: {activeMotif.name.toUpperCase()} (DENSITY: {patternDensity.toUpperCase()})
                </span>
              </div>
            </div>

            <p className="text-charcoal/40 text-[10px] leading-relaxed font-mono text-center">
              Compiles repeating visual tiles representing tribal rhythm patterns.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
