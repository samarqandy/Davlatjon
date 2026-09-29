/** Неделя 3, день 1 — по-узбекски (накладка на day1.ts, правила — docs/uzbek-style.md). */
import type { Uz } from "../localize";
import type { Day } from "../types";

export const day1Uz: Uz<Day> = {
  title: "Agar…, unda…",
  habit: { name: "Men fikr yuritaman: «agar…, unda…»" },
  intro: [
    "Mantiq haftasi boshlandi! Mantiq — aniq fikrlay olish degani: xatoga oʻrin qoldirmaydigan xulosalar chiqarish.",
    "Bugungi asosiy soʻzlar — «agar…, unda…». Masalan: «Agar yomgʻir yogʻsa, {name} soyabon olib chiqadi». Bundan nima aniq kelib chiqadi-yu, nima kelib chiqmaydi? Qani, haqiqiy olimlardek birga koʻrib chiqamiz ➡️.",
  ],
  tasks: {
    w3d1t1: {
      title: "Birini bilsang — boshqasini ham topasan",
      body: [
        { text: "Maʼlumki, `27 + 15 = 42`. Qaytadan hisoblamasdan top:" },
        { label: "a)" },
        { label: "b)" },
        { label: "c)" },
        { label: "d)" },
      ],
      answer: {
        fields: {
          a: { label: "a) 27 + 16 =" },
          b: { label: "b) 26 + 15 =" },
          c: { label: "c) 42 − 15 =" },
          d: { label: "d) 42 − 27 =" },
        },
      },
      followUps: [
        "`27 + 15 = 42` ekanini bilsang, yana qaysi misollarni darrov yecha olasan?",
        "Agar `27 + 15 = 42` boʻlsa, `27 + 25` nechaga teng?",
      ],
      hints: [
        "Yana bir oʻqib chiq: asosiy tenglik `27 + 15 = 42` allaqachon yechilgan. Undan bemalol foydalanaver.",
        "`27 + 16` ning `27 + 15` dan farqi nimada? Ikkinchi son 1 ga ortgan.",
        "Ikkita tasma chiz: 27 bilan 15 qoʻshilib, 42 boʻladi. 15 ga teng tasmani olib tashlasang, nima qoladi?",
        "Osonroq misolni yechib koʻr: agar `5 + 3 = 8` boʻlsa, `5 + 4` va `8 − 3` nechaga teng?",
        "Qoʻshiluvchilardan biri 1 ga ortsa, yigʻindi ham 1 ga ortadi. Yigʻindidan bitta qoʻshiluvchini ayirsang, ikkinchisi qoladi.",
      ],
      solution: {
        answer: "a) 43; b) 41; c) 27; d) 15.",
        explanation: [
          "a) Ikkinchi son 1 ga katta — demak, yigʻindi ham 1 ga katta: `42 + 1 = 43`.",
          "b) Birinchi son 1 ga kichik — demak, yigʻindi ham 1 ga kichik: `42 − 1 = 41`.",
          "c), d) 42 yigʻindidan bitta qoʻshiluvchini ayirsak, ikkinchisi qoladi: `42 − 15 = 27`, `42 − 27 = 15`.",
        ],
        discuss: [
          "Bu — ilk «agar…, unda…» mulohazalari: «agar `27 + 15 = 42` boʻlsa, unda `42 − 15 = 27`». Farzandingizdan xulosani toʻliq gap bilan ovoz chiqarib aytishni soʻrang.",
        ],
      },
    },
    w3d1t2: {
      title: "Teskari qoida",
      body: [
        {
          text: "Bobur beshta «agar…, unda…» qoidasini yozdi. Ulardan baʼzilari doim toʻgʻri, baʼzilari esa yoʻq. Qoida notoʻgʻri ekanini isbotlash uchun u ishlamaydigan **bitta** sonni topish kifoya.",
        },
        { text: "Juft sonlar 0, 2, 4, 6 yoki 8 bilan tugaydi, toq sonlar esa 1, 3, 5, 7 yoki 9 bilan." },
      ],
      answer: {
        prompt: "Doim toʻgʻri boʻlgan hamma qoidalarni belgila:",
        options: {
          a: { label: "Agar son 5 bilan tugasa, u toq boʻladi." },
          b: { label: "Agar son toq boʻlsa, u 5 bilan tugaydi." },
          c: { label: "Agar son 20 dan katta boʻlsa, u 10 dan katta boʻladi." },
          d: { label: "Agar son 10 dan katta boʻlsa, u 20 dan katta boʻladi." },
          e: { label: "Agar juft songa 2 qoʻshilsa, juft son hosil boʻladi." },
        },
      },
      followUps: [
        "a) va b) qoidalarga qara. Ular nimasi bilan oʻxshash, nimasi bilan farq qiladi?",
        "Oʻzing «agar…, unda…» qoidasini oʻylab top: u toʻgʻri boʻlsin, teskarisi esa — notoʻgʻri.",
      ],
      hints: [
        "Har bir qoidani shoshilmay oʻqi. «Agar» soʻzidan keyin qanday shart turibdi? Undan nima kelib chiqadi?",
        "Qoida faqat hamma sonlar uchun bajarilsagina toʻgʻri boʻladi. Uni rad etish uchun bitta mos kelmaydigan son kifoya.",
        "Har bir qoidani bir nechta sonda tekshirib koʻr: 5, 7, 15, 25… Nima chiqqanini yozib bor.",
        "b) qoidani 7 sonida tekshir. U toqmi? 5 bilan tugaydimi?",
        "a) va b) — bitta qoidaning oʻzi, faqat «teskari» oʻqilgan. c) va d) qoidalar ham xuddi shunday bogʻlangan. Bittasi toʻgʻri boʻlsa, ikkinchisi ham toʻgʻri boʻladi, degani emas.",
      ],
      solution: {
        answer: "Doim toʻgʻri qoidalar: a), c) va e).",
        explanation: [
          "a) 5 bilan tugaydigan son — toq. Toʻgʻri.",
          "b) Notoʻgʻri: 7 — toq, lekin 5 bilan tugamaydi.",
          "c) 20 dan katta son 10 dan, albatta, katta. Toʻgʻri.",
          "d) Notoʻgʻri: 15 soni 10 dan katta, lekin 20 dan katta emas.",
          "e) Juft sonni ham, 2 ni ham juft-juft qilib ajratish mumkin — demak, ularning yigʻindisini ham. Toʻgʻri.",
        ],
        discuss: [
          "Kunning asosiy fikri: «agar A boʻlsa, unda B» qoidasi bilan «agar B boʻlsa, unda A» qoidasi — boshqa-boshqa qoidalar. Biri toʻgʻri, ikkinchisi esa notoʻgʻri boʻlishi mumkin.",
          "Qoidani rad etadigan son qarshi misol deyiladi. Haftaning 5-kuni aynan shu soʻzga bagʻishlangan.",
        ],
      },
    },
    w3d1t3: {
      title: "Soyabon",
      body: [
        {
          text: "{name:ning} hech qachon buzmaydigan bir qoidasi bor: **agar yomgʻir yogʻsa, u soyabon olib chiqadi** ☂️.",
        },
        { text: "Nimani aniq aytish mumkin-u, nimani — yoʻq? Har bir holat uchun javobni tanla." },
      ],
      answer: {
        prompt: "Nimani aniq aytish mumkin?",
        items: {
          a: { label: "a) Yomgʻir yogʻyapti. {name} soyabon olib chiqdimi?" },
          b: { label: "b) {name} soyabon olib chiqdi. Yomgʻir yogʻyaptimi?" },
          c: { label: "c) {name} soyabon olib chiqmadi. Yomgʻir yogʻyaptimi?" },
          d: { label: "d) Yomgʻir yogʻmayapti. {name} soyabon olib chiqdimi?" },
        },
        options: {
          yes: { label: "Aniq ha" },
          no: { label: "Aniq yoʻq" },
          unknown: { label: "Nomaʼlum" },
        },
      },
      followUps: [
        "Yomgʻir yogʻmayotgan boʻlsa ham, {name} nega soyabon olib chiqqan boʻlishi mumkin? Oʻylab top.",
        "Oʻzingning «agar…, unda…» qoidangni oʻylab top va kattalarga xuddi shunday toʻrtta savol ber.",
      ],
      hints: [
        "Qoidani yana bir oʻqi. U nimani vaʼda qiladi? {name} qachon albatta soyabon olib chiqadi?",
        "Aniq bilganimiz shu: yomgʻirli kunda soyabon doim uning yonida boʻladi. Quyoshli kun haqida esa qoida hech narsa demaydi.",
        "Toʻrtta rasm chiz: yomgʻir va soyabon; yomgʻir, lekin soyabon yoʻq; quyosh va soyabon; quyosh, lekin soyabon yoʻq. Qaysi rasmdagi holat boʻlishi mumkin emas?",
        "Qoidaga koʻra «yomgʻir bor, soyabon yoʻq» holati boʻlishi mumkin emas. Uni oʻchirib tashla va har bir savol uchun nima qolganiga qara.",
        "Agar savoldagi vaziyatga ikkala rasm ham mos kelsa, javob — «nomaʼlum». Faqat bittasi mos kelsa, javob aniq.",
      ],
      solution: {
        answer: "a) Aniq ha; b) nomaʼlum; c) aniq yoʻq; d) nomaʼlum.",
        explanation: [
          "a) Yomgʻirda {name} doim soyabon olib chiqadi — demak, olib chiqqan.",
          "b) U soyabonni yomgʻir uchun ham, shunchaki (masalan, quyoshdan saqlanish uchun) ham olib chiqqan boʻlishi mumkin. Aniq aytib boʻlmaydi.",
          "c) Agar yomgʻir yogʻayotgan boʻlsa edi, soyabon uning yonida boʻlardi. Soyabon yoʻq — demak, yomgʻir ham yoʻq. Bu eng qiziq xulosa!",
          "d) Qoida yomgʻirsiz kun haqida hech narsa demaydi: soyabon boʻlishi ham, boʻlmasligi ham mumkin.",
        ],
        discuss: [
          "Eng koʻp uchraydigan xato — b) da «ha» deb javob berish: «soyabon olib chiqdi — demak, yomgʻir yogʻyapti». Qoida bunday demaydi. Toʻrtta rasm chizib, boʻlishi mumkin boʻlmagan bittasini oʻchirish yordam beradi.",
          "c) dagi xulosa «teskarisini faraz qilish» deyiladi: yomgʻir yogʻyapti deb faraz qilaylik — unda soyabon boʻlardi, lekin u yoʻq.",
        ],
      },
    },
    w3d1t4: {
      title: "Shartli mashina",
      body: [
        {
          text: "Sonlar mashinasi ⚙️ shartli qoida boʻyicha ishlaydi: **agar son juft boʻlsa, mashina uni teng ikkiga boʻladi, toq boʻlsa — ikki barobar qiladi.**",
        },
        null,
        { label: "a)", text: "9 va 16 sonlari bilan mashina nima qiladi?" },
        {
          label: "b)",
          text: "Mashinadan 22 soni chiqdi. Unga qaysi son solingan boʻlishi mumkin? **Ikkita** har xil javob top.",
        },
      ],
      answer: {
        fields: {
          out9: { label: "a) 9 dan chiqadi" },
          out16: { label: "a) 16 dan chiqadi" },
          in22small: { label: "b) kichikroq son" },
          in22big: { label: "b) kattaroq son" },
        },
      },
      followUps: [
        "Mashinadan 7 soni chiqishi mumkinmi? Qaysi sondan?",
        "Mashinaga 1 ni solsak, qaysi son chiqadi? Chiqqan sonni yana solsak-chi?",
      ],
      hints: [
        "Qoidani yana bir oʻqi: mashina juft sonlarni nima qiladi, toq sonlarni-chi?",
        "Maʼlumki, 9 — toq, 16 — juft. Har biriga qaysi amal mos keladi?",
        "b) uchun 22 ga olib boradigan ikkita yoʻl chiz: biri — ikki barobar qilish orqali, ikkinchisi — teng ikkiga boʻlish orqali.",
        "Sinab koʻr: qaysi sonni ikki barobar qilsak, 22 chiqadi? Qaysi sonning yarmi 22 ga teng?",
        "22 soni 11 dan (`11 + 11 = 22`, 11 esa toq) va 44 dan (44 ning yarmi — 22, 44 esa juft) hosil boʻladi. Ikkala javobni qoida bilan tekshirib koʻr.",
      ],
      solution: {
        answer: "a) 9 → 18, 16 → 8; b) 11 yoki 44.",
        explanation: [
          "a) 9 — toq, uni ikki barobar qilamiz: 18. 16 — juft, uni teng ikkiga boʻlamiz: 8.",
          "b) Agar son toq boʻlgan boʻlsa, mashina uni ikki barobar qilgan: 22 — bu ikkita 11, 11 esa toq ✓. Agar son juft boʻlgan boʻlsa, mashina uni teng ikkiga boʻlgan: 22 — 44 ning yarmi, 44 esa juft ✓.",
        ],
        discuss: [
          "«Oxiridan» yechiladigan masalaning bir nechta javobi boʻlishi mumkin — shartning ikkala tarmogʻini ham tekshirish muhim.",
          "7 soni mashinadan faqat 14 dan chiqishi mumkin: ikki barobar qilinganda doim juft son chiqadi, 7 esa toq.",
        ],
      },
    },
    w3d1t5: {
      title: "1 ga yetguncha",
      body: [
        {
          text: "{name} algoritm-oʻyin oʻylab topdi. Istalgan sonni olasan va 1 hosil boʻlguncha quyidagi qadamni takrorlayverasan:",
        },
        { items: ["**agar son juft boʻlsa** — uni teng ikkiga boʻl;", "**agar toq boʻlsa** — unga 1 ni qoʻsh."] },
        { text: "Masalan: `6 → 3 → 4 → 2 → 1`. 6 dan 1 gacha — toʻrt qadam." },
        { label: "a)", text: "13 dan boshlasang, necha qadam kerak boʻladi?" },
        { label: "b)", text: "20 dan boshlasang-chi?" },
      ],
      answer: {
        fields: {
          from13: { label: "a) 13 dan: qadamlar soni" },
          from20: { label: "b) 20 dan: qadamlar soni" },
        },
      },
      followUps: [
        "Qaysi sondan 1 gacha roppa-rosa 3 qadam? Shunday sonlarning hammasini top.",
        "Nega oʻyin doim tugaydi? U cheksiz davom etishi mumkinmi?",
      ],
      hints: [
        "Qoidani yana bir oʻqi: har bir qadamda avval son juftmi yoki yoʻqmi — shuni qaraymiz, keyingina amal bajaramiz.",
        "Maʼlumki, 13 — toq. Demak, birinchi qadam — 1 ni qoʻshish. Qaysi son chiqadi?",
        "Zanjirni misoldagidek strelkalar bilan yoz: `13 → 14 → …`. Strelkalarni sana — ular qadamlar.",
        "Oʻzingni kichik sonda tekshir: `4 → 2 → 1` — ikki qadam. 5 dan-chi?",
        "13 dan: 13 → 14 → 7 → 8 → 4 → 2 → 1. Bu yerda nechta strelka bor? 20 dan esa bunday boshla: 20 → 10 → 5 → …",
      ],
      solution: {
        answer: "a) 6 qadam; b) 7 qadam.",
        explanation: ["a) 13 → 14 → 7 → 8 → 4 → 2 → 1 — 6 qadam.", "b) 20 → 10 → 5 → 6 → 3 → 4 → 2 → 1 — 7 qadam."],
        discuss: [
          "Bu — haqiqiy shartli algoritm: har bir qadamda avval «agar»ni tekshiramiz, keyin amal bajaramiz.",
          "Roppa-rosa 3 qadamda 1 ga 3 va 8 sonlari yetib keladi: `3 → 4 → 2 → 1` va `8 → 4 → 2 → 1`.",
        ],
      },
    },
    w3d1t6: {
      title: "Oynadagi soat",
      body: [
        {
          text: "{name} soatni oynada koʻryapti 🪞. Oynada hammasi teskari: oʻngdagi narsa chapda, chapdagisi esa oʻngda koʻrinadi.",
        },
        { label: "a)", text: "Aslida soat necha?", visual: { caption: "Oynadagi soat" } },
        { label: "b)", text: "Bu yerda-chi?", visual: { caption: "Oynadagi soat" } },
      ],
      answer: {
        fields: {
          a: { label: "a) aslida" },
          b: { label: "b) aslida" },
        },
      },
      followUps: [
        "Qaysi vaqt oynada ham xuddi aslidagidek koʻrinadi? Kamida ikkitasini top.",
        "Uyda haqiqiy oyna va soat bilan tekshirib koʻr!",
      ],
      hints: [
        "Yana bir oʻqi: oynada oʻng bilan chap oʻrin almashadi. Raqamlarga qara — ular ham aks etgan.",
        "Maʼlumki, oynada 12 bilan 6 oʻz joyida qoladi, 3 bilan 9 esa oʻrin almashadi.",
        "Siferblat va millarni oynada koʻringanidek chiz, keyin rasmni yana teskari aylantirib chiz.",
        "Avval a) ni yech: oynada soat mili 9 ni koʻrsatyapti. Aslida u qaysi raqamni koʻrsatadi?",
        "b) da minut mili pastga — 6 ga qaragan. Bu 30 minut. Oynada soat mili 1 bilan 2 orasida turibdi. Aslida u qaysi raqamlar orasida?",
      ],
      solution: {
        answer: "a) 3:00; b) 10:30.",
        explanation: [
          "a) Oynada soat mili 9 ni, minut mili esa 12 ni koʻrsatyapti. Aslida soat mili 3 ga qaragan: hozir soat 3:00.",
          "b) Minut mili 6 da — bu 30 minut, oynada u oʻzgarmaydi. Soat mili oynada 1 bilan 2 orasida, aslida esa 10 bilan 11 orasida. Hozir soat 10:30.",
        ],
        discuss: [
          "Bir hiyla bor: oynadagi vaqt bilan haqiqiy vaqt birgalikda 12 soatni tashkil qiladi. Oynada «1:30» koʻrinyapti — demak, aslida `12:00 − 1:30 = 10:30`.",
          "Masalan, 12:00 va 6:00 oynada ham xuddi shunday koʻrinadi: ikkala mil ham tik chiziqda yotadi.",
        ],
      },
    },
    w3d1t7: {
      title: "Bepul yetkazib berish",
      body: [
        { text: "Oziq-ovqat internet-doʻkoni 🛒 shunday qoida eʼlon qildi:" },
        {
          text: "Agar buyurtma narxi 100 ming soʻm yoki undan koʻp boʻlsa, yetkazib berish bepul. Kam boʻlsa — yetkazib berish 15 ming soʻm turadi.",
        },
        {
          label: "a)",
          text: "Oying savatga 90 ming soʻmlik mahsulot soldi. Yetkazib berish bilan birga u qancha toʻlaydi?",
        },
        {
          label: "b)",
          text: "Oying savatga yana 12 ming soʻmlik sharbat qoʻshdi. Endi u qancha toʻlaydi?",
        },
      ],
      answer: {
        fields: {
          a: { label: "a) toʻlaydi", suffix: "ming soʻm" },
          b: { label: "b) toʻlaydi", suffix: "ming soʻm" },
        },
      },
      followUps: [
        "Qanday qilib shunday boʻldi: mahsulot koʻpaydi, toʻlov esa kamaydi?",
        "Oying savatga 97 ming soʻmlik mahsulot soldi. Qaysi biri foydaliroq: yetkazib berish uchun pul toʻlashmi yoki savatga 4 ming soʻmlik non qoʻshishmi?",
      ],
      hints: [
        "Qoidani yana bir oʻqi: yetkazib berish pullik boʻlishi nimaga bogʻliq?",
        "a) da buyurtma 100 ming soʻmdan kammi yoki yoʻqmi? b) da, sharbat qoʻshilgandan keyin-chi?",
        "«Ayri yoʻl» chiz: buyurtma 100 ming va undan koʻp → yetkazish 0; 100 mingdan kam → yetkazish 15 ming.",
        "Avval b) dagi buyurtma narxini hisobla: `90 + 12`. Bu 100 dan koʻpmi yoki kammi?",
        "a) `90 + 15`. b) Buyurtma `90 + 12 = 102` — bu 100 dan koʻp, demak, yetkazib berish bepul.",
      ],
      solution: {
        answer: "a) 105 ming soʻm; b) 102 ming soʻm.",
        explanation: [
          "a) 90 ming — 100 mingdan kam, demak, yetkazib berish pullik: `90 + 15 = 105`.",
          "b) Endi buyurtma narxi `90 + 12 = 102` ming — bu 100 dan koʻp, yetkazib berish bepul. Jami 102 ming soʻm toʻlanadi.",
        ],
        discuss: [
          "Qiziq xulosa: sharbat qoʻshilganda toʻlov sharbatsizdagidan 3 ming soʻm kam boʻladi. Doʻkonlar xaridorlar koʻproq narsa olishi uchun shunday qoidalar oʻylab topadi.",
          "97 ming soʻmlik buyurtmaga non qoʻshish foydaliroq: `97 + 15 = 112` ming oʻrniga `97 + 4 = 101` ming toʻlanadi.",
        ],
      },
    },
    w3d1t8: {
      title: "Kim kinoga boradi?",
      body: [
        {
          text: "Toʻrt doʻst kim kinoga borishini hal qilayotgan edi 🎬. Maʼlum boʻlgan hamma gaplar — rost:",
        },
        {
          items: [
            "Agar Ali kinoga borsa, Bobur ham boradi.",
            "Agar Bobur borsa, Vasila ham boradi.",
            "Agar Vasila bormasa, Diyor boradi.",
          ],
        },
        { text: "Kechqurun maʼlum boʻldiki, **Vasila kinoga bormagan**. Doʻstlardan kimlar kinoga borgan?" },
      ],
      answer: {
        prompt: "Kinoga borganlarning hammasini belgila:",
        options: {
          ali: { label: "Ali" },
          bobur: { label: "Bobur" },
          vika: { label: "Vasila" },
          dima: { label: "Diyor" },
        },
      },
      followUps: [
        "Agar Ali kinoga borgani maʼlum boʻlganida, nima boʻlardi?",
        "Diyor haqida bilishga qaysi qoida «yordam berdi», Ali va Bobur haqida-chi?",
      ],
      hints: [
        "Yana bir oʻqi: qaysi dalil aniq maʼlum? Oʻshandan boshla.",
        "Maʼlumki, Vasila bormagan. Qaysi qoida Vasila bormasa nima boʻlishini aytadi?",
        "Strelkalar zanjirini chiz: Ali → Bobur → Vasila. Vasilani oʻchir. Zanjirda undan oldin turganlar bilan nima boʻladi?",
        "Bobur borgan deb faraz qil. Unda 2-qoida nima deydi? Vasila borganmi?",
        "3-qoida Diyor haqida darrov javob beradi. Bobur va Ali haqida esa soyabon haqidagi masaladagidek fikr yurit: «agar Bobur borganida, Vasila ham borardi».",
      ],
      solution: {
        answer: "Kinoga faqat Diyor borgan.",
        explanation: [
          "Diyor: 3-qoidaga koʻra — Vasila bormagani uchun Diyor borgan.",
          "Bobur: agar u borganida, 2-qoidaga koʻra Vasila ham borardi. Lekin Vasila bormagan — demak, Bobur ham bormagan.",
          "Ali: agar u borganida, Bobur ham borardi. Lekin Bobur bormagan — demak, Ali ham bormagan.",
        ],
        discuss: [
          "Bu yerda soyabon haqidagi masaladagidek ikki marta «teskarisini faraz qilish» kerak boʻladi: «agar … boʻlganida, … boʻlardi, lekin bunday emas».",
          "Agar Ali kinoga borganida, Bobur ham, Vasila ham borardi; Diyor haqida esa unda hech narsani aniq aytib boʻlmasdi.",
        ],
      },
    },
  },
  parent: {
    skills: [
      "«Agar…, unda…» soʻzlarini tushunish: qoidadan nima kelib chiqadi-yu, nima kelib chiqmaydi",
      "«Aniq ha», «aniq yoʻq» va «nomaʼlum»ni farqlash",
      "Hisoblash va algoritmlardagi shartli qoidalar",
      "«Teskarisini faraz qilish»: «agar … boʻlganida, … boʻlardi, lekin bunday emas»",
    ],
    observe: [
      "Farzandingiz qoidani uning «teskarisi» bilan adashtirmayaptimi (yomgʻir → soyabon va soyabon → yomgʻir)? Bu eng koʻp uchraydigan xato — kattalarda ham.",
      "Maʼlumot yetishmaganda u «nomaʼlum» deya oladimi yoki taxmin qilishga urinadimi?",
      "Shartning ikkala tarmogʻini ham («agar juft boʻlsa…», «agar toq boʻlsa…») tekshiradimi?",
    ],
    mistakes: [
      "«Soyabon olib chiqdi — demak, yomgʻir yogʻyapti» — tabiiy xato. Bittasi boʻlishi mumkin boʻlmagan toʻrt holatli rasm yordam beradi.",
      "Mashina haqidagi masalada ikki javobdan faqat bittasi topilishi mumkin — soʻrang: «Son toq boʻlgan boʻlsa-chi?»",
      "Oynadagi soatda soat mili bilan minut milini adashtirish oson — ularni uzunligidan ajratish mumkin.",
    ],
    question:
      "Oilamiz haqida «agar…, unda…» qoidasini oʻylab top. Undan nima aniq kelib chiqadi-yu, nima kelib chiqmaydi?",
  },
};
