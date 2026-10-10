import Image from "next/image";

/** Знак платформы — птица с шапочкой выпускника (public/logo.webp, пропорции 256×267). */
export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <Image
      src="/logo.webp"
      alt=""
      width={size}
      height={Math.round((size * 267) / 256)}
      unoptimized
      aria-hidden
      className="shrink-0"
    />
  );
}
