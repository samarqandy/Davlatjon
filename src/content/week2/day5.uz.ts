/** Неделя 2, день 5 — по-узбекски (накладка на day5.ts, правила — docs/uzbek-style.md). */
import type { Uz } from "../localize";
import type { Day } from "../types";

export const day5Uz: Uz<Day> = {
  title: "Nima oʻzgarmaydi?",
  habit: { name: "Men oʻzgarmaydigan narsani izlayman" },
  intro: [
    "Bugungi asbob — oʻzgarmaydigan narsani izlash ⚖️.",
    "Baʼzan atrofda hamma narsa oʻzgaradi-yu, bitta narsa oʻzgarmay qoladi: yoshlar farqi, markalarning umumiy soni, sonning juft yoki toqligi. Shu «oʻzgarmas»ni topsang, qiyin masala bir qatorda yechiladi!",
  ],
  tasks: {
    w2d5t1: {
      title: "Juftmi yoki toqmi?",
      body: [
        { text: "Aniq hisoblamasdan ayt: javob juft chiqadimi yoki toq?" },
        { items: ["a) `23 + 45`", "b) `17 + 30`", "c) `50 − 21`", "d) `11 + 13 + 15 + 17`"] },
        { text: "Juft sonlar 0, 2, 4, 6 yoki 8 bilan tugaydi, toq sonlar esa 1, 3, 5, 7 yoki 9 bilan." },
      ],
      answer: {
        prompt: "Javob qanday chiqadi?",
        items: {
          a: { label: "a) 23 + 45" },
          b: { label: "b) 17 + 30" },
          c: { label: "c) 50 − 21" },
          d: { label: "d) 11 + 13 + 15 + 17" },
        },
        options: { even: { label: "juft" }, odd: { label: "toq" } },
      },
      followUps: [
        "Javob juft chiqishi uchun nechta toq sonni qoʻshish kerak: 2, 3, 4 yoki 5 ta?",
        "Sonlarning oxirgi raqamlariga qarab javobni qanday qilib darrov bilsa boʻladi?",
      ],
      hints: [
        "Shartni yana bir oʻqib chiq: aniq hisoblash shart emas — faqat javob juft chiqadimi yoki yoʻqmi, shuni bilish kerak.",
        "Nima maʼlum: son juftmi yoki toqmi — oxirgi raqamidan bilinadi. Har bir misoldagi oxirgi raqamlarga qarab chiq.",
        "Sonlarni juft-juft qilib terilgan nuqtalar bilan chiz. Toq sonda bitta nuqta juftsiz qoladi.",
        "Kichikroq misollarni yechib koʻr: `3 + 5`, `3 + 4`, `4 + 6`. Javoblar juft chiqdimi yoki toq?",
        "Toq + toq: ikkita «ortiqcha» nuqta qoʻshilib, bir juft boʻladi — javob juft. Toq + juft: bitta nuqta juftsiz qolaveradi.",
      ],
      solution: {
        answer: "a) Juft; b) toq; c) toq; d) juft.",
        explanation: [
          "a) Toq + toq = juft (`23 + 45 = 68`).",
          "b) Toq + juft = toq (`17 + 30 = 47`).",
          "c) Juft − toq = toq (`50 − 21 = 29`).",
          "d) Toʻrtta toq son: «ortiqcha» nuqtalar ikki juft boʻlib birlashadi, javob juft (`11 + 13 + 15 + 17 = 56`).",
        ],
        discuss: [
          "Sonlarni juft-juft terilgan nuqtalar deb tasavvur qiling: toq sonda bitta nuqta juftsiz qoladi. Ikkita shunday nuqta qoʻshilsa, bir juft boʻladi — shuning uchun toq + toq = juft.",
          "Juft-toqlik — eng kuchli «oʻzgarmas» belgilardan biri: koʻpincha aynan u orqali biror narsa mumkin emasligi isbotlanadi (bugungi stakanchalar va domino toshlari masalalari shunday).",
        ],
      },
    },
    w2d5t2: {
      title: "Yigʻindi oʻzgarmaydi",
      body: [
        { text: "Qulay usulda hisoblab koʻr:" },
        { label: "a)" },
        { label: "b)" },
        {
          text: "Bir sonni qanchaga oshirib, ikkinchisini shunchaga kamaytirsang, yigʻindi oʻzgarmaydi. Ayirma esa ikkala sonni bir xil songa oshirsang, oʻzgarmaydi.",
        },
      ],
      answer: {
        fields: {
          a: { label: "a) 38 + 57 =" },
          b: { label: "b) 63 − 28 =" },
        },
      },
      followUps: [
        "Xuddi shunday hisoblab koʻr: `49 + 26` va `72 − 19`.",
        "Ikkala sonni bir xil oshirsang, nega ayirma oʻzgarmaydi? Dada bilan Davlatjonning yoshlarini eslab koʻr.",
      ],
      hints: [
        "Ramkadagi maslahatni yana bir oʻqib chiq: yigʻindi bilan ayirma qachon oʻzgarmaydi?",
        "a) misolda nima maʼlum: 38 — deyarli 40. 40 boʻlishi uchun 38 ga qancha qoʻshish kerak? Buni qaysi sondan olsa boʻladi?",
        "Ikki uyum toshcha chiz va bir uyumdan ikkinchisiga 2 ta toshcha oʻtkaz. Toshchalarning umumiy soni oʻzgardimi?",
        "Kichikroq misolni olib koʻr: `9 + 6` bilan `10 + 5` — ayni bir narsa. Nega?",
        "Ayirmada boshqacha: ikkala sonni bir xil songa oshiramiz. `63 − 28` bilan `65 − 30` — ayni bir narsa.",
      ],
      solution: {
        answer: "a) 95; b) 35.",
        explanation: [
          "a) 57 dan 2 ni olib, 38 ga beramiz: `38 + 57 = 40 + 55 = 95`.",
          "b) Ikkala sonni 2 ga oshiramiz: `63 − 28 = 65 − 30 = 35`.",
        ],
        discuss: [
          "Ayirma — xuddi yoshlar farqiga oʻxshaydi: 2 yildan keyin ota ham, oʻgʻil ham 2 yoshga kattaroq boʻladi, farq esa avvalgidek qoladi.",
          null,
        ],
      },
    },
    w2d5t3: {
      title: "Stakanchalar",
      body: [
        {
          text: "Stolda 3 ta stakancha turibdi — hammasining tubi pastda. Bir yurishda roppa-rosa ikkita stakanchani agʻdarish mumkin (qaysilarini — oʻzing tanlaysan).",
        },
        { text: "Bir necha yurishdan keyin uchala stakancha ham toʻnkarilib turishi mumkinmi?" },
        { text: "Uchta haqiqiy stakancha yoki qogʻozdan qirqilgan uchta doiracha olib, sinab koʻr!" },
      ],
      answer: {
        prompt: "Sening javobing:",
        options: {
          two: { label: "Mumkin, 2 yurishda" },
          three: { label: "Mumkin, 3 yurishda" },
          never: { label: "Necha yurish qilsang ham boʻlmaydi" },
        },
      },
      followUps: [
        "Stakanchalar 4 ta boʻlsa-chi? Hammasini toʻnkarib qoʻyish mumkinmi?",
        "Nega javob aynan shunday ekanini kattalarga tushuntirib ber.",
      ],
      hints: [
        "Shartni yana oʻqib chiq: bir yurishda roppa-rosa ikkita stakancha agʻdariladi — bitta ham emas, uchta ham emas.",
        "Nima maʼlum: boshida toʻnkarilgan stakancha 0 ta. Birinchi yurishdan keyin ular nechta boʻlishi mumkin?",
        "Haqiqiy stakanchalar bilan sinab koʻr yoki ularni chiz. Har yurishdan keyin nechta stakancha toʻnkarilganini yozib bor.",
        "Kichikroq masalani yech: stakancha 2 ta. Ikkalasini ham toʻnkarsa boʻladimi? 4 ta boʻlsa-chi?",
        "Yozganlaringga qara: har yurishdan keyin toʻnkarilgan stakanchalar soni — 0, 2, 2, 0… Bu son qachondir toq boʻladimi?",
      ],
      solution: {
        answer: "Mumkin emas.",
        explanation: [
          "Toʻnkarilgan stakanchalarni sanab boramiz. Boshida ular 0 ta.",
          "Har bir yurish bu sonni 2 ga oʻzgartiradi (ikkalasi ham toʻnkarildi yoki ikkalasi ham qaytarib qoʻyildi) yoki umuman oʻzgartirmaydi (biri toʻnkarildi, boshqasi esa qaytarib qoʻyildi).",
          "Demak, bunday stakanchalar soni doim juft: 0 yoki 2. Bizga esa 3 ta kerak — bu toq son. Shuning uchun buning iloji yoʻq.",
        ],
        discuss: [
          "Bu — biror ish mumkin emasligining haqiqiy isboti: oʻzgarmaydigan narsa (juft-toqlik) topildi va maqsadda u boshqacha ekani koʻrindi.",
          "Toʻrtta stakancha bilan 2 yurishda chiqadi. Agar farzandingiz «chiqmayapti, lekin balki mumkindir» desa — «men topa olmadim» bilan «buning iloji yoʻq»ning farqini muhokama qilish uchun ayni payt.",
        ],
      },
    },
    w2d5t4: {
      title: "Toʻqqizlar",
      body: [
        { text: "Qatorni davom ettir:" },
        null,
        { text: "Endi har bir sonning raqamlarini qoʻshib chiq. Nima oʻzgarmayapti?" },
      ],
      answer: { fields: { n6: { label: "6-son" }, n7: { label: "7-son" } } },
      followUps: [
        "Qatordagi har bir sonning raqamlarini qoʻsh. Nima chiqyapti?",
        "Shu sir yordamida qatorda 72 soni bor-yoʻqligini qanday tez bilsa boʻladi? 75 soni-chi?",
      ],
      hints: [
        "Qatorga yana bir qara: har bir son oldingisidan qanchaga katta?",
        "Nima maʼlum: har safar 9 qoʻshiladi. 9 ni qoʻshish esa — 10 ni qoʻshib, 1 ni ayirish bilan barobar.",
        "Sonlarni ustun qilib yoz va alohida oʻnliklarga, alohida birliklarga qara: ular qanday oʻzgaryapti?",
        "45 ga 10 ni qoʻsh, keyin 1 ni ayir. Nima chiqdi?",
        "Oʻnliklar 1 taga koʻpayadi, birliklar esa 1 taga kamayadi. Unda raqamlar yigʻindisi bilan nima boʻladi?",
      ],
      solution: {
        explanation: [
          "Har safar 9 qoʻshamiz: `45 + 9 = 54`, `54 + 9 = 63`.",
          "9 ni qoʻshish — bu 10 ni qoʻshib, 1 ni ayirish degani. Shuning uchun oʻnliklar bittaga koʻpayadi, birliklar bittaga kamayadi, raqamlar yigʻindisi esa oʻzgarmaydi: `1 + 8`, `2 + 7`, `3 + 6`… — doim 9.",
        ],
        discuss: [
          "Raqamlar yigʻindisi — bu qatorda oʻzgarmaydigan narsa (ikki xonali sonlarda). 72 ning raqamlari yigʻindisi `7 + 2 = 9` — bu son qatorda bor; 75 niki esa 12 — u qatorda yoʻq.",
        ],
      },
    },
    w2d5t5: {
      title: "Robot qaytib keladimi?",
      body: [
        { text: "Robot 🤖 devorsiz katta maydonda turibdi va dasturni bajaradi." },
        {
          text: "Robotni ishga tushirmay turib, qaysi dasturlardan keyin u yoʻlga chiqqan katagiga qaytib kelishini top.",
        },
      ],
      answer: {
        prompt: "Shunday dasturlarning hammasini belgila:",
        options: {
          a: { label: "A: → → ↑ ← ↓ ←" },
          b: { label: "B: ↑ → ↓ → ← ↑" },
          c: { label: "C: ← ↑ ↑ → ↓ ↓" },
          d: { label: "D: → ↑ ↑ ← ↓" },
        },
      },
      followUps: [
        "5 ta buyruqli dasturdan keyin robot startga qaytishi mumkinmi? 7 ta buyruqlidan keyin-chi? Nega?",
        "8 ta buyruqdan iborat oʻz dasturingni tuz: undan keyin robot joyiga qaytib kelsin.",
      ],
      hints: [
        "Shartni yana oʻqib chiq: robotni ishga tushirish shart emas — oʻzing oʻylab topishing kerak.",
        "Nima maʼlum: → strelka robotni bir katak oʻngga olib ketadi. Qaysi strelka uni orqaga qaytaradi?",
        "Har bir dasturdagi strelkalarni sana: nechta →, nechta ←, nechta ↑ va nechta ↓. Jadvalga yozib qoʻy.",
        "Kichikroq masalani yech: `→ ←` dasturidan keyin robot qaytib keladimi? `→ ↑ ←` dan keyin-chi?",
        "Robot qaytib kelishi uchun → lar soni ← lar soniga, ↑ lar soni esa ↓ lar soniga teng boʻlishi kerak. Strelkalar tartibi muhim emas!",
      ],
      solution: {
        answer: "A va C.",
        explanation: [
          "A: ikkita →, ikkita ←, bitta ↑ va bitta ↓ — hammasi teng, robot qaytib keladi.",
          "B: ikkita ↑ va bor-yoʻgʻi bitta ↓, ikkita → va bitta ← — robot bir katak yuqorida va bir katak oʻngda boʻlib qoladi.",
          "C: bitta ← va bitta →, ikkita ↑ va ikkita ↓ — qaytib keladi.",
          "D: ikkita ↑ va bitta ↓ — qaytib kelmaydi. Buning ustiga unda 5 ta buyruq bor, qaytib keladigan dasturda esa buyruqlar soni doim juft boʻladi.",
        ],
        discuss: [
          "Asosiy narsa oʻzgarmaydi: qaytib kelish uchun har bir strelkaga teskari tomonga qaragan «jufti» kerak. Shuning uchun qaytib keladigan dasturda buyruqlar soni doim juft — 5 yoki 7 ta buyruqdan keyin robot startda boʻla olmaydi.",
          "Bu yana juft-toqlik — xuddi stakanchalardagidek.",
        ],
      },
    },
    w2d5t6: {
      title: "Yarim aylantir",
      body: [
        {
          text: "Qaysi figuralar yarim aylantirilsa oʻzgarmaydi? Yarim aylantirish — bu xuddi qogʻoz varagʻini stol ustida burib, «oyogʻini osmondan» qilib qoʻyishdek.",
        },
        { text: "Figuralarni qogʻozga chizib olib, varaqni aylantirib, solishtirib koʻrsang boʻladi." },
      ],
      answer: {
        prompt: "Oʻzgarmaydigan figuralarning hammasini belgila:",
        options: { a: { label: "A" }, b: { label: "B" }, c: { label: "C" }, d: { label: "D" } },
      },
      followUps: [
        "Qaysi harflar «oyogʻi osmondan» boʻlsa ham oʻzgarmaydi? H, O, P, T, X harflarini tekshirib koʻr.",
        "Kataklardan oʻz figurangni chiz: u shunday burilganda ham oʻzgarmasin.",
      ],
      hints: [
        "Shartni yana oʻqib chiq: figura yarim aylantiriladi, yaʼni «oyogʻi osmondan» boʻladi.",
        "Bunday burilishda figuraning yuqori chap burchagidagi katak bilan nima boʻladi? U qayerga borib qoladi?",
        "Har bir figurani katakli varaqqa chizib ol, varaqni aylantirib, «oyogʻini osmondan» qil va avvalgisi bilan solishtir.",
        "B figuradan boshla: u T harfiga oʻxshaydi. T harfi «oyogʻi osmondan» boʻlsa, qanday koʻrinadi?",
        "Agar burilgandan keyin figura xuddi avvalgidek koʻrinsa — u toʻgʻri keladi.",
      ],
      solution: {
        answer: "A va C.",
        explanation: [
          "A va C figuralar yarim aylantirilgandan keyin oʻz-oʻzi bilan ustma-ust tushadi: har bir katak figuraning boshqa bir katagi oʻrniga keladi.",
          "B figura («T») burilgandan keyin pastga «qarab» qoladi, D figura («burchak») esa burchagini boshqa tomonga burib oladi. Ular oʻzgardi.",
        ],
        discuss: [
          "B figura koʻzguda simmetrik, lekin burilishda emas — farzandingiz bu ikki narsa har xil ekanini payqasa, juda yaxshi.",
          "Harflardan H, O va X «oyogʻi osmondan» boʻlsa ham oʻzgarmaydi, P va T esa oʻzgaradi. (Qiziq: N, S va Z ham oʻzgarmaydi.)",
        ],
      },
    },
    w2d5t7: {
      title: "Markalar tenglashadi",
      body: [
        { text: "Davlatjonda 30 ta marka bor, Alida esa 10 ta. Davlatjon har kuni Aliga 2 ta marka sovgʻa qiladi." },
        { label: "a)", text: "Necha kundan keyin ikkala bolaning markalari teng boʻladi?" },
        { label: "b)", text: "Oʻshanda har birida nechta marka boʻladi?" },
      ],
      answer: {
        fields: {
          days: { label: "a) teng boʻladi", suffix: "kundan keyin" },
          each: { label: "b) har birida", suffix: "ta marka" },
        },
      },
      followUps: [
        "Ikkala bolada jami nechta marka bor? Bu son oʻzgaradimi?",
        "Necha kundan keyin Alining markalari Davlatjonnikidan 4 ta koʻp boʻladi?",
      ],
      hints: [
        "Shartni yana oʻqib chiq: kim kimga marka sovgʻa qilyapti va har kuni nechtadan?",
        "Nima maʼlum: markalar bir boladan ikkinchisiga oʻtadi, xolos. Markalarning umumiy soni oʻzgaradimi?",
        "Jadval tuz: kun — Davlatjonning markalari — Alining markalari — jami.",
        "Kichikroq masalani yech: birida 6 ta marka, ikkinchisida 2 ta, birinchisi har kuni ikkinchisiga 1 ta marka beradi. Qachon teng boʻladi?",
        "Jami markalar doim 40 ta. Teng boʻlsa, har birida nechta boʻladi? Shuncha qolishi uchun Davlatjon nechta marka berishi kerak?",
      ],
      solution: {
        answer: "a) 5 kundan keyin; b) har birida 20 tadan marka.",
        explanation: [
          "Jami markalar `30 + 10 = 40` ta va bu son oʻzgarmaydi: markalar faqat bir boladan ikkinchisiga oʻtadi.",
          "Teng — demak, har birida 20 tadan. Davlatjon `30 − 20 = 10` ta marka berishi kerak, kuniga 2 tadan — bu 5 kun.",
          "Jadval bilan tekshiramiz: 30 va 10, 28 va 12, 26 va 14, 24 va 16, 22 va 18, 20 va 20.",
        ],
        discuss: [
          "Koʻp uchraydigan xato — farq kuniga 2 taga kamayadi deb oʻylash. Aslida 4 taga: birida 2 ta kamayadi, ikkinchisida 2 ta koʻpayadi.",
          "6 kundan keyin Alida 22 ta marka boʻladi, Davlatjonda esa 18 ta: 4 ta koʻp.",
        ],
      },
    },
    w2d5t8: {
      title: "Domino toshlari",
      body: [
        {
          text: "4 × 4 kvadratdan ikkita burchak katagi qirqib olindi — yuqori chap va pastki oʻng kataklar. 14 ta katak qoldi.",
        },
        null,
        {
          text: "Bu figurani 7 ta domino toshi bilan toʻliq yopish mumkinmi? Har bir domino toshi roppa-rosa 2 ta qoʻshni katakni yopadi. Toshlar bir-birining ustiga chiqmaydi va figuradan tashqariga chiqib ketmaydi.",
        },
      ],
      answer: {
        prompt: "Sening javobing:",
        options: { yes: { label: "Ha, mumkin" }, no: { label: "Yoʻq, mumkin emas" } },
      },
      followUps: [
        "Agar yonma-yon turgan ikki burchak katagi — yuqori chap va yuqori oʻng kataklar qirqilsa-chi? Unda chiqadimi?",
        "Kataklarni boʻyash javobni isbotlashga qanday yordam berganini kattalarga tushuntirib ber.",
      ],
      hints: [
        "Shartni yana oʻqib chiq: qaysi kataklar qirqilgan? Bitta domino toshi nechta katakni yopadi?",
        "Qogʻozda figurani domino toshlari bilan yopib koʻr. Chiqyaptimi? Ortiqcha katak doim qayerda qolyapti?",
        "Kataklarni shaxmat taxtasidek boʻya: qora, oq, qora, oq… Nechta qora va nechta oq katak chiqdi?",
        "Kichikroq masalani yech: bitta domino toshi qanday kataklarni yopadi — bir xil rangdagimi yoki har xil rangdagimi?",
        "Har bir domino toshi bitta qora va bitta oq katakni yopadi. Demak, 7 ta tosh 7 ta qora va 7 ta oq katakni yopadi. Figurada esa har bir rangdan nechtadan katak bor?",
      ],
      solution: {
        answer: "Mumkin emas.",
        explanation: [
          "Kataklarni shaxmat tartibida boʻyaymiz. Qirqilgan ikkala burchak katagi bir xil rangda, masalan, qora. 6 ta qora va 8 ta oq katak qoldi.",
          "Har qanday domino toshi bitta qora va bitta oq katakni yopadi. 7 ta tosh 7 ta qora va 7 ta oq katakni yopgan boʻlardi — qora kataklar esa bor-yoʻgʻi 6 ta. Demak, qancha urinmaylik, figurani yopib boʻlmaydi.",
        ],
        discuss: [
          "Bu — mashhur olimpiada masalasi (odatda u 8 × 8 shaxmat taxtasi uchun yechiladi). Boʻyash oʻzgarmaydigan narsani topishga yordam beradi: nechta domino toshi qoʻyilmasin, ularning ostida qora va oq kataklar teng boʻladi.",
          "Agar yuqori chap va yuqori oʻng kataklar qirqilsa, ular har xil rangda boʻladi — va figurani yopish mumkin. Usulini birgalikda topib koʻring.",
        ],
      },
    },
  },
  parent: {
    skills: [
      "Oʻzgarmaydigan narsani izlash: umumiy miqdor, ayirma, juft-toqlik, raqamlar yigʻindisi.",
      "Biror narsa mumkin emasligini isbotlash (stakanchalar, domino toshlari).",
      "Burilishdagi simmetriyani koʻzgu simmetriyasidan farqlash.",
    ],
    observe: [
      "Farzandingiz shunchaki «chiqmayapti» deyish bilan qolmay, nega «mumkin emas»ligini tushuntira oladimi?",
      "Nimadir oʻzgarmasligini (markalarning umumiy soni, yoshlar farqi) oʻzi payqaydimi?",
    ],
    mistakes: [
      "Stakanchalar va domino toshlari: bir necha marta chiqmagach, «mumkin, faqat men topolmadim» deb javob berish. Bu — «topolmadim» bilan «mumkin emas»ning farqini muhokama qilish uchun yaxshi imkoniyat.",
      "Markalar: farq kuniga 2 taga kamayadi deb hisoblash.",
    ],
    question: "Bugun atrofda hamma narsa oʻzgarsa ham, nima oʻzgarmay qoldi?",
  },
};
