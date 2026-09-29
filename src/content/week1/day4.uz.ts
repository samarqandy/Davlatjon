/** Неделя 1, день 4 — по-узбекски (накладка на day4.ts, правила — docs/uzbek-style.md). */
import type { Uz } from "../localize";
import type { Day } from "../types";

export const day4Uz: Uz<Day> = {
  title: "Tartib bilan koʻrib chiq",
  habit: { name: "Men tartib bilan koʻrib chiqaman" },
  intro: [
    "Bugun HAMMA variantlarni topishni — va birortasi ham yoʻqolmaganiga amin boʻlishni oʻrganamiz.",
    "Siri oddiy: tartib. Variantlarni tartib bilan koʻrib chiqsang, birortasi ham qochib ketolmaydi.",
  ],
  tasks: {
    w1d4t1: {
      title: "Qoʻshni sonlar",
      body: [
        {
          text: "Yigʻindisi 25 ga teng boʻlgan ikkita qoʻshni sonni top. (Qoʻshni sonlar ketma-ket keladi, masalan, 7 va 8.)",
        },
      ],
      answer: {
        fields: {
          small: { label: "Kichik son" },
          big: { label: "Katta son" },
        },
      },
      followUps: [
        "Yigʻindisi 30 boʻlgan ikkita qoʻshni son topsa boʻladimi? Urinib koʻr va nima chiqqanini tushuntir.",
      ],
      hints: [
        "Yana bir bor oʻqi: «qoʻshni sonlar» degani nima?",
        "Qoʻshni sonlar deyarli teng — biri ikkinchisidan 1 ga katta. Har biri taxminan qancha boʻlishi kerak?",
        "25 ta doiracha chiz va ularni ikki toʻdaga ajrat — toʻdalar bir-biridan atigi bitta doirachaga farq qilsin.",
        "Tartib bilan tekshir: `10 + 11 = ?`, `11 + 12 = ?` Davom ettir.",
        "25 ta doirachadan bittasini chetga olib qoʻy, qolganini ikki toʻdaga teng boʻl. Endi ortiqcha doirachani qayerga qoʻyasan?",
      ],
      solution: {
        answer: "12 va 13.",
        discuss: [
          "Yigʻindisi 30 boʻlgan ikkita qoʻshni son topib boʻlmaydi: `14 + 15 = 29`, `15 + 16 = 31` — 30 ning ustidan «sakrab oʻtamiz». Ikki qoʻshni sonning yigʻindisi doim toq boʻladi (ulardan biri juft, ikkinchisi toq). Agar farzandingiz buni oʻzi payqasa — bu haqiqiy kashfiyot!",
        ],
      },
    },
    w1d4t2: {
      title: "Plyusmi, minusmi?",
      body: [{ text: "Toʻgʻri tenglik hosil boʻlishi uchun har bir katakchaga «+» yoki «−» belgisini qoʻy." }],
      followUps: ["Birinchi misolda belgilarni necha xil qilib qoʻyish mumkin? Ikkinchisida-chi?"],
      hints: [
        "Yana bir bor oʻqi: har bir katakchaga «+» yoki «−» qoʻyish kerak.",
        "Birinchi misolda nechta katakcha bor? Belgilarning nechta turli varianti boʻlishi mumkin?",
        "Hamma variantlarni tartib bilan yozib chiq: `+ +`, `+ −`, `− +`, `− −` — va har birini hisobla.",
        "Avval birinchi misolni yech: unda bor-yoʻgʻi 4 ta variant bor.",
        "Ikkinchi misolda uchta katakcha bor. Tartib bilan koʻrib chiq: `+ + +`, `+ + −`, `+ − +`, `+ − −`, … Jami 8 ta variant.",
      ],
      solution: {
        explanation: [
          "Birinchi misol: `9 + 4 + 3 = 16`, `9 + 4 − 3 = 10`, `9 − 4 + 3 = 8` ✓, `9 − 4 − 3 = 2`.",
          "Ikkinchi misol: 8 ta variantdan faqat `12 − 5 + 7 − 4 = 10` toʻgʻri keladi.",
        ],
        discuss: [
          "Har bir yangi katakcha qoʻshilganda variantlar soni ikki baravar ortadi: 2, 4, 8… Yana birinchi kundagi ikki baravar oshish!",
        ],
      },
    },
    w1d4t3: {
      title: "Nima kiyaman?",
      body: [
        {
          text: "{name:ning} 3 ta futbolkasi — qizil, koʻk va yashil — hamda 2 ta shimi bor: qora va kulrang.",
        },
        null,
        { label: "a)", text: "U necha xil kiyinishi mumkin (futbolka + shim)?" },
        { label: "b)", text: "Birorta ham variantni tushirib qoldirmaganingga qanday ishonch hosil qilasan?" },
      ],
      answer: { fields: { outfits: { label: "a) necha xil" } } },
      followUps: [
        "Agar unda kepka ham paydo boʻlsa-chi? Uni kiysa ham, kiymasa ham boʻladi.",
        "Agar futbolkalar 4 ta boʻlsa-chi?",
      ],
      hints: [
        "Yana bir bor oʻqi: nechta futbolka va nechta shim bor?",
        "Har safar bitta futbolka va bitta shim kiyiladi. Nimani almashtirsa boʻladi?",
        "Har bir futbolkani chiz, undan esa u bilan kiysa boʻladigan hamma shimlarga strelkacha chiz.",
        "Qizil futbolka bilan necha xil kiyinsa boʻladi?",
        "Har bir futbolka bilan variantlar soni bir xil chiqadi. Futbolka nechta boʻlsa, shuncha marta takrorla.",
      ],
      solution: {
        answer: "6 xil.",
        explanation: [
          "Har bir futbolkani qora shim bilan ham, kulrang shim bilan ham kiysa boʻladi: qizil — 2 xil, koʻk — 2 xil, yashil — 2 xil. Jami `2 + 2 + 2 = 6`.",
          "3 × 2 jadval yoki «daraxt» chizilsa, hech narsa tushib qolmagani koʻrinib turadi.",
        ],
        discuss: [
          "Kepka bilan («kiyish yoki kiymaslik») har bir variant ikkitaga aylanadi — jami 12 ta. Toʻrtta futbolka bilan — 8 ta. Bu kombinatorikaga tayyorgarlik: variantlar soni koʻpaytiriladi.",
        ],
      },
    },
    w1d4t4: {
      title: "Oʻsib borayotgan zinapoyalar",
      body: [
        { text: "{name} kubiklardan zinapoyalar quryapti." },
        null,
        { label: "a)", text: "5-zinapoya uchun nechta kubik kerak boʻladi?" },
        { label: "b)", text: "6-zinapoya uchun-chi?" },
      ],
      answer: {
        fields: {
          s5: { label: "a) 5-zinapoya" },
          s6: { label: "b) 6-zinapoya" },
        },
      },
      followUps: [
        "6-zinapoyani chizmasdan, unga ketadigan kubiklarni qanday sanash mumkin?",
        "10-zinapoya uchun nechta kubik kerak?",
      ],
      hints: [
        "Zinapoyalarga yana bir bor qara. Har bir keyingisi oldingisidan nimasi bilan farq qiladi?",
        "Har bir zinapoyada nechta kubik bor? Sonlarni rasmlar tagiga yozib qoʻy.",
        "5-zinapoyani oʻzing chiz: unda 5 ta pogʻona bor.",
        "Ikkinchi zinapoya birinchisidan nechta kubikka koʻp? Uchinchisi ikkinchisidan-chi?",
        "Har safar bitta butun ustuncha qoʻshiladi. 5-zinapoyadagi yangi ustunchaning balandligi qancha boʻladi?",
      ],
      solution: {
        answer: "a) 15; b) 21.",
        explanation: [
          "Zinapoyalarda 1, 3, 6, 10 ta kubik bor: har safar oldingisidan 1 kubikka balandroq ustuncha qoʻshiladi (+2, +3, +4).",
          "5-zinapoya: `10 + 5 = 15`. 6-zinapoya: `15 + 6 = 21`.",
        ],
        discuss: [
          "1, 3, 6, 10, 15, 21 sonlari «uchburchak sonlar» deyiladi. Bugun ular yana ikki marta uchraydi — farzandingiz buni oʻzi payqarmikan, kuzatib boring! 10-zinapoya uchun: `1 + 2 + … + 10 = 55`.",
        ],
      },
    },
    w1d4t5: {
      title: "Hamma qisqa yoʻllar",
      body: [
        {
          text: "Robot 🤖 bayroqchali 🚩 katakka bor-yoʻgʻi 4 qadamda yetib borishi kerak: 2 qadam oʻngga (→) va 2 qadam yuqoriga (↑).",
        },
        { text: "Eng qisqa yoʻllarning hammasini top — 4 ta strelkadan iborat dasturlarni. Ular nechta?" },
      ],
      followUps: [
        "Boshqa qisqa yoʻl yoʻqligini qanday isbotlash mumkin?",
        "Agar 2 qadam oʻngga va 1 qadam yuqoriga yurish kerak boʻlsa, nechta qisqa yoʻl bor?",
      ],
      hints: [
        "Yana bir bor oʻqi: robot necha qadam oʻngga va necha qadam yuqoriga yurishi kerak?",
        "Har bir dasturda ikkita → va ikkita ↑ strelka bor. Dasturlar bir-biridan nimasi bilan farq qiladi?",
        "3 qatorli, har qatorida 3 tadan katagi bor maydonni bir necha marta chizib ol va har biriga yangi yoʻl chiz.",
        "Avval → bilan boshlanadigan hamma yoʻllarni top. Keyin — ↑ bilan boshlanadiganlarini.",
        "Agar birinchi strelka → boʻlsa, ikkinchi → qayerda turishi mumkin? 2-, 3- yoki 4-oʻrinda. Shunda hech narsa yoʻqolmaydi.",
      ],
      solution: {
        answer: "6 ta yoʻl.",
        explanation: [
          "→ bilan boshlanadiganlari: →→↑↑, →↑→↑, →↑↑→.",
          "↑ bilan boshlanadiganlari: ↑→→↑, ↑→↑→, ↑↑→→.",
          "Boshqasi yoʻq: dasturda 4 ta oʻrin bor, ulardan 2 tasini → strelkalar uchun tanlash kerak. Biz bunday tanlovlarning hammasini tartib bilan koʻrib chiqdik.",
        ],
        discuss: [
          "Bu haqiqiy kombinatorika: kataklar boʻylab yoʻllar soni. «2 qadam oʻngga va 1 qadam yuqoriga» uchun yoʻllar 3 ta: →→↑, →↑→, ↑→→.",
        ],
      },
    },
    w1d4t6: {
      title: "Nechta uchburchak?",
      body: [{ text: "Rasmda jami nechta uchburchak bor?" }],
      answer: { fields: { triangles: { label: "Uchburchaklar soni" } } },
      followUps: [
        "Agar yuqoridagi uchidan yana bitta chiziq oʻtkazilsa-chi?",
        "1, 2 va 3 ta chiziq boʻlganda nechta uchburchak chiqishini yozib chiq. Bunday sonlarni bugun qayerda koʻrding?",
      ],
      hints: [
        "Yana bir bor qara: uchburchaklar kichik ham, katta ham boʻladi.",
        "Chiziqlar katta uchburchakni nechta boʻlakka boʻladi?",
        "Shaklni chizib ol va topgan har bir uchburchagingning chetini rangli qalam bilan chizib chiq.",
        "Kichikroq masalani yech: uchidan faqat bitta chiziq oʻtkazilsa, nechta uchburchak boʻladi?",
        "Tartib bilan sana: bitta boʻlakdan iborat uchburchaklarni, ikkita qoʻshni boʻlakdan iboratlarini, uchta boʻlakdan iboratlarini.",
      ],
      solution: {
        answer: "6 ta uchburchak.",
        explanation: [
          "Bitta boʻlakdan iborat — 3 ta uchburchak.",
          "Ikkita qoʻshni boʻlakdan iborat — 2 ta.",
          "Uchta boʻlakdan iborat — 1 ta (butun katta uchburchak).",
          "Jami: `3 + 2 + 1 = 6`.",
        ],
        discuss: [
          "Uchta chiziq boʻlsa, `4 + 3 + 2 + 1 = 10` ta boʻladi. Yana uchburchak sonlar — xuddi zinapoyalardagidek!",
        ],
      },
    },
    w1d4t7: {
      title: "Kino chiptalari",
      body: [
        { text: "Kinoda 🎬 kattalar chiptasi 20 ming soʻm, bolalar chiptasi esa 10 ming soʻm turadi." },
        {
          text: "Bir necha kishi kinoga borib, chiptalar uchun 80 ming soʻm toʻladi. Ular orasida kattalar ham, bolalar ham bor edi.",
        },
        { text: "Kattalar nechta, bolalar nechta boʻlishi mumkin? Hamma variantlarni top." },
      ],
      answer: { fields: { variants: { label: "Jami nechta variant bor?" } } },
      followUps: [
        "Nega «4 ta katta» varianti toʻgʻri kelmaydi?",
        "Agar katta faqat bitta boʻlsa, bolalar nechta boʻlishi mumkin?",
      ],
      hints: [
        "Yana bir bor oʻqi: kattalar chiptasi qancha, bolalar chiptasi qancha va jami qancha toʻlangan?",
        "Ular orasida kattalar ham, bolalar ham bor. Kattalar nechta boʻlishi mumkin: 1? 2? 3? 4?",
        "Jadval tuz: kattalar soni — ularga qancha pul ketdi — bolalarga qancha qoldi — bolalar soni.",
        "Agar katta bitta boʻlsa, bolalar chiptalariga qancha pul qoldi? Bu nechta chipta boʻladi?",
        "Kattalar sonini tartib bilan koʻrib chiq: 1, 2, 3, 4… va har safar bolalarga qancha qolishini tekshir.",
      ],
      solution: {
        answer: "3 ta variant: 1 ta katta va 6 ta bola; 2 ta katta va 4 ta bola; 3 ta katta va 2 ta bola.",
        explanation: [
          "1 ta katta: 20 ming, bolalarga 60 ming qoladi — bu 6 ta bolalar chiptasi.",
          "2 ta katta: 40 ming, 40 ming qoladi — 4 ta bola.",
          "3 ta katta: 60 ming, 20 ming qoladi — 2 ta bola.",
          "4 ta katta: 80 ming — bolalarga hech narsa qolmaydi, ular orasida esa bolalar bor edi. Toʻgʻri kelmaydi.",
        ],
        discuss: [
          "«Kattalar ham, bolalar ham bor edi» sharti chekka holatlarni chiqarib tashlaydi: kattalarsiz 8 ta bola va bolalarsiz 4 ta katta. Soʻrang: «Bu shartni olib tashlasak, nima oʻzgaradi?»",
        ],
      },
    },
    w1d4t8: {
      title: "Qoʻl berib koʻrishish",
      body: [
        {
          text: "Toʻrt doʻst uchrashib qoldi. Har biri qolganlarning har biri bilan qoʻl berib koʻrishdi — faqat bir martadan.",
        },
        {
          visual: {
            items: [{ label: "{name}" }, { label: "Ali" }, { label: "Bobur" }, { label: "Temur" }],
          },
        },
        { text: "Hammasi boʻlib necha marta qoʻl berib koʻrishildi?" },
      ],
      answer: { fields: { shakes: { label: "Koʻrishishlar soni" } } },
      followUps: ["Agar doʻstlar 5 kishi boʻlsa-chi?", "Qaysi sonlar yana uchradi? Nima deb oʻylaysan, nega?"],
      hints: [
        "Yana bir bor oʻqi: har kim har kim bilan qoʻl berib koʻrishadi, lekin faqat bir marta.",
        "Birinchi doʻst necha kishi bilan koʻrishadi?",
        "4 ta nuqta chiz — bular doʻstlar. Har bir koʻrishish — ikki nuqta orasidagi chiziq.",
        "Kichikroq masalani yech: doʻstlar uch kishi boʻlsa, necha marta koʻrishiladi?",
        "Birinchisi uch kishi bilan koʻrishadi. Ikkinchisiga faqat ikkita yangi doʻsti bilan koʻrishish qoladi… Davom ettir.",
      ],
      solution: {
        answer: "6 marta.",
        explanation: [
          "{name} Ali, Bobur va Temur bilan koʻrishadi — 3 marta.",
          "Ali — Bobur va Temur bilan ({name} bilan allaqachon koʻrishgan) — 2 marta.",
          "Bobur — Temur bilan — 1 marta.",
          "Jami: `3 + 2 + 1 = 6`.",
        ],
        discuss: [
          "Koʻp uchraydigan xato — 12 degan javob: har bir koʻrishish ikki marta sanalgan («Ali Bobur bilan» va «Bobur Ali bilan»). 5 doʻst uchun: `4 + 3 + 2 + 1 = 10` — yana uchburchak sonlar!",
          "Sonlar nega takrorlanadi: hamma joyda `1 + 2 + 3 + …` ni qoʻshamiz — zinapoyaning har bir yangi ustunchasi, uchburchakning yangi boʻlagi yoki har bir yangi doʻst oldingisidan 1 ta koʻproq qoʻshadi.",
        ],
      },
    },
  },
  parent: {
    skills: [
      "Variantlarni tizimli koʻrib chiqish: jadval, daraxt, «tartib bilan».",
      "Kombinatorika asoslari: kiyinish variantlari, yoʻllar, qoʻl berib koʻrishishlar.",
      "Toʻliqlikni isbotlash: «nega boshqa variant yoʻq».",
    ],
    observe: [
      "Farzandingiz variantlarni tartib bilan koʻrib chiqadimi yoki tavakkaliga «sakrab» yuradimi.",
      "1, 3, 6, 10 sonlari uchta turli masalada uchraganini oʻzi payqaydimi.",
    ],
    mistakes: [
      "Bitta koʻrishishni ikki marta sanash (12 degan javob).",
      "Robot yoʻllaridan birini tushirib qoldirish.",
    ],
    question: "HAMMA variantlarni topganingga qanday amin boʻla olasan?",
  },
};
