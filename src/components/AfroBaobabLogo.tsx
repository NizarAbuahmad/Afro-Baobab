import { ReactNode } from "react";

interface LogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  variant?: "full" | "icon" | "footer" | "navbar";
  color?: string; // e.g. '#A64836' (terracotta) or 'currentColor'
  logoTextPrimary?: string;
  logoTextSecondary?: string;
  logoSub?: string;
  logoMode?: "default-emblem" | "custom-text" | "image-url";
  logoImageUrl?: string;
  logoEmblemColor?: string;
  scalePercent?: number;
}

export default function AfroBaobabLogo({
  className = "",
  iconClassName = "",
  textClassName = "",
  variant = "full",
  color = "currentColor",
  logoTextPrimary = "AFRO",
  logoTextSecondary = "BAOBAB",
  logoSub = "CULTURAL HUB & ART GALLERY",
  logoMode = "default-emblem",
  logoImageUrl = "",
  logoEmblemColor = "#CB6A4A",
  scalePercent
}: LogoProps) {
  const activeColor = logoEmblemColor || color;
  const primaryText = logoTextPrimary || "AFRO";
  const secondaryText = logoTextSecondary || "BAOBAB";
  const subText = logoSub || "CULTURAL HUB & ART GALLERY";
  const mode = logoMode || "default-emblem";

  const isDefaultPrimary = primaryText.toUpperCase() === "AFRO";
  const isDefaultSecondary = secondaryText.toUpperCase() === "BAOBAB";

  // Beautifully and precisely rendered SVG path reproducing the custom human-baobab emblem
  const renderEmblem = (sizeClass: string) => {
    if (mode === "image-url" && logoImageUrl) {
      return (
        <img
          src={logoImageUrl}
          alt="Afro Baobab Brand Logo"
          className={`${sizeClass} ${iconClassName} object-contain shrink-0`}
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Fallback back to emblem on error
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      );
    }

    if (mode === "custom-text") {
      return null;
    }

    return (
      <svg
        viewBox="0 0 200 200"
        className={`${sizeClass} ${iconClassName} shrink-0 transition-transform duration-300`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Central Root Base Arch */}
        <path
          d="M 82,165 Z"
          fill={activeColor}
        />
        
        {/* Main Ground Roots Crescent */}
        <path
          d="M 75,178 C 88,185 112,185 125,178 C 115,172 85,172 75,178 Z"
          fill={activeColor}
        />

        {/* Outer Curved Horizon Shield bottom-most */}
        <path
          d="M 85,175 C 95,165 105,165 115,175 C 105,171 95,171 85,175 Z"
          fill={activeColor}
        />

        {/* MAIN LEFT TRUNK (Forming Left of Central Figure Negative Space) */}
        <path
          d="M 87,170 C 83,145 70,130 54,115 C 44,105 38,102 38,102 C 38,102 46,108 55,108 C 65,108 76,115 80,128 C 84,141 82,152 70,165 C 75,168 83,171 87,170 Z"
          fill={activeColor}
        />

        {/* MAIN RIGHT TRUNK (Forming Right of Central Figure Negative Space) */}
        <path
          d="M 113,170 C 117,145 130,130 146,115 C 156,105 162,102 162,102 C 162,102 154,108 145,108 C 135,108 124,115 120,128 C 116,141 118,152 130,165 C 125,168 117,171 113,170 Z"
          fill={activeColor}
        />

        {/* CENTRAL FIGURE (Drawn explicitly to stand between trunks) */}
        {/* Central Body & Extended Raised Arms */}
        <path
          d="M 100,160 Q 98,135 90,118 Q 80,105 75,98 C 80,100 87,105 91,114 Q 97,125 100,140 Q 103,125 109,114 C 113,105 120,100 125,98 C 120,105 110,105 100,160 Z"
          fill={activeColor}
        />

        {/* FLANKING COMMUNITY HUMAN LIMBS (Inner Circle & Outer Circle) */}
        {/* High Upper-Left Curved Arm Group */}
        <path
          d="M 85,96 C 80,85 71,85 68,91 C 65,97 68,103 72,106 C 76,101 81,98 85,96 Z"
          fill={activeColor}
        />
        <path
          d="M 64,88 C 60,78 51,78 48,84 C 45,90 48,96 52,99 C 56,94 61,91 64,88 Z"
          fill={activeColor}
        />
        {/* High Upper-Right Curved Arm Group */}
        <path
          d="M 115,96 C 120,85 129,85 132,91 C 135,97 132,103 128,106 C 124,101 119,98 115,96 Z"
          fill={activeColor}
        />
        <path
          d="M 136,88 C 140,78 149,78 152,84 C 155,90 152,96 148,99 C 144,94 139,91 136,88 Z"
          fill={activeColor}
        />

        {/* Outer Left Side Curved Limb */}
        <path
          d="M 46,122 C 38,118 32,125 32,130 C 32,135 38,138 43,135 C 47,130 47,125 46,122 Z"
          fill={activeColor}
        />
        {/* Outer Right Side Curved Limb */}
        <path
          d="M 154,122 C 162,118 168,125 168,130 C 168,135 162,138 157,135 C 153,130 153,125 154,122 Z"
          fill={activeColor}
        />

        {/* Middle Outer Left Wing */}
        <path
          d="M 38,154 C 33,148 26,155 26,160 C 26,165 33,168 38,165 C 42,160 41,156 38,154 Z"
          fill={activeColor}
        />
        {/* Middle Outer Right Wing */}
        <path
          d="M 162,154 C 167,148 174,155 174,160 C 174,165 167,168 162,165 C 158,160 159,156 162,154 Z"
          fill={activeColor}
        />

        {/* HEALER COMMUNITIES HEADS (The Dots) */}
        <circle cx="100" cy="80" r="7.5" fill={activeColor} /> {/* Main Center Head */}
        
        <circle cx="78" cy="86" r="6.5" fill={activeColor} /> {/* High Left Head */}
        <circle cx="122" cy="86" r="6.5" fill={activeColor} /> {/* High Right Head */}

        <circle cx="58" cy="94" r="6" fill={activeColor} /> {/* Outer High Left Head */}
        <circle cx="142" cy="94" r="6" fill={activeColor} /> {/* Outer High Right Head */}

        <circle cx="42" cy="112" r="6" fill={activeColor} /> {/* Left Mid Head */}
        <circle cx="158" cy="112" r="6" fill={activeColor} /> {/* Right Mid Head */}

        <circle cx="34" cy="138" r="5.5" fill={activeColor} /> {/* Outer Left Head */}
        <circle cx="166" cy="138" r="5.5" fill={activeColor} /> {/* Outer Right Head */}

        <circle cx="38" cy="164" r="5.5" fill={activeColor} /> {/* Lower Outer Left Head */}
        <circle cx="162" cy="164" r="5.5" fill={activeColor} /> {/* Lower Outer Right Head */}
        
        {/* Soft Ground Horizon Arc beneath the Tree */}
        <path
          d="M 50,180 C 80,195 120,195 150,180"
          stroke={activeColor}
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      </svg>
    );
  };

  // Custom typography for "AFRO BAOBAB" that perfectly captures the artistic feel
  const renderTypography = () => (
    <div className={`flex flex-col select-none ${textClassName}`}>
      {/* Brand row 1 */}
      {isDefaultPrimary ? (
        <div className="flex items-center gap-1.5 font-serif text-[1.65rem] md:text-[1.85rem] font-medium tracking-[0.15em] leading-[0.95] text-current">
          <span className="relative flex items-center justify-center">
            {/* Custom style 'A' with peak and dot inside */}
            <span className="font-serif">A</span>
            <span className="absolute bottom-[3px] w-1.5 h-1.5 rounded-full bg-clay" />
          </span>
          <span>F</span>
          <span>R</span>
          <span className="relative flex items-center justify-center">
            {/* Custom style 'O' with center dot */}
            <span>O</span>
            <span className="absolute w-1 h-1 rounded-full bg-clay" />
          </span>
        </div>
      ) : (
        <div className="font-serif text-[1.45rem] md:text-[1.65rem] font-medium tracking-[0.12em] leading-[0.95] text-current uppercase">
          {primaryText}
        </div>
      )}

      {/* Brand row 2 */}
      {isDefaultSecondary ? (
        <div className="flex items-center gap-1.5 font-serif text-[1.65rem] md:text-[1.85rem] font-bold tracking-[0.12em] leading-[0.95] text-current">
          <span>B</span>
          <span className="relative flex items-center justify-center text-[#E7D6BA] sm:text-clay">
            <span className="font-serif">A</span>
            <span className="absolute bottom-[3px] w-1.5 h-1.5 rounded-full bg-charcoal dark:bg-white" />
          </span>
          <span className="relative flex items-center justify-center">
            <span>O</span>
            <span className="absolute w-1 h-1 rounded-full bg-clay" />
          </span>
          <span>B</span>
          <span className="relative flex items-center justify-center text-[#E7D6BA] sm:text-clay">
            <span className="font-serif">A</span>
            <span className="absolute bottom-[3px] w-1.5 h-1.5 rounded-full bg-charcoal dark:bg-white" />
          </span>
          <span>B</span>
        </div>
      ) : (
        <div className="font-serif text-[1.45rem] md:text-[1.65rem] font-bold tracking-[0.08em] leading-[0.95] text-clay uppercase mt-1">
          {secondaryText}
        </div>
      )}

      {/* Brand Subtitle */}
      <div className="text-[0.52rem] md:text-[0.55rem] tracking-[0.38em] font-sans font-bold uppercase text-clay/90 mt-1.5 leading-none whitespace-nowrap">
        {subText}
      </div>
    </div>
  );

  if (variant === "icon") {
    return renderEmblem(className || "h-12 w-12");
  }

  if (variant === "navbar") {
    const showEmblem = mode !== "custom-text";
    return (
      <div 
        className={`flex items-center gap-3.5 ${className}`}
        style={scalePercent ? { transform: `scale(${scalePercent / 100})`, transformOrigin: "left center" } : undefined}
      >
        {showEmblem && renderEmblem("h-11 sm:h-13 w-auto")}
        <div className="flex flex-col select-none text-white">
          <div className="flex items-center gap-1.5 font-sans uppercase font-bold text-sm sm:text-base tracking-[0.18em] leading-none">
            {primaryText} <span className="text-clay">{secondaryText}</span>
          </div>
          <div className="text-[0.45rem] tracking-[0.25em] font-sans font-semibold text-clay/80 mt-1 whitespace-nowrap">
            {subText}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`flex items-center gap-4 ${className}`}
      style={scalePercent ? { transform: `scale(${scalePercent / 100})`, transformOrigin: "left center" } : undefined}
    >
      {mode !== "custom-text" && renderEmblem("h-16 md:h-20 w-auto")}
      {renderTypography()}
    </div>
  );
}
