import type { Uz } from "../../localize";
import type { COURSE_3, COURSE_3_LESSONS, COURSE_3_MODULES } from "../course3";

export const course3Uz: Uz<typeof COURSE_3> = {
  title: "3-bosqich «Fil»",
  subtitle: "Hujum, oʻtuvchi piyodalar va endshpil",
  about:
    "Gorvits fillari, «ochkoʻz qator», ikki rux bilan hujum, hujumdagi oʻtuvchi piyoda, piyodalar falangasi, kuchsiz kataklar, oppozitsiya, sugsvang, kvadrat qoidasi, piyodalar yorib oʻtishi, shoh va piyoda shohga qarshi, uzoqdagi oʻtuvchi piyoda, yaxshi va yomon dona, pat va abadiy shoh, ikki fil bilan mot va etyudlar. Darslar mavzusi va tartibi M.I. Glotovning «Shaxmat mahorati bosqichlari. 3-bosqich „Fil“» kitobi asosida; pozitsiyalar maktab uchun tuzilgan va shaxmat dvigateli bilan tekshirilgan.",
};

export const course3ModulesUz: Uz<typeof COURSE_3_MODULES> = {
  horwitz: { title: "Gorvits fillari" },
  seventh: { title: "Ochkoʻz qator" },
  passer: { title: "Oʻtuvchi piyoda" },
  "pawns-squares": { title: "Falanga va kuchsiz kataklar" },
  "pawn-endgame": { title: "Piyodali endshpil" },
  kpk: { title: "Shoh va piyoda shohga qarshi" },
  activity: { title: "Faollik" },
  saving: { title: "Qutqaruvchi usullar" },
  "bishops-finale": { title: "Ikki fil va etyudlar" },
  "finish-3": { title: "Bosqich marrasi" },
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
  "c3-kpk-lead": {
    title: "Piyodani farzinlikka qanday olib oʻtish kerak",
    idea: "Shoh piyodadan oldinda yuradi va kalit kataklarni egallaydi.",
    lesson: [
      {
        title: "Kalit kataklar",
        text: [
          "«Shoh va piyoda shohga qarshi» endshpilida avval **shoh** ishlaydi. U oldinga chiqib, piyoda oldiga turadi — eng yaxshisi oltinchi gorizontalga.",
          "Agar shoh oʻz piyodasi oldida oltinchi gorizontalda tursa, piyoda **kim yurishidan qatʼi nazar** farzinlikka oʻtadi (chetki piyodadan tashqari — u haqda keyingi dars).",
        ],
      },
      {
        title: "Piyodaga shoshilma",
        text: [
          "Koʻp uchraydigan xato — piyodani darhol surish. Shunda raqib shohi uning oldiga turadi va durang boʻladi. Avval shoh, keyin piyoda!",
        ],
      },
    ],
    terms: [{ term: "Kalit katak", text: "Shoh shu katakka tursa, piyoda farzinlikka oʻtadi." }],
    exercises: {
      "c3-kpk-lead-choose": {
        title: "Shoh oldinga",
        prompt: "Oqlar yuradi. Qanday yutish mumkin?",
        hint: "Shoh bilan piyoda oldiga, oltinchi gorizontalga tur.",
        why: "♔e6! — shoh piyoda oldida oltinchi gorizontalda va oppozitsiyada: qoralar yoʻl beradi va piyoda oʻtadi. e6? dan keyin ♚d8! yoki ♔d5? dan keyin qoralar durangni saqlab qoladi.",
      },
    },
  },
  "c3-kpk-defend": {
    title: "Himoya: piyoda oldiga tur",
    idea: "Kuchsiz tomon shohi piyoda oldida turadi va oppozitsiyani egallaydi.",
    lesson: [
      {
        title: "Qanday himoyalanish kerak",
        text: [
          "Agar sening faqat shohing shoh va piyodaga qarshi qolgan boʻlsa, **piyodaning toʻgʻri oldiga** tur. Piyoda yaqinlashganda, oʻsha vertikal boʻylab orqaga chekin.",
          "Asosiy usul — **oppozitsiya**: shohingni raqib shohining qarshisiga qoʻy. Shunda u oldinga oʻta olmaydi, piyoda esa oxir-oqibat pat qiladi yoki halok boʻladi.",
        ],
      },
    ],
    terms: [{ term: "Piyoda oldida himoya", text: "Kuchsiz tomon shohi piyoda yoʻlida turadi." }],
    exercises: {
      "c3-kpk-defend-choose": {
        title: "Durangni saqla",
        prompt: "Qoralar yuradi. Qanday qilib durang qilish mumkin?",
        hint: "Shoh bilan oq shohning qarshisiga tur.",
        why: "♚e7! — qora shoh piyoda oldida va oq shohga nisbatan oppozitsiyada: oqlar oldinga oʻta olmaydi, durang. ♚d8? dan keyin ♔d6! yoki ♚f8? dan keyin ♔f6! — oqlar oʻzi oppozitsiyani egallaydi va piyodani olib oʻtadi.",
      },
    },
  },
  "c3-rook-pawn": {
    title: "Chetki piyoda",
    idea: "Chetki piyoda oldidagi burchakda turgan shoh — durang.",
    lesson: [
      {
        title: "Burchak qutqaradi",
        text: [
          "Taxta chetidagi piyoda (a yoki h vertikali) — alohida. Agar raqib shohi **uning oldidagi burchakka** ulgurib tursa, yutib boʻlmaydi: shoh burchakdan ketmaydi, uni siqib chiqarishning iloji yoʻq — pat boʻladi.",
          "Shuning uchun kuchsiz tomon burchakka shoshiladi, kuchli tomon esa uni u yerga kiritmaslikka harakat qiladi.",
        ],
      },
    ],
    terms: [{ term: "Chetki piyoda", text: "a yoki h vertikalidagi piyoda; u bilan yutish qiyinroq." }],
    exercises: {
      "c3-rook-pawn-choose": {
        title: "Burchakka!",
        prompt: "Qoralar yuradi. Qanday qilib durang qilish mumkin?",
        hint: "Shoh uchun chetki piyoda qayerda qoʻrqinchli emas?",
        why: "♚b8! — shoh a8 burchagiga boradi va oqlar yuta olmaydi. ♚d7? dan keyin ♔b7! — oq shoh qora shohni burchakdan uzib qoʻyadi va piyoda farzinlikka oʻtadi.",
      },
      "c3-rook-pawn-quiz": {
        title: "Chetkimi yoki yoʻqmi?",
        prompt: "Oqlar yuradi. Savollarga javob ber.",
        questions: [
          {
            text: "Oqlar: ♔a6, a5 piyodasi. Qoralar: ♚a8. Partiya nima bilan tugaydi?",
            options: ["oqlar yutadi", "durang"],
          },
          { text: "Oqlar: ♔e6, e5 piyodasi. Qoralar: ♚e8. Bu yerda-chi?", options: ["oqlar yutadi", "durang"] },
        ],
        hint: "Oltinchi gorizontalda piyoda oldida turgan shoh yutadi — lekin chetki piyoda bilan emas.",
        why: "Chetki piyoda bilan burchakdagi shoh durangni saqlaydi. Markaziy piyoda bilan esa uning oldida oltinchi gorizontalda turgan shoh kim yurishidan qatʼi nazar yutadi.",
      },
    },
  },
  "c3-shoulder": {
    title: "Yelka bilan itarish",
    idea: "Shoh raqib shohi yoʻliga turadi va uni piyodaga yaqinlashtirmaydi.",
    lesson: [
      {
        title: "Shoh ham himoyachi",
        text: [
          "Baʼzan shohlar bir maqsad sari yuguradi. Shunda **yelka bilan itarish** yordam beradi: oʻz shohing raqib shohi yoʻliga turib, unga yoʻlni yopadi — xuddi olomonda yelka bilan surib qoʻyganday.",
          "Shohlar yonma-yon tura olmaydi, shuning uchun shohing atrofidagi kataklar raqib uchun yopiq.",
        ],
      },
    ],
    terms: [{ term: "Yelka bilan itarish", text: "Shoh raqib shohining yoʻlini toʻsadi." }],
    exercises: {
      "c3-shoulder-choose": {
        title: "Yelka bilan oldinga",
        prompt: "Oqlar yuradi. Qora shohni piyodaga qanday yaqinlashtirmaslik mumkin?",
        hint: "Shoh bilan qora shoh va piyoda orasiga tur.",
        why: "♔e5! — oq shoh d6 va e6 kataklarini yopdi, qora shoh piyodaga yaqinlasha olmaydi va u farzinlikka oʻtadi. c6? dan keyin ♚e6! yoki ♔e4? dan keyin ♚e6 — qora shoh piyodaga ulguradi, durang.",
      },
    },
  },
  "c3-outside-passer": {
    title: "Uzoqdagi oʻtuvchi piyoda",
    idea: "Shohlardan uzoqdagi oʻtuvchi piyoda raqib shohini chalgʻitadi.",
    lesson: [
      {
        title: "Chalgʻitish",
        text: [
          "**Uzoqdagi oʻtuvchi piyoda** — asosiy voqealardan uzoqda, odatda taxta chetidagi oʻtuvchi piyoda. Raqib shohi uning ortidan yugurishga majbur.",
          "U piyodani tutayotganda, sening shohing boshqa qanotga borib, u yerdagi piyodalarni oladi. Uzoqdagi oʻtuvchi piyoda koʻpincha piyodali endshpilni hal qiladi.",
        ],
      },
    ],
    terms: [
      { term: "Uzoqdagi oʻtuvchi piyoda", text: "Shohlardan uzoqdagi oʻtuvchi piyoda; raqib shohini chalgʻitadi." },
    ],
    exercises: {
      "c3-outside-passer-quiz": {
        title: "U nima uchun kerak?",
        prompt: "Uzoqdagi oʻtuvchi piyoda haqidagi savollarga javob ber.",
        questions: [
          {
            text: "Uzoqdagi oʻtuvchi piyoda farzinlikka yugurganda raqib shohi nima qiladi?",
            options: ["uni tutishga boradi", "eʼtibor bermaydi", "burchakka yashirinadi"],
          },
          {
            text: "Bu vaqtda sening shohing nima qiladi?",
            options: ["oʻz piyodasi ortidan boradi", "boshqa qanotdagi piyodalarni oladi", "joyida turadi"],
          },
        ],
        hint: "Piyodani farzinlikka oʻtkazib yuborib boʻlmaydi — uning ortidan yugurishga toʻgʻri keladi.",
        why: "Uzoqdagi oʻtuvchi piyoda raqib shohini chalgʻitadi. U piyodani tutayotganda, sening shohing boshqa qanotdagi piyodalarni oladi.",
      },
    },
  },
  "c3-good-bad": {
    title: "Faollik, yaxshi va yomon dona",
    idea: "Donaning yurishlari koʻp boʻlsa, u kuchli; oʻz piyodalari uni qamab qoʻyishi mumkin.",
    lesson: [
      {
        title: "Faol dona",
        text: [
          "**Faol** dona koʻp katakni ushlab turadi va oʻyinda qatnashadi. **Passiv** dona chetda turadi. Endshpilda shoh ham faol boʻlishi kerak: u markazga boradi.",
          "**Yomon fil** — oʻz rangidagi kataklarda turgan oʻz piyodalari xalaqit beradigan fil. **Yaxshi fil** boshqa rangda yuradi, uning piyodalari yoʻlini toʻsmaydi.",
        ],
      },
    ],
    terms: [
      { term: "Yomon fil", text: "Oʻz rangidagi kataklarda turgan oʻz piyodalari xalaqit beradigan fil." },
      { term: "Faol dona", text: "Koʻp katakni ushlab turadigan va oʻyinda qatnashadigan dona." },
    ],
    exercises: {
      "c3-bad-bishop-moves": {
        title: "Yomon fil",
        prompt: "Oq fil yura oladigan barcha kataklarni belgila.",
        hint: "d3 va f3 dagi oʻz piyodalari diagonallarni yopib qoʻygan.",
        why: "Faqat d1 va f1: d3 va f3 piyodalari oq kataklarda turib, filni qamab qoʻygan. Bunday fil — yomon fil.",
      },
      "c3-activity-quiz": {
        title: "Shohning oʻrni qayerda?",
        prompt: "Savollarga javob ber.",
        questions: [
          {
            text: "Taxtada donalar deyarli qolmaganda shoh qayerga boradi?",
            options: ["markazga", "burchakka", "oʻz piyodalari ortiga"],
          },
          {
            text: "Agar sening filing oq kataklarda yursa, piyodalarni qayerga qoʻygan maʼqul?",
            options: ["oq kataklarga", "qora kataklarga"],
          },
        ],
        hint: "Endshpilda shoh — kuchli dona. Piyodalar oʻz filiga xalaqit bermasligi kerak.",
        why: "Endshpilda shoh markazga boradi va piyodalarga yordam beradi. Piyodalar fil yuradigan rangdan boshqa rangdagi kataklarga qoʻyiladi — shunda fil yaxshi boʻlib qoladi.",
      },
    },
  },
  "c3-stalemate": {
    title: "Pat: tuzoq va qutqaruv",
    idea: "Kuchli tomon pat qilib qoʻymaslikka qaraydi; kuchsiz tomon qutulish uchun pat izlaydi.",
    lesson: [
      {
        title: "Pat — bu durang",
        text: [
          "**Pat** — navbat kelgan tomonning birorta ham yurishi yoʻq, lekin shoh ham yoʻq. Bu durang, hatto raqibda ortiqcha farzin boʻlsa ham.",
          "Yutayotganingda har bir yurishdan oldin tekshir: raqibda hech boʻlmasa bitta yurish qoldimi? Yutqazayotgan boʻlsang esa — yurishsiz qolish yoʻlini izla.",
        ],
      },
      {
        title: "Qutirgan rux",
        text: [
          "Agar sening faqat yura olmaydigan shohing va bitta donang qolgan boʻlsa — uni shoh berib qurbon qil! Urib olishsa — pat, urib olishmasa — u shoh berishda davom etadi.",
        ],
      },
    ],
    terms: [{ term: "Pat", text: "Yuradigan narsa yoʻq, lekin shoh ham yoʻq — durang." }],
    exercises: {
      "c3-stalemate-trap": {
        title: "Pat qilib qoʻyma!",
        prompt: "Oqlar yuradi. Qanday yutish mumkin?",
        hint: "Yurishdan keyin qora shohga shoh berilgan boʻlishi kerak.",
        why: "♕f8# — mot. ♕f7? dan keyin qora shohning yurishi yoʻq, shoh ham yoʻq — bu pat, durang.",
      },
      "c3-stalemate-save": {
        title: "Pat bilan qutulish",
        prompt: "Oqlar yuradi. Qoralarda ortiqcha farzin bor. Qanday qutulish mumkin?",
        hint: "Oq shoh yura olmaydi. Ruxni shoh berib qurbon qil.",
        why: "♖c8+! — qoralarda yagona yurish ♚xc8 va bu pat: oq shohning boradigan joyi yoʻq. ♖c2? dan keyin esa qoralar ♛e1# bilan mot qiladi.",
      },
    },
  },
  "c3-perpetual": {
    title: "Abadiy shoh",
    idea: "Toʻxtovsiz shoh berilsa, partiya durang bilan tugaydi.",
    lesson: [
      {
        title: "Shoh ketidan shoh",
        text: [
          "**Abadiy shoh** — shohning qochib qutula olmaydigan shohlari. Bir xil pozitsiya uch marta takrorlansa, durang boʻladi.",
          "Abadiy shoh qiyin pozitsiyada qutqaradi: raqibda ortiqcha donalar koʻp boʻlsa ham, u ulardan foydalanishga ulgurmaydi.",
        ],
      },
    ],
    terms: [{ term: "Abadiy shoh", text: "Toʻxtovsiz shohlar; pozitsiya takrorlanadi — durang." }],
    exercises: {
      "c3-perpetual-choose": {
        title: "Shoh ketidan shoh",
        prompt: "Oqlar yuradi. Qora piyodalar hademay farzinga aylanadi. Qanday qutulish mumkin?",
        hint: "Shunday shoh izla: undan keyin shohning boradigan joyi deyarli qolmasin.",
        why: "♕f6+! ♚g8 ♕g5+ ♚h8 ♕f6+ — shoh g8 va h8 orasida yuradi, farzin esa f6 va g5 dan toʻxtovsiz shoh beradi. Bu abadiy shoh — durang. ♕xf7? dan keyin ♜xf7 — oqlar farzinsiz qoladi.",
      },
    },
  },
  "c3-two-bishops": {
    title: "Ikki fil bilan mot",
    idea: "Ikki fil va shoh raqib shohini burchakka qamaydi.",
    lesson: [
      {
        title: "Yonma-yon fillar",
        text: [
          "Ikki fil — biri oq, ikkinchisi qora kataklarda — birgalikda ikki qoʻshni diagonalni devor kabi ushlab turadi. Shoh ularga yordam beradi va raqibdan kataklarni tortib oladi.",
          "Ikki fil bilan mot faqat taxtaning **burchagida** qilinadi. Avval shoh chetga siqiladi, keyin burchakka haydaladi.",
        ],
      },
    ],
    terms: [{ term: "Ikki fil bilan mot", text: "Burchakda shoh va ikki fil bilan qilinadigan mot." }],
    exercises: {
      "c3-two-bishops-f6": {
        title: "Burchakda mot",
        prompt: "Oqlar yuradi. Mot qil.",
        hint: "a2 dagi fil g8 ni, shoh esa g7 va h7 ni ushlab turibdi. Shoh berish qoldi.",
        why: "♗f6# — fil katta diagonal boʻylab shoh beradi, a2 dagi fil g8 ni, g6 dagi shoh esa g7 va h7 kataklarini ushlab turadi.",
      },
      "c3-two-bishops-e5": {
        title: "Yana bir burchak",
        prompt: "Oqlar yuradi. Mot qil.",
        hint: "Qaysi fil a1–h8 diagonali boʻylab shoh bera oladi?",
        why: "♗e5# — diagonal boʻylab shoh, f7 dagi fil g8 ni, h6 dagi shoh esa g7 va h7 kataklarini ushlab turadi.",
      },
    },
  },
  "c3-study": {
    title: "Etyudlar: bitta aniq yurish",
    idea: "Etyudda maqsadga olib boradigan yagona, koʻpincha kutilmagan yoʻlni topish kerak.",
    lesson: [
      {
        title: "Etyud nima",
        text: [
          "**Etyud** — oʻylab topilgan pozitsiya, unda yagona yechim bor: yutish yoki partiyani saqlab qolish. Etyudlar kutilmagan yurishlarni koʻrishga oʻrgatadi.",
          "Mashhur etyud tuzuvchisi — **Aleksey Troitskiy** (1866–1942). Sevimli etyud usullaridan biri — **kuchsiz aylanish**: pat qilib qoʻymaslik uchun piyoda farzinga emas, rux yoki otga aylanadi.",
        ],
      },
    ],
    terms: [
      { term: "Etyud", text: "Yagona yechimga ega tuzilgan pozitsiya." },
      { term: "Kuchsiz aylanish", text: "Piyoda farzinga emas, boshqa donaga aylanadi." },
    ],
    exercises: {
      "c3-study-underpromote": {
        title: "Farzinmi yoki rux?",
        prompt: "Oqlar yuradi. Qanday yutish mumkin?",
        hint: "Aylanishdan keyin qora shohning yurishi qoladimi — tekshir.",
        why: "c8♖! — qora shohda ♚a6 yurishi qoladi va oqlar rux hamda shoh bilan mot qiladi. c8♕? dan keyin farzin shohdan barcha kataklarni shohsiz tortib oladi — pat.",
      },
    },
  },
  "c3-final-test": {
    title: "«Fil» bosqichining yakuniy testi",
    idea: "Oʻzingni sinab koʻr: hujum, ikki fil bilan mot, piyodali endshpil va pat.",
    lesson: [
      {
        title: "Test oldidan",
        text: [
          "Uchinchi bosqich ortda qoldi: rokirovkaga hujum, oʻtuvchi piyodalar va endshpil. Har bir yurishdan oldin oʻyla: shohlar qayerda, kim yuradi va pat yoʻqmi.",
        ],
      },
    ],
    terms: [{ term: "«Fil» bosqichi", text: "Kursning uchinchi bosqichi: hujum, oʻtuvchi piyodalar va endshpil." }],
    exercises: {
      "c3-final-bishops": {
        title: "1-masala",
        prompt: "Oqlar yuradi. Mot qil.",
        hint: "b3 dagi fil g8 ni ushlab turibdi. Qaysi fil shoh beradi?",
        why: "♗d4# — katta diagonal boʻylab shoh, b3 dagi fil g8 ni, g6 dagi shoh esa g7 va h7 kataklarini ushlab turadi.",
      },
      "c3-final-king": {
        title: "2-masala",
        prompt: "Oqlar yuradi. Qanday yutish mumkin?",
        hint: "Shoh piyodadan oldinda, oltinchi gorizontalga boradi.",
        why: "♔d6! — shoh piyoda oldida oltinchi gorizontalga turdi va qora shohni unga yaqinlashtirmaydi: piyoda oʻtadi. e6? yoki ♔d5? dan keyin qoralar durangni saqlab qoladi.",
      },
      "c3-final-stalemate": {
        title: "3-masala",
        prompt: "Oqlar yuradi. Qanday yutish mumkin?",
        hint: "Patni unutma!",
        why: "♕c8# — mot. ♕c7? dan keyin qora shohning yurishi yoʻq, shoh ham yoʻq — pat.",
      },
      "c3-final-quiz": {
        title: "4-masala: savollar",
        prompt: "Bosqich boʻyicha savollarga javob ber.",
        questions: [
          {
            text: "Oqlar: ♔h1, b4 piyodasi. Qoralar: ♚f5, oqlar yuradi. Qora shoh piyodaga yetib oladimi?",
            options: ["ha, u kvadratda", "yoʻq, piyoda oʻtadi"],
          },
          {
            text: "Yuradigan narsa yoʻq, lekin shoh ham yoʻq boʻlgan holat qanday ataladi?",
            options: ["mot", "pat", "sugsvang"],
          },
          {
            text: "Ikki fil bilan qayerda mot qilish mumkin?",
            options: ["faqat burchakda", "istalgan chetda", "markazda"],
          },
        ],
        hint: "Kvadrat qoidasini, patni va ikki fil bilan motni esla.",
        why: "f5 dagi shoh b4 piyodasining kvadratida turibdi va unga yetib oladi. Pat — yuradigan narsa yoʻq, shoh ham yoʻq. Ikki fil bilan mot faqat burchakda qilinadi.",
      },
    },
  },
};
