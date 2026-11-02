import { DIALOGUES, NEW_VIEWS, THOUGHTS } from "../insights";
import { dialoguesUz, newViewsUz, thoughtsUz } from "../uz/insights";
import { chessPart } from "./make";

/** Мысли, диалоги и «новый взгляд» в тайнах шахмат. */
export const INSIGHT_PART = chessPart(
  { thoughts: THOUGHTS, dialogues: DIALOGUES, newViews: NEW_VIEWS },
  { thoughts: thoughtsUz, dialogues: dialoguesUz, newViews: newViewsUz },
);
