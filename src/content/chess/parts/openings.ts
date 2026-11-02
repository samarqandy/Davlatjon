import { OPENINGS, OPENING_CATEGORIES, OPENING_PRINCIPLES } from "../openings";
import { openingCategoriesUz, openingPrinciplesUz, openingsUz } from "../uz/openings";
import { chessPart } from "./make";

/** Дебюты, их группы и правила начала партии. */
export const OPENING_PART = chessPart(
  { openings: OPENINGS, openingCategories: OPENING_CATEGORIES, openingPrinciples: OPENING_PRINCIPLES },
  { openings: openingsUz, openingCategories: openingCategoriesUz, openingPrinciples: openingPrinciplesUz },
);
