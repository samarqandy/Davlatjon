/** Неделя 1, день 3 — по-узбекски (накладка на day3.ts, правила — docs/uzbek-style.md). */
import type { Uz } from "../localize";
import type { Day } from "../types";

export const day3Uz: Uz<Day> = {
  title: "Tekshir!",
  habit: { name: "Men tekshiraman" },
  intro: [
    "Bugun sen detektivsan 🕵️.",
    "Baʼzi masalalarda xatolar yashirinib olgan. Haqiqiy detektiv shunchaki «notoʻgʻri» deb qoʻya qolmaydi — u dalil izlaydi va isbotlaydi.",
  ],
  tasks: {
    w1d3t1: {
      title: "Detektiv Bilmasvoyni tekshiradi",
      body: [
        { text: "Bilmasvoy toʻrtta misol yechdi. Qaysilarida u xato qilgan?" },
        { items: ["a) `27 + 18 = 35`", "b) `40 − 16 = 24`", "c) `33 + 29 = 62`", "d) `52 − 25 = 37`"] },
        { text: "Xatolarni top va ular haqiqatan ham xato ekanini isbotla." },
      ],
      answer: {
        prompt: "Xatosi bor hamma misollarni belgila:",
        options: {
          a: { label: "a) 27 + 18 = 35" },
          b: { label: "b) 40 − 16 = 24" },
          c: { label: "c) 33 + 29 = 62" },
          d: { label: "d) 52 − 25 = 37" },
        },
      },
      followUps: [
        "Toʻgʻri javoblar qanday boʻlishi kerak?",
        "Qoʻshishni ayirish bilan, ayirishni esa qoʻshish bilan qanday tekshirsa boʻladi?",
      ],
      hints: [
        "Har bir misolni yana bir bor oʻqi. Bu yerda yechish emas, tekshirish kerak.",
        "Qoʻshishni qanday tekshirsa boʻladi? Ayirishni-chi?",
        "Chamalab koʻr: har bir son qaysi yaxlit songa yaqin? Masalan, `28 + 21` — taxminan `30 + 20 = 50`.",
        "Kichikroq masalani yech: `15 − 7 = 9` toʻgʻrimi? Qoʻshish bilan tekshir: `9 + 7` necha boʻladi?",
        "Har bir misolni teskari amal bilan tekshir — xatolar oʻzini oʻzi fosh qiladi.",
      ],
      solution: {
        answer: "a) va d) misollarda xato bor.",
        explanation: [
          "a) `27 + 18 = 45`, 35 emas: Bilmasvoy `7 + 8 = 15` ekanini, yaʼni bu bitta butun oʻnlik va yana 5 ekanini esdan chiqargan.",
          "d) `52 − 25 = 27`, 37 emas. Tekshirish: `37 + 25 = 62`, 52 emas.",
          "b) va c) toʻgʻri yechilgan: `24 + 16 = 40`, `62 − 29 = 33`.",
        ],
        discuss: [
          "Chamalash darrov yordam beradi: `27 + 18` — deyarli `30 + 20 = 50`, demak, javob 50 ga yaqin boʻlishi kerak, 35 esa juda kam.",
        ],
      },
    },
    w1d3t2: {
      title: "Chamalab koʻr!",
      body: [
        { text: "Aniq hisoblamasdan solishtir. **>** (katta) yoki **<** (kichik) belgisini qoʻy." },
        { items: ["a) `38 + 49` … `100`", "b) `51 + 52` … `100`", "c) `99 − 48` … `50`"] },
      ],
      answer: {
        prompt: "Belgini tanla:",
        items: {
          a: { label: "a) 38 + 49 … 100" },
          b: { label: "b) 51 + 52 … 100" },
          c: { label: "c) 99 − 48 … 50" },
        },
      },
      followUps: ["Aniq hisoblamasdan qanday topding?"],
      hints: [
        "Yana bir bor oʻqi: aniq hisoblash shart emas — faqat solishtirish kerak.",
        "38 va 49 ga qaysi yaxlit sonlar yaqin?",
        "100 gacha son nurini chiz va yigʻindi taxminan qayerga tushishini belgila.",
        "`50 + 50 = 100`. 51 va 52 esa 50 dan kattami yoki kichikmi?",
        "c) uchun: `99 − 49 = 50`. Agar kichikroq sonni (48 ni) ayirsang, koʻproq qoladimi yoki kamroq?",
      ],
      solution: {
        answer: "a) <; b) >; c) >.",
        explanation: [
          "a) 38 ham, 49 ham 50 dan kichik, demak, ularning yigʻindisi `50 + 50 = 100` dan kichik (aniq: 87).",
          "b) 51 ham, 52 ham 50 dan katta, demak, yigʻindi 100 dan katta (aniq: 103).",
          "c) `99 − 49 = 50`, biz esa kamroq (48 ni) ayiryapmiz — demak, 50 dan koʻp qoladi (aniq: 51).",
        ],
        discuss: [
          "Chamalash xatolarni aniq hisoblashdan oldinroq payqashga yordam beradi. Muhandislar va dasturchilar undan doim foydalanadi.",
        ],
      },
    },
    w1d3t3: {
      title: "Guldonni kim sindirdi?",
      body: [
        { text: "Uyda guldon 🏺 sinib qoldi. Uni bittasi sindirgan: Mushuk, Kuchuk yoki Toʻtiqush." },
        {
          items: [
            "🐱 Mushuk dedi: «Guldonni Kuchuk sindirdi».",
            "🐶 Kuchuk dedi: «Guldonni Toʻtiqush sindirdi».",
            "🦜 Toʻtiqush dedi: «Men sindirmadim».",
          ],
        },
        { text: "Maʼlumki, ulardan faqat bittasi yolgʻon gapirgan. Guldonni kim sindirgan?" },
        { text: "Har bir holatni tekshir. Jadvalda belgilab bor: ✓ — rost gapiryapti, ✗ — yolgʻon gapiryapti." },
        {
          visual: {
            corner: "Agar sindirgan…",
            rows: ["🐱 Mushuk", "🐶 Kuchuk", "🦜 Toʻtiqush"],
            cols: ["Mushukning gapi", "Kuchukning gapi", "Toʻtiqushning gapi"],
          },
        },
      ],
      answer: {
        prompt: "Guldonni kim sindirgan?",
        options: {
          cat: { label: "🐱 Mushuk" },
          dog: { label: "🐶 Kuchuk" },
          parrot: { label: "🦜 Toʻtiqush" },
        },
      },
      followUps: ["Uchala holatni ham tekshir. Nega qolgan ikki holatda toʻgʻri kelmaydi?"],
      hints: [
        "Yana bir bor oʻqi. Ulardan nechtasi yolgʻon gapirgan?",
        "Aniq bilganimiz: guldonni bittasi sindirgan, yolgʻonni ham faqat bittasi gapirgan.",
        "Jadvalni toʻldir: har bir holat uchun («agar Mushuk sindirgan boʻlsa» va hokazo) kim rost, kim yolgʻon gapirayotganini belgila.",
        "Faraz qil: guldonni Mushuk sindirgan. Unda kim yolgʻon gapiryapti? Bunaqalar nechta chiqdi?",
        "Uchala holatni navbatma-navbat tekshir. Faqat bittasi yolgʻon gapiradigan holat toʻgʻri keladi.",
      ],
      solution: {
        answer: "Guldonni Kuchuk sindirgan.",
        explanation: [
          "Agar Mushuk sindirgan boʻlsa: Mushuk ham, Kuchuk ham yolgʻon gapirgan boʻladi — ikkitasi. Toʻgʻri kelmaydi.",
          "Agar Kuchuk sindirgan boʻlsa: Mushuk rost aytgan, Toʻtiqush ham rost aytgan, faqat Kuchuk yolgʻon gapirgan. Toʻgʻri keladi!",
          "Agar Toʻtiqush sindirgan boʻlsa: Mushuk ham, Toʻtiqush ham yolgʻon gapirgan boʻladi — ikkitasi. Toʻgʻri kelmaydi.",
        ],
        discuss: [
          "Bu yerda eng muhimi — «faraz qilaylik… — endi tekshiramiz» usuli. Olimlar farazlarni shunday tekshiradi, dasturchilar ham xatolarni shunday izlaydi.",
        ],
      },
    },
    w1d3t4: {
      title: "Buzilgan qator",
      body: [
        { text: "Har bir qatorda bitta son xato yozilgan. Uni topib, toʻgʻrila." },
        { label: "a)" },
        { label: "b)" },
      ],
      answer: {
        fields: {
          aWrong: { label: "a) xato son" },
          aFix: { label: "a) oʻrniga qaysi son kerak" },
          bWrong: { label: "b) xato son" },
          bFix: { label: "b) oʻrniga qaysi son kerak" },
        },
      },
      followUps: [
        "2, 4, 8, 16 qatorini oldin qayerda uchratgansan?",
        "b) qatordagi xato aynan sen topgan sonda ekanini qanday isbotlaysan?",
      ],
      hints: [
        "Har bir qatorga yana bir bor qara. Qaysi sonlar «toʻgʻri», adashmasdan ketyapti?",
        "Har bir keyingi son oldingisidan nechtaga katta? Buni har bir qoʻshni juftlik ustiga yozib qoʻy.",
        "Qoʻshni sonlar orasiga yoy chiz va farqini yozib qoʻy. Qoida qayerda buzildi?",
        "a) qatorda 5, 10, 15 ga qara. Keyingi son qaysi boʻlishi kerak?",
        "b) qator senga birinchi kundan tanish. Uning qoidasini eslab, har bir sonni shu qoida boʻyicha tekshir.",
      ],
      solution: {
        answer: "a) 21 → 20; b) 30 → 32.",
        explanation: [
          "a) Qator 5 tadan oʻsib boradi: 5, 10, 15, 20, 25, 30.",
          "b) Har bir son ikki baravar ortadi: 2, 4, 8, 16, 32, 64. 64 esa — bu `32 + 32`, shuning uchun xato aynan 30 da.",
        ],
        discuss: [
          "30 ni 32 ga almashtirsak, butun qator bitta qoidaga boʻysunadi — isbot aynan shu. 2, 4, 8, 16 qatori birinchi kuni uchragan edi.",
        ],
      },
    },
    w1d3t5: {
      title: "Dasturdagi xato",
      body: [
        { text: "Dastur robotni 🤖 bayroqchaga 🚩 olib borishi kerak: `↑ → ↑ ↑ → → ↑`" },
        {
          text: "Lekin unda xato bor — robot devorga urilib qoladi! Bu nechanchi qadamda sodir boʻladi? Robot bayroqchaga yetib borishi uchun **bitta** buyruqni toʻgʻrila.",
        },
      ],
      followUps: ["Xatoni qanday izlading: dasturning boshidanmi yoki oxiridanmi? Qaysi usul tezroq?"],
      hints: [
        "Dasturni yana bir bor oʻqi. Robot qayerdan boshlaydi va qayerga borishi kerak?",
        "Buyruqlarni bittadan bajar. Birinchi buyruqdan keyin robot qayerda? Ikkinchisidan keyin-chi?",
        "Barmogʻingni kataklar boʻylab yurgiz va har bir buyruqdan keyin nuqta qoʻy. Nechanchi qadamda barmogʻing devorga borib taqaladi?",
        "Kichikroq masalani yech: dastlabki ikkita buyruqni bajarib, robot qayerdaligini belgila. Keyin bittadan buyruq qoʻshib bor.",
        "Xato — robot birinchi marta devorga urilgan joyda. Robot bayroqchaga yetib borishi uchun u yerga qaysi strelkani qoʻyish kerak?",
      ],
      solution: {
        answer: "Xato 3-buyruqda: ↑ oʻrniga → kerak. Toʻgʻri dastur: ↑ → → ↑ → → ↑.",
        explanation: [
          "↑ → buyruqlaridan keyin robot roppa-rosa devorning tagida turadi, uchinchi buyruq ↑ esa uni devorga olib boradi.",
          "Agar uni → ga almashtirsak, qolgani hammasi ishlaydi: ↑ → → ↑ → → ↑ — robot bayroqchaga yetib boradi.",
        ],
        discuss: [
          "Dasturdagi xatoni izlab topish dasturchilar tilida «debugging» (xatolarni tuzatish) deyiladi. Ularning asosiy usuli ham xuddi shunday: dasturni qadamma-qadam bajarib, birinchi marta nimadir notoʻgʻri ketgan qadamni topish.",
        ],
      },
    },
    w1d3t6: {
      title: "Burilgan shakllar",
      body: [
        { text: "Mana toʻrtta katakchadan iborat shakl." },
        null,
        {
          text: "A, B, C, D shakllardan qaysilari xuddi shu shaklning oʻzi, faqat burib qoʻyilgan? Shaklni agʻdarish (tovadagi quymoqdek) mumkin emas — faqat burish mumkin.",
        },
      ],
      answer: {
        prompt: "Burilgan hamma shakllarni belgila:",
        // буквы вариантов: А Б В Г → A B C D
        options: { a: { label: "A" }, b: { label: "B" }, c: { label: "C" }, d: { label: "D" } },
      },
      followUps: [
        "Shaklni qogʻozdan qirqib ol va javobingni tekshir!",
        "Agar shaklni agʻdarish ham mumkin boʻlsa, qaysi variantlar toʻgʻri keladi?",
      ],
      hints: [
        "Yana bir bor oʻqi: burish mumkin, agʻdarish — mumkin emas.",
        "Shaklning «oyoqchasi» qayerda? U qaysi tomonga qarab turibdi?",
        "Shaklni katakli qogʻozga chiz, qirqib ol va burib koʻr.",
        "A variantni ol: shaklingni soat mili yoʻnalishida chorak aylanaga bur. Mos keldimi?",
        "Agar shakl faqat agʻdarganingdagina mos kelsa — bunday variant toʻgʻri kelmaydi.",
      ],
      solution: {
        answer: "A va C.",
        explanation: [
          "A — chorak aylanaga burilgan shakl.",
          "C — yarim aylanaga burilgan shakl.",
          "B va D — koʻzgudagi akslar: ularni hosil qilish uchun shaklni agʻdarish kerak.",
        ],
        discuss: [
          "7–8 yoshda shakllarni xayolan aylantirish qiyin. Qogʻozdan qirqilgan shakl — «maslahat» emas, balki ilmiy tajriba: farzandingiz farazini oʻz qoʻli bilan tekshirib koʻrsin.",
          "Agar shaklni agʻdarish ham mumkin boʻlsa, toʻrttala variant ham toʻgʻri keladi.",
        ],
      },
    },
    w1d3t7: {
      title: "Chekni tekshir",
      body: [
        { text: "Oyim doʻkondan oziq-ovqat xarid qildi. Mana uning cheki 🧾:" },
        {
          visual: {
            lines: [
              { label: "Non", price: "4 ming soʻm" },
              { label: "Sut", price: "9 ming soʻm" },
              { label: "Olma", price: "15 ming soʻm" },
            ],
            total: "38 ming soʻm",
          },
        },
        { label: "a)", text: "Jami toʻgʻri hisoblanganmi? Aslida qancha boʻlishi kerak?" },
        {
          label: "b)",
          text: "Oyim sotuvchiga 50 ming soʻm berdi. Toʻgʻri hisoblansa, u qancha qaytim olishi kerak?",
        },
      ],
      answer: {
        fields: {
          total: { label: "a) toʻgʻri jami", suffix: "ming soʻm" },
          change: { label: "b) qaytim", suffix: "ming soʻm" },
        },
      },
      followUps: ["Chekda qanchaga xato qilingan? Bu xato tufayli kim pul yoʻqotardi — oyimmi yoki doʻkonmi?"],
      hints: [
        "Chekni yana bir bor oʻqi. Oyim nimalar oldi va har biri qancha turadi?",
        "Jamini bilish uchun narxlar bilan nima qilish kerak?",
        "Hamma narxlarni ustun qilib yoz va qoʻsh.",
        "Avval non bilan sutning narxini qoʻsh. Keyin olmaning narxini qoʻsh.",
        "Oʻz hisobingni chekdagi bilan solishtir. Qaytim — bu xariddan keyin 50 mingdan qancha qolishi.",
      ],
      solution: {
        answer: "a) Yoʻq, jami — 28 ming soʻm; b) 22 ming soʻm.",
        explanation: ["`4 + 9 + 15 = 28`. Chekda 10 mingga xato qilingan."],
        discuss: [
          "Xato chek boʻyicha toʻlansa, oyisi 10 ming soʻm ortiqcha toʻlagan boʻlardi. Tekshirish hayotda ham asqotadi!",
        ],
      },
    },
    w1d3t8: {
      title: "Seyfning kodi",
      body: [
        { text: "Detektiv bir seyf 🔐 topib oldi. Uning kodi — ikki xonali son. Mana dalillar:" },
        {
          items: [
            "Kod raqamlarining yigʻindisi 9 ga teng. (Masalan, 27 sonining raqamlari yigʻindisi `2 + 7 = 9`.)",
            "Kod — juft son (u 0, 2, 4, 6 yoki 8 bilan tugaydi).",
            "Birinchi raqami ikkinchisidan katta.",
            "Kod 70 dan kichik.",
          ],
        },
        { text: "Seyfning kodi qanday?" },
      ],
      answer: { fields: { code: { label: "Kod" } } },
      followUps: [
        "Qaysi dalil eng koʻp variantni chiqarib tashladi?",
        "Agar 4-dalilni olib tashlasak, nechta kod toʻgʻri keladi?",
      ],
      hints: [
        "Hamma dalillarni yana bir bor oʻqi. Kod — ikki xonali son.",
        "«Raqamlari yigʻindisi 9 ga teng» degani nima? Shunday songa yana bitta misol keltir.",
        "Raqamlari yigʻindisi 9 boʻlgan hamma ikki xonali sonlarni tartib bilan yozib chiq: 18, 27, … Davom ettir.",
        "Roʻyxatdagi hamma toq sonlarni ustidan chizib tashla. Qaysilari qoldi?",
        "Qolgan har bir sonni 3- va 4-dalil boʻyicha tekshir. Bitta son qolguncha chizib tashlayver.",
      ],
      solution: {
        explanation: [
          "Raqamlari yigʻindisi 9: 18, 27, 36, 45, 54, 63, 72, 81, 90.",
          "Juftlari: 18, 36, 54, 72, 90.",
          "Birinchi raqami ikkinchisidan katta: 54, 72, 90.",
          "70 dan kichigi: 54.",
        ],
        discuss: [
          "Bu — variantlarni tartib bilan koʻrib chiqib, keraksizlarini chizib tashlashga doir masala. 4-dalil boʻlmasa, uchta kod toʻgʻri kelardi: 54, 72 va 90. Boshqa istalgan dalilni olib tashlasak ham, bir nechta kod toʻgʻri keladi — demak, har bir dalil kerak.",
          "90 ta ikki xonali sondan 1-dalil faqat 9 tasini qoldiradi. Ulardan 2-dalil 4 ta sonni, 3- va 4-dalillar esa 2 tadan sonni chiqarib tashlaydi.",
        ],
      },
    },
  },
  parent: {
    skills: [
      "Hisoblarni tekshirish: teskari amal va chamalash.",
      "«Faraz qilaylik… — tekshiramiz» tarzidagi mulohaza.",
      "Algoritmni tuzatish: birinchi xato qadamni izlash.",
      "Shakllarni xayolan aylantirish.",
    ],
    observe: [
      "Farzandingiz teskari tekshirishdan (qoʻshish ↔ ayirish) eslatmasdan foydalanadimi.",
      "Guldon haqidagi masalada hamma variantlarni tekshiradimi yoki birinchi mos kelganida toʻxtab qoladimi.",
    ],
    mistakes: [
      "Koʻzgudagi aksni «burilgan» shakl deb hisoblash.",
      "Guldon haqidagi masalada — qolgan holatlarni tekshirmasdan javob tanlash.",
    ],
    question: "Kattalardan soʻramasdan javobing toʻgʻri ekanini qanday isbotlay olasan?",
  },
};
