/** Hafta 4, 1-kun — oʻzbekcha (day1.ts ustiga qoplama, qoidalar — docs/uzbek-style.md). */
import type { Uz } from "../localize";
import type { Day } from "../types";

export const day1Uz: Uz<Day> = {
  title: "Shaklga qara",
  habit: { name: "Men shakllarni koʻraman" },
  intro: [
    "Geometriya haftasi boshlanyapti! Geometriya — shakllar haqidagi fan: chiziqlar, burchaklar, figuralar va ular qanday tuzilgani haqida.",
    "Bugun **shakllarni koʻrishni** oʻrganamiz: burchak va tomonlarni sanaymiz, bir-birining ichiga yashiringan kvadrat va uchburchaklarni topamiz.",
  ],
  tasks: {
    w4d1t1: {
      title: "Burchaklar va choʻplar",
      body: [
        { text: "{name} sanoq choʻplaridan shakllar teryapti: har bir tomon — bitta choʻp." },
        { label: "a)", text: "Uchburchakning nechta burchagi bor?" },
        { label: "b)", text: "Kvadratning nechta tomoni bor?" },
        { label: "c)", text: "Uchta uchburchak va ikkita kvadratning hammasi boʻlib nechta burchagi bor?" },
        { label: "d)", text: "Ikkita beshburchak uchun nechta choʻp kerak?" },
      ],
      answer: {
        fields: {
          a: { label: "a) uchburchak burchaklari" },
          b: { label: "b) kvadrat tomonlari" },
          c: { label: "c) jami burchaklar" },
          d: { label: "d) choʻplar" },
        },
      },
      followUps: [
        "Nega har qanday koʻpburchakning burchaklari tomonlari soniga teng?",
        "Oltiburchak uchun nechta choʻp kerak? «Yuzburchak» uchun-chi?",
      ],
      hints: [
        "Yana bir oʻqib chiq: shaklning har bir tomoni — bitta choʻp.",
        "«Uch-burchak» — nomining oʻzida nechta burchagi borligi yashiringan.",
        "Uchburchak va kvadrat chiz, har bir burchagiga nuqta qoʻy.",
        "Avval uchta uchburchakning burchaklarini sana, keyin ikkita kvadratnikini, soʻng qoʻsh.",
        "Beshburchakning 5 ta tomoni bor, demak, bitta shaklga 5 ta choʻp kerak.",
      ],
      solution: {
        answer: "a) 3; b) 4; c) 17; d) 10.",
        explanation: [
          "Shaklning nomida burchaklari soni yashiringan: uchburchak — 3, toʻrtburchak — 4, beshburchak — 5.",
          "c) Uchta uchburchak — `3 + 3 + 3 = 9` ta burchak, ikkita kvadrat — `4 + 4 = 8` ta. Jami `9 + 8 = 17`.",
          "d) Beshburchakning 5 ta tomoni bor: `5 + 5 = 10` ta choʻp.",
        ],
        discuss: [
          "Masaladan keyin yaxshi savol: nega shaklning burchaklari tomonlari soniga teng? Shaklni barmoq bilan aylanib chiqing: har bir tomondan keyin — burchak.",
        ],
      },
    },
    w4d1t2: {
      title: "Toʻrdagi kvadratchalar",
      body: [{ text: "Bu rasmda hammasi boʻlib nechta kvadrat bor? Kichiklarini ham, kattalarini ham sana." }],
      answer: { fields: { squares: { label: "Jami kvadratlar" } } },
      followUps: ["4 × 4 toʻrda nechta kvadrat boʻladi?", "Rasmdagi qaysi kvadrat yagona?"],
      hints: [
        "Yana bir oʻqi: faqat kataklar emas, har qanday oʻlchamdagi kvadratlar sanaladi.",
        "Toʻr 3 ga 3 katak. Unda qanday oʻlchamdagi kvadratlar boʻlishi mumkin?",
        "Barmogʻing bilan hamma 2 × 2 kvadratlarni aylantirib chiq: chap yuqoridagisidan boshla va uni surib bor.",
        "Oʻlchami boʻyicha sana: 1 × 1 kvadratlar nechta? 2 × 2 lar nechta? 3 × 3 lar nechta?",
        "1 × 1 kvadratlar — toʻqqizta. 2 × 2 kvadratni toʻrt joyga qoʻysa boʻladi. 3 × 3 esa — butun shakl.",
      ],
      solution: {
        answer: "14 ta kvadrat.",
        explanation: [
          "Kichik 1 × 1 kvadratlar — 9 ta.",
          "2 × 2 kvadratlar — 4 ta: chap yuqori, oʻng yuqori, chap pastki va oʻng pastki burchakda.",
          "3 × 3 kvadrat — bitta, bu butun shakl. Jami `9 + 4 + 1 = 14`.",
        ],
        discuss: [
          "Asosiy usul — tartib bilan, oʻlchami boʻyicha sanash. Agar farzandingiz 9 yoki 10 ta sanagan boʻlsa, «Katta kvadratlar ham sanaldimi?» deb soʻrang.",
        ],
      },
    },
    w4d1t3: {
      title: "Rangli shakllar",
      body: [
        {
          text: "Stolda uchta shakl yotibdi: doira, kvadrat va uchburchak. Bittasi qizil, bittasi koʻk, bittasi yashil.",
        },
        { items: ["Uchburchak qizil ham emas, koʻk ham emas.", "Doira koʻk emas."] },
        { text: "Har bir shakl qanday rangda?" },
      ],
      answer: {
        prompt: "Shakl qanday rangda?",
        items: {
          circle: { label: "Doira" },
          square: { label: "Kvadrat" },
          triangle: { label: "Uchburchak" },
        },
        options: {
          red: { label: "Qizil" },
          blue: { label: "Koʻk" },
          green: { label: "Yashil" },
        },
      },
      followUps: [
        "Qaysi maʼlumot birinchi yordam berdi? Boshqasidan boshlasa boʻlarmidi?",
        "Toʻrtta shakl haqida shunga oʻxshash topishmoq oʻylab top.",
      ],
      hints: [
        "Yana bir oʻqi: har bir shaklning oʻz rangi bor, ranglar takrorlanmaydi.",
        "Uchburchak haqida nima maʼlum? U qanday rangda boʻla olmaydi?",
        "Jadval chiz: qatorlarda — shakllar, ustunlarda — ranglar. Rang toʻgʻri kelmasa, ✗ qoʻy.",
        "Uchburchakdan boshla: agar u qizil ham, koʻk ham boʻlmasa, faqat bitta rang qoladi.",
        "Yashil rangni uchburchak oldi. Doira koʻk emas — demak, u…",
      ],
      solution: {
        answer: "Doira — qizil, kvadrat — koʻk, uchburchak — yashil.",
        explanation: [
          "Uchburchak qizil ham, koʻk ham emas, demak, u yashil.",
          "Qizil va koʻk qoldi. Doira koʻk emas, demak, u qizil.",
          "Kvadratga oxirgi rang — koʻk qoladi.",
        ],
        discuss: [
          "✗ va ✓ belgili jadval — mantiq haftasidagi oʻsha asbob. Farzandingiz har bir qadamni tushuntirib bersin.",
        ],
      },
    },
    w4d1t4: {
      title: "Uchburchak sonlar",
      body: [
        {
          text: "Doirachalardan uchburchaklar teriladi: birinchi qatorda 1 ta doiracha, ikkinchisida — 2 ta, uchinchisida — 3 ta va hokazo. Mana birinchi uchburchaklarda nechtadan doiracha bor:",
        },
        null,
        { label: "a)", text: "Beshinchi uchburchakda nechta doiracha bor?" },
        { label: "b)", text: "Sakkizinchisida-chi?" },
      ],
      answer: {
        fields: {
          fifth: { label: "a) beshinchisida" },
          eighth: { label: "b) sakkizinchisida" },
        },
      },
      followUps: [
        "Har bir keyingi uchburchak oldingisidan nechtaga koʻp?",
        "Doirachalardan ikkita bir xil uchburchakni bir-biriga qoʻshib qoʻy. Qanday shakl hosil boʻladi?",
      ],
      hints: [
        "Yana bir oʻqi: har bir yangi qator oldingisidan bitta doirachaga uzun.",
        "1, 3, 6, 10. Son har safar nechtaga oʻsayotganiga qara.",
        "Toʻrtinchi uchburchakni doirachalardan chiz va unga beshinchi qatorni qoʻsh.",
        "Birinchidan ikkinchiga 2 qoʻshildi, ikkinchidan uchinchiga — 3, uchinchidan toʻrtinchiga — 4.",
        "Beshinchi uchburchakka 5 ta doirachali qator qoʻshiladi: `10 + 5`. Keyin — 6, 7 va 8 ta doirachali qatorlar.",
      ],
      solution: {
        answer: "a) 15; b) 36.",
        explanation: [
          "Har bir yangi uchburchak — oldingisi va yana bitta yangi qator: `10 + 5 = 15`.",
          "Keyin: `15 + 6 = 21`, `21 + 7 = 28`, `28 + 8 = 36`.",
          "Birdaniga ham boʻladi: sakkizinchi uchburchakda `1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 = 36` ta doiracha bor.",
        ],
        discuss: [
          "Ikkita bir xil uchburchakni qoʻshsak, toʻgʻri toʻrtburchak hosil boʻladi: ikkita sakkizinchidan — 8 × 9 = 72 ta doiracha, bitta uchburchakda esa yarmi, 36 ta. Shu usul bilan istalgan uchburchak sonni qatorlarni bittalab qoʻshmasdan topish mumkin.",
        ],
      },
    },
    w4d1t5: {
      title: "Qalam chizadi",
      body: [
        {
          text: "Qalam katakli qogʻoz chiziqlari boʻylab yuradi va buyruqlarni bajaradi. «→ 3» — «oʻngga 3 katak», «↑ 2» — «yuqoriga 2 katak» degani. Qalam nima chizadi?",
        },
        { items: ["a) → 3, ↑ 3, ← 3, ↓ 3", "b) → 4, ↑ 2, ← 4, ↓ 2", "c) → 3, ↑ 2, ← 1", "d) → 2, ↑ 2, ← 2, ↓ 1"] },
      ],
      answer: {
        prompt: "Nima hosil boʻladi?",
        items: {
          a: { label: "a) → 3, ↑ 3, ← 3, ↓ 3" },
          b: { label: "b) → 4, ↑ 2, ← 4, ↓ 2" },
          c: { label: "c) → 3, ↑ 2, ← 1" },
          d: { label: "d) → 2, ↑ 2, ← 2, ↓ 1" },
        },
        options: {
          square: { label: "Kvadrat" },
          rect: { label: "Toʻgʻri toʻrtburchak, lekin kvadrat emas" },
          open: { label: "Chiziq tutashmadi" },
        },
      },
      followUps: [
        "c) dagi buyruqlarni toʻldir: toʻgʻri toʻrtburchak chiqsin.",
        "Qalam boshlangan joyiga qaytganini buyruqlarga qarab darrov qanday bilsa boʻladi?",
      ],
      hints: [
        "Yana bir oʻqi: har bir buyruq — yoʻnalish va kataklar soni.",
        "Shakl qalam boshlangan joyiga qaytsagina tutashadi.",
        "Har bir dasturni katakli qogʻozga chiz.",
        "Solishtir: qalam oʻngga necha katak, chapga necha katak yurdi? Yuqoriga va pastga-chi?",
        "«Oʻngga» «chapga» bilan, «yuqoriga» «pastga» bilan teng boʻlsa, chiziq tutashadi. Toʻrtala tomon teng boʻlsa — kvadrat.",
      ],
      solution: {
        answer: "a) kvadrat; b) toʻgʻri toʻrtburchak; c) va d) — chiziq tutashmadi.",
        explanation: [
          "a) Toʻrtala tomon 3 katakdan, qalam boshiga qaytdi — kvadrat.",
          "b) Tomonlari 4 va 2, qalam boshiga qaytdi — toʻgʻri toʻrtburchak, lekin kvadrat emas.",
          "c) Oʻngga 3, chapga esa faqat 1, pastga umuman yurmadi — boshiga yetib bormadi.",
          "d) Yuqoriga 2, pastga esa faqat 1 — pastga bitta katak yetmadi.",
        ],
        discuss: [
          "Bu rasm chizish uchun dasturlash tiliga birinchi qadam (Logo tilidagi «toshbaqa» kabi): shakl — buyruqlar ketma-ketligi.",
        ],
      },
    },
    w4d1t6: {
      title: "Kvadratdagi uchburchaklar",
      body: [{ text: "Kvadratda ikkala diagonal oʻtkazildi. Rasmda hammasi boʻlib nechta uchburchak bor?" }],
      answer: { fields: { triangles: { label: "Uchburchaklar" } } },
      followUps: ["Bitta diagonalni oʻchirsak, nechta uchburchak qoladi?", "Rasmdagi qaysi uchburchaklar bir xil?"],
      hints: [
        "Yana bir oʻqi: kichik ham, katta ham — hamma uchburchaklar sanaladi.",
        "Diagonallar kvadratni boʻlaklarga boʻladi. Nechta kichik boʻlak hosil boʻldi?",
        "Kvadratni qayta chiz va topilgan har bir uchburchakni rangli qalam bilan aylantir.",
        "Avval kichik uchburchaklarni — ichidan chiziq oʻtmaydiganlarini sana. Keyin ikkita kichikdan iborat uchburchaklarni izla.",
        "Har bir diagonal kvadratni ikkita katta uchburchakka boʻladi. Diagonallar esa ikkita.",
      ],
      solution: {
        answer: "8 ta uchburchak.",
        explanation: [
          "Kichik uchburchaklar 4 ta — kvadratning har bir tomoni yonida bittadan.",
          "Katta uchburchaklar ham 4 ta: har biri ikkita kichikdan iborat va diagonalga tayanadi. Birinchi diagonal ikkitasini, ikkinchisi yana ikkitasini beradi.",
          "Jami `4 + 4 = 8`.",
        ],
        discuss: [
          "Koʻp uchraydigan xato — faqat 4 ta kichigini sanash. Bir tomoni butun diagonal boʻlgan uchburchakni topishni soʻrang.",
        ],
      },
    },
    w4d1t7: {
      title: "Hoshiyali gilamcha",
      body: [
        {
          text: "Gilamcha kvadrat parchalardan tikilgan: uzunasiga 4 ta, eniga 3 ta. Gilamcha cheti boʻylab hoshiya tikiladi — u chetda yotgan har bir parchaga tegadi.",
        },
        null,
        { label: "a)", text: "Gilamchada hammasi boʻlib nechta parcha bor?" },
        { label: "b)", text: "Nechta parcha hoshiyaga tegadi?" },
        { label: "c)", text: "Oʻrtada, chetda boʻlmagan parchalar nechta?" },
      ],
      answer: {
        fields: {
          all: { label: "a) jami parchalar" },
          edge: { label: "b) chetda" },
          inner: { label: "c) oʻrtada" },
        },
      },
      followUps: [
        "5 × 4 gilamchaning oʻrtasida nechta parcha boʻlardi?",
        "Oʻrtasida bitta ham parcha boʻlmasligi uchun gilamcha qanday boʻlishi kerak?",
      ],
      hints: [
        "Yana bir oʻqi: «chetda» — gilamcha chetiga hech boʻlmaganda bitta tomoni bilan tegadigan parchalar.",
        "Uzunasiga 4 ta, eniga 3 ta parcha.",
        "Rasmda chetdagi kataklarni bir rang bilan, oʻrtadagilarini boshqa rang bilan aylantir.",
        "Avval hamma kataklarni sana: 4 tadan 3 qator. Keyin chetga tegmaydigan kataklarni top.",
        "Oʻrtada toʻrt tomonida ham qoʻshnisi bor kataklar qoladi. Ularni sanash qulay: yuqori va pastki qatorni, chap va oʻng ustunni olib tashla.",
      ],
      solution: {
        answer: "a) 12; b) 10; c) 2.",
        explanation: [
          "Jami `3 × 4 = 12` ta parcha.",
          "Yuqori va pastki qatorlarni, chetki ustunlarni olib tashlasak, 2 × 1 toʻgʻri toʻrtburchak qoladi — bu oʻrtadagi 2 ta parcha.",
          "Chetda: `12 − 2 = 10` ta parcha.",
        ],
        discuss: [
          "Masalaning nozik joyi: chetni toʻgʻridan-toʻgʻri sanashdan koʻra oʻrtasini sanab, ayirib tashlash qulayroq — burchaklarda katakni ikki marta sanab qoʻyish oson.",
        ],
      },
    },
    w4d1t8: {
      title: "Hamma toʻgʻri toʻrtburchaklar",
      body: [
        {
          text: "Rasmda hammasi boʻlib nechta toʻgʻri toʻrtburchak bor? Kvadratlar ham toʻgʻri toʻrtburchak hisoblanadi.",
        },
      ],
      answer: { fields: { rects: { label: "Toʻgʻri toʻrtburchaklar" } } },
      followUps: [
        "Ulardan nechtasi kvadrat?",
        "4 katakli tasmada nechta toʻgʻri toʻrtburchak bor? 5 katakli tasmada-chi?",
      ],
      hints: [
        "Yana bir oʻqi: kvadratlar ham toʻgʻri toʻrtburchak, ularni ham sanash kerak.",
        "Toʻr uzunasiga 3 katak, boʻyiga 2 katak. Toʻgʻri toʻrtburchak bitta qatorni yoki ikkala qatorni egallashi mumkin.",
        "3 katakli tasmani alohida chiz va undagi hamma toʻgʻri toʻrtburchaklarni top.",
        "3 katakli bitta tasmada: uzunligi 1 boʻlgani — uchta, 2 boʻlgani — ikkita, 3 boʻlgani — bitta.",
        "Bunday tasmani uch xil tanlash mumkin: yuqori qator, pastki qator va ikkala qator birga.",
      ],
      solution: {
        answer: "18 ta toʻgʻri toʻrtburchak.",
        explanation: [
          "3 katakli tasmada `3 + 2 + 1 = 6` ta toʻgʻri toʻrtburchak bor.",
          "Toʻgʻri toʻrtburchak yuqori qatorda, pastki qatorda yoki ikkala qatorni egallab turishi mumkin — uch hol.",
          "Jami `6 × 3 = 18`. Ulardan 8 tasi kvadrat: oltita kichik va ikkita 2 × 2 kvadrat.",
        ],
        discuss: [
          "Bu tartib bilan sanab chiqishga doir masala — kelgusi kombinatorika haftasiga koʻprik. Agar javob kamroq chiqqan boʻlsa, balandligi ikki qator boʻlgan toʻgʻri toʻrtburchaklar hisobga olinganini tekshiring.",
        ],
      },
    },
  },
  parent: {
    skills: [
      "Shakllarni tanish va qismlarini aytish: tomonlar, burchaklar, uchlar.",
      "Rasmda yashiringan shakllarni topish va ularni tartib bilan sanash.",
      "Shaklni buyruqlar bilan tasvirlash (rasm chizishni dasturlashga birinchi qadam).",
    ],
    observe: [
      "Farzandingiz tizim bilan (oʻlchami, qatorlari boʻyicha) sanayaptimi yoki tavakkal?",
      "Oʻzini tekshiryaptimi: «Katta shakllar tushib qolmadimi?»",
    ],
    mistakes: [
      "Faqat kichik kvadrat va uchburchaklarni sanash — boshida bu tabiiy. «Qaysi shakllar bir nechta qismdan iborat?» degan savol yordam beradi.",
      "Chetdagi burchak kataklarini ikki marta sanash.",
    ],
    question: "Rasmda qaysi shaklni topish eng qiyin boʻldi va nega?",
  },
};
