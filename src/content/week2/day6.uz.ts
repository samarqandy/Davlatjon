/** Неделя 2, день 6 — по-узбекски (накладка на day6.ts, правила — docs/uzbek-style.md). */
import type { Uz } from "../localize";
import type { Day } from "../types";

export const day6Uz: Uz<Day> = {
  title: "Buni qayerda koʻrganman?",
  habit: { name: "Men oʻxshash masalani izlayman" },
  intro: [
    "Bugungi asbob — oʻxshash masala 🔗.",
    "Koʻp masalalar — yangi kiyim kiygan eski tanishlar. Oʻzingdan soʻra: «Shunga oʻxshashini qayerda koʻrganman?» Masalani tanidingmi — demak, uni qanday yechishni allaqachon bilasan!",
  ],
  tasks: {
    w2d6t1: {
      title: "Tanish usul",
      body: [
        { text: "Tez hisobla. Birinchi haftadagi qaysi usul bu yerda asqotadi?" },
        { label: "a)" },
        { label: "b)" },
      ],
      answer: { fields: { a: { label: "a) yigʻindi" }, b: { label: "b) yigʻindi" } } },
      followUps: [
        "Birinchi haftada xuddi shunday usul qayerda uchragan edi?",
        "Juft-juft qilib qoʻshish qulay boʻlgan toʻrtta sondan oʻz misolingni tuz.",
      ],
      hints: [
        "Shartni yana oʻqib chiq: sonlarni istalgan tartibda qoʻshish mumkin.",
        "Qaysi sonlar birgalikda yaxlit son beradi? Birliklarga qara: 7 va 3, 6 va 4…",
        "Birgalikda yaxlit son beradigan sonlarni yoychalar bilan tutashtir.",
        "`17 + 13` necha boʻladi? `26 + 14` esa?",
        "Avval qulay juftliklarni qoʻsh, keyin hosil boʻlgan yaxlit sonlarni.",
      ],
      solution: {
        answer: "a) 70; b) 80.",
        explanation: ["a) `(17 + 13) + (26 + 14) = 30 + 40 = 70`.", "b) `(19 + 21) + (36 + 4) = 40 + 40 = 80`."],
        discuss: [
          "Bu — birinchi haftaning 1-kunidagi «Qulay juftliklar» masalasi, faqat ikki xonali sonlar bilan. Farzandingizdan soʻrang: «Tanidingmi?»",
        ],
      },
    },
    w2d6t2: {
      title: "Yana buzuq kalkulyator",
      body: [
        {
          text: "Kalkulyatorda 🧮 «3» va «5» tugmalari buzilib qoldi. Bu tugmalarni bir marta ham bosmasdan, ekranda 35 sonini qanday hosil qilsa boʻladi?",
        },
        null,
        {
          text: "Kamida ikkita usul top. Sen bunday kalkulyatorni avval ham «tuzatgansan» — oʻshanda nima yordam berganini esla!",
        },
      ],
      followUps: ["Qaysi usul eng qisqa?", "«3» va «5» tugmalarisiz 53 ni qanday hosil qilsa boʻladi?"],
      hints: [
        "Shartni yana oʻqib chiq: qaysi tugmalarni bosish mumkin emas? Esingda boʻlsin: «3» ham, «5» ham boʻlmaydi — hatto son ichida ham.",
        "35 ga yaqin qaysi sonlarda 3 va 5 raqamlari yoʻq? Masalan, 40 yoki 28.",
        "Kalkulyator tugmalarini chiz va buzuqlarini ustidan chizib qoʻy.",
        "Ikki xonali son bilan bir xonali sonni qoʻshib koʻr: `28 + ?`.",
        "Ayirish bilan ham boʻladi: 40 yoki 42 dan boshla va ortiqchasini ayir.",
      ],
      solution: {
        answer: "Usullar koʻp, masalan: `28 + 7`, `29 + 6`, `42 − 7`, `40 − 6 + 1`, `17 + 18`, `26 + 9`.",
        explanation: [
          "Eng muhimi — birorta sonda 3 va 5 raqamlari boʻlmasin. Masalan, `30 + 5` toʻgʻri kelmaydi, `29 + 6` esa toʻgʻri keladi.",
        ],
        discuss: [
          "Bu — birinchi haftaning 6-kunidagi masalaning xuddi oʻzi. Usul ham oʻsha: yaqin atrofdan «ruxsat etilgan» sonlarni topib, qoʻshish yoki ayirish bilan maqsadga yetish.",
          "53 ni, masalan, bunday hosil qilish mumkin: `49 + 4` yoki `60 − 7`.",
        ],
      },
    },
    w2d6t3: {
      title: "Harflardan soʻzlar",
      body: [
        {
          text: "Davlatjon ikkita A va ikkita B harfidan «soʻz» tuzyapti — masalan, AABB yoki ABAB. Soʻzlarning maʼnosi boʻlmasa ham mayli.",
        },
        { text: "Shu toʻrtta harfdan u nechta har xil soʻz tuza oladi?" },
      ],
      answer: { fields: { words: { label: "Har xil soʻzlar soni" } } },
      followUps: [
        "Uchta A va ikkita B harfidan nechta soʻz chiqadi?",
        "Nega bu masala — boshqa kiyim kiygan «robot yoʻllari» ekanini tushuntirib ber.",
      ],
      hints: [
        "Shartni yana oʻqib chiq: har bir soʻzda roppa-rosa ikkita A va ikkita B harfi bor.",
        "Shartdagi ikkita soʻzni yozib ol. Ular nimasi bilan farq qiladi? Faqat harflarning tartibi bilan.",
        "Soʻzlarni tartib bilan yoz: avval A bilan boshlanadiganlarning hammasini, keyin B bilan boshlanadiganlarni.",
        "Kichikroq masalani yech: bitta A va bitta B dan nechta soʻz chiqadi? (Ikkita: AB va BA.) Ikkita A va bitta B dan-chi?",
        "Bunday masalani qayerda koʻrgansan? A harfini → strelkaga, B harfini esa ↑ strelkaga almashtir. Nima chiqdi?",
      ],
      solution: {
        answer: "6 ta soʻz.",
        explanation: [
          "A bilan boshlanadiganlar: AABB, ABAB, ABBA. B bilan boshlanadiganlar: BAAB, BABA, BBAA.",
          "Bu — birinchi haftadagi «Hamma qisqa yoʻllar» masalasi: u yerda robot 2 qadam oʻngga va 2 qadam yuqoriga yurgan edi. Agar → ni A, ↑ ni esa B desak, har bir yoʻl soʻzga aylanadi. Yoʻllar 6 ta edi — soʻzlar ham 6 ta.",
        ],
        discuss: [
          "Yangi masalada eskisini tanish — kunning asosiy koʻnikmasi. Uchta A va ikkita B harfidan 10 ta soʻz chiqadi — «3 qadam oʻngga va 2 qadam yuqoriga» yoʻllari qancha boʻlsa, xuddi shuncha.",
        ],
      },
    },
    w2d6t4: {
      title: "Choʻplardan uchburchaklar",
      body: [
        { text: "Endi Davlatjon gugurt choʻplaridan uchburchaklar yoʻlakchasini teryapti." },
        null,
        { label: "a)", text: "10 ta uchburchakli yoʻlakcha uchun nechta choʻp kerak?" },
        { label: "b)", text: "31 ta choʻpdan nechta uchburchak chiqadi?" },
      ],
      answer: {
        fields: {
          m10: { label: "a) 10 ta uchburchak uchun choʻplar soni" },
          t31: { label: "b) 31 ta choʻpdan uchburchaklar soni" },
        },
      },
      followUps: [
        "Bu masala kvadratlar yoʻlakchasiga nimasi bilan oʻxshaydi? Nimasi bilan farq qiladi?",
        "20 ta uchburchak uchun nechta choʻp kerak boʻladi?",
      ],
      hints: [
        "Rasmga yana bir qara. Har bir yoʻlakchada nechta choʻp bor?",
        "Sonlarni yozib ol: 1 ta uchburchak — 3 ta choʻp, 2 ta uchburchak — 5 ta choʻp… Har safar nechtaga koʻpayyapti?",
        "Jadval tuz: uchburchaklar — 1, 2, 3, 4, 5; choʻplar — 3, 5, 7, …",
        "Oʻxshash masalani qayerda koʻrgansan? Kvadratlar yoʻlakchasini esla: u yerda har bir yangi kvadrat 3 ta choʻp qoʻshardi, chunki uning bir tomoni qoʻshnisi bilan umumiy edi.",
        "Har bir yangi uchburchak 2 ta choʻp qoʻshadi. 10 ta uchburchak uchun: boshidagi bitta choʻp va har bir uchburchakka yana 2 tadan choʻp.",
      ],
      solution: {
        answer: "a) 21 ta choʻp; b) 15 ta uchburchak.",
        explanation: [
          "Choʻplar: 3, 5, 7, 9… — har bir yangi uchburchak 2 ta choʻp qoʻshadi, chunki uning bir tomoni qoʻshnisi bilan umumiy.",
          "a) 10 ta uchburchak uchun: `1 + 2 + 2 + … + 2` (2 soni oʻn marta) — bu `1 + 20 = 21`.",
          "b) 31 ta choʻpdan bittasini chetga qoʻyamiz, 30 ta qoladi — bu 15 marta 2 tadan choʻp, yaʼni 15 ta uchburchak.",
        ],
        discuss: [
          "Bu masala kvadratlar yoʻlakchasining (3-kun) «qarindoshi»: u yerda — «1 ta va har bir kvadratga yana 3 tadan», bu yerda — «1 ta va har bir uchburchakka yana 2 tadan». Mulohaza usuli bir xil.",
          "20 ta uchburchak uchun 41 ta choʻp kerak boʻladi.",
        ],
      },
    },
    w2d6t5: {
      title: "Zooparkka yoʻl",
      body: [
        {
          text: "Davlatjon uydan zooparkka velosipedda 🚲 ketyapti. Xaritada har bir yoʻl necha daqiqa olishi yozilgan.",
        },
        { label: "a)", text: "Qaysi yoʻl eng tez? U necha daqiqa oladi?" },
        {
          label: "b)",
          text: "Kutubxona bilan favvora orasidagi yoʻl taʼmirga yopildi 🚧. Endi qaysi yoʻl eng tez?",
        },
        { text: "Oʻxshash masalani qayerda yechgansan? Oʻshanda qaysi usul yordam bergan edi?" },
      ],
      answer: {
        puzzle: {
          nodes: {
            home: { label: "Uy" },
            bridge: { label: "Koʻprik" },
            bazaar: { label: "Bozor" },
            fountain: { label: "Favvora" },
            library: { label: "Kutubxona" },
            zoo: { label: "Zoopark" },
          },
          unit: "daqiqa",
        },
      },
      followUps: [
        "Nega eng tez yoʻl eng koʻp joy orqali oʻtadi?",
        "Bu yerda senga birinchi haftadagi qaysi usul yordam berdi?",
      ],
      hints: [
        "Shartni yana oʻqib chiq: yoʻllar soni emas, daqiqalar yigʻindisi muhim.",
        "Uydan qaysi yoʻllar chiqadi? Har bir qoʻshni joygacha necha daqiqa?",
        "Bir nechta har xil yoʻlni yozib ol va har birining vaqtini hisobla. Jadvalga yozib bor.",
        "Kichikroq masalani yech: uydan favvoragacha eng tez qanday yetib borsa boʻladi?",
        "Birinchi haftadagi «Eng tez yoʻl» masalasini esla: eng yaqin joylardan boshlab, har bir joy uchun uydan u yergacha necha daqiqa ekanini yozib chiq.",
      ],
      solution: {
        answer:
          "a) Uy → Bozor → Kutubxona → Favvora → Zoopark: 15 daqiqa; b) 17 daqiqa — ikki xil yoʻl bilan: Uy → Koʻprik → Favvora → Zoopark yoki Uy → Bozor → Kutubxona → Zoopark.",
        explanation: [
          "Favvoragacha eng tezi — bozor va kutubxona orqali: `4 + 3 + 2 = 9` daqiqa (koʻprik orqali — 11, bozordan toʻgʻri — 13).",
          "Favvoradan zooparkkacha yana 6 daqiqa. Hammasi boʻlib `9 + 6 = 15`.",
          "Koʻprik orqali toʻgʻri borilsa, yoʻl bor-yoʻgʻi ikki boʻlakdan iborat, lekin u `6 + 13 = 19` daqiqa oladi.",
        ],
        discuss: [
          "b) Kutubxona — Favvora yoʻli yopilgach: koʻprik va favvora orqali `6 + 5 + 6 = 17`, bozor va kutubxona orqali `4 + 3 + 10 = 17`. Ikki yoʻl birdek tez — farzandingiz ikkalasini ham topsa, juda yaxshi.",
          "Bu — «Eng tez yoʻl» masalasining xuddi oʻzi (birinchi haftaning 6-kuni): yoʻllar soni emas, daqiqalar yigʻindisi muhim.",
        ],
      },
    },
    w2d6t6: {
      title: "Koʻzgudagi raketa",
      body: [
        {
          text: "Oʻrtadagi chiziq — koʻzgu. Oʻng tomondagi kataklarni shunday boʻyaki, simmetrik raketa 🚀 hosil boʻlsin.",
        },
        { text: "Bunday masalani qayerda uchratgansan? Oʻshanda xato qilmaslikka nima yordam bergan edi?" },
      ],
      followUps: [
        "Toʻgʻri aks ettirganingni qanday tekshirding?",
        "Katakli varaqqa oʻz rasmingning yarmini chiz va kattalardan ikkinchi yarmini chizib berishni soʻra.",
      ],
      hints: [
        "Yana bir qara: koʻzgu-chiziq qayerdan oʻtgan?",
        "Chap yarmidagi qaysi kataklar chiziqqa tegib turibdi? Ularning aksi ham chiziqqa tegib turadi.",
        "Qatorma-qator boʻya: boʻyalgan katak koʻzgudan necha katak uzoqda ekanini sanab bor.",
        "Eng yuqori qatordan boshla: unda bitta katak bor — chiziqning yonginasida. Uning aksi qayerda boʻladi?",
        "Birinchi haftadagi «Koʻzgudagi kapalak»ni esla: aks koʻzgudan xuddi shuncha uzoqlikda turadi, faqat narigi tomonda.",
      ],
      solution: {
        answer: "Oʻng yarmi — chap yarmining koʻzgudagi aksi: raketa hosil boʻladi.",
        explanation: [
          "Har bir boʻyalgan katak chiziqdan xuddi shuncha uzoqlikka aks etadi: chiziq yonidagi katak — yana chiziq yonida, chetdagi katak — yana chetda.",
        ],
        discuss: [
          "Bu — birinchi haftadagi «Koʻzgudagi kapalak», faqat figurasi murakkabroq: bu yerda «derazacha» bor — koʻzgu yonidagi boʻsh kataklar. Koʻp uchraydigan xato — bir katakka surilib ketish.",
        ],
      },
    },
    w2d6t7: {
      title: "Velosipedlar va mashinalar",
      body: [
        {
          text: "Hovlida velosipedlar 🚲 va mashinalar 🚗 turibdi — hammasi boʻlib 9 ta. Ularning jami 26 ta gʻildiragi bor.",
        },
        { text: "Nechta velosiped va nechta mashina bor? Oʻxshash masalani qayerda koʻrgansan?" },
      ],
      answer: { fields: { bikes: { label: "Velosipedlar soni" }, cars: { label: "Mashinalar soni" } } },
      followUps: [
        "Bu masalada nima «boshlar», nima esa «oyoqlar»?",
        "«Tovuqlar va quyonlar» masalasiga oʻzing «egizak» masala oʻylab top.",
      ],
      hints: [
        "Shartni yana oʻqib chiq: velosipedning nechta gʻildiragi bor, mashinaning-chi?",
        "Nima maʼlum: hammasi 9 ta, gʻildiraklar 26 ta. Agar hammasi velosiped boʻlganida, nechta gʻildirak boʻlardi?",
        "9 ta doiracha chiz va har biriga 2 tadan gʻildirak chizib qoʻy. Yana nechta gʻildirak yetishmayapti?",
        "Bunday masalani qayerda yechgansan? Tovuqlar va quyonlarni esla: boshlar — bu velosipedlar va mashinalar, oyoqlar esa — gʻildiraklar!",
        "Har safar velosipedni mashinaga almashtirsak, gʻildiraklar 2 taga koʻpayadi. Necha marta almashtirish kerak?",
      ],
      solution: {
        answer: "5 ta velosiped va 4 ta mashina.",
        explanation: [
          "Agar 9 tasining hammasi velosiped boʻlganida, 18 ta gʻildirak boʻlardi. `26 − 18 = 8` ta gʻildirak yetishmaydi.",
          "Velosiped oʻrniga qoʻyilgan har bir mashina 2 ta gʻildirak qoʻshadi: 8 ta gʻildirak — bu 4 ta mashina. Velosipedlar `9 − 4 = 5` ta.",
          "Tekshiramiz: velosipedlarda `5 + 5 = 10` ta gʻildirak, mashinalarda `4 + 4 + 4 + 4 = 16` ta, jami 26 ta ✓.",
        ],
        discuss: [
          "Bu — yangi kiyimdagi «Tovuqlar va quyonlar» (birinchi haftaning 6-kuni): boshlar — velosipedlar va mashinalar, oyoqlar — gʻildiraklar. Agar farzandingiz masalani oʻzi tanigan boʻlsa — kunning eng katta yutugʻi shu.",
        ],
      },
    },
    w2d6t8: {
      title: "Yutqazgan chiqib ketadi",
      body: [
        {
          text: "Futbol turnirida ⚽ 16 ta jamoa qatnashyapti. Oʻyinlar «chiqib ketish» tartibida: har bir oʻyinda ikki jamoa uchrashadi, yutqazgan jamoa turnirdan chiqadi, gʻolib esa oʻynashda davom etadi. Durang boʻlmaydi.",
        },
        { text: "Chempion aniqlanishi uchun nechta oʻyin oʻtkazish kerak?" },
      ],
      answer: { fields: { games: { label: "Oʻyinlar soni" } } },
      followUps: [
        "Agar jamoalar 20 ta boʻlsa, nechta oʻyin kerak boʻladi?",
        "Bu masala birinchi haftadagi shokoladga nimasi bilan oʻxshaydi?",
      ],
      hints: [
        "Shartni yana oʻqib chiq: har bir oʻyindan keyin roppa-rosa bitta jamoa chiqib ketadi.",
        "Nima maʼlum: jamoalar 16 ta, oxirida esa bittasi qoladi — chempion. Nechta jamoa chiqib ketishi kerak?",
        "Turnir sxemasini chiz: birinchi davrada 16 ta jamoa juft-juft boʻlib oʻynaydi. Birinchi davrada nechta oʻyin boʻladi? Nechta jamoa qoladi?",
        "Kichikroq masalani yech: 2 ta jamoa — nechta oʻyin? 4 ta jamoa-chi? 8 ta jamoa-chi?",
        "Birinchi haftadagi shokoladni esla: har bir sindirish roppa-rosa bitta boʻlak qoʻshardi. Har bir oʻyin nima qiladi-chi?",
      ],
      solution: {
        answer: "15 ta oʻyin.",
        explanation: [
          "Davralar boʻyicha: `8 + 4 + 2 + 1 = 15` ta oʻyin.",
          "Tez usul: har bir oʻyin roppa-rosa bitta jamoani chiqarib yuboradi. 16 ta jamoadan bittasi qolishi uchun 15 ta jamoa chiqib ketishi kerak — demak, 15 ta oʻyin kerak.",
        ],
        discuss: [
          "Bu — birinchi haftadagi «Shokolad»: u yerda har bir sindirish bitta boʻlak qoʻshardi, bu yerda har bir oʻyin bitta jamoani chiqaradi. Tez usul istalgan sondagi jamoalar uchun ishlaydi: 20 ta jamoa uchun — 19 ta oʻyin, garchi bunday turnir sxemasini chizish oson boʻlmasa ham.",
        ],
      },
    },
  },
  parent: {
    skills: [
      "Bilimni koʻchirish: tanish masalani yangi kiyimda tanish.",
      "Birinchi hafta usullarini yangi materialda takrorlash: qulay juftliklar, xaritadagi yoʻl, simmetriya, tovuqlar va quyonlar, shokolad.",
      "Har xil masalalar orasidagi moslik: robot yoʻllari ↔ harflardan soʻzlar.",
    ],
    observe: [
      "Farzandingiz tanish masalalarni oʻzi taniydimi yoki faqat «Buni qayerda koʻrgansan?» degan savoldan keyinmi?",
      "Ikki masalaning umumiy tomonini tushuntira oladimi?",
    ],
    mistakes: [
      "Harflardan soʻzlar: soʻzlarni tartibsiz yozganda bittasini tushirib qoldirish.",
      "Turnir: 16 deb javob berish yoki davralardagi oʻyinlarni qoʻshishda adashish.",
    ],
    question: "Bugungi qaysi masala boshqa kiyimdagi eski tanish boʻlib chiqdi?",
  },
};
