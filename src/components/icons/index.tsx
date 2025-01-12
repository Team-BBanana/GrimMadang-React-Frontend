interface IconProps {
    className?: string;
    size?: number;
    color?: string;
}

export const BrushIcon = ({ className, size = 24, color = "currentColor" }: IconProps) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        className={className}
        fill="none" 
        stroke={color}
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <path d="M3 21v-4a4 4 0 1 1 4 4h-4" />
        <path d="M21 3a16 16 0 0 0 -12.8 10.2" />
        <path d="M21 3a16 16 0 0 1 -10.2 12.8" />
        <path d="M10.6 9a9 9 0 0 1 4.4 4.4" />
    </svg>
);

export const EraserIcon = ({ className, size = 24, color = "currentColor" }: IconProps) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        className={className}
        fill="none" 
        stroke={color}
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <path d="M19 20h-10.5l-4.21 -4.3a1 1 0 0 1 0 -1.41l10 -10a1 1 0 0 1 1.41 0l5 5a1 1 0 0 1 0 1.41l-9.2 9.3" />
        <path d="M18 13.3l-6.3 -6.3" />
    </svg>
);

export const SelectIcon = ({ className, size = 24, color = "currentColor" }: IconProps) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        className={className}
        fill="none" 
        stroke={color}
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <path d="M9 3.5V2M5.06066 5.06066L4 4M5.06066 13L4 14.0607M13 5.06066L14.0607 4M3.5 9H2M8.5 8.5L12.6111 21.2778L15.5 18.3889L19.1111 22L22 19.1111L18.3889 15.5L21.2778 12.6111L8.5 8.5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
);

export const FillIcon = ({ className, size = 24, color = "currentColor" }: IconProps) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 30 30" 
        className={className}
        fill="none" 
        stroke={color}
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <path d="M7,27c0,1.1-0.9,2-2,2s-2-0.9-2-2s2-3,2-3S7,25.9,7,27z"/>
        <path d="M3.6,19.6L3.6,19.6c0.9,0.9,2.3,0.9,3.2,0L19.8,6.7l0,0c-1.1-1.1-2.9-1.1-4,0l-4,4c-2.2,2.2-4.7,4-7.6,5.2l0,0	C2.8,16.6,2.5,18.5,3.6,19.6z"/>
        <path d="M19.8,6.7L28,16c1.3,1.5,1.2,3.7-0.2,5.1l-5.6,5.6c-1.4,1.4-3.6,1.5-5.1,0.2l-9.3-8.2"/>
        <circle cx="18" cy="17" r="2"/>
        <path d="M19.3,6.3C23,3.5,26,2,27,3c1.4,1.4-2,7-7.6,12.6"/>
    </svg>
);

export const MoveIcon = ({ className, size = 24, color = "currentColor" }: IconProps) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        className={className}
        fill="none" 
        stroke={color}
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <path d="M12 3V21M12 3L9 6M12 3L15 6M12 21L15 18M12 21L9 18M3 12H21M3 12L6 15M3 12L6 9M21 12L18 9M21 12L18 15" />
    </svg>
);

export const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
  </svg>
);

export const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
  </svg>
); 