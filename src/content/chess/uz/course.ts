import type { Uz } from "../../localize";
import type { COURSE_1, COURSE_1_LESSONS, COURSE_1_MODULES } from "../course";

export const course1Uz: Uz<typeof COURSE_1> = {
  title: "1-bosqich «Piyoda»",
  subtitle: "Shaxmat noldan — darsma-dars",
  about:
    "Avval taxta va yurishlarni yozish, keyin har bir dona, donalarning qiymati, shoh berish va undan himoyalanishning uch usuli, har bir dona bilan mot, rokirovka va debyutning birinchi qoidalari. Har bir darsda — qisqa nazariya va taxtadagi mashqlar. Darslar tartibi M.I. Glotovning «Shaxmat mahorati bosqichlari» metodikasi asosida; pozitsiyalar maktab uchun tuzilgan va shaxmat dvigateli bilan tekshirilgan.",
};

export const course1ModulesUz: Uz<typeof COURSE_1_MODULES> = {
  board: { title: "Taxta va yurishlarni yozish" },
  pieces: { title: "Donalar qanday yuradi" },
  value: { title: "Donalarning qiymati va almashuv" },
  check: { title: "Shoh berish va undan himoya" },
  mate: { title: "Mot" },
  castle: { title: "Rokirovka" },
  opening: { title: "Partiya boshlanishi" },
};

export const course1LessonsUz: Uz<typeof COURSE_1_LESSONS> = {
  "c1-game": {
    title: "Shaxmat partiyasi",
    idea: "Ikki oʻyinchi, 64 katak, har birida 16 tadan dona. Birinchi boʻlib oqlar yuradi.",
    lesson: [
      {
        title: "Taxta va boshlangʻich holat",
        text: [
          "Partiyani ikki kishi oʻynaydi: biri oq donalar bilan, ikkinchisi qora donalar bilan. Har birida **8 ta piyoda va 8 ta dona** bor. Birinchi yurishni har doim **oqlar** qiladi, keyin navbatma-navbat, bittadan yuriladi.",
          "Taxta toʻgʻri qoʻyilgan boʻlsa, **chap pastki katak — qora**. Farzin «oʻz rangini yaxshi koʻradi»: oq farzin oq d1 katagida, qora farzin qora d8 katagida turadi.",
        ],
      },
      {
        title: "Qanotlar va markaz",
        text: [
          "Boshida shohlar turgan yarmi (e–h vertikallari) **shoh qanoti**, farzinlar turgan yarmi (a–d) esa **farzin qanoti** deyiladi.",
          "Oʻrtadagi toʻrtta katak — d4, e4, d5, e5 — **markaz**. Markazdagi donalar kuchliroq: u yerdan ular uzoqroqqa yetadi.",
        ],
      },
    ],
    terms: [
      { term: "Boshlangʻich holat", text: "Partiya boshlanishidan oldin donalarning joylashuvi." },
      { term: "Markaz", text: "Taxta oʻrtasidagi toʻrtta katak: d4, e4, d5, e5." },
      { term: "Qanot", text: "Taxtaning yarmi: shoh qanoti (e–h) yoki farzin qanoti (a–d)." },
    ],
    exercises: {
      "c1-center": {
        title: "Markazni top",
        prompt: "Markazdagi toʻrtta katakni navbatma-navbat bos.",
        hint: "Markaz — d va e vertikallari bilan 4 va 5 gorizontallarining kesishgan joyi.",
        why: "Markaz — d4, e4, d5 va e5 kataklari. Markazdagi dona chetdagidan koʻproq katakka hujum qiladi.",
      },
      "c1-start-quiz": {
        title: "Donalar qanday turadi",
        prompt: "Boshlangʻich holatni esla.",
        questions: [
          { text: "Boshida oq farzin qaysi katakda turadi?" },
          { text: "Boshida qora shoh qaysi katakda turadi?" },
          { text: "Qaysi vertikallar shoh qanoti?" },
          { text: "Partiyada birinchi yurishni kim qiladi?", options: ["Oqlar", "Qoralar", "Kim xohlasa"] },
        ],
        hint: "Farzin oʻz rangini yaxshi koʻradi, shoh esa uning yonida turadi.",
        why: "Oq farzin oq d1 da, shoh e1 da; qoralar qarshisida turadi: farzin d8 da, shoh e8 da. Shohlar turgan yarmi (e–h) — shoh qanoti. Birinchi boʻlib har doim oqlar yuradi.",
      },
    },
  },
  "c1-lines": {
    title: "Gorizontal, vertikal, diagonal",
    idea: "Taxtada uch xil chiziq bor — donalar aynan ular boʻylab yuradi.",
    lesson: [
      {
        title: "Uch xil chiziq",
        text: [
          "**Gorizontal** — chapdan oʻngga ketgan kataklar qatori. Ular 8 ta, 1 dan 8 gacha raqamlar bilan belgilanadi.",
          "**Vertikal** — pastdan yuqoriga ketgan qator. Ular ham 8 ta, a dan h gacha harflar bilan belgilanadi.",
          "**Diagonal** — bir-biriga burchagi bilan tegib turgan bir xil rangdagi kataklar. Eng uzun ikkitasi — a1–h8 va h1–a8 — **katta diagonallar** deyiladi.",
        ],
      },
    ],
    terms: [
      { term: "Gorizontal", text: "Chapdan oʻngga ketgan 8 ta katak qatori, raqam bilan belgilanadi." },
      { term: "Vertikal", text: "Pastdan yuqoriga ketgan 8 ta katak qatori, harf bilan belgilanadi." },
      { term: "Diagonal", text: "Burchaklari bilan tutashgan bir xil rangdagi kataklar." },
    ],
    exercises: {
      "c1-diagonal": {
        title: "Katta diagonal",
        prompt: "a1 dan h8 gacha katta diagonal boʻylab yur: kataklarni navbatma-navbat bos.",
        hint: "Har qadamda harf ham, raqam ham bittaga oldinga suriladi.",
        why: "a1–h8 katta diagonali: a1, b2, c3, d4, e5, f6, g7, h8. Uning hamma kataklari bir rangda — qora.",
      },
      "c1-lines-quiz": {
        title: "Bu qanday chiziq?",
        prompt: "Chiziqning nomini ayt.",
        questions: [
          { text: "a1 dan a8 gacha kataklar — bu…", options: ["gorizontal", "vertikal", "diagonal"] },
          { text: "a1 dan h1 gacha kataklar — bu…", options: ["gorizontal", "vertikal", "diagonal"] },
          { text: "a1, b2, c3… h8 kataklari — bu…", options: ["gorizontal", "vertikal", "diagonal"] },
          { text: "Taxtada jami nechta vertikal bor?" },
        ],
        hint: "Vertikal pastdan yuqoriga, gorizontal chapdan oʻngga ketadi.",
        why: "a1–a8 — a vertikali, a1–h1 — birinchi gorizontal, a1–h8 — katta diagonal. Vertikallar sakkizta: a dan h gacha.",
      },
    },
  },
  "c1-notation": {
    title: "Shaxmat yozuvi",
    idea: "Har bir katakning nomi bor, har bir yurishni esa yozib qoʻyish mumkin.",
    lesson: [
      {
        title: "Katak nomi",
        text: [
          "Katak nomi — **vertikal harfi va gorizontal raqami**: avval pastdagi harf, keyin yondagi raqam. Masalan, e4.",
          "Shaxmatchilar partiyalarini yozib boradi: qaysi dona va qaysi katakka yurgani. Shunda partiyani yuz yildan keyin ham takrorlash mumkin.",
        ],
      },
      {
        title: "Yozuvdagi belgilar",
        text: [
          "**x** (yoki ikki nuqta) — urib olish, **+** — shoh, **#** — mot.",
          "**0-0** — qisqa rokirovka, **0-0-0** — uzun rokirovka. **!** — kuchli yurish, **?** — xato.",
        ],
      },
    ],
    terms: [
      { term: "Notatsiya", text: "Shaxmat partiyasini harf, raqam va belgilar bilan yozish." },
      { term: "+ va #", text: "Shoh va mot belgilari." },
    ],
    exercises: {
      "c1-notation-quiz": {
        title: "Yozuvni oʻqiymiz",
        prompt: "Belgilar nimani bildiradi?",
        questions: [
          { text: "Yurishdan keyingi «+» belgisi nimani bildiradi?", options: ["urib olish", "shoh", "mot"] },
          { text: "«#» belgisi nimani bildiradi?", options: ["mot", "pat", "kuchli yurish"] },
          { text: "Qisqa rokirovka qanday yoziladi?" },
          { text: "Yurish yozuvidagi «x» nimani bildiradi?", options: ["urib olish", "shoh", "rokirovka"] },
        ],
        hint: "Plyus — shohga hujum, panjara — shoh tutildi.",
        why: "«+» — shoh, «#» — mot, «x» — urib olish, 0-0 — qisqa rokirovka, 0-0-0 — uzun rokirovka.",
      },
    },
  },
  "c1-rook": {
    title: "Rux",
    idea: "Rux gorizontal va vertikal boʻylab istalgancha katakka yuradi.",
    lesson: [
      {
        title: "Toʻgʻri chiziqlar",
        text: [
          "Rux **gorizontal va vertikal** boʻylab istalgancha boʻsh katakka yuradi. Donalar ustidan sakrab oʻta olmaydi.",
          "Raqib donasini rux uning oʻrniga turib urib oladi. Rux **5 ta piyodaga** teng.",
        ],
      },
    ],
    terms: [{ term: "Rux", text: "Toʻgʻri chiziqlar boʻylab yuradigan dona. 5 ta piyodaga teng." }],
  },
  "c1-bishop": {
    title: "Fil",
    idea: "Fil diagonal boʻylab yuradi va hech qachon katak rangini almashtirmaydi.",
    lesson: [
      {
        title: "Diagonallar",
        text: [
          "Fil **diagonal boʻylab** istalgancha boʻsh katakka yuradi. Shuning uchun u butun partiya davomida bir xil rangdagi kataklarda yuradi: har bir oʻyinchida oq maydonli va qora maydonli fil bor.",
          "Fil **3 ta piyodaga** teng.",
        ],
      },
    ],
    terms: [{ term: "Fil", text: "Diagonal boʻylab yuradigan dona. 3 ta piyodaga teng." }],
  },
  "c1-queen": {
    title: "Farzin",
    idea: "Farzin rux va fil kabi birga yuradi — bu eng kuchli dona.",
    lesson: [
      {
        title: "Rux + fil",
        text: [
          "Farzin **gorizontal, vertikal va diagonal** boʻylab istalgancha boʻsh katakka yuradi.",
          "Bu eng kuchli dona: farzin **9 ta piyodaga** teng. Uni ehtiyot qil!",
        ],
      },
    ],
    terms: [{ term: "Farzin", text: "Eng kuchli dona. 9 ta piyodaga teng." }],
  },
  "c1-knight": {
    title: "Ot",
    idea: "Ot «L» harfi shaklida sakraydi va donalar ustidan oshib oʻtadi.",
    lesson: [
      {
        title: "«L» harfi",
        text: [
          "Ot **«L» harfi** shaklida yuradi: ikki katak toʻgʻriga va bir katak yon tomonga. Faqat u donalar ustidan — oʻzinikidan ham, raqibnikidan ham — **sakrab oʻta oladi**.",
          "Har yurishda ot katak rangini almashtiradi. Ot **3 ta piyodaga** teng.",
        ],
      },
    ],
    terms: [{ term: "Ot", text: "«L» harfi shaklida sakraydigan dona. 3 ta piyodaga teng." }],
  },
  "c1-king": {
    title: "Shoh",
    idea: "Shoh istalgan tomonga bir katak yuradi va hujum ostidagi katakka turmaydi.",
    lesson: [
      {
        title: "Istalgan tomonga bir qadam",
        text: [
          "Shoh istalgan yoʻnalishda **bir katak** yuradi. Shohni urib boʻlmaydi, shuning uchun u **raqib urayotgan katakka tura olmaydi**.",
          "Shohlar hech qachon yonma-yon turmaydi: ular orasida kamida bitta katak boʻlishi kerak.",
        ],
      },
    ],
    terms: [{ term: "Shoh", text: "Asosiy dona. Shohni urib boʻlmaydi — unga faqat mot qilish mumkin." }],
    exercises: {
      "c1-king-near-king": {
        title: "Shohlar yonma-yon",
        prompt: "Oq shoh yura oladigan hamma kataklarni belgila.",
        hint: "c4, d4 va e4 kataklari qora shohning yonida — u yerga yurib boʻlmaydi.",
        why: "Oq shoh c4, d4 va e4 ga tura olmaydi: bu kataklar qora shohning yonida. c2, c3, d2, e2 va e3 qoladi.",
      },
    },
  },
  "c1-pawn": {
    title: "Piyoda",
    idea: "Piyoda faqat oldinga yuradi, urishni esa qiya qiladi.",
    lesson: [
      {
        title: "Yurish va urish",
        text: [
          "Piyoda **faqat oldinga bir katak** yuradi, boshlangʻich katakdan esa ikki katak ham yura oladi. Piyodalar orqaga yurmaydi.",
          "Piyoda **qiya oldinga** bir katakka uradi. Agar piyodaning roppa-rosa oldida dona tursa, piyoda tiralib qoladi.",
        ],
      },
    ],
    terms: [{ term: "Piyoda", text: "Eng kichik dona. 1 piyodaga teng — bu donalar qiymatining oʻlchovi." }],
  },
  "c1-promotion": {
    title: "Piyodaning aylanishi",
    idea: "Oxirgi gorizontalga yetgan piyoda shohdan boshqa istalgan donaga aylanadi.",
    lesson: [
      {
        title: "Piyodadan — farzinga",
        text: [
          "Piyoda **oxirgi gorizontalga** yetganda darhol farzin, rux, fil yoki otga aylanadi — oʻyinchi oʻzi tanlaydi. Koʻpincha farzinni tanlashadi.",
          "Piyoda urib olib ham aylanishi mumkin: agar oxirgi gorizontalda qiya tomonda raqib donasi tursa.",
        ],
      },
    ],
    terms: [{ term: "Aylanish", text: "Oxirgi gorizontalga yetgan piyoda boshqa donaga aylanadi." }],
    exercises: {
      "c1-promote-step": {
        title: "Oxirgi qadam",
        prompt: "Oqlar yuradi. Piyodani farzinga aylantir.",
        hint: "Piyodaga oxirgi gorizontalgacha bitta katak qoldi.",
        why: "Piyoda b8 ga chiqib, oxirgi gorizontalda farzinga aylandi.",
      },
      "c1-promote-capture": {
        title: "Ikki yoʻl",
        prompt: "Oqlar yuradi. Piyodani farzinga aylantir — istalgan yoʻl toʻgʻri.",
        hint: "Piyoda toʻgʻriga yurishi yoki qiya tomondagi ruxni urishi mumkin.",
        why: "Ikki yoʻl bor: b8 ga yurish yoki a8 dagi ruxni urib olish. Ruxni urish yanada yaxshi — qoʻshimcha dona ham olinadi.",
      },
    },
  },
  "c1-value": {
    title: "Donalarning qiymati",
    idea: "Donalar piyodalarda hisoblanadi: ot va fil — 3, rux — 5, farzin — 9.",
    lesson: [
      {
        title: "Dona qancha turadi",
        text: [
          "Donalarning kuchini piyodalar bilan oʻlchash qulay: **piyoda — 1, ot — 3, fil — 3, rux — 5, farzin — 9**. Shoh bebaho: usiz partiya yutqazilgan.",
          "Shunday qilib, kimda kuch koʻpligini oson solishtirasan. Oʻz donalaring va raqib donalarining qiymatini qoʻshib chiq.",
        ],
      },
    ],
    terms: [{ term: "Material", text: "Oʻyinchining piyodalarda hisoblangan barcha donalari." }],
    exercises: {
      "c1-value-quiz": {
        title: "Piyodalarda hisobla",
        prompt: "Donalarning qiymatini qoʻsh.",
        questions: [
          { text: "Farzin va rux — necha piyoda?" },
          { text: "Ot va fil — necha piyoda?" },
          { text: "Qaysi biri kuchliroq: rux yoki ot bilan piyoda birga?", options: ["rux", "ot bilan piyoda"] },
          { text: "Ikkita rux farzindan koʻpmi yoki kammi?", options: ["koʻp", "kam"] },
        ],
        hint: "Ot va fil — 3 tadan, rux — 5, farzin — 9.",
        why: "9 + 5 = 14; 3 + 3 = 6; rux (5) ot bilan piyodadan (4) koʻp; ikkita rux (10) farzindan (9) koʻp.",
      },
    },
  },
  "c1-exchange": {
    title: "Almashuv",
    idea: "Dona olding — seningkini olishmasligini tekshir. Faqat foydali almash.",
    lesson: [
      {
        title: "Foydalimi yoki yoʻq",
        text: [
          "**Almashuv** — oʻyinchilar navbatma-navbat bir-birining donasini urib olishi. Teng almashuv — ot fil evaziga, rux rux evaziga. Foydali almashuv — bergan donangdan qimmatroq donani olsang.",
          "Urishdan oldin tekshir: **raqib donasi himoyalanganmi?** Agar himoyalangan boʻlsa, urgandan keyin seningkini ham olishadi.",
        ],
      },
    ],
    terms: [
      { term: "Almashuv", text: "Donalarni oʻzaro urib olish. Foydali almashuvda olganing berganingdan koʻp boʻladi." },
    ],
    exercises: {
      "c1-free-piece": {
        title: "Tekin dona",
        prompt: "Oqlar yuradi. Shunday donani ol: evaziga farzinni olishmasin.",
        hint: "d5 dagi otni e6 dagi piyoda himoya qilyapti. Filni-chi, kim himoya qilyapti?",
        why: "Farzin g4 dagi filni oladi! Filni hech kim himoya qilmaydi. Agar farzin d5 dagi otni olsa, e6 dagi piyoda farzinni urib oladi — 9 ochkolik farzin 3 ochkolik ot uchun yoʻqoladi.",
      },
      "c1-exchange-quiz": {
        title: "Almashuv foydalimi?",
        prompt: "Almashuv foydali yoki yoʻqligini hal qil.",
        questions: [
          { text: "Sen otni berib, ruxni olasan. Foydalimi?", options: ["ha", "yoʻq"] },
          { text: "Sen farzinni berib, ruxni olasan. Foydalimi?", options: ["ha", "yoʻq"] },
          { text: "Sen filni berib, otni olasan. Bu…", options: ["teng almashuv", "yutqazish"] },
        ],
        hint: "Narxini solishtir: nima berasan va nima olasan.",
        why: "Ot (3) evaziga rux (5) — foydali. Farzin (9) evaziga rux (5) — zarar. Fil (3) evaziga ot (3) — teng almashuv.",
      },
    },
  },
  "c1-check": {
    title: "Shoh berish",
    idea: "Shoh berish — shohga hujum. Unga darhol javob berish kerak.",
    lesson: [
      {
        title: "Shohga hujum",
        text: [
          "**Shoh berish** — bu shohga hujum qilish. Shoh berilgan shohga darhol yordam berish kerak: shohni hujum ostida qoldirib boʻlmaydi.",
          "Shohni shohdan boshqa istalgan dona bera oladi. Yozuvda shoh **+** belgisi bilan belgilanadi.",
        ],
      },
    ],
    terms: [{ term: "Shoh berish", text: "Raqib shohiga hujum. «+» bilan belgilanadi." }],
    exercises: {
      "c1-check-rook": {
        title: "Rux bilan shoh",
        prompt: "Oqlar yuradi. Shoh ber.",
        hint: "Rux gorizontal boʻylab hujum qiladi. Shoh qaysi gorizontalda turibdi?",
        why: "Rux a8 ga chiqdi — shoh turgan gorizontalga.",
      },
      "c1-check-knight": {
        title: "Ot bilan shoh",
        prompt: "Oqlar yuradi. Ot bilan shoh ber.",
        hint: "Ot shohga «L» harfi shaklida hujum qiladi. Qaysi kataklardan u e8 ga yetadi?",
        why: "Ot d6 ga sakradi — u yerdan e8 ni uradi.",
      },
      "c1-check-bishop": {
        title: "Fil bilan shoh",
        prompt: "Oqlar yuradi. Fil bilan shoh ber — ikki usul bor.",
        hint: "Filga shohga olib boradigan diagonal kerak.",
        why: "Fil b5 ga yoki f7 ga boradi — ikkala katak ham e8 dagi shohning diagonallarida. Lekin f7 dagi filni shoh urib oladi, shuning uchun b5 yaxshiroq.",
      },
      "c1-check-queen": {
        title: "Farzin bilan shoh",
        prompt: "Oqlar yuradi. Farzin bilan shoh ber — istalgani toʻgʻri.",
        hint: "Farzin ham toʻgʻri chiziq, ham diagonal boʻylab uradi — usullar koʻp.",
        why: "Beshta usul bor: farzin a4, d7, d8, e2 yoki h5 ga boradi. Farzin shohga turli tomonlardan yetadi.",
      },
      "c1-check-pawn": {
        title: "Piyoda bilan shoh",
        prompt: "Oqlar yuradi. Hatto piyoda ham shoh bera oladi!",
        hint: "Piyoda qiya oldinga uradi.",
        why: "Piyoda f7 ga chiqdi va u yerdan e8 katagini uradi.",
      },
    },
  },
  "c1-take": {
    title: "Himoya: donani urib olish",
    idea: "Shohdan himoyaning birinchi usuli — shoh berayotgan donani urib olish.",
    lesson: [
      {
        title: "Hujumchini ol",
        text: [
          "Shohdan uch xil usulda himoyalanish mumkin. Birinchisi — **shoh bergan donani urib olish**. Shunda hujum qiladigan hech kim qolmaydi.",
          "Uni istalgan donang bilan urib olsa boʻladi — agar bu donani hech kim himoya qilmasa, hatto shoh bilan ham.",
        ],
      },
    ],
    terms: [{ term: "Shoh berayotgan donani urish", text: "Shohdan himoyaning birinchi usuli." }],
    exercises: {
      "c1-take-knight": {
        title: "Piyoda yordamga keladi",
        prompt: "Oqlarga shoh berildi. Urib olish bilan himoyalan.",
        hint: "Qaysi oq dona otni urib ola oladi?",
        why: "c2 dagi piyoda d3 dagi otni urib oldi — shoh endi yoʻq.",
      },
    },
  },
  "c1-block": {
    title: "Himoya: toʻsib qoʻyish",
    idea: "Ikkinchi usul — shoh bilan hujumchi orasiga dona qoʻyish.",
    lesson: [
      {
        title: "Yoʻlga tur",
        text: [
          "Agar shoh **uzoqdan** — rux, fil yoki farzin bilan berilgan boʻlsa, **toʻsib qoʻyish** mumkin: shoh bilan hujumchi orasidagi chiziqqa oʻz donangni qoʻyasan.",
          "Ot yoki piyoda bergan shohni toʻsib boʻlmaydi: ular bilan shoh orasida boʻsh katak yoʻq.",
        ],
      },
    ],
    terms: [{ term: "Toʻsish", text: "Himoyaning ikkinchi usuli: dona shoh bilan hujumchi orasiga turadi." }],
    exercises: {
      "c1-block-bishop": {
        title: "Fil-qalqon",
        prompt: "Oqlarga shoh berildi. Toʻsib qoʻy.",
        hint: "Rux e vertikali boʻylab hujum qilyapti. Qaysi dona shu vertikalga tura oladi?",
        why: "Fil e3 ga turdi — rux bilan shoh orasiga.",
      },
    },
  },
  "c1-run": {
    title: "Himoya: shoh bilan qochish",
    idea: "Uchinchi usul — shoh bilan xavfsiz katakka oʻtish.",
    lesson: [
      {
        title: "Bir qadam chetga",
        text: [
          "Uchinchi usul — raqib urmayotgan katakka **shoh bilan qochish**. Qochadigan joy boʻlsa, istalgan shohdan shunday qutulsa boʻladi.",
          "Yurishdan oldin tekshir: shoh boshqa hujum ostiga tushib qolmaydimi?",
        ],
      },
    ],
    terms: [{ term: "Shoh bilan qochish", text: "Himoyaning uchinchi usuli: shoh xavfsiz katakka oʻtadi." }],
    exercises: {
      "c1-run-king": {
        title: "Chetga chiq",
        prompt: "Oqlarga shoh berildi. Shoh bilan qochib himoyalan (urib olma!).",
        hint: "Rux e vertikalini va ikkinchi gorizontalni uryapti. Shoh qayerga qadam qoʻya oladi?",
        why: "Shoh f1 ga oʻtadi — bu katakni rux urmaydi. Garchi bu yerda eng yaxshisi ruxni urib olish boʻlsa ham: farzin yoki shoh bilan e2 da.",
      },
    },
  },
  "c1-defence": {
    title: "Eng yaxshi himoyani tanlash",
    idea: "Uch usuldan hech narsa yoʻqotmaydiganini tanla.",
    lesson: [
      {
        title: "Qaysi usul yaxshiroq",
        text: [
          "Himoyalar bir nechta boʻlsa, ularni solishtir. Eng yaxshisi — shoh berayotgan donani **urib olish**, agar evaziga hech narsa bermasang.",
          "**Ot** bergan shohni toʻsib boʻlmaydi: faqat otni urib olish yoki shoh bilan qochish mumkin.",
        ],
      },
    ],
    terms: [{ term: "Himoyaning uch usuli", text: "Hujumchini urib olish, toʻsib qoʻyish, shoh bilan qochish." }],
    exercises: {
      "c1-defence-quiz": {
        title: "Eng yaxshi himoya",
        prompt: "Oqlarga shoh berildi. Qaysi himoya yaxshiroq?",
        questions: [
          {
            text: "Farzin d2 dan shoh beryapti. Qanday himoyalanish yaxshiroq?",
            options: ["farzinni shoh bilan urib olish", "shoh bilan f1 ga qochish"],
          },
          {
            text: "Ot f3 dan shoh beryapti. Bu yerda qaysi himoya mumkin emas?",
            options: ["toʻsib qoʻyish", "shoh bilan qochish"],
          },
          { text: "Shohdan himoyalanishning jami nechta usuli bor?", options: ["ikkita", "uchta", "toʻrtta"] },
        ],
        hint: "d2 dagi farzinni hech kim himoya qilmayapti. Ot bergan shohni toʻsib boʻlmaydi.",
        why: "Shoh d2 dagi himoyasiz farzinni urib oladi. Ot bergan shohni toʻsib boʻlmaydi — ot bilan shoh orasida katak yoʻq. Himoya usullari uchta: urib olish, toʻsish, qochish.",
      },
    },
  },
  "c1-mate-rook": {
    title: "Rux bilan mot",
    idea: "Mot — himoyasi yoʻq shoh. Rux taxta chetida mot qiladi.",
    lesson: [
      {
        title: "Mot nima",
        text: [
          "**Mot** — bu himoyalanib boʻlmaydigan shoh: shoh berayotgan donani urib boʻlmaydi, toʻsadigan narsa yoʻq, shohning qochadigan joyi ham yoʻq. Mot partiyani tugatadi — kim mot qilsa, oʻsha gʻolib. Yozuvda mot **#** belgisi bilan belgilanadi.",
          "Himoyaning uch usulini navbatma-navbat tekshir: urib olish, toʻsish, qochish. Hech biri yordam bermasa — bu mot.",
        ],
      },
      {
        title: "Shoh taxta chetida",
        text: [
          "Rux uchun eng oson mot — **taxta chetidagi** shohga: rux butun chetki gorizontalni ushlab turadi, shoh oldidagi kataklarni esa oʻz shohing yoki raqibning oʻz piyodalari yopib turadi.",
          "Bunday mot shunday ataladi — **oxirgi gorizontaldagi mot**.",
        ],
      },
    ],
    terms: [
      { term: "Mot", text: "Himoyasi yoʻq shoh. «#» bilan belgilanadi. Partiya tugaydi." },
      { term: "Oxirgi gorizontaldagi mot", text: "Oʻz piyodalari qamab qoʻygan shohga rux yoki farzin bilan mot." },
    ],
    exercises: {
      "c1-mate-rook-corner": {
        title: "Shoh yordamida mot",
        prompt: "Oqlar yuradi. Rux bilan mot qil.",
        hint: "Oq shoh f7, g7 va h7 kataklarini allaqachon yopib turibdi. Sakkizinchi gorizontal qoldi.",
        why: "♖a8# — rux sakkizinchi gorizontal boʻylab shoh beradi, oldinga oʻtishga esa oq shoh yoʻl qoʻymaydi.",
      },
      "c1-mate-rook-side": {
        title: "Shohning roʻparasida mot",
        prompt: "Oqlar yuradi. Rux bilan mot qil.",
        hint: "Shohlar bir-biriga qarama-qarshi turibdi. Rux qayerga shoh berib turishi kerak?",
        why: "♖h8# — rux sakkizinchi gorizontalni ushlab turadi, c7, d7 va e7 kataklarini esa oq shoh yopib turibdi.",
      },
      "c1-mate-rook-pawns": {
        title: "Piyodalar oʻz shohiga xalaqit beradi",
        prompt: "Oqlar yuradi. Rux bilan mot qil.",
        hint: "g7 va h7 piyodalari shohni oldinga qoʻyib yubormaydi.",
        why: "♖a8# — oxirgi gorizontaldagi mot: qora shohni oʻz piyodalari qamab qoʻydi.",
      },
    },
  },
  "c1-mate-bishop": {
    title: "Fil bilan mot",
    idea: "Qolgan kataklar yopiq boʻlsa, fil diagonal boʻylab mot qiladi.",
    lesson: [
      {
        title: "Shohga olib boruvchi diagonal",
        text: [
          "Fil diagonal boʻylab shoh beradi. Shoh mot boʻlishi uchun shoh atrofidagi hamma kataklar band yoki hujum ostida boʻlishi kerak.",
          "Koʻpincha shohga **oʻzining donalari** xalaqit beradi: piyoda yoki fil shoh qochmoqchi boʻlgan kataklarda turadi.",
        ],
      },
    ],
    terms: [{ term: "Fil bilan mot", text: "Diagonal boʻylab berilgan, himoyasi yoʻq shoh." }],
    exercises: {
      "c1-mate-bishop-long": {
        title: "Katta diagonal",
        prompt: "Oqlar yuradi. Fil bilan mot qil.",
        hint: "a8 ga qaysi diagonal olib boradi? Unda fil uchun katak top.",
        why: "♗g2# — fil katta diagonal boʻylab a8 gacha uradi. b7 katagini oq shoh ushlab turibdi, a7 va b8 da qora donalar turibdi.",
      },
      "c1-mate-bishop-two": {
        title: "Ikki usul",
        prompt: "Oqlar yuradi. Fil bilan mot qil — ikki usul bor.",
        hint: "f7 piyodasi e8 va g8 ni, f6 dagi shoh esa e7 va g7 ni yopib turibdi. Diagonal boʻylab shoh kerak.",
        why: "♗a3# yoki ♗h6# — ikkalasi ham diagonal boʻylab shoh, qora shoh atrofidagi hamma kataklar esa allaqachon hujum ostida.",
      },
    },
  },
  "c1-mate-queen": {
    title: "Farzin bilan mot",
    idea: "Farzin — eng kuchli dona: ham toʻgʻri chiziq, ham diagonal boʻylab mot qiladi.",
    lesson: [
      {
        title: "Farzin koʻp katakni yopadi",
        text: [
          "Farzin rux va fil kabi birga yuradi, shuning uchun shohning deyarli hamma yoʻllarini oʻzi yopadi. Unga faqat yordamchi kerak — oʻz shohi, piyoda yoki taxta cheti.",
          "Farzin bilan eng koʻp uchraydigan mot — oxirgi gorizontalda, shoh oʻz piyodalari bilan qamalib qolganda.",
        ],
      },
    ],
    terms: [{ term: "Farzin bilan mot", text: "Farzin shoh beradi, shohning qochish yoʻllari esa yopiq." }],
    exercises: {
      "c1-mate-queen-rank": {
        title: "Oxirgi gorizontal",
        prompt: "Oqlar yuradi. Farzin bilan mot qil.",
        hint: "f7, g7 va h7 piyodalari shohni oldinga qoʻyib yubormaydi.",
        why: "♕d8# — farzin sakkizinchi gorizontal boʻylab shoh beradi, shoh esa oʻz piyodalari bilan qamalgan.",
      },
      "c1-mate-queen-king": {
        title: "Farzin va shoh",
        prompt: "Oqlar yuradi. Farzin bilan mot qil.",
        hint: "g8 katagini oq shoh allaqachon ushlab turibdi.",
        why: "♕b8# — farzin sakkizinchi gorizontal boʻylab shoh beradi, g8 ni oq shoh yopib turibdi, g7 va h7 da piyodalar turibdi.",
      },
    },
  },
  "c1-mate-knight": {
    title: "Ot bilan mot",
    idea: "Ot sakrab shoh beradi — ot bergan shohni toʻsib boʻlmaydi.",
    lesson: [
      {
        title: "Boʻgʻiq mot",
        text: [
          "Ot bergan shohni **toʻsib boʻlmaydi**: ot donalar ustidan sakrab oʻtadi. Shuning uchun ot shohni oʻz donalari oʻrab olganda mot qiladi.",
          "Bunday mot **boʻgʻiq mot** deyiladi: shohga tor, qoʻshni kataklarning hammasida oʻz donalari turibdi.",
        ],
      },
    ],
    terms: [{ term: "Boʻgʻiq mot", text: "Oʻz donalari bilan oʻralgan shohga ot bilan mot." }],
    exercises: {
      "c1-mate-knight-smothered": {
        title: "Shohga tor",
        prompt: "Oqlar yuradi. Ot bilan mot qil.",
        hint: "Ot qaysi katakdan h8 ga yetadi?",
        why: "♘f7# — ot h8 ni uradi, g8 dagi rux hamda g7 va h7 piyodalari shohni qochirmaydi.",
      },
      "c1-mate-knight-corner": {
        title: "Burchakda mot",
        prompt: "Oqlar yuradi. Ot bilan mot qil.",
        hint: "a8 dagi shoh oʻz donalari bilan oʻralgan. Ot a8 ni uradigan katakni top.",
        why: "♘c7# — ot shoh beradi, b8 dagi rux hamda a7 va b7 piyodalari shohni qamab qoʻydi.",
      },
    },
  },
  "c1-mate-pawn": {
    title: "Piyoda bilan mot",
    idea: "Yordam berishsa, hatto piyoda ham mot qila oladi.",
    lesson: [
      {
        title: "Kichkina, lekin xavfli",
        text: [
          "Piyoda oldinga qiyshiq hujum qilib shoh beradi. Bu mot boʻlishi uchun piyodani kimdir himoya qilishi kerak — aks holda shoh uni shunchaki urib oladi.",
          "Odatda piyodaga **oʻz shohi** yordam beradi: u piyodani ham himoya qiladi, raqib shohi atrofidagi kataklarni ham yopadi.",
        ],
      },
    ],
    terms: [
      {
        term: "Piyoda bilan mot",
        text: "Piyoda shoh beradi, uni himoya qilishadi, shohning esa qochadigan joyi yoʻq.",
      },
    ],
    exercises: {
      "c1-mate-pawn-g7": {
        title: "Piyoda va shoh",
        prompt: "Oqlar yuradi. Piyoda bilan mot qil.",
        hint: "Piyoda oʻz shohi himoyasida raqib shohining yoniga borishi kerak.",
        why: "g7# — piyoda h8 ga shoh beradi, uni f7 dagi shoh himoya qiladi, h7 katagini esa qora piyoda egallagan.",
      },
      "c1-mate-pawn-b7": {
        title: "Burchakda mot",
        prompt: "Oqlar yuradi. Piyoda bilan mot qil.",
        hint: "c7 dagi shoh b7 dagi piyodani himoya qiladi.",
        why: "b7# — piyoda a8 ga shoh beradi, c7 dagi shoh uni himoya qiladi va b8 ni ushlab turadi, a7 da esa oʻz piyodasi turibdi.",
      },
    },
  },
  "c1-mate-promotion": {
    title: "Aylanish bilan mot",
    idea: "Piyoda chetga yetib, yangi dona bilan darhol mot qiladi.",
    lesson: [
      {
        title: "Yangi dona — darhol mot bilan",
        text: [
          "Piyoda oxirgi gorizontalga yetganda istalgan donaga aylanadi. Baʼzan yangi dona **darhol mot qiladi**.",
          "Koʻpincha farzin tanlanadi, lekin rux ham mot qila oladi: u ham gorizontal boʻylab uradi.",
        ],
      },
    ],
    terms: [{ term: "Aylanish bilan mot", text: "Piyoda donaga aylanadi va u darhol mot qiladi." }],
    exercises: {
      "c1-mate-promote-d8": {
        title: "d8 da farzin",
        prompt: "Oqlar yuradi. Piyodani aylantirib, mot qil.",
        hint: "g6 dagi shoh g7 va h7 ni yopib turibdi. Sakkizinchi gorizontal qoldi.",
        why: "d8♕# (yoki d8♖#) — yangi dona sakkizinchi gorizontal boʻylab shoh beradi, shoh oldidagi kataklarni esa oq shoh ushlab turibdi.",
      },
      "c1-mate-promote-c8": {
        title: "c8 da mot",
        prompt: "Oqlar yuradi. Piyodani aylantirib, mot qil.",
        hint: "b6 dagi shoh a7 va b7 ni yopib turibdi.",
        why: "c8♕# (yoki c8♖#) — sakkizinchi gorizontal boʻylab shoh, a8 dagi shohning esa qochadigan joyi yoʻq.",
      },
    },
  },
  "c1-mate-opening": {
    title: "Debyutda mot",
    idea: "Partiya boshida kuchsiz f7 katagi (oqlarda — f2) mot uchun sevimli nishon.",
    lesson: [
      {
        title: "Kuchsiz f7 katagi",
        text: [
          "**Debyut** — partiyaning boshlanishi. Eng boshida f7 katagini faqat shoh himoya qiladi. Agar unga farzin va fil birga hujum qilsa, tezkor mot boʻlishi mumkin.",
          "Eng mashhuri — **bolalar moti**: ♕xf7#. Tuzoqqa tushmaslik uchun otni f6 ga chiqar va raqib farzini bilan fili qayerga qarayotganini kuzatib bor.",
        ],
      },
    ],
    terms: [
      { term: "Debyut", text: "Partiyaning boshlanishi: dastlabki 10–15 yurish." },
      { term: "Bolalar moti", text: "Fil yordamida farzin bilan f7 da tezkor mot." },
    ],
    exercises: {
      "c1-mate-opening-f7": {
        title: "Ot kechikdi",
        prompt: "Oqlar yuradi. Mot qil.",
        hint: "Farzin bilan fil bitta katakka qarab turibdi.",
        why: "♕xf7# — farzin c4 dagi fil himoyasida piyodani urib oladi, shohning esa qochadigan joyi yoʻq.",
      },
      "c1-mate-opening-f3": {
        title: "Farzin f3 dan",
        prompt: "Oqlar yuradi. Mot qil.",
        hint: "Qoralar otni f6 ga qoʻymadi. Endi nima himoyasiz qoldi?",
        why: "♕xf7# — oʻsha bolalar moti, faqat farzin f3 dan keldi. ♘f6 yurishi qoralarni qutqarib qolardi.",
      },
    },
  },
  "c1-castle": {
    title: "Rokirovka",
    idea: "Ikki dona bilan bitta yurish: shoh panaga, rux — oʻyinga.",
    lesson: [
      {
        title: "Rokirovka qanday qilinadi",
        text: [
          "**Rokirovka** — maxsus yurish, ikki dona bir vaqtda yuradigan yagona yurish: shoh va rux. Shoh rux tomonga **ikki katak** yuradi, rux esa uning ustidan sakrab, yoniga turadi.",
          "Qisqa rokirovka (h tomonga) **0-0**, uzun rokirovka (a tomonga) esa **0-0-0** deb yoziladi. Rokirovkani shohdan boshlab qilinadi.",
        ],
      },
      {
        title: "U nima uchun kerak",
        text: [
          "Rokirovkadan keyin shoh burchakda piyodalar orqasiga yashirinadi, rux esa markazga chiqib, oʻyinga qoʻshiladi.",
          "Shuning uchun debyutda rokirovkani **ertaroq** qilishga harakat qilinadi.",
        ],
      },
    ],
    terms: [
      { term: "Rokirovka", text: "Shoh rux tomonga ikki katak yuradi, rux esa uning narigi yoniga turadi." },
      { term: "0-0 va 0-0-0", text: "Qisqa va uzun rokirovka." },
    ],
    exercises: {
      "c1-castle-short": {
        title: "Shoh panaga",
        prompt: "Oqlar yuradi. Rokirovka qil: avval shohni, keyin u boradigan katakni bos.",
        hint: "Shoh h1 dagi rux tomonga ikki katak yuradi.",
        why: "0-0 — shoh g1 ga turdi, rux f1 ga sakrab oʻtdi.",
      },
      "c1-castle-long": {
        title: "Uzun rokirovka",
        prompt: "Oqlar yuradi. Uzun rokirovka qil.",
        hint: "Uzun rokirovka — a1 dagi rux tomonga.",
        why: "0-0-0 — shoh c1 ga bordi, rux d1 ga turdi.",
      },
      "c1-castle-quiz": {
        title: "Rokirovka qoidalari",
        prompt: "Rokirovka qanday qilinishini esla.",
        questions: [
          { text: "Rokirovkada shoh necha katak yuradi?", options: ["bir katak", "ikki katak", "uch katak"] },
          { text: "Qisqa rokirovka qanday yoziladi?" },
          {
            text: "Rokirovkani qaysi dona bilan boshlashadi?",
            options: ["shoh bilan", "rux bilan", "ikkalasidan biri bilan"],
          },
        ],
        hint: "Shoh har doim ikki katak yuradi, rux esa uning yoniga turadi.",
        why: "Shoh ikki katak yuradi, rux uning ustidan sakrab oʻtadi. Qisqasi — 0-0, uzuni — 0-0-0. Yurish shohdan boshlanadi.",
      },
    },
  },
  "c1-castle-rules": {
    title: "Rokirovka qachon mumkin emas",
    idea: "Shoh yoki rux yurgan boʻlsa, shoh berilgan boʻlsa yoki shoh yoʻli hujum ostida boʻlsa, rokirovka taqiqlanadi.",
    lesson: [
      {
        title: "Beshta taqiq",
        text: [
          "Rokirovka **mumkin emas**, agar: shoh allaqachon yurgan boʻlsa; shu rux allaqachon yurgan boʻlsa; shoh bilan rux orasida dona turgan boʻlsa; shohga shoh berilgan boʻlsa; shoh oʻtadigan yoki turadigan katak hujum ostida boʻlsa.",
          "Shart yoʻqolsa (donalar ketdi, shoh berish tugadi), rokirovkani yana qilish mumkin — agar shoh bilan rux bir marta ham yurmagan boʻlsa.",
        ],
      },
      {
        title: "Rux hujum ostida — mumkin",
        text: [
          "**Ruxga** yoki faqat rux oʻtadigan **b1** katagiga hujum rokirovkaga xalaqit bermaydi. Faqat shoh yuradigan kataklar muhim.",
        ],
      },
    ],
    terms: [
      { term: "Rokirovka taqiqi", text: "Shoh yoki rux yurgan, shoh berilgan, shoh yoʻli hujum ostida yoki band." },
    ],
    exercises: {
      "c1-castle-only-long": {
        title: "Bir tomon yopiq",
        prompt: "Oqlar yuradi. Bir tomonga rokirovka taqiqlangan — mumkin boʻlganini qil.",
        hint: "c4 dagi qora fil qayerga qarab turibdi?",
        why: "0-0-0. Qisqasi mumkin emas: c4 dagi fil shoh oʻtishi kerak boʻlgan f1 katagini uradi.",
      },
      "c1-castle-rules-quiz": {
        title: "Mumkinmi yoki yoʻqmi?",
        prompt: "Taxtaga qarab, rokirovka mumkinmi — hal qil.",
        questions: [
          {
            text: "Oqlarga e2 dagi rux shoh berdi. Rokirovka qilish mumkinmi?",
            options: ["mumkin", "mumkin emas"],
          },
          { text: "g3 dagi rux g1 katagini uradi. Qisqa rokirovka mumkinmi?", options: ["mumkin", "mumkin emas"] },
          { text: "b8 dagi rux b1 katagini uradi. Uzun rokirovka mumkinmi?", options: ["mumkin", "mumkin emas"] },
          {
            text: "Shoh bilan h1 dagi rux orasida g1 da ot turibdi. Qisqa rokirovka mumkinmi?",
            options: ["mumkin", "mumkin emas"],
          },
        ],
        hint: "Shohning yoʻli muhim: qisqasi uchun e1, f1, g1, uzuni uchun e1, d1, c1.",
        why: "Shoh berilganda rokirovka taqiqlangan. g1 hujum ostida boʻlsa yoki yoʻlda dona tursa, qisqasi mumkin emas. b1 dan esa faqat rux oʻtadi — u yerda uzun rokirovka ruxsat etilgan.",
      },
    },
  },
  "c1-develop": {
    title: "Donalarni rivojlantirish",
    idea: "Debyutda: piyodalar bilan markaz, yengil donalar oʻyinga, rokirovka, farzin — shoshilmasdan.",
    lesson: [
      {
        title: "Debyutning toʻrt qoidasi",
        text: [
          "1. Piyodalar bilan **markazni** egalla: e4, d4.",
          "2. Ot va fillarni **rivojlantir** — ularni oʻz joyidan markaz tomon chiqar. Debyutda har bir dona bilan bir marta yurgan maʼqul.",
          "3. **Rokirovka** qil — shohni yashir.",
          "4. **Farzinni** juda erta chiqarma: uni quvlashadi va vaqtni yoʻqotasan.",
        ],
      },
    ],
    terms: [
      { term: "Rivojlantirish", text: "Ot va fillarni oʻz joyidan oʻyinga olib chiqish." },
      { term: "Yengil donalar", text: "Otlar va fillar." },
    ],
    exercises: {
      "c1-develop-quiz": {
        title: "Yaxshi debyut",
        prompt: "Eng yaxshi javobni tanla.",
        questions: [
          { text: "Qaysi birinchi yurish yaxshiroq?" },
          {
            text: "Debyutda nima qilgan yaxshiroq?",
            options: ["otni markaz tomon chiqarish", "a1 dagi rux bilan a3 ga yurish", "farzin bilan hujumga yugurish"],
          },
          { text: "Debyutda bitta dona bilan necha marta yurgan yaxshiroq?", options: ["bir marta", "koʻp marta"] },
          {
            text: "Rokirovka nima uchun qilinadi?",
            options: ["shohni yashirish va ruxni oʻyinga kiritish uchun", "piyodani urib olish uchun"],
          },
        ],
        hint: "Markaz, rivojlantirish, rokirovka — farzin esa shoshilmaydi.",
        why: "e4 markazni egallaydi va fil bilan farzinga yoʻl ochadi. Otni markaz tomon chiqaramiz, har bir dona bilan — bir yurish. Rokirovka shohni yashiradi va ruxni oʻyinga kiritadi.",
      },
    },
  },
  "c1-training-1": {
    title: "Oʻquv partiyasi: italyan partiyasi",
    idea: "Qoidalar boʻyicha partiya: markaz, rivojlantirish, rokirovka — yurishma-yurish.",
    lesson: [
      {
        title: "1. e4 e5 2. ♘f3 ♘c6",
        text: [
          "Oqlar ham, qoralar ham piyodalar bilan markazni egalladi. f3 dagi ot e5 piyodasiga hujum qiladi, c6 dagi ot uni himoya qiladi. Ikkala tomon ham donalarini rivojlantiradi va piyodalarini himoya qiladi.",
        ],
      },
      {
        title: "3. ♗c4 ♗c5",
        text: [
          "Fillar faol diagonallarga chiqdi: oq fil f7 ga, qora fil f2 ga qarab turibdi. Bu **italyan partiyasi** — eng qadimgi debyutlardan biri.",
        ],
      },
      {
        title: "4. c3 ♘f6 5. d3 d6 6. 0-0 0-0",
        text: [
          "c3 va d3 piyodalari markazni mustahkamladi, ikkinchi otlar rivojlantirildi, ikkala tomon rokirovka qildi. Debyutning hamma qoidalari bajarildi — endi kurashni boshlash mumkin.",
        ],
      },
    ],
    terms: [{ term: "Italyan partiyasi", text: "1. e4 e5 2. ♘f3 ♘c6 3. ♗c4 ♗c5 debyuti." }],
    exercises: {
      "c1-training-1-castle": {
        title: "Shohni yashirish vaqti",
        prompt: "Oqlar yuradi. Markaz egallangan, donalar rivojlantirilgan. Debyut qoidalariga koʻra qaysi yurish?",
        hint: "Shoh hali markazda.",
        why: "0-0 — shoh panada, rux oʻyinga kirdi.",
      },
      "c1-training-1-quiz": {
        title: "Partiya boʻyicha savollar",
        prompt: "Oʻquv partiyasini esla.",
        questions: [
          { text: "c4 dagi oq fil qoralarning qaysi kuchsiz katagiga qarab turibdi?" },
          {
            text: "c6 dagi ot qoralarga qanday yordam beradi?",
            options: ["e5 piyodasini himoya qiladi", "shoh beradi"],
          },
        ],
        hint: "Fil diagonal boʻylab uradi, ot esa «L» shaklidagi kataklarni himoya qiladi.",
        why: "c4 dagi fil f7 ga qaraydi — boshida bu katakni faqat shoh himoya qiladi. c6 dagi ot e5 piyodasini f3 dagi otdan himoya qiladi.",
      },
    },
  },
  "c1-training-2": {
    title: "Oʻquv partiyasi: tuzoq",
    idea: "Debyut qoidalarini buzsang — mot olasan. Boshqalarning xatolaridan oʻrganamiz.",
    lesson: [
      {
        title: "Legal moti",
        text: [
          "1. e4 e5 2. ♘f3 d6 3. ♗c4 ♗g4 4. ♘c3 g6? Qoralar rivojlantirish oʻrniga ortiqcha piyoda yurishini qildi.",
          "5. ♘xe5! Oqlar farzinni berib yuboradi: 5... ♗xd1? 6. ♗xf7+ ♔e7 7. ♘d5# — uchta yengil dona mot qiladi. Bu tuzoqni 250 yildan koʻproq oldin fransuz ustasi Legal koʻrsatgan.",
        ],
      },
      {
        title: "Ochkoʻzlik jazolandi",
        text: [
          "Boshqa tuzoq: 1. e4 e5 2. ♘f3 ♘c6 3. ♗c4 ♘d4 4. ♘xe5? ♕g5! 5. ♘xf7? ♕xg2 6. ♖f1 ♕xe4+ 7. ♗e2 ♘f3#.",
          "Oqlar piyodalar ortidan quvib, oʻz shohini unutdi. Xulosa: avval rivojlantirish va shoh xavfsizligi, keyin oʻlja.",
        ],
      },
    ],
    terms: [{ term: "Tuzoq", text: "Qopqon-yurish: raqib «sovgʻa»ni oladi va motga tushadi yoki dona yoʻqotadi." }],
    exercises: {
      "c1-training-2-legal": {
        title: "Legal moti",
        prompt: "Oqlar yuradi. Mot qil.",
        hint: "e7 dagi shohning deyarli hamma kataklari yopiq. Qaysi ot hali ishlamayapti?",
        why: "♘d5# — c3 dagi ot shoh beradi, f7 dagi fil va e5 dagi ot esa shoh atrofidagi hamma kataklarni ushlab turadi.",
      },
      "c1-training-2-f3": {
        title: "Qoralar jazolaydi",
        prompt: "Qoralar yuradi. Mot qil.",
        hint: "e4 dagi farzin va d4 dagi ot birga oq shoh yonidagi kataklarga hujum qiladi.",
        why: "♘f3# — ot e1 ga shoh beradi, e2 dagi fil uni urib ololmaydi (u shohni e4 dagi farzindan toʻsib turibdi), shohning esa qochadigan joyi yoʻq.",
      },
    },
  },
  "c1-blind": {
    title: "Koʻr-koʻrona oʻyin",
    idea: "Taxtani xayolingda tasavvur qil: kataklar, chiziqlar va yurishlar — rasmsiz.",
    lesson: [
      {
        title: "Taxta xayolda",
        text: [
          "Kuchli shaxmatchilar **koʻr-koʻrona** — taxtaga qaramasdan oʻynay oladi. Buning uchun kataklarni yaxshi bilish kerak: qaysi chiziq qayerda, katak qaysi rangda, dona qayerga yura oladi.",
          "Foydali maslahat: qora kataklarda vertikal raqami (a = 1 … h = 8) bilan gorizontal raqamining yigʻindisi **juft**: a1 — 1 + 1 = 2. Oq kataklarda — toq.",
        ],
      },
    ],
    terms: [
      {
        term: "Koʻr-koʻrona oʻyin",
        text: "Taxtasiz oʻyin: yurishlar ovoz chiqarib aytiladi, pozitsiya esa xayolda tasavvur qilinadi.",
      },
    ],
    exercises: {
      "c1-blind-quiz": {
        title: "Taxtasiz",
        prompt: "Taxtaga qaramasdan javob ber.",
        questions: [
          { text: "e4 katagi qaysi rangda?", options: ["oq", "qora"] },
          { text: "h8 katagi qaysi rangda?", options: ["oq", "qora"] },
          {
            text: "Boshlangʻich holatda oq ot g1 da turibdi. U qayerga yura oladi?",
            options: ["f3 va h3", "e2, f3 va h3"],
          },
          { text: "Fil c1 da turibdi. U bir yurishda h6 ga bora oladimi (yoʻl boʻsh)?", options: ["ha", "yoʻq"] },
          { text: "Rux a1 da, qora shoh a8 da, ular orasi boʻsh. Bu shohmi?", options: ["ha", "yoʻq"] },
        ],
        hint: "Yigʻindini hisobla: harf — vertikal raqami, ustiga gorizontal raqami.",
        why: "e4: 5 + 4 = 9 — toq, oq katak. h8: 8 + 8 = 16 — juft, qora katak. Boshida g1 dagi ot f3 yoki h3 ga yuradi (e2 da piyoda turibdi). c1–h6 — bitta diagonal. a1 dagi rux vertikal boʻylab a8 gacha uradi — bu shoh.",
      },
    },
  },
};
