import { CHESS_TESTS } from "../tests";
import { chessTestsUz } from "../uz/tests";
import { chessPart } from "./make";

/** Тесты по шахматам. */
export const TEST_PART = chessPart({ tests: CHESS_TESTS }, { tests: chessTestsUz });
