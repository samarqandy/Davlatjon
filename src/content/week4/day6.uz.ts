/** Hafta 4, 6-kun — oʻzbekcha (day6.ts ustiga qoplama, qoidalar — docs/uzbek-style.md). */
import type { Uz } from "../localize";
import type { Day } from "../types";

const COLS5 = ["A", "B", "C", "D", "E"];
const COLS4 = ["A", "B", "C", "D"];

export const day6Uz: Uz<Day> = {
  title: "Xarita va yoʻnalishlar",
  habit: { name: "Men xaritada moʻljal olaman" },
  intro: [
    "Bugun biz sayyohmiz 🧭. Adashib qolmaslik uchun burilishni, kataklar koordinatasini oʻqishni va qisqa yoʻlni topishni bilish kerak.",
    "Xaritani qanday oʻqishni esla: ustunlar chapdan oʻngga harflar bilan, qatorlar pastdan yuqoriga raqamlar bilan belgilangan. «B2» katak — B ustunida va 2-qatorda.",
  ],
  tasks: {
    w4d6t1: {
      title: "Chapga, oʻngga",
      body: [
        { text: "{name} yuzini shimolga qaratib turibdi. Agar yozilgandek burilsa, {name} qayerga qarab turadi?" },
      ],
      answer: {
        prompt: "Qayerga qaraydi?",
        items: {
          a: { label: "a) bir marta oʻngga" },
          b: { label: "b) bir marta chapga" },
          c: { label: "c) ikki marta oʻngga" },
          d: { label: "d) uch marta chapga" },
        },
        options: {
          n: { label: "Shimolga" },
          e: { label: "Sharqqa" },
          s: { label: "Janubga" },
          w: { label: "Gʻarbga" },
        },
      },
      followUps: [
        "Yana shimolga qarab turish uchun necha marta oʻngga burilish kerak?",
        "Nega chapga uch marta burilish oʻngga bir marta burilish bilan bir xil?",
      ],
      hints: [
        "Yana bir oʻqi: har bir burilish — doiraning choragi, soat mili 3 soatga burilgandek.",
        "Shimolga qarab tursang, oʻngingda — sharq, chapingda — gʻarb, orqangda — janub.",
        "Oʻrningdan tur va masaladagidek burilib koʻr. Yoki kompas chiz: tepada Sh, oʻngda Shq, pastda J, chapda Gʻ.",
        "Oʻngga ikki marta burilish — orqaga qayrilish: orqang turgan tomonga qaraysan.",
        "Chapga uch marta burilish: gʻarb, janub, … keyingi yoʻnalish qaysi?",
      ],
      solution: {
        answer: "a) sharq; b) gʻarb; c) janub; d) sharq.",
        explanation: [
          "Oʻngga burilishlar doira boʻylab boradi: shimol → sharq → janub → gʻarb → shimol.",
          "Chapga — teskari tomonga: shimol → gʻarb → janub → sharq. Shuning uchun chapga uch marta burilish xuddi oʻngga bir martadek sharqqa olib keladi.",
        ],
        discuss: [
          "Eng oson yoʻli — tana bilan yechish: xona oʻrtasida turib, «shimol» qayerdaligini kelishib olib, burilish.",
        ],
      },
    },
    w4d6t2: {
      title: "Xazina qayerda?",
      body: [
        {
          visual: {
            cols: COLS5,
            items: [
              { cell: "B2", label: "uy" },
              { cell: "E4", label: "daraxt" },
              { cell: "C3", label: "tosh" },
            ],
          },
        },
        { label: "a)", text: "Uydan oʻngga 2 katak va yuqoriga 3 katak yur. Xazina qaysi katakda?" },
        { label: "b)", text: "Daraxtdan chapga 4 katak va pastga 2 katak yur. Ikkinchi xazina qayerga yashirilgan?" },
      ],
      answer: {
        fields: {
          first: { label: "a) birinchi xazina", answer: "D5", cols: COLS5 },
          second: { label: "b) ikkinchi xazina", answer: "A2", cols: COLS5 },
        },
      },
      followUps: [
        "Birinchi xazinadan ikkinchisigacha qanday borish mumkin? Yoʻlni yozib chiq.",
        "Toshdan uygacha yoʻl oʻylab top.",
      ],
      hints: [
        "Yana bir oʻqi: oʻngga — keyingi harfga, yuqoriga — kattaroq raqamga.",
        "Uy B2 katakda, daraxt — E4 da.",
        "Barmogʻingni uyga qoʻy va qadamlarni ovoz chiqarib sanab, kataklar boʻylab yur.",
        "B dan oʻngga ikki katak — bu C, keyin D. 2-qatordan yuqoriga uch katak — 3, 4, 5-qatorlar.",
        "b) E dan chapga 4 katak — D, C, B, A. 4-qatordan pastga 2 katak — 2-qator.",
      ],
      solution: {
        answer: "a) D5; b) A2.",
        explanation: [
          "a) B2 dan oʻngga 2 katak — D2 ga, yuqoriga 3 katak — D5 ga.",
          "b) E4 dan chapga 4 katak — A4 ga, pastga 2 katak — A2 ga.",
        ],
        discuss: [
          "Agar farzandingiz «yuqori» bilan «past»ni adashtirsa, eslatib qoʻying: xaritadagi qatorlar uyning qavatlari kabi pastdan yuqoriga sanaladi.",
        ],
      },
    },
    w4d6t3: {
      title: "Belgilari boʻyicha katak",
      body: [
        {
          visual: {
            cols: COLS4,
            items: [
              { cell: "A2", label: "quduq" },
              { cell: "D4", label: "palma" },
            ],
          },
        },
        { text: "Xazina boʻsh katakka koʻmilgan. U haqida mana nimalar maʼlum:" },
        {
          items: [
            "Xazina quduq bilan bir qatorda.",
            "Xazina quduqqa qoʻshni katakda emas (qoʻshni kataklar — tomoni bilan tegib turganlar).",
            "Xazina C ustunida emas.",
          ],
        },
      ],
      answer: { fields: { treasure: { label: "Xazina katagi", answer: "D2", cols: COLS4 } } },
      followUps: [
        "Qaysi belgi eng koʻp katakni chiqarib tashladi?",
        "Bitta belgini olib tashlab, baribir xazinani topish mumkinmi?",
      ],
      hints: [
        "Yana bir oʻqi: xazina boʻsh katakda va uchala belgi ham birdaniga toʻgʻri.",
        "Quduq A2 katakda. U bilan bir qatorda qaysi kataklar turibdi?",
        "2-qatorning hamma boʻsh kataklarini yozib chiq va mos kelmaganlarini oʻchir.",
        "2-qatorda boʻsh kataklar — B2, C2 va D2. Ulardan qaysi biri quduqqa qoʻshni?",
        "B2 quduqqa tegib turibdi — oʻchiramiz. C2 va D2 qoldi. Qaysi biri C ustunida emas?",
      ],
      solution: {
        answer: "D2.",
        explanation: [
          "Birinchi belgiga koʻra xazina 2-qatorda: B2, C2, D2 boʻsh kataklari mos keladi.",
          "B2 — quduqqa qoʻshni, oʻchiramiz. C2 — C ustunida, uni ham oʻchiramiz. D2 qoladi.",
        ],
        discuss: [
          "Har bir belgi kerak: ikkinchisisiz B2 ham, uchinchisisiz C2 ham mos kelardi. Farzandingizdan qaysi belgini olib tashlash mumkin edi, deb soʻrang — va hech qaysini olib tashlab boʻlmasligini tekshiring.",
        ],
      },
    },
    w4d6t4: {
      title: "Kvadrat burchakchalari",
      body: [
        {
          text: "Kvadrat burchakchalar bilan oʻsadi: 1 × 1 kvadratga 3 katakli burchakcha qoʻshiladi — 2 × 2 hosil boʻladi, keyin 5 katakli burchakcha — 3 × 3 hosil boʻladi. Katakdagi son — burchakcha raqami.",
        },
        null,
        { label: "a)", text: "7 × 7 kvadratni 8 × 8 kvadratga aylantiradigan burchakchada nechta katak bor?" },
        { label: "b)", text: "`1 + 3 + 5 + 7 + 9 + 11 + 13 + 15 + 17 + 19` yigʻindisi nechaga teng?" },
      ],
      answer: {
        fields: {
          corner: { label: "a) burchakchadagi kataklar" },
          sum: { label: "b) yigʻindi" },
        },
      },
      followUps: [
        "Dastlabki beshta toq sonning yigʻindisi nechaga teng? Dastlabki yigirmatasiniki-chi?",
        "Nega har bir yangi burchakchada oldingisidan 2 ta katak koʻp?",
      ],
      hints: [
        "Yana bir oʻqi: burchakcha — kvadrat 1 katakka keng va baland boʻlishi uchun unga qoʻshiladigan qism.",
        "Burchakchalar — 1, 3, 5, 7 katakli. Burchakcha har safar nechtaga oʻsadi?",
        "5 × 5 kvadrat chiz va har bir burchakchani oʻz rangiga boʻya.",
        "8 × 8 kvadratni hosil qiladigan burchakcha — sakkizinchisi. 15 nechanchi toq son?",
        "b) Dastlabki toq sonlar yigʻindisi — burchakchalardan yigʻilgan kvadrat. Yigʻindida nechta son boʻlsa, kvadrat ham shunday oʻlchamda.",
      ],
      solution: {
        answer: "a) 15; b) 100.",
        explanation: [
          "a) 7 × 7 kvadrat burchakchasi — 8 katakli qator va 7 katakli ustuncha: `8 + 7 = 15`. Tekshirish: `64 − 49 = 15`.",
          "b) Oʻnta burchakcha (1, 3, …, 19) birgalikda 10 × 10 kvadratga yigʻiladi, demak, yigʻindi 100 ga teng.",
        ],
        discuss: [
          "Dastlabki toq sonlar yigʻindisi — har doim kvadrat: 1, 4, 9, 16… Bu rasm sonlar qoidasini isbotlaydigan chiroyli misol.",
        ],
      },
    },
    w4d6t5: {
      title: "Labirint boʻylab yetkazish",
      body: [
        {
          text: "Kuryer robot jonatmani bayroqchaga olib boryapti. Devorlardan oʻtib boʻlmaydi. Eng qisqa dasturni tuz.",
        },
      ],
      followUps: [
        "Nega yuqoridan yoʻl, boshida qisqaroq tuyulsa ham, uzunroq?",
        "Bayroqchadan orqaga qaytish uchun nechta buyruq kerak?",
      ],
      hints: [
        "Yana bir oʻqi: eng qisqa dastur kerak.",
        "Robotning oʻng tomonida deyarli darhol devor bor, pastga esa yoʻl ochiq.",
        "Bayroqchaga olib boradigan hamma yoʻllarni barmogʻing bilan chiz.",
        "Ikkita yoʻl bor: yuqoridan va pastdan. Har birida nechta buyruq borligini sana.",
        "Yuqoridan — 13 ta buyruq. Maydonning pastki chetiga tushadigan yoʻlni top.",
      ],
      solution: {
        answer: "↓ ↓ → → ↓ ↓ → → → ↑ ↑ — 11 ta buyruq.",
        explanation: [
          "Robot 2 katak pastga tushadi, 2 katak oʻngga yuradi, yana 2 katak pastki chetga tushadi, 3 katak oʻngga yuradi va 2 katak yuqoriga, bayroqchaga koʻtariladi.",
          "Yuqoridan yoʻl (oʻng yuqori burchak orqali) 13 ta buyruq oladi.",
        ],
        discuss: [
          "Yaxshi odat — istalgan yoʻlni topib, keyin oʻzidan «bundan qisqarogʻi yoʻqmi?» deb soʻrash. Ikki yoʻnalishni solishtirish — masalaning asosiy fikri.",
        ],
      },
    },
    w4d6t6: {
      title: "Hamma qisqa yoʻllar",
      body: [
        {
          text: "Shahar kvadrat mavzelarga boʻlingan. Robot bayroqchaga eng qisqa yoʻl bilan boradi — 4 qadam. Bunday yoʻllar bir nechta. Hammasini top!",
        },
      ],
      followUps: [
        "Bittasini ham yoʻqotmaslik uchun hamma yoʻllarni qanday tartibda yozish mumkin?",
        "Bayroqcha 3 katak oʻngda va 1 katak yuqorida boʻlsa, nechta qisqa yoʻl bor?",
      ],
      hints: [
        "Yana bir oʻqi: har bir yoʻl — roppa-rosa 4 qadam, ortiqchasiz.",
        "Bayroqcha 2 katak oʻngda va 2 katak yuqorida. Har bir qisqa dasturda ikkita «→» va ikkita «↑» bor.",
        "Takrorlamaslik uchun yoʻllarni qogʻozga yozib bor.",
        "Avval birinchi buyrugʻi «→» boʻlgan yoʻllardan boshla. Keyin — birinchisi «↑» boʻlganlari.",
        "Birinchisi «→» boʻlsa, bitta «→» va ikkita «↑» ni joylashtirish qoladi — uch usul. Birinchisi «↑» boʻlsa — yana uchta.",
      ],
      solution: {
        answer: "6 ta yoʻl: →→↑↑, →↑→↑, →↑↑→, ↑→→↑, ↑→↑→, ↑↑→→.",
        explanation: [
          "Har bir qisqa yoʻl — qandaydir tartibdagi ikkita «→» va ikkita «↑».",
          "«→» bilan boshlanadigan yoʻllar: →→↑↑, →↑→↑, →↑↑→. «↑» bilan: ↑→→↑, ↑→↑→, ↑↑→→. Jami 6.",
        ],
        discuss: [
          "Bu kombinatorika haftasiga koʻprik: birinchi qadam boʻyicha hollarga ajratib, tartib bilan saralash.",
        ],
      },
    },
    w4d6t7: {
      title: "Xona rejasi",
      body: [
        {
          text: "Kvartira rejasida bitta katak — bu 50 santimetr. Rejadagi xona — uzunligi 8 katak, eni 6 katak boʻlgan toʻgʻri toʻrtburchak.",
        },
        { label: "a)", text: "Xonaning uzunligi necha metr?" },
        { label: "b)", text: "Xonaning eni necha metr?" },
        { label: "c)", text: "Xonaning yuzasi necha kvadrat metr?" },
      ],
      answer: {
        fields: {
          length: { label: "a) uzunligi", suffix: "m" },
          width: { label: "b) eni", suffix: "m" },
          area: { label: "c) yuzasi", suffix: "kv. m" },
        },
      },
      followUps: ["2 m × 1 m gilam rejada nechta katakni egallaydi?", "Oʻz xonangning rejasini katakli qogʻozga chiz."],
      hints: [
        "Yana bir oʻqi: rejaning bitta katagi haqiqiy xonada 50 santimetr.",
        "1 metrda 100 santimetr bor, yaʼni rejaning ikkita katagi.",
        "Rejada belgilab chiq: har 2 katak — 1 metr.",
        "8 katak — bu necha marta 2 katak? 6 katak-chi?",
        "Xona yuzasi — metrlardagi uzunligi eniga koʻpaytmasi: 4 ni 3 ga.",
      ],
      solution: {
        answer: "a) 4 m; b) 3 m; c) 12 kv. m.",
        explanation: ["Ikki katak — 1 metr. 8 katak — 4 metr, 6 katak — 3 metr.", "Yuza: `4 × 3 = 12` kvadrat metr."],
        discuss: [
          "Masshtab — eng foydali «kattalar» koʻnikmalaridan biri. Xona rejasini birga chizib, ruletka bilan tekshirib koʻrish mumkin.",
        ],
      },
    },
    w4d6t8: {
      title: "Toʻrtinchi uch",
      body: [
        {
          text: "Xaritadagi uchta nuqta — kvadratning uchlari. Kvadrat qiya turibdi: uning tomonlari kataklar chizigʻi boʻylab ketmaydi.",
        },
        {
          visual: {
            cols: COLS5,
            items: [
              { cell: "B1", label: "uch" },
              { cell: "D2", label: "uch" },
              { cell: "C4", label: "uch" },
            ],
          },
        },
        { label: "a)", text: "Toʻrtinchi uch qaysi katakda?" },
        {
          label: "b)",
          text: "Agar uchlar kataklar markazida tursa, katakning tomoni esa 1 ga teng boʻlsa, kvadratning yuzasini top.",
        },
      ],
      answer: {
        fields: {
          vertex: { label: "a) toʻrtinchi uch", answer: "A3", cols: COLS5 },
          area: { label: "b) yuza" },
        },
      },
      followUps: [
        "Uchlari kataklar markazida boʻlgan yana bitta qiya kvadrat chiz. Uning yuzasi qancha?",
        "Bunday kvadratning yuzasi 2 ga teng boʻlishi mumkinmi?",
      ],
      hints: [
        "Yana bir oʻqi: kvadrat qiya turibdi, uning hamma tomonlarining «qiyaligi» bir xil.",
        "B1 dan D2 gacha — 2 katak oʻngga va 1 katak yuqoriga. Kvadratning har bir tomoni — xuddi shunday, faqat burilgan qadam.",
        "Xaritani qayta chiz va nuqtalarni tartib bilan tutashtir: B1, D2, C4.",
        "D2 dan C4 ga — 1 katak chapga va 2 katak yuqoriga. Kvadratni yopish uchun C4 dan D2 dan B1 ga borgandek qadam qilish kerak: 2 katak chapga va 1 katak pastga.",
        "b) Kvadratni kataklar chizigʻi boʻylab katta 3 × 3 kvadrat bilan oʻrab ol. Burchaklardagi toʻrtta toʻgʻri burchakli uchburchak qancha joy egallaydi?",
      ],
      solution: {
        answer: "a) A3; b) 5.",
        explanation: [
          "a) Kvadrat tomonlari: B1 dan D2 ga — 2 katak oʻngga va 1 katak yuqoriga; D2 dan C4 ga — 1 katak chapga va 2 katak yuqoriga. Keyingi tomon — 2 katak chapga va 1 katak pastga: C4 dan A3 ga. Tekshirish: A3 dan B1 ga — 1 katak oʻngga va 2 katak pastga.",
          "b) Kvadrat yuzasi 9 boʻlgan 3 × 3 kvadratga sigʻadi. Burchaklarda 4 ta uchburchak qoladi — 2 × 1 toʻgʻri toʻrtburchaklarning yarmi, har birining yuzasi 1. Qiya kvadratning yuzasi: `9 − 4 = 5`.",
        ],
        discuss: [
          "Yuqori darajadagi masala: uchlari toʻrda turgan qiya kvadrat. Qiyin boʻlsa, qogʻozdan kvadrat yasab, xaritaga qoʻyib koʻring.",
        ],
      },
    },
  },
  parent: {
    skills: [
      "Dunyo tomonlari va burilishlar boʻyicha moʻljal olish.",
      "Kataklar koordinatalarini oʻqish va yozish.",
      "Rejadagi oʻlchamlarni haqiqiy oʻlchamlarga oʻtkazish (masshtab).",
    ],
    observe: [
      "Farzandingiz xaritada «yuqori» bilan «past»ni adashtirmayaptimi? Qatorlar pastdan yuqoriga sanaladi.",
      "Yoʻllar bir nechta boʻlsa, hamma variantlarni tartib bilan izlayaptimi?",
    ],
    mistakes: [
      "Qadamlarni turgan katagidan boshlab sanash.",
      "«1 katak = 50 sm» masshtabi uzunlikka ham, enga ham taalluqli ekanini unutish.",
    ],
    question: "Uyimizdan maktabgacha (yoki doʻkongacha) qanday borish mumkin? Yoʻlni burilishlar bilan tasvirlab ber.",
  },
};
