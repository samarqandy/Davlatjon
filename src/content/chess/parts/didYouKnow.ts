import { DID_YOU_KNOW } from "../secrets";
import { didYouKnowUz } from "../uz/secrets";
import { chessPart } from "./make";

/** «Знаешь ли ты?» */
export const DID_YOU_KNOW_PART = chessPart({ didYouKnow: DID_YOU_KNOW }, { didYouKnow: didYouKnowUz });
