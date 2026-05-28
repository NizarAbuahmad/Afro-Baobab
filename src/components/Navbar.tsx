import React, { useState, useEffect } from "react";
import { Lock, Sparkles, BookOpen, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import AfroBaobabLogo from "./AfroBaobabLogo";
import { CmsHeader, CustomPage } from "../types";

interface NavbarProps {
  onOpenCms: () => void;
  onOpenBooking: (type: 'school' | 'corporate' | 'general') => void;
  isAdmin: boolean;
  onLogout: () => void;
  header?: CmsHeader;
  customPages?: CustomPage[];
  onSelectPage?: (page: CustomPage) => void;
  onSelectPageBySlug?: (slug: string) => void;
}

export default function Navbar({ onOpenCms, onOpenBooking, isAdmin, onLogout, header, customPages, onSelectPage, onSelectPageBySlug }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logoPosition = header?.navbarLogoPosition || "left";
  const isSubPage = typeof window !== "undefined" && window.location.pathname !== "/";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-[5vw] ${
        isScrolled
          ? "bg-[#19120c]/93 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      } ${
        logoPosition === "center"
          ? isScrolled
            ? "flex flex-col items-center justify-center py-2.5 gap-2"
            : "flex flex-col items-center justify-center py-6 gap-4"
          : logoPosition === "right"
            ? "flex flex-row-reverse items-center justify-between py-4"
            : "flex items-center justify-between py-4"
      }`}
    >
      <a href={isSubPage ? "/" : "#"} className="flex items-center gap-1.5 sm:gap-2 group shrink min-w-0 max-w-[62%] sm:max-w-none">
        <AfroBaobabLogo
          variant="navbar"
          color="#CB6A4A"
          className="text-white group-hover:scale-[1.03] transition-transform duration-300"
          logoTextPrimary={header?.logoTextPrimary}
          logoTextSecondary={header?.logoTextSecondary}
          logoSub={header?.logoSub}
          logoMode={header?.logoMode}
          logoImageUrl={header?.logoImageUrl}
          logoEmblemColor={header?.logoEmblemColor}
          scalePercent={header?.navbarLogoSize}
          logoPosition={logoPosition}
        />
      </a>

      {/* Desktop Menu */}
      <ul className={`hidden md:flex items-center gap-6 md:gap-8 list-none font-sans justify-center m-0 p-0`}>
        <li>
          <a
            href={isSubPage ? "/#events" : "#events"}
            className="text-white/70 hover:text-clay text-[0.78rem] tracking-[0.12em] uppercase font-light transition-colors duration-200"
          >
            Events
          </a>
        </li>

        {/* Dynamic CMS Pages in Navbar */}
        {customPages?.filter(p => p.shownInNavbar).map((p) => {
          if (p.slug === "corporate") {
            return (
              <React.Fragment key={p.id}>
                <li>
                  <a
                    href="/corporate"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-clay text-[0.78rem] tracking-[0.12em] uppercase font-semibold transition-colors duration-200 inline-block py-0 px-1 hover:translate-y-[-1px] cursor-pointer"
                  >
                    {p.title}
                  </a>
                </li>
                <li>
                  <a
                    href="/coming-soon"
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectPageBySlug?.("/coming-soon");
                    }}
                    className="text-white/70 hover:text-clay text-[0.78rem] tracking-[0.12em] uppercase font-light transition-colors duration-200 cursor-pointer"
                  >
                    Coming Soon
                  </a>
                </li>
              </React.Fragment>
            );
          }
          if (p.slug === "schools") {
            return (
              <li key={p.id}>
                <a
                  href="/schools"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectPageBySlug?.("schools");
                  }}
                  className="text-white/70 hover:text-clay text-[0.78rem] tracking-[0.12em] uppercase font-semibold transition-colors duration-200 inline-block py-0 px-1 hover:translate-y-[-1px] cursor-pointer"
                >
                  {p.title}
                </a>
              </li>
            );
          }
          return (
            <li key={p.id}>
              <button
                onClick={() => onSelectPage?.(p)}
                className="text-white/70 hover:text-clay text-[0.78rem] tracking-[0.12em] uppercase font-medium transition-colors duration-200 cursor-pointer bg-transparent border-0 py-0 px-1 hover:translate-y-[-1px]"
              >
                {p.title}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Right actions (with responsive toggle button) */}
      <div className="flex items-center gap-1.5 sm:gap-3 px-1 sm:px-0 shrink-0">
        {/* CMS Desk Access */}
        {isAdmin ? (
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={onOpenCms}
              className="bg-moss hover:bg-[#434d3a] text-white p-1 sm:p-2 rounded-[2px] text-[10px] sm:text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer select-none"
            >
              <Sparkles className="w-3 h-3 text-sand" /> <span className="hidden sm:inline">CMS</span>
            </button>
            <button
              onClick={onLogout}
              className="text-white/50 hover:text-red-400 text-[10px] font-mono transition-colors hidden md:block select-none"
              title="Logout from CMS"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenCms}
            className="text-white/45 hover:text-clay p-1.5 sm:p-2 rounded-[2px] transition-colors cursor-pointer"
            title="CMS Content Manager"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Responsive Hamburger Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-white/80 hover:text-white p-1 cursor-pointer focus:outline-none shrink-0"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5 text-clay" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Dynamic Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="absolute top-full left-0 right-0 bg-[#160f0a] border-b border-sand/20 overflow-hidden md:hidden shadow-2xl z-40"
          >
            <ul className="flex flex-col p-6 space-y-3.5 list-none font-sans text-left bg-[#19110b] border-t border-sand/10 m-0">
              <li>
                <a
                  href={isSubPage ? "/#events" : "#events"}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white/80 hover:text-clay text-sm tracking-[0.12em] uppercase font-light transition-colors duration-200 block py-1 border-b border-white/5"
                >
                  Events
                </a>
              </li>

              {/* Custom dynamic pages inside drawer */}
              {customPages?.filter(p => p.shownInNavbar).map((p) => {
                if (p.slug === "corporate") {
                  return (
                    <React.Fragment key={p.id}>
                      <li>
                        <a
                          href="/corporate"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/80 hover:text-clay text-sm tracking-[0.12em] uppercase font-medium transition-colors duration-200 block py-1 text-left w-full border-b border-white/5 cursor-pointer"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          ✧ {p.title}
                        </a>
                      </li>
                      <li>
                        <a
                          href="/coming-soon"
                          onClick={(e) => {
                            e.preventDefault();
                            onSelectPageBySlug?.("/coming-soon");
                            setIsMobileMenuOpen(false);
                          }}
                          className="text-white/80 hover:text-clay text-sm tracking-[0.12em] uppercase font-light transition-colors duration-200 block py-1 border-b border-white/5 cursor-pointer text-left"
                        >
                          Coming Soon
                        </a>
                      </li>
                    </React.Fragment>
                  );
                }
                if (p.slug === "schools") {
                  return (
                    <li key={p.id}>
                      <a
                        href="/schools"
                        onClick={(e) => {
                          e.preventDefault();
                          onSelectPageBySlug?.("schools");
                          setIsMobileMenuOpen(false);
                        }}
                        className="text-white/80 hover:text-clay text-sm tracking-[0.12em] uppercase font-medium transition-colors duration-200 block py-1 text-left w-full border-b border-white/5 cursor-pointer"
                      >
                        ✧ {p.title}
                      </a>
                    </li>
                  );
                }
                return (
                  <li key={p.id}>
                    <button
                      onClick={() => {
                        onSelectPage?.(p);
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-white/80 hover:text-clay text-sm tracking-[0.12em] uppercase font-medium transition-colors duration-200 cursor-pointer bg-transparent border-0 p-0 block py-1 text-left w-full border-b border-white/5"
                    >
                      ✧ {p.title}
                    </button>
                  </li>
                );
              })}

              {isAdmin && (
                <li className="pt-2">
                  <button
                    onClick={() => {
                      onLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-red-400 hover:text-red-300 text-xs font-mono transition-colors tracking-widest uppercase cursor-pointer block text-left bg-transparent border-0 p-0"
                  >
                    Logout from CMS
                  </button>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle hand-woven geometric thread border at the base of the bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[radial-gradient(#CB6A4A_1px,transparent_1px)] bg-[size:8px_3px] opacity-40"></div>
    </nav>
  );
}
