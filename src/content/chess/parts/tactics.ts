import { TACTICS, TACTICS_SCHOOL } from "../tactics";
import { tacticsSchoolUz, tacticsUz } from "../uz/tactics";
import { chessPart } from "./make";

/** Школа тактики. */
export const TACTIC_PART = chessPart(
  { tactics: TACTICS, tacticsSchool: TACTICS_SCHOOL },
  { tactics: tacticsUz, tacticsSchool: tacticsSchoolUz },
);
