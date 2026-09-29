/** Неделя 2, день 4 — по-узбекски (накладка на day4.ts, правила — docs/uzbek-style.md). */
import type { Uz } from "../localize";
import type { Day } from "../types";

export const day4Uz: Uz<Day> = {
  title: "Sinab koʻr va yaxshila",
  habit: { name: "Men sinab koʻraman va yaxshilayman" },
  intro: [
    "Bugungi asbob — aqlli sinov 🎯.",
    "Qanday yechishni bilmayapsanmi? Sinab koʻr! Nima chiqqanini tekshir va oʻylab koʻr: koʻproq kerakmi yoki kamroq? Har bir urinishda maqsadga yaqinlashib borasan. Urinishlaringni jadvalga yozib bor — shunda ular aqlli boʻladi.",
  ],
  tasks: {
    w2d4t1: {
      title: "Bir xil sonlar",
      body: [
        { text: "Har bir misolda hamma «?» oʻrnida bitta son turibdi. Uni top." },
        { label: "a)" },
        { label: "b)" },
        { label: "c)" },
      ],
      answer: { fields: { a: { label: "a) son" }, b: { label: "b) son" }, c: { label: "c) son" } } },
      followUps: ["Qaysi misolda javobni eng tez topding? Nega?", "Bir xil sonlar bilan oʻz misolingni oʻylab top."],
      hints: [
        "Shartni yana bir bor oʻqib chiq: bitta misoldagi hamma «?» — bitta son.",
        "a) misolda 5 ni sinab koʻr: `5 + 5 + 5 = 15`. Bu 27 dan koʻpmi yoki kammi?",
        "Urinishlaringni jadvalga yoz: son — nima chiqdi — keragidan koʻpmi yoki kammi.",
        "Kichikroq misolni yechib koʻr: `? + ? + ? = 6`. Bu qaysi son?",
        "Sonni 1 taga oshirsang, uchta bir xil sonning yigʻindisi 3 taga oshadi. 27 gacha yana qancha yetmayapti?",
      ],
      solution: {
        answer: "a) 9; b) 10; c) 15.",
        explanation: [
          "a) Sinab koʻramiz: `8 + 8 + 8 = 24` — kam, `9 + 9 + 9 = 27` ✓.",
          "b) Avval 5 ni olib tashlaymiz: `25 − 5 = 20`, 20 esa — `10 + 10`.",
          "c) 10 ni sinasak, 30 chiqadi — 15 yetmaydi, yaʼni har bir songa 5 tadan: `15 + 15 + 15 = 45` ✓.",
        ],
        discuss: [
          "Aqlli sinov — tavakkaliga topish emas: har bir urinishdan keyin bola sonni qaysi tomonga va qanchaga oʻzgartirishni hal qiladi. U «3 yetmayapti — demak, har bir son 1 taga katta boʻlishi kerak» deb mulohaza yuritsa — juda yaxshi.",
        ],
      },
    },
    w2d4t2: {
      title: "Yashiringan raqamlar",
      body: [
        { text: "Har bir darchaga bitta raqam yashiringan. Qanday sonlar yozilganini top." },
        { label: "a)" },
        { label: "b)" },
      ],
      answer: {
        fields: {
          a1: { label: "a) birinchi son" },
          a2: { label: "a) ikkinchi son" },
          b1: { label: "b) birinchi son" },
          b2: { label: "b) ikkinchi son" },
        },
      },
      followUps: ["b) javobini qoʻshish bilan qanday tekshirasan?", "Raqamlari yashiringan oʻz misolingni oʻylab top."],
      hints: [
        "Diqqat bilan oʻqi: har bir darchada — roppa-rosa bitta raqam.",
        "a) misolda nima maʼlum: 5 ga yashiringan raqamni qoʻshsak, 2 bilan tugaydigan son chiqadi. Bu qaysi raqam?",
        "Misolni ustun shaklida yoz va darchalarni bittalab toʻldir: avval birliklarni, keyin oʻnliklarni.",
        "Sinab koʻr: `5 + 7 = 12`. Demak, ikkinchi son 7 bilan tugaydi, bitta oʻnlik esa oʻnliklar xonasiga oʻtadi.",
        "b) misolni qoʻshish bilan tekshirish qulay: `29 + ☐4` yigʻindisi `6☐` boʻlishi kerak. Raqamlarni tartib bilan birma-bir sinab koʻr.",
      ],
      solution: {
        answer: "a) `45 + 37 = 82`; b) `63 − 34 = 29`.",
        explanation: [
          "a) Birliklar: `5 + 7 = 12` — 2 ni yozamiz, bitta oʻnlik keyingi xonaga oʻtadi. Oʻnliklar: `4 + 3 + 1 = 8`. Demak, 45 va 37.",
          "b) Qoʻshish bilan tekshiramiz: `29 + ☐4 = 6☐`. Birliklar: `9 + 4 = 13` — demak, birinchi son 3 bilan tugaydi va bitta oʻnlik keyingi xonaga oʻtadi. Oʻnliklar: `2 + 3 + 1 = 6` — ikkinchi darchada ham 3. Natija: `63 − 34 = 29`.",
        ],
        discuss: [
          "Boshqa javob yoʻq — buni barcha raqamlarni birma-bir tekshirib koʻrib isbotlash mumkin. Masala sinovni mulohaza bilan birga olib borishga oʻrgatadi: hamma variantlarni ketma-ket sinamasdan, mos kelmaydiganlarini darhol chetga surish kerak.",
        ],
      },
    },
    w2d4t3: {
      title: "Dadang ikki baravar katta",
      body: [
        { text: "Tasavvur qil: sen 8 yoshdasan, dadang esa 32 yoshda." },
        { text: "Necha yildan keyin dadang sendan roppa-rosa ikki baravar katta boʻladi?" },
        {
          text: "«Ikki baravar katta» degani — dadangning yoshi sening yoshingcha va yana shuncha boʻladi.",
        },
      ],
      answer: { fields: { years: { label: "Necha yildan keyin?" } } },
      followUps: [
        "Oʻsha yili har biringiz necha yoshda boʻlasiz?",
        "Hozir dadang sendan necha yosh katta? 16 yildan keyin-chi?",
      ],
      hints: [
        "Shartni yana bir bor oʻqib chiq: hozir sen va dadang necha yoshdasiz? Nima boʻlishi kerak?",
        "Har yili dadang ham, sen ham 1 yoshga kattalashasiz. Dadang sendan necha yosh katta? Bu farq oʻzgaradimi?",
        "Jadval tuz: necha yildan keyin — sening yoshing — dadangning yoshi — sening yoshingning ikki baravari.",
        "Sinab koʻr: 10 yildan keyin sen 18 yoshda, dadang 42 yoshda boʻladi. 18 dan ikki baravar koʻp — bu 36. Dadang hali ham keragidan katta. Yana sinab koʻr!",
        "Dadang har doim 24 yosh katta. Ikki baravar katta degani: dadangning yoshi — sening yoshing va yana shuncha. Sen necha yoshda boʻlganingda 24 yillik farq aynan sening yoshingga teng boʻladi?",
      ],
      solution: {
        answer: "16 yildan keyin: sen 24 yoshda, dadang esa 48 yoshda boʻladi.",
        explanation: [
          "Urinishlar: 4 yildan keyin — 12 va 36 (ikki baravar boʻlishi uchun 24 kerak edi), 10 yildan keyin — 18 va 42 (36 kerak edi), 16 yildan keyin — 24 va 48 ✓.",
          "Mulohaza bilan ham topsa boʻladi: dadang har doim 24 yosh katta. Sen ham xuddi shuncha — 24 yoshga toʻlganingda, dadang sendan ikki baravar katta boʻladi. Bu `24 − 8 = 16` yildan keyin.",
        ],
        discuss: [
          "Yoshlar farqi oʻzgarmaydi — bu «invariant», ertangi kunning asbobi. Farzandingiz «Dada har doim 24 yosh katta!» deb oʻzi payqasa — juda yaxshi.",
          "Jadval bilan sinab koʻrish ham toʻlaqonli usul. Asosiysi — har bir urinishdan keyin qaysi tomonga harakat qilishni tushunish.",
        ],
      },
    },
    w2d4t4: {
      title: "Sirli devor",
      body: [
        { text: "Sonlar devorida har bir son uning tagidagi ikkita sonning yigʻindisiga teng." },
        { label: "a)", text: "Pastda uchta bir xil son, tepada esa — 36. Pastdagi son qaysi?" },
        {
          label: "b)",
          text: "Pastda ketma-ket kelgan uchta son (4, 5, 6 kabi), tepada esa — 32. Pastdagi sonlar qaysilar?",
        },
      ],
      answer: {
        fields: {
          a: { label: "a) pastdagi son" },
          b1: { label: "b) pastdagi birinchi son" },
          b2: { label: "b) pastdagi ikkinchi son" },
          b3: { label: "b) pastdagi uchinchi son" },
        },
      },
      followUps: [
        "Pastda 10, 10, 10 boʻlsa, tepada qaysi son chiqadi?",
        "Nega a) devorda tepada doim «pastdagi son toʻrt marta» chiqadi?",
      ],
      hints: [
        "Shartni yana bir bor oʻqib chiq: devordagi har bir son — uning tagidagi ikkita sonning yigʻindisi.",
        "a) devorda istalgan sonni sinab koʻr, masalan, 5 ni. Devorni qur: pastda 5, 5, 5. Tepada nima chiqdi?",
        "Devorni chiz va unga urinishingni yoz. Tepada keragidan koʻp chiqdimi yoki kam?",
        "Kichikroq masalani yechib koʻr: pastda 1, 1, 1. Tepada nima chiqadi? Pastda 2, 2, 2 boʻlsa-chi?",
        "Urinishlaringga qara: pastdagi son 1 taga oshsa, tepadagisi 4 taga oshadi. Yana qancha yetmayapti?",
      ],
      solution: {
        answer: "a) 9; b) 7, 8, 9.",
        explanation: [
          "a) 5 ni sinaymiz: `5 + 5 = 10`, `10 + 10 = 20` — kam. 8 ni sinaymiz: tepada 32 — kam. 9 ni sinaymiz: `9 + 9 = 18`, `18 + 18 = 36` ✓.",
          "b) 5, 6, 7 ni sinaymiz: oʻrtada 11 va 13, tepada 24 — kam. 7, 8, 9 ni sinaymiz: oʻrtada 15 va 17, tepada 32 ✓.",
        ],
        discuss: [
          "Tepada har doim shunday chiqadi: pastdagi chap son, ikki marta oʻrtadagi son va pastdagi oʻng son. Shuning uchun pastdagi sonlar bir xil boʻlsa, tepadagi son pastdagi sonni toʻrt marta qoʻshganga teng (`9 + 9 + 9 + 9 = 36`); 10, 10, 10 boʻlsa, tepada 40.",
          "Sonlar devori yettinchi kundagi tadqiqotda yana uchraydi.",
        ],
      },
    },
    w2d4t5: {
      title: "Daryodan oʻtish",
      body: [
        {
          text: "Dehqon 👨‍🌾 daryoning narigi qirgʻogʻiga boʻri 🐺, echki 🐐 va karamni 🥬 olib oʻtishi kerak. Qayiqqa faqat dehqonning oʻzi va yana bittasi sigʻadi.",
        },
        {
          items: [
            "Boʻri bilan echkini dehqonsiz qoldirsa, boʻri echkini yeb qoʻyadi.",
            "Echki bilan karamni qoldirsa, echki karamni yeb qoʻyadi.",
            "Boʻri karam yemaydi.",
          ],
        },
        {
          text: "Hammasini qanday qilib sogʻ-salomat olib oʻtsa boʻladi? Sinab koʻr! Chiqmasa — suzishni bekor qil va rejangni yaxshila.",
        },
      ],
      answer: {
        puzzle: {
          driver: { name: "Dehqon" },
          items: { wolf: { name: "boʻri" }, goat: { name: "echki" }, cabbage: { name: "karam" } },
          conflicts: [{ text: "boʻri echkini yeb qoʻyadi! 🐺" }, { text: "echki karamni yeb qoʻyadi! 🐐" }],
        },
      },
      followUps: [
        "Necha marta suzib oʻtishga toʻgʻri keldi? Tezroq boʻlishi mumkinmi?",
        "Ikkinchi usulni top: echkidan keyin boʻrini emas, karamni olib oʻtsak, nima oʻzgaradi?",
      ],
      hints: [
        "Shartni yana bir bor oʻqib chiq: kimlarni dehqonsiz birga qoldirib boʻlmaydi?",
        "Boʻri karam yemasligi maʼlum. Kimni boʻri bilan ham, karam bilan ham qoldirish «xavfli»? Demak, aynan uni hech kim bilan qoldirib boʻlmaydi.",
        "Har bir suzishni yozib bor: qayiqda kim suzyapti va har bir qirgʻoqda kim qoldi.",
        "Birinchi boʻlib faqat echkini olib oʻtish mumkin. Nega? Boʻridan yoki karamdan boshlasang nima boʻlishini tekshirib koʻr.",
        "Hiyla: baʼzan kimnidir orqaga olib qaytish kerak! Dehqon echkini birinchi qirgʻoqqa qaytarib olib kelishi mumkin.",
      ],
      solution: {
        answer:
          "7 marta suzib oʻtish. Masalan: echki →; dehqon yolgʻiz ←; boʻri →; echki ← (orqaga!); karam →; dehqon yolgʻiz ←; echki →.",
        explanation: [
          "Birinchi boʻlib faqat echkini olib oʻtish mumkin: usiz boʻri bilan karam xavfsiz.",
          "Keyin boʻrini olib oʻtamiz — lekin echkini u bilan qoldirib boʻlmaydi, shuning uchun echkini orqaga olib ketamiz.",
          "Echkini birinchi qirgʻoqda qoldirib, karamni boʻrining yoniga olib oʻtamiz va echkini olib kelish uchun qaytamiz.",
        ],
        discuss: [
          "Asosiy hiyla — «echkini orqaga olib ketish»: baʼzan bir qadam orqaga yurish maqsadga yaqinlashtiradi. Bu boshqotirma ming yildan ham koʻproq vaqt oldin paydo boʻlgan.",
          "Yechim ikkita: echkidan keyin boʻrini ham, karamni ham olib oʻtish mumkin — ikkala holda ham 7 marta suzib oʻtiladi.",
        ],
      },
    },
    w2d4t6: {
      title: "Toʻgʻri toʻrtburchak yasa",
      body: [
        {
          text: "Qaysi ikkita shaklni birlashtirsak, toʻgʻri toʻrtburchak hosil boʻladi? Unda 2 qator, har qatorda 4 tadan katak boʻlishi kerak. Shakllarni burish va agʻdarish mumkin.",
        },
        null,
      ],
      answer: {
        prompt: "Ikkita shaklni tanla:",
        options: { a: { label: "A" }, b: { label: "B" }, c: { label: "C" }, d: { label: "D" } },
      },
      followUps: [
        "Shakllar toʻgʻri toʻrtburchakka qanday joylashishini chizib koʻrsat.",
        "Shunday toʻgʻri toʻrtburchakni ikkita B shakldan yasasa boʻladimi? Ikkita C shakldan-chi?",
      ],
      hints: [
        "Shartni yana bir bor oʻqib chiq: roppa-rosa ikkita shaklni tanlash kerak, ular birgalikda 2 × 4 toʻgʻri toʻrtburchakni hosil qilishi kerak.",
        "Toʻgʻri toʻrtburchakda nechta katak bor? Har bir shaklda-chi?",
        "Katakli qogʻozga 2 × 4 toʻgʻri toʻrtburchak chiz va unga shakllarni joylashtirib koʻr. Ularni qogʻozdan qirqib olsang ham boʻladi.",
        "Toʻgʻri toʻrtburchakka A shaklni qoʻy. Uning qaysi qismi boʻsh qoldi? U qaysi shaklga oʻxshaydi?",
        "Har bir juftlikni tekshir: bitta shaklni qoʻy va boʻsh joy ikkinchi shaklga mos kelishini qara (uni burish yoki agʻdarish mumkin).",
      ],
      solution: {
        answer: "A va D shakllar.",
        explanation: [
          "Toʻgʻri toʻrtburchakda 8 ta katak, har bir shaklda — 4 tadan.",
          "Toʻgʻri toʻrtburchakka A shaklni («burchak»ni) qoʻysak, boʻsh joy ham burchak boʻladi. D shakl — xuddi shunday burchak, faqat burilgan.",
          "B shakl («T») va C shakl («zigzag») boʻsh joyni ikkita alohida boʻlakka ajratib qoʻyadi, shuning uchun hech bir shakl uni toʻldira olmaydi.",
        ],
        discuss: [
          "Bu yerda sinab koʻrish — eng yaxshi asbob: shaklni qoʻyib, boʻsh joyga qarash. Qogʻozdan qirqilgan shakllar juda yordam beradi.",
          "Ikkita B yoki ikkita C shakldan 2 × 4 toʻgʻri toʻrtburchak yasab boʻlmaydi: boʻsh joy har doim ikki boʻlakka boʻlinib qoladi.",
        ],
      },
    },
    w2d4t7: {
      title: "Roppa-rosa 50",
      body: [
        { text: "{name:da} 50 ming soʻm bor. Oʻyinchoqlar doʻkonidagi narxlar (ming soʻmda):" },
        {
          visual: {
            items: [
              { label: "toʻp — 23" },
              { label: "kitob — 18" },
              { label: "mashinacha — 27" },
              { label: "pazl — 15" },
              { label: "boʻyoqlar — 12" },
            ],
          },
        },
        {
          text: "{name} roppa-rosa 50 ming soʻm sarflamoqchi — ortiq ham emas, kam ham emas. Har bir oʻyinchoqni koʻpi bilan bir marta sotib olish mumkin. Barcha usullarni top.",
        },
      ],
      answer: { fields: { ways: { label: "Jami nechta usul bor?" } } },
      followUps: [
        "50 ming soʻmga toʻrtta oʻyinchoq olsa boʻladimi? Nega?",
        "Roppa-rosa 30 ming soʻmga nima olsa boʻladi?",
      ],
      hints: [
        "Shartni yana bir bor oʻqib chiq: roppa-rosa 50 ming sarflash kerak — ortiq ham emas, kam ham emas.",
        "Beshta oʻyinchoqning narxi maʼlum. Avval mashinachani olib koʻr — u eng qimmati. Qancha pul qoladi?",
        "Urinishlaringni yozib bor: qaysi oʻyinchoqlarni olding — ular birgalikda qancha turadi — qancha yetmayapti yoki qancha ortib qoldi.",
        "Kichikroq masalani yechib koʻr: qaysi ikkita oʻyinchoq birgalikda roppa-rosa 50 turadi?",
        "Uchta oʻyinchoqli xaridlarni unutma! Ikkita oʻyinchoq 50 dan arzon boʻlsa, balki uchinchisi roppa-rosa 50 ga yetkazar?",
      ],
      solution: {
        answer: "2 ta usul: toʻp va mashinacha (`23 + 27 = 50`) yoki toʻp, pazl va boʻyoqlar (`23 + 15 + 12 = 50`).",
        explanation: [
          "Ikkita oʻyinchoq: faqat toʻp bilan mashinacha mos keladi. Boshqa juftliklar boshqa yigʻindi beradi, masalan, `18 + 27 = 45`.",
          "Uchta oʻyinchoq: toʻp, pazl va boʻyoqlar. Boshqa uchliklar 50 dan koʻp yoki kam chiqadi, masalan, `18 + 15 + 12 = 45`.",
          "Toʻrtta oʻyinchoq olib boʻlmaydi: hatto eng arzon toʻrttasi ham `12 + 15 + 18 + 23 = 68` turadi.",
        ],
        discuss: [
          "Farzandingiz juftliklarni tartib bilan koʻrib chiqsa va birorta variantni tushirib qoldirmasa — juda yaxshi. Aqlli sinov mana bunday eshitiladi: «5 ming yetmayapti — arzonroq oʻyinchoq kerak».",
          "Roppa-rosa 30 ming soʻmga: kitob va boʻyoqlar (`18 + 12 = 30`).",
        ],
      },
    },
    w2d4t8: {
      title: "Suv quyish",
      body: [
        {
          text: "{name:da} ikkita chelak bor: 3 litrli va 5 litrli. Chelaklarda oʻlchov chiziqlari yoʻq — faqat chelak boʻshmi yoki toʻlami, shuni koʻrish mumkin.",
        },
        {
          text: "Chelakni jumrakdan liq toʻldirish, boʻshatish yoki bir chelakdan ikkinchisiga suv quyish mumkin. Qanday qilib roppa-rosa 4 litr suv olsa boʻladi?",
        },
      ],
      followUps: [
        "Nechta harakat kerak boʻldi? Tezroq qilsa boʻladimi?",
        "Qanday qilib roppa-rosa 1 litr olsa boʻladi? 2 litrni-chi?",
      ],
      hints: [
        "Shartni yana bir bor oʻqib chiq: chelaklar bilan qanday harakatlar qilish mumkin?",
        "Darhol 3 litr yoki 5 litr olish mumkin. Katta chelakdan kichigini liq toʻldirguncha suv quysak, kattasida qancha qoladi?",
        "Har bir harakatdan keyin har bir chelakda qancha suv borligini yozib bor.",
        "Kichikroq masalani yechib koʻr: roppa-rosa 2 litrni qanday olsa boʻladi? (Katta chelakni toʻldir va undan kichigini liq toʻlguncha quy.)",
        "Katta chelakda 2 litr, kichigi boʻsh boʻlganda, shu 2 litrni kichigiga quy. Kichik chelakka yana qancha sigʻadi? Endi kattasini yana toʻldir…",
      ],
      solution: {
        answer:
          "6 ta harakat: katta chelakni toʻldirish → kichigiga quyish (kattasida 2 l qoldi) → kichigini boʻshatish → 2 l ni kichigiga quyish → kattasini toʻldirish → kichigini liq toʻlguncha quyish (kattasida 4 l qoldi).",
        explanation: [
          "Har bir harakatdan keyin qancha suv bor (kichik va katta chelak): 0 va 5 → 3 va 2 → 0 va 2 → 2 va 0 → 2 va 5 → 3 va 4.",
          "Oxirgi marta kichik chelakka faqat 1 litr sigʻadi, shuning uchun kattasida `5 − 1 = 4` litr qoladi.",
        ],
        discuss: [
          "Boshqacha ham qilsa boʻladi — kichik chelakni toʻldirib, kattasiga quyish mumkin, lekin unda 8 ta harakat kerak boʻladi.",
          "1 litr: kichik chelakni ikki marta toʻldirib, kattasiga quyish — ikkinchi safar kattasiga faqat 2 litr sigʻadi va kichigida 1 litr qoladi. 2 litr: katta chelakni toʻldirib, kichigiga quyish.",
        ],
      },
    },
  },
  parent: {
    skills: [
      "Aqlli sinov: urinish → tekshirish → qaysi tomonga oʻzgartirish kerakligi haqida xulosa.",
      "Urinishlar jadvali.",
      "Harakatlar rejasini izlash (daryodan oʻtish, suv quyish) — algoritmik fikrlashning asosi.",
    ],
    observe: [
      "U tavakkaliga sinaydimi yoki har bir yangi urinishni oldingisining natijasiga qarab tanlaydimi.",
      "Daryodan oʻtishdagi muvaffaqiyatsiz urinishga qanday munosabatda boʻladi: xafa boʻladimi yoki rejasini yaxshilaydimi.",
    ],
    mistakes: [
      "Daryodan oʻtish: hammani faqat «oldinga» olib oʻtish va echkini qaytarib olib kelishni oʻylab topmaslik.",
      "«Roppa-rosa 50»: bitta usulni topib, toʻxtab qolish.",
    ],
    question: "Bugun qaysi muvaffaqiyatsiz urinish senga toʻgʻri yoʻlni koʻrsatdi?",
  },
};
