/** Неделя 3, день 4 — по-узбекски (накладка на day4.ts, правила — docs/uzbek-style.md). */
import type { Uz } from "../localize";
import type { Day } from "../types";

export const day4Uz: Uz<Day> = {
  title: "Taroziga sol va solishtir",
  habit: { name: "Men solishtiraman va tarozida tortaman" },
  intro: [
    "Bugun biz solishtiramiz: nima ogʻirroq, nima uzunroq, qayerda koʻproq. Kunning asosiy asbobi — pallali tarozi ⚖️. U narsa necha kilogramm ekanini koʻrsatmaydi, faqat qaysi pallasi ogʻirroq ekanini koʻrsatadi.",
    "Lekin haqiqiy izquvar bunday tarozi bilan ham istalgan narsani topadi! Kun oxirida esa seni qalbaki tangani izlash kutyapti 🪙.",
  ],
  tasks: {
    w3d4t1: {
      title: "Hisoblamasdan solishtir",
      body: [
        {
          text: "Ifodalar orasiga >, < yoki = belgisini qoʻy. Ularni oxirigacha hisoblamaslikka harakat qil!",
        },
        {
          items: [
            "a) `38 + 17` ☐ `17 + 38`",
            "b) `45 + 29` ☐ `45 + 30`",
            "c) `63 − 18` ☐ `63 − 20`",
            "d) `50 + 25` ☐ `49 + 26`",
            "e) `70 − 35` ☐ `71 − 35`",
          ],
        },
      ],
      answer: {
        prompt: "Qaysi belgini qoʻyish kerak?",
        items: {
          a: { label: "a) 38 + 17 ☐ 17 + 38" },
          b: { label: "b) 45 + 29 ☐ 45 + 30" },
          c: { label: "c) 63 − 18 ☐ 63 − 20" },
          d: { label: "d) 50 + 25 ☐ 49 + 26" },
          e: { label: "e) 70 − 35 ☐ 71 − 35" },
        },
      },
      followUps: [
        "c) misolni tushuntir: nega kamroq ayirsang, koʻproq qoladi?",
        "Oʻz misolingni oʻylab top: ifodalardagi sonlar har xil boʻlsin, ifodalarning oʻzi esa teng chiqsin.",
      ],
      hints: [
        "Yana bir oʻqi: hisoblash shart emas. Ifodalar nimasi bilan oʻxshash, nimasi bilan farq qilishini solishtir.",
        "a) da bir xil sonlar qoʻshilyapti, faqat boshqa tartibda.",
        "Har bir ifoda uchun ikkita tasma chiz. Ularning qaysi qismi umumiy, nimasi bilan farq qiladi?",
        "b) ni koʻrib chiqamiz: birinchi son bir xil, ikkinchisi esa — 29 va 30. Qaysi yigʻindi katta?",
        "c) Bir xil sondan 18 ni va 20 ni ayiryapmiz. Qayerda koʻproq qoladi? d) Bir son 1 ga kamaydi, ikkinchisi — 1 ga ortdi.",
      ],
      solution: {
        answer: "a) =; b) <; c) >; d) =; e) <.",
        explanation: [
          "a) Qoʻshiluvchilarning oʻrni almashgani bilan yigʻindi oʻzgarmaydi.",
          "b) 45 ga kamroq qoʻshyapmiz (29 < 30) — yigʻindi kichik.",
          "c) 63 dan kamroq ayiryapmiz (18 < 20) — koʻproq qoladi.",
          "d) Birinchi qoʻshiluvchi 1 ga kichik, ikkinchisi 1 ga katta — yigʻindi oʻsha-oʻsha.",
          "e) Bir xil son ayiryapmiz, lekin kichikroq sondan (70 < 71) — kamroq qoladi.",
        ],
        discuss: [
          "Hisoblamasdan, mulohaza yuritib ham solishtirish mumkin. Agar farzandingiz baribir hisoblab chiqsa — keyin hisoblamasdan qanday qilsa boʻlishini tushuntirib bersin.",
        ],
      },
    },
    w3d4t2: {
      title: "Tarozi toshlari muvozanatda",
      body: [
        { text: "Tarozi muvozanatda ⚖️. «?» tarozi toshi qancha tortadi?" },
        { label: "a)", text: "Chapda — 7 kg va 5 kg, oʻngda — 9 kg va «?» tosh." },
        { label: "b)", text: "Chapda — 15 kg va «?» tosh, oʻngda — 8 kg dan uchta tosh." },
        { label: "c)", text: "Chapda — ikkita bir xil «?» tosh, oʻngda — 12 kg va 6 kg." },
      ],
      answer: {
        fields: {
          a: { label: "a) tosh ogʻirligi", suffix: "kg" },
          b: { label: "b) tosh ogʻirligi", suffix: "kg" },
          c: { label: "c) har bir tosh ogʻirligi", suffix: "kg" },
        },
      },
      followUps: [
        "Har bir masalani tenglik qilib yoz: `7 + 5 = 9 + ?`.",
        "a) dagi tarozining ikkala pallasidan 5 kg dan olib qoʻyilsa, nima boʻladi?",
      ],
      hints: [
        "Yana bir oʻqi: tarozi muvozanatda — demak, chapda ham, oʻngda ham ogʻirlik bir xil.",
        "a) da chapda `7 + 5 = 12` kg. Oʻngda qancha boʻlishi kerak?",
        "Tarozini chiz va toshlarning ogʻirligini yozib chiq. Har bir palla savolli toshsiz qancha tortishini hisobla.",
        "b) da oʻngda `8 + 8 + 8` kg. Chap palla shu ogʻirlikka yetishi uchun qancha yetmayapti?",
        "c) Oʻngda 18 kg. Ikkita bir xil tosh 18 kg tortadi — bittasi qancha tortadi?",
      ],
      solution: {
        answer: "a) 3 kg; b) 9 kg; c) 9 kg.",
        explanation: [
          "a) `7 + 5 = 12`, demak, `9 + ? = 12` va tosh 3 kg tortadi.",
          "b) `8 + 8 + 8 = 24`, demak, `15 + ? = 24` va tosh 9 kg tortadi.",
          "c) `12 + 6 = 18` — bu ikkita bir xil tosh: `9 + 9 = 18`, har biri 9 kg tortadi.",
        ],
        discuss: [
          "Muvozanatdagi tarozi — bu tenglik. Ikkala palladan bir xil toshlarni olib qoʻyish mumkin, muvozanat buzilmaydi — tenglamalar ham shunday yechiladi.",
        ],
      },
    },
    w3d4t3: {
      title: "Tarozi nimani koʻrsatadi?",
      body: [
        {
          text: "Kuchukni 🐶, mushukni 🐱 va quyonlarni 🐰 pallali tarozida tortishdi. Hamma quyonlarning ogʻirligi bir xil.",
        },
        null,
        {
          text: "Birinchi tarozida kuchuk mushuk bilan quyonning birgalikdagi ogʻirligidan ogʻirroq. Ikkinchi tarozida mushuk ikkita quyon bilan teng keldi. Agar taroziga mana bunday qoʻysak, u nimani koʻrsatadi?",
        },
      ],
      answer: {
        prompt: "Tarozi nimani koʻrsatadi?",
        items: {
          a: { label: "a) chapda 🐶, oʻngda 🐰🐰🐰" },
          b: { label: "b) chapda 🐶, oʻngda 🐰🐰🐰🐰" },
          c: { label: "c) chapda 🐱🐱, oʻngda 🐰🐰🐰🐰" },
          d: { label: "d) chapda 🐰🐰, oʻngda 🐶" },
        },
        options: {
          left: { label: "Chap palla ogʻirroq" },
          right: { label: "Oʻng palla ogʻirroq" },
          equal: { label: "Muvozanat" },
          unknown: { label: "Bilib boʻlmaydi" },
        },
      },
      followUps: [
        "b) ning javobini bilish uchun taroziga nimani qoʻyib tortish kerak?",
        "Rasmdagi hamma narsa rost boʻlishi uchun kuchuk, mushuk va quyon qanchadan tortishi mumkinligini oʻylab top.",
      ],
      hints: [
        "Ikkala tarozi nimani koʻrsatganini yana bir oʻqi. Bundan nima aniq maʼlum?",
        "Mushuk ikkita quyonchalik tortadi. Demak, mushuk oʻrniga xayolan ikkita quyonni qoʻysa boʻladi.",
        "Birinchi tarozini qaytadan chiz, mushukni ikkita quyon bilan almashtir. Nima hosil boʻldi?",
        "Kuchuk uchta quyondan ogʻirroq. Toʻrtta quyondan-chi? Shunday ogʻirliklar oʻylab topki, bir holda «ha», boshqasida «yoʻq» chiqsin.",
        "Agar baʼzi hollarda tarozi bir tomonga, boshqa hollarda esa boshqa tomonga ogʻsa, javob — «bilib boʻlmaydi».",
      ],
      solution: {
        answer: "a) Chap palla ogʻirroq; b) bilib boʻlmaydi; c) muvozanat; d) oʻng palla ogʻirroq.",
        explanation: [
          "Mushuk ikkita quyonchalik tortadi. Demak, kuchuk `2 + 1 = 3` ta quyondan ogʻirroq.",
          "a) Kuchuk uchta quyondan ogʻir — chap palla ogʻirroq.",
          "b) Toʻrtta quyon haqida hech narsa maʼlum emas: agar quyon 2 kg, mushuk 4 kg tortsa, kuchuk 7 kg (toʻrtta quyondan yengil) yoki 9 kg (ogʻir) tortishi mumkin. Bilib boʻlmaydi.",
          "c) Ikkita mushuk — bu `2 + 2 = 4` ta quyon: muvozanat.",
          "d) Kuchuk uchta quyondan ogʻir, demak, ikkitasidan ham ogʻir — oʻng palla ogʻirroq.",
        ],
        discuss: [
          "Eng qimmatli javob — b) dagi «bilib boʻlmaydi». Farzandingiz uni har xil ogʻirlikdagi ikkita misol bilan asoslab bersa, juda yaxshi.",
        ],
      },
    },
    w3d4t4: {
      title: "Ikki barobar ogʻir",
      body: [
        {
          text: "Tarozi toshlari toʻplamida har bir keyingi tosh oldingisidan ikki barobar ogʻir: 1 kg, 2 kg, 4 kg, 8 kg va hokazo.",
        },
        null,
        { label: "a)", text: "Oltinchi tosh qancha tortadi?" },
        { label: "b)", text: "Dastlabki beshta tosh birgalikda qancha tortadi?" },
        { label: "c)", text: "Dastlabki oltitasi birgalikda-chi?" },
      ],
      answer: {
        fields: {
          sixth: { label: "a) oltinchi tosh", suffix: "kg" },
          sum5: { label: "b) dastlabki beshtasi birgalikda", suffix: "kg" },
          sum6: { label: "c) dastlabki oltitasi birgalikda", suffix: "kg" },
        },
      },
      followUps: [
        "Dastlabki toshlar yigʻindisini keyingi tosh bilan solishtir. Nimani payqading?",
        "Dastlabki yettita tosh birgalikda qancha tortadi? Qoʻshmasdan javob berishga urinib koʻr.",
      ],
      hints: [
        "Yana bir oʻqi: «ikki barobar ogʻir» — keyingi tosh ikkita oldingi toshchalik tortadi degani.",
        "8 kg dan keyingi tosh — `8 + 8 = 16` kg.",
        "Oltala toshni qatorga yozib chiq. Ularning tagiga yigʻindini yoz: 1, `1 + 2 = 3`, `3 + 4 = 7`…",
        "Yigʻindilarga qara: 1, 3, 7, 15… Toshlar esa: 2, 4, 8, 16… Har bir yigʻindini keyingi tosh bilan solishtir.",
        "Biror toshgacha boʻlgan hamma toshlarning yigʻindisi doim oʻsha toshdan 1 ga kam.",
      ],
      solution: {
        answer: "a) 32 kg; b) 31 kg; c) 63 kg.",
        explanation: ["Toshlar: 1, 2, 4, 8, 16, 32 kg.", "b) `1 + 2 + 4 + 8 + 16 = 31`.", "c) `31 + 32 = 63`."],
        discuss: [
          "Toshlar yigʻindisi doim keyingi toshdan 1 ga kam: `1 + 2 = 4 − 1`, `1 + 2 + 4 = 8 − 1`… Shuning uchun dastlabki yettita tosh `128 − 1 = 127` kg tortadi.",
          "Bu toshlar toʻplami — 7-kundagi tadqiqotning bosh qahramoni.",
        ],
      },
    },
    w3d4t5: {
      title: "Qalbaki tanga",
      body: [
        {
          text: "Koʻrinishi bir xil uchta tanga orasida bittasi qalbaki — u haqiqiylaridan **yengilroq**. Uni pallali tarozida **bir marta** tortib top.",
        },
        {
          text: "Bu tarozi ayyor: uni omad bilan aldab boʻlmaydi. Tangani faqat har doim ishlaydigan usul bilan topish mumkin — qalbaki tanga qayerda boʻlishidan qatʼi nazar.",
        },
      ],
      followUps: [
        "Nega bitta tangani stolda qoldirish kerak?",
        "Uchala tangani ham taroziga qoʻysak-chi: ikkitasini bir pallaga, bittasini boshqasiga? Nima boʻladi?",
      ],
      hints: [
        "Yana bir oʻqi: qalbaki tanga yengilroq. Agar u tarozida boʻlsa, qaysi palla pastga tushadi?",
        "Tarozining uchta javobi bor: chap palla ogʻirroq, oʻng palla ogʻirroq yoki muvozanat.",
        "Hamma holatlarni chiz: qalbakisi — birinchi, ikkinchi yoki uchinchi tanga. Har bir holatda tarozi nimani koʻrsatadi?",
        "Taroziga faqat ikkita tanga qoʻyib koʻr — har bir pallaga bittadan.",
        "Agar tarozi muvozanatda boʻlsa, undagi ikkala tanga ham haqiqiy. Unda qalbakisi qayerda?",
      ],
      solution: {
        answer: "Har bir pallaga bittadan tanga qoʻyish, uchinchisini esa stolda qoldirish.",
        explanation: [
          "Agar bir palla yuqoriga koʻtarilsa — unda yengil qalbaki tanga turibdi.",
          "Agar tarozi muvozanatda boʻlsa — tarozidagi ikkala tanga haqiqiy, qalbakisi esa stolda qolgani.",
        ],
        discuss: [
          "Asosiy gʻoya: tarozining uchta javobi bor va har bir javob oʻz tangasini koʻrsatadi. Stoldagi tanga ham tortishda «qatnashadi»!",
          "Ilovadagi tarozi «ayyor»: u qalbaki tangani oldindan belgilab qoʻymaydi, balki gumondagi tangalar imkon qadar koʻp qoladigan qilib javob beradi. Shuning uchun omad yordam bermaydi — har doim ishlaydigan reja kerak.",
        ],
      },
    },
    w3d4t6: {
      title: "Yuzlari teng",
      body: [
        {
          text: "Har bir figura 6 ta bir xil kvadratchadan tuzilgan, shuning uchun hammasining yuzi bir xil. Perimetri esa — figura chegarasining toʻliq uzunligi — har xil!",
        },
        {
          text: "Perimetrni katakcha tomonlarida hisobla: figuraning chegarasida katakchalarning nechta tomoni yotibdi?",
        },
        { label: "A" },
        { label: "B" },
        { label: "C" },
        { label: "D" },
      ],
      answer: {
        fields: {
          a: { label: "A figuraning perimetri" },
          b: { label: "B figuraning perimetri" },
          c: { label: "C figuraning perimetri" },
          d: { label: "D figuraning perimetri" },
        },
      },
      followUps: [
        "6 ta katakchadan perimetri 12 ga teng, lekin D figuraga oʻxshamaydigan figura tuz.",
        "6 ta katakchali figuraning perimetri 14 dan katta boʻlishi mumkinmi?",
      ],
      hints: [
        "Yana bir oʻqi: chegarada yotgan katakcha tomonlarini sanaymiz — figuraning ichidagilarini emas.",
        "Bitta katakchaning 4 ta tomoni bor. Ikkita katakcha yonma-yon tursa, ularning umumiy tomoni figuraning ichida qoladi.",
        "Figuraning chegarasi boʻylab qalam yurgiz va katakchaning har bir tomoniga nuqta qoʻyib chiq. Keyin nuqtalarni sana.",
        "C figuradan boshla: tepada 6 ta tomon, pastda 6 ta va yonlarda bittadan.",
        "Boshqacha ham hisoblash mumkin: 6 ta katakchada `6 × 4 = 24` ta tomon bor, har bir ichki tomon esa ulardan ikkitasini «yeb qoʻyadi».",
      ],
      solution: {
        answer: "A — 10, B — 14, C — 14, D — 12.",
        explanation: [
          "A: tepada 3, pastda 3, chapda 2, oʻngda 2 — jami 10.",
          "B: chapda 4, pastda 3, tepada 1, oʻngda esa chegara zinapoyadek tushadi: 3 pastga, 2 yonga va 1 pastga. Jami `4 + 3 + 1 + 6 = 14`.",
          "C: tepada 6, pastda 6, yonlarda 1 va 1 — jami 14.",
          "D: tepada 4, yonlarda bittadan, pastda chetki katakchalar ostida bittadan, «oyoqcha» ostida 2 ta va «oyoqcha» yonlarida bittadan. Jami `4 + 2 + 2 + 2 + 2 = 12`.",
        ],
        discuss: [
          "Yuzi bir xil boʻlsa, perimetri ham bir xil boʻladi, degani emas! Figura qanchalik «ixcham» boʻlsa, uning chegarasi shunchalik qisqa. Shuning uchun qattiq sovuqda mushukchalar yumaloqlanib yotadi.",
          "Perimetr 14 dan katta boʻla olmaydi: figura boʻlinib ketmasligi uchun 6 ta katakchaning kamida 5 ta umumiy tomoni boʻladi, `24 − 2 × 5 = 14`.",
        ],
      },
    },
    w3d4t7: {
      title: "Qaysi biri katta va qanchaga?",
      body: [
        {
          text: "Faqat bir xil oʻlchov birliklarini solishtirish mumkin: minutni — minut bilan, santimetrni — santimetr bilan.",
        },
        {
          label: "a)",
          text: "Qaysi biri uzoqroq davom etadi: multfilm — 1 soat 10 minut yoki futbol oʻyini — 90 minut? Necha minutga?",
        },
        {
          label: "b)",
          text: "Qaysi biri uzunroq: qizil lenta — 2 m yoki koʻk lenta — 150 sm? Necha santimetrga?",
        },
        {
          label: "c)",
          text: "Qaysi biri qimmatroq: 4 ming soʻmdan 3 ta daftarmi yoki 7 ming soʻmdan 2 ta albommi? Qanchaga?",
        },
      ],
      answer: {
        fields: {
          time: { label: "a) farq", suffix: "min" },
          length: { label: "b) farq", suffix: "sm" },
          price: { label: "c) farq", suffix: "ming soʻm" },
        },
      },
      followUps: [
        "Har bir holatda qaysi biri uzoqroq, uzunroq yoki qimmatroq — ovoz chiqarib ayt.",
        "Qaysi biri katta: 1 soatmi yoki 55 minutmi? 1 metrmi yoki 99 santimetrmi?",
      ],
      hints: [
        "Yana bir oʻqi: a) va b) da sonlar har xil oʻlchov birliklarida yozilgan. Ularni darrov solishtirib boʻlmaydi.",
        "1 soat = 60 minut, 1 m = 100 sm.",
        "Hammasini bitta oʻlchov birligiga oʻtkaz va yonma-yon yoz: 70 min va 90 min, 200 sm va 150 sm.",
        "c) da avval 3 ta daftar qancha turishini, 2 ta albom qancha turishini hisobla.",
        "Farq — bu «kattasidan kichigini ayirish»: `90 − 70`, `200 − 150`, `14 − 12`.",
      ],
      solution: {
        answer:
          "a) Futbol oʻyini 20 minut uzoqroq davom etadi; b) qizil lenta 50 sm uzunroq; c) albomlar 2 ming soʻm qimmatroq.",
        explanation: [
          "a) 1 soat 10 minut = 70 minut. `90 − 70 = 20`.",
          "b) 2 m = 200 sm. `200 − 150 = 50`.",
          "c) Daftarlar: `4 + 4 + 4 = 12` ming, albomlar: `7 + 7 = 14` ming. `14 − 12 = 2`.",
        ],
        discuss: [
          "a) va b) dagi tuzoq: «90 soni 1 dan katta» yoki «150 soni 2 dan katta». Bu kattaliklarni emas, sonlarni solishtirish. Farzandingizdan oʻlchov birliklarini doim ovoz chiqarib aytishni soʻrang.",
        ],
      },
    },
    w3d4t8: {
      title: "Tarozili izquvar",
      body: [
        {
          text: "Endi tangalar toʻqqizta, ulardan bittasi qalbaki — u qolganlaridan **yengilroq**. Uni atigi **ikki marta** tortib top.",
        },
        {
          text: "Tarozi yana ayyor: qalbaki tanga qayerda boʻlishidan qatʼi nazar, har doim ishlaydigan usul kerak.",
        },
      ],
      followUps: [
        "Birinchi tortishda har bir pallaga 4 tadan tanga qoʻyilsa, nega bu usul ish bermaydi?",
        "Uch marta tortib nechta tangani tekshirish mumkin?",
      ],
      hints: [
        "Yana bir oʻqi: tortish faqat ikki marta, tangalar esa toʻqqizta. Birinchi tortishdan keyin gumondagi tangalar oz qolishi kerak.",
        "Uchta tanga ichidan qalbakisini bir marta tortib topish mumkin. Buni sen allaqachon bilasan!",
        "9 ta tanga chiz va ularni uch toʻdaga ajrat. Bir marta tortib, uchta toʻda haqida nimani bilish mumkin?",
        "Har bir pallaga 3 tadan tanga qoʻy, 3 tasini stolda qoldir. Tarozining har bir javobida qalbaki tanga qayerda boʻladi?",
        "Birinchi tortishdan keyin gumonda uchta tanga qoladi. Keyin — xuddi «Qalbaki tanga» masalasidagidek.",
      ],
      solution: {
        answer:
          "Tangalarni 3 tadan uch toʻdaga ajratib, ikki toʻdani tortish; keyin gumondagi uchta tangadan birini boshqasi bilan solishtirib tortish.",
        explanation: [
          "Birinchi tortish: 3 ta tangaga qarshi 3 ta tanga. Agar bir palla yengilroq boʻlsa — qalbakisi undagi uchta tanga orasida. Agar muvozanat boʻlsa — stoldagi uchta tanga orasida.",
          "Ikkinchi tortish: gumondagi uchta tangadan biri boshqasiga qarshi. Qaysi palla koʻtarilsa, undagi tanga yengilroq; agar muvozanat boʻlsa — qalbakisi stolda qolgani.",
        ],
        discuss: [
          "Asosiy gʻoya: tarozining uchta javobi bor, shuning uchun tangalarni uch qismga ajratamiz. Agar har bir pallaga 4 tadan qoʻyilsa va bir palla ogʻir kelsa, gumonda 4 ta tanga qoladi — ularni esa bir marta tortib tekshirib boʻlmaydi.",
          "Har bir tortish gumondagi tangalar sonini uch marta kamaytiradi: ikki marta tortib — 9 ta tanga, uch marta — 27 ta.",
        ],
      },
    },
  },
  parent: {
    skills: [
      "Hisoblamasdan solishtirish: sanash oʻrniga mulohaza",
      "Tarozi — tenglik sifatida: «nimani aniq aytish mumkin-u, nimani — yoʻq»",
      "Yuz va perimetr — har xil kattaliklar",
      "Qalbaki tangani izlash: uch qismga ajratish",
    ],
    observe: [
      "Farzandingiz ifodalarni mulohaza yuritib solishtiradimi yoki darrov hisoblashga tashlanadimi?",
      "Maʼlumot yetmaganda «bilib boʻlmaydi» deb javob bera oladimi?",
      "Tangalar masalasida uchta toʻda gʻoyasiga keladimi? Stoldagi tangalar nima uchun kerakligini qanday tushuntiradi?",
    ],
    mistakes: [
      "«1 soat» bilan «90 minut»ni 1 va 90 sonlari kabi solishtirish — koʻp uchraydigan tuzoq. Oʻlchov birliklarini doim aytishini soʻrang.",
      "Perimetrni katakchalar soni bilan adashtirishadi. Chegarani rangli qalam bilan chizib chiqish yordam beradi.",
      "Tangalar masalasida birinchi gʻoya odatda — teng ikkiga boʻlish (4 va 4). Darrov aytib qoʻymang: farzandingiz bu usul nega ishlamasligini oʻzi koʻrsin.",
    ],
    question: "Savatdagi eng ogʻir olmani pallali tarozi yordamida qanday topgan boʻlarding?",
  },
};
