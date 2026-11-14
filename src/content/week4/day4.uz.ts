/** Hafta 4, 4-kun — oʻzbekcha (day4.ts ustiga qoplama, qoidalar — docs/uzbek-style.md). */
import type { Uz } from "../localize";
import type { Day } from "../types";

export const day4Uz: Uz<Day> = {
  title: "Perimetr va yuza",
  habit: { name: "Men oʻlchayman" },
  intro: [
    "Har bir shaklning ikkita muhim soni bor. **Perimetr** — uning chegarasi uzunligi: chumoli shaklni cheti boʻylab aylanib chiqsa, necha qadam yuradi. **Yuza** — shakl qancha joy egallashi: ichida nechta katak bor.",
    "Bugun bu sonlar alohida yashashini bilib olamiz: yuzasi bir xil shakllarning perimetrlari butunlay har xil boʻlishi mumkin.",
  ],
  tasks: {
    w4d4t1: {
      title: "Cheti boʻylab aylanib chiq",
      body: [
        {
          text: "Chumoli toʻgʻri toʻrtburchakni cheti boʻylab aylanib chiqadi. Bitta katakning tomoni — bir qadam. Aylanib chiqishdagi qadamlar soni — bu perimetr.",
        },
        { label: "a)" },
        { label: "b)" },
        { label: "c)" },
      ],
      answer: {
        fields: {
          a: { label: "a) perimetr" },
          b: { label: "b) perimetr" },
          c: { label: "c) perimetr" },
        },
      },
      followUps: [
        "Toʻgʻri toʻrtburchak perimetrini katakma-katak aylanmasdan qanday topish mumkin?",
        "Qaysi toʻgʻri toʻrtburchakning perimetri 8 ga teng?",
      ],
      hints: [
        "Yana bir oʻqi: ichidagi kataklarni emas, shakl cheti boʻylab qadamlarni sanaymiz.",
        "Toʻgʻri toʻrtburchakning ikkita uzun va ikkita qisqa tomoni bor.",
        "Shakl chegarasini barmogʻing bilan aylanib chiq va har bir qadamni ovoz chiqarib sana.",
        "a) da uzun tomoni — 3 qadam, qisqasi — 2. Toʻgʻri toʻrtburchakning nechta tomoni bor?",
        "Toʻrtala tomonni qoʻsh: `3 + 2 + 3 + 2`.",
      ],
      solution: {
        answer: "a) 10; b) 16; c) 12.",
        explanation: [
          "a) `3 + 2 + 3 + 2 = 10`.",
          "b) 4 × 4 kvadratning hamma tomonlari 4 dan: `4 × 4 = 16`.",
          "c) `5 + 1 + 5 + 1 = 12`.",
        ],
        discuss: [
          "Qulay qoida: toʻgʻri toʻrtburchak perimetri — uzunligi plyus eni, hammasi ikki marta. Farzandingiz uni misollardan oʻzi payqasin.",
        ],
      },
    },
    w4d4t2: {
      title: "Burchakchaning yuzasi va perimetri",
      body: [{ text: "Burchakchaning yuzasi va perimetrini top. Katakning tomoni — 1." }],
      answer: {
        fields: {
          area: { label: "Yuza (kataklar)" },
          perimeter: { label: "Perimetr" },
        },
      },
      followUps: [
        "3 × 3 kvadrat bilan solishtir: uning yuzasi katta, perimetri-chi?",
        "Perimetr oʻzgarmasligi uchun burchakchaga qaysi katakni qoʻshish mumkin?",
      ],
      hints: [
        "Yana bir oʻqi: yuza — ichidagi kataklar, perimetr — cheti boʻylab qadamlar.",
        "Burchakcha 3 katakli ustuncha va pastdagi yana ikkita katakdan iborat.",
        "Burchakcha chegarasini qalam bilan aylantir va har bir qadamga chiziqcha qoʻy.",
        "Alohida sana: chegaraning tik qismlarida nechta qadam va yotiq qismlarida nechta?",
        "Chegaraning tik qismlari birgalikda — 6 qadam, yotiqlari — yana 6.",
      ],
      solution: {
        answer: "Yuzasi 5, perimetri 12.",
        explanation: [
          "Yuza: ustunchada 3 ta katak va pastda yana 2 ta — 5 ta katak.",
          "Perimetr: chegaraning tik qismlari — chapda 3, ustuncha oʻngida 2 va oʻng uchida 1, birgalikda 6; yotiqlari — ustuncha tepasida 1, pastki tasma tepasida 2 va pastda 3, bu ham 6. Jami 12.",
        ],
        discuss: [
          "Qiziq: 3 × 3 kvadratning perimetri ham 12, garchi unda 9 ta katak boʻlsa ham. «Ichkariga» kirgan pogʻona perimetrni oʻzgartirmaydi — chegara shunchaki boshqa joyga oʻtadi.",
        ],
      },
    },
    w4d4t3: {
      title: "Yuzasi bitta — perimetrlari har xil",
      body: [
        {
          text: "12 ta katakdan uchta har xil toʻgʻri toʻrtburchak terildi. Hammasining yuzasi bir xil — 12 katak. Perimetri-chi?",
        },
      ],
      answer: {
        prompt: "Qaysi toʻgʻri toʻrtburchak?",
        items: {
          min: { label: "Perimetri eng kichigi" },
          max: { label: "Perimetri eng kattasi" },
        },
      },
      followUps: [
        "Uchala toʻgʻri toʻrtburchakning perimetri qanchadan?",
        "16 ta katakdan: qaysi toʻgʻri toʻrtburchakning perimetri eng kichik?",
      ],
      hints: [
        "Yana bir oʻqi: hammasining yuzasi bitta, perimetrlarni solishtiramiz.",
        "Perimetr — uzunligi plyus eni, ikki marta.",
        "Har bir toʻgʻri toʻrtburchakning perimetrini hisoblab, yoniga yozib qoʻy.",
        "12 × 1: `12 + 1 = 13`, perimetr esa ikki baravar katta. 6 × 2 va 4 × 3 uchun ham shunday qil.",
        "Solishtir: 26, 16 va 14. Nimani payqading — qaysi toʻgʻri toʻrtburchak kvadratga eng yaqin?",
      ],
      solution: {
        answer: "Perimetri eng kichigi — 4 × 3 (14), eng kattasi — 12 × 1 (26).",
        explanation: ["12 × 1: `(12 + 1) × 2 = 26`.", "6 × 2: `(6 + 2) × 2 = 16`.", "4 × 3: `(4 + 3) × 2 = 14`."],
        discuss: [
          "Yuzasi bir xil boʻlganda toʻgʻri toʻrtburchak kvadratga qanchalik yaqin boʻlsa, perimetri shunchalik kichik. Qisqa devor kerak boʻlsa, uzun ingichka tasma eng «noqulay» shakl.",
        ],
      },
    },
    w4d4t4: {
      title: "Zinapoya perimetri",
      body: [
        {
          text: "Zinapoya kataklardan quriladi: birinchi ustunchada 1 ta katak, ikkinchisida — 2 ta, uchinchisida — 3 ta va hokazo. Mana 4 pogʻonali zinapoya:",
        },
        null,
        { label: "a)", text: "Bu zinapoyada nechta katak bor?" },
        { label: "b)", text: "Uning perimetri qancha?" },
        { label: "c)", text: "10 pogʻonali zinapoyaning perimetri qancha boʻladi?" },
      ],
      answer: {
        fields: {
          area: { label: "a) kataklar" },
          p4: { label: "b) perimetr" },
          p10: { label: "c) 10 pogʻonali zinapoya perimetri" },
        },
      },
      followUps: [
        "1, 2 va 3 pogʻonali zinapoyalarning perimetrini top. Nimani payqading?",
        "10 pogʻonali zinapoyada nechta katak bor?",
      ],
      hints: [
        "Yana bir oʻqi: b) va c) da perimetr — cheti boʻylab qadamlar kerak.",
        "4 pogʻonali zinapoyaning eni 4 katak, boʻyi ham 4 katak.",
        "1, 2 va 3 pogʻonali zinapoyalarning perimetrini hisobla va ketma-ket yozib chiq.",
        "Har bir pogʻonani «toʻgʻrilash» mumkin: hamma kichik yotiq boʻlakchalarni xayolan tepaga, tiklarini esa chapga sur. Qanday shakl hosil boʻladi?",
        "Zinapoya chegarasi 4 × 4 kvadrat chegarasidek uzun. 10 pogʻonali zinapoyaniki esa — 10 × 10 kvadratnikidek.",
      ],
      solution: {
        answer: "a) 10; b) 16; c) 40.",
        explanation: [
          "a) `1 + 2 + 3 + 4 = 10` ta katak.",
          "b) Pogʻonalar chegarasining yotiq boʻlakchalari birgalikda tepada 4 qadam, pastda ham 4 qadam beradi; tiklari — oʻngda 4 va pogʻonalarda chap tomonda 4. Jami `4 × 4 = 16`, 4 × 4 kvadratnikidek.",
          "c) 10 pogʻonali zinapoyada ham xuddi shunday: `4 × 10 = 40`.",
        ],
        discuss: [
          "4, 8, 12, 16 qonuniyati — perimetr har bir pogʻona bilan 4 ga oʻsadi. «Pogʻonalarni toʻgʻrilash» usuli hali koʻp marta asqatadi.",
        ],
      },
    },
    w4d4t5: {
      title: "Robot polizni aylanib chiqadi",
      body: [
        {
          text: "Tomorqaning oʻrtasida poliz bor (undan yurish mumkin emas). Bogʻbon robot hamma yulduz-gullarni yigʻib, bayroqchaga kelishi kerak. Eng qisqa dasturni tuz.",
        },
      ],
      followUps: [
        "Yulduz faqat bitta — chap yuqorida boʻlganida, nechta buyruq kerak boʻlardi?",
        "Dastur uzunligi poliz perimetri bilan qanday bogʻliq?",
      ],
      hints: [
        "Yana bir oʻqi: hamma yulduzlarni yigʻib, bayroqcha yonida tugatish kerak.",
        "Yulduzlar tomorqaning yuqori burchaklarida, robot va bayroqcha esa — pastda.",
        "Robot yoʻlini barmogʻing bilan chiz: avval bitta yulduzga, keyin ikkinchisiga, keyin bayroqchaga.",
        "Oʻng yulduzga pastdan borsa boʻladimi? Unda chap yulduz uchun qaytishga toʻgʻri keladi. Bitta joydan ikki marta oʻtmaydigan yoʻlni oʻyla.",
        "Chap chet boʻylab yuqoriga, yuqori chet boʻylab oʻngga va oʻng chet boʻylab pastga — buyruqlarni sana.",
      ],
      solution: {
        answer: "↑ ↑ ↑ → → → → → → ↓ ↓ ↓ — 12 ta buyruq.",
        explanation: [
          "Robot chap yulduzga koʻtariladi (3 ta buyruq), yuqori chet boʻylab oʻng yulduzga boradi (6 ta buyruq) va bayroqchaga tushadi (3 ta buyruq).",
          "Bundan qisqa boʻlmaydi: robot ikkala yuqori burchakda ham boʻlishi kerak, ular orasi esa 6 qadam, yana 3 qadam koʻtarilib, 3 qadam tushish kerak.",
        ],
        discuss: [
          "Robot yoʻli polizni uch tomondan aylanib oʻtadi — bu deyarli uning perimetri. «Perimetr» soʻziga qaytish uchun yaxshi bahona: cheti boʻylab aylanish.",
        ],
      },
    },
    w4d4t6: {
      title: "Toʻrt katakli shakllar",
      body: [
        {
          text: "Bu shakllarning hammasi 4 ta katakdan yigʻilgan — yuzalari bir xil. Qaysi shaklning perimetri qolganlarinikidan kichik?",
        },
      ],
      answer: {
        prompt: "Qaysi shaklning perimetri eng kichik?",
        options: {
          i: { label: "A" },
          o: { label: "B" },
          t: { label: "C" },
          l: { label: "D" },
          s: { label: "E" },
        },
      },
      followUps: [
        "Qolgan shakllarning perimetri qancha? Nega u bir xil?",
        "Rasmda yoʻq, perimetri 10 boʻlgan 4 katakli shakl chiz.",
      ],
      hints: [
        "Yana bir oʻqi: yuzalari bir xil, perimetrlarni solishtiramiz.",
        "Bitta katakning 4 ta tomoni bor. Toʻrtta alohida katakda 16 ta tomon boʻlardi.",
        "Har bir shaklning chegarasini aylantir va qadamlarni sana.",
        "Ikkita katak tomoni bilan tegib tursa, bu tomon ichkariga ketadi va perimetrga kirmaydi. Qaysi shaklda kataklar bir-biriga eng koʻp tegadi?",
        "2 × 2 kvadratda kataklar toʻrtta tomoni bilan tegadi, qolgan shakllarda esa — faqat uchta.",
      ],
      solution: {
        answer: "B shakl — 2 × 2 kvadrat (perimetri 8).",
        explanation: [
          "Toʻrtta alohida katakning 16 ta tomoni bor. Ikkita katakning har bir tegishi perimetrdan 2 ta tomonni olib tashlaydi — har bir katakdan bittadan.",
          "2 × 2 kvadratda toʻrtta tegish bor: `16 − 8 = 8`. Qolgan shakllarda uchtadan tegish: `16 − 6 = 10`.",
        ],
        discuss: [
          "«Yuzasi bitta — perimetrlari har xil» masalasidagi xulosaning oʻzi: shakl qanchalik «zich», kvadratga yaqin boʻlsa, perimetri shunchalik kichik.",
        ],
      },
    },
    w4d4t7: {
      title: "Tomorqa uchun devor",
      body: [
        { text: "Tomorqa — uzunligi 8 metr, eni 5 metr boʻlgan toʻgʻri toʻrtburchak." },
        { label: "a)", text: "Uni hamma tomondan oʻrab olish uchun necha metr devor kerak?" },
        {
          label: "b)",
          text: "Tomorqaning bitta uzun tomoni uy devori boʻylab oʻtadi — u yerda devor kerak emas. Endi necha metr devor kerak?",
        },
        { label: "c)", text: "Tomorqaning yuzasi necha kvadrat metr?" },
      ],
      answer: {
        fields: {
          all: { label: "a) devor", suffix: "m" },
          wall: { label: "b) devor", suffix: "m" },
          area: { label: "c) yuza", suffix: "kv. m" },
        },
      },
      followUps: [
        "Uy devori boʻylab tomorqaning qaysi tomonini qoʻygan maʼqul — uzunini yoki qisqasini?",
        "Tomorqaga 1 × 1 metrli nechta egat sigʻadi?",
      ],
      hints: [
        "Yana bir oʻqi: a) da devor hamma tomondan, b) da esa bitta uzun tomonsiz.",
        "Ikkita tomon 8 metrdan va ikkita tomon 5 metrdan.",
        "Tomorqani chiz va har bir tomonining uzunligini yozib qoʻy.",
        "a) Toʻrtala tomonni qoʻsh. b) Yigʻindidan bitta 8 metrli tomonni olib tashla.",
        "Yuza — 1 × 1 metrli kvadratlardan nechtasi sigʻishi: 8 tadan 5 qator.",
      ],
      solution: {
        answer: "a) 26 m; b) 18 m; c) 40 kv. m.",
        explanation: [
          "a) `8 + 5 + 8 + 5 = 26` metr.",
          "b) Bitta uzun tomonsiz: `26 − 8 = 18` metr.",
          "c) `8 × 5 = 40` kvadrat metr.",
        ],
        discuss: [
          "Perimetr metrlarda oʻlchanadi (bu uzunlik), yuza esa kvadrat metrlarda (bu 1 × 1 m li kvadratchalar). Farqini birga aytib oʻting.",
        ],
      },
    },
    w4d4t8: {
      title: "Ustma-ust yopishtirilgan yorliqlar",
      body: [
        {
          text: "6 × 5 katakli maydonga uchta toʻgʻri toʻrtburchak yorliq yopishtirildi: 4 × 3 qizil, 4 × 3 koʻk va 3 × 3 yashil. Ular bir-birini qisman yopib turibdi.",
        },
        null,
        { label: "a)", text: "Maydonning nechta katagi hech boʻlmaganda bitta yorliq bilan yopilgan?" },
        { label: "b)", text: "Nechta katak uchala yorliq bilan birdaniga yopilgan?" },
        { label: "c)", text: "Maydonning nechta katagi ochiq qoldi?" },
      ],
      answer: {
        fields: {
          covered: { label: "a) yopilgan" },
          three: { label: "b) uchalasi bilan" },
          free: { label: "c) ochiq" },
        },
      },
      followUps: [
        "Uchala yorliqning yuzalarini qoʻsh. Nega yigʻindi a) javobidan katta?",
        "Nechta katak roppa-rosa ikkita yorliq bilan yopilgan?",
      ],
      hints: [
        "Yana bir oʻqi: a) da har bir katak bir marta sanaladi, ustida bir nechta yorliq boʻlsa ham.",
        "Yorliqlar 4 × 3, 4 × 3 va 3 × 3 — bu 12, 12 va 9 ta katak.",
        "Maydonni qayta chiz va har bir katakka uni nechta yorliq yopganini yoz: 0, 1, 2 yoki 3.",
        "c) dan boshla: ustida bitta ham yorliq yoʻq kataklarni top. Ularni sanash oson.",
        "6 × 5 maydon — bu 30 ta katak. Yopilganlari — 30 minus ochiqlari. b) uchun uchala toʻgʻri toʻrtburchak kesishgan kataklarni top.",
      ],
      solution: {
        answer: "a) 24; b) 2; c) 6.",
        explanation: [
          "Ochiq kataklar 6 ta: maydonning oʻng yuqori, chap pastki va oʻng pastki burchaklarida ikkitadan.",
          "Demak, `30 − 6 = 24` ta katak yopilgan.",
          "Uchala yorliq ikkita katakda uchrashadi: uchinchi qatorning uchinchi va toʻrtinchi ustunlarida.",
          "Tekshirish: `12 + 12 + 9 = 33`. Qizil bilan koʻk 4 ta katakda, qizil bilan yashil 3 tasida, koʻk bilan yashil 4 tasida ustma-ust tushadi: `33 − 4 − 3 − 4 = 22`. Lekin uchala yorliq ostidagi ikkita katakni uch marta ayirdik, ikki marta ayirishimiz kerak edi, shuning uchun ularni qoʻshamiz: `22 + 2 = 24`.",
        ],
        discuss: [
          "Oxiridagi tekshirish — mashhur «qoʻshish va ayirish» usuli. Bola uchun asosiysi — nega yuzalar yigʻindisi yopilgan yuzadan katta ekanini tushunish: bir nechta yorliq ostidagi kataklar bir necha marta sanalgan.",
        ],
      },
    },
  },
  parent: {
    skills: [
      "Perimetrni (chegara uzunligini) yuzadan (ichidagi kataklar sonidan) ajratish.",
      "Toʻgʻri toʻrtburchak perimetrini uzunligi va eni boʻyicha topish.",
      "Yuzasi bir xil boʻlganda perimetr har xil boʻlishini koʻrish.",
    ],
    observe: [
      "Farzandingiz perimetr bilan yuzani adashtirmayaptimi? «Cheti boʻylab qadamlarni sanayapmizmi yoki ichidagi kataklarnimi?» degan savol yordam beradi.",
      "Qonuniyatlarni maslahatsiz, oʻzi payqayaptimi?",
    ],
    mistakes: [
      "Cheti boʻylab qadamlar oʻrniga chetdagi kataklarni sanash: burchakchada 5 ta katak, lekin perimetri 12.",
      "Yorliqlar masalasida ikkita yorliq ostidagi katakni ikki marta sanash.",
    ],
    question: "Perimetr yuzadan nimasi bilan farq qiladi? Xonamiz misolida tushuntirib ber.",
  },
};
