/** Hafta 4, 2-kun — oʻzbekcha (day2.ts ustiga qoplama, qoidalar — docs/uzbek-style.md). */
import type { Uz } from "../localize";
import type { Day } from "../types";

export const day2Uz: Uz<Day> = {
  title: "Koʻzgu va simmetriya",
  habit: { name: "Men simmetriyani izlayman" },
  intro: [
    "Kapalakka qara 🦋: uning chap qanoti oʻng qanotining koʻzgudagi aksiga oʻxshaydi. Bunday shakl **simmetrik** deyiladi, koʻzgu-chiziq esa — **simmetriya oʻqi**.",
    "Bugun harflar va shakllarning oʻqlarini izlaymiz, yarim rasmlarni chizib toʻldiramiz va qogʻozni buklab, teshikcha qirqsak nima boʻlishini bilib olamiz.",
  ],
  tasks: {
    w4d2t1: {
      title: "Koʻzgu-harflar",
      body: [
        {
          text: "Kichkina koʻzguni harfning ustiga tik qilib, roppa-rosa oʻrtasiga qoʻy. Agar koʻzgudagi yarmi harfni butun qilib toʻldirsa, harfning tik simmetriya oʻqi bor.",
        },
      ],
      answer: {
        prompt: "Qaysi harflarning tik simmetriya oʻqi bor?",
        options: {
          a: { label: "A" },
          b: { label: "B" },
          n: { label: "H" },
          g: { label: "G" },
          sh: { label: "M" },
          r: { label: "R" },
          p: { label: "T" },
          k: { label: "K" },
        },
      },
      followUps: [
        "Hamma harflari simmetrik boʻlgan soʻz oʻylab top.",
        "Qaysi harfning simmetriya oʻqi tik emas, yotiq turadi?",
      ],
      hints: [
        "Yana bir oʻqi: koʻzguni tik — yuqoridan pastga, harfning oʻrtasiga qoʻyamiz.",
        "Harfning chap yarmi oʻng yarmining koʻzgudagi aksi boʻlishi kerak.",
        "Harflarni katta qilib yoz va oʻrtasidan qalam bilan tik chiziq oʻtkaz.",
        "«H» dan boshla: uning chap va oʻng tayoqchalari bir xil. «G» ning esa bir tomonida dumchasi bor.",
        "Har bir harfni tekshir: qogʻozni chiziq boʻylab buklasang, yarimlari ustma-ust tushadimi?",
      ],
      solution: {
        answer: "A, H, M, T.",
        explanation: [
          "A, H, M va T harflarining chap yarmi oʻng yarmining koʻzgudagi aksi.",
          "B, G, R va K harflarining doirachalari va dumchalari faqat bir tomonda — aksi boshqa harf boʻlib qoladi yoki umuman harf boʻlmaydi.",
        ],
        discuss: [
          "Haqiqiy koʻzgucha yoki buklangan varaq bilan juda koʻrgazmali chiqadi: harfni yozing, varaqni oʻq boʻylab buklang va yorugʻda qarang.",
        ],
      },
    },
    w4d2t2: {
      title: "Koʻzgudagi archa",
      body: [
        {
          text: "Oʻrtadagi chiziq — koʻzgu. Oʻng tomondagi kataklarni shunday boʻyaki, archa simmetrik boʻlsin.",
        },
      ],
      followUps: ["Katakli qogʻozga oʻzingning simmetrik rasmingni chiz.", "Archaning simmetriya oʻqi qayerda?"],
      hints: [
        "Yana bir qara: koʻzgu-chiziq qayerda turibdi?",
        "Chap yarmi chizib qoʻyilgan. Oʻng yarmi uning aksi boʻlishi kerak.",
        "Bittadan qatorni boʻya: chapdagi qatorda nechta katak boʻyalgan va ular qayerda turibdi?",
        "Chapda chiziqning yonginasida turgan kataklar oʻngda ham chiziqning yonginasida aks etadi.",
        "Archaning tanasi chiziq yonida. Demak, oʻngda ham u chiziq yonida boʻladi.",
      ],
      solution: {
        answer: "Oʻng yarmi chap yarmining koʻzgudagi aksi: tanasi oʻrtada turgan archa hosil boʻladi.",
        explanation: [
          "Har bir boʻyalgan katak chiziqdan xuddi shunday masofada, faqat narigi tomonda aks etadi.",
          "Chapdagi 4 katakli keng qator oʻngda ham 4 katakli keng qatorni beradi, tanasi — har tomonda bittadan katak.",
        ],
        discuss: [
          "Koʻp uchraydigan xato — rasmni aks ettirish oʻrniga takrorlash: unda tana oʻng chetda qolib ketadi. Qatorma-qator birga tekshiring.",
        ],
      },
    },
    w4d2t3: {
      title: "Nechta oʻq bor?",
      body: [
        {
          text: "Baʼzi shakllarning simmetriya oʻqi bir nechta boʻladi: masalan, qogʻoz varagʻini ham uzunasiga, ham koʻndalangiga ikkiga buklash mumkin — yarimlari ustma-ust tushadi. Har bir shaklning nechta simmetriya oʻqi bor?",
        },
      ],
      answer: {
        prompt: "Nechta simmetriya oʻqi bor?",
        items: {
          square: { label: "Kvadrat" },
          rect: { label: "Toʻgʻri toʻrtburchak, lekin kvadrat emas" },
          triangle: { label: "Uchala tomoni teng uchburchak" },
          circle: { label: "Doira" },
          heart: { label: "Yuracha ❤️" },
          letter: { label: "«R» harfi" },
        },
        options: {
          n0: { label: "Bitta ham yoʻq" },
          n1: { label: "Bitta" },
          n2: { label: "Ikkita" },
          n3: { label: "Uchta" },
          n4: { label: "Toʻrtta" },
          many: { label: "Istalgancha" },
        },
      },
      followUps: [
        "Nega toʻgʻri toʻrtburchakning diagonali simmetriya oʻqi emas? Varaqni diagonal boʻyicha buklab tekshir.",
        "Toʻgʻri toʻrtburchak boʻlmagan, lekin roppa-rosa ikkita simmetriya oʻqi bor shakl chiz.",
      ],
      hints: [
        "Yana bir oʻqi: oʻq — shaklni yarimlari ustma-ust tushadigan qilib buklash mumkin boʻlgan chiziq.",
        "Qogʻoz varagʻining (toʻgʻri toʻrtburchakning) shunday ikkita chizigʻi bor — uzunasiga va koʻndalangiga.",
        "Qogʻozdan kvadrat va toʻgʻri toʻrtburchak qirqib ol va ularni turlicha buklab koʻr.",
        "Kvadratni uzunasiga, koʻndalangiga va yana ikkala diagonali boʻyicha buklash mumkin. Toʻgʻri toʻrtburchakni diagonal boʻyicha esa — yoʻq.",
        "Doirani markazidan oʻtgan istalgan chiziq boʻyicha buklash mumkin. Bunday chiziqlar nechta?",
      ],
      solution: {
        answer:
          "Kvadrat — 4, toʻgʻri toʻrtburchak — 2, teng tomonli uchburchak — 3, doira — istalgancha, yuracha — 1, «R» harfi — bitta ham yoʻq.",
        explanation: [
          "Kvadrat ikkita oʻrta chiziq va ikkita diagonal boʻyicha buklanadi — 4 ta oʻq.",
          "Toʻgʻri toʻrtburchakning faqat ikkita oʻqi bor: uzunasiga va koʻndalangiga. Diagonal boʻyicha yarimlari ustma-ust tushmaydi.",
          "Tomonlari teng uchburchakda oʻq har bir uchidan qarshi tomonning oʻrtasiga oʻtadi: 3 ta oʻq.",
          "Doira markazidan oʻtgan istalgan chiziq boʻyicha teng ikkiga buklanadi — oʻqlari cheksiz koʻp.",
          "Yuracha faqat tik chiziqqa nisbatan simmetrik, «R» ning esa doirachasi faqat oʻngda — oʻqi yoʻq.",
        ],
        discuss: [
          "Eng qiziq joyi — toʻgʻri toʻrtburchak va diagonal. Koʻp bolalar diagonal oʻq deb ishonishadi. Buklab tekshirib koʻrsin: bu eng yaxshi isbot.",
        ],
      },
    },
    w4d2t4: {
      title: "Aylanma sonlar",
      body: [
        {
          text: "121 soni chapdan oʻngga ham, oʻngdan chapga ham bir xil oʻqiladi. Bunday sonlar aylanma sonlar (yoki palindromlar) deyiladi.",
        },
        { label: "a)", text: "Ikki xonali aylanma sonlar nechta?" },
        { label: "b)", text: "100 dan 199 gacha boʻlgan sonlar orasida nechta aylanma son bor?" },
        { label: "c)", text: "2026 yildan keyingi eng yaqin aylanma yil qaysi?" },
      ],
      answer: {
        fields: {
          two: { label: "a) ikki xonali" },
          hundred: { label: "b) 100 dan 199 gacha" },
          year: { label: "c) yil" },
        },
      },
      followUps: [
        "2026 yildan oldingi oxirgi aylanma yil qaysi edi?",
        "Hammasi boʻlib nechta uch xonali aylanma son bor?",
      ],
      hints: [
        "Yana bir oʻqi: aylanma son ikkala tomonga ham bir xil oʻqiladi.",
        "Ikki xonali aylanma sonning birinchi raqami ikkinchisi bilan bir xil.",
        "Ikki xonali aylanma sonlarni tartib bilan yozib chiq: 11, 22, …",
        "100 dan 199 gacha boʻlgan aylanma sonning birinchi va oxirgi raqami — bir: 1?1. Oʻrtadagi raqam qanday boʻlishi mumkin?",
        "2026 dan keyingi aylanma yil 2 bilan boshlanib, 2 bilan tugaydi: 2??2. Oʻrtadagi ikki raqam ham bir xil — eng kichiklari qaysilari mos keladi?",
      ],
      solution: {
        answer: "a) 9; b) 10; c) 2112.",
        explanation: [
          "a) 11, 22, 33, 44, 55, 66, 77, 88, 99 — toʻqqizta son (00 — ikki xonali son emas).",
          "b) 101, 111, 121, …, 191 — oʻrtadagi raqam 0 dan 9 gacha, hammasi boʻlib 10 ta son.",
          "c) Oʻrtadagi raqamlari bir xil boʻlgan 2??2 koʻrinishdagi yil: 2002 oʻtib ketgan, keyingisi — 2112.",
        ],
        discuss: [
          "Aylanma son — sonlar uchun «simmetriya»: oʻq son yozuvining oʻrtasida turadi. Koʻzgu-harflar haqidagi masala bilan bogʻlash yaxshi.",
        ],
      },
    },
    w4d2t5: {
      title: "Koʻzgudagi dastur",
      body: [
        {
          text: "Robot `→ → ↑ → ↑ ↑` dasturi boʻyicha yoʻlakcha chizdi. Endi u yoʻlakchaning koʻzgudagi aksini chizmoqchi. Koʻzgu tik — yuqoridan pastga turibdi, yoʻlakchaning chap tomonida.",
        },
      ],
      answer: { prompt: "Qaysi dastur aksni chizadi?" },
      followUps: [
        "Yotiq turgan koʻzgudagi aksni qaysi dastur chizadi?",
        "↓ ↓ ← ↓ ← ← dasturi yoʻlakchaning oxiridan boshlasa, nima chizadi?",
      ],
      hints: [
        "Yana bir oʻqi: koʻzgu tik turibdi. Bunday koʻzguda nima almashadi — chap bilan oʻngmi yoki tepa bilan pastmi?",
        "Tik koʻzguda oʻng qoʻl chap boʻlib qoladi, tepa esa tepaligicha qoladi.",
        "Yoʻlakchani katakli qogʻozga chiz, chap tomoniga koʻzgu-chiziq qoʻy va aksini chiz.",
        "Bitta buyruqni ol: bunday koʻzguda «→» «←» ga aylanadi. «↑» nimaga aylanadi?",
        "Dasturdagi har bir «→» ni «←» ga almashtir, «↑» ni esa oʻzgartirma.",
      ],
      solution: {
        answer: "← ← ↑ ← ↑ ↑",
        explanation: [
          "Tik koʻzguda chap bilan oʻng oʻrin almashadi, tepa bilan past esa — yoʻq.",
          "Shuning uchun har bir «→» «←» ga aylanadi, «↑» esa «↑» boʻlib qoladi. Buyruqlar tartibi oʻzgarmaydi.",
          "→ → ↓ → ↓ ↓ dasturi — yotiq koʻzgudagi aks, ↓ ↓ ← ↓ ← ← esa robotni oʻsha yoʻlakcha boʻylab orqaga qaytaradi.",
        ],
        discuss: [
          "Bu yerda simmetriya dasturlash bilan uchrashadi: aks — buyruqlarni almashtirishning oddiy qoidasi. Farzandingiz toʻrtala variantni chizib, solishtirsin.",
        ],
      },
    },
    w4d2t6: {
      title: "Koʻzgudagi aks",
      body: [
        {
          text: "Shaklning oʻng tomoniga koʻzgu qoʻyishdi — tik, yuqoridan pastga. Koʻzguda qanday shaklni koʻramiz?",
        },
      ],
      answer: {
        prompt: "Koʻzguda nima bor?",
        options: {
          same: { label: "A" },
          mirror: { label: "B" },
          turned: { label: "C" },
          upside: { label: "D" },
        },
      },
      followUps: [
        "Qaysi shakl shaklning ostida, polda yotgan koʻzgudagi aks?",
        "Qaysi shakl burish bilan hosil boʻladi?",
      ],
      hints: [
        "Yana bir oʻqi: koʻzgu oʻng tomonda, tik turibdi.",
        "Bunday koʻzguda shaklning chap tomoni oʻngga oʻtadi, tepasi esa tepaligicha qoladi.",
        "Shaklni katakli qogʻozga chiz va oʻng tomoniga koʻzgu-chiziq oʻtkaz. Har bir katakni aks ettir.",
        "Pastki katakka qara: shaklda u chap tomonda. Aksda u qayerda boʻladi?",
        "Aksda pastki katak oʻngda boʻladi, yuqoridagi toʻrtta katak esa tepada kvadrat boʻlib qoladi.",
      ],
      solution: {
        answer: "B shakl.",
        explanation: [
          "Tik koʻzguda kataklar chapdan oʻngga oʻrin almashadi, tepa va past esa joyida qoladi.",
          "Tepadagi toʻrt katakli kvadrat tepada qoladi, pastki katak esa chapdan oʻngga koʻchadi — bu B shakl.",
          "A — oʻzgarmagan shaklning oʻzi, D — yotiq koʻzgudagi aks, C — yarim aylanaga burilgan shakl.",
        ],
        discuss: [
          "Aksni burilishdan ajratish kattalarga ham qiyin. Shaklni qogʻozdan qirqib olish yordam beradi: aks faqat uni ikkinchi tomoniga agʻdarganda chiqadi.",
        ],
      },
    },
    w4d2t7: {
      title: "Teshikchali salfetka",
      body: [
        {
          text: "{name} qogʻoz salfetkalar yasayapti: varaqni buklaydi va qaychi bilan teshikchalar qirqadi. Agar boshqacha aytilmagan boʻlsa, teshikchalar buklangan chiziqqa tegmaydi. Ochilgan varaqda nechta teshikcha boʻladi?",
        },
        { label: "a)", text: "Varaq ikkiga buklandi va 2 ta teshikcha qirqildi." },
        { label: "b)", text: "Varaq toʻrtga buklandi (ikkiga va yana ikkiga) va 3 ta teshikcha qirqildi." },
        { label: "c)", text: "Varaq ikkiga buklandi va aynan buklangan chiziqning ustidan yarim doira qirqildi." },
      ],
      answer: {
        fields: {
          half: { label: "a) teshikchalar" },
          quarter: { label: "b) teshikchalar" },
          fold: { label: "c) teshikchalar" },
        },
      },
      followUps: [
        "Javoblarni tekshir: haqiqiy varaqni buklab, teshikchalar qirq.",
        "c) dagi teshikcha qanday shaklda boʻladi?",
      ],
      hints: [
        "Yana bir oʻqi: qaychi buklangan varaqning hamma qatlamini birdaniga qirqadi.",
        "Varaqni ikkiga buklasa, 2 qatlam boʻladi. Toʻrtga buklasa-chi?",
        "Haqiqiy varaqni ikkiga bukla, unga teshikcha chiz va uning ostida nechta qatlam borligini sana.",
        "Har bir teshikcha hamma qatlamni teshadi: ikkiga buklangan varaqda bitta teshikcha ikkitaga aylanadi.",
        "Buklangan chiziqdagi yarim doira — alohida hol: varaq ochilganda uning ikkala yarmi birlashib, bitta teshikcha boʻladi.",
      ],
      solution: {
        answer: "a) 4; b) 12; c) 1.",
        explanation: [
          "a) Ikkiga buklangan varaq — 2 qatlam. Har bir teshikcha ikkalasini ham teshadi: `2 × 2 = 4`.",
          "b) Toʻrtga buklangan varaq — 4 qatlam: `3 × 4 = 12` ta teshikcha.",
          "c) Buklangan chiziqdagi yarim doira varaq ochilganda bitta butun doiraga aylanadi.",
        ],
        discuss: [
          "Ochilgan salfetkadagi naqsh buklangan chiziqlarga nisbatan simmetrik — ular simmetriya oʻqlarining oʻzi. Albatta haqiqiy qogʻoz bilan sinab koʻring.",
        ],
      },
    },
    w4d2t8: {
      title: "Ikkita simmetriya oʻqi",
      body: [
        {
          text: "4 × 4 maydonda 3 ta katak boʻyalgan. Maydonning oʻrtasidan ikkita chiziq oʻtadi: tik va yotiq.",
        },
        null,
        {
          label: "a)",
          text: "Tik chiziq rasmning simmetriya oʻqi boʻlishi uchun yana kamida nechta katakni boʻyash kerak?",
        },
        { label: "b)", text: "Ikkala chiziq ham birdaniga simmetriya oʻqi boʻlishi uchun-chi?" },
      ],
      answer: {
        fields: {
          one: { label: "a) yana boʻyash kerak" },
          both: { label: "b) yana boʻyash kerak" },
        },
      },
      followUps: [
        "b) da hammasi boʻlib nechta katak boʻyalgan boʻladi? Nega bu son 4 ga boʻlinadi?",
        "4 × 4 maydonda roppa-rosa 5 ta katakni ikkala chiziq ham oʻq boʻladigan qilib boʻyash mumkinmi?",
      ],
      hints: [
        "Yana bir oʻqi: a) da faqat tik oʻq kerak, b) da — ikkalasi.",
        "Boʻyalgan 3 ta katakning hammasi maydonning chap yuqori choragida.",
        "Maydonni qayta chiz va boʻyalgan kataklarni avval tik chiziq orqali aks ettir.",
        "Tik chiziq orqali har bir katak oʻngda bitta juft oladi. Nechta yangi katak?",
        "Ikkita oʻq uchun har bir katakni oʻngga ham, pastga ham, diagonal boʻylab qarama-qarshi chorakka ham aks ettirish kerak: bitta katak toʻrttaga aylanadi.",
      ],
      solution: {
        answer: "a) 3; b) 9.",
        explanation: [
          "a) 3 ta katakning har biri tik chiziq orqali oʻng yuqori chorakka aks etadi — yana 3 ta katakni boʻyash kerak.",
          "b) Endi har bir katakni yotiq chiziq orqali ham aks ettirish kerak. Bitta katak toʻrttaga aylanadi — har bir chorakda bittadan. Jami `3 × 4 = 12` ta katak boʻyalgan, ulardan yangilari `12 − 3 = 9` ta.",
        ],
        discuss: [
          "Yaxshi xulosa: agar rasmning ikkita oʻqi boʻlsa, chiziqlardan tashqaridagi boʻyalgan kataklar soni 4 ga boʻlinadi. Shuning uchun 4 × 4 maydonda 5 ta katakni bunday qilib boʻyab boʻlmaydi: bu maydonning hamma kataklari chiziqlardan tashqarida.",
        ],
      },
    },
  },
  parent: {
    skills: [
      "Harflar va shakllarning simmetriya oʻqlarini topish.",
      "Aksni burilishdan ajratish.",
      "Qogʻoz buklanib, qirqilgandan keyin nima chiqishini tasavvur qilish.",
    ],
    observe: [
      "Farzandingiz taxminlarini buklab yoki koʻzgucha bilan tekshiryaptimi?",
      "Tik va yotiq koʻzguni farqlayaptimi?",
    ],
    mistakes: [
      "Toʻgʻri toʻrtburchakning diagonalini simmetriya oʻqi deb hisoblash — juda koʻp uchraydigan xato. Varaqni buklab tekshiring.",
      "Rasmni aks ettirish oʻrniga takrorlash (koʻzgu oʻrniga surish).",
    ],
    question: "Bugun uyda yoki koʻchada simmetriya qayerda uchradi?",
  },
};
