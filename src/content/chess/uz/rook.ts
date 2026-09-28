import type { Uz } from "../../localize";
import type { ChessLevel } from "../types";

export const rookUz: Uz<ChessLevel> = {
  name: "Rux",
  title: "Toʻgʻri chiziqlar",
  goal: "Rux bilan vertikal va gorizontal boʻylab yurishni, toʻsiqlarni aylanib oʻtishni oʻrganasan. Rokirovka nima ekanini ham bilib olasan.",
  legend: {
    hook: "Rux oʻzi nima — qayiqmi, minorami yoki jang aravasi?",
    title: "Minoraga aylangan jang aravasi",
    story: [
      "Hindiston va Eronda bu dona jang aravasi edi, forslar uni «rux» deb atashgan. Biz ham uni hozirgacha shunday ataymiz — rux! Rivoyat qilishlaricha, oʻgʻli tugʻilgan paytda Amir Temur shaxmat oʻynab oʻtirgan ekan va aynan shu lahzada raqibiga rux bilan shoh beribdi. Shuning uchun oʻgʻliga Shohrux deb ism qoʻyibdi — «shoh» va «rux»!",
      "Yevropada jang aravasining oʻrnini minora egalladi: qalʼalarning minoralari bor edi, jang aravalari esa allaqachon qolmagan edi. Inglizcha bu dona «rook» deyiladi — u ham oʻsha «rux» soʻzidan kelib chiqqan.",
      "Rus tilida esa bu dona «ladya», yaʼni «qayiq» deb ataladi! Qadimgi Rusda uni ikki uchi yuqoriga qayrilgan kemacha shaklida oʻyib yasashgan. Arxeologlar shunday donalarni Novgorod shahridan topishgan.",
    ],
    secret:
      "Ikki rux oʻz shohining yordamisiz ham mot qila oladi. Buning usuli «narvon» deb ataladi: ruxlar navbatma-navbat yurib, raqib shohidan gorizontallarni birin-ketin tortib oladi. Buni «Ikki rux bilan mot» mashqida sinab koʻr.",
  },
  lesson: [
    {
      title: "Rux qanday yuradi",
      text: [
        "Rux **vertikal va gorizontal boʻylab** yuradi: oldinga, orqaga, chapga va oʻngga — xohlagancha katakka. Donalar ustidan sakrab oʻtishni esa bilmaydi.",
        "Ruxni bosib koʻr: boʻsh taxtada u qayerda turmasin, roppa-rosa 14 ta katakni uradi.",
      ],
    },
    {
      title: "Ochiq vertikal",
      text: [
        "Birorta ham piyoda boʻlmagan vertikal **ochiq** vertikal deyiladi. Rux ochiq vertikallarni yaxshi koʻradi: ular orqali raqib tomoniga yorib kiradi.",
        "Bu yerda d vertikali ochiq. Oq rux d1 da turib, butun vertikalni nazorat qiladi.",
      ],
    },
    {
      title: "Rokirovka",
      text: [
        "**Rokirovka** — shoh va ruxning maxsus yurishi. Bu ikki dona birdaniga joyidan qoʻzgʻaladigan yagona yurish. Shoh rux tomonga **ikki katak** siljiydi, rux esa shohning ustidan sakrab oʻtib, uning yonidan joy oladi.",
        "Rokirovka shohni xavfsiz burchakka yashiradi va ruxni oʻyinga olib chiqadi. Rokirovkaning batafsil qoidalarini «Shoh» darajasida bilib olasan.",
      ],
    },
  ],
  rules: [
    "Rux vertikal va gorizontal boʻylab xohlagancha katakka yuradi.",
    "Rux donalar ustidan sakrab oʻtmaydi.",
    "Boʻsh taxtada rux istalgan katakdan 14 ta katakni uradi.",
    "Rokirovkada shoh rux tomonga ikki katak yuradi, rux esa shohning ustidan oʻtib, uning yoniga turadi.",
  ],
  terms: [
    { term: "Rux", text: "Vertikal va gorizontal boʻylab yuradigan dona." },
    { term: "Ochiq vertikal", text: "Birorta ham piyoda yoʻq vertikal." },
    {
      term: "Rokirovka",
      text: "Maxsus yurish: shoh rux tomonga ikki katak yuradi, rux esa uning ustidan sakrab oʻtadi.",
    },
  ],
  facts: [
    "Forschada bu dona «rux» deb ataladi — oʻzbekcha «rux» ham shundan. Ruscha «ladya» soʻzi esa «qayiq» degani.",
    "Rux — boʻsh taxtaning qayerida turmasin, bir xil sondagi katakni uradigan yagona dona: har doim 14 ta.",
    "Ikki rux birgalikda yolgʻiz shohni «narvon» usulida mot qila oladi. Buni «Shoh» darajasida oʻrganasan.",
  ],
  exercises: {
    "rook-moves": {
      title: "Rux yoʻllari",
      prompt: "Rux d4 da turibdi. U yura oladigan barcha kataklarni belgila.",
      hint: "Ruxdan toʻrtta nur chiqadi: yuqoriga, pastga, chapga va oʻngga. Har birini taxta chetigacha kuzatib chiq.",
      why: "d vertikali boʻylab — 7 ta katak, 4-gorizontal boʻylab — yana 7 ta. Hammasi boʻlib 14 ta.",
    },
    "rook-blocked": {
      title: "Rux va toʻsiqlar",
      prompt:
        "Rux e4 da turibdi. U qaysi kataklarga yura oladi? Oʻz piyodang yoʻlni toʻsadi, raqib donalarini esa urib olish mumkin.",
      hint: "Yuqoriga rux faqat oʻz piyodasigacha boradi — piyoda turgan katakka yura olmaydi. Chapga va pastga — raqib donalarigacha, ularni urib olsa boʻladi.",
      why: "Yuqoriga — e5 (undan narida oʻz piyodasi turibdi), pastga — e3 va e2 dagi piyodani urish, chapga — d4, c4 va b4 dagi otni urish, oʻngga — f4, g4, h4. Hammasi boʻlib 9 ta katak.",
    },
    "rook-stars": {
      title: "Rux yulduzcha teradi",
      prompt: "Rux bilan barcha yulduzchalarni eng kam yurishda yigʻib ol.",
      hint: "Bir chiziqda turgan yulduzchalarni izla: har bir yulduzchadan keyingisiga bitta yurishda yetib borsa boʻladi.",
      why: "a1 → a5 → e5 → e8 → h8: toʻrt yurish, har bir yulduzchaga bittadan.",
    },
    "rook-maze": {
      title: "Labirint",
      prompt: "Oʻz piyodalaring yoʻlni toʻsib qoʻydi. Ruxni h8 dagi yulduzchaga eng kam yurishda olib bor.",
      hint: "Qisqa yoʻllar a8 va h1 orqali oʻtadi, ammo ular berk. Butun taxtani kesib oʻtsa boʻladigan boʻsh gorizontalni top.",
      why: "Masalan: a1 → b1 → b6 → h6 → h8. Bundan qisqasi yoʻq: ikki va uch yurishli hamma yoʻllarni piyodalar toʻsib turibdi.",
    },
    "rook-hunt": {
      title: "Rux ovda",
      prompt: "Yurish navbati oqlarda. Rux otni ham, filni ham urib olishi mumkin. Qaysi birini olish foydali?",
      hint: "Har bir qora donani kim himoya qilayotganini tekshir. Raqib bunga javoban ruxni urib ola oladimi?",
      why: "h1 dagi fil himoyasiz — uni tekinga olsa boʻladi. d6 dagi otni esa c7 dagi piyoda himoya qiladi: otni urgan rux oʻzi halok boʻladi, rux esa otdan qimmatroq.",
    },
    "rook-quiz": {
      title: "Rux va rokirovka",
      prompt: "Oʻzingni sinab koʻr.",
      questions: [
        { text: "Rux boʻsh taxtaning a1 burchagida tursa, nechta katakni uradi?" },
        { text: "Rokirovkada qaysi ikki dona qatnashadi?", options: ["Shoh va rux", "Shoh va farzin", "Rux va fil"] },
        { text: "Rokirovkada shoh necha katak yuradi?", options: ["Bir katak", "Ikki katak", "Uch katak"] },
      ],
      hint: "Rux vertikal va gorizontal boʻylab uradi — har bir chiziqdagi kataklarni sanab chiq.",
      why: "a1 burchagidan rux vertikal boʻylab 7 ta, gorizontal boʻylab yana 7 ta katakni uradi — jami 14 ta. Rokirovkada shoh bilan rux qatnashadi, shoh ikki katak yuradi.",
    },
  },
};
