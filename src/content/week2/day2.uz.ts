/** Неделя 2, день 2 — по-узбекски (накладка на day2.ts, правила — docs/uzbek-style.md). */
import type { Uz } from "../localize";
import type { Day } from "../types";

export const day2Uz: Uz<Day> = {
  title: "Oxiridan boshla",
  habit: { name: "Men oxiridan boshlayman" },
  intro: [
    "Bugungi asbob — oxiridan boshlash ⏪.",
    "Hammasi nima bilan tugagani maʼlum boʻlsa, qadamma-qadam orqaga yurish mumkin — xuddi qordagi izlar boʻylab qaytgandek 👣. Har bir amalni teskarisiga almashtiramiz: «qoʻsh» boʻlsa — «ayir», «ikki baravar oshir» boʻlsa — teng ikkiga boʻlamiz.",
  ],
  tasks: {
    w2d2t1: {
      title: "Oʻylangan sonlar",
      body: [
        { text: "Men oʻylagan sonlarni topib koʻr." },
        { label: "a)", text: "Bir son oʻyladim, unga 15 ni qoʻshdim va 40 chiqdi." },
        { label: "b)", text: "Bir son oʻyladim, undan 8 ni ayirdim va 27 chiqdi." },
        { label: "c)", text: "Bir son oʻyladim, uni ikki baravar oshirdim va 30 chiqdi." },
      ],
      answer: {
        fields: {
          a: { label: "a) oʻylangan son" },
          b: { label: "b) oʻylangan son" },
          c: { label: "c) oʻylangan son" },
        },
      },
      followUps: [
        "Har bir javobni tekshir: u bilan topishmoqda aytilgan amalni bajarib koʻr.",
        "Oʻzing bir son oʻyla va uni oyingga yoki dadangga topishmoq qilib ayt.",
      ],
      hints: [
        "Har bir topishmoqni yana bir bor oʻqib chiq. Oʻylangan son bilan nima qilindi?",
        "Natija va bitta amal maʼlum. «Qoʻshish»ning teskarisi qaysi amal? «Ayirish»ning teskarisi-chi?",
        "Zanjir chiz: `? → +15 → 40` — va u boʻylab oʻngdan chapga yur.",
        "Kichikroq topishmoqni yechib koʻr: bir son oʻylandi, unga 1 qoʻshildi va 5 chiqdi. Qaysi son oʻylangan?",
        "Orqaga qaytish uchun teskari amalni bajar: «+15» oʻrniga — «−15», «−8» oʻrniga — «+8», «ikki baravar oshirdim» oʻrniga — «teng ikkiga boʻl».",
      ],
      solution: {
        answer: "a) 25; b) 35; c) 15.",
        explanation: [
          "a) «15 ni qoʻsh»ning teskarisi — «15 ni ayir»: `40 − 15 = 25`.",
          "b) «8 ni ayir»ning teskarisi — «8 ni qoʻsh»: `27 + 8 = 35`.",
          "c) «Ikki baravar oshir»ning teskarisi — «teng ikkiga boʻl»: 30 ning yarmi — 15 (`15 + 15 = 30`).",
        ],
        discuss: [
          "Boshidan oxiriga qarab tekshiramiz: `25 + 15 = 40` ✓, `35 − 8 = 27` ✓, `15 + 15 = 30` ✓. Farzandingiz eslatmasiz, oʻzi tekshirsa — juda yaxshi.",
        ],
      },
    },
    w2d2t2: {
      title: "Teskari zanjir",
      body: [
        { text: "Davlatjon bir son oʻyladi va u bilan uchta amal bajardi. Oxirida 20 chiqdi." },
        { visual: { steps: [null, "ikki baravar oshir", null] } },
        { text: "U qaysi sonni oʻylagan?" },
      ],
      answer: { fields: { x: { label: "Oʻylangan son" } } },
      followUps: [
        "Javobni tekshir: zanjir boʻylab chapdan oʻngga yurib chiq.",
        "Agar 10 soni oʻylansa, oxirida nima chiqadi?",
      ],
      hints: [
        "Shartni yana bir bor oʻqib chiq: Davlatjon qaysi uchta amalni bajardi va qanday tartibda?",
        "Aniq bilganimiz: oxirida 20 chiqdi. Qaysi amal eng oxirgisi boʻlgan?",
        "Zanjirni qaytadan chizib ol va u boʻylab oʻngdan chapga yur. Har bir strelka ustiga teskari amalni yoz.",
        "«−10» dan keyin 20 chiqqan boʻlsa, undan oldin qaysi son boʻlgan?",
        "Orqaga: «−10» oʻrniga «+10», «ikki baravar oshir» oʻrniga «teng ikkiga boʻl», «+6» oʻrniga «−6».",
      ],
      solution: {
        explanation: [
          "Orqaga yuramiz: `20 + 10 = 30`; 30 ning yarmi — 15; `15 − 6 = 9`.",
          "Tekshiramiz: `9 + 6 = 15`, 15 ni ikki baravar oshirsak — 30, `30 − 10 = 20` ✓.",
        ],
        discuss: [
          "Amallarni teskarisiga almashtirishning oʻzi yetmaydi — teskari tartibda yurish ham muhim: oxirgi amal birinchi boʻlib bekor qilinadi. Xuddi kechqurun avval oyoq kiyimni, keyin paypoqni yechganimizdek.",
          "Agar 10 oʻylansa, 22 chiqadi: `10 + 6 = 16`, ikki baravar oshirsak — 32, `32 − 10 = 22`.",
        ],
      },
    },
    w2d2t3: {
      title: "Buvijonning olmalari",
      body: [
        {
          text: "Buvijon dasturxonga olma 🍎 qoʻydi. Birinchi boʻlib Ali keldi va hamma olmaning yarmini oldi. Keyin Bobur keldi va qolgan olmalarning yarmini oldi. Davlatjonga oxirgi 3 ta olma qoldi.",
        },
        { label: "a)", text: "Dasturxonda boshida nechta olma boʻlgan?" },
        { label: "b)", text: "Ali nechta olma oldi?" },
      ],
      answer: {
        fields: {
          total: { label: "a) boshida nechta olma boʻlgan" },
          ali: { label: "b) Ali nechta olma oldi" },
        },
      },
      followUps: [
        "Javobni tekshir: olmalarni masaladagidek tartib bilan boʻlib chiq.",
        "Agar Davlatjonga 5 ta olma qolganida, boshida nechta olma boʻlardi?",
      ],
      hints: [
        "Shartni yana bir bor oʻqib chiq. Eng oxirida nima aniq maʼlum?",
        "Davlatjonga 3 ta olma qoldi. Bu — Boburdan keyin qolgani. Bobur esa roppa-rosa yarmini olgan edi. U kelganda nechta olma bor edi?",
        "Oxiridan boshlab yozib bor: Davlatjon kelganda, Bobur kelganda, Ali kelganda nechta olma boʻlgan. Olmalarni doirachalar qilib chizsang ham boʻladi.",
        "Boburdan keyin 3 ta olma qolgan, u esa roppa-rosa yarmini olgan boʻlsa, demak, uning oʻzi ham 3 ta olgan. Bobur kelganda nechta olma boʻlgan?",
        "Bobur kelganda 6 ta olma bor edi. Bu — Ali qoldirgan yarmi. Eng boshida nechta olma boʻlgan?",
      ],
      solution: {
        answer: "a) 12 ta olma; b) 6 ta olma.",
        explanation: [
          "Oxiridan boshlaymiz. Davlatjonga 3 ta olma qoldi — bu Bobur kelgandagi olmalarning yarmi (qolgan yarmini Boburning oʻzi oldi). Demak, Bobur kelganda `3 + 3 = 6` ta olma bor edi.",
          "Bu 6 ta olma — Ali qoldirgan yarmi. Demak, boshida `6 + 6 = 12` ta olma boʻlgan, Ali esa 6 tasini olgan.",
          "Tekshiramiz: 12 → Ali 6 tasini oldi, 6 ta qoldi → Bobur 3 tasini oldi, 3 ta qoldi ✓.",
        ],
        discuss: [
          "Koʻp uchraydigan xato — «hammaga teng, 3 tadan, jami 9». Boshidan oxiriga qarab tekshirilsa, xato darhol koʻrinadi: 9 ta olmani teng ikkiga boʻlib boʻlmaydi.",
          "Agar Davlatjonga 5 ta olma qolsa: `5 + 5 = 10`, `10 + 10 = 20`.",
        ],
      },
    },
    w2d2t4: {
      title: "Qatorning boshi",
      body: [
        { text: "Bu qatorlarning birinchi sonlari yoʻqolib qolibdi. Ularni topib ber." },
        { label: "a)" },
        { label: "b)" },
      ],
      answer: {
        fields: {
          a1: { label: "a) birinchi son" },
          a2: { label: "a) ikkinchi son" },
          b1: { label: "b) birinchi son" },
          b2: { label: "b) ikkinchi son" },
        },
      },
      followUps: [
        "a) qatorda 9 dan oldin qaysi son turgan boʻlardi?",
        "Boshi yoʻqolgan qator oʻylab top va uni kattalarga topishmoq qilib ayt.",
      ],
      hints: [
        "Yana bir qara: sonlar qatorning oxirida emas, boshida tushib qolgan.",
        "a) qatorning qoidasi qanday? Har bir son oldingisidan qanchaga katta?",
        "Sonlar orasiga oʻngdan chapga yoychalar chiz va orqaga bir qadam qoʻyish uchun nima qilish kerakligini yozib qoʻy.",
        "Oldinga yurganda 4 ni qoʻshamiz. Orqaga yurish uchun nima qilish kerak?",
        "b) qatorda har bir son oldingisidan ikki baravar katta. Demak, orqaga yurganda yarmini olamiz: 12 ning yarmi — …?",
      ],
      solution: {
        answer: "a) 9, 13; b) 3, 6.",
        explanation: [
          "a) Oldinga har safar 4 qoʻshiladi, demak, orqaga — 4 ni ayiramiz: `17 − 4 = 13`, `13 − 4 = 9`.",
          "b) Oldinga har bir son ikki baravar oshiriladi, demak, orqaga — yarmini olamiz: 12 ning yarmi — 6, 6 ning yarmi — 3.",
        ],
        discuss: [
          "Qatorni orqaga davom ettirish — oʻsha «oxiridan boshlash»ning oʻzi: har bir amal teskarisiga almashtiriladi.",
          "a) qatorda 9 dan oldin 5, undan oldin esa 1 turadi. b) qatorda 3 dan oldin «bir yarim» boʻlardi — har qanday qatorni ham orqaga butun sonlar bilan davom ettirib boʻlmasligini muhokama qilish uchun yaxshi imkoniyat.",
        ],
      },
    },
    w2d2t5: {
      title: "Ikkilantiruvchi",
      body: [
        {
          text: "**Ikkilantiruvchi** 🤖 degan ijrochi atigi ikkita buyruqni biladi: **+1** — songa 1 ni qoʻshadi, **×2** — sonni ikki baravar oshiradi.",
        },
        {
          text: "Hozir uning ekranida 1 soni turibdi. Shunday dastur tuzki, oxirida ekranda 25 chiqsin. Iloji boricha kamroq buyruq ishlatishga harakat qil!",
        },
      ],
      answer: { puzzle: { name: "Ikkilantiruvchi" } },
      followUps: [
        "50 ni qanday hosil qilsa boʻladi? 25 uchun tuzgan dasturing bunga yordam beradimi?",
        "Nega dasturni oxiridan — 25 sonidan boshlab izlash qulayroq?",
      ],
      hints: [
        "Shartni yana bir bor oʻqib chiq: Ikkilantiruvchi qaysi ikkita buyruqni biladi? U qaysi sondan boshlaydi?",
        "Oxirida 25 chiqishi kerakligi maʼlum. Oxirgi buyruq bilan 25 qaysi sondan hosil boʻlishi mumkin?",
        "Zanjirni oxiridan boshlab yoz: `25 ← ? ← ? …` Har bir strelka ustiga buyruqni yozib bor.",
        "25 — toq son, ikki baravar oshirganda esa har doim juft son chiqadi. Demak, oxirgi buyruq — «+1», undan oldin 24 boʻlgan. 24 qayerdan kelgan?",
        "Oxiridan yur: son juft boʻlsa — uni teng ikkiga boʻl (bu «×2» ni bekor qiladi), toq boʻlsa — 1 ni ayir (bu «+1» ni bekor qiladi). Shunday qilib 1 gacha yet.",
      ],
      solution: {
        answer: "6 ta buyruq: ×2, +1, ×2, ×2, ×2, +1 (1 → 2 → 3 → 6 → 12 → 24 → 25).",
        explanation: [
          "Oxiridan: 25 toq son — u 24 dan «+1» buyrugʻi bilan hosil boʻlgan. 24 esa 12 ni ikki baravar oshirishdan chiqqan, 12 — 6 dan, 6 — 3 dan. 3 — 2 dan «+1» bilan, 2 esa 1 ni ikki baravar oshirishdan chiqqan.",
          "«Imkon boricha ikki baravar oshiraver» degan toʻgʻridan-toʻgʻri yoʻl 1, 2, 4, 8, 16 ni beradi — keyin yana toʻqqiz marta «+1». Bu 13 ta buyruq — ikki baravardan ham uzunroq!",
        ],
        discuss: [
          "Birinchi buyruqni almashtirsa boʻladi: 1 dan 2 soni ikki baravar oshirish bilan ham, «+1» buyrugʻi bilan ham hosil boʻladi. Shuning uchun eng qisqa dastur ikkita.",
          "50 uchun oxiriga yana bitta «×2» qoʻshish kifoya — 7 ta buyruq. Oxiridan boshlash — eng qisqa yoʻlni topish kerak boʻlganda dasturchilarning sevimli usuli.",
        ],
      },
    },
    w2d2t6: {
      title: "Qaroqchi qayerdan kelgan?",
      body: [
        {
          text: "Bu — orol xaritasi 🏝️. Har bir katak ustun harfi va qator raqami bilan ataladi, masalan, B5.",
        },
        {
          visual: {
            cols: ["A", "B", "C", "D", "E"],
            items: [
              { cell: "B5", label: "palma" },
              { cell: "B1", label: "tosh" },
              { cell: "E5", label: "kema" },
              { cell: "A3", label: "toshbaqa" },
            ],
          },
        },
        {
          label: "a)",
          text: "Qaroqchi 🏴‍☠️ 3 katak yuqoriga, keyin 2 katak chapga yurdi — va palma 🌴 yoniga kelib qoldi. U qaysi katakdan yoʻlga chiqqan?",
        },
        {
          label: "b)",
          text: "Toʻtiqush 🦜 2 katak oʻngga, keyin 1 katak pastga, keyin 3 katak chapga uchdi — va tosh 🪨 ustiga qoʻndi. U qaysi katakdan uchib chiqqan?",
        },
      ],
      answer: {
        fields: {
          pirate: {
            label: "a) qaroqchi yoʻlga chiqqan katak",
            answer: "D2",
            cols: ["A", "B", "C", "D", "E"],
          },
          parrot: {
            label: "b) toʻtiqush uchib chiqqan katak",
            answer: "C2",
            cols: ["A", "B", "C", "D", "E"],
          },
        },
      },
      followUps: [
        "Oʻzingni tekshir: qaroqchining yoʻlini boshidan yurib chiq — palmaga yetib borasanmi?",
        "«Qayerdan kelgan?» degan oʻz topishmogʻingni oʻylab top va oyingga yoki dadangga ayt.",
      ],
      hints: [
        "Shartni yana bir bor oʻqib chiq: qaroqchi oxirida qayerga kelgani maʼlum. Boshida qayerda boʻlganini esa topish kerak.",
        "Qaroqchi palma yonida — B5 katakda. Uning oxirgi qadami qanday boʻlgan?",
        "Yoʻlni oxiridan boshiga qarab strelkalar bilan chiz: har bir strelkani teskari tomonga burib qoʻy.",
        "Kichikroq masalani yechib koʻr: qaroqchi 1 katak yuqoriga yurib, B5 ga keldi. U qayerda boʻlgan? (B4 da.)",
        "Oxiridan: palmadan 2 katak oʻngga yur («chapga» oʻrniga), keyin 3 katak pastga («yuqoriga» oʻrniga).",
      ],
      solution: {
        answer: "a) D2; b) C2.",
        explanation: [
          "a) Oxiridan: palma turgan B5 dan ikki katak oʻngga — D5, keyin uch katak pastga — D2.",
          "b) Oxiridan: tosh turgan B1 dan uch katak oʻngga — E1, bir katak yuqoriga — E2, ikki katak chapga — C2.",
          "a) ni tekshiramiz: D2 dan uch katak yuqoriga — D5, ikki katak chapga — B5 ✓.",
        ],
        discuss: [
          "Ochiq xaritada qadamlar tartibi javobni oʻzgartirmaydi: siljishlarni istalgan tartibda bajarish mumkin. Lekin «oxirgi qadam birinchi bekor qilinadi» degan odat tartib muhim boʻlgan joyda juda asqatadi — masalan, ikki baravar oshirish bor zanjirda.",
        ],
      },
    },
    w2d2t7: {
      title: "Soat nechada turish kerak?",
      body: [
        {
          text: "Maktabda darslar 8:30 da boshlanadi. Uydan maktabgacha yoʻl 20 daqiqa oladi. Yuvinish, kiyinish va nonushta qilishga Davlatjon 35 daqiqada ulguradi.",
        },
        { visual: { caption: "Darslar boshlanishi — 8:30" } },
        {
          label: "a)",
          text: "Darslar boshlanishiga roppa-rosa yetib borishi uchun u uydan soat nechada chiqishi kerak?",
        },
        { label: "b)", text: "U soat nechada uyqudan turishi kerak?" },
      ],
      answer: {
        fields: {
          leave: { label: "a) uydan chiqish vaqti" },
          wake: { label: "b) uyqudan turish vaqti" },
        },
      },
      followUps: [
        "Agar Davlatjon 10 daqiqa erta borishni xohlasa, soat nechada turishi kerak?",
        "Oʻzingning ertalabki kun tartibingni ham shunday tuzib koʻr.",
      ],
      hints: [
        "Shartni yana bir bor oʻqib chiq: darslar soat nechada boshlanadi? Ungacha nimalarga ulgurish kerak?",
        "Darslar boshlanish vaqti va har bir ish necha daqiqa olishi maʼlum. Darsdan oldingi eng oxirgi ish qaysi?",
        "Vaqt chizigʻini chiz: oxirida — 8:30. Oxiridan orqaga yur: avval yoʻl, keyin nonushta va yigʻinish.",
        "8:30 dan 20 daqiqa orqaga sanasang, soat necha boʻladi?",
        "8:10 dan 35 daqiqa orqaga: avval 10 daqiqa — 8:00 gacha, keyin yana 25 daqiqa.",
      ],
      solution: {
        answer: "a) 8:10 da; b) 7:35 da.",
        explanation: [
          "a) 8:30 dan 20 daqiqa orqaga — 8:10.",
          "b) 8:10 dan 35 daqiqa orqaga: 10 daqiqa orqaga — 8:00, yana 25 daqiqa orqaga — 7:35.",
        ],
        discuss: [
          "Kattalar vaqtni aynan shunday rejalashtiradi: «qachon yetib borish kerak»dan boshlab — qadamma-qadam orqaga.",
          "10 daqiqa erta borish uchun 7:25 da turish kerak.",
        ],
      },
    },
    w2d2t8: {
      title: "Nilufarlar",
      body: [
        {
          text: "Hovuzda nilufarlar 🪷 oʻsyapti. Har kuni ular oldingi kundagidan ikki baravar koʻpayadi. 10-kuni nilufarlar butun hovuzni qoplab oldi.",
        },
        { label: "a)", text: "Qaysi kuni ular hovuzning yarmini qoplagan edi?" },
        { label: "b)", text: "Qaysi kuni hovuzning choragini qoplagan edi?" },
      ],
      answer: {
        fields: {
          half: { label: "a) hovuzning yarmi", suffix: "-kuni" },
          quarter: { label: "b) hovuzning choragi", suffix: "-kuni" },
        },
      },
      followUps: [
        "Nega «5-kuni» degan javob toʻgʻri kelmaydi? Uni tekshirib koʻr.",
        "7-kuni hovuzning qancha qismi qoplangan edi?",
      ],
      hints: [
        "Shartni yana bir bor oʻqib chiq: nilufarlar har kuni ikki baravar koʻpayadi.",
        "10-kuni hovuz butunlay qoplangani maʼlum. Bir kun oldin qanday boʻlgan?",
        "10-kundagi hovuzni kvadrat qilib chiz — u butunlay boʻyalgan. Keyin 9-kundagisini chiz: qancha qismi boʻyalgan?",
        "Agar bugun nilufarlar kechagidan ikki baravar koʻp boʻlsa, kecha ular qancha boʻlgan?",
        "Oxiridan yur: 10-kun — butun hovuz, 9-kun — yarmi…",
      ],
      solution: {
        answer: "a) 9-kuni; b) 8-kuni.",
        explanation: [
          "Har kuni nilufarlar oldingi kundagidan ikki baravar koʻp. Demak, oldingi kuni ular ikki baravar kam boʻlgan.",
          "10-kun — butun hovuz, 9-kun — yarmi, 8-kun — yarmining yarmi, yaʼni choragi.",
        ],
        discuss: [
          "Eng koʻp uchraydigan javob — «5-kuni» (10 kunning yarmi). Farzandingizdan soʻrang: «Agar 5-kuni yarmi qoplangan boʻlsa, 6-kuni nilufarlar ikki baravar koʻpayadi — va butun hovuz qoplanadi. Shartda esa — faqat 10-kuni».",
          "7-kuni hovuzning sakkizdan bir qismi qoplangan edi. Oxiridan boshlash bu masalani juda osonlashtiradi.",
        ],
      },
    },
  },
  parent: {
    skills: [
      "Oxiridan boshlash: teskari amallar va teskari tartib.",
      "Ijrochi bilan ilk tanishuv — sonlar ustida bajariladigan buyruqlardan tuzilgan dastur.",
      "Vaqtni voqeadan orqaga qarab rejalashtirish.",
    ],
    observe: [
      "Orqaga yurganda u amallarni ham, ularning tartibini ham almashtiradimi.",
      "Javobni boshidan oxiriga qarab tekshiradimi.",
    ],
    mistakes: [
      "Zanjirda amallarni bekor qilish, lekin avvalgi tartibda.",
      "Nilufarlar: «5-kuni» degan javob; olmalar: «hammaga teng, 3 tadan».",
    ],
    question: "Qachon oxiridan boshlash foydali? Hayotdan bir misol keltir.",
  },
};
