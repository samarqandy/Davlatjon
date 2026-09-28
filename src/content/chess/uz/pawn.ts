import type { Uz } from "../../localize";
import type { ChessLevel } from "../types";

export const pawnUz: Uz<ChessLevel> = {
  name: "Piyoda",
  title: "Ilk qadamlar",
  goal: "Shaxmat taxtasi va kataklarning nomlari bilan tanishasan, donalar qayerda turishini, piyoda qanday yurishi va qanday urishini bilib olasan.",
  legend: {
    hook: "Nega hamma donalar ichida faqat piyoda boshqa donaga aylana oladi?",
    title: "Farzinga aylangan piyoda askar",
    story: [
      "Qadimgi hind chaturangasida piyodalar yayov askarlar edi — qoʻshindagi eng oddiy jangchilar. Ular faqat oldinga yurardi: piyoda askarga ortga chekinish mumkin emas edi.",
      "Piyoda taxtaning narigi chetiga yetib keldimi — demak, u butun dushman qoʻshinini yorib oʻtdi. Bunday jasorat uchun piyoda mukofot oladi: u istalgan donaga, koʻpincha farzinga aylanadi.",
      "Bundan 250 yil oldin fransuz ustasi Filidor shunday yozgan: «Piyodalar — shaxmatning joni». U birinchi boʻlib shuni angladi: partiyani faqat kuchli donalar emas, toʻgʻri qoʻyilgan piyodalar ham yutib beradi.",
    ],
    secret:
      "Qoidalarga koʻra, bitta oʻyinchida toʻqqiztagacha farzin boʻlishi mumkin: oʻz farzini va piyodalardan aylangan yana sakkiztasi. Oddiy shaxmat toʻplamida buncha farzin yoʻq — shuning uchun yangi farzin oʻrniga ruxni teskari qilib qoʻyishadi.",
  },
  lesson: [
    {
      title: "Shaxmat taxtasi",
      text: [
        "Shaxmat taxtasi — 64 ta katakdan iborat kvadrat: 8 ta qator, har birida 8 tadan katak. Kataklar oq va qora boʻladi. Taxta shunday qoʻyiladi: oʻng pastki burchakda **oq** katak boʻlishi kerak.",
        "Chapdan oʻngga ketgan qatorlar **gorizontallar** deyiladi — ular 1 dan 8 gacha raqamlangan. Pastdan yuqoriga ketgan ustunlar — **vertikallar**, ular a dan h gacha harflar bilan belgilanadi. Bir xil rangdagi kataklardan tuzilgan qiya chiziqlar esa **diagonallar** deyiladi.",
        "Har bir katakning oʻz nomi bor: vertikalning harfi va gorizontalning raqami. Taxta oʻrtasidagi yoritilgan katak — e4.",
      ],
    },
    {
      title: "Partiya boshida donalar",
      text: [
        "Oqlarda ham, qoralarda ham 16 tadan dona bor: shoh, farzin, ikkita rux, ikkita fil, ikkita ot va sakkizta piyoda. Birinchi boʻlib doim oqlar yuradi, keyin oʻyinchilar navbatma-navbat yurishadi.",
        "Bu qoidani eslab qol: **farzin oʻz rangini yaxshi koʻradi**. Oq farzin oq katakda — d1 da turadi, qora farzin esa qora katakda — d8 da. Shohlar farzinlarning yonida turadi.",
      ],
    },
    {
      title: "Piyoda qanday yuradi",
      text: [
        "Piyoda faqat **oldinga bir katak** yuradi. Agar piyoda hali joyidan qoʻzgʻalmagan boʻlsa, birinchi yurishida birdaniga **ikki** katak oʻtishi mumkin.",
        "Urishi esa boshqacha: piyoda **oldinga qiyalab** — diagonal boʻylab bir katak uradi. Roʻparasidagi donani piyoda ura olmaydi, orqaga esa hech qachon yurmaydi.",
        "Oq piyodani bos — u qayerga yura olishini koʻrasan.",
      ],
    },
    {
      title: "Piyodaning aylanishi",
      text: [
        "Oxirgi gorizontalga yetib borgan piyoda shohdan boshqa istalgan donaga **aylanadi**. Koʻpincha — eng kuchlisiga, farzinga!",
        "Shuning uchun kichkina piyoda ham juda xavfli boʻlishi mumkin. Agar uning yoʻlida raqib piyodalari boʻlmasa, uni «oʻtar piyoda» deb atashadi.",
      ],
    },
  ],
  rules: [
    "Birinchi boʻlib oqlar yuradi, keyin navbatma-navbat yurishadi.",
    "Bir yurishda faqat bitta dona yuradi (rokirovkadan tashqari — u haqda «Rux» darajasida bilib olasan).",
    "Oʻz donangni urib boʻlmaydi. Raqib donasini esa «urib olish» mumkin: uni taxtadan olib, oʻrniga oʻz donangni qoʻyasan.",
    "Piyoda oldinga bir katak yuradi, birinchi yurishida esa — bir yoki ikki katak.",
    "Piyoda oldinga qiyalab bir katak uradi.",
    "Oxirgi gorizontalga yetgan piyoda farzin, rux, fil yoki otga aylanadi.",
  ],
  terms: [
    {
      term: "Gorizontal",
      text: "Chapdan oʻngga ketgan kataklar qatori. Gorizontallar 1 dan 8 gacha raqamlar bilan belgilanadi.",
    },
    {
      term: "Vertikal",
      text: "Pastdan yuqoriga ketgan kataklar ustuni. Vertikallar a dan h gacha harflar bilan belgilanadi.",
    },
    { term: "Diagonal", text: "Bir xil rangdagi kataklardan iborat qiya chiziq." },
    { term: "Piyoda", text: "Eng kichik dona. Partiya boshida har bir oʻyinchining 8 ta piyodasi boʻladi." },
    { term: "Urib olish", text: "Raqib donasi taxtadan olib tashlanadigan yurish." },
    { term: "Piyodaning aylanishi", text: "Taxtaning oxiriga yetgan piyoda boshqa donaga aylanadi." },
  ],
  facts: [
    "Shaxmatning yoshi 1500 yilga yaqin. U Hindistonda paydo boʻlgan, keyin Eron va Oʻrta Osiyoga, u yerdan esa Yevropaga yetib borgan.",
    "1977-yilda Samarqanddagi qadimiy Afrosiyob shahri xarobalarida arxeologlar yettita kichkina shaxmat donasini topishdi. Ular fil suyagidan yasalgan va yoshi 1200 yildan oshadi — bu dunyodagi eng qadimgi shaxmatlardan biri!",
    "Taxtada farzin boʻlsa ham, piyoda yana farzinga aylana oladi. Baʼzi partiyalarda bitta oʻyinchida birdaniga uchta farzin boʻlgan.",
  ],
  exercises: {
    "pawn-squares": {
      title: "Katakni top",
      prompt: "Topshiriqda aytilgan kataklarni bos. Avval taxtaning pastidan harfni, keyin yon tomonidan raqamni top.",
      hint: "Harf — bu vertikal (ustun), raqam — gorizontal (qator). a1 katagi chap pastki burchakda.",
      why: "Katak nomi vertikal harfi va gorizontal raqamidan tuziladi: e4 — bu e vertikali va 4-gorizontal.",
    },
    "pawn-board-quiz": {
      title: "Taxta va donalar",
      prompt: "Taxta haqidagi savollarga javob ber.",
      questions: [
        { text: "Taxtaning oʻng pastki burchagidagi h1 katagi qanday rangda?", options: ["Oq", "Qora"] },
        { text: "Chap pastki burchakdagi a1 katagi qanday rangda?", options: ["Oq", "Qora"] },
        { text: "Partiya boshida oq farzin qaysi katakda turadi?" },
      ],
      hint: "Taxta shunday qoʻyiladiki, oʻng pastda oq katak boʻladi. Farzin esa oʻz rangini yaxshi koʻradi.",
      why: "h1 — oq, a1 — qora. Oq farzin oq katakda, d1 da turadi: «farzin oʻz rangini yaxshi koʻradi».",
    },
    "pawn-moves": {
      title: "Piyodaning yurishlari",
      prompt:
        "Oq piyoda e2 dan yura oladigan hamma kataklarni belgila. Kataklarni bosib chiq, keyin «Tekshirish» tugmasini bos.",
      hint: "Piyoda hali yurmagan — demak, oldinga bir yoki ikki katak yura oladi. Yana qara-chi: qiyalab kimni ura oladi?",
      why: "Oldinga — e3 va e4 (birinchi yurishda piyoda bir yoki ikki katak yuradi). Qiyalab esa piyoda d3 dagi otni va f3 dagi filni uradi.",
    },
    "pawn-blocked": {
      title: "Piyodaning yoʻli berk",
      prompt: "Oq piyoda d4 dan qayerga yura oladi? Shunday kataklarning hammasini belgila.",
      hint: "Oldida boshqa piyoda turgan boʻlsa, piyoda oldinga yura oladimi? Kimni ura oladi-chi?",
      why: "Oldinga piyoda yura olmaydi: d5 katagi band, toʻgʻriga esa piyoda urmaydi. Bitta yoʻl qoladi — e5 dagi otni urib olish.",
    },
    "pawn-capture": {
      title: "Piyoda uradi",
      prompt:
        "Oq piyodalardan biri qora donani urib olishi mumkin. Shu yurishni qil: avval piyodani, keyin u boradigan katakni bos.",
      hint: "Piyoda faqat oldinga qiyalab uradi. Har bir piyodani tekshirib koʻr: uning oldida, qiya tomonda nima turibdi?",
      why: "e3 dagi piyoda d4 dagi ruxni uradi. g4 dagi piyoda filga taqalib qolgan, b2 dagi piyoda esa hech kimga yetmaydi.",
    },
    "pawn-promotion": {
      title: "Farzinlikka yoʻl",
      prompt:
        "Oq piyoda farzin boʻlmoqchi, lekin uning roʻparasida rux turibdi. Piyoda oxirgi gorizontalga qanday chiqadi?",
      hint: "Oldinga yurib boʻlmaydi. Lekin piyoda qiyalab ura oladi — va urib olgan zahoti aylanishi ham mumkin.",
      why: "Piyoda d8 dagi otni yoki f8 dagi filni urib oladi va shu zahoti farzinga aylanadi.",
    },
    "pawn-rules-quiz": {
      title: "Piyoda qoidalari",
      prompt: "Oʻzingni sinab koʻr: piyoda qanday yuradi?",
      questions: [
        { text: "Piyoda orqaga yura oladimi?", options: ["Ha", "Yoʻq"] },
        {
          text: "Piyoda raqib donalarini qanday uradi?",
          options: ["Toʻgʻri oldinga", "Oldinga qiyalab", "Istalgan tomonga"],
        },
        { text: "Piyoda qaysi donaga aylana olmaydi?", options: ["Farzinga", "Otga", "Shohga"] },
      ],
      hint: "Darsni esla: piyoda toʻgʻriga yuradi, qiyalab uradi. Har bir oʻyinchining shohi esa doim bittagina boʻladi.",
      why: "Piyoda faqat oldinga yuradi, oldinga qiyalab uradi va shohdan boshqa istalgan donaga aylanadi.",
    },
  },
};
