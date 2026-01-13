import favicon from "../assets/favicon.png";

export default function Logo({ size = 40 }) {
  return (
    <img
      src={favicon}
      alt="Spendly logo"
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        display: "block",
      }}
    />
  );
}
