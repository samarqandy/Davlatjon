/** Hafta 4, 3-kun — oʻzbekcha (day3.ts ustiga qoplama, qoidalar — docs/uzbek-style.md). */
import type { Uz } from "../localize";
import type { Day } from "../types";

export const day3Uz: Uz<Day> = {
  title: "Qirq va yigʻ",
  habit: { name: "Men qirqaman va yigʻaman" },
  intro: [
    "Bugun qoʻlingda xayoliy qaychi bor ✂️. Shakllarni boʻlaklarga qirqib, boʻlaklardan yangi shakllar yigʻish mumkin.",
    "Kunning asosiy siri: shaklni qirqib, boʻlaklarini boshqacha joylashtirsang, **yuzasi oʻzgarmaydi** — nechta katak boʻlgan boʻlsa, shuncha qoladi.",
  ],
  tasks: {
    w4d3t1: {
      title: "Kataklarni sana",
      body: [
        { text: "Har bir shaklda nechta katak bor? Kataklar soni — shaklning yuzasi." },
        { label: "a)" },
        { label: "b)" },
        { label: "c)" },
      ],
      answer: {
        fields: {
          a: { label: "a) kataklar" },
          b: { label: "b) kataklar" },
          c: { label: "c) kataklar" },
        },
      },
      followUps: ["Qaysi shaklni ikkita bir xil boʻlakka qirqish mumkin?", "8 katakli oʻz shaklingni chiz."],
      hints: [
        "Yana bir oʻqi: har bir shaklning kataklarini sanaymiz.",
        "Yuza — shakl ichidagi kataklar soni.",
        "Ikki marta sanab qoʻymaslik uchun har bir katakka qalam bilan nuqta qoʻy.",
        "Qatorma-qator sana: yuqori qatorda nechta katak, ikkinchisida, uchinchisida nechta?",
        "Qatorlardagi sonlarni qoʻsh. c) shaklning qatorlari — 3, 2 va 2 ta katak.",
      ],
      solution: {
        answer: "a) 5; b) 6; c) 7.",
        explanation: [
          "a) Yuqori qator — 3 ta katak, pastda yana 2 ta: `3 + 1 + 1 = 5`.",
          "b) Uchta qatorning har birida ikkitadan katak: `2 + 2 + 2 = 6`.",
          "c) Qatorlarda 3, 2 va 2 ta katak: `3 + 2 + 2 = 7`.",
        ],
        discuss: [
          "Qatorlab sanash — toʻgʻri toʻrtburchak yuzasi formulasiga birinchi qadam: shuncha qator, har birida shuncha katak.",
        ],
      },
    },
    w4d3t2: {
      title: "Kvadratchalardan toʻgʻri toʻrtburchaklar",
      body: [
        {
          text: "Bir xil kvadratchalardan toʻgʻri toʻrtburchaklar teriladi — teshiksiz va hamma kvadratchalar ishlatiladi. 2 × 6 va 6 × 2 toʻgʻri toʻrtburchaklarni bir xil deb hisoblaymiz: bu faqat burilgan oʻsha toʻgʻri toʻrtburchak.",
        },
        { label: "a)", text: "12 ta kvadratchadan nechta har xil toʻgʻri toʻrtburchak terish mumkin?" },
        { label: "b)", text: "16 ta kvadratchadan-chi?" },
        { label: "c)", text: "24 ta kvadratchadan-chi?" },
      ],
      answer: {
        fields: {
          twelve: { label: "a) 12 tadan" },
          sixteen: { label: "b) 16 tadan" },
          twentyfour: { label: "c) 24 tadan" },
        },
      },
      followUps: [
        "Nechta kvadratchadan faqat bitta toʻgʻri toʻrtburchak — tasma terish mumkin?",
        "Nega 16 ta kvadratchadan kvadrat chiqadi, 12 tadan esa chiqmaydi?",
      ],
      hints: [
        "Yana bir oʻqi: hamma kvadratchalarni ishlatish kerak va teshik boʻlmasligi kerak.",
        "Toʻgʻri toʻrtburchak — bir nechta bir xil qator. 12 ta kvadratcha — nechtadan nechta qator?",
        "Toʻgʻri toʻrtburchaklarni tugmalardan ter yoki katakli qogʻozga chiz.",
        "Bitta qatordan boshla: 12 tadan 1 qator. Keyin 2 qator — nechtadan? 3 qator? 4 qator?",
        "Faqat son qoldiqsiz boʻlinadigan qatorlar mos keladi. Takrorlarni sanama: 3 tadan 4 qator — 4 tadan 3 qatorning oʻzi.",
      ],
      solution: {
        answer: "a) 3; b) 3; c) 4.",
        explanation: [
          "a) 12 = 1 × 12 = 2 × 6 = 3 × 4 — uchta toʻgʻri toʻrtburchak.",
          "b) 16 = 1 × 16 = 2 × 8 = 4 × 4 — uchta toʻgʻri toʻrtburchak, ulardan biri kvadrat.",
          "c) 24 = 1 × 24 = 2 × 12 = 3 × 8 = 4 × 6 — toʻrtta toʻgʻri toʻrtburchak.",
        ],
        discuss: [
          "Aslida bu son boʻluvchilari haqidagi masala. 7, 11 yoki 13 ta kvadratchadan faqat tasma chiqadi — bunday sonlar tub sonlar deyiladi.",
        ],
      },
    },
    w4d3t3: {
      title: "Qirqish haqida haqiqat",
      body: [{ text: "Qaysi gaplar toʻgʻri, qaysilari — yoʻq? Qogʻozda tekshirib koʻrsa boʻladi." }],
      answer: {
        prompt: "Toʻgʻrimi yoki yoʻqmi?",
        items: {
          diag: { label: "a) Kvadratni diagonal boʻyicha qirqsak, ikkita bir xil uchburchak hosil boʻladi." },
          always: { label: "b) Ikkita bir xil uchburchakdan har doim kvadrat yigʻish mumkin." },
          area: {
            label: "c) Shaklni boʻlaklarga qirqsak, hamma boʻlaklarning yuzasi birgalikda shaklning yuzasiga teng.",
          },
          rest: {
            label: "d) Toʻgʻri toʻrtburchakdan kvadrat qirqib olinsa, qolgan qismi ham kvadrat boʻlib chiqishi mumkin.",
          },
          perim: {
            label:
              "e) Kvadratni ikki boʻlakka qirqsak, har bir boʻlakning perimetri albatta kvadrat perimetridan kichik boʻladi.",
          },
        },
        options: {
          yes: { label: "Toʻgʻri" },
          no: { label: "Notoʻgʻri" },
        },
      },
      followUps: [
        "d) ga misol chiz: qaysi toʻgʻri toʻrtburchak ikkita kvadratga ajraladi?",
        "Kvadratni boʻlagining cheti uzun «tishli» boʻladigan qilib qanday qirqish mumkinligini oʻylab top.",
      ],
      hints: [
        "Har bir gapni yana bir oʻqi. «Har doim» va «albatta» soʻzlari bitta ham istisno yoʻq degani.",
        "«Har doim» soʻzi bor gapni «notoʻgʻri» deb isbotlash uchun bitta mos kelmaydigan misol yetarli.",
        "Har bir holni katakli qogʻozga chiz yoki qogʻozdan qirqib koʻr.",
        "b) Ikkita uzun ingichka uchburchak olib koʻr. Ulardan kvadrat yigʻiladimi?",
        "e) 4 × 4 kvadratni zinapoyasimon qilib qirq. Bitta boʻlakning perimetrini sana: kvadratning ikkita butun tomoni va yana uzun zinapoya.",
      ],
      solution: {
        answer: "a) toʻgʻri; b) notoʻgʻri; c) toʻgʻri; d) toʻgʻri; e) notoʻgʻri.",
        explanation: [
          "a) Diagonal kvadratni ikkita bir xil uchburchakka boʻladi — ularni bir-birining ustiga qoʻysa boʻladi.",
          "b) Kvadrat faqat alohida uchburchaklardan — toʻgʻri burchakli va shu burchak yonidagi tomonlari teng uchburchaklardan chiqadi. Ikkita ingichka uzun uchburchakdan kvadrat yigʻib boʻlmaydi.",
          "c) Qirqqanda kataklar hech qayoqqa yoʻqolmaydi — yuza saqlanadi.",
          "d) 2 × 1 toʻgʻri toʻrtburchak: 1 × 1 kvadratni qirqib olamiz, yana bitta 1 × 1 kvadrat qoladi.",
          "e) 4 × 4 kvadratni «zinapoya» qilib qirqsak, har bir boʻlakning perimetri — kvadratning ikkita tomoni (8) va zinapoya (8), yaʼni 16, butun kvadratnikidek. Egri-bugriroq qirqilsa, undan ham katta chiqadi.",
        ],
        discuss: [
          "Asosiy fikr: qirqqanda yuza oʻzgarmaydi, perimetr esa oʻzgaradi. e) band koʻp kattalarni ham hayron qoldiradi — katakli qogʻozda birga tekshirib koʻring.",
        ],
      },
    },
    w4d3t4: {
      title: "Quymoqni qirqamiz",
      body: [
        {
          text: "Dumaloq quymoqni chetidan chetigacha toʻgʻri qirqishyapti. Boʻlaklar surilmaydi. Mana eng koʻpi bilan nechta boʻlak hosil qilish mumkin:",
        },
        { items: ["1 ta qirqim — 2 ta boʻlak", "2 ta qirqim — 4 ta boʻlak", "3 ta qirqim — 7 ta boʻlak"] },
        { label: "a)", text: "4 ta qirqimda eng koʻpi bilan nechta boʻlak chiqadi?" },
        { label: "b)", text: "5 ta qirqimda-chi?" },
      ],
      answer: {
        fields: {
          four: { label: "a) 4 ta qirqimda" },
          five: { label: "b) 5 ta qirqimda" },
        },
      },
      followUps: [
        "Nega yangi qirqim oldingi hamma qirqimlarni, yana har xil nuqtalarda kesib oʻtishi kerak?",
        "Hamma qirqimlar quymoqning markazidan oʻtsa, nechta boʻlak chiqadi?",
      ],
      hints: [
        "Yana bir oʻqi: bizga boʻlaklarning eng koʻp soni kerak.",
        "2, 4, 7. Har bir yangi qirqim bilan boʻlaklar soni nechtaga oʻsdi?",
        "Doira chiz va 7 ta boʻlak chiqadigan qilib 3 ta qirqim oʻtkaz. Keyin toʻrtinchisini qoʻsh.",
        "Ikkinchi qirqim 2 ta boʻlak qoʻshdi, uchinchisi — 3 ta. Toʻrtinchisi nechta qoʻshadi?",
        "Har bir yangi qirqim oldingilarining hammasini kesib oʻtadi va kesmalari nechta boʻlsa, shuncha boʻlakni kesadi. Toʻrtinchisi 4 ta, beshinchisi 5 ta qoʻshadi.",
      ],
      solution: {
        answer: "a) 11; b) 16.",
        explanation: [
          "Yangi qirqim oldingi qirqimlarni kesib oʻtadi va ular uni kesmalarga boʻladi. Har bir kesma bitta boʻlakni ikkiga ajratadi.",
          "Toʻrtinchi qirqim oldingi uchtasini kesib oʻtadi — uning 4 ta kesmasi bor, u 4 ta boʻlak qoʻshadi: `7 + 4 = 11`.",
          "Beshinchisi 5 ta qoʻshadi: `11 + 5 = 16`.",
        ],
        discuss: [
          "2, 4, 7, 11, 16 qonuniyati — 2, 3, 4, 5 qoʻshib boramiz. Farzandingiz 4 ta qirqimli holni oʻzi chizsa, juda foydali: bitta nuqtada kesishgan «ortiqcha» qirqimlar boʻlaklarni kamaytiradi.",
        ],
      },
    },
    w4d3t5: {
      title: "Varaqdan kvadrat",
      body: [
        {
          text: "Toʻgʻri toʻrtburchak shaklidagi qogʻoz varagʻidan chizgʻichsiz kvadrat yasash mumkin. Qadamlarni tartib bilan joylashtir.",
        },
      ],
      answer: {
        prompt: "Qanday tartibda bajarish kerak?",
        items: {
          cut: { label: "Uchburchak ostiga tushmagan tasmani qirqib tashlash." },
          fold: {
            label:
              "Yuqori burchakni uzun tomonga shunday buklash kerakki, qisqa cheti uning ustiga roppa-rosa tushsin.",
          },
          open: { label: "Uchburchakni ochish — kvadrat hosil boʻldi." },
          press: { label: "Buklangan joyni yaxshilab tekislab bosish." },
        },
      },
      followUps: [
        "Nega hosil boʻlgan shaklning hamma tomonlari teng?",
        "Kvadrat ochilgandan keyin unda nima koʻrinadi?",
      ],
      hints: [
        "Hamma qadamlarni yana bir oʻqi. Qoʻlda faqat varaq boʻlsa, umuman nimadan boshlash mumkin?",
        "Buklangan chiziq boʻylab qirqish qulay. Demak, avval buklash kerak.",
        "Haqiqiy varaqni olib, hammasini qadamma-qadam bajarib koʻr.",
        "Birinchi qadam — burchakni buklash. Buklangan joy aniq boʻlishi uchun darhol nima qilish kerak?",
        "Tasmani faqat uchburchak buklangan paytda qirqish mumkin. Uni esa eng oxirida ochishadi.",
      ],
      solution: {
        answer: "Burchakni buklash → tekislab bosish → tasmani qirqish → ochish.",
        explanation: [
          "Avval burchakni qisqa cheti uzun chetiga tushadigan qilib buklaymiz va buklangan joyni tekislab bosamiz.",
          "Varaq buklangan paytda ortiqcha tasmani qirqamiz. Ochilgan uchburchak — kvadrat, buklangan chiziq esa uning diagonali boʻlib qoldi.",
        ],
        discuss: [
          "Kvadratning tomonlari teng, chunki buklaganda bir tomon roppa-rosa ikkinchisining ustiga tushdi. Origami uchun kvadrat shunday yasaladi.",
        ],
      },
    },
    w4d3t6: {
      title: "Yetishmayotgan boʻlak",
      body: [
        {
          text: "3 × 3 kvadratdan bir boʻlak qirqib olindi. Kvadrat butun boʻlishi uchun oʻrniga qaysi boʻlakni qoʻyish kerak? Boʻlakni burish mumkin, lekin ikkinchi tomoniga agʻdarish mumkin emas.",
        },
      ],
      answer: {
        prompt: "Qaysi boʻlak mos keladi?",
        options: {
          s: { label: "A" },
          z: { label: "B" },
          t: { label: "C" },
          l: { label: "D" },
        },
      },
      followUps: [
        "Agar boʻlakni agʻdarish mumkin boʻlganida, qaysi boʻlak mos kelardi?",
        "3 × 3 kvadratda C boʻlak sigʻadigan teshik chiz.",
      ],
      hints: [
        "Yana bir oʻqi: boʻlakni burish mumkin, agʻdarish esa mumkin emas.",
        "3 × 3 kvadratda toʻqqizta katak bor, beshtasi qoldi. Demak, boʻlak nechta katakdan iborat?",
        "Kvadratni katakli qogʻozga qayta chiz va boʻsh kataklarni boʻya — bu kerakli boʻlakning shakli.",
        "Teshik ikki pogʻonali zinapoyaga oʻxshaydi. Boʻlaklardan qaysilari ham zinapoya?",
        "Zinapoya ikkita — A va B, lekin ular bir-birining koʻzgudagi aksi. Har birini chorak aylanaga bur va teshik bilan solishtir.",
      ],
      solution: {
        answer: "A boʻlak.",
        explanation: [
          "Teshik — zinapoya shaklidagi toʻrtta katak: oʻrta qatorning oʻngida ikkitasi va pastki qatorning chapida ikkitasi.",
          "A boʻlak chorak aylanaga burilsa, teshikka roppa-rosa tushadi.",
          "B boʻlak — koʻzgudagi zinapoya: uni faqat ikkinchi tomoniga agʻdarsagina mos kelardi. C va D boshqa shaklda.",
        ],
        discuss: [
          "Burish va agʻdarish — har xil narsalar. Qiyin boʻlsa, boʻlaklarni qogʻozdan qirqib oling va agʻdarmasdan joyiga qoʻyib koʻring.",
        ],
      },
    },
    w4d3t7: {
      title: "Hammom uchun plitka",
      body: [
        {
          text: "Hammomning poli — uzunligi 3 metr, eni 2 metr boʻlgan toʻgʻri toʻrtburchak. Uni kvadrat plitkalar bilan tirqishsiz qoplamoqchi.",
        },
        { label: "a)", text: "Plitkaning tomoni 50 santimetr boʻlsa, nechta plitka kerak?" },
        { label: "b)", text: "Plitkaning tomoni 1 metr boʻlsa-chi?" },
      ],
      answer: {
        fields: {
          small: { label: "a) 50 sm li plitkalar" },
          big: { label: "b) 1 m li plitkalar" },
        },
      },
      followUps: [
        "Nega kichik plitkalar kattalaridan 4 marta koʻp kerak?",
        "4 m × 3 m pol uchun tomoni 50 sm boʻlgan nechta plitka kerak boʻladi?",
      ],
      hints: [
        "Yana bir oʻqi: plitkalar kvadrat, tirqish yoʻq.",
        "1 metrda 100 santimetr bor. 1 metrga 50 santimetrli nechta plitka sigʻadi?",
        "Polni katakli qogʻozga chiz: bitta katak — 50 sm li bitta plitka boʻlsin.",
        "Avval uzun devor (3 metr) boʻylab, keyin qisqa devor (2 metr) boʻylab plitkalarni sana.",
        "Uzun devor boʻylab — 6 ta plitka, qisqa devor boʻylab — 4 ta. Bu nechtadan nechta qator?",
      ],
      solution: {
        answer: "a) 24 ta plitka; b) 6 ta plitka.",
        explanation: [
          "a) Bir metrda 50 sm li ikkita plitka bor. 3 metr boʻylab — 6 ta, 2 metr boʻylab — 4 ta plitka. Jami `6 × 4 = 24`.",
          "b) 1 metrli plitkalar: uzunasiga 3 ta, eniga 2 ta, `3 × 2 = 6`.",
        ],
        discuss: [
          "1 × 1 m li katta plitka 50 × 50 sm li toʻrtta kichik plitkadan iborat — shuning uchun kichiklari 4 marta koʻp kerak. Bu yuza birliklarini tushunishga birinchi qadam.",
        ],
      },
    },
    w4d3t8: {
      title: "Kvadratlarga qirq",
      body: [
        {
          text: "4 × 4 kvadratni kataklar chizigʻi boʻylab kichikroq kvadratlarga qirqishyapti: 1 × 1, 2 × 2 va 3 × 3.",
        },
        { label: "a)", text: "Kvadrat 10 ta kvadratga qirqildi. Ular orasida nechta 2 × 2 kvadrat bor?" },
        { label: "b)", text: "Agar 7 ta kvadrat chiqqan boʻlsa-chi — ular orasida nechta 1 × 1 kvadrat bor?" },
      ],
      answer: {
        fields: {
          ten: { label: "a) 2 × 2 kvadratlar" },
          seven: { label: "b) 1 × 1 kvadratlar" },
        },
      },
      followUps: [
        "Ikkala qirqishni ham katakli qogʻozga chiz.",
        "4 × 4 kvadratni 4, 7, 10 va 13 ta kvadratga qirqib koʻr. Yana qanday sonlar chiqadi?",
      ],
      hints: [
        "Yana bir oʻqi: 4 × 4 kvadratning yuzasi 16 katak. Boʻlaklar birgalikda shu 16 katakni berishi kerak.",
        "1 × 1 kvadrat — 1 katak, 2 × 2 — 4 katak, 3 × 3 — 9 katak.",
        "4 × 4 kvadrat chiz va uni 10 ta boʻlakka qirqib koʻr.",
        "Boʻlaklar orasida 3 × 3 kvadrat boʻlishi mumkinmi? Unda nechta katak qoladi va ularni nechta boʻlakka qirqish mumkin?",
        "3 × 3 boʻlmasa: har bir 2 × 2 boʻlak bitta emas, 4 ta katakni egallaydi. 10 ta bir katakli boʻlak faqat 10 ta katak berardi — 6 ta yetmaydi. 6 ni qoʻshish uchun nechta 2 × 2 kvadrat kerak?",
      ],
      solution: {
        answer: "a) 2; b) 4.",
        explanation: [
          "3 × 3 kvadrat bilan 7 ta katak qoladi — bu burchakcha faqat 7 ta 1 × 1 kvadratga qirqiladi. 3 × 3 bilan birga bu 8 ta boʻlak, 10 ham, 7 ham emas.",
          "a) Demak, boʻlaklar — faqat 1 × 1 va 2 × 2. Agar 10 tasining hammasi 1 × 1 boʻlganida, 10 ta katak chiqardi. Har bir 2 × 2 yana 3 ta katak qoʻshadi: 6 ta yetmaydi, ikkita 2 × 2 kvadrat va 8 ta 1 × 1 kvadrat kerak.",
          "b) 7 ta boʻlak: `16 − 7 = 9` ta katak yetmaydi, bu uchta 2 × 2 kvadrat. Qolgan `7 − 3 = 4` tasi — 1 × 1 kvadratlar. Haqiqatan ham shunday: kvadratning uch choragi 2 × 2 dan, oxirgi choragi esa toʻrtta katak.",
        ],
        discuss: [
          "Bu yerda ikkinchi haftadagi «tovuq va quyonlar» masalalaridagi usul ishlaydi: hamma boʻlaklar kichik deb faraz qilib, nima yetishmasligini koʻrish.",
        ],
      },
    },
  },
  parent: {
    skills: [
      "Yuzani kataklar soni sifatida tushunish va qirqqanda u oʻzgarmasligini koʻrish.",
      "Shaklni burishni agʻdarishdan ajratish.",
      "Hayotiy masalada metrlarni santimetrlarga oʻtkazish.",
    ],
    observe: [
      "Farzandingiz javob berishdan oldin gapni qogʻozda tekshirib koʻrishga harakat qilyaptimi?",
      "«Har doim» soʻzini rad etadigan misol topa oladimi?",
    ],
    mistakes: [
      "Qirqqanda perimetr ham saqlanadi deb oʻylash.",
      "Plitka masalasida birliklarni oʻtkazmasdan metrni santimetrga boʻlish.",
    ],
    question: "Bugun nima kutilmagan boʻldi: qirqqanda nima oʻzgaradi, nima oʻzgarmaydi?",
  },
};
