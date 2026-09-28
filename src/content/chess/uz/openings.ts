import type { Uz } from "../../localize";
import type { OPENING_CATEGORIES, OPENING_PRINCIPLES, Opening } from "../openings";

/** Дебюты по-узбекски: только тексты, линии ходов — из русского оригинала. */
export const openingCategoriesUz: Uz<typeof OPENING_CATEGORIES> = {
  open: {
    name: "Ochiq debyutlar",
    about: "1.e4 e5 — ikkala tomon darhol markaz uchun kurashadi, donalar tezda oʻyinga chiqadi.",
  },
  semiOpen: {
    name: "Yarim ochiq debyutlar",
    about: "Qoralar 1.e4 ga e5 bilan emas, boshqa yurish bilan javob beradi — va markaz uchun oʻzicha kurashadi.",
  },
  closed: {
    name: "Yopiq debyutlar",
    about: "1.d4 — oʻyin xotirjamroq boshlanadi, markazni piyodalar zanjiri ushlab turadi.",
  },
  gambit: {
    name: "Gambitlar",
    about: "Bir tomon donalarini tezroq olib chiqib, hujumni boshlash uchun piyodasini qurbon qiladi.",
  },
  trap: {
    name: "Tuzoqlar va ulardan himoya",
    about: "Bu qisqa partiyalarni bilish kerak — oʻzing tuzoqqa tushmaslik va raqibni tuzoqqa tushirish uchun.",
  },
};

export const openingPrinciplesUz: Uz<typeof OPENING_PRINCIPLES> = [
  { title: "Markazni egalla", text: "Markazga e va d piyodalarini sur: u yerdan donalar butun taxtani koʻrib turadi." },
  {
    title: "Donalarni olib chiq",
    text: "Avval otlar va fillar, har yurishda — yangi dona. Bir donani bekorga ikki marta yurma.",
  },
  {
    title: "Shohni yashir",
    text: "Rokirovkani ertaroq qil — odatda oʻninchi yurishgacha. Burchakda, piyodalar ortida shoh xavfsiz boʻladi.",
  },
  {
    title: "Farzinni asra",
    text: "Farzinni juda erta olib chiqma: raqib uni quvib, vaqt yutib oladi.",
  },
  {
    title: "Ruxlarni birlashtir",
    text: "Barcha yengil donalar chiqib, shoh rokirovka qilgach, ruxlar bir-birini koʻra boshlaydi — debyut tugadi.",
  },
];

export const openingsUz: Uz<Opening[]> = {
  italian: {
    name: "Italyan partiyasi",
    idea: "c4 dagi fil f7 dagi piyodaga qarab turibdi — bu qoralarning eng zaif joyi.",
    plan: [
      "Ikkala tomon ham otlar va fillarni qoida boʻyicha olib chiqadi: avval markaz, keyin yengil donalar, soʻng rokirovka.",
      "c3 yurishi d4 ni tayyorlaydi: oqlar markazda piyodalardan katta qoʻrgʻon qurmoqchi.",
      "Bu hozir ham oʻynaladigan debyutlarning eng qadimiysi — uning yoshi 400 dan oshgan.",
    ],
    facts: [
      "Italyan partiyasi XVI asr kitoblarida tasvirlangan — oʻshanda shaxmat endigina hozirgi qoidalarga ega boʻlgan edi.",
    ],
    playedBy: "Morfi, Karlsen",
  },
  spanish: {
    name: "Ispan partiyasi",
    idea: "Fil c6 dagi otga hujum qiladi — u e5 dagi piyodaning himoyachisi. Markaz uchun uzoq kurash boshlanadi.",
    plan: [
      "a6 yurishi filni quvadi, lekin oqlar a4 ga chekinib, otga bosimni saqlab qoladi.",
      "Oqlar rokirovka qilib, ruxni e1 ga qoʻyadi: e4 dagi piyodani himoya qilish va d4 ni tayyorlash uchun.",
      "Ispan partiyasini «debyutlar malikasi» deyishadi: uni deyarli barcha jahon chempionlari oʻynaydi.",
    ],
    facts: ["Debyut ispan ruhoniysi Ruy Lopes nomi bilan ataladi: u bu debyutni 1561-yilda kitobida tasvirlab bergan."],
    playedBy: "Fisher, Karpov, Kasparov, Karlsen",
  },
  scotch: {
    name: "Shotland partiyasi",
    idea: "Oqlar markaziy piyodalarni darhol almashtirib, donalar uchun yoʻllarni ochadi.",
    plan: [
      "d4 exd4 ♘xd4 dan keyin markazda faqat e4 dagi piyoda qoladi — oʻyin ochiq tus oladi.",
      "Qoralar otga fil va farzin bilan hujum qiladi, oqlar esa ♗e3 va c3 yurishlari bilan himoyalanadi.",
    ],
    facts: ["Debyut bu nomni 1824-yilda xat orqali oʻynalgan Edinburg — London matchidan keyin olgan."],
    playedBy: "Kasparov",
  },
  "four-knights": {
    name: "Toʻrt ot partiyasi",
    idea: "Toʻrttala ot ham uchinchi va oltinchi gorizontalga chiqadi — xotirjam va ishonchli boshlanish.",
    plan: [
      "Tartibni yaxshi koʻradiganlar uchun debyut: otlar, fillar, rokirovka — va hammasi xavf-xatarsiz.",
      "b5 va b4 dagi fillar markaziy piyodalarni himoya qilayotgan otlarga hujum qiladi.",
    ],
    facts: [
      "Shaxmat maktablarida birinchi oʻrgatiladigan debyutlardan biri: u donalarni qanday olib chiqishni yaqqol koʻrsatadi.",
    ],
  },
  petrov: {
    name: "Rus partiyasi",
    idea: "Qoralar e5 dagi piyodani himoya qilmaydi, balki javob tariqasida e4 ga hujum qiladi — bu «koʻzgu» himoyasi.",
    plan: [
      "Muhim qoida: ♘xe5 dan keyin darhol ♘xe4 qilma. Avval d6 bilan otni quvib yubor, piyodani esa shundan keyingina ol.",
      "Teng pozitsiya hosil boʻladi: ikkala tomon donalarini bir xil reja boʻyicha olib chiqadi.",
    ],
    facts: [
      "Debyut Rossiyaning birinchi kuchli shaxmatchisi Aleksandr Petrov (XIX asr) sharafiga nomlangan. Boshqa mamlakatlarda uni Petrov himoyasi deb atashadi.",
    ],
    playedBy: "Kramnik, Karuana",
  },
  sicilian: {
    name: "Sitsiliya himoyasi",
    idea: "Qoralar koʻzgudagidek javob bermaydi, markazga yon tomondan zarba beradi: c5 dagi piyoda d4 dagi markaziy piyodaga almashinadi.",
    plan: [
      "d4 dagi almashuvdan soʻng qoralarda ikkita markaziy piyoda, oqlarda esa bitta. Buning evaziga oqlar donalarini olib chiqishda oldinda.",
      "Oʻyin keskin tus oladi: ikkala tomon taxtaning turli qanotlarida hujum qiladi.",
      "a6 yurishi — mashhur Naydorf varianti, Fisher va Kasparovning sevimli varianti.",
    ],
    facts: ["Grossmeyster turnirlarida 1.e4 ga eng koʻp beriladigan javob — Sitsiliya himoyasi."],
    playedBy: "Fisher, Kasparov",
  },
  french: {
    name: "Fransuz himoyasi",
    idea: "Qoralar mustahkam e6–d5 piyoda zanjirini quradi va oqlar markaziga hujum qiladi.",
    plan: [
      "Oqlarning e5 dagi piyodasi ularga keng joy beradi, qoralar esa uni c5 va f6 yurishlari bilan yemirishga harakat qiladi.",
      "Qoralarning c8 dagi fili uzoq vaqt oʻz piyodalari ortida qamalib qoladi — Fransuz himoyasidagi eng katta tashvish shu.",
    ],
    facts: [
      "Nomi 1834-yilda xat orqali oʻynalgan Parij — London matchidan keyin paydo boʻlgan: parijliklar aynan shu debyutni tanlagan edi.",
    ],
  },
  "caro-kann": {
    name: "Karo-Kann himoyasi",
    idea: "Fransuz himoyasiga oʻxshaydi, lekin c8 dagi fil piyodalar yoʻlini toʻsib qoʻyishidan oldin f5 ga chiqib olishga ulguradi.",
    plan: [
      "c6 dagi piyoda d5 ni quvvatlaydi, e4 dagi almashuvdan soʻng esa qoralar filni f5 ga olib chiqadi.",
      "Oqlar ♘g3 va h4 yurishlari bilan filga hujum qiladi, qoralar g6 ga chekinib, h6 bilan «darcha» ochadi.",
      "Juda ishonchli himoya: qoralar bilan durang kerak boʻlganda aynan shuni tanlashadi.",
    ],
    facts: [
      "XIX asrning ikki shaxmatchisi — Horatsio Karo va Markus Kann familiyalari bilan atalgan. Reti — Tartakover partiyasi aynan shunday boshlangan.",
    ],
    playedBy: "Kapablanka, Karpov",
  },
  scandinavian: {
    name: "Skandinaviya himoyasi",
    idea: "Qoralar markaziy piyodani darhol almashtiradi va farzinni oʻyinga chiqaradi — garchi uni quvib yurishlari mumkin boʻlsa ham.",
    plan: [
      "♘c3 dan keyin farzin a5 ga oʻtadi — u yerda xotirjamroq: piyodalar unga yetib borolmaydi.",
      "Qoralar c6–♗f5 qalʼasini quradi va e6 ni tayyorlaydi — oson eslab qolinadigan oddiy reja.",
    ],
    facts: ["Eng qadimiy debyutlardan biri: u 1475-yilgi qoʻlyozmada uchraydi."],
  },
  "queens-gambit": {
    name: "Farzin gambiti",
    idea: "Oqlar d5 dagi piyodani markazdan chalgʻitish uchun c4 dagi piyodani taklif qiladi. Qoralar uni rad etishi mumkin.",
    plan: [
      "Rad etilgan farzin gambiti: qoralar d5 ni e6 yurishi bilan himoya qiladi va donalarini bemalol olib chiqadi.",
      "g5 dagi fil f6 dagi otni bogʻlaydi, qoralar ♗e7 yurishi bilan bogʻlanishdan qutuladi.",
      "Bu oqlar uchun eng ishonchli debyutlardan biri — jahon chempionligi uchun matchlarda u yuzlab marta oʻynalgan.",
    ],
    facts: ["Aslida bu haqiqiy gambit emas: qoralar c4 dagi piyodani olsa ham, uni ushlab qololmaydi."],
    playedBy: "Kapablanka, Alyoxin, Karpov",
  },
  qga: {
    name: "Qabul qilingan farzin gambiti",
    idea: "Qoralar piyodani oladi, lekin uni ushlab qolishga urinmaydi: tezda donalarini olib chiqib, c5 yurishi bilan markazga zarba beradi.",
    plan: [
      "c4 dagi piyodani b5 bilan himoya qilishga urinma: oqlar a4 bilan yorib oʻtadi va qoralarning piyodalari sochilib ketadi.",
      "Qoralarning asosiy gʻoyasi — c5 yurishi: oqlarning markaziy piyodasini almashtirib, erkin oʻyinga erishish.",
    ],
    facts: ["Qabul qilingan gambitni qoralar bilan faqat himoyalanib emas, faol oʻynashni yoqtiradiganlar sevadi."],
  },
  london: {
    name: "London tizimi",
    idea: "Qoralar qanday yurmasin, oqlar deyarli har doim bir xil mustahkam pozitsiyani quradi.",
    plan: [
      "Fil e3 yurishidan oldin f4 ga chiqadi, aks holda piyodalar uni qamab qoʻyadi. Keyin c3 va ♘bd2 — «piramida» tayyor.",
      "Bu tizimni eslab qolish oson, unda xato qilish esa qiyin. Shuning uchun uni yangi boshlovchilarga maslahat berishadi.",
    ],
    facts: ["Nomi 1922-yilda Londonda oʻtgan turnirdan olingan: u yerda bir nechta usta shu rejani oʻynagan."],
    playedBy: "Karlsen",
  },
  "kings-indian": {
    name: "Shoh hind himoyasi",
    idea: "Qoralar markazni oqlarga berib qoʻyadi, filni g7 ga yashiradi, soʻng e5 yurishi bilan markazga zarba beradi.",
    plan: [
      "g7 dagi filni «fianketto» deyishadi: u katta diagonal boʻylab markaz va farzin qanotiga qarab turadi.",
      "Oqlarga katta markaz tegadi, lekin qoralar unga hujum qiladi — koʻpincha esa f5 va g5 piyodalari bilan shoh tomonga hujumga oʻtadi.",
    ],
    facts: ["Kasparov va Fisherning sevimli himoyasi. «Asr partiyasi» ham shunga oʻxshash tuzilish bilan boshlangan."],
    playedBy: "Fisher, Kasparov",
  },
  english: {
    name: "Ingliz debyuti",
    idea: "Oqlar qanotdan boshlaydi: c4 dagi piyoda va g2 dagi fil markazga uzoqdan bosim oʻtkazadi.",
    plan: [
      "Bu «teskari Sitsiliya himoyasi»: oqlar qoralarning sxemasini bir yurish oldinda boʻlib oʻynaydi.",
      "g2 dagi fil katta diagonal boʻylab qoralarning farzin qanotiga qarab turadi.",
    ],
    facts: ["Debyut XIX asrning eng kuchli ingliz shaxmatchisi Hovard Staunton sharafiga nomlangan."],
    playedBy: "Botvinnik, Karpov, Kasparov",
  },
  "kings-gambit": {
    name: "Shoh gambiti",
    idea: "Oqlar f vertikalini ochib, shohga hujum qilish uchun f4 dagi piyodani qurbon qiladi.",
    plan: [
      "«Oʻlmas partiya» aynan shunday boshlangan edi. Bu gambitni hujumlar va qurbonlar davri boʻlgan XIX asrda juda yaxshi koʻrishgan.",
      "Qoralar g5 va h6 yurishlari bilan piyodani ushlab turadi, oqlar esa hech narsadan qaytmaydi: hatto f7 da otni qurbon qiladi.",
    ],
    facts: [
      "Bugun Shoh gambiti eng yuqori darajada kam oʻynaladi: qoralar undan himoyalanishni oʻrganib olgan. Lekin bolalar turnirlarida u hamon xavfli.",
    ],
    playedBy: "Anderssen, Spasskiy",
  },
  evans: {
    name: "Evans gambiti",
    idea: "b4 dagi piyoda filni chalgʻitadi, oqlar esa c3 va d4 yurishlari bilan vaqt yutadi.",
    plan: [
      "Anderssenning «Doimo yashil partiya» deb atalgan oʻyini aynan shunday boshlangan.",
      "Rokirovkadan keyin oqlarning barcha donalari oʻyinda, qoralar esa a5 dagi filni qayerga qoʻyishni hali ham oʻylab turibdi.",
    ],
    facts: [
      "Kapitan Uilyam Evans bu gambitni Angliya va Irlandiya oʻrtasida kema boshqarib yurgan paytida oʻylab topgan. 1820-yillarda u gambitni Londonning eng kuchli oʻyinchilariga koʻrsatgan.",
    ],
    playedBy: "Anderssen, Kasparov",
  },
  "scholar-defense": {
    name: "Bolalar motidan himoya",
    idea: "Oq farzin f7 da mot qilmoqchi. Toʻgʻri javob — uni quvib, vaqt yutish.",
    plan: [
      "g6 yurishi farzinga hujum qiladi va diagonalni toʻsib qoʻyadi. Agar farzin f3 dan yana f7 ni moʻljalga olsa — f6 dagi ot himoyaga keladi.",
      "Oqlar farzin bilan ovora boʻlib turganda, qoralar donalarini olib chiqadi: natijada rivojlanishda qoralar oldinga oʻtib oladi.",
    ],
    facts: ["♕h5 ga hech qachon ♘f6?? deb javob berma — unda ♕xf7 bilan mot boʻlasan."],
  },
  "legal-trap": {
    name: "Legal tuzogʻi",
    idea: "Oqlar farzinni «tekinga beradi», lekin keyin uchta yengil dona bilan mot qiladi.",
    plan: [
      "Tuzoq faqat qoralar ochkoʻzlik qilib farzinni ursagina ishlaydi. Toʻgʻrisi — otni piyoda bilan urish: dxe5.",
      "Mot manzarasini eslab qol: fil f7 da, otlar e5 va d5 da, raqib shohi esa e7 da.",
    ],
    facts: ["Bu tuzoqning yoshi Amerika Qoʻshma Shtatlarinikidan ham katta: u 1750-yilda qoʻyilgan."],
  },
};
