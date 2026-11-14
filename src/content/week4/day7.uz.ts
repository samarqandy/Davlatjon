/** Hafta 4, 7-kun — oʻzbekcha (day7.ts ustiga qoplama, qoidalar — docs/uzbek-style.md). */
import type { Uz } from "../localize";
import type { Day } from "../types";

export const day7Uz: Uz<Day> = {
  title: "Geometriya ustasi",
  habit: { name: "Men shakllar haqida mulohaza yuritaman" },
  intro: [
    "Geometriya haftasining oxirgi kuni! Bugun hammasi birdaniga asqatadi: burchak va tomonlar, simmetriya, perimetr va yuza, kubiklar va xarita.",
    "Oxirida esa **tadqiqot** kutyapti: ip bitta, undan chiqadigan toʻgʻri toʻrtburchaklar esa butunlay har xil.",
  ],
  tasks: {
    w4d7t1: {
      title: "Geometrik badantarbiya",
      body: [
        { label: "a)", text: "Tomoni 7 boʻlgan kvadratning perimetri qancha?" },
        { label: "b)", text: "6 × 4 toʻgʻri toʻrtburchakning yuzasi (kataklarda) qancha?" },
        { label: "c)", text: "2 × 2 × 2 kubda nechta kubik bor?" },
        { label: "d)", text: "Kvadratning nechta simmetriya oʻqi bor?" },
      ],
      answer: {
        fields: {
          perimeter: { label: "a) perimetr" },
          area: { label: "b) yuza" },
          cubes: { label: "c) kubiklar" },
          axes: { label: "d) oʻqlar" },
        },
      },
      followUps: [
        "Qaysi savol uzunlik haqida, qaysi biri yuza haqida edi?",
        "Shu haftadan toʻrtta savolli oʻz badantarbiyangni oʻylab top.",
      ],
      hints: [
        "Har bir savolni yana bir oʻqi: qayerda chegara uzunligi, qayerda kataklar soni, qayerda kubiklar soni kerak?",
        "Kvadratning hamma 4 ta tomoni teng.",
        "6 × 4 toʻgʻri toʻrtburchak va ikki qatlamdan iborat 2 × 2 × 2 kub chiz.",
        "a) 7 dan toʻrtta tomonni qoʻsh. b) 6 tadan 4 qator katak. c) 4 tadan kubikli ikki qatlam.",
        "d) «Nechta oʻq bor?» masalasini esla: kvadrat oʻrta chiziqlari boʻyicha ikki xil va diagonallari boʻyicha yana ikki xil buklanadi.",
      ],
      solution: {
        answer: "a) 28; b) 24; c) 8; d) 4.",
        explanation: [
          "a) `7 × 4 = 28`.",
          "b) `6 × 4 = 24` ta katak.",
          "c) `2 × 2 = 4` tadan kubikli ikki qatlam: `4 + 4 = 8`.",
          "d) Ikkita oʻrta chiziq va ikkita diagonal — 4 ta oʻq.",
        ],
        discuss: [
          "Badantarbiya butun haftani takrorlaydi. Qaysidir savol qiyin boʻlgan boʻlsa, oʻsha kunning masalasiga qayting.",
        ],
      },
    },
    w4d7t2: {
      title: "Shaklni top",
      body: [{ text: "Shakllar oʻzlari haqida topishmoq aytishdi. Kim kim?" }],
      answer: {
        prompt: "Bu qaysi shakl?",
        items: {
          a: { label: "a) «Mening 4 ta tomonim bor, hamma burchaklarim toʻgʻri, lekin hamma tomonlarim teng emas»." },
          b: { label: "b) «Mening hammasi boʻlib 3 ta tomonim bor»." },
          c: { label: "c) «Mening bitta ham burchagim yoʻq»." },
          d: { label: "d) «Mening 4 ta teng tomonim va 4 ta toʻgʻri burchagim bor»." },
          e: { label: "e) «Mening uchlarim bir qoʻldagi barmoqlar sonicha»." },
        },
        options: {
          square: { label: "Kvadrat" },
          rect: { label: "Toʻgʻri toʻrtburchak" },
          triangle: { label: "Uchburchak" },
          circle: { label: "Doira" },
          pentagon: { label: "Beshburchak" },
        },
      },
      followUps: [
        "Kvadrat — toʻgʻri toʻrtburchakmi? Tushuntir.",
        "Oltiburchak haqida faqat unga mos keladigan topishmoq oʻylab top.",
      ],
      hints: [
        "Har bir topishmoqni yana bir oʻqi. «Hamma», «hammasi emas», «bitta ham yoʻq» soʻzlariga eʼtibor ber.",
        "Kvadrat bilan toʻgʻri toʻrtburchakning 4 tadan tomoni bor va hamma burchaklari toʻgʻri. Ular nimasi bilan farq qiladi?",
        "Beshala shaklni chiz va har birining yoniga tomonlari va burchaklari sonini yoz.",
        "Eng oson topishmoqlardan boshla: b) va e) — tomonlar va uchlar soni haqida.",
        "a) da tomonlarning hammasi teng emas — demak, bu kvadrat emas. d) da esa hamma tomonlari teng.",
      ],
      solution: {
        answer: "a) toʻgʻri toʻrtburchak; b) uchburchak; c) doira; d) kvadrat; e) beshburchak.",
        explanation: [
          "a) Toʻrtta toʻgʻri burchak, lekin tomonlari hammasi teng emas — kvadrat boʻlmagan toʻgʻri toʻrtburchak.",
          "b) Uchta tomon — uchburchakda. c) Burchaksiz — doira. e) Beshta uch — beshburchakda.",
          "d) Toʻrtta teng tomon va toʻgʻri burchaklar — kvadrat.",
        ],
        discuss: [
          "Oʻylab koʻrish uchun yaxshi savol: kvadrat — hamma tomonlari teng boʻlgan alohida toʻgʻri toʻrtburchak. Shuning uchun a) topishmogʻida atayin «hamma tomonlarim teng emas» deyilgan.",
        ],
      },
    },
    w4d7t3: {
      title: "Nuqtalar va kesmalar",
      body: [
        {
          text: "Varaqda bir nechta nuqta belgilandi, ulardan hech qaysi uchtasi bitta toʻgʻri chiziqda yotmaydi. Har ikki nuqta kesma bilan tutashtirildi. Mana 4 ta nuqta va 6 ta kesma:",
        },
        null,
        {
          items: [
            "2 ta nuqta — 1 ta kesma",
            "3 ta nuqta — 3 ta kesma",
            "4 ta nuqta — 6 ta kesma",
            "5 ta nuqta — 10 ta kesma",
          ],
        },
        { label: "a)", text: "6 ta nuqtada nechta kesma hosil boʻladi?" },
        { label: "b)", text: "10 ta nuqtada-chi?" },
      ],
      answer: {
        fields: {
          six: { label: "a) 6 ta nuqtada" },
          ten: { label: "b) 10 ta nuqtada" },
        },
      },
      followUps: [
        "Yana bitta nuqta qoʻshilganda kesmalar nechtaga koʻpayadi?",
        "Sinfda 10 ta bola bor va har biri har biri bilan qoʻl berib koʻrishdi. Nechta qoʻl berib koʻrishish boʻldi?",
      ],
      hints: [
        "Yana bir oʻqi: har ikki nuqta roppa-rosa bitta kesma bilan tutashtirilgan.",
        "1, 3, 6, 10. Son har safar nechtaga oʻsadi?",
        "5 ta nuqta chiz, keyin oltinchisini qoʻshib, uni hammasi bilan tutashtir.",
        "Yangi nuqta oldingilarining hammasi bilan tutashadi. Oltinchi nuqta 5 ta yangi kesma qoʻshadi.",
        "10 ta nuqta uchun davom et: har bir yangi nuqta oʻzidan oldin nechta nuqta boʻlsa, shuncha kesma qoʻshadi.",
      ],
      solution: {
        answer: "a) 15; b) 45.",
        explanation: [
          "Oltinchi nuqta oldingi beshtasi bilan tutashadi: `10 + 5 = 15`.",
          "Keyin: 7 ta nuqta — `15 + 6 = 21`, 8 ta — `21 + 7 = 28`, 9 ta — `28 + 8 = 36`, 10 ta — `36 + 9 = 45`.",
        ],
        discuss: [
          "Tanish sonlar 1, 3, 6, 10, 15 — haftaning birinchi kunidagi uchburchak sonlar! Qoʻl berib koʻrishish masalasi — aynan oʻsha masala. Kelgusi kombinatorika haftasiga ajoyib koʻprik.",
        ],
      },
    },
    w4d7t4: {
      title: "Chizgʻichsiz kvadrat markazi",
      body: [
        {
          text: "Kvadrat qogʻoz varagʻining oʻrtasini topish kerak, lekin chizgʻich ham, qalam ham yoʻq. Qadamlarni tartib bilan joylashtir.",
        },
      ],
      answer: {
        prompt: "Qanday tartibda bajarish kerak?",
        items: {
          second: {
            label: "Varaqni ikkinchi diagonal boʻyicha, qolgan ikki burchakni ustma-ust qoʻyib buklash va yana ochish.",
          },
          mark: { label: "Ikkita buklangan chiziq kesishgan nuqtani topish — bu markaz." },
          first: { label: "Varaqni ikkita qarama-qarshi burchakni ustma-ust qoʻyib, diagonal boʻyicha buklash." },
          unfold: { label: "Varaqni ochish: unda buklangan chiziq qoldi." },
        },
      },
      followUps: [
        "Markazni xuddi shunday, lekin varaqni diagonallar boʻyicha emas, uzunasiga va koʻndalangiga buklab qanday topish mumkin?",
        "Nega diagonallar kesishgan nuqta kvadratning markazi?",
      ],
      hints: [
        "Hamma qadamlarni yana bir oʻqi. Qaysi qadamni birinchi qilib boʻlmaydi?",
        "Markazni ikkita chiziq kesishgan nuqta sifatida izlaymiz.",
        "Kvadrat varaqcha olib, hammasini qadamma-qadam bajarib koʻr.",
        "Avval birinchi buklangan chiziq kerak. Ikkinchisini qilish uchun varaqni avval ochish kerak.",
        "Kesishish nuqtasini faqat ikkala chiziq ham boʻlgandagina topish mumkin.",
      ],
      solution: {
        answer:
          "Diagonal boʻyicha buklash → ochish → ikkinchi diagonal boʻyicha buklab, ochish → kesishish nuqtasini topish.",
        explanation: [
          "Har bir diagonal kvadratning markazidan oʻtadi: markaz — har bir diagonalning oʻrtasi.",
          "Diagonallar boʻyicha ikkita buklangan chiziq roppa-rosa bitta nuqtada — markazda kesishadi.",
        ],
        discuss: [
          "Bu hayotdan olingan algoritm: origami yoki applikatsiya uchun varaq markazi shunday topiladi. Ikkinchi usul — uzunasiga va koʻndalangiga ikkiga buklash.",
        ],
      },
    },
    w4d7t5: {
      title: "4 × 4 × 4 kub",
      body: [
        { text: "4 × 4 × 4 katta kub kichik kubiklardan yigʻildi." },
        { label: "a)", text: "Hammasi boʻlib nechta kichik kubik bor?" },
        { label: "b)", text: "Ulardan nechtasi tashqaridan (hech boʻlmaganda bitta yogʻi bilan) koʻrinadi?" },
        { label: "c)", text: "Nechta kubik ichkarida yashiringan?" },
      ],
      answer: {
        fields: {
          all: { label: "a) hammasi" },
          outside: { label: "b) tashqaridan koʻrinadi" },
          inside: { label: "c) ichkarida" },
        },
      },
      followUps: [
        "5 × 5 × 5 kubning ichida nechta kubik yashiringan?",
        "3 × 3 × 3 boʻyalgan kubik bilan solishtir: uning ichida bitta kubik bor edi.",
      ],
      hints: [
        "Yana bir oʻqi: «tashqaridan koʻrinadi» — kubikning hech boʻlmaganda bitta yogʻi katta kub sirtida degani.",
        "4 × 4 × 4 kub — 4 × 4 kubikli 4 ta qatlam.",
        "4 × 4 qatlamdan birini chiz va qaysi kubiklar ichkarida yashiringanini oʻylab koʻr.",
        "Yashiringan kubiklarning oʻzi kichikroq kub hosil qiladi. U qanday oʻlchamda? Hamma tomondan bittadan qatlamni olib tashla.",
        "Ichkarida — 2 × 2 × 2 kub. Qolgan kubiklar tashqaridan koʻrinadi.",
      ],
      solution: {
        answer: "a) 64; b) 56; c) 8.",
        explanation: [
          "a) `4 × 4 = 16` tadan 4 ta qatlam: `16 × 4 = 64`.",
          "c) Hamma tomondan bittadan qatlamni olib tashlasak, 2 × 2 × 2 kub qoladi — bu 8 ta kubik, ular koʻrinmaydi.",
          "b) Qolganlari koʻrinadi: `64 − 8 = 56`.",
        ],
        discuss: [
          "«Koʻrinmaydiganini» sanab, ayirib tashlash — yana foydali usul, birinchi kundagi hoshiyali gilamcha masalasidagidek.",
        ],
      },
    },
    w4d7t6: {
      title: "Surat uchun ramka",
      body: [
        {
          text: "Surat — eni 10 sm, boʻyi 15 sm boʻlgan toʻgʻri toʻrtburchak. Uni hamma tomondan eni 2 sm boʻlgan ramkaga solishdi.",
        },
        { label: "a)", text: "Ramkaning surat bilan birgalikdagi eni qancha?" },
        { label: "b)", text: "Ramkaning surat bilan birgalikdagi boʻyi qancha?" },
        { label: "c)", text: "Ramkaning tashqi perimetri qancha?" },
      ],
      answer: {
        fields: {
          width: { label: "a) eni", suffix: "sm" },
          height: { label: "b) boʻyi", suffix: "sm" },
          perimeter: { label: "c) perimetr", suffix: "sm" },
        },
      },
      followUps: [
        "Suratning oʻzining perimetri qancha? U ramka perimetridan nechtaga kichik?",
        "Bitta suratning yuzasi qancha?",
      ],
      hints: [
        "Yana bir oʻqi: ramka har bir tomondan 2 sm qoʻshadi — chapdan ham, oʻngdan ham, tepadan ham, pastdan ham.",
        "Surat 10 sm ga 15 sm.",
        "Suratni va uning atrofidagi ramkani chiz, hamma oʻlchamlarni yozib qoʻy.",
        "Eniga chap va oʻngdagi ramka qoʻshiladi: `10 + 2 + 2`. Boʻyiga — tepa va pastdagisi.",
        "Perimetr — ramka tashqarisidagi toʻrtta tomon yigʻindisi: eni va boʻyi, ikki martadan.",
      ],
      solution: {
        answer: "a) 14 sm; b) 19 sm; c) 66 sm.",
        explanation: ["a) `10 + 2 + 2 = 14` sm.", "b) `15 + 2 + 2 = 19` sm.", "c) `(14 + 19) × 2 = 66` sm."],
        discuss: [
          "Koʻp uchraydigan xato — 2 sm ni faqat bir marta qoʻshish. Rasm yordam beradi: ramka ikkala tomonda ham bor.",
        ],
      },
    },
    w4d7t7: {
      title: "Bitta ip — har xil toʻgʻri toʻrtburchaklar",
      body: [
        {
          text: "Uzunligi 24 katak boʻlgan ipni katakli qogʻozga kataklar chizigʻi boʻylab toʻgʻri toʻrtburchak qilib terishadi. Butun ip chegaraga ketadi — perimetr doim 24. Yuzasi-chi?",
        },
        {
          label: "1. Yech.",
          text: "Perimetri 24 boʻlgan hamma toʻgʻri toʻrtburchaklarni top. Ular nechta? (2 × 10 va 10 × 2 toʻgʻri toʻrtburchaklarni bir xil deb hisoblaymiz.)",
        },
        { label: "2. Tushuntir.", text: "Nega uzunligi bilan eni birgalikda doim 12 ni beradi?" },
        {
          label: "3. Boshqa usulni top.",
          text: "Hamma toʻgʻri toʻrtburchaklarni jadvalga tartib bilan yoz: eni 1, 2, 3… Shunda bittasi ham yoʻqolmaydi.",
        },
        {
          label: "4. Shartni oʻzgartir.",
          text: "Uzunligi 20 boʻlgan ipni ol. Endi qaysi toʻgʻri toʻrtburchakning yuzasi eng katta?",
        },
        {
          label: "5. Tadqiq qil.",
          text: "Perimetr bir xil boʻlganda qaysi toʻgʻri toʻrtburchak doim eng katta yuzani beradi? Eng kichigini-chi?",
        },
        {
          label: "6. Oʻylab top.",
          text: "Qoʻra devori haqida kashfiyoting asqatadigan masala oʻylab top va uni kattalarga topishmoq qilib ayt.",
        },
        {
          visual: {
            head: ["Eni", "Uzunligi", "Perimetr", "Yuza"],
          },
        },
      ],
      answer: {
        fields: {
          count: { label: "Nechta toʻgʻri toʻrtburchak" },
          max: { label: "Eng katta yuza" },
          min: { label: "Eng kichik yuza" },
        },
      },
      followUps: ["Tadqiqotda senga nima yangilik boʻldi?", "Keyin qanday savol bergim keladi?"],
      hints: [
        "Yana bir oʻqi: hamma toʻgʻri toʻrtburchaklarning perimetri bir xil — 24.",
        "Perimetr — uzunligi plyus eni, ikki marta. Demak, uzunligi plyus eni — perimetrning yarmi.",
        "Jadvalni toʻldir: eni 1, 2, 3… Har bir qatorda uzunligi qancha chiqadi?",
        "Eni 1 boʻlsa, uzunligi 11. Eni 2 boʻlsa — uzunligi 10. Eni uzunligidan katta boʻlib qolganda, toʻgʻri toʻrtburchaklar takrorlana boshlaydi.",
        "Jadvalning har bir qatorida yuzani hisobla va solishtir: qayerda u eng katta, qayerda eng kichik?",
      ],
      solution: {
        answer: "6 ta toʻgʻri toʻrtburchak; eng katta yuza — 36 (6 × 6 kvadrat), eng kichigi — 11 (1 × 11 tasma).",
        explanation: [
          "Uzunligi plyus eni — perimetrning yarmi: `24 ÷ 2 = 12`. 1 × 11, 2 × 10, 3 × 9, 4 × 8, 5 × 7 va 6 × 6 mos keladi — oltita toʻgʻri toʻrtburchak.",
          "Yuzalar: 11, 20, 27, 32, 35 va 36. Eng kattasi — 6 × 6 kvadratda, eng kichigi — 1 × 11 ingichka tasmada.",
          "Uzunligi 20 boʻlgan ipda uzunligi bilan eni birgalikda 10 ni beradi va eng kattasi — yuzasi 25 boʻlgan 5 × 5 kvadrat.",
        ],
        discuss: [
          "Asosiy kashfiyot: perimetr bitta boʻlganda yuza juda har xil boʻladi va eng kattasi kvadratda (yoki kvadratga eng yaqin toʻgʻri toʻrtburchakda). Bu toʻrtinchi kundagi «Yuzasi bitta — perimetrlari har xil» masalasining teskari tomoni.",
          "Xulosaga shoshiltirmang. Tomonlar bir-biriga yaqinlashgan sari yuza oʻsishini farzandingiz oʻzi payqasin.",
        ],
      },
    },
  },
  parent: {
    skills: [
      "Haftada oʻrganilganlarning hammasini qoʻllash: shakllar, simmetriya, perimetr va yuza, kubiklar.",
      "Kichik tadqiqot oʻtkazish: hollarni tartib bilan saralash va xulosa chiqarish.",
      "Geometriyani hayot bilan bogʻlash: ramkalar, devorlar, rejalar.",
    ],
    observe: [
      "Farzandingiz jadvaldan keyin xulosani oʻzi chiqaryaptimi yoki maslahat kutyaptimi?",
      "Nega uzunligi bilan eni birgalikda perimetrning yarmini berishini tushuntira oladimi?",
    ],
    mistakes: [
      "2 × 10 va 10 × 2 toʻgʻri toʻrtburchaklarni har xil deb hisoblash.",
      "Yakuniy jadvalda perimetr bilan yuzani adashtirish.",
    ],
    question: "Geometriya haftasidan eng koʻp nima esda qoldi — va bu uyda qayerda uchraydi?",
  },
};
