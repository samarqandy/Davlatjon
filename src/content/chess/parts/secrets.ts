import { DILARAM, PIECE_NAMES_RU, RIDDLES, SECRETS, TURK_OPTIONS, TURK_REVEAL } from "../secrets";
import { dilaramUz, pieceNamesUz, riddlesUz, secretsUz, turkOptionsUz, turkRevealUz } from "../uz/secrets";
import { chessPart } from "./make";

/** Тайны шахмат: истории, загадки, Дилором, имена фигур, «механический турок». */
export const SECRET_PART = chessPart(
  {
    secrets: SECRETS,
    riddles: RIDDLES,
    dilaram: DILARAM,
    pieceNames: PIECE_NAMES_RU,
    turkOptions: TURK_OPTIONS,
    turkReveal: TURK_REVEAL,
  },
  {
    secrets: secretsUz,
    riddles: riddlesUz,
    dilaram: dilaramUz,
    pieceNames: pieceNamesUz,
    turkOptions: turkOptionsUz,
    turkReveal: turkRevealUz || undefined,
  },
);
