import type { Uz } from "../../localize";
import type { CHESS_TESTS } from "../tests";

const q = (title: string, text: string, options: string[], why: string) => ({
  title,
  prompt: "Javobni tanla.",
  hint: "Yana oʻylab koʻr.",
  why,
  questions: [{ text, options }],
});

export const chessTestsUz: Uz<typeof CHESS_TESTS> = {
  "test-1": {
    title: "1-test. Donalar va yurishlar",
    intro:
      "Donalarning yurishlarini va asosiy qoidalarni qanchalik bilishingni tekshir. Oʻn ikkita savol, maslahat yoʻq.",
    exercises: {
      "test-1-1": {
        title: "1. Fil qayerga yuradi",
        prompt: "d4 dagi oq fil yura oladigan hamma kataklarni belgila.",
        hint: "Fil diagonal boʻylab yuradi. Oʻz piyodasi b2 yoʻlni toʻsadi, raqib piyodasi f6 ni esa urib olsa boʻladi.",
        why: "Fil diagonal boʻylab yuradi, lekin oʻz piyodasi b2 ustidan oʻtmaydi. Raqib piyodasi f6 ni oladi va undan nariga bormaydi.",
      },
      "test-1-2": {
        title: "2. Rux qayerga yuradi",
        prompt: "d5 dagi oq rux yura oladigan hamma kataklarni belgila.",
        hint: "Rux vertikal va gorizontal boʻylab yuradi. Oʻz piyodasi b5 chapga yoʻlni toʻsadi.",
        why: "Rux toʻgʻri chiziq boʻylab yuradi. Chapga c5 gacha boradi (b5 da oʻz piyodasi), yuqoriga esa d7 dagi qora piyodani oladi.",
      },
      "test-1-3": {
        title: "3. Ot qayerga sakraydi",
        prompt: "d4 dagi oq ot sakray oladigan hamma kataklarni belgila.",
        hint: "Ot «L» harfi shaklida yuradi. Oʻz donasi turgan katakka tushib boʻlmaydi.",
        why: "Ot yettita katakka sakraydi: e6 katagi oʻz piyodasi bilan band, c6 da esa u qora piyodani oladi.",
      },
      "test-1-4": {
        title: "4. Farzin qayerga yuradi",
        prompt: "d4 dagi oq farzin yura oladigan hamma kataklarni belgila.",
        hint: "Farzin rux va filning kuchini birlashtirib yuradi. Oʻz donalari yoʻlni toʻsadi, raqibnikini u urib oladi.",
        why: "Farzin hamma toʻgʻri va diagonal chiziqlar boʻylab yuradi. Oʻz piyodasi b2 uning a1 ga yoʻlini toʻsadi, g2 da esa raqib piyodasi turibdi, lekin farzin unga yetib bormaydi.",
      },
      "test-1-5": {
        title: "5. Tekin dona",
        prompt: "Oqlar yuradi. Hech kim himoya qilmaydigan qora donani ol.",
        hint: "Oʻylab koʻr: filni qaysi dona bilan urib olsa boʻladi.",
        why: "Ot d5 dagi filni oladi. Filni hech kim himoya qilmaydi, shuning uchun oqlar butun bir donani yutadi.",
      },
      "test-1-6": {
        title: "6. Farzinga yoʻl",
        prompt: "Oqlar yuradi. Piyodani farzingacha yetkaz.",
        hint: "Piyoda oxirgidan oldingi gorizontalda turibdi.",
        why: "Piyoda a8 ga boradi va farzinga aylanadi. e8 dagi shoh uzoqda, toʻsqinlik qila olmaydi.",
      },
      "test-1-7": {
        title: "7. Rokirovka",
        prompt: "Oqlar yuradi. Qisqa rokirovka qil.",
        hint: "Shoh rux tomonga ikki katak yuradi.",
        why: "Shoh g1 ga boradi, h1 dagi rux esa f1 ga oʻtadi: ular orasida boʻsh, shoh yoʻq, shoh va rux hali yurmagan.",
      },
      "test-1-8": q(
        "8. Ruxning bahosi",
        "Rux necha ball turadi?",
        ["5", "3", "9"],
        "Rux 5 ball, ot va fil — 3 tadan, farzin — 9, piyoda — 1 ball turadi.",
      ),
      "test-1-9": q(
        "9. Kim sakraydi",
        "Qaysi dona «L» harfi shaklida yuradi va boshqa donalar ustidan sakray oladi?",
        ["Ot", "Fil", "Rux"],
        "Faqat ot donalar ustidan sakraydi va «L» harfi shaklida yuradi.",
      ),
      "test-1-10": q(
        "10. Shoh bormi",
        "Oqlar yuradi. Oq shohga shoh berilganmi?",
        ["Ha: unga qora rux hujum qilyapti", "Yoʻq"],
        "e2 dagi rux shohning yonida, xuddi shu vertikalda turibdi va unga hujum qilyapti: bu shoh.",
      ),
      "test-1-11": q(
        "11. Piyodaning birinchi yurishi",
        "Piyoda oʻzining boshlangʻich katagidan qanday yura oladi?",
        ["Bir yoki ikki katak oldinga", "Faqat bir katak", "Uch katak"],
        "Boshlangʻich katakdan piyoda bir yoki ikki katak oldinga yuradi, keyin esa faqat bir katak.",
      ),
      "test-1-12": q(
        "12. Filning yurishi",
        "c1 dagi oq fil c2 ga yura oladimi?",
        ["Yoʻq: fil faqat diagonal boʻylab yuradi", "Ha, bir katak oldinga"],
        "Fil diagonal boʻylab yuradi, c2 esa uning toʻgʻrisidagi katak, shuning uchun u yerga yura olmaydi.",
      ),
    },
  },
  "test-2": {
    title: "2-test. Shoh, mot va pat",
    intro: "Shohdan qanday himoyalanishingni va mot qoʻyishingni tekshir. Oʻn ikkita savol, maslahat yoʻq.",
    exercises: {
      "test-2-1": {
        title: "1. Shoh bergan donani urish",
        prompt: "Oqlarga shoh berildi. Shoh bergan donani ur.",
        hint: "Shoh bergan fil. Qaysi dona uni ura oladi?",
        why: "h3 dagi piyoda g4 dagi filni oladi: shoh beradigan dona qolmadi.",
      },
      "test-2-2": {
        title: "2. Toʻsilish",
        prompt: "Oqlarga rux shoh berdi. Fil bilan toʻsil.",
        hint: "Filni rux bilan shoh orasiga qoʻy.",
        why: "Fil c1 ga yoki g1 ga boradi — rux bilan shoh orasidagi chiziqqa. Ikkala yurish ham toʻgʻri.",
      },
      "test-2-3": {
        title: "3. Shoh bilan ketish",
        prompt: "Oqlarga rux shoh berdi. Toʻsilish ham, urish ham mumkin emas. Yagona yurishni top.",
        hint: "Shoh rux urmaydigan katakka ketishi kerak.",
        why: "Shoh c2 ga boradi: e1 dagi rux birinchi gorizontalni uradi, c2 esa uning chizigʻidan tashqarida. a2 va b2 kataklari piyodalar bilan band.",
      },
      "test-2-4": {
        title: "4. Fil bilan mot",
        prompt: "Oqlar yuradi. Fil bilan mot qoʻy.",
        hint: "Fil diagonal boʻylab shoh bersin, shohning esa ketadigan joyi qolmasin.",
        why: "Fil f4 ga boradi: b8 dagi shohga diagonal boʻylab shoh. Shoh atrofidagi kataklar oʻz donalari bilan band yoki zarba ostida, toʻsiladigan narsa yoʻq.",
      },
      "test-2-5": {
        title: "5. Piyoda bilan mot",
        prompt: "Oqlar yuradi. Piyoda bilan mot qoʻy.",
        hint: "Piyoda diagonal boʻylab shoh beradi, uni esa rux himoya qiladi.",
        why: "Piyoda b7 ga boradi: a8 dagi shohga shoh. Uni b1 dagi rux himoya qiladi, shoh bilan fil piyodani ura olmaydi, shohning esa ketadigan joyi yoʻq.",
      },
      "test-2-6": {
        title: "6. Tayanchli farzin bilan mot",
        prompt: "Oqlar yuradi. Farzin bilan mot qoʻy — unga fil yordam beradi.",
        hint: "Farzin shoh yonidagi piyodani oladi, fil esa uni himoya qiladi.",
        why: "Farzin a7 ni oladi: uni e3 dagi fil himoya qiladi, shoh uni ura olmaydi. Shohning ketadigan joyi yoʻq — mot.",
      },
      "test-2-7": {
        title: "7. Mot, pat emas",
        prompt: "Oqlar yuradi va yutadi. Mot top — lekin patdan ehtiyot boʻl!",
        hint: "Farzin shoh bersin, c6 dagi shoh esa uni himoya qilsin. b6 ga yurish — pat.",
        why: "Farzin b7 — mot: uni c6 dagi shoh himoya qiladi. Farzinning b6 ga yurishi esa pat: yuradigan narsa yoʻq, shoh ham yoʻq.",
      },
      "test-2-8": {
        title: "8. Patni top",
        prompt: "Oqlar yutyapti, lekin farzinning bitta yurishi — pat. Uni top, shunday yurmaslik uchun.",
        hint: "Shunday yurish kerak: shoh yoʻq, lekin qora shohning yuradigan joyi ham qolmaydi.",
        why: "g6 dagi farzin h8 dagi shohning hamma kataklarini yopadi, lekin shoh bermaydi — bu pat, durrang. Toʻgʻri yoʻl — farzin g7 ga mot bilan.",
      },
      "test-2-9": q(
        "9. Mot yoki pat",
        "Qoralar yuradi. Bu yerda nima yuz berdi?",
        ["Pat: yuradigan narsa yoʻq, shoh ham yoʻq", "Mot", "Hech narsa, partiya davom etadi"],
        "Qora shohga shoh yoʻq, lekin uning hamma kataklari yopilgan: bu pat — durrang.",
      ),
      "test-2-10": q(
        "10. Shohda rokirovka",
        "Oqlar hozir rokirovka qila oladimi?",
        ["Yoʻq: shoh shoh ostida", "Ha, ikkala tomonga"],
        "Shohga shoh berilganda rokirovka qilib boʻlmaydi. Avval himoyalanish kerak.",
      ),
      "test-2-11": q(
        "11. Qoʻsh shoh",
        "Shoh qoʻsh shoh ostida. Qanday himoyalanish mumkin?",
        ["Faqat shohning yurishi bilan", "Shoh bergan donalardan birini urish", "Istalgan dona bilan toʻsilish"],
        "Qoʻsh shohdan na toʻsilib, na ikkala donani urib boʻladi: faqat shohning yurishi qoladi.",
      ),
      "test-2-12": q(
        "12. Mot nima",
        "Mot uchun nima kerak?",
        [
          "Chiqib boʻlmaydigan shoh: shohning ketadigan joyi yoʻq va shohni bartaraf etib boʻlmaydi",
          "Shunchaki shoh",
          "Farzinni urib olish",
        ],
        "Mot — himoyalanib boʻlmaydigan shoh: na urib, na toʻsilib, na ketib boʻladi.",
      ),
    },
  },
  "test-3": {
    title: "3-test. Taktika",
    intro: "Vilka, bogʻlash, rentgen va ochiq shohni qanday topishingni tekshir. Oʻn ikkita savol, maslahat yoʻq.",
    exercises: {
      "test-3-1": {
        title: "1. Rux bilan vilka",
        prompt: "Rux bilan shunday yurish top: u bir yoʻla ot va filga hujum qilsin.",
        hint: "Fil va ot bir gorizontalda turibdi.",
        why: "Rux e5 ga boradi va b5 dagi filga hamda g5 dagi otga hujum qiladi. Ikkala dona himoyasiz.",
      },
      "test-3-2": {
        title: "2. Fil bilan vilka",
        prompt: "Fil bilan shunday yurish top: u ikkala qora ruxga hujum qilsin.",
        hint: "Fil diagonal boʻylab hujum qiladi: ikkala rux koʻrinadigan katakni top.",
        why: "Fil d5 ga boradi va a8 hamda g8 dagi ruxlarga hujum qiladi. Oqlar ulardan birini oladi.",
      },
      "test-3-3": {
        title: "3. Farzin bilan vilka",
        prompt: "Farzin bilan shunday yurish top: u rux va filga hujum qilsin.",
        hint: "Farzin ham rux, ham fil kabi yuradi: ikki zarba uchun katak top.",
        why: "Farzin e5 ga boradi: diagonal boʻylab h8 dagi ruxga, gorizontal boʻylab b5 dagi filga hujum qiladi.",
      },
      "test-3-4": {
        title: "4. Fil bilan bogʻlash",
        prompt: "Fil bilan shunday yurish top: u f6 dagi qora otni d8 dagi shoh bilan bogʻlasin.",
        hint: "Fil ot va shoh turgan diagonalga chiqishi kerak.",
        why: "Fil g5 ga boradi: f6 dagi ot fil bilan d8 dagi shoh orasida qoladi va ketib qola olmaydi.",
      },
      "test-3-5": {
        title: "5. Rux bilan bogʻlash",
        prompt: "Rux bilan shunday yurish top: u d5 dagi otni d8 dagi shoh bilan bogʻlasin.",
        hint: "Rux ot va shoh turgan vertikalga chiqishi kerak.",
        why: "Rux d1 ga boradi: d5 dagi ot d8 dagi shoh bilan bogʻlanadi va vertikaldan chiqib keta olmaydi.",
      },
      "test-3-6": {
        title: "6. Rux bilan rentgen",
        prompt: "Rux bilan shoh ber: undan keyin shoh ortida farzin turadi.",
        hint: "Shoh va farzin bir gorizontalda turibdi.",
        why: "Rux h8 ga boradi: shoh. Shoh ketadi, rux esa a8 dagi farzinni oladi.",
      },
      "test-3-7": {
        title: "7. Fil bilan rentgen",
        prompt: "Fil bilan shoh ber: undan keyin shoh ortida rux qoladi.",
        hint: "Shoh va rux bir diagonalda turibdi. Fil shu diagonalga boshqa tomondan chiqsin.",
        why: "Fil b2 ga boradi: diagonal boʻylab shoh, shoh ortida esa h8 dagi rux. Shoh ketadi, fil ruxni oladi.",
      },
      "test-3-8": {
        title: "8. Ot bilan ochiq shoh",
        prompt: "Ot ruxni shohdan toʻsib turibdi. Ot bilan shunday yurish top: u farzinni olsin va shohni ochsin.",
        hint: "Ot vertikaldan ketishi va farzinni olishi kerak.",
        why: "Ot e4 dagi farzinni oladi va d vertikalini ochadi: shohni rux beradi.",
      },
      "test-3-9": {
        title: "9. Ochiq shoh: diagonal",
        prompt:
          "h1 dagi fil a8 dagi shohga qaragan, lekin e4 dagi ot halaqit beryapti. Ot bilan shunday yurish top: u farzinni olsin.",
        hint: "Ot uzun diagonaldan ketib, farzinni olishi kerak.",
        why: "Ot d6 dagi farzinni oladi va diagonalni ochadi: h1 dagi fil shoh beradi.",
      },
      "test-3-10": {
        title: "10. Oʻtib ketayotganda olish",
        prompt: "Qoralar yuradi. Oq piyoda hozirgina ikki katak yurdi. Oʻtib ketayotganda olishni top.",
        hint: "Qora piyoda pastga diagonal boʻylab uradi — oq piyoda sakrab oʻtgan katakka.",
        why: "e4 dagi piyoda d3 ga boradi va d4 dagi piyodani oladi: oʻtib ketayotganda faqat darrov olinadi.",
      },
      "test-3-11": q(
        "11. Vilka nima",
        "Vilka nima?",
        [
          "Bitta donaning bir yoʻla ikkita nishonga hujumi",
          "Donaning shoh bilan bogʻlanishi",
          "Shohni yurgan dona emas, uning ortida turgani beradigan shoh",
        ],
        "Vilka — bitta donaning bir vaqtda ikkita nishonga hujumi.",
      ),
      "test-3-12": q(
        "12. Bolalar motidan himoya",
        "Qoralar yuradi. Oqlar f7 da farzin bilan mot qoʻyishga tahdid qilyapti. Qaysi yurish qutqaradi?",
        ["g7 piyodasi g6 ga: u farzinga hujum qiladi", "g8 dagi ot f6 ga", "a7 piyodasi a6 ga"],
        "g6 piyodasi farzinni haydaydi, mot yoʻq. Ot f6 yordam bermaydi: farzin f7 ni urib, mot qoʻyadi.",
      ),
    },
  },
};
