import { CHESS_IMAGES } from "../images";
import { imagesUz } from "../uz/images";
import { chessPart } from "./make";

/** Картинки с подписями. */
export const IMAGE_PART = chessPart({ images: CHESS_IMAGES }, { images: imagesUz });
