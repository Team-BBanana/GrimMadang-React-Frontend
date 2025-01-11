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
        <path d="M6 3a3 3 0 0 1 3 3m0 12a3 3 0 0 1 -3 3m12 0a3 3 0 0 1 -3 -3m0 -12a3 3 0 0 1 3 -3" />
        <path d="M9 6h6m-6 12h6" />
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
        <path d="M12 5l0 14m-6 -6l6 6l6 -6" />
    </svg>
); 