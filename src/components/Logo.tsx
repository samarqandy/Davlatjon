export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
      <rect x="2" y="2" width="60" height="60" rx="18" fill="#4f46e5" />
      <line x1="32" y1="9" x2="32" y2="17" stroke="#fde68a" strokeWidth="3" strokeLinecap="round" />
      <circle cx="32" cy="8" r="4" fill="#f59e0b" />
      <rect x="13" y="17" width="38" height="32" rx="11" fill="#eef0ff" />
      <circle cx="25" cy="31" r="5" fill="#1d2140" />
      <circle cx="39" cy="31" r="5" fill="#1d2140" />
      <circle cx="26.5" cy="29.5" r="1.6" fill="#fff" />
      <circle cx="40.5" cy="29.5" r="1.6" fill="#fff" />
      <path d="M25 40 Q32 45 39 40" stroke="#1d2140" strokeWidth="3" fill="none" strokeLinecap="round" />
      <text
        x="54"
        y="58"
        fontSize="15"
        fontWeight="900"
        fill="#fde68a"
        textAnchor="middle"
        fontFamily="Nunito, sans-serif"
      >
        +
      </text>
    </svg>
  );
}
