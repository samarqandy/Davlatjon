import type { Uz } from "../../localize";
import type { CHESS_SCHOOL, LEVEL_EXTRAS } from "../index";

export const schoolUz: Uz<typeof CHESS_SCHOOL> = {
  title: "Shaxmat maktabi",
  subtitle: "Oltita unvon: Piyodadan Shohgacha",
  about:
    "Har bir daraja — bu dars, qoidalar, lugʻatcha, qiziqarli faktlar va haqiqiy shaxmat taxtasidagi mashqlar. Darajadagi hamma mashqlarni yech — va yangi unvonni ol!",
};

export const extrasUz: Uz<typeof LEVEL_EXTRAS> = {
  pawn: {
    play: {
      label: "Piyodalar jangi",
      about: "Faqat piyodalar: piyodasini birinchi boʻlib taxta chetiga yetkazgan yutadi.",
    },
    puzzles: [{ label: "Tekin dona" }],
  },
  knight: {
    play: { label: "«Piyoda» roboti", about: "Eng kuchsiz robot bilan ilk haqiqiy partiya." },
    puzzles: [{ label: "Vilka" }],
  },
  bishop: {
    play: { label: "«Ot» roboti", about: "Bu robot endi himoyasiz donalarni ayamaydi — darrov urib oladi." },
    puzzles: [{ label: "Bogʻlash" }, { label: "Rentgen" }],
  },
  rook: {
    play: {
      label: "Ikki rux bilan mot",
      about: "«Narvon»: ikki rux shohni pogʻonama-pogʻona taxta chetiga haydaydi.",
    },
    puzzles: [{ label: "1 yurishda mot" }],
  },
  queen: {
    play: { label: "Farzin bilan mot", about: "Shoh va farzin yolgʻiz shohga qarshi — eng asosiy usul." },
    puzzles: [{ label: "Ochiq shoh" }, { label: "Mot, pat emas" }],
  },
  king: {
    play: { label: "«Fil» roboti", about: "Jiddiy raqib: ikki yurishni oldindan hisoblaydi." },
    puzzles: [{ label: "2 yurishda mot" }, { label: "3 yurishda mot" }],
  },
};
