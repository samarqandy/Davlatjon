/** Неделя 3, день 5 — по-узбекски (накладка на day5.ts, правила — docs/uzbek-style.md). */
import type { Uz } from "../localize";
import type { Day } from "../types";

export const day5Uz: Uz<Day> = {
  title: "Isbotla!",
  habit: { name: "Men isbotlayman" },
  intro: [
    "Bugun sen — hech narsaga koʻr-koʻrona ishonmaydigan olimsan. Matematiklar doim: «Isbotla!» — deyishadi. Isbotlash — hatto eng injiq bahschi ham eʼtiroz bildira olmaydigan qilib tushuntirish demakdir.",
    "Isbot xuddi gʻishtdan devor urgandek quriladi 🧱: har bir gʻisht — aniq dalil. Matematiklar yana nimadir **boʻlmasligini** ham isbotlay oladi — hatto hamma variantlarni birma-bir koʻrib chiqmasdan.",
  ],
  tasks: {
    w3d5t1: {
      title: "Ketma-ket uchta son",
      body: [
        { text: "Ketma-ket kelgan uchta sonni qoʻsh:" },
        { label: "a)" },
        { label: "b)" },
        { label: "c)" },
        { text: "Har bir yigʻindini oʻrtadagi son bilan solishtir. Nimani payqading?" },
      ],
      answer: {
        fields: {
          a: { label: "a) yigʻindi" },
          b: { label: "b) yigʻindi" },
          c: { label: "c) yigʻindi" },
        },
      },
      followUps: [
        "Ketma-ket uchta sonning yigʻindisi 40 ga teng boʻlishi mumkinmi? Isbotla.",
        "Ketma-ket uchta sonning yigʻindisi 99 ga teng. Bu qaysi sonlar?",
      ],
      hints: [
        "Shartni qayta oʻqi: sonlar ketma-ket keladi, har biri oldingisidan 1 ga katta.",
        "Nima maʼlum: a) misolda oʻrtadagi son — 5. Chapdagisi undan 1 ga kichik, oʻngdagisi 1 ga katta.",
        "Kubiklardan uchta ustuncha chiz: 4, 5 va 6 ta kubik. Bitta kubikni koʻchirib, ustunchalarni tenglashtirish mumkinmi?",
        "Oʻngdagi ustunchadan bitta kubikni chapdagisiga oʻtkaz: `5 + 5 + 5` hosil boʻladi.",
        "Ketma-ket uchta sonning yigʻindisi — oʻrtadagi sonni uch marta olganga teng.",
      ],
      solution: {
        answer: "a) 15; b) 30; c) 60.",
        explanation: [
          "Chapdagi son oʻrtadagidan 1 ga kichik, oʻngdagisi esa 1 ga katta. Oʻngdan chapga bittani «koʻchirsak», oʻrtadagi son uch marta takrorlanadi: `5 + 5 + 5 = 15`, `10 + 10 + 10 = 30`, `20 + 20 + 20 = 60`.",
        ],
        discuss: [
          "Yigʻindi 40 boʻla olmaydi: u oʻrtadagi sonning uch barobariga teng boʻlishi kerak, lekin `13 + 13 + 13 = 39`, `14 + 14 + 14 = 42`. 40 ularning oraligʻida qoladi — uni hech qanday sonni uch marta olib hosil qilib boʻlmaydi. Bu — kunning birinchi isboti!",
          "Yigʻindi 99 boʻlsa: oʻrtadagi son 33, sonlarning oʻzi esa 32, 33 va 34.",
        ],
      },
    },
    w3d5t2: {
      title: "Qarshi misol",
      body: [
        { text: "Lola aytadi: «Ikki sonni qoʻshsak, yigʻindi har doim ularning har biridan katta boʻladi»." },
        {
          text: "Qoida notoʻgʻri ekanini isbotlash uchun u ishlamaydigan **bitta** misolning oʻzi kifoya. Bunday misol **qarshi misol** deyiladi.",
        },
      ],
      answer: {
        prompt: "Qaysi misollar Lolaning qoidasiga qarshi misol boʻladi? Hammasini belgila:",
      },
      followUps: [
        "Lolaning qoidasini toʻgʻri boʻladigan qilib tuzatib koʻr.",
        "«1 bilan tugaydigan hamma sonlar 50 dan kichik» degan qoidaga qarshi misol oʻylab top.",
      ],
      hints: [
        "Lolaning qoidasini qayta oʻqi. Har bir misolda nima bajarilishi kerak?",
        "Nima maʼlum: yigʻindi qoʻshiluvchilardan biridan katta **boʻlmasa**, misol qoidani rad etadi.",
        "Har bir misolda yigʻindini birinchi son bilan ham, ikkinchi son bilan ham solishtir.",
        "`9 + 0 = 9` ga qara. Yigʻindi 9 ga teng — u 9 dan kattami?",
        "Sonlardan biri nol boʻlsa, qoida buziladi: nolni qoʻshish hech narsani oʻzgartirmaydi.",
      ],
      solution: {
        answer: "Qarshi misollar: `9 + 0 = 9` va `0 + 0 = 0`.",
        explanation: [
          "`9 + 0 = 9`: yigʻindi 9 ga teng, u 9 qoʻshiluvchisidan katta emas — qoida bajarilmaydi.",
          "`0 + 0 = 0`: yigʻindi 0 ga teng, u noldan katta emas.",
          "`7 + 5 = 12` va `15 + 1 = 16` misollarida qoida bajariladi, lekin bu uni isbotlamaydi. Qoidani isbotlash uchun u har doim ishlashiga ishonch hosil qilish kerak, rad etish uchun esa bitta misol kifoya.",
        ],
        discuss: [
          "Toʻgʻri qoida: «**Noldan katta** ikki sonni qoʻshsak, yigʻindi ularning har biridan katta boʻladi».",
          "1 bilan tugaydigan sonlar haqidagi qoidaga qarshi misol: 51 (yoki 61, 71…).",
        ],
      },
    },
    w3d5t3: {
      title: "Raqamlar yigʻindisi 19",
      body: [
        {
          text: "Ali aytadi: «Men raqamlari yigʻindisi 19 ga teng boʻlgan ikki xonali son oʻyladim». Bobur darhol javob berdi: «Bunday boʻlmaydi!»",
        },
        { text: "Kim haq va nega?" },
      ],
      answer: {
        prompt: "Toʻgʻri javobni tanla:",
        options: {
          a: { label: "Ali haq: masalan, 19 sonining raqamlari yigʻindisi — 19." },
          b: {
            label: "Bobur haq: ikki xonali sonlar orasida raqamlar yigʻindisi eng kattasi — 99 da, u 9 + 9 = 18.",
          },
          c: { label: "Bobur haq: ikki xonali sonning raqamlari yigʻindisi har doim 10 dan kichik." },
          d: { label: "Hamma ikki xonali sonlarni tekshirib chiqmaguncha, kim haqligini aytib boʻlmaydi." },
        },
      },
      followUps: [
        "Uch xonali sonning raqamlari yigʻindisi eng koʻpi bilan nechaga teng boʻlishi mumkin?",
        "Bobur haq ekanini isbotlash uchun nega 90 ta ikki xonali sonning hammasini tekshirish shart emas?",
      ],
      hints: [
        "Shartni qayta oʻqi: son ikki xonali — demak, unda ikkita raqam bor.",
        "Nima maʼlum: eng katta raqam — 9.",
        "Raqamlar yigʻindisini imkon qadar katta qilishga urinib koʻr. Buning uchun qanday raqamlar kerak?",
        "19 ning raqamlari yigʻindisini hisobla: `1 + 9`. 99 niki-chi?",
        "Ikki raqamning har biri 9 dan katta emas. Demak, ularning yigʻindisi `9 + 9` dan oshmaydi.",
      ],
      solution: {
        answer: "Bobur haq: ikki raqamning yigʻindisi `9 + 9 = 18` dan oshmaydi.",
        explanation: [
          "Ikki xonali sonda ikkita raqam bor va ularning har biri 9 dan katta emas. Shuning uchun raqamlar yigʻindisi `9 + 9 = 18` dan oshmaydi, 19 esa 18 dan katta.",
          "a) — xato: 19 ning raqamlari yigʻindisi `1 + 9 = 10`. c) — notoʻgʻri: 99 ning raqamlari yigʻindisi 18. d) — shart emas: isbot birdaniga hamma sonlar uchun ishlaydi.",
        ],
        discuss: [
          "Bu — «hammasi uchun birdaniga» isbot: bitta mulohaza 90 ta sonni tekshirishning oʻrnini bosadi.",
          "Uch xonali sonlarda raqamlar yigʻindisi eng koʻpi bilan 27 ga teng — 999 sonida.",
        ],
      },
    },
    w3d5t4: {
      title: "Oxirgi raqam",
      body: [
        { text: "Bu qatorda har bir keyingi son oldingisidan 2 marta katta:" },
        null,
        { label: "a)", text: "Qatordagi 10-son qaysi raqam bilan tugaydi?" },
        { label: "b)", text: "20-son qaysi raqam bilan tugaydi?" },
      ],
      answer: {
        fields: {
          tenth: { label: "a) 10-sonning oxirgi raqami" },
          twentieth: { label: "b) 20-sonning oxirgi raqami" },
        },
      },
      followUps: ["Bu qatordagi biror son 0 bilan tugashi mumkinmi? Isbotla.", "100-son qaysi raqam bilan tugaydi?"],
      hints: [
        "Shartni qayta oʻqi: savol faqat oxirgi raqam haqida. Sonning oʻzini bilish shart emas!",
        "Nima maʼlum: 64 ni ikki barobar oshirsak — 128, keyin 256… Oxirgi raqamlarga qara.",
        "Sonlarning faqat oxirgi raqamlarini tartib bilan yozib chiq: 2, 4, 8, 6, 2…",
        "Oxirgi raqamlar toʻrttadan boʻlib takrorlanadi: 2, 4, 8, 6. 8-oʻrinda qaysi raqam turibdi? 12-oʻrinda-chi?",
        "4-, 8-, 12-, 16-, 20-oʻrinlarda — bir xil raqam. 10-oʻrinda esa 2- va 6-oʻrindagi raqam turadi.",
      ],
      solution: {
        answer: "a) 4; b) 6.",
        explanation: [
          "Sonlar: 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024… — 10-son 1024, u 4 bilan tugaydi.",
          "Oxirgi raqamlar aylana boʻylab takrorlanadi: 2, 4, 8, 6, 2, 4, 8, 6… Har toʻrtinchi son 6 bilan tugaydi: 4-, 8-, 12-, 16-, 20-sonlar.",
        ],
        discuss: [
          "Raqamlar nega takrorlanadi: ikki barobar oshirilgan sonning oxirgi raqami faqat dastlabki sonning oxirgi raqamiga bogʻliq. 2 raqami qaytib kelishi bilanoq butun aylana boshidan takrorlanadi. Mana shu — isbot!",
          "Qatordagi son 0 bilan tugay olmaydi: aylanada faqat 2, 4, 8, 6 bor. 100-son 6 bilan tugaydi.",
        ],
      },
    },
    w3d5t5: {
      title: "Qoʻshnilar oʻrin almashadi",
      body: [
        {
          text: "Kartochkalarni kichik sondan kattasiga qarab tartib bilan ter. Bir qadamda ikkita **qoʻshni** kartochkaning oʻrnini almashtirish mumkin.",
        },
        { text: "Iloji boricha kamroq almashtirish bilan uddalashga harakat qil." },
        { text: "Uddalaganingdan keyin bundan tezroq boʻlmasligini isbotlashga urinib koʻr." },
      ],
      followUps: [
        "«Tartibsiz» turgan hamma juftlarni top: katta son kichigidan chapda turgan kartochkalarni. Bunday juftlar nechta?",
        "Nega qoʻshnilarning oʻrnini bir marta almashtirish bunday juftlardan koʻpi bilan bittasini tuzatadi?",
      ],
      hints: [
        "Shartni qayta oʻqi: faqat qoʻshni kartochkalarning oʻrnini almashtirish mumkin.",
        "Nima maʼlum: oxirida 1, 2, 3, 4, 5 chiqishi kerak. Hozir 1 va 2 qayerda turibdi?",
        "Qatorni yozib ol va har bir almashtirishdan keyin yangi qatorni yoz — shunda adashib ketmaysan.",
        "Birdan boshla: u birinchi oʻringa oʻtishi kerak. Buning uchun nechta almashtirish kerak?",
        "«Tartibsiz» juftlarni sana: 4 va 1, 4 va 3, 4 va 2, 3 va 2, 5 va 2. Qoʻshnilarni har bir almashtirish roppa-rosa bitta juftni tuzatadi.",
      ],
      solution: {
        answer: "5 ta almashtirish, bundan kam boʻlmaydi.",
        explanation: [
          "Masalan: 4 1 3 5 2 → 1 4 3 5 2 → 1 3 4 5 2 → 1 3 4 2 5 → 1 3 2 4 5 → 1 2 3 4 5.",
          "Isbot: boshida 5 ta juft «tartibsiz» turibdi — (4, 1), (4, 3), (4, 2), (3, 2), (5, 2). Ikki qoʻshnining oʻrnini almashtirish faqat bitta juftning — aynan shu ikki qoʻshnining tartibini oʻzgartiradi. Demak, 5 tadan kam almashtirish bilan hamma juftlarni tuzatib boʻlmaydi.",
        ],
        discuss: [
          "Bu — «bundan kam boʻlmaydi» degan haqiqiy matematik isbot. Farzandingiz avvaliga shunchaki 5 qadamlik yechimni topsa, hech qisi yoʻq — nega 4 qadam yetmasligini birga muhokama qiling.",
          "Odamlar oʻylab topgan ilk saralash usullaridan biri — «pufakchali saralash» ham xuddi shunday ishlaydi.",
        ],
      },
    },
    w3d5t6: {
      title: "Qalamni uzmasdan",
      body: [
        {
          text: "Qaysi shakllarni qalamni qogʻozdan uzmasdan va bitta chiziq ustidan ikki marta yurmasdan chizish mumkin?",
        },
        { visual: { figures: [{ label: "A" }, { label: "B" }, { label: "C" }, { label: "D" }] } },
        { text: "Har bir shaklni qogʻozda chizib koʻr. Chiqmasa — nega chiqmayotganini oʻylab koʻr." },
      ],
      answer: {
        prompt: "Qaysi shakllarni qalamni uzmasdan chizish mumkin? Hammasini belgila:",
        options: {
          a: { label: "A" },
          b: { label: "B" },
          c: { label: "C" },
          d: { label: "D" },
        },
      },
      followUps: [
        "C shaklni qaysi nuqtadan boshlash kerak? Nega istalgan nuqtadan emas?",
        "Qalamni uzmasdan chizib boʻlmaydigan oʻz shaklingni chiz va uni qoida bilan tekshir.",
      ],
      hints: [
        "Shartni qayta oʻqi: qalamni qogʻozdan uzish ham, chiziq ustidan ikkinchi marta yurish ham mumkin emas.",
        "Nima maʼlum: qalam nuqtadan oʻtganda unga bitta chiziq boʻylab keladi va boshqasi boʻylab ketadi — chiziqlar ikkitadan sarflanadi.",
        "Har bir nuqtadan nechta chiziq chiqishini sana va shu sonni nuqtaning yoniga yozib qoʻy.",
        "B shaklga qara: har bir burchagidan 3 ta chiziq chiqadi. Chiziqlar soni toq boʻlsa, burchakdan oʻtib ketish mumkinmi?",
        "Eyler qoidasi: toq sondagi chiziq chiqadigan nuqtalar ikkitadan koʻp boʻlsa, shaklni qalamni uzmasdan chizib boʻlmaydi. Bunday nuqtalar 0 ta yoki 2 ta boʻlsa — mumkin (toq nuqtadan boshlash kerak).",
      ],
      solution: {
        answer: "Qalamni uzmasdan A va C ni chizish mumkin. B va D ni — mumkin emas.",
        explanation: [
          "Nuqtadan oʻtib ketilsa, undagi chiziqlar ikkitadan sarflanadi: biri — kelish uchun, boshqasi — ketish uchun. Toq sondagi chiziq faqat chizish boshlanadigan yoki tugaydigan nuqtada boʻlishi mumkin. Demak, bunday nuqtalar ikkitadan oshmaydi.",
          "A: toq nuqtalar ikkita (tom boshlanadigan ikki burchak) — mumkin, ulardan biridan boshlash kerak.",
          "B: toʻrtta burchakning har biridan 3 ta chiziq chiqadi — toʻrtta toq nuqta, mumkin emas.",
          "C: toq nuqtalar ikkita (pastki burchaklar) — mumkin, pastki burchakdan boshlash kerak.",
          "D: tomonlarning oʻrtasidan 3 tadan chiziq chiqadi — toʻrtta toq nuqta, mumkin emas.",
        ],
        discuss: [
          "Bu qoidani Leonard Eyler kashf etgan — doiralarni oʻylab topgan olimning oʻzi. U Kyonigsbergdagi yettita koʻprik haqidagi mashhur masalani yechgan: har bir koʻprikdan roppa-rosa bir marta oʻtib, shaharni aylanib chiqish mumkinmi? Mumkin emas ekan — xuddi shu sababga koʻra.",
          "C shakl — Yevropada mashhur «Nikolay uychasi» jumbogʻi. Yuqoridagi burchakdan boshlasangiz, oxirigacha chizib boʻlmaydi — yoʻlda tiqilib qolasiz.",
        ],
      },
    },
    w3d5t7: {
      title: "Aniq boʻlsin!",
      body: [
        {
          label: "a)",
          text: "Qorongʻi qutida 10 ta koʻk va 10 ta qora paypoq 🧦 bor. Qaramasdan nechta paypoq olish kerakki, ular orasida bir xil rangli ikkitasi **albatta** boʻlsin?",
        },
        {
          label: "b)",
          text: "Sinfda nechta oʻquvchi boʻlishi kerakki, ulardan qaysidir ikkitasining tugʻilgan kuni **albatta** bir oyga toʻgʻri kelsin?",
        },
      ],
      answer: {
        fields: {
          socks: { label: "a) paypoq" },
          months: { label: "b) oʻquvchi" },
        },
      },
      followUps: [
        "Ikkita koʻk paypoq albatta boʻlishi uchun-chi — nechta paypoq olish kerak?",
        "Sinfda 25 ta oʻquvchi bor. Kamida uchtasining tugʻilgan kuni bir oyda ekanini isbotla.",
      ],
      hints: [
        "Shartni qayta oʻqi: «albatta» — demak, eng omadsiz holatda ham.",
        "Nima maʼlum: ranglar bor-yoʻgʻi ikkita, oylar esa oʻn ikkita.",
        "«Omadsizlik»ni chizib koʻr: bir xil rangli juft hali chiqmasligi uchun qanday paypoqlar tushishi mumkin?",
        "2 ta paypoq olsang, ular har xil rangda boʻlib chiqishi mumkin. Yana bittasini olsang-chi?",
        "Uchinchi paypoq albatta birinchi ikkitasidan biri bilan bir xil rangda boʻladi. Oylar bilan ham shunday: 12 ta oʻquvchi 12 xil oyda tugʻilgan boʻlishi mumkin, oʻn uchinchisiga esa boʻsh oy qolmaydi.",
      ],
      solution: {
        answer: "a) 3 ta paypoq; b) 13 ta oʻquvchi.",
        explanation: [
          "a) Ikkita paypoq har xil rangda boʻlishi mumkin — koʻk va qora. Uchinchisi esa albatta ulardan biri bilan bir xil rangda boʻladi.",
          "b) Oʻn ikki oʻquvchi oʻn ikki xil oyda tugʻilgan boʻlishi mumkin. Oʻn uchinchisi esa albatta ulardan kimdir bilan bir oyda tugʻilgan.",
        ],
        discuss: [
          "Bu — Dirixle prinsipi: quyonlar kataklardan koʻp boʻlsa, qaysidir katakda kamida ikkita quyon oʻtiradi.",
          "Ikkita koʻk paypoq albatta boʻlishi uchun 12 ta olish kerak: eng yomon holatda avval 10 ta qora paypoqning hammasi chiqadi.",
          "25 ta oʻquvchi: agar har bir oyda koʻpi bilan ikki kishi tugʻilgan boʻlsa, oʻquvchilar koʻpi bilan 24 ta boʻlardi.",
        ],
      },
    },
    w3d5t8: {
      title: "1, 3 va 5 lik tangalar",
      body: [
        {
          text: "Oʻyinda 1, 3 va 5 lik tangalar bor — har biridan istalgancha. {name} roppa-rosa 25 yigʻishi kerak.",
        },
        { text: "Roppa-rosa 9 ta tanga olsa, bu uddalanadimi? 10 ta olsa-chi? 11 ta? 12 ta?" },
      ],
      answer: {
        prompt: "25 ni yigʻish mumkinmi?",
        items: {
          n9: { label: "Roppa-rosa 9 ta tanga" },
          n10: { label: "Roppa-rosa 10 ta tanga" },
          n11: { label: "Roppa-rosa 11 ta tanga" },
          n12: { label: "Roppa-rosa 12 ta tanga" },
        },
        options: {
          yes: { label: "Mumkin" },
          no: { label: "Mumkin emas" },
        },
      },
      followUps: [
        "Har bir «mumkin» uchun misol yoz: qaysi tangalarni olish kerak?",
        "Shunday tangalardan roppa-rosa 9 tasi bilan 24 ni yigʻish mumkinmi?",
      ],
      hints: [
        "Shartni qayta oʻqi: yigʻindi roppa-rosa 25, tangalar soni ham xuddi savoldagidek boʻlishi kerak.",
        "Nima maʼlum: hamma tangalar — 1, 3 va 5 — toq sonlar.",
        "Istalgan ikkita tangani olib qoʻsh. Uchtasini-chi? Yigʻindilar juft chiqyaptimi yoki toq — yozib bor.",
        "Ikki toq sonning yigʻindisi har doim juft. Oʻnta toq sonni ikkitadan qilib qoʻshsak, yigʻindi qanday chiqadi?",
        "25 — toq son. Tangalar soni juft boʻlsa, yigʻindi har doim juft chiqadi. Tangalar soni toq boʻlganda misol izla: bir nechta beshlikdan boshla.",
      ],
      solution: {
        answer: "9 ta tanga — mumkin, 10 ta — mumkin emas, 11 ta — mumkin, 12 ta — mumkin emas.",
        explanation: [
          "9 ta tanga: toʻrtta 5 lik va beshta 1 lik: `20 + 5 = 25` ✓.",
          "11 ta tanga: uchta 5 lik, bitta 3 lik va yettita 1 lik: `15 + 3 + 7 = 25` ✓.",
          "10 va 12 ta tanga bilan — mumkin emas. Hamma tangalar toq. Ularni ikkitadan qilib qoʻshamiz: har ikkitasining yigʻindisi juft. Tangalar soni juft boʻlsa, ularning hammasini ikkitadan qilib ajratish mumkin — butun yigʻindi juft chiqadi. 25 esa toq.",
        ],
        discuss: [
          "Bu yerda eng muhimi — «mumkin emas»ni hamma variantlarni koʻrib chiqmasdan isbotlash: juft-toqlik tangalarni yigʻishning hamma usullari uchun birdaniga javob beradi.",
          "9 ta tanga bilan 24 ni yigʻib boʻlmaydi, sababi oʻsha: toq sondagi toq tangalarning yigʻindisi — toq.",
        ],
      },
    },
  },
  parent: {
    skills: [
      "Isbot va qarshi misol nima",
      "«Bunday boʻlmaydi»ni hamma variantlarni koʻrib chiqmasdan isbotlash",
      "Juft-toqlik — isbot quroli",
      "Dirixle prinsipi («quyonlar kataklardan koʻp»)",
    ],
    observe: [
      "Farzandingiz javob nega toʻgʻri ekanini tushuntiryaptimi yoki faqat javobni aytyaptimi?",
      "Farqni tushunyaptimi: misol qoidani isbotlamaydi, qarshi misol esa uni rad etadi?",
      "Almashtirishlar masalasida: nega tezroq boʻlmasligini izlayaptimi yoki topgan yechimi bilan kifoyalanyaptimi?",
    ],
    mistakes: [
      "«Beshta misolni tekshirdim — demak, qoida toʻgʻri» — tabiiy xato. Bitta qarshi misol qoidani buzishini koʻrsating.",
      "Avvaliga isbotlar qisqa va gʻalizroq chiqadi. Bu tabiiy: eng muhimi — ularda sabab boʻlsin («chunki…»).",
      "Paypoq masalasida koʻpincha «21» deb javob berishadi. «Eng omadsiz holatda nima boʻlishi mumkin?» degan savol yordam beradi.",
    ],
    question:
      "Uyimizda ikkita bir xil … yoʻqligini qanday isbotlash mumkin (nima ekanini birga oʻylab toping)? Rad etish-chi?",
  },
};
