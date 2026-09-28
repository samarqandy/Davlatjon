/** Неделя 2, день 3 — по-узбекски (накладка на day3.ts, правила — docs/uzbek-style.md). */
import type { Uz } from "../localize";
import type { Day } from "../types";

export const day3Uz: Uz<Day> = {
  title: "Kichikdan boshla",
  habit: { name: "Men kichikdan boshlayman" },
  intro: [
    "Bugungi asbob — kichik misol 🐣.",
    "Masala katta va qoʻrqinchli boʻlsa, uni kichkina qilib ol! Eng oddiy holatni yech, keyin sal kattarogʻini, javoblarni jadvalga yoz — qonuniyatning oʻzi katta masalaning javobini aytib beradi.",
  ],
  tasks: {
    w2d3t1: {
      title: "Oʻnliklar",
      body: [{ text: "Ogʻzaki hisoblab koʻr:" }, { label: "a)" }, { label: "b)" }],
      answer: { fields: { a: { label: "a) yigʻindi" }, b: { label: "b) yigʻindi" } } },
      followUps: [
        "Shu usulda hisobla: `21 + 22 + 23 + 24`.",
        "Ikkala misolning ichida qanday kichik misol yashiringan?",
      ],
      hints: [
        "Misolni yana bir bor oʻqib chiq. Qaysi sonlarni qoʻshyapmiz?",
        "10, 20, 30, 40 — bu 1, 2, 3 va 4 ta oʻnlik. `1 + 2 + 3 + 4` necha boʻladi?",
        "Oʻnliklarni tayoqchalar bilan chiz: bitta tayoqcha, ikkita, uchta, toʻrtta. Jami nechta tayoqcha boʻldi?",
        "Kichikroq misolni yech: `1 + 2 + 3 + 4 = 10`. Demak, jami 10 ta oʻnlik — bu…?",
        "b) misolda har bir son — bitta oʻnlik va yana ozgina: `11 = 10 + 1`, `12 = 10 + 2`… Oʻnliklarni alohida, birliklarni alohida qoʻsh.",
      ],
      solution: {
        answer: "a) 100; b) 50.",
        explanation: [
          "a) `1 + 2 + 3 + 4 = 10`, demak, hammasi boʻlib 10 ta oʻnlik, yaʼni 100.",
          "b) Oʻnliklar: `10 + 10 + 10 + 10 = 40`, birliklar: `1 + 2 + 3 + 4 = 10`, jami `40 + 10 = 50`.",
        ],
        discuss: [
          "`1 + 2 + 3 + 4 = 10` degan kichik misol ikkala katta misolni yechishga yordam beradi. Xuddi shunday: `21 + 22 + 23 + 24 = 80 + 10 = 90`.",
        ],
      },
    },
    w2d3t2: {
      title: "Ketma-ket toq sonlar",
      body: [
        { label: "a)" },
        { label: "b)" },
        {
          text: "Birin-ketin qoʻshishga shoshilma — avval kichkina yigʻindilarga qara: `1 + 3`, `1 + 3 + 5`…",
        },
      ],
      answer: { fields: { a: { label: "a) yigʻindi" }, b: { label: "b) yigʻindi" } } },
      followUps: [
        "Dastlabki oltita toq sonning yigʻindisi nechaga teng: `1 + 3 + 5 + 7 + 9 + 11`?",
        "1, 4, 9, 16, 25 sonlarini avval qayerda uchratgansan?",
      ],
      hints: [
        "Diqqat bilan oʻqi: 1 dan boshlab ketma-ket toq sonlarni qoʻshyapmiz.",
        "Faqat dastlabki ikkita sonni qoʻshsak nima chiqadi: `1 + 3`? Dastlabki uchtasini qoʻshsak-chi?",
        "Jadvalga yoz: nechta son qoʻshildi — qanday yigʻindi chiqdi.",
        "Kichikroq masalani yechib koʻr: `1 + 3 = 4`, `1 + 3 + 5 = 9`, `1 + 3 + 5 + 7 = 16`. Bu qanday sonlar? Toshchalardan yasalgan kvadratlarni esla!",
        "b) uchun sonlarni ikkitadan qoʻshsa ham boʻladi: birinchisini oxirgisi bilan, ikkinchisini oxiridan ikkinchisi bilan. Har bir juftlikda necha chiqadi? Nechta juftlik bor?",
      ],
      solution: {
        answer: "a) 25; b) 100.",
        explanation: [
          "Kichkina yigʻindilar: 1, `1 + 3 = 4`, `1 + 3 + 5 = 9`, `1 + 3 + 5 + 7 = 16` — bular birinchi kundagi «kvadrat sonlar».",
          "a) Beshta toq son 25 ni beradi — bu 5 qator, har birida 5 tadan toshcha boʻlgan kvadrat.",
          "b) Oʻnta toq son 100 ni beradi — 10 ga 10 kvadrat. Juftliklar bilan tekshiramiz: `1 + 19`, `3 + 17`, `5 + 15`, `7 + 13`, `9 + 11` — beshta juftlik, har biri 20 dan, jami 100.",
        ],
        discuss: [
          "Nega shunday: har bir keyingi toq son — bu toshchalardan yasalgan kvadratni keyingi, kattaroq kvadratga aylantiradigan «burchakcha» (birinchi kundagi masala).",
          "Dastlabki oltita toq sonning yigʻindisi — 36.",
        ],
      },
    },
    w2d3t3: {
      title: "Sahifalardagi raqamlar",
      body: [
        { text: "Davlatjon daftarining sahifalarini raqamlab chiqdi: 1, 2, 3 va shu tariqa 20 gacha." },
        { label: "a)", text: "U jami nechta raqam yozdi?" },
        { label: "b)", text: "U 1 raqamini necha marta yozdi?" },
        { text: "15 sonida ikkita raqam bor: 1 va 5." },
      ],
      answer: {
        fields: {
          digits: { label: "a) jami raqamlar" },
          ones: { label: "b) 1 raqami yozilgan", suffix: "marta" },
        },
      },
      followUps: [
        "1 dan 30 gacha sahifalarni raqamlash uchun nechta raqam kerak boʻladi?",
        "Davlatjon 2 raqamini necha marta yozgan?",
      ],
      hints: [
        "Shartni yana bir bor oʻqib chiq: sonlarni emas, raqamlarni sanaymiz. 15 sonida — ikkita raqam.",
        "1 dan 20 gacha boʻlgan sonlarning qaysilari bir xonali, qaysilari ikki xonali?",
        "1 dan 20 gacha barcha sonlarni yozib chiq va ulardagi har bir 1 raqamining tagiga chiz.",
        "Kichikroq masalani yechib koʻr: 1 dan 12 gacha boʻlgan sonlarda nechta raqam bor? Ularni yozib chiqib tekshir.",
        "Bir xonali sonlar 9 ta — bu 9 ta raqam. Ikki xonalilar — 10 dan 20 gacha. Ular nechta? Har birida 2 tadan raqam bor. b) uchun unutma: 11 sonida ikkita 1 raqami bor!",
      ],
      solution: {
        answer: "a) 31 ta raqam; b) 12 marta.",
        explanation: [
          "a) 1 dan 9 gacha bir xonali sonlar — 9 ta raqam. 10 dan 20 gacha ikki xonali sonlar — 11 ta son, har birida 2 tadan raqam, bu 22 ta raqam. Jami `9 + 22 = 31`.",
          "b) 1 raqami 1 sonida, 10 sonida, 11 sonida ikki marta va 12 dan 19 gacha boʻlgan sonlarda bir martadan uchraydi (bu 8 ta son). Jami `1 + 1 + 2 + 8 = 12`.",
        ],
        discuss: [
          "b) savoldagi koʻp uchraydigan xato — 11 degan javob: 11 sonidagi 1 raqami bir marta sanalgan. Barcha sonlarni tartib bilan yozib, tagiga chizish yordam beradi.",
          "1 dan 30 gacha — `9 + 42 = 51` ta raqam. 2 raqamini Davlatjon 3 marta yozgan: 2, 12 va 20 sonlarida.",
        ],
      },
    },
    w2d3t4: {
      title: "Kvadratlar yoʻlakchasi",
      body: [
        { text: "Davlatjon gugurt choʻplaridan kvadratlar yoʻlakchasini teryapti." },
        null,
        { label: "a)", text: "5 ta kvadratli yoʻlakcha uchun nechta choʻp kerak?" },
        { label: "b)", text: "10 ta kvadratli yoʻlakcha uchun nechta choʻp kerak?" },
      ],
      answer: {
        fields: {
          m5: { label: "a) 5 ta kvadrat", suffix: "ta choʻp" },
          m10: { label: "b) 10 ta kvadrat", suffix: "ta choʻp" },
        },
      },
      followUps: [
        "22 ta choʻpdan bir qatorga nechta kvadrat terish mumkin?",
        "10 ta kvadrat uchun choʻplarni boshqa usulda sana: yotganlarini alohida, tik turganlarini alohida.",
      ],
      hints: [
        "Yoʻlakchalarga yana bir qara. Ular nimadan terilgan?",
        "Har bir yoʻlakchada nechta choʻp bor? Sonlarni rasmlar tagiga yozib qoʻy.",
        "Jadval tuz: kvadratlar — 1, 2, 3, 4, 5; choʻplar — 4, 7, 10, …",
        "Bitta kvadrat qoʻshganda choʻplar nechtaga koʻpayadi? Nega 4 taga emas?",
        "Har bir yangi kvadrat 3 ta choʻp qoʻshadi: uning bir tomoni qoʻshnisida allaqachon bor. 10 ta kvadrat uchun: chapda bitta «devor»-choʻp va har bir kvadratga yana 3 tadan choʻp.",
      ],
      solution: {
        answer: "a) 16 ta choʻp; b) 31 ta choʻp.",
        explanation: [
          "Choʻplar: 4, 7, 10, 13, 16 — har safar 3 taga koʻp, chunki yangi kvadratning bir tomoni allaqachon bor.",
          "10 ta kvadrat uchun: `1 + 3 + 3 + … + 3` (oʻnta uchlik) — bu `1 + 30 = 31`.",
        ],
        discuss: [
          "Bunday ham sanash mumkin: 10 ta kvadratda tepada 10 ta, pastda 10 ta va 11 ta tik turgan choʻp bor: `10 + 10 + 11 = 31`. Ikki xil usul bir xil javob beradi — ajoyib tekshiruv.",
          "22 ta choʻpdan 7 ta kvadrat chiqadi: `1 + 3 + 3 + 3 + 3 + 3 + 3 + 3 = 22`.",
        ],
      },
    },
    w2d3t5: {
      title: "Xanoy minorasi",
      body: [
        {
          text: "Oldingda uchta sterjen bor. Chapdagisida halqalardan minora turibdi: pastda eng katta halqa, tepada eng kichigi.",
        },
        { text: "Butun minorani oʻng sterjenga oʻtkaz. Qoidalar:" },
        {
          items: [
            "Bir yurishda faqat bitta halqani — eng yuqoridagisini olish mumkin.",
            "Katta halqani kichigining ustiga qoʻyib boʻlmaydi.",
          ],
        },
        {
          text: "Kichikdan boshla: avval 1 ta halqali minorani, keyin 2 ta halqalisini, shundan keyingina 3 ta halqalisini oʻtkaz. Har bir minora uchun nechta yurish kerak?",
        },
      ],
      followUps: [
        "Rekordlaringni jadvalga yoz: 1 ta halqa, 2 ta halqa, 3 ta halqa. Qanday qonuniyat bor?",
        "4 ta halqali minora uchun nechta yurish kerak boʻladi? Tekshirib koʻr!",
      ],
      hints: [
        "Qoidalarni yana bir bor oʻqib chiq: bir yurishda bitta halqa, kattasini kichigining ustiga qoʻyib boʻlmaydi.",
        "1 ta halqali minorani 1 ta yurishda oʻtkazsa boʻladi. 2 ta halqali minoraga nechta yurish kerak?",
        "Jadval tuz: halqalar — 1, 2, 3; yurishlar — 1, 3, …",
        "Kichikroq masalani yechib koʻr: 2 ta halqali minorani oʻtkaz. Buni qanday qilganingni eslab qol.",
        "3 ta halqani oʻtkazish uchun: avval yuqoridagi 2 ta halqani oʻrtadagi sterjenga oʻtkaz (buni sen allaqachon bilasan!), keyin katta halqani — oʻngga, soʻng yana 2 ta halqani — kattasining ustiga.",
      ],
      solution: {
        answer: "7 ta yurish.",
        explanation: [
          "1 ta halqa — 1 ta yurish, 2 ta halqa — 3 ta yurish.",
          "3 ta halqa uchun: yuqoridagi 2 ta halqa — oʻrtadagi sterjenga (3 ta yurish), katta halqa — oʻngga (1 ta yurish), 2 ta halqa — uning ustiga (yana 3 ta yurish). Jami `3 + 1 + 3 = 7`.",
          "Qadamma-qadam: kichik halqa — oʻngga, oʻrtanchasi — oʻrtaga, kichigi — oʻrtaga, kattasi — oʻngga, kichigi — chapga, oʻrtanchasi — oʻngga, kichigi — oʻngga.",
        ],
        discuss: [
          "4 ta halqa uchun: `7 + 1 + 7 = 15` ta yurish. 1, 3, 7, 15 sonlarining har biri 2, 4, 8, 16 dan 1 taga kam. Katta masala xuddi shunday, lekin kichikroq masala orqali yechiladi: dasturchilar buni rekursiya deb atashadi (bu soʻzni bolaga oʻrgatish shart emas).",
          "Farzandingiz «3 ta halqani oʻtkazish uchun 2 tasini oʻtkaza bilish kerak» deb oʻzi payqasa — juda yaxshi.",
        ],
      },
    },
    w2d3t6: {
      title: "Hamma kvadratlar",
      body: [{ text: "Bu rasmda jami nechta kvadrat bor? Kichiklarini ham, kattalarini ham sana." }, null],
      answer: { fields: { squares: { label: "Jami kvadratlar" } } },
      followUps: [
        "5 × 5 shaklda nechta kvadrat boʻlardi?",
        "Jadvalingda qanday sonlar chiqdi? Ularni avval qayerda koʻrgansan?",
      ],
      hints: [
        "Savolni yana bir bor oʻqib chiq: hamma kvadratlarni sanaymiz — kichiklarini ham, kattalarini ham.",
        "Bu rasmdagi kvadratlar qanday oʻlchamda boʻladi? Eng kichigi — bitta katakcha, eng kattasi — butun rasm.",
        "Jadval tuz: kvadratning oʻlchami (1 × 1, 2 × 2, 3 × 3, 4 × 4) — bunday kvadratlar nechta.",
        "Kichikroq masalani yechib koʻr: 2 × 2 shaklda nechta kvadrat bor? (5 ta: toʻrttasi kichik, bittasi katta.) 3 × 3 shaklda nechta?",
        "4 × 4 shaklda 2 × 2 kvadratlar — 3 qator, har birida 3 tadan. 3 × 3 kvadratlar nechta?",
      ],
      solution: {
        answer: "30 ta kvadrat.",
        explanation: [null, "Jami `16 + 9 + 4 + 1 = 30`."],
        discuss: [
          "Yana kvadrat sonlar: 16, 9, 4, 1! Birinchi haftada 3 × 3 shakl bor edi — unda 14 ta kvadrat (`9 + 4 + 1`).",
          "5 × 5 shaklda `25 + 16 + 9 + 4 + 1 = 55` ta kvadrat boʻladi.",
        ],
      },
    },
    w2d3t7: {
      title: "Kafedagi stollar",
      body: [
        {
          text: "Kafeda kvadrat shaklidagi stollarni bir qatorga surib qoʻyishadi. Bitta stol atrofida 4 kishi oʻtiradi, ikkita birlashtirilgan stolda — 6 kishi, uchtasida — 8 kishi.",
        },
        { visual: { head: ["Stollar"], rows: [["Odamlar"]] } },
        { label: "a)", text: "Birlashtirilgan 5 ta stolga necha kishi oʻtiradi?" },
        { label: "b)", text: "20 kishi oʻtirishi uchun nechta stolni birlashtirish kerak?" },
      ],
      answer: {
        fields: {
          people: { label: "a) 5 ta stolda necha kishi" },
          tables: { label: "b) 20 kishi uchun nechta stol" },
        },
      },
      followUps: [
        "Bu bugungi qaysi masalaga oʻxshaydi?",
        "Toʻrtta stolni qator qilib emas, kvadrat qilib — 2 ga 2 qoʻysak, necha kishi oʻtiradi?",
      ],
      hints: [
        "Shartni yana bir bor oʻqib chiq: stollar birlashtirilganda odamlar qayerga oʻtiradi?",
        "1 ta stol — 4 kishi, 2 ta — 6, 3 ta — 8. Har bir yangi stol bilan joylar nechtaga koʻpayadi?",
        "Stollarni kvadratchalar qilib qatorasiga chiz, atrofiga odamlarni nuqtalar bilan belgila.",
        "Jadvalni davom ettir: 4 ta stol — necha kishi? 5 ta stol — necha kishi?",
        "Har bir stolning tepasida va pastida bittadan joy bor, yana qatorning ikki chetida bittadan joy.",
      ],
      solution: {
        answer: "a) 12 kishi; b) 9 ta stol.",
        explanation: [
          "Har bir yangi stol bilan 2 ta joy qoʻshiladi: 4, 6, 8, 10, 12.",
          "Har bir stolda 2 ta joy bor — tepada va pastda, yana 2 ta joy — qatorning chetlarida. 20 kishi uchun: tepada va pastda `20 − 2 = 18` ta joy, bu 9 ta stol (`9 + 9 = 18`).",
        ],
        discuss: [
          "Bu kvadratlar yoʻlakchasiga oʻxshaydi: har bir yangi stol bir xil sondagi joy qoʻshadi, «boshlanishi» esa alohida.",
          "Toʻrtta stol kvadrat qilib 2 ga 2 qoʻyilsa: har bir tomonda 2 tadan joy — 8 kishi.",
        ],
      },
    },
    w2d3t8: {
      title: "Zinapoyadagi qurbaqa",
      body: [
        {
          text: "Qurbaqa 🐸 zinapoyadan yuqoriga sakrab chiqyapti. Bir sakrashda u 1 ta yoki 2 ta pogʻonaga koʻtariladi.",
        },
        { text: "Qurbaqa yerdan 5-pogʻonaga necha xil usulda chiqishi mumkin?" },
        {
          text: "Sakrashlar tartibi boshqacha boʻlsa, usullar har xil hisoblanadi: «avval 1 ga, keyin 2 ga» va «avval 2 ga, keyin 1 ga» — bu ikki xil usul.",
        },
      ],
      answer: { fields: { ways: { label: "Usullar soni" } } },
      followUps: [
        "6-pogʻonaga yetib borishning nechta usuli bor? Hammasini yozib chiqmasdan buni bilsa boʻladimi?",
        "Jadvalingda qanday sonlar chiqdi? Ularning har biri oldingi ikkitasi bilan qanday bogʻlangan?",
      ],
      hints: [
        "Shartni yana bir bor oʻqib chiq: har bir sakrash — 1 yoki 2 pogʻonaga. Usullar sakrashlar tartibi bilan farq qiladi.",
        "Usulni raqamlar bilan yoz: masalan, «1, 2, 2» — 1 pogʻonaga sakrash, keyin 2 pogʻonaga va yana 2 pogʻonaga.",
        "Jadval tuz: 1, 2, 3, 4, 5-pogʻona — har biriga nechta usulda yetib borish mumkin.",
        "Kichikroq masalani yechib koʻr: 1-pogʻonagacha — 1 usul, 2-pogʻonagacha — 2 usul («1, 1» va «2»). 3-pogʻonagacha nechta usul bor?",
        "5-pogʻonaga qurbaqa oxirgi sakrash bilan yo 4-pogʻonadan, yo 3-pogʻonadan chiqadi. 4- va 3-pogʻonalar uchun usullarni qoʻsh!",
      ],
      solution: {
        answer: "8 xil usul.",
        explanation: [
          "Jadval: 1-pogʻonagacha — 1 usul, 2-pogʻonagacha — 2, 3-pogʻonagacha — 3, 4-pogʻonagacha — 5, 5-pogʻonagacha — 8.",
          "5-pogʻonaga qurbaqa oxirgi sakrash bilan 4- yoki 3-pogʻonadan chiqadi. Demak, usullar soni `5 + 3 = 8`.",
          "Barcha 8 usul: 1, 1, 1, 1, 1; 2, 1, 1, 1; 1, 2, 1, 1; 1, 1, 2, 1; 1, 1, 1, 2; 2, 2, 1; 2, 1, 2; 1, 2, 2.",
        ],
        discuss: [
          "1, 2, 3, 5, 8, 13, 21… sonlari Fibonachchi sonlari deyiladi: har biri oldingi ikkitasining yigʻindisiga teng. 6-pogʻonagacha — 13 ta usul.",
          "Bu yerda asosiysi — formula emas, yondashuv: katta masalani kichiklari orqali yechamiz va javoblarni jadvalga yozib boramiz.",
        ],
      },
    },
  },
  parent: {
    skills: [
      "Kichik misol va jadval: oddiy holatlardan qonuniyatga.",
      "Toq sonlar yigʻindisi, «kvadrat sonlar».",
      "«Katta masala — xuddi shunday, lekin kichikroq masala orqali» gʻoyasi (Xanoy minorasi, qurbaqa).",
    ],
    observe: [
      "U kichik holatdan oʻzi boshlaydimi yoki darhol kattasiga kirishadimi.",
      "Natijalarni jadvalga yozib boradimi.",
    ],
    mistakes: [
      "11 sonidagi 1 raqami bir marta sanalgan.",
      "Choʻplar: har bir kvadratga 4 tadan choʻp sanash (31 oʻrniga 40).",
    ],
    question: "Kichik misol senga katta masalani yechishda qanday yordam berdi?",
  },
};
