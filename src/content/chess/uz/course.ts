import type { Uz } from "../../localize";
import type { COURSE_1, COURSE_1_LESSONS, COURSE_1_MODULES } from "../course";

export const course1Uz: Uz<typeof COURSE_1> = {
  title: "1-bosqich «Piyoda»",
  subtitle: "Shaxmat noldan — darsma-dars",
  about:
    "Avval taxta va yurishlarni yozish, keyin har bir dona, donalarning qiymati, shoh berish va undan himoyalanishning uch usuli. Har bir darsda — qisqa nazariya va taxtadagi mashqlar. Darslar tartibi M.I. Glotovning «Shaxmat mahorati bosqichlari» metodikasi asosida; pozitsiyalar maktab uchun tuzilgan va shaxmat dvigateli bilan tekshirilgan.",
};

export const course1ModulesUz: Uz<typeof COURSE_1_MODULES> = {
  board: { title: "Taxta va yurishlarni yozish" },
  pieces: { title: "Donalar qanday yuradi" },
  value: { title: "Donalarning qiymati va almashuv" },
  check: { title: "Shoh berish va undan himoya" },
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
};
