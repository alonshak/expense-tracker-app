export default function Logo({ size = 40 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Spendly logo"
    >
      {/* Background */}
      <rect
        x="4"
        y="4"
        width="56"
        height="56"
        rx="16"
        fill="#6366F1"
      />

      {/* Graph line */}
      <path
        d="M18 38 L26 30 L34 36 L44 22"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Dots */}
      <circle cx="18" cy="38" r="2.5" fill="white" />
      <circle cx="26" cy="30" r="2.5" fill="white" />
      <circle cx="34" cy="36" r="2.5" fill="white" />
      <circle cx="44" cy="22" r="2.5" fill="white" />
    </svg>
  );
}
