import type { Uz } from "./localize";
import type { GUIDE, THINKING_CHAIN } from "./guide";

/** Методичка для родителя по-узбекски — по id раздела. */
export const guideUz: Uz<typeof GUIDE> = {
  principle: {
    title: "Asosiy tamoyil",
    paragraphs: [
      "Biz faqat hisoblash koʻnikmasini emas, **fikrlashni** rivojlantiramiz. Muvaffaqiyat yechilgan misollar soni bilan emas, bolaning qanday fikrlashi bilan oʻlchanadi.",
      "Bola 10 daqiqa bosh qotirgan bitta qiyin masala koʻpincha 20 ta oson misoldan qimmatliroq. Qiyinlik asta-sekin oshib boradi: bola «Bu qiyin, lekin, menimcha, tushunib olaman» degan tuygʻuni tez-tez boshdan kechirib turishi kerak.",
    ],
  },
  session: {
    title: "Mashgʻulot qanday oʻtadi",
    list: [
      "Tinch sharoitda 20–30 daqiqa, 6–10 ta turli masala.",
      "Odatdagi tartib: razminka → mantiq → qonuniyatlar → algoritmlar → fazoviy tasavvur → atrofimizdagi matematika → yulduzchali masala.",
      "Hammasini yechish shart emas. Hammasidan tez «oʻtib ketgandan» koʻra bitta masala ustida uzoqroq oʻylagan maʼqul.",
      "Bola oʻzi yechadi, kattalar esa yonida: tinglaydi, savol beradi, lekin javobni aytib qoʻymaydi.",
      "Chop etilgan varaqda yechib, platformadan maslahat, robot va tekshirish uchun foydalanish qulay.",
      "Yettinchi kuni — kichik tadqiqot: yechish, tushuntirish, boshqa usul topish, shartni oʻzgartirish, tadqiq qilish, oʻz masalasini tuzish.",
    ],
  },
  levels: {
    title: "Qiyinlik darajalari",
    list: [
      "🟢 **Qulay** — bola mustaqil yechadi.",
      "🟡 **Oʻylash kerak** — biroz mulohaza yuritish kerak.",
      "🟠 **Gʻayrioddiy** — yangi gʻoya kerak.",
      "🔴 **Olimpiada** — chuqur mulohaza (shu yosh uchun olimpiada darajasi).",
      "⭐ **Tadqiqot** — bir nechta yechim va yondashuv, tajriba kerak.",
      "🔴 va ⭐ darajadagi masalalar koʻp emas: bola muvaffaqiyat quvonchini muntazam his qilib turishi kerak.",
    ],
  },
  hints: {
    title: "Maslahatlar: javobni hech qachon darrov aytmang",
    paragraphs: [
      "Bola qiynalib qolsa, maslahatlar asta-sekin beriladi. Platformada ular bittadan, oʻylab olish uchun qisqa tanaffus bilan ochiladi. Toʻliq yechimni faqat kattalar koʻradi.",
    ],
    steps: [
      { title: "1-maslahat", text: "Shartni qayta oʻqish." },
      { title: "2-maslahat", text: "Nima maʼlum?" },
      { title: "3-maslahat", text: "Chizish yoki yozib olish." },
      { title: "4-maslahat", text: "Kichikroq masalani yechish." },
      { title: "5-maslahat", text: "Fikr yoʻnalishi." },
    ],
  },
  tools: {
    title: "Asboblar qutisi: qiyin masalaga qanday yondashish kerak",
    paragraphs: [
      "Ikkinchi haftada bola «asboblar» yigʻadi — masala yechishning umr boʻyi asqatadigan umumiy usullarini. U qiynalib qolganda, masalaning oʻziga oid maslahat oʻrniga shunday soʻrash mumkin: «Qaysi asbobni sinab koʻramiz?»",
    ],
    steps: [
      {
        title: "✏️ Chizib koʻr",
        text: "Son nuri, tasmalar, doirachalar, sxema, «yuqoridan koʻrinish». Chizilgan masala yaqqol koʻrinib turadi.",
      },
      {
        title: "⏪ Oxiridan boshla",
        text: "Natija maʼlum boʻlsa, orqaga qarab boramiz: har bir amalni teskarisiga almashtiramiz va amallarni teskari tartibda bekor qilamiz.",
      },
      {
        title: "🐣 Kichigidan boshla",
        text: "Avval eng kichik holatni, keyin biroz kattarogʻini yechamiz, javoblarni jadvalga yozib, qonuniyatni topamiz.",
      },
      {
        title: "🎯 Sinab koʻr va yaxshila",
        text: "Urinish → tekshirish → qaysi tomonga oʻzgartirish kerakligi haqida xulosa. Bu tavakkaliga topish emas, balki rejali izlanish; urinishlarni jadvalga yozib borish qulay.",
      },
      {
        title: "⚖️ Oʻzgarmaydiganini top",
        text: "Umumiy miqdor, ayirma, juft-toqlik. Shunday «oʻzgarmas» masalani bir qatorda yechib beradi yoki maqsadga erishib boʻlmasligini isbotlaydi.",
      },
      {
        title: "🔗 Oʻxshash masalani esla",
        text: "«Buni qayerda koʻrganman?» Koʻp yangi masalalar — yangi libosdagi eski tanishlar: tovuq va quyonlar velosiped va mashinalarga aylanadi.",
      },
    ],
  },
  logic: {
    title: "Mantiq haftasi: aniq mulohaza yuritish",
    paragraphs: [
      "Uchinchi haftada bola aniq mulohaza yuritishni oʻrganadi: «aniq»ni «balki»dan farqlashni va javob nega toʻgʻri ekanini tushuntirishni. Kattalarning ikki asosiy savoli: «Bu aniqmi yoki shunchaki boʻlishi mumkinmi?» va «Buni qanday isbotlaysan?»",
    ],
    steps: [
      {
        title: "➡️ «Agar…, unda…»",
        text: "«Yomgʻir yogʻsa — soyabon olaman» qoidasi teskarisiga ishlamaydi: soyabon — hali yomgʻir degani emas. Maʼlumot yetmasa, «nomaʼlum» degan javob — halol va toʻgʻri javob.",
      },
      {
        title: "🎭 «Va», «yoki», «emas»",
        text: "«Va» — ikkalasi ham toʻgʻri, «yoki» — hech boʻlmasa bittasi toʻgʻri. «Faraz qil va tekshir» usuli: agar faraz ziddiyatga olib kelsa, u notoʻgʻri.",
      },
      {
        title: "⭕ Eyler doiralari",
        text: "«Hammasi», «baʼzilari», «hech biri». Doiralarning umumiy qismi ikkala doiraga ham kiradi, shuning uchun ikki guruhni qoʻshganda uni bir marta sanaymiz.",
      },
      {
        title: "🪙 Taqqoslash va tortish",
        text: "Hisoblamasdan, mulohaza yuritib ham taqqoslash mumkin. Tarozi — bu tenglik. Tarozining uchta javobi bor, shuning uchun tangalar uchta uyumga boʻlinadi.",
      },
      {
        title: "🧱 Isbot",
        text: "Bitta misol qoidani isbotlamaydi, bitta qarshi misol esa uni rad etadi. «Bunday boʻlmaydi» degan fikr juft-toqlik yoki «quyonlar kataklardan koʻp» tamoyili bilan isbotlanadi.",
      },
      {
        title: "🔐 Shifrlar",
        text: "Shifr — bu qoida, shifrni ochish esa — teskari qoida. Kalitsiz shifrni ochishga qonuniyatlar va variantlarni birma-bir koʻrib chiqish yordam beradi.",
      },
    ],
  },
  chess: {
    title: "Shaxmat maktabi: qanday yordam berish kerak",
    paragraphs: [
      "Shaxmat ham butun dastur kabi diqqatni, bir necha yurish oldinni hisoblashni va oʻz gʻoyasini tekshirish odatini («raqib bunga qanday javob beradi?») mashq qildiradi. Maktabda oltita daraja-unvon bor — Piyoda, Ot, Fil, Rux, Farzin, Shoh. Keyingi daraja oldingisidagi barcha mashqlar yechilgach ochiladi (sozlamalarda hammasini birdaniga ochish mumkin).",
    ],
    steps: [
      {
        title: "📖 Dars — birga",
        text: "Darsni birga oʻqing va taxtadagi donalarni bosib koʻring: shunda bola dona qayerga yurishini koʻradi. Qoidani oʻz soʻzlari bilan oʻzi aytib bersa, juda yaxshi.",
      },
      {
        title: "🎯 Mashqlar — mustaqil",
        text: "Bola oʻzi yechadi. Qiyin boʻlsa — sizning javobingiz emas, ekrandagi maslahat yordam beradi. Taxtadagi xato hech narsani buzmaydi: dona joyiga qaytadi.",
      },
      {
        title: "❓ Asosiy savol",
        text: "Har bir yurishdan oldin shunday soʻrash foydali: «Menga nima tahdid solyapti? Raqibimga-chi?» Bu kuchli shaxmatchilarning — va yaxshi fikrlaydigan odamlarning odati.",
      },
      {
        title: "♟ Partiya oʻynang",
        text: "Eng yaxshi mashq — ona yoki ota bilan jonli partiya. «Piyodalar jangi»dan boshlash mumkin: faqat piyodalar, oxirgi gorizontalga kim birinchi yetib borsa, oʻsha yutadi. Maktab taxtasida «Ikki kishi» rejimi va bola partiyalarini yozib boradigan kundalik bor.",
      },
      {
        title: "🤖 Robot va masalalar",
        text: "«Piyoda» robot deyarli tavakkaliga yuradi — bola yutib turishi uchun undan boshlang. Gʻalabalar koʻpaygach, darajani oshiring. Masalalarni mavzular boʻyicha yeching: bitta mavzu — bitta gʻoya. Kun masalasi — besh daqiqalik yaxshi odat.",
      },
      {
        title: "🏛️ Partiyalar va tarix",
        text: "Mashhur partiyalarni «Koʻrish» tugmasi bilan birga tomosha qiling: muhim yurishlarda izohlar chiqadi. Ensiklopediya — ovoz chiqarib oʻqish uchun: Samarqand va Xorazmda shaxmat tarixi, chempionlar, rekordlar.",
      },
    ],
  },
  phrases: {
    title: "«Notoʻgʻri» oʻrniga nima deyish kerak",
    pairs: [
      { avoid: "Notoʻgʻri.", say: "Qani, fikringni tekshirib koʻraylik." },
      { avoid: "Yana xato!", say: "Yechimning qaysi qismi aniq toʻgʻri?" },
      { avoid: "Yaxshiroq oʻyla!", say: "Kichkina misolda tekshirib koʻrsak boʻladimi?" },
      { avoid: "Javob — 57.", say: "Boshqacha hisoblasak-chi? Natija bir xil chiqadimi?" },
      { avoid: "Sen dahosan!", say: "Qonuniyatni oʻzing topding — uni qanday payqading?" },
    ],
  },
  questions: {
    title: "Tushuntirish javobdek muhim",
    paragraphs: ["Tushuntirilmagan toʻgʻri javob — hali toʻliq yechim emas. Tez-tez soʻrab turing:"],
    list: [
      "Nega?",
      "Buni qanday bilding?",
      "Isbotlay olasanmi?",
      "Boshqacha tushuntira olasanmi?",
      "Chizib bera olasanmi?",
      "Boshqa yechim topa olasanmi?",
      "Bitta shartni oʻzgartirsak, nima boʻladi?",
    ],
  },
  better: {
    title: "«Bundan yaxshiroq boʻladimi?» odati",
    paragraphs: [
      "Masala yechilgach, soʻrang: «Boshqacha yechsa boʻladimi?» Vaqt oʻtib, {child} oʻzidan oʻzi soʻray boshlaydi: «Bundan yaxshiroq usul bormi?» Bu — matematika, algoritmlar va muhandislik uchun eng muhim odat.",
    ],
  },
  observe: {
    title: "Yorliqlarsiz kuzatish",
    paragraphs: [
      "Haftada bir marta 10 ta savoldan iborat qisqa sharhni toʻldiring: nima tez chiqyapti, qayerda xato bor, nima yoqyapti, nima qiyin, tushuntiryaptimi, boshqa usullarni izlayaptimi, qonuniyatlarni payqayaptimi, javobini tekshiryaptimi, oʻz masalalarini oʻylab topyaptimi, qatʼiyatlimi.",
      "«Daho», «isteʼdodli», «boʻsh», «kuchli» kabi yorliqlarni ishlatmang. Koʻrgan narsangizni tasvirlang: «Bugun u qonuniyatni oʻzi topdi», «Bugun unga variantlarni tartibga solish uchun maslahat kerak boʻldi».",
    ],
  },
  psychology: {
    title: "Eng muhimi — qiziquvchanlikni saqlab qolish",
    paragraphs: [
      "Maqsad — bolada «Matematika — qiziqarli kashfiyotlar olami» degan tuygʻu paydo boʻlishi. Nimalardan qochish kerak:",
    ],
    list: [
      "doimiy tekshiruv va testlardan;",
      "boshqa bolalar bilan musobaqalashtirishdan;",
      "ota-onaning bosimidan;",
      "ortiqcha uy vazifalaridan;",
      "tushunmasdan yodlashdan.",
    ],
  },
  future: {
    title: "Dasturlash va sunʼiy intellekt bilan bogʻliqlik",
    paragraphs: [
      "Dasturlash tillarining sintaksisiga shoshilmaymiz va murakkab atamalarni kiritmaymiz. Biz dasturlash va sunʼiy intellekt tayanadigan fikrlashni rivojlantiramiz: ketma-ketlik, algoritm, «agar… boʻlsa, unda…» sharti, takrorlash, holat, izlash, tasniflash, optimallashtirish, maʼlumotlar, belgilar, qoidalar, bashorat, xato.",
      "Katakli maydondagi robot, saralovchi mashina, «qaysi qoida hayvonlarni guruhlarga yaxshiroq ajratadi» — bular dars emas, oʻyin. Ammo informatika va sunʼiy intellektni tushunish aynan shunday oʻyinlardan oʻsib chiqadi.",
    ],
  },
  path: {
    title: "Uzoq yoʻl (jadval emas, moʻljal)",
    steps: [
      {
        title: "2-sinf",
        text: "Matematika, mantiq, qonuniyatlar, boshqotirmalar, fazoviy tafakkur, oddiy algoritmlar.",
      },
      {
        title: "3-sinf",
        text: "Murakkabroq mantiq, geometriya, kombinatorika, variantlarni tizimli koʻrib chiqish, algoritmik fikrlash.",
      },
      { title: "4-sinf", text: "Olimpiada mulohazalari, sonlarning chuqurroq xossalari, murakkabroq algoritmlar." },
      { title: "5–6-sinflar", text: "Python/C++ asoslari, algoritmlar, diskret matematika elementlari." },
      {
        title: "7–9-sinflar",
        text: "Algoritmlar va maʼlumotlar tuzilmalari, C++, ehtimollik, kombinatorika, graflar, matematik mantiq.",
      },
      {
        title: "Keyin",
        text: "Chiziqli algebra, matematik analiz, ehtimollik va statistika, optimallashtirish, mashinali oʻqitish, sunʼiy intellekt.",
      },
    ],
    paragraphs: ["Keyingi bosqichga poydevor mustahkam boʻlgandagina oʻtish kerak. Shoshilishga hojat yoʻq."],
  },
  platform: {
    title: "Platformadan qanday foydalanish kerak",
    list: [
      "Har bir kunni chop etish mumkin: bola uchun topshiriq varaqlari va kattalar uchun alohida javoblar varagʻi.",
      "Ekranda har bir masalaning maslahatlari, javobni tekshirish («notoʻgʻri» soʻzisiz) hamda «Yechimni tushuntirdim», «Boshqa usul topdim», «Masala yoqdi», «Qiyin boʻldi, lekin uddaladim» belgilari bor.",
      "Natijalar shu qurilmadagi shu brauzerda saqlanadi. «Sozlamalar» boʻlimida ularni faylga saqlab, boshqa qurilmaga koʻchirish mumkin.",
      "Ota-onalar boʻlimi PIN-kod bilan yopilgan — bola javoblarni tasodifan koʻrib qolmasin.",
    ],
  },
};

export const thinkingChainUz: Uz<typeof THINKING_CHAIN> = [
  "Kuzatish",
  "Savol",
  "Faraz",
  "Urinish",
  "Xato",
  "Tekshirish",
  "Tushuntirish",
  "Isbot",
  "Boshqa yechim",
];
