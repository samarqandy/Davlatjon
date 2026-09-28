/** Неделя 2, день 1 — по-узбекски (накладка на day1.ts, правила — docs/uzbek-style.md). */
import type { Uz } from "../localize";
import type { Day } from "../types";

export const day1Uz: Uz<Day> = {
  title: "Masalani chizib koʻr",
  habit: { name: "Men masalani chizaman" },
  intro: [
    "Salom, Davlatjon! 👋 Ikkinchi hafta boshlandi. Bu — asboblar haftasi 🧰.",
    "Ustaning qutisida bolgʻa, arra va ombur bor. Mutafakkirning ham oʻz asboblari bor — bular qiyin masalalarni yechish usullari. Har kuni sen bittadan yangi asbob olasan.",
    "Birinchi asbob — rasm ✏️. Masala chigal boʻlib qolsa, uni chizib ol: nuqtalar, tayoqchalar, tasmachalar, strelkalar. Rasm sen bilan birga oʻylaydi!",
  ],
  tasks: {
    w2d1t1: {
      title: "Yuzgacha",
      body: [
        { text: "Har bir songa nechani qoʻshsang, 100 chiqadi?" },
        { items: ["a) `64 + ? = 100`", "b) `27 + ? = 100`", "c) `85 + ? = 100`"] },
        { text: "Son nuri boʻylab sakrab borish qulay: avval yaxlit songacha, keyin esa 10 tadan." },
      ],
      answer: {
        fields: {
          a: { label: "a) 64 ga qoʻshish kerak" },
          b: { label: "b) 27 ga qoʻshish kerak" },
          c: { label: "c) 85 ga qoʻshish kerak" },
        },
      },
      followUps: [
        "Mana bu juftliklarga qara: 64 va 36, 27 va 73, 85 va 15. Ularning raqamlarida nimani payqading?",
        "Qoʻshganda 100 chiqadigan ikkita son oʻylab top.",
      ],
      hints: [
        "Shartni yana bir bor oʻqib chiq: 100 gacha qancha yetmasligini topish kerak.",
        "Bitta son maʼlum, yigʻindi esa 100 boʻlishi kerak. 64 dan keyingi eng yaqin yaxlit son qaysi?",
        "Son nurini chiz va unda 64 bilan 100 ni belgila. Avval 70 gacha sakra, keyin 10 tadan sakrab 100 ga yet.",
        "Kichikroq misolni yechib koʻr: 4 dan 10 gacha qancha yetmaydi? 64 dan 70 gacha-chi?",
        "64 dan 70 gacha — 6, 70 dan 100 gacha — yana 30. Sakrashlaringni qoʻshib chiq.",
      ],
      solution: {
        answer: "a) 36; b) 73; c) 15.",
        explanation: [
          "a) `64 + 6 = 70`, `70 + 30 = 100` — jami `6 + 30 = 36`.",
          "b) `27 + 3 = 30`, `30 + 70 = 100` — jami 73.",
          "c) `85 + 5 = 90`, `90 + 10 = 100` — jami 15.",
        ],
        discuss: [
          "Qoʻshilganda 100 beradigan «doʻst sonlar»da birliklar yigʻindisi 10 ga, oʻnliklar yigʻindisi esa 9 ga teng: 64 va 36 da bu `4 + 6 = 10` va `6 + 3 = 9`. Farzandingiz buni oʻzi payqasa — ajoyib.",
          "Son nuri — haftaning birinchi «rasmi»: u ustun shaklida yozmasdan, ogʻzaki hisoblashga yordam beradi.",
        ],
      },
    },
    w2d1t2: {
      title: "Ikki tasma",
      body: [
        { text: "Koʻk tasma 🎀 25 sm uzunlikda, qizil tasma esa undan 8 sm uzunroq." },
        { label: "a)", text: "Qizil tasmaning uzunligi qancha?" },
        { label: "b)", text: "Ikkala tasmaning umumiy uzunligi qancha?" },
        { text: "Tasmalarni chizib koʻr: avval koʻkini, uning tagiga qizilini." },
      ],
      answer: {
        fields: {
          red: { label: "a) qizil tasma", suffix: "sm" },
          both: { label: "b) ikkala tasma birga", suffix: "sm" },
        },
      },
      followUps: [
        "Agar qizil tasma koʻkidan 8 sm qisqa boʻlganida, ikkala tasma birgalikda qancha boʻlardi?",
        "b) javobni boshqa usul bilan qanday tekshirsa boʻladi?",
      ],
      hints: [
        "Yana bir bor oʻqib chiq: qaysi tasma uzunroq — koʻkimi yoki qizilimi? Qanchaga uzun?",
        "Koʻk tasmaning uzunligi maʼlum, qizili undan qanchaga uzunligi ham maʼlum. Avval nimani topish kerak?",
        "Bir-birining tagiga ikkita tasma chiz: qizili koʻki bilan bir xil, ustiga yana 8 sm.",
        "Kichikroq masalani yechib koʻr: koʻk tasma 5 sm, qizili undan 2 sm uzun. Qizil tasma necha sm? Ikkalasi birgalikda necha sm?",
        "Avval qizil tasmaning uzunligini top: `25 + 8`. Keyin ikkala tasmaning uzunligini qoʻsh.",
      ],
      solution: {
        answer: "a) 33 sm; b) 58 sm.",
        explanation: [
          "a) `25 + 8 = 33` sm.",
          "b) `25 + 33 = 58` sm. Rasmga qarab tekshiramiz: ikkita koʻk tasma va yana 8 sm — `25 + 25 + 8 = 58`.",
        ],
        discuss: [
          "Bu ikki amalli masala: avval qizil tasmaning uzunligini bilish kerak. Tasmalar rasmi nimani birinchi topish kerakligini koʻrsatib turadi.",
          "Agar qizil tasma 8 sm qisqa boʻlganida: `25 − 8 = 17`, birgalikda `25 + 17 = 42` sm.",
        ],
      },
    },
    w2d1t3: {
      title: "Navbat",
      body: [
        { text: "Davlatjon muzqaymoq olish uchun navbatda turibdi 🍦." },
        {
          label: "a)",
          text: "Uning oldida 4 kishi, orqasida esa 5 kishi bor. Navbatda jami necha kishi turibdi?",
        },
        {
          label: "b)",
          text: "Ali boshqa navbatda turibdi. Oldindan sanasang, u beshinchi, orqadan sanasang ham — beshinchi. Bu navbatda necha kishi bor?",
        },
      ],
      answer: {
        fields: {
          a: { label: "a) navbatda necha kishi" },
          b: { label: "b) Alining navbatida necha kishi" },
        },
      },
      followUps: [
        "Agar Davlatjon oldindan ham, orqadan ham uchinchi boʻlsa, navbatda necha kishi boʻladi?",
        "Oʻzing bir navbat chizib, oyingga yoki dadangga shunday topishmoq ayt.",
      ],
      hints: [
        "Shartni yana bir bor oʻqib chiq. Davlatjonning oʻzini unutma — u ham navbatda turibdi-ku!",
        "Oldinda necha kishi va orqada necha kishi borligi maʼlum. Ularning oʻrtasida kim turibdi?",
        "Navbatni chiz: har bir odam — bitta doiracha. Davlatjonning doirachasini boʻyab qoʻy.",
        "Kichikroq masalani yechib koʻr: oldinda 1 kishi, orqada 1 kishi. Jami necha kishi? Chizib koʻr!",
        "b) savolda Ali oldindan beshinchi: demak, uning oldida 4 kishi bor. Orqasida necha kishi turibdi?",
      ],
      solution: {
        answer: "a) 10; b) 9.",
        explanation: [
          "a) Oldinda 4 kishi, Davlatjonning oʻzi va orqada 5 kishi: `4 + 1 + 5 = 10`.",
          "b) Oldindan beshinchi — demak, Alining oldida 4 kishi. Orqadan beshinchi — orqasida ham 4 kishi: `4 + 1 + 4 = 9`.",
        ],
        discuss: [
          "Koʻp uchraydigan xatolar: a) savolda 9 degan javob (Davlatjonning oʻzi unutilgan), b) savolda — 10 («5 + 5»: Ali ikki marta sanalgan). Qogʻozdagi doirachalar hammasini darhol oydinlashtiradi.",
          "Agar Davlatjon ikkala tomondan ham uchinchi boʻlsa, navbatda `2 + 1 + 2 = 5` kishi boʻladi.",
        ],
      },
    },
    w2d1t4: {
      title: "Toshchalardan kvadratlar",
      body: [
        { text: "Davlatjon toshchalarni terib, kvadratlar yasayapti." },
        null,
        { label: "a)", text: "Beshinchi kvadratda nechta toshcha boʻladi?" },
        {
          label: "b)",
          text: "Toʻrtinchi kvadratdan beshinchisini yasash uchun yana nechta toshcha qoʻshish kerak?",
        },
      ],
      answer: {
        fields: {
          n5: { label: "a) 5-kvadratdagi toshchalar" },
          add: { label: "b) qoʻshish kerak" },
        },
      },
      followUps: [
        "Kvadrat har safar kattalashganda nechta toshcha qoʻshildi? Bu qanday sonlar?",
        "10-kvadratda nechta toshcha bor?",
      ],
      hints: [
        "Kvadratlarga yana bir qara. Ularning har biri qanday tuzilgan?",
        "3-kvadratda nechta qator bor? Har bir qatorda nechta toshcha?",
        "5-kvadratni oʻzing chiz: 5 qator, har birida 5 tadan toshcha.",
        "Kichikroq masalani yechib koʻr: 1-kvadratdan 2-kvadrat hosil boʻlganda nechta toshcha qoʻshildi? 2-kvadratdan 3-kvadrat hosil boʻlganda-chi?",
        "Har safar bitta «burchakcha» qoʻshiladi: yon tomonga bir qator va pastga bir qator toshcha. 5-kvadrat uchun burchakchadagi toshchalarni sana — burchakdagi toshcha ikkala qator uchun umumiy.",
      ],
      solution: {
        answer: "a) 25; b) 9.",
        explanation: [
          "5-kvadratda 5 qator, har birida 5 tadan toshcha: `5 + 5 + 5 + 5 + 5 = 25`.",
          "4-kvadratga (16 ta toshcha) burchakcha qoʻshamiz: yon tomonga 5 ta va pastga yana 4 ta — `5 + 4 = 9`. Tekshiramiz: `16 + 9 = 25`.",
        ],
        discuss: [
          "Har safar qoʻshiladigan toshchalar soni — toq sonlar: 3, 5, 7, 9… Shuning uchun `1 + 3 + 5 + 7 + 9 = 25`. 1, 4, 9, 16, 25 sonlari «kvadrat sonlar» deyiladi — ular shu hafta yana uchraydi.",
          "10-kvadratda 10 qator, har birida 10 tadan toshcha — jami 100 ta.",
        ],
      },
    },
    w2d1t5: {
      title: "Labirint",
      body: [
        { text: "Robot 🤖 labirintga tushib qoldi. Unga bayroqchagacha 🚩 yetib borishga yordam ber." },
        {
          text: "Avval yoʻlni qalam (yoki barmogʻing) bilan topib ol, keyin dastur tuz. Dastur iloji boricha qisqa boʻlsin.",
        },
      ],
      followUps: [
        "Dasturingda nechta buyruq bor? Bundan qisqaroq boʻlishi mumkinmi?",
        "Labirintda boshi berk yoʻllar qayerda? U yerga borish shart emasligini qanday bilsa boʻladi?",
      ],
      hints: [
        "Diqqat bilan oʻqi: robot faqat oq kataklardan yuradi, toʻq kataklardan oʻtib boʻlmaydi.",
        "Robot qayerda, bayroqcha qayerda? Robotdan qaysi yoʻlaklar boshlanadi?",
        "Labirintni katakli qogʻozga chiz va yoʻlni qalam bilan chizib chiq. Boshi berk yoʻlga kirib qolsang — oʻchirib, boshqa yoʻlakni sinab koʻr.",
        "Baʼzan labirintni oxiridan — bayroqchadan robotga qarab oʻtish osonroq. Bayroqchaga qaysi yoʻlakdan kelsa boʻladi?",
        "Yoʻlni topgach, uni strelkalar bilan yozib ol. Strelkalarni sanab chiq va borib-qaytgan qadamlar yoʻqligini tekshir.",
      ],
      solution: {
        answer: "Eng qisqa dastur — 15 ta buyruq: → → ↓ ↓ ← ← ↓ ↓ → → → → ↓ → →.",
        explanation: [
          "Robot devorgacha oʻngga yuradi, pastga tushadi, keyin chapga ketadi (goʻyo notoʻgʻri tomonga!), chap chekka boʻylab pastga tushadi va pastki yoʻlakdan oʻngga — bayroqcha tomon yuradi.",
          "Pastki qatordan yuqoriga va oʻngga olib boradigan yoʻlakning oxiri berk: u orqali bayroqchaga yetib boʻlmaydi.",
        ],
        discuss: [
          "Bayroqcha oʻngda turganda chapga yurish — labirintning asosiy hiylasi. Farzandingizdan soʻrang: «Nega avval bayroqchadan uzoqlashtiradigan yoʻl toʻgʻri boʻlib chiqdi?»",
          "Oxirida bir xil qisqa ikkita variant bor: ↓ → → yoki → ↓ →.",
        ],
      },
    },
    w2d1t6: {
      title: "Yashiringan kubiklar",
      body: [
        {
          text: "Davlatjon kubiklardan shakl yasadi. Kubiklar havoda osilib turmaydi: yuqoridagi har bir kubikning tagida boshqa kubiklar bor.",
        },
        null,
        { label: "a)", text: "Shaklda nechta kubik bor?" },
        {
          label: "b)",
          text: "Yana nechta kubik qoʻshsak, tekis blok hosil boʻladi? Blok 3 qavatli boʻlsin, har bir qavatda — 2 qator, har qatorda 3 tadan kubik.",
        },
      ],
      answer: {
        fields: {
          cubes: { label: "a) shakldagi kubiklar" },
          add: { label: "b) qoʻshish kerak" },
        },
      },
      followUps: [
        "Rasmda nechta kubik umuman koʻrinmaydi?",
        "Shunday shaklni kubiklardan yoki konstruktordan yasab, oʻzingni tekshirib koʻr!",
      ],
      hints: [
        "Rasmga yana bir qara. Qaysi kubiklar koʻrinib turibdi, qaysilari yashirinib olgan?",
        "Shaklda nechta ustuncha bor? Har bir ustunchaning balandligi qancha?",
        "Shaklni yuqoridan qaraganda qanday koʻrinsa, shunday chiz: 2 qator, har birida 3 tadan katak. Har bir katakka shu ustunchada nechta kubik borligini yozib qoʻy.",
        "Kichikroq masalani yechib koʻr: avval faqat orqa qatordagi kubiklarni sana. Keyin — oldingi qatordagilarni.",
        "«Yuqoridan koʻrinish» rasmingdagi sonlarni qoʻsh. b) uchun: blokda har bir ustunchada 3 tadan kubik boʻladi. Har bir ustunchada nechtasi yetmayapti?",
      ],
      solution: {
        answer: "a) 10 ta kubik; b) 8 ta kubik.",
        explanation: [
          "Yuqoridan koʻrinish: orqa qator — 3, 2, 1, oldingi qator — 2, 1, 1. Jami `3 + 2 + 1 + 2 + 1 + 1 = 10`.",
          "Blokda 6 ta ustuncha, har birida 3 tadan kubik: `3 + 3 + 3 + 3 + 3 + 3 = 18`. Demak, `18 − 10 = 8` ta kubik yetmaydi.",
        ],
        discuss: [
          "Rasmda 3 ta kubik koʻrinmaydi: ikkitasi — baland ustuncha tagida, bittasi — qoʻshni ustuncha tagida. Sonlar yozilgan «yuqoridan koʻrinish» rasmi — hech narsani tushirib qoldirmaslikning ishonchli usuli.",
          "b) uchun boshqa usul: har bir ustunchada 3 gacha nechta yetmasligini sanaymiz: `0 + 1 + 2 + 1 + 2 + 2 = 8`.",
        ],
      },
    },
    w2d1t7: {
      title: "Zinapoya",
      body: [
        {
          text: "Davlatjon 4-qavatda yashaydi. 1-qavatdan 2-qavatga chiqish uchun 12 ta pogʻonani bosib oʻtish kerak.",
        },
        { label: "a)", text: "1-qavatdan uyigacha Davlatjon nechta pogʻonani bosib oʻtadi?" },
        {
          label: "b)",
          text: "Uning doʻsti Ali 1-qavatdan uyiga chiqquncha 24 ta pogʻonani bosib oʻtdi. Ali nechanchi qavatda yashaydi?",
        },
      ],
      answer: {
        fields: {
          steps: { label: "a) pogʻonalar soni" },
          floor: { label: "b) Ali nechanchi qavatda yashaydi?", suffix: "-qavatda" },
        },
      },
      followUps: [
        "2-qavat bilan 4-qavat orasida nechta pogʻona bor?",
        "Oraliqlar bittaga kam boʻladigan bunday hiyla yana qayerda uchraydi?",
      ],
      hints: [
        "Shartga yana bir qara: Davlatjon qaysi qavatdan qaysi qavatga chiqadi?",
        "12 ta pogʻona — bu bitta zinapoya: bir qavatdan keyingi qavatgacha. 1-qavatdan 4-qavatgacha nechta shunday zinapoya bor?",
        "4 qavatli uyni va qavatlar orasidagi zinapoyalarni chiz. Nechta zinapoya chiqdi?",
        "Kichikroq masalani yechib koʻr: 1-qavatdan 2-qavatgacha nechta pogʻona bor? 3-qavatgacha nechta?",
        "Qavatlar 4 ta, ularning orasidagi zinapoyalar esa bittaga kam.",
      ],
      solution: {
        answer: "a) 36 ta pogʻona; b) 3-qavatda.",
        explanation: [
          "1-qavatdan 4-qavatgacha — 3 ta zinapoya: `12 + 12 + 12 = 36`.",
          "24 ta pogʻona — bu 2 ta zinapoya (`12 + 12 = 24`). 1-qavatdan ikkita zinapoya yuqorida — 3-qavat.",
        ],
        discuss: [
          "Koʻp uchraydigan xato — 48 degan javob (`12 + 12 + 12 + 12`): qavatlar orasidagi zinapoyalar emas, qavatlarning oʻzi sanalgan. Zinapoyali uy rasmi buni darhol koʻrsatadi.",
          "Xuddi shu tuzoq soat haqidagi yulduzchali masalada ham bor: oraliqlar har doim nuqtalardan bittaga kam. 2-qavat bilan 4-qavat orasida — 24 ta pogʻona.",
        ],
      },
    },
    w2d1t8: {
      title: "Soat bong uradi",
      body: [
        {
          text: "Qadimiy soat 🕰️ vaqtni bong urib bildiradi: soat 4 da — 4 marta, soat 7 da — 7 marta bong uradi.",
        },
        {
          text: "Soat 4 da birinchi bongdan oxirgisigacha 6 soniya oʻtdi. Soat 7 da birinchi bongdan oxirgisigacha necha soniya oʻtadi?",
        },
        { text: "Bonglar orasidagi tanaffuslar doim bir xil." },
      ],
      answer: {
        fields: { seconds: { label: "Soat 7 da necha soniya oʻtadi?", suffix: "soniya" } },
      },
      followUps: [
        "Soat 12 da bong urish necha soniya davom etadi?",
        "Bu masala zinapoya haqidagi masalaga nimasi bilan oʻxshaydi?",
      ],
      hints: [
        "Shartni yana bir bor oʻqib chiq: vaqt birinchi bongdan oxirgi bonggacha hisoblanadi.",
        "Bizga maʼlum: 4 ta bong — 6 soniya. 4 ta bong orasida nechta tanaffus bor?",
        "Bir qatorga 4 ta nuqta chiz — bular bonglar. Ularning orasiga yoychalar chiz — bular tanaffuslar. Nechta yoycha chiqdi?",
        "Kichikroq masalani yechib koʻr: 2 ta bong orasida nechta tanaffus bor? 3 ta bong orasida nechta?",
        "Bitta tanaffus necha soniya davom etishini top. 7 ta bong orasida nechta tanaffus bor?",
      ],
      solution: {
        answer: "12 soniya.",
        explanation: [
          "4 ta bong orasida — 3 ta tanaffus. 6 soniya 3 ta tanaffusga boʻlinadi — har biriga 2 soniyadan (`2 + 2 + 2 = 6`).",
          "7 ta bong orasida — 6 ta tanaffus: `2 + 2 + 2 + 2 + 2 + 2 = 12` soniya.",
        ],
        discuss: [
          "Koʻp beriladigan javob — «10 yarim soniya», goʻyo har bir bongga bir yarim soniya ketadigandek. Nuqta-bonglar va yoy-tanaffuslar rasmi tanaffuslarni sanash kerakligini koʻrsatadi.",
          "Soat 12 da — 11 ta tanaffus, har biri 2 soniyadan, yaʼni 22 soniya.",
        ],
      },
    },
  },
  parent: {
    skills: [
      "Rasm — asbob sifatida: son nuri, tasmachalar, doirachalar, «yuqoridan koʻrinish».",
      "Ikki amalli masalalar.",
      "«Oraliqlar nuqtalardan bittaga kam» tuzogʻi (zinapoya, soat).",
    ],
    observe: [
      "U oʻzi chiza boshlaydimi yoki faqat maslahatdan keyinmi.",
      "Rasm unga yordam beryaptimi: u rasmga qarab mulohaza yuritadimi yoki «chiroyli boʻlsin» deb chizadimi.",
    ],
    mistakes: [
      "Navbat: Davlatjonning oʻzini sanashni unutish yoki Alini ikki marta sanash.",
      "Zinapoya: 36 oʻrniga 48 ta pogʻona; soat: tanaffuslar oʻrniga bonglarni sanash.",
    ],
    question: "Bugun qaysi rasm senga eng koʻp yordam berdi — nega?",
  },
};
