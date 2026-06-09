export const MacCursor: React.FC<{ size?: number }> = ({ size = 46 }) => (
    <svg width={size} height={size * 1.1} viewBox="0 0 20 22"
        style={{ filter: "drop-shadow(0 4px 7px rgba(0,0,0,0.45))" }}>
        <path d="M3 1 L3 17 L7 13.3 L9.7 19 L12 18 L9.3 12.4 L15 12.4 Z"
            fill="#0a0a0a" stroke="#fff" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
);