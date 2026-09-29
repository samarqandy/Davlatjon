import type { Uz } from "./localize";
import type { REVIEW_QUESTIONS } from "./review";

/** Вопросы еженедельного наблюдения по-узбекски — по id вопроса. */
export const reviewUz: Uz<typeof REVIEW_QUESTIONS> = {
  fast: {
    text: "{child} nimani tez va ishonch bilan yechadi?",
    hint: "Maslahatsiz va birinchi urinishda yechilgan masalalar.",
  },
  mistakes: {
    text: "U qayerda xato qiladi?",
    hint: "Toʻgʻri javob birinchi urinishda chiqmagan masalalar. Bu xatolar qanday turdagi xatolar?",
  },
  enjoys: {
    text: "Unga qanday masalalar yoqadi?",
    hint: "«Masala yoqdi» belgilari va kunning eng qiziq masalasi.",
  },
  difficult: {
    text: "Qaysi turdagi masalalar unga qiyinroq?",
    hint: "3 va undan koʻp maslahat kerak boʻlgan yoki «Qiyin boʻldi, lekin uddaladim» deb belgilangan masalalar.",
  },
  explains: {
    text: "U oʻz yechimini tushuntiradimi?",
    hint: "«Yechimni tushuntirdim» belgilari — va mashgʻulot paytidagi kuzatuvlaringiz.",
  },
  alternatives: {
    text: "U boshqa yechish usullarini topadimi?",
    hint: "«Boshqa usul topdim» belgilari va bir nechta javobi bor masalalarda topilgan variantlar.",
  },
  patterns: {
    text: "U qonuniyatlarni oʻzi payqaydimi?",
    hint: "Qonuniyatlarga oid, maslahatsiz yechilgan masalalar.",
  },
  checks: {
    text: "U javoblarini tekshiradimi?",
    hint: "Teskari amal bilan tekshiradimi, robotni ishga tushirib koʻradimi, eslatmasangiz ham qayta hisoblaydimi.",
  },
  creates: {
    text: "U oʻz masala va misollarini oʻylab topadimi?",
    hint: "«Mening masalalarim» boʻlimi va kuzatuvlaringiz.",
  },
  persists: {
    text: "Qiyin masalalarda u qatʼiyatlimi?",
    hint: "🟠–⭐ darajadagi masalalarga ketgan vaqt, maslahatdan keyingi yechimlar, masalaga qaytib kelishi.",
  },
};
