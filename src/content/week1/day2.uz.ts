/** Неделя 1, день 2 — по-узбекски (накладка на day2.ts, правила — docs/uzbek-style.md). */
import type { Uz } from "../localize";
import type { Day } from "../types";

export const day2Uz: Uz<Day> = {
  title: "Qoidani izla",
  habit: { name: "Men qoida izlayman" },
  intro: [
    "Bugun sen olimsan 🧑‍🔬.",
    "Olim tusmollab javob bermaydi. U payqaydi, qoida oʻylab topadi va uni hamma misollarda tekshirib koʻradi. Shundan keyingina: «Tushundim!» deydi.",
  ],
  tasks: {
    w1d2t1: {
      title: "Deyarli yaxlit",
      body: [{ text: "Xayolan hisobla: `46 + 29 = ?`" }, { text: "Endi xuddi shu misolni boshqa usul bilan yech." }],
      followUps: ["Qaysi usul senga qulayroq tuyuldi? Nega?"],
      hints: [
        "Misolni yana bir bor oʻqi. Qaysi son deyarli yaxlit?",
        "29 — bu 30 dan bitta kam. Bu qanday yordam berishi mumkin?",
        "Son nurini chiz: 46 dan 30 ta oldinga sakra, keyin 1 ta orqaga qayt.",
        "Avval `46 + 30` ni hisobla. Keyin qancha ortiqcha qoʻshganingni oʻylab koʻr.",
        "Yana bir usul: 46 dan 1 ni olib, 29 ga ber. `45 + 30` hosil boʻladi.",
      ],
      solution: {
        explanation: [
          "`46 + 30 = 76`, lekin keragidan 1 ta koʻp qoʻshdik: `76 − 1 = 75`.",
          "Yoki: `45 + 30 = 75` — birni 46 dan 29 ga «oʻtkazib qoʻydik».",
        ],
        discuss: [
          "Farzandingiz birliklarni qoʻshiluvchilar orasida «koʻchirish» mumkinligini, yigʻindi bundan oʻzgarmasligini oʻzi payqasa — juda yaxshi.",
        ],
      },
    },
    w1d2t2: {
      title: "Ayirishning siri",
      body: [{ text: "Ustun shaklida yozmay, xayolan hisobla: `50 − 27 = ?`" }],
      followUps: ["Javobni qoʻshish bilan qanday tekshirsa boʻladi?"],
      hints: [
        "Misolni yana bir bor oʻqi. Qaysi sondan qaysi sonni ayiryapmiz?",
        "27 soni qaysi yaxlit songa yaqin?",
        "27 dan 50 gacha son nurini chiz. 27 dan 30 gacha necha qadam? 30 dan 50 gacha-chi?",
        "Avval osonroq misolni yechib koʻr: `10 − 7`. Keyin `50 − 7`.",
        "30 ni ayirish mumkin — bu oson! — keyin 3 ni qaytarib qoʻshasan, chunki keragidan 3 ta koʻp ayirding.",
      ],
      solution: {
        explanation: [
          "`50 − 30 = 20`, lekin 3 ta koʻp ayirdik — qaytarib qoʻshamiz: `20 + 3 = 23`.",
          "Yoki «yuqoriga» qarab sanaymiz: 27 dan 30 gacha — 3, 30 dan 50 gacha — 20, jami 23.",
        ],
        discuss: ["Tekshirish: `23 + 27 = 50`. Ayirishni qoʻshish bilan tekshirish odati juda qimmatli."],
      },
    },
    w1d2t3: {
      title: "Son mashinasi",
      body: [
        { text: "Son mashinasi ⚙️ bir sonni maxfiy qoida boʻyicha boshqa songa aylantiradi." },
        null,
        { label: "a)", text: "Mashinaning qoidasi qanday?" },
        { label: "b)", text: "7 sonidan nima hosil boʻladi?" },
        { label: "c)", text: "Mashinadan 13 chiqqan boʻlsa, unga qaysi son solingan?" },
      ],
      answer: {
        fields: {
          out7: { label: "b) 7 dan chiqadi" },
          in13: { label: "c) solingan son" },
        },
      },
      followUps: [
        "Qoidangni uchala juftlikda ham tekshirib koʻr — u har biriga mos kelishi kerak!",
        "Oʻzingning son mashinangni oʻylab top — uning qoidasini oying yoki dadang topsin.",
      ],
      hints: [
        "Hamma juftliklarga yana bir bor qara. Mashinaga nima kiradi va undan nima chiqadi?",
        "Chiqqan son doim kirgan sondan katta. Har bir juftlikda nechtaga katta? Bir xilmi?",
        "Jadvalga yoz: kirgan son, chiqqan son va ularning farqi.",
        "10 → 21 juftligiga qara. 10 dan 20 ni qanday hosil qilsa boʻladi? 21 ni-chi?",
        "Balki mashina son bilan ketma-ket ikkita amal bajarar? Qanday amallar ekanini oʻylab top — va taxminingni uchala juftlikda tekshirib koʻr.",
      ],
      solution: {
        answer: "a) Sonni ikki baravar qilib, 1 qoʻshish; b) 15; c) 6.",
        explanation: [
          "`3 + 3 + 1 = 7`, `5 + 5 + 1 = 11`, `10 + 10 + 1 = 21` — qoida hamma juftliklarga mos keladi.",
          null,
          "Teskari yoʻl: `13 − 1 = 12`, 12 esa — bu `6 + 6`. Demak, 6 solingan.",
        ],
        discuss: [
          "Koʻp uchraydigan xato — «+4» qoidasi: u birinchi juftlikka (3 → 7) mos keladi, qolganlariga esa yoʻq. Soʻrang: «5 → 11 uchun ham toʻgʻri keladimi?» Shunday qilib farzandingiz farazni barcha maʼlumotlarda tekshirishni oʻrganadi.",
          "«Son va undan keyingi son yigʻindisi» (`3 + 4 = 7`) degan javobni ham qabul qiling — bu aynan oʻsha qoida.",
        ],
      },
    },
    w1d2t4: {
      title: "Hayvonlarni qanday ajratamiz?",
      body: [
        { text: "Mana sakkizta hayvon." },
        {
          visual: {
            items: [
              { label: "it" },
              { label: "mushuk" },
              { label: "baliq" },
              { label: "oʻrdak" },
              { label: "ilon" },
              { label: "qurbaqa" },
              { label: "sigir" },
              { label: "burgut" },
            ],
          },
        },
        { label: "a)", text: "Ularni guruhlarga ajrat. Qaysi qoida boʻyicha ajratding?" },
        { label: "b)", text: "Boshqa qoida top — shunda guruhlar ham boshqacha chiqsin." },
        {
          label: "c)",
          text: "Qaysi qoida boʻyicha guruhlar eng tushunarli chiqadi, yaʼni har bir hayvon qaysi guruhga tushishi darrov bilinadi? Nega?",
        },
      ],
      answer: { prompt: "Qoidalaringni kattalarga aytib ber. Nechta turli qoida oʻylab topding?" },
      followUps: ["Bitta guruhga kiritish qiyin boʻlgan hayvon bormi? Nega?"],
      hints: [
        "Hamma hayvonlarga yana bir bor qara. Ular nimasi bilan oʻxshash va nimasi bilan farq qiladi?",
        "Har biri haqida nimani bilasan: qayerda yashaydi, qanday harakatlanadi, tanasi nima bilan qoplangan, nechta oyogʻi bor?",
        "Ikkita katta doira chiz va hayvonlarni doiralarga taqsimla.",
        "Avval faqat toʻrtta hayvonni ajratib koʻr: it, baliq, oʻrdak va ilonni.",
        "Yaxshi qoida shundayki, har bir hayvon qaysi guruhga tushishini aniq aytsa boʻladi. Qoidangni har bir hayvonda tekshirib koʻr.",
      ],
      solution: {
        answer: "Toʻgʻri javob koʻp — muhimi, qoidani aytish va uni har bir hayvonda tekshirib koʻrish.",
        explanation: [
          "Oyoqlar soni boʻyicha: oyoqsiz (baliq, ilon), 2 oyoqli (oʻrdak, burgut), 4 oyoqli (it, mushuk, qurbaqa, sigir) — guruhlar juda aniq.",
          "Ucha oladi / ucha olmaydi: oʻrdak va burgut uchadi.",
          "Suvda yashaydi / quruqlikda yashaydi: bu yerda bahsli holatlar bor — oʻrdak bilan qurbaqa suvda ham, quruqlikda ham yashaydi. Bu «noaniq» qoidaga misol.",
          "Tanasi nima bilan qoplangan: jun (it, mushuk, sigir), pat (oʻrdak, burgut), tangacha (baliq, ilon), silliq teri (qurbaqa).",
        ],
        discuss: [
          "Bu informatika va sunʼiy intellektdagi tasniflashni tushunishga tayyorgarlik: obyektlarning belgilari bor, belgilar asosida qoida tuziladi va baʼzi qoidalar boshqalaridan «yaxshiroq». «Toʻgʻri guruhlar» uchun emas, qoidani aniq tushuntirgani uchun maqtang.",
        ],
      },
    },
    w1d2t5: {
      title: "Qatordagi figuralar",
      body: [{ text: "Figuralar qatoriga qara. 8-figura qanday boʻladi?" }],
      answer: {
        prompt: "8-figurani tanla:",
        // буквы вариантов: А Б В Г → A B C D
        options: { a: { label: "A" }, b: { label: "B" }, c: { label: "C" }, d: { label: "D" } },
      },
      followUps: ["12-figura qanday boʻladi? Butun qatorni chizmasdan buni qanday bilish mumkin?"],
      hints: [
        "Qatorga yana bir bor qara. Figuradan figuraga nima oʻzgaryapti?",
        "Figuralarda ikki narsa oʻzgaradi: shakli va rangi. Avval faqat shakliga qara.",
        "Shakllarni tartib bilan alohida yozib chiq, keyin ranglarini ham alohida yoz.",
        "Shakl har 3 ta figuradan keyin takrorlanadi, rang esa — har 2 tadan keyin.",
        "8-figuraning shaklini alohida, rangini alohida top — keyin ikkalasini birlashtir.",
      ],
      solution: {
        answer: "Koʻk kvadrat (A variant).",
        explanation: [
          "Shakllar takrorlanadi: doira, kvadrat, uchburchak, doira, kvadrat, uchburchak, doira, …, shuning uchun 8-figura — kvadrat.",
          "Ranglar navbatma-navbat keladi: qizil, koʻk, qizil, koʻk… Juft oʻrinlarda — koʻk. 8 — juft son, demak, koʻk.",
        ],
        discuss: [
          "12-figura — koʻk uchburchak: 12-oʻrin «uchlik»da uchinchi boʻladi (uchburchak) va u juft (koʻk). Bu masalada birdaniga ikkita qoida yashiringan.",
        ],
      },
    },
    w1d2t6: {
      title: "Dasturni oʻqi",
      body: [
        { text: "Robot 🤖 dasturni bajaryapti: `→ → → ↑ ↑ ← ↑ ↑`" },
        {
          text: "U toʻxtagan katakda qaysi narsani topadi? Avval javob ber, keyin robotni ishga tushirib, oʻzingni tekshir.",
        },
      ],
      answer: {
        puzzle: {
          legend: {
            b: { name: "shar" },
            k: { name: "kalit" },
            a: { name: "olma" },
            c: { name: "quti" },
            t: { name: "ayiqcha" },
          },
        },
      },
      followUps: [
        "Dasturdagi bitta buyruqni shunday almashtirki, robot sharga 🎈 kelsin. Qaysi buyruqni almashtirding?",
      ],
      hints: [
        "Dasturni yana bir bor oʻqi. Unda nechta buyruq bor?",
        "Boshida robot qayerda turibdi? Har bir strelka nimani bildiradi?",
        "Barmogʻingni kataklar boʻylab yurgiz: bitta strelka — bitta qadam. Oʻtgan kataklaringga nuqta qoʻyib borsang boʻladi.",
        "Avval faqat dastlabki uchta buyruqni bajar. Robot endi qayerda?",
        "Adashib ketmaslik uchun har bir bajarilgan buyruqni belgilab bor.",
      ],
      solution: {
        answer: "Kalit 🔑.",
        explanation: [
          "→ → →: robot pastki qator boʻylab uch katak oʻngga yuradi.",
          "↑ ↑: ikki katak yuqoriga chiqadi — ayiqcha 🧸 turgan katakka.",
          "← va ↑ ↑: bir qadam chapga va yana ikki katak yuqoriga — robot kalit 🔑 turgan katakda.",
        ],
        discuss: [
          "Sharga 🎈 yetib borish uchun ikkinchi yoki uchinchi → strelkani ← ga almashtirsa boʻladi. Birinchisini almashtirib boʻlmaydi: robot darhol maydondan chiqib ketadi. Buyruqning natijasi robot ayni paytda qayerda turganiga bogʻliq.",
        ],
      },
    },
    w1d2t7: {
      title: "Nechta kubik?",
      body: [
        {
          text: "Bu shaklni qurish uchun nechta kubik kerak boʻlgan? Esingda boʻlsin: kubiklar havoda osilib turmaydi!",
        },
      ],
      answer: { fields: { cubes: { label: "Kubiklar soni" } } },
      followUps: [
        "Kubiklar yoki konstruktordan shunday shakl qurib, oʻzingni tekshirib koʻr!",
        "Shakl yuqoridan qanday koʻrinishini chiz va har bir katakka u yerda nechta kubik borligini yoz.",
      ],
      hints: [
        "Rasmga yana bir bor qara. Qaysi kubiklar butunlay koʻrinib turibdi, qaysilari — faqat qisman?",
        "Pastki qavatda nechta kubik bor? Yuqorida-chi?",
        "Shakl yuqoridan qanday koʻrinishini chiz. Har bir kvadratchaga shu ustunchada nechta kubik turganini yozib qoʻy.",
        "Avval faqat pastki qavatni sana. Keyin yuqoridagisini qoʻsh.",
        "Yuqoridagi kubikning tagida albatta yana bittasi turibdi — hatto u koʻrinmasa ham!",
      ],
      solution: {
        answer: "5 ta kubik.",
        explanation: [
          "Pastki qavatda 4 ta kubik (2 × 2 kvadrat), yuqorida — 1 ta kubik.",
          "Pastdagi bitta kubik yashiringan: uni qoʻshnilari toʻsib turibdi, lekin u albatta bor — aks holda yuqoridagi kubik havoda osilib qolardi.",
        ],
        discuss: [
          "Agar farzandingiz «4» deb javob bersa, shaklni haqiqiy kubiklardan qurib koʻrishni taklif qiling. Tajriba — farazni tekshirishning eng yaxshi usuli.",
        ],
      },
    },
    w1d2t8: {
      title: "Multfilm",
      body: [
        { text: "Multfilm soat 17:30 da boshlanadi va 45 daqiqa davom etadi." },
        { visual: { caption: "Boshlanishi — 17:30" } },
        { label: "a)", text: "U soat nechada tugaydi?" },
        {
          label: "b)",
          text: "Boshqa bir multfilm soat 20:10 da tugadi, u ham 45 daqiqa davom etgan. U soat nechada boshlangan?",
        },
      ],
      answer: {
        fields: {
          end: { label: "a) tugash vaqti" },
          start: { label: "b) boshlanish vaqti" },
        },
      },
      followUps: ["b) javobini qanday tekshirsa boʻladi?"],
      hints: [
        "Yana bir bor oʻqi: multfilm soat nechada boshlanadi va qancha davom etadi?",
        "Bir soatda necha daqiqa bor?",
        "Soat chiz va uning katta milini 45 daqiqa oldinga sur.",
        "17:30 dan 18:00 gacha necha daqiqa?",
        "17:30 dan 18:00 gacha — 30 daqiqa. 45 daqiqadan yana qanchasi qoldi? b) uchun orqaga qarab yur: 20:10 dan 20:00 gacha — 10 daqiqa…",
      ],
      solution: {
        answer: "a) 18:15; b) 19:25.",
        explanation: [
          "a) 17:30 dan 18:00 gacha — 30 daqiqa, yana 15 daqiqa — 18:15.",
          "b) 20:10 dan 10 daqiqa orqaga — 20:00, yana 35 daqiqa orqaga — 19:25. Tekshirish: 19:25 dan 20:10 gacha — `35 + 10 = 45` daqiqa.",
        ],
        discuss: [
          "Bir soatda 100 emas, 60 daqiqa bor. Agar farzandingiz «18:75» deb javob bersa, bu bemaʼnilik emas, balki nega bunday boʻlmasligini muhokama qilish uchun yaxshi bahona.",
        ],
      },
    },
    w1d2t9: {
      title: "Tarozi",
      body: [
        { text: "Tarozilarga qara. Ular muvozanatda." },
        null,
        { label: "a)", text: "Nechta olma tarvuz bilan teng tortadi?" },
        { label: "b)", text: "Tarvuz bilan nok birgalikda nechta olma bilan teng tortadi?" },
      ],
      answer: {
        fields: {
          melon: { label: "a) olmalar soni" },
          melonPear: { label: "b) olmalar soni" },
        },
      },
      followUps: [
        "Shunday tarozi chiz: bir pallasida tarvuz, ikkinchisida esa noklar ham, olmalar ham boʻlsin — va tarozi muvozanatda tursin.",
      ],
      hints: [
        "Tarozilarga yana bir bor qara. Birinchi tarozida nima nima bilan teng tortyapti? Ikkinchisida-chi?",
        "Bitta nok haqida nimani bilamiz? U nechta olmaga teng?",
        "Tarvuz chiz, yoniga esa — uchta nok. Endi har bir nokni olmalar bilan almashtir.",
        "2 ta nok nechta olmaga teng? 3 ta nok-chi?",
        "Har bir nokni ikkita olma bilan almashtirish mumkin — tarozi muvozanatda qolaveradi.",
      ],
      solution: {
        answer: "a) 6 ta olma; b) 8 ta olma.",
        explanation: [
          "Tarvuz = 3 ta nok, har bir nok esa = 2 ta olma. Demak, tarvuz = `2 + 2 + 2 = 6` ta olma.",
          "Tarvuz va nok = `6 + 2 = 8` ta olma.",
        ],
        discuss: [
          "Bir narsani unga teng narsa bilan almashtirish — kelajakdagi algebraning asosiy gʻoyasi. Farzandingiz almashtirishlar zanjirini chizsa, juda yaxshi.",
          "Yechimdan keyingi savolning javobi: masalan, tarvuz = 2 ta nok + 2 ta olma yoki 1 ta nok + 4 ta olma.",
        ],
      },
    },
  },
  parent: {
    skills: [
      "Qoida izlash va farazni barcha misollarda tekshirish.",
      "Belgilar boʻyicha tasniflash — kelajakdagi informatika va sunʼiy intellektning asosi.",
      "Tayyor algoritmni oʻqish va bajarish.",
      "Vaqt bilan ishlash.",
    ],
    observe: [
      "Farzandingiz qoidani barcha juftliklarda tekshiradimi yoki birinchisidayoq toʻxtab qoladimi.",
      "Guruhlarga ajratishning bir qoidasi nega boshqasidan «yaxshiroq» ekanini tushuntira oladimi.",
    ],
    mistakes: [
      "Son mashinasida «+4» qoidasi (faqat birinchi juftlikka mos keladi).",
      "Vaqt haqidagi masalada «18:75» deb javob berish.",
    ],
    question: "Qoidang tasodifan mos kelib qolmaganini, balki haqiqatan toʻgʻri ekanini qanday bilding?",
  },
};
