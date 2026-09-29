/** Неделя 3, день 7 — по-узбекски (накладка на day7.ts, правила — docs/uzbek-style.md). */
import type { Uz } from "../localize";
import type { Day } from "../types";

export const day7Uz: Uz<Day> = {
  title: "Mantiq ustasi",
  habit: { name: "Men aniq fikr yuritaman" },
  intro: [
    "Bugun — mantiq ustasining kuni 🏆. Sen endi «agar…, unda…» deb mulohaza yuritishni, rostni yolgʻondan ajratishni, doiralarga joylashni, tortishni, isbotlashni va shifrlarni yechishni bilasan.",
    "Bugun bularning hammasi birga asqotadi: robot bilan oʻyin, shaxmatdagi ot, gulxan atrofidagi orolliklar. Oxirida esa — tarozi va toshlar bilan haqiqiy tadqiqot.",
  ],
  tasks: {
    w3d7t1: {
      title: "Usta razminkasi",
      body: [
        {
          label: "a)",
          text: "Bir son oʻylandi. Unga 15 ni qoʻshsak, `60 − 20` ga teng son chiqadi. Qaysi son oʻylangan?",
        },
        {
          label: "b)",
          text: "Ikki sonning yigʻindisi 50 ga teng. Birinchi sonni 7 ga oshirishdi, ikkinchisini esa 7 ga kamaytirishdi. Endi yigʻindi nechaga teng?",
        },
        {
          label: "c)",
          text: "Lolada Sanadagidan 5 ta konfet koʻp. Lola Sanaga 5 ta konfet berdi. Endi kimda konfet koʻp va nechta koʻp?",
        },
      ],
      answer: {
        fields: {
          a: { label: "a) oʻylangan son" },
          b: { label: "b) yigʻindi" },
          c: { label: "c) nechta koʻp" },
        },
      },
      followUps: [
        "c) masalachada endi kimda konfet koʻp? Misolda tekshirib koʻr: Sanada 10 ta konfet bor edi, deylik.",
        "Ikkinchi haftadagi qaysi asboblar har bir masalachada yordam berdi?",
      ],
      hints: [
        "Har bir masalachani qayta oʻqi. Nima maʼlum va nimani topish kerak?",
        "Nima maʼlum: a) masalachada `60 − 20 = 40`. Qaysi son 15 bilan birga 40 ni beradi?",
        "b) va c) uchun haqiqiy sonlar bilan misol oʻylab top va nima chiqishini tekshir.",
        "b) Sinab koʻr: 20 va 30. Ular 27 va 23 boʻldi. Yigʻindi nechaga teng? c) Sanada 10 ta, Lolada 15 ta konfet boʻlsin. Lola 5 tasini berdi — endi har birida nechtadan?",
        "b) masalachada qancha qoʻshilgan boʻlsa, shuncha ayirilgan — yigʻindi oʻzgarmadi. c) masalachada Sanada avval qancha konfet boʻlgan boʻlsa, endi Lolada shuncha qoldi.",
      ],
      solution: {
        answer: "a) 25; b) 50; c) endi Sanada 5 ta konfet koʻp.",
        explanation: [
          "a) `60 − 20 = 40`, `40 − 15 = 25`.",
          "b) 7 qoʻshildi va 7 ayirildi — yigʻindi 50 ligicha qoldi.",
          "c) Misol: Sanada 10 ta, Lolada 15 ta. Sovgʻadan keyin Lolada 10 ta, Sanada 15 ta. Endi Sanada 5 ta koʻp. Istalgan sonlarda shunday boʻladi: qizlar goʻyo konfetlarini almashib olishdi.",
        ],
        discuss: [
          "c) masalachada koʻpchilik «teng boʻladi» deb javob beradi. Misolda tekshirish — ishonch hosil qilishning eng yaxshi yoʻli.",
        ],
      },
    },
    w3d7t2: {
      title: "Gulxan atrofidagi suhbat",
      body: [
        {
          text: "Orolda rostgoʻylar va yolgʻonchilar yashaydi. Rostgoʻylar doim rost gapiradi, yolgʻonchilar doim yolgʻon gapiradi.",
        },
        {
          text: "Kechqurun orolliklar gulxan 🔥 atrofida aylana boʻlib oʻtirishdi. Ularning har biri: «Oʻng tomonimdagi qoʻshnim — yolgʻonchi», — dedi.",
        },
        { label: "a)", text: "Orolliklar toʻrt kishi boʻlsa, gulxan atrofida nechta rostgoʻy bor?" },
        { label: "b)", text: "Olti kishi boʻlsa-chi?" },
      ],
      answer: {
        fields: {
          four: { label: "a) 4 kishidan rostgoʻylar" },
          six: { label: "b) 6 kishidan rostgoʻylar" },
        },
      },
      followUps: [
        "Gulxan atrofida besh kishi oʻtirgan va har biri: «Oʻng tomonimdagi qoʻshnim — yolgʻonchi», — degan boʻlishi mumkinmi?",
        "«Qatordagi rostgoʻylar» masalasini esla. Aylana qatordan nimasi bilan farq qiladi?",
      ],
      hints: [
        "Shartni qayta oʻqi: har kim oʻng tomonidagi qoʻshnisi haqida gapiradi, aylana esa tutashadi.",
        "Nima maʼlum: agar orollik rostgoʻy boʻlsa, uning oʻng tomonidagi qoʻshnisi — yolgʻonchi. Agar orollik yolgʻonchi boʻlsa, unda uning oʻngdagi qoʻshnisi…",
        "Toʻrtta nuqtadan aylana chiz va har birining yoniga yoz: R — rostgoʻy yoki Y — yolgʻonchi. Birinchisini rostgoʻy deb boshla.",
        "Rostgoʻydan keyin doim yolgʻonchi oʻtiradi, yolgʻonchidan keyin esa — rostgoʻy. Ular navbatma-navbat keladi.",
        "Aylanani aylanib chiq va birinchi orollikka ziddiyatsiz qaytib kelishingni tekshir. Nechta R chiqdi?",
      ],
      solution: {
        answer: "a) 2 ta rostgoʻy; b) 3 ta rostgoʻy.",
        explanation: [
          "Agar orollik rostgoʻy boʻlsa, uning oʻngdagi qoʻshnisi — yolgʻonchi (rostgoʻy rost gapiradi). Agar orollik yolgʻonchi boʻlsa, uning oʻngdagi qoʻshnisi — rostgoʻy (yolgʻonchi aldadi). Demak, rostgoʻylar va yolgʻonchilar navbatma-navbat keladi: R, Y, R, Y…",
          "Toʻrt kishidan 2 tasi rostgoʻy, 2 tasi yolgʻonchi, olti kishidan esa — 3 va 3.",
        ],
        discuss: [
          "Besh kishi bunday oʻtira olmaydi: beshtalik aylanada navbatma-navbat qoʻyib chiqilsa, beshinchisi bilan birinchisi bir xil boʻlib qoladi va ulardan biri qoʻshnisi haqida notoʻgʻri gap aytgan boʻlib chiqadi. Aylanada oʻtirganlar soni juft boʻlishi kerak — «boʻlmaydi»ni isbotlashda yana juft-toqlik yordam berdi!",
          "Qatorda oxirgi kishi hech kim haqida gapirmaydi, shuning uchun qator istalgan uzunlikda boʻlishi mumkin. Aylana esa tutashadi — va shart paydo boʻladi.",
        ],
      },
    },
    w3d7t3: {
      title: "Nechta holat?",
      body: [
        {
          text: "Chiroq va kalitlar esingdami? Har bir kalit yoniq yoki oʻchiq boʻlishi mumkin. Bitta kalitning 2 ta holati bor, ikkitasining — 4 ta, uchtasining — 8 ta.",
        },
        null,
        { label: "a)", text: "Toʻrtta kalitning nechta turli holati bor?" },
        { label: "b)", text: "Beshtasiniki-chi?" },
      ],
      answer: {
        fields: {
          four: { label: "a) toʻrtta kalitda" },
          five: { label: "b) beshta kalitda" },
        },
      },
      followUps: [
        "Nega har bir yangi kalit holatlar sonini ikki barobar oshiradi?",
        "Bu hafta 1, 2, 4, 8, 16 sonlari senga yana qayerda uchradi?",
      ],
      hints: [
        "Shartni qayta oʻqi: bitta kalitning nechta holati bor? Ikkitasiniki-chi?",
        "Nima maʼlum: uchta kalitning 8 ta holati bor.",
        "Chizib koʻr: toʻrtinchi kalitni qoʻsh. Dastlabki uchtasining 8 ta holatidan istalganini ol. Toʻrtinchisida nechta variant bor?",
        "Uchta kalitning har bir holatini toʻrtinchisi bilan ikki xil toʻldirish mumkin: yoniq va oʻchiq.",
        "Har bir yangi kalit bilan holatlar ikki barobar koʻpayadi: 8, keyin `8 + 8`…",
      ],
      solution: {
        answer: "a) 16; b) 32.",
        explanation: [
          "Uchta kalitning har bir holatini toʻrtinchisi bilan ikki xil toʻldirish mumkin: yoniq yoki oʻchiq. Shuning uchun holatlar ikki barobar koʻp: `8 + 8 = 16`.",
          "Beshinchi kalit bilan — yana ikki barobar: `16 + 16 = 32`.",
        ],
        discuss: [
          "Bular — toʻrtinchi kundagi «Ikki barobar ogʻir» masalasidagi tarozi toshlarining xuddi oʻsha sonlari. Bugungi tadqiqotda ular u yerda bejiz emasligi maʼlum boʻladi!",
        ],
      },
    },
    w3d7t4: {
      title: "Oxirgi toshcha",
      body: [
        {
          text: "Stolda 10 ta toshcha bor. Sen robot 🤖 bilan navbatma-navbat yurasan: bir yurishda 1 yoki 2 ta toshcha olish mumkin. Oxirgi toshchani kim olsa, oʻsha yutadi. Birinchi boʻlib sen yurasan.",
        },
        { text: "Robot juda yaxshi oʻynaydi. Uni doim yutishga imkon beradigan usulni top!" },
        {
          text: "Yutqazish qoʻrqinchli emas: har bir oʻyin sirni topishga yordam beradi. Oʻyin kundaligiga qarab tur.",
        },
      ],
      followUps: [
        "Stolda 11 ta toshcha boʻlsa, birinchi yurishda nechtasini olish kerak? 12 ta boʻlsa-chi?",
        "Siringni kattalarga tushuntir va gugurt choʻplari yoki tugmalar bilan birga oʻynab koʻringlar.",
      ],
      hints: [
        "Shartni qayta oʻqi: 1 yoki 2 ta olinadi, oxirgisini olgan yutadi.",
        "Nima maʼlum: sening yurishing oldidan stolda 1 yoki 2 ta toshcha boʻlsa, darhol yutasan.",
        "Kichikdan boshla: stolda 3 ta toshcha boʻlib, navbat raqibda boʻlsa, kim yutadi? 4 ta boʻlsa-chi?",
        "Raqibga 3 ta toshcha qoldirsang, u yutqazadi: nechta olmasin, qolganini sen olasan. Unga 6 ta qoldirsang-chi?",
        "Robotga 9, keyin 6, keyin 3 ta toshcha qoldir. Buning uchun birinchi yurishda 1 tasini ol, keyin esa robot olgani bilan birga 3 ta boʻladigan qilib ol.",
      ],
      solution: {
        answer: "Birinchi yurishda 1 ta toshcha olish, keyin esa har safar robot olganini 3 tagacha toʻldirish.",
        explanation: [
          "3, 6, 9 sonlari — «tuzoq»: stolda shuncha toshcha turganda kimning navbati boʻlsa, oʻsha yutqazadi. U nechta olmasin (1 yoki 2), raqibi birgalikda 3 ta boʻladigan qilib oladi va yana tuzoq qoldiradi.",
          "Shuning uchun birinchi yurishda 1 tasini olib, robotga 9 ta qoldirish kerak. Robot 1 ta olsa — sen 2 ta olasan, robot 2 ta olsa — sen 1 ta olasan. 6 ta qoladi, keyin 3 ta, keyin 0 — oxirgi toshcha seniki.",
        ],
        discuss: [
          "Toshchalar 9 yoki 12 ta boʻlsa, birinchi yurgan odam kuchli raqibni yuta olmaydi: tuzoq unga tushadi. 11 ta toshchada birinchi yurishda 2 tasini olish kerak.",
          "Avval kichik holatlarni (1, 2, 3, 4 ta toshcha) koʻrib chiqish — ikkinchi haftadagi «kichik misol» asbobi. Aynan u sirga olib keladi.",
        ],
      },
    },
    w3d7t5: {
      title: "Kichik taxtadagi ot",
      body: [
        {
          text: "Shaxmatdagi ot ♞ «L» harfi shaklida yuradi: toʻgʻriga ikki katak va yonga bir katak. U boshqa kataklar ustidan sakrab oʻtadi.",
        },
        null,
        {
          label: "a)",
          text: "Ot 3 × 3 taxtaning burchagida turibdi. U qarama-qarshi burchakdagi yulduzchaga necha yurishda yetib boradi?",
        },
        {
          label: "b)",
          text: "Ot istalgancha yursa, bu taxtaning nechta katagiga bora oladi? U hozir turgan katakni ham sana.",
        },
      ],
      answer: {
        fields: {
          moves: { label: "a) yurish" },
          cells: { label: "b) katak" },
        },
      },
      followUps: [
        "Ot qaysi katakka hech qachon bora olmaydi? Nega?",
        "4 × 4 taxtada-chi — ot burchakdan qarama-qarshi burchakka necha yurishda yetib boradi?",
      ],
      hints: [
        "Ot qanday yurishini qayta oʻqi: toʻgʻriga ikki katak va yonga bir katak.",
        "Nima maʼlum: 3 × 3 taxtaning burchagidan otning bor-yoʻgʻi ikkita yurishi bor.",
        "Taxtani chiz va kataklarga ot u yerga necha yurishda borishini yoz: 0 — u turgan joy, 1 — bir yurishda boradigan joylar…",
        "Markaziy katakka qara. Ot unga biror joydan kela oladimi?",
        "Ot taxtaning cheti boʻylab aylanib yuradi: burchakdan — tomon oʻrtasiga, u yerdan — boshqa burchakka… Yulduzchagacha yurishlarni sana.",
      ],
      solution: {
        answer: "a) 4 ta yurish; b) 8 ta katak — markaziydan boshqa hammasi.",
        explanation: [
          "Yulduzchagacha yoʻl: chap pastki burchakdan — yuqori chetning oʻrtasiga, u yerdan — oʻng pastki burchakka, keyin — chap chetning oʻrtasiga va nihoyat, oʻng yuqori burchakka. 4 ta yurish.",
          "Bundan qisqasi boʻlmaydi: ot 1 yurishda faqat 2 ta katakka, 2 yurishda — yana 2 tasiga, 3 yurishda — yana 2 tasiga bora oladi, ular orasida yulduzcha yoʻq.",
          "Markazga ot hech qachon bora olmaydi: markazdan har qanday «L» yurish taxtadan chiqib ketadi, demak, markazga kelishning ham iloji yoʻq.",
        ],
        discuss: [
          "Ot chetdagi 8 ta katakni aylanib chiqadi. Shaxmatchilar ot yurishlarini koʻrishni shunday mashq qilishadi.",
          "4 × 4 taxtada burchakdan qarama-qarshi burchakka — 2 ta yurish.",
        ],
      },
    },
    w3d7t6: {
      title: "Doʻkonga xatcha",
      body: [
        { text: "Onasi {name:ga} xatcha yozib berdi:" },
        {
          text: "Agar doʻkonda banan boʻlsa, 2 kg banan ol. Agar banan boʻlmasa, 3 kg olma ol. Albatta non ham ol.",
        },
        {
          text: "Narxlar: banan — kilosi 16 ming soʻm, olma — kilosi 12 ming soʻm, non — 5 ming soʻm.",
        },
        { label: "a)", text: "Doʻkonda banan yoʻq ekan. {name} qancha pul toʻladi?" },
        { label: "b)", text: "Banan boʻlganida-chi, u qancha toʻlagan boʻlardi?" },
      ],
      answer: {
        fields: {
          noBananas: { label: "a) toʻladi", suffix: "ming soʻm" },
          bananas: { label: "b) toʻlagan boʻlardi", suffix: "ming soʻm" },
        },
      },
      followUps: [
        "Qaysi variant qimmatroq va qanchaga?",
        "Doʻkonga borish uchun oʻzingning «agar…, unda…» xatchangni yoz.",
      ],
      hints: [
        "Xatchani qayta oʻqi: banan boʻlsa nima olish kerak, boʻlmasa-chi? Nimani har qanday holatda olish kerak?",
        "Nima maʼlum: a) savolda banan yoʻq edi — demak, {name} 3 kg olma va non oldi.",
        "«Ayri yoʻl» chiz: banan bor → …, banan yoʻq → … Ikkala yoʻlga ham nonni qoʻsh.",
        "3 kg olma — bu `12 + 12 + 12`. Bu qancha boʻladi? Nonni unutma!",
        "b) 2 kg banan — `16 + 16`, yana non.",
      ],
      solution: {
        answer: "a) 41 ming soʻm; b) 37 ming soʻm.",
        explanation: [
          "a) Olma: `12 + 12 + 12 = 36`, non — 5: `36 + 5 = 41`.",
          "b) Banan: `16 + 16 = 32`, non — 5: `32 + 5 = 37`.",
        ],
        discuss: [
          "Non ikkala holatda ham olinadi — bu xatchaning «agar»siz qismi. Koʻp uchraydigan xato — uni unutish.",
          "Banansiz variant 4 ming soʻm qimmatroq.",
        ],
      },
    },
    w3d7t7: {
      title: "Tarozi va toshlar",
      body: [
        {
          text: "Tadqiqot! Tarozining chap pallasiga yuk, oʻng pallasiga esa tarozi toshlari qoʻyiladi. Qaysi yuklarni muvozanatga keltirish mumkin?",
        },
        {
          items: [
            "1, 2, 4 va 8 kg lik toshlar. 1 kg dan 15 kg gacha qaysi yuklarni muvozanatga keltirish mumkin? Qanday qilib?",
            "1, 3 va 9 kg lik toshlar — lekin endi toshlarni **ikkala** pallaga, hatto yukning yoniga ham qoʻyish mumkin. 1 kg dan 13 kg gacha qaysi yuklar chiqadi?",
            "1, 2, 5 va 10 kg lik toshlar — xuddi tangalardek. 1 kg dan 18 kg gacha qaysi yuklarni muvozanatlab **boʻlmaydi**? Nega?",
            "Uchta toshdan iborat oʻz toʻplamingni oʻylab top: u bilan imkon qadar koʻp har xil yukni muvozanatlash mumkin boʻlsin.",
          ],
        },
        {
          text: "Kamida 6 ta yukni muvozanatga keltirsang — tadqiqot hisoblanadi. Lekin haqiqiy tadqiqotchi mumkin boʻlgan hammasini topadi!",
        },
      ],
      followUps: [
        "Nega 1, 2, 4, 8 toshlari bilan har bir yuk faqat bitta usulda chiqadi?",
        "Toshlarni ikkala pallaga qoʻyish mumkin boʻlsa, 2 kg yukni 1 va 3 kg lik toshlar bilan qanday muvozanatlash mumkin?",
        "40 kg gacha hamma yuklar chiqishi uchun 1, 3, 9 toʻplamiga qanday tosh qoʻshish kerak?",
      ],
      hints: [
        "Shartni qayta oʻqi: yuk doim chapda turadi. Birinchi va uchinchi toʻplamda toshlar faqat oʻngga qoʻyiladi, ikkinchisida — chapga ham qoʻysa boʻladi.",
        "Nima maʼlum: 1 kg yukni 1 kg lik tosh muvozanatlaydi, 3 kg yukni — 1 va 2 kg lik toshlar.",
        "Topgan har bir muvozanatingni yozib bor: yuk — qaysi toshlar. Shunda qaysi yuklar yetishmayotgani koʻrinadi.",
        "1, 3, 9 toʻplami va 2 kg yuk uchun: 1 kg lik toshni yukning yoniga, 3 kg lik toshni esa boshqa pallaga qoʻy: `2 + 1 = 3`.",
        "1, 2, 5, 10 toʻplami uchun: faqat 1 va 2 kg lik toshlar bilan qaysi yuklar chiqadi? Ular 4 ni hosil qilishga yetadimi?",
      ],
      solution: {
        answer:
          "1, 2, 4, 8 toshlari bilan 1 kg dan 15 kg gacha hamma yuklar muvozanatlanadi — har biri roppa-rosa bitta usulda. 1, 3, 9 toshlarini ikkala pallaga qoʻyib — 1 kg dan 13 kg gacha hamma yuklar. 1, 2, 5, 10 toshlari bilan 4, 9 va 14 kg ni muvozanatlab boʻlmaydi.",
        explanation: [
          "1, 2, 4, 8 toʻplami: masalan, `11 = 8 + 2 + 1`, `13 = 8 + 4 + 1`, `15 = 8 + 4 + 2 + 1`. Har bir keyingi tosh oldingi hamma toshlarning jamidan 1 kg ogʻir, shuning uchun yangi tosh yuklar qatorini boʻshliqsiz davom ettiradi.",
          "1, 3, 9 toʻplami, toshlar ikkala pallada: masalan, `2 + 1 = 3`, `5 + 3 + 1 = 9`, `7 + 3 = 9 + 1`. Yukning yonida turgan tosh goʻyo ayiriladi.",
          "1, 2, 5, 10 toʻplami: 1 va 2 kg lik toshlar bilan faqat 1, 2 va 3 kg chiqadi, shuning uchun 4 kg chiqmaydi. Xuddi shunday `5 + 4 = 9` va `10 + 4 = 14` kg ham chiqmaydi.",
        ],
        discuss: [
          "Bu qadimiy masala — uni oʻrta asrlardayoq yechishgan. 1, 2, 4, 8 toʻplami ikki barobar oshirish va kalitlar bilan bogʻliq: har bir toshning ikki holati bor — «tarozida» va «yoʻq». Kompyuterlar sonlarni aynan shunday yozadi.",
          "Ikkala pallaga qoʻyish mumkin boʻlsa, toshning uchta holati bor: chapda, oʻngda va «yoʻq». Shuning uchun 1, 3, 9 toʻplami shunchalik «tejamkor». 27 kg lik tosh qoʻshilsa, 40 kg gacha hamma yuklar chiqadi.",
          "Farzandingiz 1, 2, 5, 10 toʻplamida boʻshliqlar har 5 kg da takrorlanishini — 4, 9, 14 — oʻzi payqasa, juda yaxshi.",
        ],
      },
    },
  },
  parent: {
    skills: [
      "Hammasi birga: «agar…, unda…», rost va yolgʻon, isbot",
      "Oʻyinda yutish strategiyasi",
      "Shaxmatdagi otning yurishlari",
      "Tadqiqot: tarozi toshlari, ikki barobar oshirish va «uchta holat»",
    ],
    observe: [
      "Farzandingiz hafta usullaridan oʻzi foydalanyaptimi: «faraz qil va tekshir», «kichik misol», juft-toqlik?",
      "Toshchalar oʻyinida: yutqazgandan keyin qonuniyat izlayaptimi yoki shunchaki qaytadan urinyaptimi?",
      "Tadqiqotda: topganlarini yozib boryaptimi, boʻshliqlarni izlayaptimi, nimadir nega chiqmayotganini tushuntiryaptimi?",
    ],
    mistakes: [
      "Robotga bir necha marta yutqazish — tabiiy va hatto foydali: shunda 3, 6, 9 «tuzoqlari» koʻrinadi.",
      "Gulxan masalasida aylana tutashishini unutish mumkin: oxirgi orollik birinchisi haqida gapiradi.",
      "Toshlarni ikkala pallaga qoʻyish avvaliga qiyin tuyuladi: «yukning yonidagi tosh yukka yordam beradi» deb ovoz chiqarib aytish yordam beradi.",
    ],
    question: "Bu haftaning qaysi usuli senga eng koʻp yoqdi? U hayotda qayerda asqotishi mumkin?",
  },
};
