import type { Lang } from "@/lib/lang";
import type { ChessImage } from "./images";
import { IMAGE_PART } from "./parts/images";

const imageMaps: Partial<Record<Lang, Map<string, ChessImage>>> = {};

/** Картинка с подписью на нужном языке. */
export function chessImageIn(lang: Lang, id: string | undefined): ChessImage | undefined {
  if (!id) return undefined;
  const map = (imageMaps[lang] ??= new Map(IMAGE_PART.get(lang).images.map((i) => [i.id, i])));
  return map.get(id);
}

/** Картинки по списку id — те, что есть на диске, с подписями на нужном языке. */
export function chessImagesIn(lang: Lang, ids: string[] | undefined): ChessImage[] {
  return (ids ?? []).map((id) => chessImageIn(lang, id)).filter((i): i is ChessImage => !!i);
}
