const PackageTruck = ({ className = "w-6 h-6", color = "currentColor" }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Truck Body */}
      <path 
        d="M2 5C2 4.44772 2.44772 4 3 4H12C12.5523 4 13 4.44772 13 5V15H2V5Z" 
        fill={color}
        fillOpacity="0.1"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Truck Cab */}
      <path 
        d="M13 8H16.5858C16.851 8 17.1054 8.10536 17.2929 8.29289L19.7071 10.7071C19.8946 10.8946 20 11.149 20 11.4142V15H13V8Z" 
        fill={color}
        fillOpacity="0.1"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Package in truck bed */}
      <rect 
        x="4" 
        y="6" 
        width="4" 
        height="4" 
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        rx="0.5"
      />
      
      {/* Package details - cross on top */}
      <path 
        d="M6 6V10M4 8H8" 
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
      />
      
      {/* Second smaller package */}
      <rect 
        x="9" 
        y="7" 
        width="3" 
        height="3" 
        fill={color}
        fillOpacity="0.2"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        rx="0.5"
      />
      
      {/* Front wheel */}
      <circle 
        cx="6" 
        cy="17" 
        r="2" 
        fill="none"
        stroke={color}
        strokeWidth="1.5"
      />
      
      {/* Back wheel */}
      <circle 
        cx="16" 
        cy="17" 
        r="2" 
        fill="none"
        stroke={color}
        strokeWidth="1.5"
      />
      
      {/* Wheel centers */}
      <circle cx="6" cy="17" r="0.5" fill={color} />
      <circle cx="16" cy="17" r="0.5" fill={color} />
      
      {/* Truck chassis */}
      <path 
        d="M4 15V17M8 15V17M14 15V17M18 15V17" 
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      
      {/* Truck front grille */}
      <path 
        d="M13 10H13.5M13 12H13.5" 
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      
      {/* Motion lines for movement effect */}
      <path 
        d="M1 7H1.5M1 9H2M1 11H1.5" 
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
};

export default PackageTruck;