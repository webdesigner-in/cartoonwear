import React from 'react';

const CrochetFallbackIcon = ({ 
  size = 80, 
  className = "", 
  animate = true,
  variant = "default" // default, heart, star, flower
}) => {
  const baseClass = `${className} ${animate ? 'animate-pulse' : ''}`;
  
  if (variant === "heart") {
    return (
      <div className={baseClass} style={{ width: size, height: size }}>
        <svg 
          viewBox="0 0 200 200" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4AF37" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
            <linearGradient id="yarnGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="50%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
          
          {/* Background circle */}
          <circle 
            cx="100" 
            cy="100" 
            r="90" 
            fill="#FEF3C7" 
            opacity="0.3"
            className={animate ? "animate-ping" : ""}
          />
          
          {/* Main heart shape */}
          <path 
            d="M100 170C100 170 40 120 40 80C40 60 60 40 80 40C90 40 95 45 100 50C105 45 110 40 120 40C140 40 160 60 160 80C160 120 100 170 100 170Z" 
            fill="url(#heartGradient)"
            className={animate ? "animate-pulse" : ""}
          />
          
          {/* Crochet hook */}
          <path 
            d="M130 60L150 40M150 40L145 35M150 40L155 35" 
            stroke="#8B5CF6" 
            strokeWidth="3" 
            strokeLinecap="round"
            className={animate ? "animate-bounce" : ""}
          />
          
          {/* Yarn ball in heart */}
          <circle cx="100" cy="90" r="25" fill="url(#yarnGradient)" opacity="0.8" />
          <circle cx="100" cy="90" r="15" fill="#FFFFFF" opacity="0.6" />
          
          {/* Yarn strands */}
          <path 
            d="M75 90Q85 80 95 90Q105 100 115 90" 
            stroke="#FFFFFF" 
            strokeWidth="2" 
            fill="none"
            className={animate ? "animate-pulse" : ""}
          />
          <path 
            d="M80 100Q90 90 100 100Q110 110 120 100" 
            stroke="#FFFFFF" 
            strokeWidth="2" 
            fill="none"
            className={animate ? "animate-pulse" : ""}
          />
          
          {/* Sparkles */}
          <g className={animate ? "animate-pulse" : ""}>
            <path d="M50 50L52 55L50 60L48 55Z" fill="#D4AF37" />
            <path d="M170 70L172 75L170 80L168 75Z" fill="#EC4899" />
            <path d="M60 150L62 155L60 160L58 155Z" fill="#8B5CF6" />
            <circle cx="160" cy="140" r="2" fill="#D4AF37" />
            <circle cx="30" cy="120" r="2" fill="#EC4899" />
          </g>
        </svg>
      </div>
    );
  }
  
  if (variant === "star") {
    return (
      <div className={baseClass} style={{ width: size, height: size }}>
        <svg 
          viewBox="0 0 200 200" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FEF3C7" opacity="0.8" />
              <stop offset="100%" stopColor="#FEF3C7" opacity="0" />
            </radialGradient>
          </defs>
          
          {/* Glow effect */}
          <circle 
            cx="100" 
            cy="100" 
            r="80" 
            fill="url(#glowGradient)"
            className={animate ? "animate-pulse" : ""}
          />
          
          {/* Main star */}
          <path 
            d="M100 20L110 70L160 70L120 100L130 150L100 125L70 150L80 100L40 70L90 70Z" 
            fill="url(#starGradient)"
            className={animate ? "animate-pulse" : ""}
          />
          
          {/* Inner star details */}
          <path 
            d="M100 40L105 65L130 65L110 80L115 105L100 95L85 105L90 80L70 65L95 65Z" 
            fill="#FFFFFF" 
            opacity="0.4"
          />
          
          {/* Crochet pattern in center */}
          <circle cx="100" cy="85" r="20" fill="none" stroke="#8B5CF6" strokeWidth="2" opacity="0.6" />
          <circle cx="100" cy="85" r="12" fill="none" stroke="#EC4899" strokeWidth="2" opacity="0.6" />
          <circle cx="100" cy="85" r="6" fill="#8B5CF6" opacity="0.8" />
          
          {/* Orbiting elements */}
          <g className={animate ? "animate-spin" : ""} style={{ transformOrigin: "100px 100px" }}>
            <circle cx="140" cy="60" r="3" fill="#EC4899" />
            <circle cx="160" cy="140" r="3" fill="#8B5CF6" />
            <circle cx="60" cy="140" r="3" fill="#D4AF37" />
            <circle cx="40" cy="60" r="3" fill="#EC4899" />
          </g>
        </svg>
      </div>
    );
  }
  
  if (variant === "flower") {
    return (
      <div className={baseClass} style={{ width: size, height: size }}>
        <svg 
          viewBox="0 0 200 200" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <radialGradient id="petalGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FCE7F3" />
              <stop offset="70%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#BE185D" />
            </radialGradient>
            <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FEF3C7" />
              <stop offset="100%" stopColor="#D4AF37" />
            </radialGradient>
          </defs>
          
          {/* Background glow */}
          <circle 
            cx="100" 
            cy="100" 
            r="85" 
            fill="#FCE7F3" 
            opacity="0.3"
            className={animate ? "animate-ping" : ""}
          />
          
          {/* Flower petals */}
          <g className={animate ? "animate-pulse" : ""}>
            <ellipse cx="100" cy="60" rx="15" ry="35" fill="url(#petalGradient)" />
            <ellipse cx="140" cy="100" rx="35" ry="15" fill="url(#petalGradient)" />
            <ellipse cx="100" cy="140" rx="15" ry="35" fill="url(#petalGradient)" />
            <ellipse cx="60" cy="100" rx="35" ry="15" fill="url(#petalGradient)" />
            <ellipse cx="125" cy="75" rx="20" ry="25" fill="url(#petalGradient)" transform="rotate(45 125 75)" />
            <ellipse cx="125" cy="125" rx="25" ry="20" fill="url(#petalGradient)" transform="rotate(-45 125 125)" />
            <ellipse cx="75" cy="125" rx="20" ry="25" fill="url(#petalGradient)" transform="rotate(45 75 125)" />
            <ellipse cx="75" cy="75" rx="25" ry="20" fill="url(#petalGradient)" transform="rotate(-45 75 75)" />
          </g>
          
          {/* Flower center */}
          <circle cx="100" cy="100" r="20" fill="url(#centerGradient)" />
          
          {/* Crochet stitches in center */}
          <g stroke="#8B5CF6" strokeWidth="1.5" fill="none" opacity="0.8">
            <path d="M90 90L110 90M90 95L110 95M90 100L110 100M90 105L110 105M90 110L110 110" />
            <circle cx="85" cy="100" r="2" fill="#8B5CF6" />
            <circle cx="115" cy="100" r="2" fill="#8B5CF6" />
          </g>
          
          {/* Floating yarn bits */}
          <g className={animate ? "animate-bounce" : ""}>
            <path d="M160 40Q170 35 180 45Q175 55 165 50Q155 45 160 40Z" fill="#8B5CF6" opacity="0.6" />
            <path d="M20 40Q30 35 40 45Q35 55 25 50Q15 45 20 40Z" fill="#EC4899" opacity="0.6" />
            <path d="M40 160Q50 155 60 165Q55 175 45 170Q35 165 40 160Z" fill="#D4AF37" opacity="0.6" />
            <path d="M160 160Q170 155 180 165Q175 175 165 170Q155 165 160 160Z" fill="#8B5CF6" opacity="0.6" />
          </g>
        </svg>
      </div>
    );
  }
  
  // Default crochet ball variant
  return (
    <div className={baseClass} style={{ width: size, height: size }}>
      <svg 
        viewBox="0 0 200 200" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="ballGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF3C7" />
            <stop offset="30%" stopColor="#D4AF37" />
            <stop offset="70%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <radialGradient id="ballShine" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FFFFFF" opacity="0.8" />
            <stop offset="70%" stopColor="#FFFFFF" opacity="0.2" />
            <stop offset="100%" stopColor="#FFFFFF" opacity="0" />
          </radialGradient>
        </defs>
        
        {/* Outer glow */}
        <circle 
          cx="100" 
          cy="100" 
          r="85" 
          fill="#FEF3C7" 
          opacity="0.2"
          className={animate ? "animate-ping" : ""}
        />
        
        {/* Main yarn ball */}
        <circle 
          cx="100" 
          cy="100" 
          r="70" 
          fill="url(#ballGradient)"
          className={animate ? "animate-pulse" : ""}
        />
        
        {/* Shine effect */}
        <circle cx="100" cy="100" r="70" fill="url(#ballShine)" />
        
        {/* Yarn strands */}
        <g stroke="#FFFFFF" strokeWidth="3" fill="none" opacity="0.8">
          <path 
            d="M50 80Q70 70 90 80Q110 90 130 80Q150 70 170 80" 
            className={animate ? "animate-pulse" : ""}
          />
          <path 
            d="M50 100Q70 90 90 100Q110 110 130 100Q150 90 170 100" 
            className={animate ? "animate-pulse" : ""}
          />
          <path 
            d="M50 120Q70 110 90 120Q110 130 130 120Q150 110 170 120" 
            className={animate ? "animate-pulse" : ""}
          />
        </g>
        
        {/* Crochet hook */}
        <g className={animate ? "animate-bounce" : ""}>
          <line x1="140" y1="50" x2="160" y2="30" stroke="#8B5CF6" strokeWidth="4" strokeLinecap="round" />
          <path d="M155 25L165 25M160 20L160 30" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" />
        </g>
        
        {/* Decorative elements */}
        <g className={animate ? "animate-pulse" : ""}>
          <circle cx="40" cy="60" r="4" fill="#EC4899" opacity="0.8" />
          <circle cx="160" cy="140" r="4" fill="#D4AF37" opacity="0.8" />
          <path d="M30 130L35 140L30 150L25 140Z" fill="#8B5CF6" opacity="0.6" />
          <path d="M170 60L175 70L170 80L165 70Z" fill="#EC4899" opacity="0.6" />
        </g>
      </svg>
    </div>
  );
};

export default CrochetFallbackIcon;