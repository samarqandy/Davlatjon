import { SAGES } from "../secrets";
import { sagesUz } from "../uz/secrets";
import { chessPart } from "./make";

/** Мудрецы Востока (тайны и коллекция героев). */
export const SAGE_PART = chessPart({ sages: SAGES }, { sages: sagesUz });
