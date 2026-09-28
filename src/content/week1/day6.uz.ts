/** Неделя 1, день 6 — по-узбекски (накладка на day6.ts, правила — docs/uzbek-style.md). */
import type { Uz } from "../localize";
import type { Day } from "../types";

export const day6Uz: Uz<Day> = {
  title: "Boshqa yoʻlini izla",
  habit: { name: "Men boshqa yoʻlini izlayman" },
  intro: [
    "Bugungi eng muhim savol: «Boshqacha qilsa boʻladimi?» 🚀",
    "Muhandislar, dasturchilar va olimlar birinchi topgan yechimda toʻxtab qolmaydi. Ular yaxshiroq yoʻl izlaydi: qisqaroq, tezroq, chiroyliroq.",
  ],
  tasks: {
    w1d6t1: {
      title: "Ketma-ket beshta son",
      body: [{ text: "Hisobla: `8 + 9 + 10 + 11 + 12 = ?`" }, { text: "Ikki xil usulini top — va eng tezini tanla." }],
      answer: { fields: { sum: { label: "Yigʻindi" } } },
      followUps: ["Xuddi shu usul bilan hisoblab koʻr: `18 + 19 + 20 + 21 + 22`."],
      hints: [
        "Misolni yana bir oʻqib chiq. Bu sonlarda qanday qiziq narsa bor?",
        "Qaysi ikki son birgalikda yaxlit son hosil qiladi?",
        "Birinchi sonni oxirgisi bilan, ikkinchisini esa oxiridan ikkinchisi bilan yoy chizib tutashtir.",
        "`8 + 12` necha boʻladi? `9 + 11` esa?",
        "Yana bir usul: har bir son 10 ga juda yaqin — biri sal koʻproq, biri sal kamroq. Ortigʻi kamini toʻldiradi.",
      ],
      solution: {
        explanation: [
          "Juftlab qoʻshamiz: `(8 + 12) + (9 + 11) + 10 = 20 + 20 + 10 = 50`.",
          "Yoki: oʻrtadagi son 10, jami beshta son bor — `10 + 10 + 10 + 10 + 10 = 50` (8 bilan 12 bir-birini tenglashtiradi, 9 bilan 11 ham).",
        ],
        discuss: [
          "`18 + 19 + 20 + 21 + 22 = 100` — xuddi shu usul. Agar farzandingiz «oʻrtadagi son besh marta» ekanini oʻzi payqasa, bu ajoyib kashfiyot.",
        ],
      },
    },
    w1d6t2: {
      title: "Buzuq kalkulyator",
      body: [
        {
          text: "Kalkulyatorning 🧮 «5» tugmasi buzilib qoldi. Bu tugmani bir marta ham bosmasdan, ekranda 50 sonini qanday hosil qilsa boʻladi?",
        },
        null,
        { text: "Iloji boricha koʻproq usul top!" },
      ],
      followUps: ["Qaysi usul eng qisqa — tugmalar eng kam bosiladigani?", "Ekranda 55 ni qanday hosil qilasan?"],
      hints: [
        "Yana bir oʻqib chiq: qaysi tugmani bosib boʻlmaydi? Qolganlarining hammasini bosish mumkin!",
        "50 ga yaqin qaysi sonlarda 5 raqami yoʻq? Masalan, 49 yoki 60.",
        "Kalkulyator tugmalarini chizib ol va 5 tugmasini ✗ bilan belgilab qoʻy.",
        "50 ni ikkita yaxlit sonni qoʻshib hosil qilib koʻr.",
        "Ayirish bilan ham boʻladi: kattaroq sondan ortigʻini ayir. Masalan, 60 dan boshla.",
      ],
      solution: {
        answer: "Usullar koʻp, masalan: `49 + 1`, `40 + 10`, `30 + 20`, `60 − 10`, `70 − 20`, `48 + 2`, `99 − 49`.",
        explanation: [
          "Eng muhimi — hech qaysi sonda 5 raqami boʻlmasligi kerak. Masalan, `25 + 25` toʻgʻri kelmaydi, `26 + 24` esa toʻgʻri keladi.",
        ],
        discuss: [
          "Bu masalaning yagona javobi yoʻq — u variantlarni izlashga oʻrgatadi. Farzandingizdan soʻrang: «Qaysi usul eng qisqa? Qaysi biri eng gʻaroyib?»",
          "Eng qisqa usullar — ikki xonali songa bir xonali sonni qoʻshish: `49 + 1`, `48 + 2`, `46 + 4`… («=» bilan birga 5 marta bosiladi). Ikkita bir xonali sondan 50 hosil qilib boʻlmaydi.",
          "55 sonini, masalan, shunday hosil qilsa boʻladi: `60 − 4 − 1` yoki `44 + 11`.",
        ],
      },
    },
    w1d6t3: {
      title: "Shokolad",
      body: [
        { text: "Shokolad 🍫 12 ta boʻlakchadan iborat: 3 qator, har bir qatorda 4 tadan boʻlakcha." },
        null,
        {
          text: "Bir marta sindirganda faqat bitta boʻlakni sindirish mumkin — boʻlakchalar orasidagi toʻgʻri chiziq boʻylab. Butun shokoladni alohida boʻlakchalarga ajratish uchun necha marta sindirish kerak?",
        },
        { text: "Turli usulda sindirib koʻr. Nimani payqaysan?" },
      ],
      answer: { fields: { breaks: { label: "Sindirishlar soni" } } },
      followUps: [
        "Kamroq sindiriladigan usul topsa boʻladimi? Nega?",
        "20 ta boʻlakchali shokolad uchun necha marta sindirish kerak?",
      ],
      hints: [
        "Yana bir oʻqib chiq: bir marta sindirganda faqat BITTA boʻlakni sindiramiz.",
        "Eng boshida nechta boʻlak bor? Oxirida nechta boʻlak boʻlishi kerak?",
        "Shokoladni chiz va sindirish chiziqlarini belgilab bor. Har safar sindirgandan keyin nechta boʻlak boʻlganini sanab bor.",
        "Kichikroq masalani yech: 2 ta boʻlakchali shokolad uchun necha marta sindirish kerak? Bir qatorda turgan 3 ta boʻlakcha uchun-chi? 4 ta boʻlakcha uchun (2 qator, har birida 2 tadan)?",
        "Qara-chi, har safar sindirganda boʻlaklar soni nechtaga ortyapti?",
      ],
      solution: {
        answer: "11 marta — qanday usulda sindirsang ham!",
        explanation: [
          "Har safar sindirganda bitta boʻlak ikkitaga aylanadi — boʻlaklar soni roppa-rosa bittaga ortadi.",
          "Boshida boʻlak bitta, oxirida esa 12 ta boʻlishi kerak. Demak, `12 − 1 = 11` marta sindirish kerak — qanday sindirmagin.",
        ],
        discuss: [
          "Kutilmagan natijali masala: turli usullar bir xil javob beradi. Matematiklar buni invariant deb atashadi. Tushuntirishga shoshilmang — farzandingiz 2–3 xil usulni rasmda tekshirib koʻrsin va oʻzi hayron qolsin. 20 ta boʻlakcha uchun 19 marta sindirish kerak.",
        ],
      },
    },
    w1d6t4: {
      title: "Boshi bitta — qoidasi har xil",
      body: [
        { text: "Qator shunday boshlanadi:" },
        null,
        {
          text: "Keyin qaysi son kelishi mumkin? Qoidasini oʻylab top. Endi esa BOSHQA qoida oʻylab top — shunda keyingi son ham boshqacha chiqsin!",
        },
      ],
      answer: {
        label: "Keyingi son",
        known: [
          { rule: "har bir son oldingisidan 2 marta katta" },
          { rule: "avval 1 ni, keyin 2 ni, keyin 3 ni qoʻshamiz…" },
          { rule: "navbatma-navbat 1 va 2 ni qoʻshamiz" },
          { rule: "qator takrorlanadi: 1, 2, 4, 1, 2, 4…" },
        ],
      },
      followUps: [
        "Qoidani aniq topish uchun nechta sonni bilish kerak?",
        "Boshi bir xil, keyin esa har xil boʻlib ketadigan ikkita qator oʻylab top.",
      ],
      hints: [
        "Yana bir qara: qatorda bor-yoʻgʻi uchta son — demak, qoidalar bir nechta boʻlishi mumkin!",
        "1 dan 2 qanday hosil boʻldi? 2 dan 4 qanday hosil boʻldi? Turli xil tushuntirishlar oʻylab top.",
        "Sonlar orasiga yoy chiz va ustiga nima qoʻshilganini yozib qoʻy: +1, +2…",
        "Kichikroq masalani yech: qator `2, 4, …` bilan boshlanadi. Keyin qaysi sonlar kelishi mumkin? Kamida ikkitasini oʻylab top.",
        "Qoida nima qoʻshishimiz haqida boʻlishi mumkin: har safar bir xil son, navbat bilan goh u, goh bu son yoki tobora kattaroq son. Yoki qoida «ikki barobar qilamiz» yoxud «boshidan takrorlaymiz» boʻlishi mumkin. Qaysi gʻoyalar 1, 2, 4 ga toʻgʻri keladi?",
      ],
      solution: {
        answer: "Toʻgʻri javob bir nechta: 8, 7, 5 va boshqalar. Eng muhimi — qoidani tushuntirib bera olish.",
        explanation: [
          "8 — agar har bir son oldingisidan 2 marta katta boʻlsa: 1, 2, 4, 8, 16…",
          "7 — agar ketma-ket 1, 2, 3, 4… qoʻshib borilsa: 1, 2, 4, 7, 11…",
          "5 — agar navbatma-navbat 1 va 2 qoʻshilsa: 1, 2, 4, 5, 7, 8…",
          "1 — agar qator takrorlansa: 1, 2, 4, 1, 2, 4…",
        ],
        discuss: [
          "Muhim ilmiy fikr: nechta son maʼlum boʻlmasin, doim ularga mos keladigan, ammo keyin boshqacha davom etadigan yana bir qoida oʻylab topish mumkin. Shuning uchun qoida yangi maʼlumotlarda tekshiriladi — olimlar shunday fikr yuritadi, sunʼiy intellekt tizimlari ham xuddi shunday «oʻrganadi».",
          "Agar farzandingiz boshqa son taklif qilsa, qoidasini tushuntirib berishni soʻrang: qoida 1, 2, 4 ga mos kelsa — javob qabul qilinadi.",
        ],
      },
    },
    w1d6t5: {
      title: "Eng tez yoʻl",
      body: [
        {
          text: "Davlatjon velosipedda 🚲 uyidan buvisinikiga ketyapti. Xaritada har bir yoʻlda necha daqiqa ketishi yozilgan.",
        },
        { label: "a)", text: "Qaysi yoʻl eng tez? Unda necha daqiqa ketadi?" },
        {
          label: "b)",
          text: "Bogʻ bilan doʻkon orasidagi yoʻl taʼmirlash uchun yopildi 🚧. Endi qaysi yoʻl eng tez?",
        },
      ],
      answer: {
        puzzle: {
          nodes: {
            home: { label: "Uy" },
            park: { label: "Bogʻ" },
            shop: { label: "Doʻkon" },
            school: { label: "Maktab" },
            granny: { label: "Buvijon" },
          },
          unit: "daqiqa",
        },
      },
      followUps: ["Nega koʻproq joydan oʻtadigan yoʻl tezroq boʻlib chiqishi mumkin?"],
      hints: [
        "Yana bir oʻqib chiq: eng tez yoʻl kerak — yoʻllar soni boʻyicha emas, daqiqalar boʻyicha.",
        "Uydan qaysi yoʻllar chiqadi? Har birida necha daqiqa ketadi?",
        "Bir nechta turli yoʻlni yozib chiq va har birining vaqtini hisobla.",
        "Doʻkongacha boʻlgan ikki yoʻlni solishtir: toʻgʻridan-toʻgʻri (Uy → Doʻkon) va bogʻ orqali (Uy → Bogʻ → Doʻkon). Qaysi biri tezroq?",
        "Har bir joy uchun uydan u yerga eng tez yoʻl bilan necha daqiqada borish mumkinligini yozib qoʻy. Eng yaqin joylardan boshla.",
      ],
      solution: {
        answer: "a) Uy → Bogʻ → Doʻkon → Maktab → Buvijon: 10 daqiqa; b) Uy → Doʻkon → Maktab → Buvijon: 12 daqiqa.",
        explanation: [
          "Bor-yoʻgʻi ikkita yoʻldan iborat Uy → Doʻkon → Buvijon yoʻlida `7 + 9 = 16` daqiqa ketadi.",
          "Doʻkongacha bogʻ orqali tezroq: 7 emas, `3 + 2 = 5` daqiqa.",
          "Doʻkondan buvijonnikiga maktab orqali tezroq: 9 emas, `3 + 2 = 5` daqiqa.",
          "Jami `5 + 5 = 10` daqiqa.",
        ],
        discuss: [
          "b) Bogʻ — Doʻkon yoʻli boʻlmasa: bogʻ va maktab orqali `3 + 8 + 2 = 13`, doʻkon va maktab orqali `7 + 3 + 2 = 12`, Uy → Doʻkon → Buvijon — 16. Eng tezi — 12 daqiqa.",
          "Koʻproq joydan oʻtadigan yoʻl tezroq boʻlib chiqishi mumkin: yoʻllar soni emas, daqiqalar yigʻindisi muhim (`3 + 2` — 7 dan tezroq). 5-maslahatdagi usul («avval eng yaqin joylar») — navigatorlar foydalanadigan eng qisqa yoʻlni topish algoritmining haqiqiy gʻoyasi.",
        ],
      },
    },
    w1d6t6: {
      title: "Teng ikkiga kes",
      body: [
        {
          text: "4 qator, har birida 4 tadan katak boʻlgan kvadratni katak chiziqlari boʻylab ikkita bir xil boʻlakka kes: bir boʻlakni ikkinchisining ustiga qoʻysang, ular aynan ustma-ust tushishi kerak. Boʻlaklarni burish va agʻdarish mumkin.",
        },
        {
          text: "Eng oson usul — rosa oʻrtasidan kesish. Yana kamida 2 ta usul top. Agar kvadratni burganda yoki koʻzguda aks ettirganda bir kesim ikkinchisiga aylansa — bu bitta usul hisoblanadi. Xohlasang, izlashda davom et: hammasi boʻlib 6 xil usul bor.",
        },
      ],
      followUps: ["Hamma kesimlaringda qanday umumiylik bor?"],
      hints: [
        "Yana bir oʻqib chiq: boʻlaklar shakli jihatidan ham, kattaligi jihatidan ham bir xil boʻlishi kerak.",
        "Kvadratda nechta katak bor? Har bir boʻlakda nechta katak boʻlishi kerak?",
        "Shunday kvadratlardan bir nechtasini chiz va turli kesish chiziqlarini sinab koʻr — pogʻonasimon qilib.",
        "Rosa oʻrtasidan kesishdan boshla, keyin kesish chizigʻida bitta «pogʻona» yasa.",
        "Ustaning siri: kvadratni yarim aylantirsang, bir boʻlak aynan ikkinchisining oʻrniga tushishi kerak.",
      ],
      solution: {
        answer:
          "Hammasi boʻlib 6 xil usul bor (kvadratni burganda yoki koʻzguda aks ettirganda bir-biriga aylanadigan kesimlarni bir xil deb hisoblaymiz).",
        explanation: [
          "Har bir boʻlakda 8 ta katak boʻlishi kerak.",
          "Hamma kesimlarda chiziq kvadratning markazidan oʻtadi, bir boʻlak esa ikkinchisini yarim aylantirishdan hosil boʻladi.",
        ],
        discuss: ["3–4 ta usul topishning oʻzi zoʻr natija. Oltalasini ham topish esa faxrlanishga arziydigan yutuq."],
      },
    },
    w1d6t7: {
      title: "Qanday qilib arzonroq olsa boʻladi?",
      body: [
        { text: "Doʻkonda bitta daftar 📒 3 ming soʻm turadi, 4 ta daftardan iborat toʻplam esa — 10 ming soʻm." },
        {
          text: "Davlatjonga 9 ta daftar kerak. Ularni qanday qilib eng arzonga sotib olsa boʻladi? Bu qancha turadi?",
        },
      ],
      answer: { fields: { price: { label: "Eng arzon narx", suffix: "ming soʻm" } } },
      followUps: ["11 ta daftar kerak boʻlsa-chi?"],
      hints: [
        "Yana bir oʻqib chiq: bitta daftar qancha turadi, toʻrttalik toʻplam-chi?",
        "Nechta daftar kerak? Nechta toʻplam olsa boʻladi?",
        "Jadval tuz: toʻplamlar soni (0, 1, 2, 3) — alohida daftarlar soni — hammasi qancha turadi.",
        "9 ta daftarni bittalab olsa, qancha turadi?",
        "Jadvaldagi har bir variantni hisoblab chiq va solishtir. Daftar keragidan ham koʻp chiqadigan variantni unutma.",
      ],
      solution: {
        answer: "2 ta toʻplam va 1 ta daftar — 23 ming soʻm.",
        explanation: [
          "9 ta daftarni bittalab olsa: 27 ming.",
          "1 ta toʻplam + 5 ta daftar: `10 + 15 = 25` ming.",
          "2 ta toʻplam + 1 ta daftar: `20 + 3 = 23` ming — eng arzoni.",
          "3 ta toʻplam (12 ta daftar): 30 ming — qimmatroq.",
        ],
        discuss: [
          "11 ta daftar uchun: 2 ta toʻplam + 3 ta daftar = 29 ming, 3 ta toʻplam esa 12 ta daftar uchun 30 ming. Qaysi biri foydaliroq — bu endi faqat matematika emas, sogʻlom fikr masalasi ham. Birga muhokama qiling!",
        ],
      },
    },
    w1d6t8: {
      title: "Tovuqlar va quyonlar",
      body: [
        { text: "Hovlida tovuqlar 🐔 va quyonlar 🐰 yuribdi. Hammasining birgalikda 7 ta boshi va 20 ta oyogʻi bor." },
        { text: "Nechta tovuq va nechta quyon bor? Ikki usulda yechib koʻr: rasm chizib va jadval tuzib." },
      ],
      answer: { fields: { hens: { label: "Tovuqlar" }, rabbits: { label: "Quyonlar" } } },
      followUps: ["Qaysi usul senga koʻproq yoqdi? Nega?", "Boshlar 7 ta, oyoqlar esa 22 ta boʻlsa-chi?"],
      hints: [
        "Yana bir oʻqib chiq: nechta bosh va nechta oyoq bor? Tovuqning nechta oyogʻi bor, quyonning-chi?",
        "Har bir hayvonning bitta boshi bor. Demak, hammasi boʻlib nechta hayvon…?",
        "7 ta doiracha — bosh chiz va har biriga 2 tadan oyoq chizib qoʻy. Yana nechta oyoq chizish qoldi?",
        "Sinab koʻr: quyon 1 ta, tovuq 6 ta boʻlsa — nechta oyoq boʻladi? Quyon 2 ta boʻlsa-chi?",
        "Har safar bitta tovuqni quyonga almashtirganimizda, oyoqlar 2 taga koʻpayadi.",
      ],
      solution: {
        answer: "4 ta tovuq va 3 ta quyon.",
        explanation: [
          "Rasm: 7 ta bosh chizamiz va har biriga 2 tadan oyoq beramiz — bu 14 ta oyoq. `20 − 14 = 6` ta oyoq qoldi, har bir quyonga yana 2 tadan — demak, quyonlar 3 ta, tovuqlar esa `7 − 3 = 4` ta.",
          "Jadval: 1 ta quyon va 6 ta tovuq — `4 + 12 = 16` ta oyoq; 2 ta quyon va 5 ta tovuq — `8 + 10 = 18`; 3 ta quyon va 4 ta tovuq — `12 + 8 = 20` ✓.",
          "Tekshiramiz: 4 ta tovuqning 8 ta oyogʻi, 3 ta quyonning 12 ta oyogʻi bor, jami 20 ta.",
        ],
        discuss: [
          "Mumtoz olimpiada masalasi. Rasm bilan yechish — kelajakdagi algebraik fikrlashning ilk koʻrinishi. Agar boshlar 7 ta, oyoqlar 22 ta boʻlsa, quyonlar 4 ta, tovuqlar 3 ta boʻladi.",
        ],
      },
    },
  },
  parent: {
    skills: [
      "Bir nechta yechim izlash va usullarni solishtirish.",
      "Optimallashtirish: eng tez yoʻl, eng arzon narx.",
      "Invariant: usulga bogʻliq boʻlmagan javob (shokolad).",
      "Bir nechta misolga qarab qoidani aniq bilib boʻlmasligini tushunish.",
    ],
    observe: [
      "Farzandingiz ikkinchi usulni oʻzi izlaydimi — yoki faqat soʻralganda.",
      "Yagona javobi yoʻq masalalarga qanday munosabatda boʻladi: qiziqadimi yoki oʻzini yoʻqotib qoʻyadimi.",
    ],
    mistakes: [
      "Shokolad masalasida — kamroq sindiriladigan «ayyorona» usul izlash. Tajribada tekshirib koʻrsin!",
      "Yoʻl haqidagi masalada — daqiqalari emas, yoʻllar soni kamroq boʻlgan yoʻlni tanlash.",
    ],
    question: "Oʻz usullaringdan qaysi biri senga eng koʻp yoqadi — nega?",
  },
};
