import type { Uz } from "../../localize";
import type { COURSE_3, COURSE_3_LESSONS, COURSE_3_MODULES } from "../course3";

export const course3Uz: Uz<typeof COURSE_3> = {
  title: "3-bosqich «Fil»",
  subtitle: "Hujum, oʻtuvchi piyodalar va endshpil",
  about:
    "Gorvits fillari, «ochkoʻz qator», ikki rux bilan hujum, hujumdagi oʻtuvchi piyoda, piyodalar falangasi, kuchsiz kataklar, oppozitsiya, sugsvang, kvadrat qoidasi va piyodalar yorib oʻtishi. Darslar mavzusi va tartibi M.I. Glotovning «Shaxmat mahorati bosqichlari. 3-bosqich „Fil“» kitobi asosida; pozitsiyalar maktab uchun tuzilgan va shaxmat dvigateli bilan tekshirilgan.",
};

export const course3ModulesUz: Uz<typeof COURSE_3_MODULES> = {
  horwitz: { title: "Gorvits fillari" },
  seventh: { title: "Ochkoʻz qator" },
  passer: { title: "Oʻtuvchi piyoda" },
  "pawns-squares": { title: "Falanga va kuchsiz kataklar" },
  "pawn-endgame": { title: "Piyodali endshpil" },
};

export const course3LessonsUz: Uz<typeof COURSE_3_LESSONS> = {
  "c3-horwitz": {
    title: "Gorvits fillari",
    idea: "Qoʻshni diagonallardagi ikki fil rokirovkaga ikki projektor kabi uradi.",
    lesson: [
      {
        title: "Ikki projektor",
        text: [
          "**Gorvits fillari** — yonma-yon turib, raqib rokirovkasiga qoʻshni diagonallar boʻylab qarab turgan ikki fil: biri g7 ni, ikkinchisi h7 ni uradi. Usul XIX asrdagi nemis ustasi Bernhard Gorvits nomi bilan atalgan.",
          "Fillar bilan birga farzin ham hujum qiladi: u fil himoyasida g7 yoki h7 ga bostirib kiradi — va mot qiladi.",
        ],
      },
    ],
    terms: [{ term: "Gorvits fillari", text: "Qoʻshni diagonallarda turib, shohga qaratilgan ikki fil." }],
    exercises: {
      "c3-horwitz-g7": {
        title: "g7 ga zarba",
        prompt: "Oqlar yuradi. Mot qil.",
        hint: "b2 dagi fil g7 ga qarab turibdi.",
        why: "♕xg7# — farzin b2 dagi fil himoyasida piyodani urib oladi, shohning qochadigan joyi yoʻq.",
      },
      "c3-horwitz-h7": {
        title: "h7 ga zarba",
        prompt: "Oqlar yuradi. Mot qil.",
        hint: "d3 dagi fil h7 ga qarab turibdi.",
        why: "♕xh7# — farzinni d3 dagi fil himoya qiladi, shuning uchun shoh uni urib ololmaydi, g8 katagini esa farzinning oʻzi ushlab turibdi.",
      },
    },
  },
  "c3-seventh": {
    title: "Ochkoʻz qator",
    idea: "Yettinchi gorizontaldagi rux piyodalarni «yeydi» va shohni qamab qoʻyadi.",
    lesson: [
      {
        title: "Yettinchi gorizontaldagi rux",
        text: [
          "Shaxmatchilar raqibning yettinchi gorizontalini (qoralar uchun — ikkinchisini) hazillashib **«ochkoʻz qator»** deyishadi: u yerga bostirib kirgan rux oʻz joyida turgan piyodalarga hujum qiladi va shohni oxirgi gorizontalda qamab qoʻyadi.",
          "Shuning uchun ruxni **ochiq vertikal** boʻylab olib borishadi — va birinchi imkoniyatdayoq yettinchi gorizontalga qoʻyishadi.",
        ],
      },
    ],
    terms: [
      {
        term: "Ochkoʻz qator",
        text: "Raqibning yettinchi gorizontali: u yerda rux piyodalarni «yeydi» va shohni qamab qoʻyadi.",
      },
    ],
    exercises: {
      "c3-seventh-choose": {
        title: "Rux qayerga?",
        prompt: "Oqlar yuradi. Rux bilan qayerga yurgan yaxshiroq?",
        hint: "Rux qayerda raqib piyodalariga hujum qiladi?",
        why: "♖b7 — rux yettinchi gorizontalda: u f7 piyodasiga hujum qiladi va shohni oldinga qoʻyib yubormaydi. b3 da esa rux hech narsa qilmaydi.",
      },
      "c3-seventh-mate": {
        title: "Yettinchidagi rux va farzin",
        prompt: "Oqlar yuradi. Mot qil — istalgani toʻgʻri.",
        hint: "Yettinchi gorizontaldagi rux va farzin bir-birini himoya qiladi.",
        why: "Motlar beshta: ♖a8#, ♕a8#, ♕b8#, ♕c8# va ♕xg7#. Eng chiroylisi — ♕xg7#: farzinni a7 dagi rux yettinchi gorizontal boʻylab himoya qiladi.",
      },
    },
  },
  "c3-two-rooks": {
    title: "Ikki rux bilan hujum",
    idea: "Yettinchidagi ikki rux: biri gorizontalni ushlaydi, ikkinchisi shoh beradi.",
    lesson: [
      {
        title: "Qoʻshaloq ruxlar",
        text: [
          "Yettinchi gorizontalga bostirib kirgan ikki rux — ulkan kuch: ular **bir-birini himoya qiladi** va yoʻlidagi hamma narsani urib oladi.",
          "Burchakdagi shohga qarshi bir rux yettinchi gorizontalni ushlab turadi, ikkinchisi esa sakkizinchida shoh beradi — mot.",
        ],
      },
    ],
    terms: [{ term: "Qoʻshaloq ruxlar", text: "Bir chiziqda turib, bir-birini himoya qiladigan ikki rux." }],
    exercises: {
      "c3-two-rooks-mate": {
        title: "Ikki rux bilan mot",
        prompt: "Oqlar yuradi. Mot qil — ikki usul bor.",
        hint: "Bir rux yettinchida qoladi, ikkinchisi sakkizinchi boʻylab shoh beradi.",
        why: "♖b8# yoki ♖f8# — sakkizinchi gorizontal boʻylab shoh, yettinchisini esa ikkinchi rux ushlab turibdi.",
      },
    },
  },
  "c3-passed": {
    title: "Oʻtuvchi piyoda",
    idea: "Oʻtuvchi piyodani yurgizish kerak: u raqib donalarini chalgʻitadi va farzinlikka intiladi.",
    lesson: [
      {
        title: "Piyodalar — farzinlikka!",
        text: [
          "Oʻtuvchi piyoda — katta kuch: uni toʻxtatish uchun raqib uning oldiga dona qoʻyishga majbur. Piyoda oxirgi gorizontalga qancha yaqin boʻlsa, shuncha xavfli.",
          "Agar piyodani dona qoʻriqlayotgan boʻlsa, baʼzan uni **aylanish bilan urib olish** — va darhol donani yutish mumkin.",
        ],
      },
    ],
    terms: [
      {
        term: "Aylanish bilan urish",
        text: "Piyoda oxirgi gorizontaldagi donani urib, darhol boshqa donaga aylanadi.",
      },
    ],
    exercises: {
      "c3-passed-choose": {
        title: "Qaysi aylanish yaxshiroq?",
        prompt: "Oqlar yuradi. b7 piyodasi ikki usulda aylanishi mumkin. Qaysi biri yaxshiroq?",
        hint: "a8 dagi rux b8 katagini qoʻriqlab turibdi.",
        why: "bxa8♕# — piyoda ruxni urib oladi va darhol oxirgi gorizontalda mot qiladi. b8♕+? ♖xb8 dan keyin esa farzin qoʻldan ketadi.",
      },
    },
  },
  "c3-passed-attack": {
    title: "Hujumdagi oʻtuvchi piyoda",
    idea: "Oʻtuvchi piyoda rux bilan birga partiyani mot bilan hal qila oladi.",
    lesson: [
      {
        title: "Piyoda va rux",
        text: [
          "Oʻtuvchi piyodaning **orqasida** turgan rux uni butun yoʻl davomida himoya qiladi. Piyoda chetga yetganda, yangi farzin himoya ostida boʻladi — va mot qilishi mumkin.",
        ],
      },
    ],
    terms: [{ term: "Piyoda orqasidagi rux", text: "Oʻtuvchi piyodani butun yoʻli davomida himoya qiladi." }],
    exercises: {
      "c3-passed-attack-mate": {
        title: "Nafis yakun",
        prompt: "Oqlar yuradi. Mot qil.",
        hint: "Yangi farzin e1 dagi rux himoyasida boʻladi.",
        why: "e8♕# — farzinni e1 dagi rux himoya qiladi, u f7 va f8 ni ushlab turadi, g7 va h7 piyodalari esa shohni qamab qoʻygan.",
      },
      "c3-passed-quiz": {
        title: "Ruxni qayerga qoʻyish kerak?",
        prompt: "Savollarga javob ber.",
        questions: [
          {
            text: "Oʻz oʻtuvchi piyodasiga yordam berish uchun rux qayerda turgani yaxshi?",
            options: ["piyoda orqasida", "piyoda oldida"],
          },
          { text: "Oʻtuvchi piyoda bilan nima qilish kerak?", options: ["oldinga yurgizish", "joyida ushlab turish"] },
        ],
        hint: "Piyoda orqasidagi rux uni har bir qadamda himoya qiladi.",
        why: "Oʻtuvchi piyoda orqasidagi rux uni butun yoʻl davomida himoya qiladi. Oʻtuvchi piyodalarni yurgizish kerak — ular raqib donalarini chalgʻitadi.",
      },
    },
  },
  "c3-phalanx": {
    title: "Piyodalar falangasi",
    idea: "Bir gorizontalda yonma-yon turgan piyodalar — kuch: ular koʻp katakni ushlaydi va bir-birini qoʻllaydi.",
    lesson: [
      {
        title: "Yelkama-yelka piyodalar",
        text: [
          "**Falanga** — bir gorizontalda yonma-yon turgan ikki yoki undan koʻp piyoda, masalan d4 va e4. Bunday piyodalar oldindagi bir qator katakni birdaniga uradi va bir-birini qoʻllab, oldinga yura oladi.",
          "Markazdagi d4–e4 falangasi raqib donalariga markazni egallashga yoʻl bermaydi. Nimsovich va Chigorin kabi ustalar uni qurishni ham, buzishni ham bilishgan.",
        ],
      },
    ],
    terms: [{ term: "Piyodalar falangasi", text: "Bir gorizontalda yonma-yon turgan piyodalar." }],
    exercises: {
      "c3-phalanx-quiz": {
        title: "Falanga nima?",
        prompt: "Toʻgʻri javobni tanla.",
        questions: [
          { text: "Qaysi piyodalar falanga hosil qiladi?", options: ["d4 va e4", "c2 va f2"] },
          {
            text: "Markazdagi falanganing kuchi nimada?",
            options: ["markazdagi kataklarni ushlaydi", "burchakdagi shohni himoya qiladi"],
          },
        ],
        hint: "Falanga — bir gorizontalda yonma-yon turgan piyodalar.",
        why: "d4 va e4 yonma-yon turibdi — bu falanga. Ular birga c5, d5, e5 va f5 ni uradi va raqib donalarini markazga qoʻymaydi.",
      },
    },
  },
  "c3-weak-squares": {
    title: "Kuchsiz kataklar",
    idea: "Piyoda himoya qila olmaydigan katak — ot uchun ajoyib uy.",
    lesson: [
      {
        title: "Abadiy ot",
        text: [
          "**Kuchsiz katak** — raqib endi piyoda bilan himoya qila olmaydigan katak. Markazdagi shunday katakka turgan ot — **«abadiy ot»**: uni piyoda bilan quvib boʻlmaydi.",
          "Bunday kataklarni raqib piyodalari oldida, qoʻshni vertikallarda piyoda qolmagan joyda qidir.",
        ],
      },
    ],
    terms: [
      { term: "Kuchsiz katak", text: "Raqib piyoda bilan himoya qila olmaydigan katak." },
      { term: "Abadiy ot", text: "Markazdagi kuchsiz katakdagi ot: uni piyoda bilan quvib boʻlmaydi." },
    ],
    exercises: {
      "c3-weak-knight": {
        title: "Ot uchun uy",
        prompt: "Oqlar yuradi. Otni qayerga qoʻygan yaxshiroq?",
        hint: "c va e vertikallarida qoralarning piyodalari bormi?",
        why: "♘d5 — markazda, va qora piyodalarning hech biri uni quva olmaydi: c va e vertikallarida qora piyoda yoʻq. h5 da ot chetda turadi va uni g6 quvib yuboradi.",
      },
    },
  },
  "c3-weak-attack": {
    title: "Hujumda kuchsiz kataklar",
    idea: "Shoh yonidagi f6 piyodasi g7 ni kuchsiz qiladi — u yerga farzin bostirib kiradi.",
    lesson: [
      {
        title: "Ponasimon piyoda",
        text: [
          "Agar oq piyoda qoralar rokirovkasi oldida **f6** ga (yoki h6 ga) tursa, **g7** va h8 kataklari kuchsiz boʻlib qoladi: piyoda ularni himoya qiladi, qoralar esa ularni yopa olmaydi.",
          "Shunda farzinning h6 ga yetib kelishi kifoya — g7 da mot boʻladi. E. Lasker, M. Tal va P. Keres shunday hujum qilishgan.",
        ],
      },
    ],
    terms: [{ term: "Ponasimon piyoda", text: "Raqib shohi yonidagi pozitsiyaga suqilib kirgan piyoda." }],
    exercises: {
      "c3-weak-attack-mate": {
        title: "Kuchsiz katakka zarba",
        prompt: "Oqlar yuradi. Mot qil.",
        hint: "f6 dagi piyoda g7 katagini himoya qiladi.",
        why: "♕g7# — farzin f6 piyodasi himoyasida kuchsiz katakka turdi, shohning esa qochadigan joyi yoʻq.",
      },
    },
  },
  "c3-opposition": {
    title: "Oppozitsiya va sugsvang",
    idea: "Shohlar roʻparama-roʻpara: kim yursa — oʻsha yoʻl beradi.",
    lesson: [
      {
        title: "Sugsvang",
        text: [
          "**Sugsvang** — har qanday yurish pozitsiyani yomonlashtiradigan, yurishni oʻtkazib yuborish esa mumkin boʻlmagan holat. Piyodali endshpilda sugsvang hamma narsani hal qiladi.",
          "**Oppozitsiya** — shohlar bir katak oraliq bilan bir-biriga qarama-qarshi turadi. Kim yursa, oʻsha yoʻl berishga majbur. «Kimda oppozitsiya boʻlsa, oʻsha yutadi» deyishadi.",
        ],
      },
      {
        title: "Shoh piyodadan oldinda",
        text: [
          "Asosiy qoida: «shoh va piyoda shohga qarshi» endshpilida shoh **oʻz piyodasidan oldinda** yuradi. Piyodani shoh unga yoʻlni tozalagandan keyin yurgizishadi.",
        ],
      },
    ],
    terms: [
      { term: "Oppozitsiya", text: "Shohlar bir katak oraliq bilan bir-biriga qarama-qarshi." },
      { term: "Sugsvang", text: "Har qanday yurish pozitsiyani yomonlashtiradi, yurishni oʻtkazib yuborib boʻlmaydi." },
    ],
    exercises: {
      "c3-opposition-choose": {
        title: "Shoh oldinda!",
        prompt: "Oqlar yuradi. Qanday yutish mumkin?",
        hint: "Birinchi kim yurishi kerak — shohmi yoki piyodami?",
        why: "♔e5! — shoh piyodadan oldinda va oppozitsiyani egalladi: qoralar yoʻl berishga majbur va piyoda oʻtadi. e5? dan keyin esa ♚e6 — qora shoh piyoda oldiga turadi, durang.",
      },
      "c3-zugzwang-quiz": {
        title: "Kimning yurishi?",
        prompt: "Shohlar oppozitsiyada turibdi. Savollarga javob ber.",
        questions: [
          { text: "Oqlar yuradi. Eng yaxshi oʻyinda partiya nima bilan tugaydi?", options: ["oqlar yutadi", "durang"] },
          { text: "Bu pozitsiyada qoralar yursa-chi?", options: ["oqlar yutadi", "durang"] },
        ],
        hint: "Kimda oppozitsiya boʻlsa — oʻsha yutadi. Kim yursa, oʻsha yoʻl beradi.",
        why: "Oqlar yursa — ular oppozitsiyani boy beradi va qoralar durangni saqlaydi. Qoralar yursa — bu sugsvang: shoh yoʻl beradi va oqlar yutadi.",
      },
    },
  },
  "c3-square": {
    title: "Kvadrat qoidasi",
    idea: "Shoh piyoda kvadratida — yetib oladi, kvadratdan tashqarida — yoʻq.",
    lesson: [
      {
        title: "Kvadrat chizamiz",
        text: [
          "Piyodadan oxirgi gorizontalgacha chiziq oʻtkazib, unda **kvadrat** chiz. Agar raqib shohi **oʻz yurishi bilan** kvadratga kira olsa, piyodaga yetib oladi. Kira olmasa — piyoda farzinga aylanadi.",
          "Agar piyoda boshlangʻich gorizontalda tursa, kvadrat u ikki katak sakrab boradigan katakdan chiziladi.",
        ],
      },
    ],
    terms: [
      {
        term: "Piyoda kvadrati",
        text: "Piyodadan aylanish katagigacha boʻlgan kvadrat: uning ichidagi shoh piyodaga yetib oladi.",
      },
    ],
    exercises: {
      "c3-square-choose": {
        title: "Piyodaga yetib ol",
        prompt: "Qoralar yuradi. Piyodaga yetib olish uchun shoh bilan qayerga yurish kerak?",
        hint: "b4 piyodasining kvadrati: b4 dan b8 gacha va b4 dan f4 gacha. Qaysi yurish shohni ichkariga olib kiradi?",
        why: "♚f5 — shoh piyoda kvadratiga (b4–f4–f8–b8) kirdi va unga yetib oladi: durang. ♚g5? dan keyin esa shoh kvadratdan tashqarida qoladi va piyoda farzinga aylanadi.",
      },
    },
  },
  "c3-breakthrough": {
    title: "Piyodalar yorib oʻtishi",
    idea: "Uchta piyodaga qarshi uchta: ikki piyoda qurbon qilinadi — uchinchisi farzinlikka oʻtadi.",
    lesson: [
      {
        title: "Klassik yorib oʻtish",
        text: [
          "Oqlarning a5, b5, c5 piyodalari qoralarning a7, b7, c7 piyodalariga qarshi. **1. b6!!** zarbasi — agar 1... axb6 boʻlsa, 2. c6! bxc6 3. a6, agar 1... cxb6 boʻlsa, 2. a6! bxa6 3. c6. Bitta piyoda albatta farzinlikka oʻtadi.",
          "Yorib oʻtish shohlar uzoqda boʻlib, yordamga ulgurmaganda ishlaydi.",
        ],
      },
    ],
    terms: [
      { term: "Piyodalar yorib oʻtishi", text: "Ulardan biri farzinlikka oʻtishi uchun piyodalar qurbon qilinadi." },
    ],
    exercises: {
      "c3-breakthrough-choose": {
        title: "Yorib oʻtishni top",
        prompt: "Oqlar yuradi. Farzinlikka qanday yorib oʻtish mumkin?",
        hint: "Oʻrtadagi piyoda bilan zarba ber.",
        why: "1. b6!! — har qanday urishdan keyin oqlar yana bitta piyodani qurbon qiladi va uchinchisi farzinlikka oʻtadi. a6 yoki c6 dan keyin esa qoralar piyodalarni almashadi va yorib oʻtish boʻlmaydi.",
      },
    },
  },
};
