/** Hafta 4, 5-kun — oʻzbekcha (day5.ts ustiga qoplama, qoidalar — docs/uzbek-style.md). */
import type { Uz } from "../localize";
import type { Day } from "../types";

export const day5Uz: Uz<Day> = {
  title: "Kubiklar va koʻrinishlar",
  habit: { name: "Men turli tomondan qarayman" },
  intro: [
    "Bugun kubiklardan quramiz 🧊. Bitta qurilmani tepadan, oldidan va yonidan koʻrish mumkin — va har safar u boshqacha koʻrinadi.",
    "Muhim qoida: kubiklar havoda osilib turmaydi. Agar tepada kubik koʻrinsa, uning ostida albatta boshqa kubiklar turibdi.",
  ],
  tasks: {
    w4d5t1: {
      title: "Kubiklardan zinapoya",
      body: [{ text: "Bu zinapoyada nechta kubik bor?" }],
      answer: { fields: { cubes: { label: "Kubiklar" } } },
      followUps: [
        "5 pogʻonali zinapoya uchun nechta kubik kerak?",
        "3 × 3 toʻgʻri toʻrtburchak hosil boʻlishi uchun yana nechta kubik qoʻshish kerak?",
      ],
      hints: [
        "Yana bir oʻqi: kubiklar havoda osilib turmaydi.",
        "Zinapoyada balandligi har xil uchta ustuncha bor.",
        "Har bir ustunchadagi kubiklarni alohida sana.",
        "Birinchi ustunchada 1 ta kubik, ikkinchisida — 2 ta. Uchinchisida-chi?",
        "Uchta ustunchaning kubiklarini qoʻsh: `1 + 2 + 3`.",
      ],
      solution: {
        answer: "6 ta kubik.",
        explanation: ["1, 2 va 3 ta kubikli ustunchalar: `1 + 2 + 3 = 6`."],
        discuss: ["Ustunchalar boʻyicha sanash — bugungi kunning asosiy usuli."],
      },
    },
    w4d5t2: {
      title: "Ikkita qurilma",
      body: [
        { text: "Har bir qurilmada nechta kubik bor? Esingda boʻlsin: kubiklar havoda osilib turmaydi." },
        { label: "a)" },
        { label: "b)" },
      ],
      answer: {
        fields: {
          a: { label: "a) kubiklar" },
          b: { label: "b) kubiklar" },
        },
      },
      followUps: [
        "b) da qaysi kubiklar rasmda koʻrinmaydi?",
        "3 × 3 × 3 kub hosil boʻlishi uchun a) ga yana nechta kubik qoʻshish kerak?",
      ],
      hints: [
        "Yana bir oʻqi: kubiklar havoda osilib turmaydi — tepadagi kubiklar ostida boshqalari bor.",
        "a) da balandligi bir xil toʻrtta ustuncha bor.",
        "Tepadan koʻrinishni chiz va har bir katakka shu ustunchada nechta kubik borligini yoz.",
        "a) da har bir ustuncha — 2 ta kubik, ustunchalar 4 ta. b) da orqa qator — 3, 2 va 1 ta kubikli ustunchalar.",
        "b) Old qator — 2 va 1 ta kubikli ustunchalar, uchinchi katakda esa hech narsa yoʻq. Hamma ustunchalarni qoʻsh.",
      ],
      solution: {
        answer: "a) 8; b) 9.",
        explanation: [
          "a) 2 tadan kubikli toʻrtta ustuncha: `4 × 2 = 8`.",
          "b) Orqa qator: `3 + 2 + 1 = 6`, old qator: `2 + 1 = 3`. Jami `6 + 3 = 9`.",
        ],
        discuss: [
          "Rasmdagi baʼzi kubiklar boshqalarining orqasida yashiringan. «Sonli reja» usuli (har bir katakda nechta kubik) ularni yoʻqotmaslikka yordam beradi.",
        ],
      },
    },
    w4d5t3: {
      title: "Tepadan koʻrinish",
      body: [
        {
          text: "Mana kubiklardan qurilma. Tepadan qaralsa, u qanday koʻrinadi? Rasmdagi orqa qator — tepadan koʻrinishdagi yuqori qator.",
        },
      ],
      answer: {
        prompt: "Tepadan koʻrinish qaysi?",
        options: {
          right: { label: "A" },
          full: { label: "B" },
          mirror: { label: "C" },
          wide: { label: "D" },
        },
      },
      followUps: ["Bu qurilmada nechta kubik bor?", "Tepadan qaraganda ustunchalar balandligi koʻrinadimi?"],
      hints: [
        "Yana bir oʻqi: tepadan faqat qaysi kataklarda kubik turgani koʻrinadi, ustunchalar balandligi emas.",
        "Qurilma — 3 katakdan 2 qator. Baʼzi kataklarda kubik yoʻq.",
        "3 katakdan 2 qator chiz va hech boʻlmaganda bitta kubik turgan kataklarni boʻya.",
        "Orqa qatordagi boʻsh katakni top. Old qatordagisini-chi?",
        "Orqa qatorda oʻrtasi boʻsh, old qatorda — oʻng tomoni.",
      ],
      solution: {
        answer: "A koʻrinish.",
        explanation: [
          "Orqa qatorda kubiklar chap va oʻng kataklarda turibdi, oʻrtadagisi boʻsh.",
          "Old qatorda kubiklar chap va oʻrta kataklarda, oʻngdagisi boʻsh. A koʻrinish aynan shunday.",
        ],
        discuss: [
          "Tepadan koʻrinishda balandlik yoʻqoladi: unga qarab ustunchada nechta kubik borligini aytib boʻlmaydi. Shuning uchun sonli reja qulayroq.",
        ],
      },
    },
    w4d5t4: {
      title: "Pogʻonali piramida",
      body: [
        {
          text: "Piramida qavatma-qavat quriladi. 3 qavatli piramidaning pastki qavati — 5 × 5 kubikli kvadrat, oʻrtadagisi — 3 × 3, yuqorigisi — bitta kubik. 2 qavatli piramidaning qavatlari — 3 × 3 va 1 × 1.",
        },
        null,
        { label: "a)", text: "3 qavatli piramidada nechta kubik bor?" },
        { label: "b)", text: "4 qavatli piramidada nechta kubik bor?" },
      ],
      answer: {
        fields: {
          three: { label: "a) kubiklar" },
          four: { label: "b) kubiklar" },
        },
      },
      followUps: [
        "2 qavatli piramidada nechta kubik bor? 1 qavatlisida-chi?",
        "5 qavatli piramidaning pastki qavati qanday oʻlchamda boʻladi?",
      ],
      hints: [
        "Piramidaning qavatlari qanday ekanini yana bir oʻqi: har bir keyingi qavat har tomondan bir qatorga kichik.",
        "Qavatlar — 1 × 1, 3 × 3, 5 × 5 kvadratlar. Keyingi kvadrat qanday boʻladi?",
        "Piramida qavatlarini katakli rejalar kabi alohida-alohida chiz.",
        "Har bir qavatning kubiklarini sana: 1, 9, 25 — va qoʻsh.",
        "4 qavatli piramidada 7 × 7 pastki qavat paydo boʻladi. Unda nechta kubik bor?",
      ],
      solution: {
        answer: "a) 35; b) 84.",
        explanation: ["a) `25 + 9 + 1 = 35` ta kubik.", "b) Yangi pastki qavat — 7 × 7 = 49 ta kubik: `49 + 35 = 84`."],
        discuss: [
          "Qavatlar — toq sonlarning kvadratlari: 1, 9, 25, 49. Yaxshi savol: «Keyin qaysi qavat qoʻshiladi va unda nechta kubik boʻladi?»",
        ],
      },
    },
    w4d5t5: {
      title: "Reja boʻyicha oldidan koʻrinish",
      body: [
        {
          text: "Qurilmani reja bilan yozib qoʻyishdi: katakdagi son — shu joyda nechta kubik turgani. Rejaning yuqori qatori — orqa qator, pastkisi — old qator.",
        },
        {
          visual: {
            head: ["Qator", "Chap ustun", "Oʻrta", "Oʻng"],
            rows: [
              ["orqa", "1", "2", "0"],
              ["oʻrta", "3", "1", "2"],
              ["old", "1", "0", "1"],
            ],
          },
        },
        {
          text: "Oldidan nechta kvadratcha koʻrinishini qanday topish mumkin: rejaning har bir ustunidan eng katta sonni tanla — bu oldidan koʻrinadigan balandlik. Keyin qoʻsh.",
        },
        { label: "a)", text: "Qurilmada hammasi boʻlib nechta kubik bor?" },
        { label: "b)", text: "Oldidan qaralsa, nechta kvadratcha koʻrinadi?" },
        { label: "c)", text: "Chapdan qaralsa-chi?" },
      ],
      answer: {
        fields: {
          total: { label: "a) kubiklar" },
          front: { label: "b) oldidan kvadratchalar" },
          left: { label: "c) chapdan kvadratchalar" },
        },
      },
      followUps: [
        "Nega oldidan koʻrinish qurilmadagi kubiklardan kamroq kvadratchadan iborat?",
        "Oldidan koʻrinish oʻzgarmaydigan qilib bitta kubikni olib tashla.",
      ],
      hints: [
        "Qoidani yana bir oʻqi: oldidan har bir ustunda eng baland ustuncha koʻrinadi.",
        "Rejada 3 ta ustun va 3 ta qator bor. b) uchun ustunlar, c) uchun qatorlar kerak.",
        "Rejaning har bir ustunidagi sonlarni alohida yozib chiq: chap ustun — 1, 3, 1.",
        "Ustunlardagi eng katta sonlar: 3, 2 va 2. Chapdan qatorlar boʻylab qaraymiz — har bir qatordagi eng katta sonni top.",
        "Qatorlardagi eng katta sonlar: 2, 3 va 1. Ularni qoʻsh.",
      ],
      solution: {
        answer: "a) 11; b) 7; c) 6.",
        explanation: [
          "a) Rejadagi hamma sonlar yigʻindisi: `1 + 2 + 0 + 3 + 1 + 2 + 1 + 0 + 1 = 11`.",
          "b) Ustunlardagi eng baland ustunchalar: 3, 2 va 2 — oldidan `3 + 2 + 2 = 7` ta kvadratcha koʻrinadi.",
          "c) Chapdan har bir qatordagi eng baland ustuncha koʻrinadi: 2, 3 va 1 — jami 6.",
        ],
        discuss: [
          "Bu haqiqiy algoritm: har bir ustun uchun eng kattasini topish, keyin qoʻshish. Muhandislarning «oldidan koʻrinish», «yonidan koʻrinish» chizmalari shunday tuzilgan.",
        ],
      },
    },
    w4d5t6: {
      title: "Qarshisida nima?",
      body: [
        { text: "Bu yoyilmadan kubik yasashdi. Qaysi yoqlar bir-birining qarshisida boʻladi?" },
        { visual: { labels: ["A", "B", "C", "D", "E", "F"] } },
      ],
      answer: {
        prompt: "Qaysi yoq qarshisida?",
        items: {
          a: { label: "A yoqning qarshisida" },
          b: { label: "B yoqning qarshisida" },
          v: { label: "C yoqning qarshisida" },
        },
        options: {
          A: { label: "A" },
          B: { label: "B" },
          V: { label: "C" },
          G: { label: "D" },
          D: { label: "E" },
          E: { label: "F" },
        },
      },
      followUps: [
        "Tekshir: yoyilmani qogʻozga chiz, qirqib ol va kubik yasa.",
        "Yoyilmada yonma-yon turgan yoq kubikda uning qarshisida boʻlishi mumkinmi?",
      ],
      hints: [
        "Yana bir oʻqi: kubikning qarama-qarshi yoqlari hech qachon bir-biriga tegmaydi.",
        "Yoyilmada A, C, E, F toʻrtta yoqdan iborat ustuncha va C ning ikki yonida B va D yoqlar bor.",
        "Yoyilmani chiz, qirqib ol va bukla — tekshirishning eng yaxshi usuli.",
        "Toʻrt yoqli ustuncha «quvur» boʻlib oʻraladi: bittadan oʻtgan yoqlar qarama-qarshi boʻlib qoladi.",
        "A, C, E, F «quvur»ida A bilan E, C bilan F qarama-qarshi. Yon tomondagi B va D quvurni ikki uchidan yopadi.",
      ],
      solution: {
        answer: "A ning qarshisida — E, B ning qarshisida — D, C ning qarshisida — F.",
        explanation: [
          "A, C, E, F ustunchasi halqa boʻlib oʻraladi. Toʻrt yoqli halqada bittadan oʻtgan yoqlar qarama-qarshi turadi: A va E, C va F.",
          "B va D C ga ikki tomondan yopishgan va halqani uchlaridan yopadi — ular bir-birining qarshisida.",
        ],
        discuss: [
          "Yoyilmalar uchun qulay qoida: qatorda orasida roppa-rosa bitta yoq turgan ikki yoq qarama-qarshi boʻladi.",
        ],
      },
    },
    w4d5t7: {
      title: "Boʻyalgan kubik",
      body: [
        {
          text: "3 × 3 × 3 katta kubikni 27 ta kichik kubikdan yopishtirib, hamma tomondan tashqarisini boʻyashdi. Keyin uni yana kichik kubiklarga ajratishdi.",
        },
        { label: "a)", text: "Nechta kichik kubikning 3 ta yogʻi boʻyalgan?" },
        { label: "b)", text: "Nechtasining — 2 ta yogʻi?" },
        { label: "c)", text: "Nechtasining — 1 ta yogʻi?" },
        { label: "d)", text: "Nechta kubikning bitta ham yogʻi boʻyalmagan?" },
      ],
      answer: {
        fields: {
          three: { label: "a) uchta yogʻi" },
          two: { label: "b) ikkita yogʻi" },
          one: { label: "c) bitta yogʻi" },
          none: { label: "d) bittasi ham" },
        },
      },
      followUps: [
        "Toʻrtta javobni qoʻsh. Nega 27 chiqdi?",
        "Kubik 4 × 4 × 4 boʻlsa-chi — nechta kubik boʻyalmay qoladi?",
      ],
      hints: [
        "Yana bir oʻqi: faqat katta kubikning tashqarisi boʻyalgan.",
        "Kubikning 8 ta uchi, 12 ta qirrasi va 6 ta yogʻi bor.",
        "Katta kubikning bitta yogʻini — 3 × 3 kvadratni chiz va burchakdagi, qirradagi va oʻrtadagi kubiklar qayerda turganini belgila.",
        "Uchta boʻyalgan yoq — katta kubik uchlaridagi kubiklarda. Ikkita — qirralarning oʻrtasidagilarda. Bitta — har bir yoqning markazidagisida.",
        "Bitta kubik roppa-rosa oʻrtada yashiringan — boʻyoq unga yetib bormagan.",
      ],
      solution: {
        answer: "a) 8; b) 12; c) 6; d) 1.",
        explanation: [
          "a) Uchta yogʻi burchakdagi kubiklarda boʻyalgan — 8 ta uchning har birida bittadan.",
          "b) Ikkita yogʻi qirralarning oʻrtasidagi kubiklarda: qirralar 12 ta, har birida bittadan shunday kubik.",
          "c) Bitta yogʻi 6 ta yoqning har birining markazidagi kubikda.",
          "d) Roppa-rosa oʻrtadagi bitta kubik tashqaridan koʻrinmaydi. Tekshirish: `8 + 12 + 6 + 1 = 27`.",
        ],
        discuss: ["Fazoviy tasavvurga doir mashhur masala. Rubik kubigi — ajoyib koʻrgazmali qurol."],
      },
    },
    w4d5t8: {
      title: "Eng kam kubik",
      body: [
        {
          text: "Qurilma uchtadan katakli ikki qatorli maydonda turibdi. Oldidan uchta ustuncha koʻrinadi: balandligi 2, 1 va 3 (chapdan oʻngga). Chapdan ikkita ustuncha koʻrinadi: orqa qatorniki 3, old qatorniki — 2.",
        },
        { label: "a)", text: "Qurilmada eng kamida nechta kubik boʻlishi mumkin?" },
        { label: "b)", text: "Eng koʻpi bilan-chi?" },
      ],
      answer: {
        fields: {
          min: { label: "a) eng kami" },
          max: { label: "b) eng koʻpi" },
        },
      },
      followUps: [
        "6 ta kubikli qurilma uchun sonli reja chiz.",
        "Bunday qurilmada kubiklar soni nechta har xil son boʻlishi mumkin?",
      ],
      hints: [
        "Yana bir oʻqi: oldidan har bir ustunda eng baland ustuncha, chapdan esa har bir qatordagi eng balandi koʻrinadi.",
        "Reja kerak: 2 qator × 3 ustun. Ustunlardagi eng katta sonlar — 2, 1, 3; qatorlardagi — 3 (orqa) va 2 (old).",
        "Boʻsh reja chiz va sonlarni joylashtirib koʻr.",
        "Eng kami uchun: 3 balandlikdagi ustuncha oʻng ustunda va orqa qatorda turishi kerak — u ikkala koʻrinishga birdaniga mos keladi. Qaysi ustuncha ham «oldidan chapda 2», ham «chapdan old qatorda 2» ni beradi?",
        "Eng koʻpi uchun: har bir katakka koʻrinishlarni buzmaydigan eng baland ustunchani qoʻy — oʻz ustuni va oʻz qatori uchun sonlarning kichigini.",
      ],
      solution: {
        answer: "a) 6; b) 11.",
        explanation: [
          "a) 3 lik ustuncha — orqa qatorda oʻngda: u ham «oldidan oʻngda 3» ni, ham «chapdan orqa qatorda 3» ni beradi. 2 lik ustuncha — old qatorda chapda: u «oldidan chapda 2» ni va «chapdan old qatorda 2» ni beradi. Yana oʻrta ustunda 1 lik ustuncha kerak. Jami `3 + 2 + 1 = 6`. Bundan kam boʻlmaydi: uchta ustunning har birida oʻzining eng baland ustunchasi turishi kerak, bu esa allaqachon `2 + 1 + 3 = 6` ta kubik.",
          "b) Har bir katakka ikkita sonning kichigini qoʻyamiz — ustun uchun va qator uchun. Orqa qator: 2, 1, 3; old qator: 2, 1, 2. Jami `6 + 5 = 11`.",
        ],
        discuss: [
          "Chiroyli masala: ikkita koʻrinish boʻyicha qurilmani bir xil tiklab boʻlmaydi — kubiklar 6 tadan 11 tagacha boʻlishi mumkin. Shuning uchun muhandislar chizmasida odatda uchta koʻrinish boʻladi.",
        ],
      },
    },
  },
  parent: {
    skills: [
      "Qurilmadagi kubiklarni, jumladan koʻrinmaydiganlarini ham sanash.",
      "Qurilmadan tepadan, oldidan va yonidan koʻrinishga oʻtish va aksincha.",
      "Yoyilma qanday qilib kubikka buklanishini tasavvur qilish.",
    ],
    observe: [
      "Farzandingiz boshqalari ortida yashiringan kubiklarni hisobga olyaptimi?",
      "Qurilma murakkab boʻlsa, sonli rejadan foydalanyaptimi?",
    ],
    mistakes: ["Faqat koʻrinib turgan kubiklarni sanash.", "Oldidan koʻrinishni yonidan koʻrinish bilan adashtirish."],
    question: "Sevimli oʻyinchogʻing tepadan qaralsa, qanday koʻrinadi?",
  },
};
