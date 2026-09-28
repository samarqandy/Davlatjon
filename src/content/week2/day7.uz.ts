/** Неделя 2, день 7 — по-узбекски (накладка на day7.ts, правила — docs/uzbek-style.md). */
import type { Uz } from "../localize";
import type { Day } from "../types";

export const day7Uz: Uz<Day> = {
  title: "Asboblar ustasi",
  habit: { name: "Men kerakli asbobni tanlayman" },
  intro: [
    "Bugun sen — usta 🧰. Qutingda oltita asbob bor: rasm ✏️, oxiridan boshlash ⏪, kichik misol 🐣, aqlli sinov 🎯, oʻzgarmaydigan narsani izlash ⚖️ va oʻxshash masala 🔗.",
    "Har bir masalada avval oʻylab koʻr: bu yerga qaysi asbob toʻgʻri keladi? Oxirida esa seni haqiqiy tadqiqot kutyapti — unda hamma asboblar birdaniga asqotadi.",
  ],
  tasks: {
    w2d7t1: {
      title: "Qaysi asbob?",
      body: [
        { text: "Uchta kichik masalani yech. Har biri uchun qaysi asbob yordam berganini oʻylab koʻr." },
        {
          label: "a)",
          text: "Men bir son oʻyladim. Undan 17 ni ayirsam, 25 chiqdi. Men qaysi sonni oʻylagan edim?",
        },
        {
          label: "b)",
          text: "Uzunligi 10 metr boʻlgan yoʻlakcha boʻylab har 2 metrda qoziq qoqildi — boshida ham, oxirida ham. Nechta qoziq qoqilgan?",
        },
        { label: "c)", text: "Ikki sonning yigʻindisi 30 ga teng, biri ikkinchisidan 4 ga katta. Kattasi qaysi son?" },
      ],
      answer: {
        fields: {
          a: { label: "a) oʻylangan son" },
          b: { label: "b) qoziqlar soni" },
          c: { label: "c) katta son" },
        },
      },
      followUps: [
        "Har bir masalada qaysi asbob yordam berdi? Uni boshqa asbob bilan yechsa boʻlarmidi?",
        "Oxiridan boshlab yechish qulay boʻlgan masala oʻylab top.",
      ],
      hints: [
        "Har bir masalani yana oʻqib chiq. Unda nima maʼlum va nimani topish kerak?",
        "Qaysi asbob mos kelishini oʻyla: qayerda oxiri maʼlum? qayerda chizgan maʼqul? qayerda sinab koʻrsa boʻladi?",
        "b) uchun yoʻlakcha va qoziqlarni chiz. c) uchun ikkita tasma chiz: biri ikkinchisidan 4 ga uzun.",
        "a) uchun «−17» ni bekor qil — «+17» qil. c) uchun 15 va 19 ni sinab koʻr: ularning yigʻindisi toʻgʻri keladimi?",
        "b) 2 metrlik oraliqlar — 5 ta, qoziqlar esa bittaga koʻp. c) Ortiqcha 4 ni olib tashla — 26 qoladi, uni teng ikkiga boʻl.",
      ],
      solution: {
        answer: "a) 42; b) 6; c) 17.",
        explanation: [
          "a) Oxiridan boshlab: `25 + 17 = 42`.",
          "b) Rasm: 2 metrdan 5 ta oraliq, qoziqlar esa bittaga koʻp — 6 ta.",
          "c) Tasmalar yoki sinov: `30 − 4 = 26`, yarmi — 13; katta son `13 + 4 = 17`. Tekshiramiz: `17 + 13 = 30` ✓.",
        ],
        discuss: [
          "Bitta masalaga koʻpincha har xil asboblar toʻgʻri keladi: c) masalada ham sinov, ham tasmalar rasmi ishlaydi. Qaysi biri qulayroq ekanini birga muhokama qiling.",
        ],
      },
    },
    w2d7t2: {
      title: "Mini-sudoku",
      body: [
        {
          text: "Boʻsh kataklarga 1 dan 4 gacha sonlarni shunday yozki, har bir qatorda, har bir ustunda va har bir 2 × 2 kvadratda (ular qalin chiziq bilan oʻralgan) har bir son faqat bir marta uchrasin.",
        },
      ],
      followUps: [
        "Qaysi katakni birinchi toʻldirding? Nega aynan uni?",
        "Onang yoki dadang uchun oʻzingning 4 × 4 sudokungni tuz.",
      ],
      hints: [
        "Shartni yana oʻqib chiq: har bir qatorda, har bir ustunda va har bir 2 × 2 kvadratda 1, 2, 3, 4 sonlari takrorlanmasdan turadi.",
        "Faqat bitta son toʻgʻri keladigan katakni top. Uning qatori, ustuni va kvadratiga qara: u yerda qaysi sonlar allaqachon bor?",
        "Boʻsh kataklarga mos keladigan hamma sonlarni mayda qilib yozib, keyin keraksizlarini ustidan chizib borsang boʻladi.",
        "Birinchi qatordan boshla: unda 1 va 3 allaqachon bor. Ikkinchi ustunda esa — 4 va 3. Birinchi qatorning ikkinchi katagiga qaysi son toʻgʻri keladi?",
        "Har bir yozilgan son keyingisini topishga yordam beradi. Har bir katak uchun uning qatori, ustuni va kvadratini tekshirib chiq.",
      ],
      solution: {
        answer: "Qatorma-qator: 1 2 3 4; 3 4 1 2; 2 1 4 3; 4 3 2 1.",
        explanation: [
          "Birinchi qatorning ikkinchi katagida faqat 2 turishi mumkin: qatorda 1 va 3 bor, ustunda esa — 4 va 3.",
          "Qolgan har bir son ham xuddi shunday — chiqarib tashlash yoʻli bilan topiladi: qatorda, ustunda va kvadratda qaysi sonlar hali yoʻqligiga qaraymiz.",
        ],
        discuss: [
          "Sudoku — chiqarib tashlash mantigʻiga oid masala, xuddi birinchi haftadagi ✗ belgilari qoʻyiladigan jadval kabi. Yechimi yagona va uni taxmin qilmasdan topish mumkin.",
          "Bu yerdagi asbob — «kichik misol»: avval tanlov yagona boʻlgan bitta katak topiladi.",
        ],
      },
    },
    w2d7t3: {
      title: "Tanish sonlar",
      body: [{ text: "Qatorni davom ettir:" }, null, { text: "Bu sonlarni shu hafta qayerda uchratgan eding?" }],
      answer: { fields: { n7: { label: "7-son" }, n8: { label: "8-son" } } },
      followUps: ["21 dan keyin qaysi son keladi?", "Nega qurbaqa haqidagi masalada xuddi shu sonlar chiqqan edi?"],
      hints: [
        "Qatorga yana bir qara. Yonma-yon turgan ikki sondan keyingisi qanday hosil boʻlyapti?",
        "Nima maʼlum: `1 + 1 = 2`, `1 + 2 = 3`. Shu qoidani keyingi sonlarda tekshirib koʻr.",
        "Har bir sonning tagiga u qaysi ikki sondan hosil boʻlganini yozib qoʻy.",
        "5 va 8 dan qaysi son hosil boʻladi?",
        "Zinapoyadagi qurbaqani esla (3-kun): har bir pogʻonaga chiqishning nechta usuli bor edi?",
      ],
      solution: {
        answer: "13 va 21.",
        explanation: [
          "Har bir son oʻzidan oldingi ikki sonning yigʻindisiga teng: `5 + 8 = 13`, `8 + 13 = 21`.",
          "Bular — Fibonachchi sonlari, zinapoyadagi qurbaqa masalasidagi sonlarning xuddi oʻzi.",
        ],
        discuss: [
          "21 dan keyin 34 keladi. Qurbaqa har bir pogʻonaga oʻzidan oldingi ikki pogʻonaning biridan sakrab chiqadi, shuning uchun usullar ham xuddi shunday qoʻshiladi: har bir son oldingi ikkitasining yigʻindisi.",
        ],
      },
    },
    w2d7t4: {
      title: "Chigirtka",
      body: [
        {
          text: "Chigirtka 🦗 son nurida sakraydi: 5 birlik oldinga yoki 3 birlik orqaga. Noldan chapga sakrash mumkin emas.",
        },
        { text: "Hozir u nolda turibdi. Eng kam sakrash bilan 1 soniga qanday yetib boradi?" },
      ],
      answer: { puzzle: { name: "Chigirtka" } },
      followUps: [
        "Chigirtka 3 soniga qanday yetib boradi? Buning uchun nechta sakrash kerak?",
        "Senga qaysi asbob koʻproq yordam berdi: sinov, rasm yoki oxiridan boshlash?",
      ],
      hints: [
        "Shartni yana oʻqib chiq: chigirtka qanday sakray oladi? Qayerga sakrash mumkin emas?",
        "Nima maʼlum: birinchi sakrash faqat oldinga boʻlishi mumkin. Nega?",
        "0 dan 15 gacha son nurini chiz va sakrashlarni yoychalar bilan belgila. Har sakrashdan keyin chigirtka qayerda ekanini yozib bor.",
        "Kichikroq masalani yech: 2 soniga qanday borsa boʻladi? (5 birlik oldinga va 3 birlik orqaga.) 4 soniga-chi?",
        "Oldinga sakrashlar jami orqaga sakrashlardan 1 ga koʻp boʻlishi kerak. Ikki marta oldinga — bu 10, uch marta orqaga — bu 9.",
      ],
      solution: {
        answer: "5 ta sakrash, masalan: +5, −3, +5, −3, −3 (0 → 5 → 2 → 7 → 4 → 1).",
        explanation: [
          "1 da boʻlish uchun oldinga sakrashlar jami orqaga sakrashlardan 1 ga koʻp boʻlishi kerak. Oldinga 5, 10, 15… sakrash mumkin, orqaga esa — 3, 6, 9, 12…",
          "Eng kichik mos juftlik — 10 va 9: ikki marta oldinga va uch marta orqaga, jami 5 ta sakrash. Sakrashlar kamroq boʻlsa, bunday chiqmaydi: masalan, 5 va 3 dan 2 chiqadi, 10 va 6 dan — 4, 10 va 3 dan — 7.",
          "Oldinga sakrashdan boshlash kerak: noldan chapga sakrab boʻlmaydi. +5, +5, −3, −3, −3 tartibi ham toʻgʻri keladi.",
        ],
        discuss: [
          "3 soniga chigirtka 7 ta sakrashda yetib boradi: 3 marta oldinga va 4 marta orqaga (`15 − 12 = 3`).",
          "Bu yerda birdaniga bir nechta asbob asqotdi: rasm (son nuri), sinov, «oldinga — orqaga» jadvali.",
        ],
      },
    },
    w2d7t5: {
      title: "Kubikning qarama-qarshi tomonlari",
      body: [
        { text: "Mana shu yoyilmadan oʻyin kubigi 🎲 yelimlab yasaldi." },
        null,
        { text: "1 ning qarshisidagi tomonda qaysi son boʻladi? 2 ning qarshisida-chi? 3 ning qarshisida-chi?" },
      ],
      answer: {
        prompt: "Qarshisida qaysi son?",
        items: {
          f1: { label: "1 ning qarshisida" },
          f2: { label: "2 ning qarshisida" },
          f3: { label: "3 ning qarshisida" },
        },
      },
      followUps: [
        "Qarama-qarshi tomonlardagi sonlarni qoʻsh. Nimani payqading?",
        "Haqiqiy oʻyin kubigiga qarab koʻr: unda ham shundaymi?",
      ],
      hints: [
        "Shartni yana oʻqib chiq: «qarshisida» — kubikning narigi tomonida degani.",
        "Nima maʼlum: yoyilmadagi qoʻshni kvadratlar kubikning qoʻshni tomonlariga aylanadi. Qoʻshni kvadratlar bir-birining qarshisida boʻlib qolishi mumkinmi?",
        "Yoyilmani katakli qogʻozga chizib ol, qirqib, kubik yasab koʻr!",
        "Toʻrtta kvadratdan iborat uzun qatorga qara: 1, 2, 6, 5. Qator «halqa» boʻlib buklanganda, birinchisining qarshisida qaysi kvadrat boʻladi?",
        "Qatorda oralarida bitta kvadrat turgan ikki kvadrat bir-birining qarshisida boʻladi. Qatorning tepasi va pastidan chiqib turgan ikki kvadrat esa qopqoq va tubga aylanadi.",
      ],
      solution: {
        answer: "1 ning qarshisida — 6, 2 ning qarshisida — 5, 3 ning qarshisida — 4.",
        explanation: [
          "1, 2, 6, 5 qatori halqa boʻlib buklanadi: 1 soni 6 ning qarshisiga, 2 esa 5 ning qarshisiga tushadi.",
          "3 va 4 kvadratlar qatorning ikki tomonidan chiqib turibdi — ular qopqoq va tubga aylanadi, yaʼni bir-birining qarshisida boʻladi.",
        ],
        discuss: [
          "Haqiqiy oʻyin kubigida qarama-qarshi tomonlardagi sonlar yigʻindisi doim 7 ga teng: `1 + 6`, `2 + 5`, `3 + 4`. Bu ham «oʻzgarmaydigan narsa»!",
          "Qogʻoz model — eng yaxshi tekshiruv. Bu yoyilma kubning 11 ta yoyilmasidan biri (birinchi haftaning 7-kunidagi masala).",
        ],
      },
    },
    w2d7t6: {
      title: "Muzqaymoq va sharbat",
      body: [
        {
          text: "Muzqaymoq 🍦 bilan sharbat 🧃 birga 14 ming soʻm turadi. Ikkita muzqaymoq bilan bitta sharbat esa 22 ming soʻm turadi.",
        },
        { label: "a)", text: "Muzqaymoq necha pul turadi?" },
        { label: "b)", text: "Sharbat necha pul turadi?" },
      ],
      answer: {
        fields: {
          iceCream: { label: "a) muzqaymoq", suffix: "ming soʻm" },
          juice: { label: "b) sharbat", suffix: "ming soʻm" },
        },
      },
      followUps: ["Uchta muzqaymoq bilan bitta sharbat necha pul turadi?", "Bu yerda senga qaysi asbob yordam berdi?"],
      hints: [
        "Shartni yana oʻqib chiq: ikki xarid bir-biridan nimasi bilan farq qiladi?",
        "Nima maʼlum: ikkinchi xaridda bitta muzqaymoq ortiq. U qanchaga qimmat?",
        "Ikkala xaridni tasmalar bilan chiz: «muzqaymoq + sharbat» va «muzqaymoq + muzqaymoq + sharbat». Tasmalar nimasi bilan farq qiladi?",
        "Kichikroq masalani yech: qalam bilan oʻchirgʻich 5 ming soʻm, ikkita qalam bilan oʻchirgʻich esa 8 ming soʻm turadi. Qalam necha pul?",
        "Narxlar farqi — bitta muzqaymoqning narxi: `22 − 14`. Sharbat esa — 14 dan qolgani.",
      ],
      solution: {
        answer: "a) 8 ming soʻm; b) 6 ming soʻm.",
        explanation: [
          "Ikkinchi xarid birinchisidan faqat bitta muzqaymoq bilan farq qiladi. Demak, muzqaymoq `22 − 14 = 8` ming soʻm turadi.",
          "Sharbat: `14 − 8 = 6` ming soʻm. Tekshiramiz: `8 + 8 + 6 = 22` ✓.",
        ],
        discuss: [
          "Tasmalar rasmi masalani osonlashtiradi: ikkinchi tasmaning ortiqcha qismi — bitta muzqaymoq. Uchta muzqaymoq va sharbat: `8 + 8 + 8 + 6 = 30` ming soʻm.",
          "Bu — tenglamalarga tayyorgarlik: ikki tenglikni solishtirib, ular nimasi bilan farq qilishini topish.",
        ],
      },
    },
    w2d7r: {
      title: "Sonlar devori",
      body: [
        {
          text: "Sonlar devorida har bir son ostidagi ikki sonning yigʻindisiga teng. Eng pastda 4 ta gʻisht bor. Ularga 1, 2, 3, 4 sonlarini (har birini bir martadan) joylashtir va tepada nima chiqishini koʻr.",
        },
        {
          label: "1. Yech.",
          text: "Pastga sonlarni tartib bilan qoʻy: 1, 2, 3, 4. Tepada qaysi son chiqdi? Endi ularni shunday joylashtirki, tepada 22 chiqsin.",
        },
        {
          label: "2. Tushuntir.",
          text: "Pastki qatordagi qaysi gʻishtlar «muhimroq» — chetdagilarmi yoki oʻrtadagilarmi? Oʻrtadagi ikki sonning oʻrnini almashtir, keyin esa chetdagi va oʻrtadagi sonning oʻrnini. Tepada nima oʻzgaradi?",
        },
        {
          label: "3. Boshqa yoʻlini top.",
          text: "Tepada yana 22 chiqadigan boshqa joylashuvni top. Bunday joylashuvlardan nechtasini topding?",
        },
        {
          label: "4. Shartni oʻzgartir.",
          text: "Tepada eng katta qaysi son chiqishi mumkin? Eng kichigi-chi?",
        },
        {
          label: "5. Tadqiq qil.",
          text: "Umuman, tepada qaysi sonlar chiqishi mumkin? U yerda toq son boʻlishi mumkinmi? Nega?",
        },
        {
          label: "6. Oʻylab top.",
          text: "Oʻz devoringni oʻylab top — masalan, 1, 2, 3 sonli uchta gʻishtdan yoki 2, 3, 4, 5 sonli toʻrtta gʻishtdan — va uni tadqiq qil.",
        },
        { visual: { head: ["Pastdagi sonlar", "Tepadagi son"] } },
      ],
      followUps: [
        "Tadqiqotdan oldin bilmagan qanday narsani kashf qilding?",
        "Haftaning qaysi asboblari senga asqotdi?",
      ],
      hints: [
        "Shartni yana oʻqib chiq: devordagi har bir son — ostidagi ikki sonning yigʻindisi. Pastda 1, 2, 3, 4 istalgan tartibda turadi.",
        "Nima maʼlum: 1, 2, 3, 4 tartibida tepada 20 chiqadi. Tepadagi son kattaroq boʻlishi uchun qaysi gʻishtlarning oʻrnini almashtirish kerak?",
        "Har bir urinishni jadvalga yozib bor: pastdagi sonlar — tepadagi son.",
        "Kichikroq masalani yech: 1, 2, 3 sonli uchta gʻishtdan iborat devor. Tepada qaysi sonlar chiqadi? Pastdagi qaysi son kuchliroq «ishlaydi»?",
        "Pastdagi har bir son tepaga necha marta «yetib borishini» sanab koʻr: chetdagilar — bir martadan, oʻrtadagilar esa — uch martadan!",
      ],
      solution: {
        answer: "Tepada faqat 16, 18, 20, 22 yoki 24 boʻlishi mumkin — faqat juft sonlar.",
        explanation: [
          null,
          "22 chiqishi uchun oʻrtada 2 va 4 turishi kerak: masalan, 1, 2, 4, 3 → 3, 6, 7 → 9, 13 → 22. Bunday joylashuv toʻrtta: 1, 2, 4, 3; 1, 4, 2, 3; 3, 2, 4, 1; 3, 4, 2, 1.",
          "Oʻrtadagi har bir son tepaga 3 marta, chetdagisi esa 1 marta yetib boradi: tepa = ikkala chetki son + ikkala oʻrtadagi sonning uch baravari.",
          "Tepadagi eng katta son — oʻrtada 3 va 4 turganda: 24. Eng kichigi — oʻrtada 1 va 2 turganda: 16.",
          "Nega faqat juft: `1 + 2 + 3 + 4 = 10`, tepa esa — 10 va yana oʻrtadagi sonlar yigʻindisining ikki baravari. 10 — juft, «nimanidir ikki baravari» ham juft, shuning uchun tepa ham juft.",
        ],
        discuss: [
          "Asosiy kashfiyot: oʻrtadagi gʻishtlar chetdagilardan uch baravar kuchliroq «ishlaydi». Shuning uchun tepa kattaroq boʻlishi uchun katta sonlar oʻrtaga qoʻyiladi.",
          "Haftaning asboblari bitta tadqiqotda: sinab koʻrish va yaxshilash (22 ni qanday olish), kichik misol (uch gʻishtli devor), oʻzgarmaydigan narsani izlash (tepa doim juft), natijalar jadvali.",
          "1, 2, 3 sonli uch gʻishtli devorda tepa «ikkala chetdagi + oʻrtadagining ikki baravari»ga teng: 7, 8 va 9 chiqadi.",
        ],
      },
    },
  },
  parent: {
    skills: [
      "Asbob tanlash: masalaga qaysi usul mos keladi.",
      "Tadqiqot: tajriba, jadval, qonuniyat, «nega?»ni tushuntirish.",
      "Juft-toqlik orqali isbotlash: devorning tepasida doim juft son chiqadi.",
    ],
    observe: [
      "Farzandingiz yechishdan oldin asbobni aytadimi yoki darrov hisoblashga kirishadimi?",
      "Tadqiqot natijalarini jadvalga yozadimi? Tepada faqat juft sonlar chiqishini oʻzi payqaydimi?",
    ],
    mistakes: [
      "Devor tepasida toq sonni uzoq qidirish. Bu tabiiy va foydali: aynan shunda «balki bu mumkin emasdir?» degan savol tugʻiladi.",
      "Kubik: yoyilmadagi qoʻshni kvadratlarni qarama-qarshi tomonlar deb hisoblash.",
    ],
    question: "Haftaning qaysi asbobi senga eng koʻp yoqdi — va u qaysi masalada yordam berdi?",
  },
};
