/** Неделя 1, день 1 — по-узбекски (накладка на day1.ts, правила — docs/uzbek-style.md). */
import type { Uz } from "../localize";
import type { Day } from "../types";

export const day1Uz: Uz<Day> = {
  title: "Diqqat bilan qara",
  habit: { name: "Men payqayman" },
  intro: [
    "Salom, {name}! 👋",
    "Matematiklar boshqalar koʻrmagan narsani payqay oladi: qulay sonlarni, yashirin qoidalarni, koʻzdan qochadigan mayda-chuydalarni.",
    "Bugun ziyraklikni mashq qilamiz. Shoshilma: tez javob bergandan koʻra, sal uzoqroq oʻylagan yaxshi.",
  ],
  tasks: {
    w1d1t1: {
      title: "Deyarli yigirma",
      body: [
        { text: "Hisoblab koʻr: `19 + 19 + 19 = ?`" },
        { text: "Avval oʻzingga qulay usulda hisobla. Keyin eng tez usulini izlab koʻr." },
      ],
      followUps: [
        "Endi tez hisobla: `29 + 29 + 29`. Oʻsha usul bu yerda ham asqotadimi?",
        "Qanday hisoblaganingni oyingga yoki dadangga tushuntirib ber.",
      ],
      hints: [
        "Misolni yana bir bor oʻqib chiq. Unda 19 soni necha marta takrorlanadi?",
        "19 soni haqida nimani bilasan? Uning yonginasida qaysi yaxlit son turibdi?",
        "Uchta tasma chiz, har birida 20 tadan katakcha boʻlsin. Har bir tasmada bittadan katakchani ustidan chizib qoʻy. Nechta katakcha qoldi?",
        "Kichikroq misolni yechib koʻr: `9 + 9 + 9`. Avval `10 + 10 + 10` ni hisoblab, keyin ortiqchasini olib tashlasa boʻladimi?",
        "`20 + 20 + 20` ni hisobla. Har safar keragidan 1 ta ortiq olding. Hammasi boʻlib qancha ortiqcha boʻldi?",
      ],
      solution: {
        explanation: [
          "`20 + 20 + 20 = 60`. Har bir 19 soni 20 dan 1 ga kam, demak, 3 ta ortiqcha olingan: `60 − 3 = 57`.",
        ],
        discuss: [
          "Boshqa usul: `19 + 19 = 38`, `38 + 19 = 57`. Ikkala usul ham toʻgʻri — farzandingiz ularni solishtirib, qaysi biri qulayroq ekanini aytsin.",
          "Qoʻshimcha savol: `29 + 29 + 29 = 90 − 3 = 87`.",
        ],
      },
    },
    w1d1t2: {
      title: "Qulay juftliklar",
      body: [
        { text: "Hamma sonlarni qoʻsh: `6 + 7 + 4 + 3 + 5 + 5 = ?`" },
        { text: "Sonlarni tartib bilan qoʻshish shart emas. Qanday qilsang, hisoblash oson boʻladi?" },
      ],
      answer: { fields: { sum: { label: "Yigʻindi" } } },
      followUps: [
        "Oltita sondan oʻz misolingni tuz — ularni juft-juft qilib oson hisoblash mumkin boʻlsin.",
        "Nega sonlarni istalgan tartibda qoʻshsa boʻladi?",
      ],
      hints: [
        "Misolni yana bir bor oʻqi. Unda nechta son bor?",
        "Qaysi ikki son qoʻshilganda roppa-rosa 10 boʻladi? Esla: 1 va 9, 2 va 8…",
        "Sonlarni yozib ol va qoʻshilganda 10 boʻladiganlarini yoy bilan tutashtir.",
        "`6 + 4` necha boʻladi? `7 + 3` esa?",
        "Hamma sonlar oʻnliklarga yigʻilgach, nechta oʻnlik chiqqanini sanash qoladi, xolos.",
      ],
      solution: {
        discuss: [
          "Qoʻshiluvchilarning oʻrnini almashtirish mumkin — yigʻindi oʻzgarmaydi. Qulay tartib kuchni tejaydi va xatolarni kamaytiradi.",
        ],
      },
    },
    w1d1t3: {
      title: "Kim qayerda yashaydi?",
      body: [
        {
          text: "Mushuk, Kuchuk va Toʻtiqush qizil, koʻk va yashil uychalarda yashaydi. Har bir uychada faqat bittasi yashaydi.",
        },
        {
          visual: {
            items: [
              { label: "qizil" },
              { label: "koʻk" },
              { label: "yashil" },
              { label: "Mushuk" },
              { label: "Kuchuk" },
              { label: "Toʻtiqush" },
            ],
          },
        },
        { text: "Maʼlumki:" },
        { items: ["Mushuk qizil uychada ham, koʻk uychada ham yashamaydi.", "Kuchuk qizil uychada yashamaydi."] },
        { text: "Kim qaysi uychada yashaydi?" },
        {
          text: "Jadvaldan foydalansang boʻladi: hayvon u yerda yashay olmasa — ✗, aniq yashasa — ✓ qoʻy.",
        },
        {
          visual: {
            rows: ["🐱 Mushuk", "🐶 Kuchuk", "🦜 Toʻtiqush"],
            cols: ["qizil", "koʻk", "yashil"],
          },
        },
      ],
      answer: {
        prompt: "Har bir uychada kim yashaydi?",
        items: {
          red: { label: "Qizil uycha" },
          blue: { label: "Koʻk uycha" },
          green: { label: "Yashil uycha" },
        },
        options: {
          cat: { label: "🐱 Mushuk" },
          dog: { label: "🐶 Kuchuk" },
          parrot: { label: "🦜 Toʻtiqush" },
        },
      },
      followUps: ["Qaysi shart senga eng koʻp yordam berdi? Nega?", "Ikkinchi shartsiz ham yechsa boʻlarmidi?"],
      hints: [
        "Shartni yana bir bor oʻqi. Kim haqida eng koʻp maʼlumot bor?",
        "Mushuk haqida aniq nimani bilamiz? U qaysi uychalarda YASHAMAYDI?",
        "Jadvalni toʻldir: hayvon yashay olmaydigan joyga ✗ qoʻy.",
        "Agar Mushukka faqat bitta uycha qolgan boʻlsa, demak, u aynan oʻsha yerda yashaydi.",
        "Bitta uychani Mushuk egallagach, Kuchukka yana bir qara: unga qaysi uycha qoldi?",
      ],
      solution: {
        answer: "Mushuk — yashil uychada, Kuchuk — koʻk uychada, Toʻtiqush — qizil uychada.",
        explanation: [
          "Mushuk qizilda ham, koʻkda ham emas — demak, yashilda.",
          "Kuchuk qizilda emas, yashil esa band — demak, Kuchuk koʻk uychada.",
          "Toʻtiqushga qizil uycha qoladi.",
        ],
        discuss: [
          "Belgilar qoʻyiladigan jadval — mantiqiy masalalarning asosiy quroli. Farzandingiz uni oʻzi toʻldira boshlasa, albatta maqtang.",
          "Ikkinchi shart boʻlmasa, javob yagona boʻlmasdi: Kuchuk bilan Toʻtiqush uychalarini almashtirib olishi mumkin edi.",
        ],
      },
    },
    w1d1t4: {
      title: "Keyingisi qaysi?",
      body: [
        { text: "Sonlar qatorini davom ettir." },
        { label: "a)" },
        { label: "b)" },
        { text: "Ikki qatorni solishtir: ularning qoidalari nimasi bilan farq qiladi?" },
      ],
      answer: {
        fields: {
          a5: { label: "a) beshinchi son" },
          a6: { label: "a) oltinchi son" },
          b5: { label: "b) keyingi son" },
        },
      },
      followUps: ["Qaysi qatorda sonlar tezroq oʻsadi? Nega?", "b) qatorda 32 dan keyin qaysi son keladi?"],
      hints: [
        "Qatorlarga yana bir bor qara. Sonlarni chapdan oʻngga oʻqi.",
        "Har bir son oldingisidan nechtaga katta? Har bir qoʻshni juftlik ustiga farqini yozib qoʻy.",
        "Qoʻshni sonlar orasiga yoy chiz va ustiga nechta qoʻshilganini yozib qoʻy.",
        "a) qatorda qadam doim bir xil. b) qatorda ham bir xilmi?",
        "b) qatorda har bir sonni oldingisi bilan solishtir: 2 ga 2 qoʻshildi, 4 ga 4 qoʻshildi… 16 ga nechta qoʻshiladi?",
      ],
      solution: {
        answer: "a) 15, 18; b) 32.",
        explanation: [
          "a) Har safar 3 qoʻshamiz: `12 + 3 = 15`, `15 + 3 = 18`.",
          "b) Har bir son oldingisidan 2 marta katta (son oʻziga oʻzi qoʻshiladi): `16 + 16 = 32`.",
        ],
        discuss: [
          "a) qatorda qadam oʻzgarmaydi, b) qatorda esa qadam oʻsib boradi — shuning uchun sonlar tobora tez oʻsadi. Ikki baravar oshirish bu hafta hali koʻp marta uchraydi.",
          "32 dan keyin 64 keladi.",
        ],
      },
    },
    w1d1t5: {
      title: "Robot bayroqchaga boradi",
      body: [
        {
          text: "Robot 🤖 toʻrtta buyruqni tushunadi: **↑** yuqoriga, **↓** pastga, **←** chapga, **→** oʻngga. Har bir buyruq — bir katakka bitta qadam. Devorlardan (toʻq rangli kataklardan) oʻtib boʻlmaydi.",
        },
        { text: "Strelkalardan dastur tuz: robot bayroqchaga 🚩 yetib borsin." },
      ],
      followUps: [
        "Dasturingda nechta buyruq bor? Qisqaroq qilsa boʻladimi?",
        "Xuddi shunday uzunlikdagi boshqa dastur top.",
        "Bayroqchaga 7 qadamdan kamroqda yetib boʻlmasligini qanday isbotlaysan?",
      ],
      hints: [
        "Yana bir bor oʻqi: robot qaysi buyruqlarni tushunadi? U nimadan oʻta olmaydi?",
        "Robot qayerda, bayroqcha qayerda? Bayroqcha necha katak oʻngroqda va necha katak yuqoriroqda?",
        "Barmogʻingni kataklar boʻylab yurgizib, robotdan bayroqchagacha yoʻl top — devorlarni aylanib oʻt.",
        "Avval istalgan yoʻlni top, uzun boʻlsa ham mayli. Keyin undagi qaysi qadamlar ortiqcha ekanini oʻylab koʻr.",
        "Robot baribir 4 qadam oʻngga va 3 qadam yuqoriga yurishi kerak. Roppa-rosa 7 ta buyruq bilan yetib borsa boʻladimi?",
      ],
      solution: {
        answer: "Masalan: ↑ ↑ ↑ → → → → (7 ta buyruq).",
        explanation: [
          "Bayroqcha robotdan 4 katak oʻngda va 3 katak yuqorida. Demak, kamida 4 ta → va 3 ta ↑ buyruq kerak — jami kamida 7 ta.",
          "7 ta buyruqdan iborat dasturlar bir nechta, masalan: ↑↑↑→→→→ yoki →→↑↑→↑→.",
        ],
        discuss: [
          "Eng muhim savol — «qisqaroq qilsa boʻladimi?». «Bundan qisqa boʻlmaydi» degan isbot — optimal algoritm bilan ilk tanishuv.",
        ],
      },
    },
    w1d1t6: {
      title: "Koʻzgudagi kapalak",
      body: [
        {
          text: "Oʻrtadagi chiziq — bu koʻzgu. Oʻng tomondagi kataklarni shunday boʻyaki, simmetrik rasm chiqsin — xuddi koʻzgudagi aksdek.",
        },
      ],
      followUps: [
        "Toʻgʻri aks ettirganingni qanday tekshirding?",
        "Katakli daftar varagʻiga oʻzingning simmetrik rasmingni chiz.",
      ],
      hints: [
        "Yana bir bor qara: koʻzgu-chiziq qayerdan oʻtgan?",
        "Chap yarimdagi qaysi kataklar chiziqning yonginasida turibdi? Ularning aksi qayerda boʻladi?",
        "Qatorma-qator boʻya. Boʻyalgan katakdan chiziqqacha necha katak borligini sana.",
        "Eng yuqori qatordan boshla: unda bor-yoʻgʻi bitta boʻyalgan katak bor — eng chetda.",
        "Aks chiziqdan xuddi shunday uzoqlikda turadi, faqat narigi tomonda.",
      ],
      solution: {
        answer: "Oʻng yarim — chap yarimning koʻzgudagi aksi: kapalak hosil boʻladi.",
        explanation: [
          "Har bir boʻyalgan katak chiziqdan xuddi shunday uzoqlikda aks etadi: chiziq yonidagi katak aksida ham chiziq yonida, chetdagi katak aksida ham chetda turadi.",
        ],
        discuss: [
          "Koʻp uchraydigan xato — bir katakka surilib ketish yoki aks ettirish oʻrniga «nusxa koʻchirish» (rasm aks etmaydi, shunchaki takrorlanadi). Farzandingizdan har bir qatorni alohida tekshirib chiqishni soʻrang.",
        ],
      },
    },
    w1d1t7: {
      title: "Stikerlar",
      body: [
        { text: "Bitta stiker 5 tanga turadi. {name:da} 23 ta tanga bor." },
        { label: "a)", text: "U nechta stiker sotib olishi mumkin?" },
        { label: "b)", text: "Unda nechta tanga qoladi?" },
      ],
      answer: {
        fields: {
          stickers: { label: "a) nechta stiker" },
          left: { label: "b) necha tanga qoladi" },
        },
      },
      followUps: ["Agar {name:da} 25 ta tanga boʻlganida-chi?", "5 ta stiker sotib olish uchun necha tanga yetmaydi?"],
      hints: [
        "Masalani yana bir bor oʻqi. Bitta stiker necha tanga turadi? Jami nechta tanga bor?",
        "Nimani bilish kerak: 23 ta tangadan 5 tadan nechta guruh tuzish mumkin.",
        "23 ta doiracha chiz — bular tangalar. Ularni 5 tadan qilib chiziq bilan oʻrab chiq.",
        "2 ta stikerga necha tanga kerak? 3 tasiga-chi?",
        "Beshtalab sana: 5, 10, 15, 20… Tangalar yetishi uchun qayerda toʻxtash kerak?",
      ],
      solution: {
        answer: "a) 4 ta stiker; b) 3 ta tanga.",
        explanation: [
          "4 ta stiker `5 + 5 + 5 + 5 = 20` tanga turadi. `23 − 20 = 3` ta tanga qoladi.",
          "5 ta stikerga 25 ta tanga kerak, {name:da} esa bor-yoʻgʻi 23 ta.",
        ],
        discuss: [
          "25 ta tanga bilan — 5 ta stiker olinadi va hech narsa qolmaydi. Beshinchi stikerga 2 ta tanga yetmaydi.",
        ],
      },
    },
    w1d1t8: {
      title: "Nechta kvadrat?",
      body: [{ text: "Bu rasmda jami nechta kvadrat bor? Diqqat bilan sana — birortasini tushirib qoldirish oson!" }],
      answer: { fields: { squares: { label: "Jami kvadratlar" } } },
      followUps: [
        "Hech narsani tushirib qoldirmaslik uchun nima qilish kerak?",
        "3 qatorli, har qatorida 3 tadan katakchasi bor shaklda nechta kvadrat bor?",
      ],
      hints: [
        "Savolni yana bir bor oʻqi: faqat kichiklari emas, HAMMA kvadratlar soʻralyapti.",
        "Kvadratlar qanday oʻlchamda boʻladi? Kvadrat bir nechta katakchadan iborat boʻlishi mumkinmi?",
        "Shaklni bir necha marta chizib ol va har bir rasmda topgan bitta kvadratingning chetini rangli qalam bilan chizib chiq.",
        "Kichikroq masalani yech: 4 katakchali shaklda — 2 qator, har birida 2 tadan — nechta kvadrat bor?",
        "Tartib bilan sana: avval bitta katakchali hamma kvadratlarni, keyin 4 katakchali hamma kvadratlarni. Bu yerga 9 katakchali kvadrat sigʻadimi?",
      ],
      solution: {
        answer: "8 ta kvadrat.",
        explanation: [
          "Kichik kvadratlar (1 × 1) — 6 ta.",
          "2 × 2 kvadratlar — 2 ta: chapdagisi va oʻngdagisi (ular qisman ustma-ust tushadi).",
          "3 × 3 kvadrat sigʻmaydi: shaklda bor-yoʻgʻi 2 qator bor. Jami: `6 + 2 = 8`.",
        ],
        discuss: [
          "Asosiy gʻoya — tartib bilan, oʻlchamlar boʻyicha sanash. 3 × 3 shaklda `9 + 4 + 1 = 14` ta kvadrat chiqadi.",
        ],
      },
    },
  },
  parent: {
    skills: [
      "Moslashuvchan ogʻzaki hisob: qulay sonlar (19 → 20) va qulay juftliklar (yigʻindisi 10).",
      "Jadval yordamida mantiqiy chiqarib tashlash.",
      "Algoritm va simmetriya bilan ilk tanishuv.",
    ],
    observe: [
      "Farzandingiz «qulay» sonlardan oʻzi foydalanadimi yoki «toʻgʻridan-toʻgʻri» hisoblaydimi.",
      "Robot dasturini barmogʻini kataklar boʻylab yurgizib tekshiradimi.",
    ],
    mistakes: [
      "Kvadratlar haqidagi masalada «6» deb javob berish: katta kvadratlar koʻzdan qochgan.",
      "Simmetriyada — bir katakka surilib ketish.",
    ],
    question: "Qaysi masala ustida eng uzoq bosh qotirding — va senga nima yordam berdi?",
  },
};
