import type { Uz } from "../../localize";
import type { ChessLevel } from "../types";

export const knightUz: Uz<ChessLevel> = {
  name: "Ot",
  title: "«L» harfi shaklida sakrash",
  goal: "Ot bilan yurishni, donalar ustidan sakrab oʻtishni va «vilka»ni — bir yoʻla ikki donaga hujumni topishni oʻrganasan.",
  legend: {
    hook: "Sakray oladigan yagona dona. Bu mahorat unga qayerdan kelgan?",
    title: "Toʻxtatib boʻlmas chavandoz",
    story: [
      "Chaturangada ot chavandoz edi. Piyoda askarlar va jang aravalari yoʻl boʻylab yurardi, chavandoz esa xandaqdan ham, toʻsiqdan ham, dushman safidan ham sakrab oʻta olardi. Shuning uchun shaxmatda faqat ot donalar ustidan sakraydi.",
      "Otning yurishi bundan 1200 yil oldin ham odamlarni hayratga solgan — xuddi bugun seni hayratga solganidek. Bagʻdodda al-Adliy degan usta bir masala oʻylab topgan: ot bilan 64 ta katakning hammasini aylanib chiqish, hech bir katakka ikki marta qadam bosmasdan. Va u buni uddalagan!",
      "Inglizchada bu dona knight, yaʼni «ritsar» deb ataladi, oʻzbekchada esa shunchaki ot. Lekin u hamma joyda bir xil yuradi — «L» harfi shaklida.",
    ],
    secret:
      "Ot har yurganda katak rangini almashtiradi: oqdan qoraga, qoradan oqqa. Shuning uchun ot hech qachon oʻzi turgan katak bilan bir xil rangli katakdagi donaga hujum qilmaydi — tekshirib koʻr!",
  },
  lesson: [
    {
      title: "Ot qanday yuradi",
      text: [
        "Ot **«L» harfi shaklida** yuradi: toʻgʻriga ikki katak — vertikal yoki gorizontal boʻylab — va yonga bir katak.",
        "Ot — boshqa donalar ustidan **sakrab oʻta oladigan** yagona dona: oʻzinikilar ustidan ham, raqibnikilar ustidan ham. Ot qanday yursa, shunday uradi: raqib donasi turgan katakka borib tushadi.",
        "Otni bos va u qayerlarga sakray olishini koʻr.",
      ],
    },
    {
      title: "Ot rang almashtiradi",
      text: [
        "Yaxshilab qara: ot qora katakdan doim oq katakka sakraydi, oq katakdan esa — qorasiga. **Har yurishda ot katak rangini almashtiradi.**",
        "Bu otning yurishlarini tez topishga va hiylali masalalarni yechishga yordam beradi.",
      ],
    },
    {
      title: "Taxta chetidagi ot",
      text: [
        "Taxta markazida otning 8 ta yurishi bor, burchakda esa — atigi 2 ta. Shaxmatchilar shunday deydi: **«Chetdagi ot — yomon ot»**.",
        "Shuning uchun otlarni odatda markazga yaqinroq olib chiqishadi.",
      ],
    },
    {
      title: "Vilka",
      text: [
        "Bitta dona raqibning ikkita donasiga bir yoʻla hujum qilsa, bu **vilka** deyiladi. Raqib ulardan faqat bittasini qutqarib ulguradi.",
        "Ot — vilka ustasi! Mana bu yerda oq ot f6 ga sakradi: u shoh berdi va shu bilan birga farzinga hujum qildi.",
      ],
    },
  ],
  rules: [
    "Ot «L» harfi shaklida yuradi: toʻgʻriga ikki katak va yonga bir katak.",
    "Ot har qanday donalar ustidan sakrab oʻtadi.",
    "Ot raqib donasi turgan katakka tushib, uni urib oladi.",
    "Ot har yurishda katak rangini almashtiradi.",
  ],
  terms: [
    { term: "Ot", text: "«L» harfi shaklida yuradigan va sakray oladigan dona." },
    { term: "Hujum", text: "Dona keyingi yurishda boshqa donani urib ola olsa, demak, unga hujum qilyapti." },
    {
      term: "Himoya",
      text: "Agar donani urib olgan raqib donasini javob yurishida urib olish mumkin boʻlsa, dona himoyalangan hisoblanadi.",
    },
    { term: "Vilka", text: "Bitta donaning raqibning ikki yoki undan koʻp donasiga bir yoʻla hujum qilishi." },
  ],
  facts: [
    "Ot bilan butun taxtani aylanib chiqish mumkin — 64 ta katakning har birida roppa-rosa bir martadan boʻlib. Bunday aylanishlarni Leonard Eyler oʻrgangan — «Eyler doiralari»ni oʻylab topgan oʻsha olim.",
    "Boshlangʻich holatda faqat piyodalar va otlar yura oladi: otlar oʻz piyodalari ustidan sakrab oʻtadi.",
    "Oʻzbekchada bu dona hayvonning oʻz nomi bilan — «ot» deb ataladi. Koʻp boshqa tillarda ham uni ot deyishadi.",
  ],
  exercises: {
    "knight-moves": {
      title: "Otning sakrashlari",
      prompt: "Ot d4 dan sakray oladigan hamma kataklarni belgila.",
      hint: "Ikki katak yuqoriga va bir katak yonga — bular c6 va e6. Endi ikki katak pastga, ikki katak chapga, ikki katak oʻngga…",
      why: "Markazdan ot 8 ta katakka sakraydi: c6, e6, f5, f3, e2, c2, b3, b5. Ularning hammasi d4 dan boshqa rangda.",
    },
    "knight-corner": {
      title: "Burchakdagi ot",
      prompt: "Ot h1 dan qayerga yura oladi? Hamma kataklarni belgila.",
      hint: "Burchakda otning yurishlari juda kam. Raqib piyodasini ot urib olishi mumkin.",
      why: "Burchakdan otning atigi ikkita yurishi bor: f2 ga va g3 ga — u yerda ot piyodani urib oladi.",
    },
    "knight-jump": {
      title: "Ot sakrab oʻtadi",
      prompt: "Bu — boshlangʻich holat. b1 dagi ot qayerga yura oladi?",
      hint: "Piyodalar otga xalaqit bermaydi — u ularning ustidan sakrab oʻtadi. Lekin oʻz donasi turgan katakka tushib boʻlmaydi.",
      why: "Ot piyodalar ustidan a3 ga yoki c3 ga sakraydi. d2 katagida esa oʻz piyodasi turibdi.",
    },
    "knight-stars": {
      title: "Yulduzli soʻqmoq",
      prompt:
        "Ot bilan hamma yulduzchalarni yigʻ. Ot sakraydigan katakni bos. Iloji boricha kamroq yurishga harakat qil.",
      hint: "Yulduzchalar ketma-ket joylashgan: har biridan keyingisiga sakrab oʻtsa boʻladi.",
      why: "Eng yaxshi yoʻl: b1 → c3 → e4 → g5 → f7 — toʻrtta sakrash, har bir yulduzga bittadan.",
    },
    "knight-journey": {
      title: "Otning sayohati",
      prompt: "Otni a1 burchagidan qarama-qarshi burchakka — h8 dagi yulduzgacha imkon qadar tez olib bor.",
      hint: "Har yurishda ot maqsadga koʻpi bilan ikki katak yaqinlashadi. Taxtaning diagonali boʻylab «zinapoya» shaklida yur.",
      why: "Buni 6 ta yurishdan kamroqda uddalab boʻlmaydi. Masalan: a1 → b3 → c5 → d7 → f8 → g6 → h8.",
    },
    "knight-fork": {
      title: "Vilka!",
      prompt:
        "Yurish navbati oqlarda. Ot bilan shunday yurish topki, u shoh bersin va shu bilan birga farzinga ham hujum qilsin.",
      hint: "Qara-chi: ot qaysi kataklardan g8 dagi shohga hujum qila oladi? Ular orasida farzinga ham yetadigan katak bormi?",
      why: "Ot f6 ga sakrab, g8 dagi shohga shoh beradi va d7 dagi farzinga hujum qiladi. Shoh qochishga majbur, keyingi yurishda esa ot farzinni urib oladi.",
    },
    "knight-quiz": {
      title: "Ot va kataklar rangi",
      prompt: "Oʻylab koʻr-da, javob ber.",
      questions: [
        {
          text: "Ot oq katakda turibdi. Bir yurishdan keyin u qanday rangli katakka tushadi?",
          options: ["Oq katakka", "Qora katakka"],
        },
        {
          text: "Ikki yurishdan keyin-chi?",
          options: ["Oq katakka", "Qora katakka", "Har xil boʻladi"],
        },
        { text: "Taxta burchagida turgan otning nechta yurishi bor?" },
      ],
      hint: "Ot har yurishda katak rangini almashtiradi. Rangni ikki marta almashtirsa, nima boʻladi?",
      why: "Har bir yurish rangni almashtiradi: oq → qora → oq. Burchakda otning atigi 2 ta yurishi bor.",
    },
  },
};
