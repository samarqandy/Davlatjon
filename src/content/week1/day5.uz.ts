/** Неделя 1, день 5 — по-узбекски (накладка на day5.ts, правила — docs/uzbek-style.md). */
import type { Uz } from "../localize";
import type { Day } from "../types";

// Буквы коробок и столбцов карты: А Б В Г Д → A B C D E (по порядку, id вариантов не меняются).
const MAP_COLS = ["A", "B", "C", "D", "E"];

export const day5Uz: Uz<Day> = {
  title: "Qadamma-qadam",
  habit: { name: "Men qadamma-qadam oʻylayman" },
  intro: [
    "Bugun sen robotlarning bosh muhandisisan 🤖.",
    "Robot faqat dasturda yozilgan ishni bajaradi — qadamma-qadam. Qani, robotlarni amallarni takrorlashga va qaror qabul qilishga oʻrgataylik!",
  ],
  tasks: {
    w1d5t1: {
      title: "Zanjir",
      body: [{ text: "Zanjirdagi amallarni birma-bir bajar:" }],
      answer: { fields: { result: { label: "Oxirida chiqadigan son" } } },
      followUps: [
        "Yonma-yon turgan amallarni birlashtirsak, javobni tezroq topsa boʻladimi? Masalan, «+8, keyin −5» — bu qaysi bitta amalga teng?",
      ],
      hints: [
        "Zanjirni yana bir bor oʻqib chiq. Qaysi sondan boshlaymiz?",
        "Har bir oʻqcha — bitta amal. Ularni navbatma-navbat bajar.",
        "Har bir amaldan keyin chiqqan sonni boʻsh katakchaga yozib bor.",
        "Birinchi qadam: `7 + 8 = ?`",
        "Osonroq yoʻli ham bor: «+8, keyin −5» — bu xuddi «+3» degani.",
      ],
      solution: {
        discuss: [
          "Qisqa yoʻl: «+8 −5» = «+3», «+20 −10» = «+10», demak, `7 + 3 + 10 = 20`. Qadamlarni birlashtirish — bu algoritmni optimallashtirishning xuddi oʻzi.",
        ],
      },
    },
    w1d5t2: {
      title: "Teskari zanjir",
      body: [
        { text: "Davlatjon bir son oʻyladi. Unga 6 ni qoʻshdi, keyin 10 ni ayirdi — 15 chiqdi." },
        null,
        { text: "U qaysi sonni oʻylagan?" },
      ],
      answer: { fields: { x: { label: "Oʻylangan son" } } },
      followUps: ["Javobingni qanday tekshirasan?"],
      hints: [
        "Yana bir oʻqib chiq. Son bilan avval nima qilindi, keyin-chi?",
        "Aniq bilganimiz: oxirida 15 chiqdi. Eng oxirgi amal qaysi edi?",
        "Zanjirni chizib ol: `? → +6 → −10 → 15`. Endi uni oʻngdan chapga qarab yurib chiq.",
        "10 ni ayirishdan oldin qaysi son bor edi?",
        "Orqaga yurish uchun har bir amalni teskarisiga almashtiramiz: «−10» oʻrniga «+10», «+6» oʻrniga esa «−6».",
      ],
      solution: {
        explanation: [
          "Orqaga qarab yuramiz: `15 + 10 = 25`, `25 − 6 = 19`.",
          "Tekshiramiz: `19 + 6 = 25`, `25 − 10 = 15` ✓.",
        ],
        discuss: ["Teskari yoʻl — natijadan boshiga qarab yurish — matematikada ham, dasturlashda ham kuchli usul."],
      },
    },
    w1d5t3: {
      title: "Takrorla!",
      body: [
        {
          text: "Uzun dasturlarni qisqaroq yozsa ham boʻladi. `→ → →` oʻrniga `3→` deb yoziladi. Agar dasturning butun bir boʻlagi takrorlansa, «Takrorla» deb yoziladi.",
        },
        { text: "Masalan, `→ → ↑ → → ↑` dasturi — bu «2 marta takrorla: (2→ 1↑)»." },
        { label: "a)", text: "Bu dasturni qisqa qilib yoz: `→ → → ↑ ↑ → → → ↑ ↑`" },
        {
          label: "b)",
          text: "Robot «3 marta takrorla: (2→ 1↑)» dasturini bajardi. U oʻngga necha katak va yuqoriga necha katak siljidi?",
        },
      ],
      answer: {
        fields: {
          right: { label: "b) oʻngga necha katak" },
          up: { label: "b) yuqoriga necha katak" },
        },
      },
      followUps: ["Oʻzing uzun bir dastur oʻylab top va uni «Takrorla» yordamida qisqa qilib yoz."],
      hints: [
        "Yana bir oʻqib chiq: «3 marta takrorla» degani nima?",
        "Qavs ichida nima yozilgan? Robot shu buyruqlarni ketma-ket bir necha marta bajaradi.",
        "b) savoldagi dasturni «Takrorla» soʻzisiz, toʻliq yozib chiq: `→ → ↑ → → ↑ …`",
        "Bir marta takrorlashda robot oʻngga necha katak yuradi? Yuqoriga-chi?",
        "Har bir takrorlashda robot bir xil siljiydi. Bitta takrorlashdagi siljishni takrorlashlar soni necha boʻlsa, shuncha marta qoʻsh.",
      ],
      solution: {
        answer: "a) 2 marta takrorla: (3→ 2↑); b) oʻngga 6 katak va yuqoriga 3 katak.",
        explanation: [
          "a) Dastur ikkita bir xil boʻlakdan iborat: `→ → → ↑ ↑`. Uni shunday ham yozsa boʻladi: 3→ 2↑ 3→ 2↑.",
          "b) Toʻliq yozsak: →→↑ →→↑ →→↑ — bu oʻngga 6 qadam va yuqoriga 3 qadam.",
        ],
        discuss: [
          "«Takrorla» — bu sikl, dasturlashning eng muhim gʻoyalaridan biri. «Sikl» soʻzini bilish shart emas — takrorlanayotgan boʻlakni koʻra olish muhim.",
        ],
      },
    },
    w1d5t4: {
      title: "Saralovchi mashina",
      body: [
        {
          text: "Saralovchi mashina har bir songa ikkita savol beradi va javoblarga qarab uni toʻrtta qutidan biriga joʻnatadi.",
        },
        { visual: { first: "Son 20 dan kattami?", second: "Son juftmi?", boxes: ["A", "B", "C", "D"] } },
        { text: "Juft sonlar: 2, 4, 6, 8, 10, 12, … Ular 0, 2, 4, 6 yoki 8 bilan tugaydi." },
        { label: "a)", text: "14, 27, 8, 35, 19 sonlarining har biri qaysi qutiga tushadi?" },
        { label: "b)", text: "Bitta quti boʻsh qoldi. Unga tushadigan biror son oʻylab top." },
      ],
      answer: {
        prompt: "a) Har bir son qaysi qutiga tushadi?",
        options: { A: { label: "A" }, B: { label: "B" }, V: { label: "C" }, G: { label: "D" } },
      },
      followUps: [
        "Agar mashina savollarni boshqa tartibda bersa — avval «juftmi?», keyin «20 dan kattami?» — biror narsa oʻzgaradimi?",
      ],
      hints: [
        "Yana bir oʻqib chiq: mashina qaysi ikkita savolni beradi?",
        "Qaysi sonlar 20 dan katta? Qaysilari juft?",
        "Har bir sonning yoʻlini chizmada barmogʻing bilan kuzatib chiq: avval birinchi savol, keyin ikkinchisi.",
        "14 dan boshla: u 20 dan kattami? Juftmi? Qaysi qutiga tushadi?",
        "Boʻsh quti — hech qaysi son tushmagan quti. Son oʻsha qutiga tushishi uchun ikkala savolga qanday javob boʻlishi kerak?",
      ],
      solution: {
        answer:
          "14 va 8 → C; 27 va 35 → B; 19 → D. A quti boʻsh: unga 20 dan katta istalgan juft son tushadi, masalan, 22 yoki 40.",
        explanation: [
          "14: 20 dan kattami? Yoʻq. Juftmi? Ha → C.",
          "27: ha, yoʻq → B. 8: yoʻq, ha → C. 35: ha, yoʻq → B. 19: yoʻq, yoʻq → D.",
        ],
        discuss: [
          "Bunday chizma «qarorlar daraxti» deb ataladi. Koʻplab dasturlar, hatto sunʼiy intellektning oddiy tizimlari ham shunday ishlaydi: ular narsaning belgilari haqida savol beradi va javoblarga qarab uni biror guruhga qoʻshadi. Savollarning oʻrni almashtirilsa, sonlar guruhlari oʻzgarmaydi — faqat har bir guruh nechanchi qutiga tushishi oʻzgaradi.",
        ],
      },
    },
    w1d5t5: {
      title: "Sakrovchi qator",
      body: [{ text: "Qoidani top va qatorni davom ettir:" }],
      answer: { fields: { n7: { label: "7-son" }, n8: { label: "8-son" } } },
      followUps: [
        "Bu qatorda yana bir sir yashiringan: sonlarni ikkitadan qoʻshib koʻr (`10 + 1`, `9 + 2`, …). Nimani payqading?",
      ],
      hints: [
        "Qatorga yana bir qara. U «sakraydi»: goh katta son, goh kichik.",
        "Nimani payqayapsan? Balki bu yerda ikkita qator xuddi soch oʻrimidek oʻrilib ketgandir?",
        "Sonlarni navbatma-navbat ikki xil rangga boʻyab chiq.",
        "Kichikroq masalani yech: 1-, 3- va 5-oʻrindagi sonlarni alohida yozib ol. Ular qanday oʻzgaryapti?",
        "Endi 2-, 4- va 6-oʻrindagi sonlarga qara. Ikkala qatorning har birida keyin qaysi son keladi?",
      ],
      solution: {
        answer: "7 va 4.",
        explanation: [
          "Toq oʻrinlarda: 10, 9, 8, 7 — har safar 1 ga kamayadi.",
          "Juft oʻrinlarda: 1, 2, 3, 4 — har safar 1 ga ortadi.",
          "Ikkinchi sir: har bir juftlikda yigʻindi 11 ga teng (`10 + 1`, `9 + 2`, `8 + 3`, `7 + 4`).",
        ],
        discuss: [
          "Bitta qonuniyatni turlicha koʻrish mumkin. Farzandingizdan qaysi usul unga yaqinroq ekanini soʻrang.",
        ],
      },
    },
    w1d5t6: {
      title: "Xazina xaritasi",
      body: [
        {
          text: "Bu — orol xaritasi 🏝️. Har bir katakning nomi ustun harfi va qator raqamidan iborat — masalan, A4.",
        },
        {
          visual: {
            cols: MAP_COLS,
            items: [
              { cell: "C5", label: "palma" },
              { cell: "D1", label: "tosh" },
              { cell: "A4", label: "bosh suyagi" },
              { cell: "E4", label: "toʻtiqush" },
              { cell: "B2", label: "qaroqchi" },
            ],
          },
        },
        {
          label: "a)",
          text: "Xazina palma 🌴 bilan bir ustunda, tosh 🪨 bilan esa bir qatorda joylashgan katakka koʻmilgan. Xazina qaysi katakda?",
        },
        {
          label: "b)",
          text: "Qaroqchi 🏴‍☠️ B2 katakda turibdi. U oʻngga 3 katak, keyin yuqoriga 2 katak yurdi. U qaysi katakka borib qoldi? U yerda kimni uchratdi?",
        },
      ],
      answer: {
        fields: {
          treasure: { label: "a) xazina qaysi katakda?", answer: "C1", cols: MAP_COLS },
          pirate: { label: "b) qaroqchi qaysi katakka keldi?", answer: "E4", cols: MAP_COLS },
        },
      },
      followUps: ["Oying yoki dadang uchun xazina haqida oʻz topishmogʻingni oʻylab top."],
      hints: [
        "Yana bir oʻqib chiq: kataklar qanday nomlanadi? Avval ustun harfi, keyin qator raqami.",
        "Palmani top: u qaysi ustunda? Toshni top: u qaysi qatorda?",
        "Bir barmogʻingni palmadan pastga, ikkinchisini toshdan yon tomonga yurgiz. Barmoqlaring qayerda uchrashadi?",
        "Qaroqchi uchun: avval B2 dan oʻngga faqat 3 qadam yur. U endi qayerda?",
        "Xazinaning ustuni — palmaniki bilan bir xil, qatori — toshniki bilan bir xil. Harf bilan raqamni birlashtir.",
      ],
      solution: {
        answer: "a) C1; b) E4 — u yerda toʻtiqush 🦜.",
        explanation: [
          "Palma C ustunda, tosh 1-qatorda — demak, xazina C1 katakda.",
          "B2 dan oʻngga uch katak: C2, D2, E2. Keyin yuqoriga ikki katak: E3, E4. E4 katakda — toʻtiqush.",
        ],
        discuss: ["Koordinatalar — xaritalar, «Dengiz jangi» oʻyini, shaxmat va kompyuter grafikasining asosi."],
      },
    },
    w1d5t7: {
      title: "Tezyurar poyezd",
      body: [
        {
          text: "Tezyurar poyezd 🚄 Samarqanddan soat 8:00 da joʻnaydi va Toshkentgacha 2 soat 10 daqiqa yuradi.",
        },
        { label: "a)", text: "Poyezd Toshkentga soat nechada yetib keladi?" },
        {
          label: "b)",
          text: "Qaytish poyezdi Toshkentdan soat 18:40 da joʻnaydi va shuncha vaqt yuradi. U Samarqandga soat nechada yetib boradi?",
        },
      ],
      answer: {
        fields: {
          tashkent: { label: "a) Toshkentga yetib kelish vaqti" },
          samarkand: { label: "b) Samarqandga yetib kelish vaqti" },
        },
      },
      followUps: ["Agar poyezd 15 daqiqa kechiksa, Toshkentga soat nechada yetib keladi?"],
      hints: [
        "Yana bir oʻqib chiq: poyezd soat nechada joʻnaydi va qancha vaqt yuradi?",
        "2 soat 10 daqiqa — bu avval 2 soat, keyin yana 10 daqiqa.",
        "Soat chizib ol: soat milini 2 soat oldinga, minut milini esa 10 daqiqa oldinga sur.",
        "8:00 ga faqat 2 soat qoʻshsang, soat necha boʻladi?",
        "Qaytish poyezdi uchun: 18:40 ga avval 2 soat, keyin yana 10 daqiqa qoʻsh.",
      ],
      solution: {
        answer: "a) 10:10; b) 20:50.",
        explanation: [
          "8:00 + 2 soat = 10:00, yana 10 daqiqa — 10:10.",
          "18:40 + 2 soat = 20:40, yana 10 daqiqa — 20:50.",
        ],
        discuss: [
          "Agar poyezd 15 daqiqa kechiksa, 10:25 da yetib keladi. Poyezdlar jadvali ham algoritm: amallar maʼlum tartibda, qadamma-qadam bajariladi.",
        ],
      },
    },
    w1d5t8: {
      title: "Ustundagi shilliqqurt",
      body: [
        {
          text: "Shilliqqurt 🐌 balandligi 6 metr boʻlgan ustun boʻylab yuqoriga oʻrmalayapti. Kunduzi u 3 metr koʻtariladi, kechasi esa 2 metr pastga sirpanib tushadi.",
        },
        null,
        { text: "Shilliqqurt nechanchi kuni ustunning uchiga chiqib oladi?" },
      ],
      answer: { fields: { day: { label: "Nechanchi kuni?", suffix: "-kuni" } } },
      followUps: ["Ustunning balandligi 10 metr boʻlsa-chi?"],
      hints: [
        "Yana bir oʻqib chiq: shilliqqurt kunduzi qancha koʻtariladi, kechasi qancha pastga tushadi?",
        "Eng boshida shilliqqurt qayerda? Birinchi kuni kechqurun qayerda boʻladi? Ikkinchi kuni ertalab-chi?",
        "0, 1, 2, 3, 4, 5, 6 belgilari bor ustun chiz va shilliqqurtning yoʻlini kunma-kun chizib bor.",
        "Jadval tuz: 1-kun — kechqurun 3 metr balandlikda, ertalabga borib 1 metrda. 2-kun — …",
        "Ehtiyot boʻl: agar shilliqqurt kunduzi tepaga chiqib olsa, u allaqachon manzilda — kechasini hisoblamasang ham boʻladi!",
      ],
      solution: {
        answer: "4-kuni.",
        explanation: [
          "1-kun: 0 → 3 m, kechasi → 1 m.",
          "2-kun: 1 → 4 m, kechasi → 2 m.",
          "3-kun: 2 → 5 m, kechasi → 3 m.",
          "4-kun: 3 → 6 m — shilliqqurt ustunning uchida!",
        ],
        discuss: [
          "Koʻp uchraydigan «6 kun» degan javob (bir kecha-kunduzda shilliqqurt 1 metr koʻtariladi, deb hisoblash) — xato: oxirgi kuni shilliqqurt tepaga kunduzi yetib boradi va endi pastga tushmaydi. 10 metrli ustun uchun javob — 8-kun. «Qadamma-qadam» jadvali — bu dasturlashdagi kabi holatni kuzatib borish.",
        ],
      },
    },
  },
  parent: {
    skills: [
      "Algoritmlar: amallar ketma-ketligi, takrorlash (sikl), «agar… boʻlsa, unda…» sharti.",
      "Teskari yoʻl — natijadan boshiga qarab.",
      "Holatni qadamma-qadam kuzatib borish (shilliqqurt).",
      "Koordinatalar.",
    ],
    observe: [
      "Farzandingiz qadamlarni yozib boradimi (jadval, rasm) yoki hammasini xayolida saqlashga urinadimi.",
      "«Takrorla» yangi buyruq emas, balki qisqa yozuv ekanini tushunadimi.",
    ],
    mistakes: [
      "Shilliqqurt haqidagi masalada — «6 kun» deb javob berish.",
      "Koordinatalarda — ustun bilan qatorni adashtirish (masalan, «C1» oʻrniga «1C» deyish).",
    ],
    question:
      "Hayotda odamlar yana qayerda «agar… boʻlsa, unda…» qoidasidan foydalanadi? Masalan: agar yomgʻir yogʻayotgan boʻlsa, soyabon olamiz.",
  },
};
