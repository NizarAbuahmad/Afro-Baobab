import { useState, useEffect } from "react";
import { Lock, Sparkles, BookOpen } from "lucide-react";
import AfroBaobabLogo from "./AfroBaobabLogo";
import { CmsHeader } from "../types";

interface NavbarProps {
  onOpenCms: () => void;
  onOpenBooking: (type: 'school' | 'corporate' | 'general') => void;
  isAdmin: boolean;
  onLogout: () => void;
  header?: CmsHeader;
}

export default function Navbar({ onOpenCms, onOpenBooking, isAdmin, onLogout, header }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[5vw] py-4 transition-all duration-300 ${
        isScrolled
          ? "bg-[#19120c]/93 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <a href="#" className="flex items-center gap-2 group">
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
        />
      </a>

      <ul className="flex items-center gap-6 md:gap-8 list-none font-sans">
        <li className="hidden md:block">
          <a
            href="#experiences"
            className="text-white/70 hover:text-clay text-[0.78rem] tracking-[0.12em] uppercase font-light transition-colors duration-200"
          >
            Experiences
          </a>
        </li>
        <li className="hidden md:block">
          <a
            href="#exhibitions"
            className="text-white/70 hover:text-clay text-[0.78rem] tracking-[0.12em] uppercase font-light transition-colors duration-200"
          >
            Exhibitions
          </a>
        </li>
        <li className="hidden md:block">
          <a
            href="#schools"
            className="text-white/70 hover:text-clay text-[0.78rem] tracking-[0.12em] uppercase font-light transition-colors duration-200"
          >
            Education
          </a>
        </li>
        <li className="hidden md:block">
          <a
            href="#events"
            className="text-white/70 hover:text-clay text-[0.78rem] tracking-[0.12em] uppercase font-light transition-colors duration-200"
          >
            Events
          </a>
        </li>
        <li>
          <button
            onClick={() => onOpenBooking('general')}
            className="bg-clay hover:bg-terracotta text-white px-4 py-2 rounded-[2px] text-[0.78rem] tracking-[0.1em] font-medium transition-all duration-200 cursor-pointer shadow-sm hover:-translate-y-[1px]"
          >
            Book / Inquire
          </button>
        </li>
        <li>
          {isAdmin ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenCms}
                className="bg-moss hover:bg-[#434d3a] text-white p-2 rounded-[2px] text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" /> CMS Panel
              </button>
              <button
                onClick={onLogout}
                className="text-white/50 hover:text-red-400 text-xs font-mono transition-colors"
                title="Logout from CMS"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenCms}
              className="text-white/40 hover:text-clay p-2 rounded-[2px] transition-colors cursor-pointer"
              title="CMS Content Manager"
            >
              <Lock className="w-4 h-4" />
            </button>
          )}
        </li>
      </ul>
      {/* Subtle hand-woven geometric thread border at the base of the bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[radial-gradient(#CB6A4A_1px,transparent_1px)] bg-[size:8px_3px] opacity-40"></div>
    </nav>
  );
}
