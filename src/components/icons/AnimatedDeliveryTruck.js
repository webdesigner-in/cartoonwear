"use client";
import { useState } from 'react';

const AnimatedDeliveryTruck = ({ 
  className = "w-6 h-6", 
  color = "currentColor", 
  isAnimating = false,
  onAnimationComplete = () => {}
}) => {
  return (
    <div className={`relative ${className}`}>
      <svg 
        className={`w-full h-full transition-transform duration-1000 ${
          isAnimating ? 'animate-bounce' : ''
        }`} 
        viewBox="0 0 32 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Road line */}
        <path 
          d="M0 20H32" 
          stroke={color}
          strokeWidth="1"
          strokeDasharray="2 2"
          opacity="0.3"
          className={isAnimating ? "animate-pulse" : ""}
        />
        
        {/* Truck Body */}
        <g className={isAnimating ? "animate-slide-right" : ""}>
          {/* Main cargo area */}
          <path 
            d="M2 6C2 5.44772 2.44772 5 3 5H14C14.5523 5 15 5.44772 15 6V16H2V6Z" 
            fill={color}
            fillOpacity="0.1"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Truck Cab */}
          <path 
            d="M15 9H18.5858C18.851 9 19.1054 9.10536 19.2929 9.29289L22.7071 12.7071C22.8946 12.8946 23 13.149 23 13.4142V16H15V9Z" 
            fill={color}
            fillOpacity="0.1"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Package 1 - Large */}
          <rect 
            x="4" 
            y="7" 
            width="4" 
            height="4" 
            fill={color}
            fillOpacity="0.4"
            stroke={color}
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            rx="0.5"
          />
          
          {/* Package tape cross */}
          <path 
            d="M6 7V11M4 9H8" 
            stroke={color}
            strokeWidth="1"
            strokeLinecap="round"
          />
          
          {/* Package 2 - Medium */}
          <rect 
            x="9" 
            y="8" 
            width="3" 
            height="3" 
            fill={color}
            fillOpacity="0.3"
            stroke={color}
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            rx="0.5"
          />
          
          {/* Package 3 - Small */}
          <rect 
            x="12" 
            y="9" 
            width="2" 
            height="2" 
            fill={color}
            fillOpacity="0.2"
            stroke={color}
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            rx="0.3"
          />
          
          {/* Front wheel */}
          <circle 
            cx="7" 
            cy="18" 
            r="2.5" 
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            className={isAnimating ? "animate-spin" : ""}
          />
          
          {/* Back wheel */}
          <circle 
            cx="19" 
            cy="18" 
            r="2.5" 
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            className={isAnimating ? "animate-spin" : ""}
          />
          
          {/* Wheel spokes */}
          <g className={isAnimating ? "animate-spin" : ""}>
            <path d="M7 15.5V20.5M4.5 18H9.5" stroke={color} strokeWidth="1" opacity="0.6" />
            <path d="M19 15.5V20.5M16.5 18H21.5" stroke={color} strokeWidth="1" opacity="0.6" />
          </g>
          
          {/* Wheel centers */}
          <circle cx="7" cy="18" r="0.5" fill={color} />
          <circle cx="19" cy="18" r="0.5" fill={color} />
          
          {/* Truck chassis */}
          <path 
            d="M4.5 16V18M9.5 16V18M16.5 16V18M21.5 16V18" 
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          
          {/* Truck front details */}
          <path 
            d="M15 11H15.5M15 13H15.5" 
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          
          {/* Headlight */}
          <circle 
            cx="23.5" 
            cy="11" 
            r="0.8" 
            fill={color}
            fillOpacity="0.3"
            stroke={color}
            strokeWidth="1"
            className={isAnimating ? "animate-pulse" : ""}
          />
        </g>
        
        {/* Exhaust smoke when animating */}
        {isAnimating && (
          <g className="animate-float">
            <circle cx="1" cy="8" r="1" fill={color} fillOpacity="0.1" className="animate-ping" />
            <circle cx="0.5" cy="6" r="0.8" fill={color} fillOpacity="0.1" className="animate-ping delay-100" />
            <circle cx="1.5" cy="4" r="0.6" fill={color} fillOpacity="0.1" className="animate-ping delay-200" />
          </g>
        )}
        
        {/* Speed lines when animating */}
        {isAnimating && (
          <g className="animate-fade-in-out">
            <path d="M0 10H3M0 12H4M0 14H2" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.4" />
            <path d="M0 8H2M0 16H3" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.3" />
          </g>
        )}
        
        {/* Delivery success checkmark (appears after animation) */}
        {isAnimating && (
          <g className="animate-check-mark">
            <circle 
              cx="26" 
              cy="8" 
              r="3" 
              fill="#10B981" 
              className="animate-scale-in delay-1000"
            />
            <path 
              d="M24.5 8L25.5 9L27.5 7" 
              stroke="white" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="animate-draw delay-1200"
            />
          </g>
        )}
      </svg>
      
      <style jsx>{`
        @keyframes slide-right {
          0% { transform: translateX(0); }
          100% { transform: translateX(8px); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.1; }
          50% { transform: translateY(-4px) scale(1.1); opacity: 0.3; }
        }
        
        @keyframes fade-in-out {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.6; }
        }
        
        @keyframes scale-in {
          0% { transform: scale(0); }
          100% { transform: scale(1); }
        }
        
        @keyframes draw {
          0% { stroke-dasharray: 0 100; }
          100% { stroke-dasharray: 100 0; }
        }
        
        .animate-slide-right {
          animation: slide-right 1s ease-in-out;
        }
        
        .animate-float {
          animation: float 0.8s ease-in-out infinite;
        }
        
        .animate-fade-in-out {
          animation: fade-in-out 1s ease-in-out infinite;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
        
        .animate-draw {
          animation: draw 0.5s ease-out forwards;
        }
        
        .animate-check-mark {
          opacity: 0;
          animation: fade-in-out 2s ease-in-out 1s forwards;
        }
        
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-1000 { animation-delay: 1s; }
        .delay-1200 { animation-delay: 1.2s; }
      `}</style>
    </div>
  );
};

export default AnimatedDeliveryTruck;