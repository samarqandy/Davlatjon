import type { Uz } from "../../localize";
import type { ChessLevel } from "../types";

export const kingUz: Uz<ChessLevel> = {
  name: "Shoh",
  title: "Shoh va mot",
  goal: "Shoh qanday yurishini, shoh berish, mot va pat nima ekanini bilib olasan. Shoh berilganda qanday himoyalanishni va rokirovka qilishni oʻrganasan. Ilk motlaringni ham qilasan!",
  legend: {
    hook: "Nega shohni hech qachon «yeyishmaydi», partiya esa baribir tugaydi?",
    title: "Oʻldirib boʻlmaydigan shoh",
    story: [
      "Shoir Firdavsiy «Shohnoma» dostonida hikoya qiladi: shaxmatni donishmandlar oʻylab topishgan. Ular malikaga uning oʻgʻli Talxand qanday halok boʻlganini koʻrsatib bermoqchi edi. Akasi bilan boʻlgan jangda Talxandni hech kim yaralamagan — u shunchaki har tomondan qurshovda yolgʻiz qolgan edi.",
      "Shaxmatda ham xuddi shunday: shohni urib olishmaydi. Unga qochishga joy qolmasa va uni hech kim himoya qila olmasa — bu mot. Bu soʻz fors tilidan kelgan: «shoh mot» — «shoh chorasiz qoldi» degani.",
      "Ulkan mamlakatda hukmronlik qilgan xalifa al-Maʼmun tan olgan ekan: u butun dunyoni boshqaradi-yu, ikki tirsaklik taxtadagi donalarning uddasidan chiqa olmaydi. Shohni esa asrab-avaylash kerak: u senda bitta, xolos.",
    ],
    secret:
      "Bir yurishda ikki dona birdaniga joyidan qoʻzgʻaladigan yagona holat bor — bu rokirovka. Unda rux shohga burchakka yashirinishga yordam beradi. Rokirovkani Yevropada taxminan 500 yil oldin oʻylab topishgan: shoh yangi, chaqqon donalardan qochib ulgurishi kerak edi.",
  },
  lesson: [
    {
      title: "Shoh qanday yuradi",
      text: [
        "Shoh **istalgan tomonga bir katak** yuradi. Bu eng muhim dona: shohni urib olib boʻlmaydi, uni raqib urib turgan katakka qoʻyish ham mumkin emas.",
        "Oq shohni bosib koʻr: u d vertikalidagi kataklarga yura olmaydi — ularni qora rux urib turibdi.",
      ],
    },
    {
      title: "Shoh berish",
      text: [
        "Shohga hujum qilish **shoh berish** deyiladi. Shoh berilganda albatta himoyalanish kerak. Buning uchta usuli bor:",
        "shoh bilan xavfsiz katakka **qochish**, **toʻsish** — shoh bilan hujumchi dona orasiga oʻz donangni qoʻyish, yoki shoh bergan donani **urib olish**.",
      ],
    },
    {
      title: "Mot",
      text: [
        "**Mot** — bu qutulib boʻlmaydigan shoh. Kim mot qilsa, partiyani oʻsha yutadi!",
        "Bu yerda qora shohga farzin shoh bergan, farzinni esa oq shoh himoya qilyapti. Qochishga joy yoʻq, toʻsishga dona yoʻq, farzinni urib boʻlmaydi — mot.",
      ],
    },
    {
      title: "Pat",
      text: [
        "Baʼzan shoh berilmagan boʻladi, lekin yurishga ham joy yoʻq: har qanday yurish shohni zarba ostiga qoʻygan boʻlardi. Bu **pat** deyiladi, partiya esa **durang** bilan tugaydi.",
        "Bu yerda qoralar yuradi. Shoh berilmagan, lekin a8 dagi shoh hech qayerga yura olmaydi — bu pat. Ehtiyot boʻl: yutib turganingda raqibni «pat qilib» qoʻyma!",
      ],
    },
    {
      title: "Rokirovka qoidalari",
      text: [
        "Rokirovka faqat shunday hollarda mumkin: shoh ham, shu rux ham hali **bir marta ham yurmagan**; ular orasida **dona yoʻq**; shohga **shoh berilmagan** va u raqib urib turgan katakdan oʻtmaydi.",
        "Qisqa rokirovka h vertikalidagi rux tomonga, uzun rokirovka esa a vertikalidagi rux tomonga qilinadi.",
      ],
    },
  ],
  rules: [
    "Shoh istalgan tomonga bir katak yuradi.",
    "Shohni hujum ostidagi katakka qoʻyish ham, shoh berilgan holda qoldirish ham mumkin emas.",
    "Shoh berilganda uch xil himoya bor: qochish, toʻsish yoki hujum qilgan donani urib olish.",
    "Mot — qutulib boʻlmaydigan shoh. Mot qilgan oʻyinchi partiyani yutadi.",
    "Pat — birorta ham yurish yoʻq, lekin shoh ham berilmagan. Pat — durang.",
    "Rokirovka: shoh va rux hali yurmagan, ular orasi boʻsh, shohga shoh berilmagan va u hujum ostidagi katakdan oʻtmaydi.",
  ],
  terms: [
    { term: "Shoh", text: "Eng asosiy dona. Istalgan tomonga bir katak yuradi." },
    { term: "Shoh berish", text: "Shohga hujum qilish. Shoh berilganda albatta himoyalanish kerak." },
    { term: "Mot", text: "Qutulib boʻlmaydigan shoh. Partiyaning oxiri." },
    {
      term: "Pat",
      text: "Oʻyinchining birorta ham yurishi yoʻq, lekin unga shoh ham berilmagan. Partiya durang bilan tugaydi.",
    },
    { term: "Durang", text: "Gʻolibsiz tugagan partiya." },
    { term: "Hujum ostidagi katak", text: "Raqib donasi urib turgan katak." },
  ],
  facts: [
    "«Shoh» va «mot» soʻzlari fors tilidan kelgan: «shoh mot» — «shoh magʻlub boʻldi» degani. Oʻzbekcha «shoh» ham «podsho» degani. Qiziq-a: biz shaxmatda bosh donani ham, unga qilingan hujumni ham «shoh» deymiz!",
    "Shaxmatdagi eng tez mot — «ahmoqona mot»: agar oqlar juda ehtiyotsiz oʻynasa, qoralar oʻzining ikkinchi yurishidayoq mot qilishi mumkin.",
    "Toshkentlik Rustam Qosimjonov 2004-yilda shaxmat boʻyicha FIDE jahon chempioni boʻldi.",
    "Toshkentlik Nodirbek Abdusattorov 17 yoshida tezkor shaxmat boʻyicha jahon chempioni boʻldi, 2022-yilda esa Oʻzbekiston terma jamoasi Butunjahon shaxmat olimpiadasida gʻolib chiqdi!",
  ],
  exercises: {
    "king-moves": {
      title: "Shohning yurishlari",
      prompt:
        "Oq shoh yura oladigan barcha kataklarni belgila. Esingda boʻlsin: rux urib turgan katakka turib boʻlmaydi.",
      hint: "Shohning atrofida 8 ta katak bor. Ulardan qaysilarini d8 dagi qora rux uradi?",
      why: "d3, d4 va d5 kataklarini rux d vertikali boʻylab uradi — u yerga yurib boʻlmaydi. e3, e5, f3, f4 va f5 qoladi.",
    },
    "king-who-checks": {
      title: "Kim shoh berdi?",
      prompt: "Oq shohga shoh berildi. Shoh bergan qora donani bos.",
      hint: "Har bir qora donani tekshir: u hozir e1 dagi shohni ura oladimi?",
      why: "Shoh bergan dona — d3 dagi ot: u «L» harfi shaklida sakrab, toʻppa-toʻgʻri e1 ga tushadi. h5 dagi farzin esa h5–d1 diagonali boʻylab uradi, e1 katagiga yetmaydi.",
    },
    "king-escape": {
      title: "Qochib qutul!",
      prompt: "Rux shoh berdi. Oq shoh qochishi mumkin boʻlgan barcha kataklarni belgila.",
      hint: "e vertikalini rux urib turibdi. Yana kimdan ehtiyot boʻlish kerak? Qora filga qara.",
      why: "e2 ni rux, d1 ni esa a4 dagi fil uradi, d2 da oʻz piyodasi turibdi. Faqat f1 va f2 xavfsiz.",
    },
    "king-mate-rank": {
      title: "Oxirgi gorizontalda mot",
      prompt: "Oqlar boshlaydi va bir yurishda mot qiladi.",
      hint: "Qora shohni oʻz piyodalari qamab qoʻygan. Qaysi chiziq himoyasiz qolgan?",
      why: "Rux a8 ga yuradi — 8-gorizontal boʻylab shoh. Qora shoh qocha olmaydi: oldida oʻz piyodalari turibdi. Bu oxirgi gorizontaldagi mot — eng koʻp uchraydigan motlardan biri.",
    },
    "king-mate-queen": {
      title: "Farzin bilan mot",
      prompt: "Oqlar boshlaydi va bir yurishda mot qiladi. Shoh farzinga yordam beradi.",
      hint: "Oq shoh qora shohdan g7 va h7 kataklarini allaqachon tortib olgan. Endi shunday shoh berish kerakki, g8 ham yopilsin.",
      why: "Farzin b8 ga yuradi: 8-gorizontal boʻylab shoh, g8 katagi ham hujum ostida. g7 va h7 ni oq shoh nazorat qiladi — mot.",
    },
    "king-smothered": {
      title: "Boʻgʻiq mot",
      prompt: "Oqlar boshlaydi va ot bilan bir yurishda mot qiladi.",
      hint: "Qora shohni oʻz donalari oʻrab olgan. Qaysi donaga shoh berish uchun boʻsh yoʻl kerak emas?",
      why: "Ot f7 ga sakraydi — shoh! Qora shoh qocha olmaydi: atrofidagi hamma kataklarni oʻz donalari egallagan, otni esa hech kim ura olmaydi. Bunday mot «boʻgʻiq mot» deyiladi.",
    },
    "king-ladder": {
      title: "Ikki rux bilan mot",
      prompt: "Oqlar boshlaydi va bir yurishda mot qiladi.",
      hint: "Bitta rux qora shohning yoʻlini 7-gorizontal boʻylab kesib qoʻygan. Ikkinchisi nima qilishi kerak?",
      why: "h1 dagi rux h8 ga yuradi — 8-gorizontal boʻylab shoh, 7-gorizontalni esa g7 dagi rux ushlab turibdi. Shohga qochadigan joy yoʻq — mot. «Narvon» usulida mot aynan shunday qilinadi.",
    },
    "king-mate-or-stalemate": {
      title: "Mot, pat yoki shoh?",
      prompt: "Har bir holatda qoralar yuradi. Taxtada nima boʻlyapti?",
      questions: [
        { text: "Birinchi holat:", options: ["Mot", "Pat", "Shoh"] },
        { text: "Ikkinchi holat:", options: ["Mot", "Pat", "Shoh"] },
        { text: "Uchinchi holat:", options: ["Mot", "Pat", "Shoh"] },
      ],
      hint: "Avval shoh berilganmi-yoʻqmi, tekshir. Keyin qora shoh biror joyga qocha oladimi, qara.",
      why: "Birinchi holatda shoh berilmagan, lekin yurishga joy yoʻq — pat. Ikkinchisida shoh berilgan va undan himoyalanib boʻlmaydi — mot. Uchinchisida ham shoh berilgan, lekin shoh yon tomonga qochib keta oladi.",
    },
    "king-castle": {
      title: "Rokirovka",
      prompt:
        "Yurish navbati oqlarda. Shohni yashir — qisqa rokirovka qil. Buning uchun avval shohni, keyin u boradigan katakni bos.",
      hint: "Rokirovkada shoh rux tomonga ikki katak yuradi. Qaysi tomonda yoʻl boʻsh?",
      why: "Shoh e1 dan g1 ga yuradi, rux esa f1 ga sakrab oʻtadi. Uzun rokirovka qilib boʻlmaydi: shoh bilan a1 dagi rux orasida ot va farzin turibdi.",
    },
  },
};
