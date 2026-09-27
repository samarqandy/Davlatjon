import Image from "next/image";
import { cn } from "@/components/ui";
import { type ChessImage, imageCredit, isPublicDomain } from "@/content/chess/images";

const KIND_PREFIX: Record<ChessImage["kind"], string> = {
  person: "Фото: ",
  place: "Фото: ",
  object: "Фото: ",
  art: "",
};

/** Строка «откуда картинка»: автор, лицензия и ссылка на источник — так требуют свободные лицензии. */
export function Credit({ image, className }: { image: ChessImage; className?: string }) {
  const known = image.author && !/unknown|неизвест/i.test(image.author);
  const link = "underline decoration-dotted underline-offset-2 hover:text-ink";
  return (
    <span className={cn("text-[11px] leading-tight text-muted", className)}>
      {known ? `${KIND_PREFIX[image.kind]}${image.author} · ` : ""}
      {isPublicDomain(image) ? (
        image.licenseCode === "cc0" ? (
          "CC0"
        ) : (
          "общественное достояние"
        )
      ) : image.licenseUrl ? (
        <a href={image.licenseUrl} target="_blank" rel="noopener noreferrer" className={link}>
          {image.license}
        </a>
      ) : (
        image.license
      )}
      {" · "}
      <a href={image.source} target="_blank" rel="noopener noreferrer" className={link}>
        Wikimedia Commons
      </a>
    </span>
  );
}

/** Картинка с подписью. `fit="cover"` — одинаковые прямоугольники для рядов, `natural` — как есть. */
export function Figure({
  image,
  fit = "natural",
  sizes = "(max-width: 640px) 100vw, 360px",
  className,
}: {
  image: ChessImage;
  fit?: "natural" | "cover";
  sizes?: string;
  className?: string;
}) {
  return (
    <figure className={cn("overflow-hidden rounded-2xl bg-white shadow-card", className)}>
      {fit === "cover" ? (
        <div className="relative aspect-[4/3] bg-line/40">
          <Image src={image.file} alt={image.alt} fill sizes={sizes} className="object-cover object-top" />
        </div>
      ) : (
        <Image
          src={image.file}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes={sizes}
          className="h-auto w-full bg-line/40"
        />
      )}
      <figcaption className="px-3 py-2">
        <p className="text-sm leading-snug font-bold">{image.caption}</p>
        <Credit image={image} className="mt-0.5 block" />
      </figcaption>
    </figure>
  );
}

/** Круглая аватарка: портрет чемпиона или игрока. Подпись и авторство — во всплывающей подсказке. */
export function Portrait({ image, size = 56, className }: { image: ChessImage; size?: number; className?: string }) {
  return (
    <Image
      src={image.thumb}
      alt={image.alt}
      width={size}
      height={size}
      title={`${image.caption}. ${imageCredit(image)}`}
      className={cn("shrink-0 rounded-full bg-line/40 object-cover shadow-sm ring-2 ring-white", className)}
      style={{ width: size, height: size }}
    />
  );
}

/** Ряд одинаковых картинок к партии или событию. */
export function PhotoStrip({ images, className }: { images: ChessImage[]; className?: string }) {
  if (!images.length) return null;
  return (
    <div
      className={cn(
        "flex snap-x gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3",
        className,
      )}
    >
      {images.map((img) => (
        <Figure
          key={img.id}
          image={img}
          fit="cover"
          sizes="(max-width: 640px) 240px, 320px"
          className="w-60 shrink-0 snap-start sm:w-auto"
        />
      ))}
    </div>
  );
}

/** Список всех картинок с авторами и лицензиями — раздел «Откуда картинки». */
export function ImageCredits({ images }: { images: ChessImage[] }) {
  return (
    <ul className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
      {images.map((img) => (
        <li key={img.id} className="flex items-center gap-2">
          <Portrait image={img} size={32} />
          <span className="min-w-0">
            <span className="block truncate font-bold">{img.caption}</span>
            <Credit image={img} />
          </span>
        </li>
      ))}
    </ul>
  );
}
