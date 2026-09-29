/** Неделя 3, день 2 — по-узбекски (накладка на day2.ts, правила — docs/uzbek-style.md). */
import type { Uz } from "../localize";
import type { Day } from "../types";

export const day2Uz: Uz<Day> = {
  title: "Rost va yolgʻon",
  habit: { name: "Men ziddiyat qidiraman" },
  intro: [
    "Bugun biz rostgoʻylar va yolgʻonchilar oroliga sayohat qilamiz 🏝️. Rostgoʻylar doim rost gapiradi, yolgʻonchilar esa doim yolgʻon gapiradi. Kim kimligini qanday bilsa boʻladi?",
    "Kunning asosiy usuli: **faraz qil va tekshir**. Masalan, orollik rostgoʻy deb faraz qil va bundan nima kelib chiqishini koʻr. Agar ziddiyat chiqsa — bir gap boshqasiga qarshi chiqsa, — demak, faraz notoʻgʻri 🎭.",
  ],
  tasks: {
    w3d2t1: {
      title: "Va, yoki, emas",
      body: [
        {
          text: "Shanba kuni {name} basseynga bordi 🏊 va muzqaymoq yedi 🍦. Kinoga 🎬 bormadi, futbol ⚽ ham oʻynamadi.",
        },
        {
          text: "«Va» soʻzi — ikkalasi ham toʻgʻri degani. «Yoki» soʻzi — ikkitadan kamida bittasi toʻgʻri degani.",
        },
        { text: "Shanba haqidagi qaysi gaplar rost, qaysilari yolgʻon?" },
      ],
      answer: {
        prompt: "Rostmi yoki yolgʻon?",
        items: {
          a: { label: "a) {name} basseynga bordi va muzqaymoq yedi." },
          b: { label: "b) {name} kinoga yoki basseynga bordi." },
          c: { label: "c) {name} kinoga va basseynga bordi." },
          d: { label: "d) {name} kinoga bormadi." },
          e: { label: "e) {name} futbol oʻynadi yoki kinoga bordi." },
        },
        options: {
          true: { label: "Rost" },
          false: { label: "Yolgʻon" },
        },
      },
      followUps: [
        "b) va c) gaplarning farqi nimada? Qaysi bitta soʻz hammasini oʻzgartiradi?",
        "Oʻzingning yakshanbang haqida «yoki» bilan bitta rost gap va «va» bilan bitta yolgʻon gap oʻylab top.",
      ],
      hints: [
        "{name} shanba kuni nima qilganini va nima qilmaganini yana bir oʻqib chiq.",
        "Basseyn — ha, muzqaymoq — ha, kino — yoʻq, futbol — yoʻq.",
        "Shu toʻrt dalilni yozib ol va har bir gapning har bir qismini ular boʻyicha tekshir.",
        "b) ni koʻrib chiqamiz: «kino yoki basseyn». Kino — yoʻq, basseyn — ha. «Yoki» uchun bitta «ha» yetarli.",
        "«Va» uchun ikkala «ha» kerak. «Yoki» uchun — kamida bittasi. Inkor («emas», «-ma») esa «ha»ni «yoʻq»qa aylantiradi.",
      ],
      solution: {
        answer: "Rost: a), b), d). Yolgʻon: c), e).",
        explanation: [
          "a) Basseyn — ha va muzqaymoq — ha: rost.",
          "b) Kino — yoʻq, basseyn — ha. «Yoki» uchun bitta «ha» yetadi: rost.",
          "c) «Va» uchun ikkala «ha» kerak, kino esa — yoʻq: yolgʻon.",
          "d) {name} kinoga bormagan: rost.",
          "e) Futbol — yoʻq, kino — yoʻq. Birorta ham «ha» yoʻq: yolgʻon.",
        ],
        discuss: [
          "«Va», «yoki», «emas» soʻzlari — mantiqning gʻishtlari. Kompyuterlar ham ular yordamida «oʻylaydi»: bu haqda chiroq haqidagi masalada gap boradi.",
        ],
      },
    },
    w3d2t2: {
      title: "Bitta raqam adashibdi",
      body: [
        { text: "`47 + 28 = 65` yozuvida roppa-rosa bitta raqam xato." },
        {
          text: "Tenglik toʻgʻri boʻlishi uchun bitta raqamni tuzat. Oltita raqamning istalganini oʻzgartirish mumkin, lekin faqat bittasini. Buni necha xil usulda qilish mumkin?",
        },
      ],
      answer: {
        fields: { ways: { label: "Usullar soni" } },
      },
      followUps: [
        "Hamma usullarni yozib chiq. Qaysi birini birinchi topding?",
        "Nega ikkinchi raqamni — 7 ni tuzatib boʻlmaydi?",
      ],
      hints: [
        "Yana bir oʻqi: roppa-rosa bitta raqamni oʻzgartiramiz. Qolgan beshtasi oʻz holicha qoladi.",
        "Aslida `47 + 28 = 75`, 65 emas. Farqi — 10.",
        "Raqamlarni tartib bilan birma-bir koʻrib chiq: avval 4 ni oʻzgartirib koʻr, keyin 7 ni, 2 ni, 8 ni, 6 ni va 5 ni. Nima chiqqanini yozib bor.",
        "Javobni oʻzgartirib koʻr: 75 hosil boʻlishi uchun 65 dagi qaysi raqamni almashtirish kerak?",
        "Yigʻindi keraginidan roppa-rosa bitta oʻnlikka koʻp. Uni 10 ga kamaytirish uchun qoʻshiluvchilardan birining oʻnliklarini kamaytirish mumkin. Yoki javobdagi oʻnliklarni oshirish mumkin.",
      ],
      solution: {
        answer: "Uch usulda: `37 + 28 = 65`, `47 + 18 = 65`, `47 + 28 = 75`.",
        explanation: [
          "Aslida `47 + 28 = 75`. Tenglikni tuzatish uchun birinchi qoʻshiluvchini (37) yoki ikkinchisini (18) bitta oʻnlikka kamaytirish mumkin — yoki javobni 75 ga tuzatish mumkin.",
          "Birliklarni oʻzgartirib boʻlmaydi: 7, 8 yoki 5 oʻrniga boshqa istalgan raqam qoʻyilsa, yigʻindining oxirgi raqami mos kelmay qoladi.",
        ],
        discuss: [
          "Farzandingiz raqamlarni taxmin qilmasdan, tartib bilan koʻrib chiqsa, juda yaxshi — shunda boshqa usul yoʻqligiga ishonch hosil qiladi.",
        ],
      },
    },
    w3d2t3: {
      title: "Murabboni kim yedi?",
      body: [
        { text: "Bolalarning oyisi murabbo bankasini boʻm-boʻsh holda topdi 🍯. Murabboni uch boladan bittasi yegan:" },
        {
          visual: {
            items: [
              { name: "Ali", text: "Murabboni Bobur yedi" },
              { name: "Bobur", text: "Men murabbo yemadim" },
              { name: "Vasila", text: "Men murabbo yemadim" },
            ],
          },
        },
        { text: "Maʼlumki, ulardan **faqat bittasi** rost gapirgan. Murabboni kim yegan?" },
        {
          visual: {
            corner: "Agar … yegan boʻlsa",
            rows: ["Ali", "Bobur", "Vasila"],
            cols: ["Alining gapi", "Boburning gapi", "Vasilaning gapi"],
          },
        },
        { text: "Har bir holatni tekshir. Jadvalda belgilab bor: ✓ — rost, ✗ — yolgʻon." },
      ],
      answer: {
        prompt: "Murabboni kim yegan?",
        options: {
          ali: { label: "👦 Ali" },
          bobur: { label: "🧒 Bobur" },
          vika: { label: "👧 Vasila" },
        },
      },
      followUps: ["Uchovidan kim rost gapirgan?", "Agar ikki kishi rost gapirganida, murabboni kim yegan boʻlardi?"],
      hints: [
        "Yana bir oʻqi: murabboni bitta bola yegan, rostni ham faqat bittasi aytgan.",
        "Hammasi boʻlib uchta holat bor: Ali yegan, Bobur yegan yoki Vasila yegan.",
        "Jadvalni toʻldir: har bir qatorda kim yeganini faraz qil va unda kimning gapi rost boʻlishini belgila.",
        "Ali yegan deb faraz qil. Unda Bobur rost gapiryapti («Men yemadim»), Vasila ham. Nechta rost gap chiqdi? Mos keladimi?",
        "Faqat roppa-rosa bitta ✓ belgisi bor qator mos keladi.",
      ],
      solution: {
        answer: "Murabboni Vasila yegan.",
        explanation: [
          "Agar Ali yegan boʻlsa: Alining gapi — yolgʻon, Boburniki — rost, Vasilaniki — rost. Rost gapirganlar ikkita — mos kelmaydi.",
          "Agar Bobur yegan boʻlsa: Ali — rost, Bobur — yolgʻon, Vasila — rost. Yana ikkita — mos kelmaydi.",
          "Agar Vasila yegan boʻlsa: Ali — yolgʻon, Bobur — rost, Vasila — yolgʻon. Faqat Bobur rost gapirgan ✓.",
        ],
        discuss: [
          "Bu — «faraz qil va tekshir» usuli: barcha holatlarni birma-bir koʻrib chiqamiz va shartga zid keladiganlarini chiqarib tashlaymiz.",
          "Agar ikki kishi rost gapirganida, ikki holat — Ali ham, Bobur ham mos kelardi va javob bir maʼnoli boʻlmasdi.",
        ],
      },
    },
    w3d2t4: {
      title: "Qatordagi rostgoʻylar",
      body: [
        {
          text: "Orolda rostgoʻylar va yolgʻonchilar yashaydi. Rostgoʻylar doim rost gapiradi, yolgʻonchilar doim yolgʻon gapiradi.",
        },
        { text: "Yetti nafar orollik bir qatorga tizildi:" },
        {
          visual: {
            items: [
              { label: "birinchi" },
              { label: "ikkinchi" },
              { label: "uchinchi" },
              { label: "toʻrtinchi" },
              { label: "beshinchi" },
              { label: "oltinchi" },
              { label: "yettinchi" },
            ],
          },
        },
        {
          text: "Oxirgisidan tashqari har biri shunday dedi: «Oʻng tomonimdagi qoʻshnim — yolgʻonchi». Qatordagi birinchi orollik rostgoʻy ekani maʼlum. Qani, kim kim ekan?",
        },
      ],
      answer: {
        prompt: "Bu kim?",
        items: {
          second: { label: "Ikkinchisi" },
          fifth: { label: "Beshinchisi" },
          seventh: { label: "Yettinchisi" },
        },
        options: {
          knight: { label: "Rostgoʻy" },
          liar: { label: "Yolgʻonchi" },
        },
      },
      followUps: [
        "Qatorda hammasi boʻlib nechta rostgoʻy bor?",
        "Agar birinchi boʻlib yolgʻonchi turganida, yettinchisi kim boʻlardi?",
      ],
      hints: [
        "Yana bir oʻqi: kim aniq rostgoʻy? U nima degan?",
        "Birinchisi — rostgoʻy, u rost gapiradi. Demak, uning «oʻng tomonimdagi qoʻshnim — yolgʻonchi» degan gapi — rost.",
        "Yettita doiracha chiz va har birining tagiga yozib bor: R — rostgoʻy, Y — yolgʻonchi.",
        "Ikkinchisi — yolgʻonchi. U: «Uchinchisi — yolgʻonchi», degan. Yolgʻonchi doim yolgʻon gapiradi — demak, aslida uchinchisi…",
        "Rostgoʻylar va yolgʻonchilar navbatma-navbat keladi: R, Y, R, Y… Shu naqshni yettinchisigacha davom ettir.",
      ],
      solution: {
        answer: "Ikkinchisi — yolgʻonchi, beshinchisi — rostgoʻy, yettinchisi — rostgoʻy.",
        explanation: [
          "Birinchisi — rostgoʻy, u rost gapiradi: ikkinchisi — yolgʻonchi.",
          "Ikkinchisi — yolgʻonchi, uning «uchinchisi — yolgʻonchi» degan gapi yolgʻon: uchinchisi — rostgoʻy.",
          "Keyin ham shunday: rostgoʻylar va yolgʻonchilar navbatma-navbat keladi. R, Y, R, Y, R, Y, R — beshinchisi va yettinchisi rostgoʻy.",
        ],
        discuss: [
          "Qatorda 4 ta rostgoʻy va 3 ta yolgʻonchi bor. Agar birinchi boʻlib yolgʻonchi turganida, naqsh Y dan boshlanar va yettinchisi yolgʻonchi boʻlardi.",
          "Bu naqsh 7-kunda yana uchraydi — davra boʻlib oʻtirgan orolliklar haqidagi masalada.",
        ],
      },
    },
    w3d2t5: {
      title: "Chiroq va kalitlar",
      body: [
        {
          text: "Chiroq 💡 uchta kalitga ulangan: A, B va C. Har bir kalit yoniq yoki oʻchiq boʻlishi mumkin.",
        },
        {
          text: "Agar A kalit yoniq **va** B **yoki** C kalitlardan kamida bittasi yoniq boʻlsa, chiroq yonadi.",
        },
        { label: "a)", text: "Uchta kalit hammasi boʻlib nechta turli holatda boʻlishi mumkin?" },
        { label: "b)", text: "Shu holatlarning nechtasida chiroq yonadi?" },
        {
          visual: {
            head: ["A", "B", "C", "Yonadimi?"],
            rows: [
              ["yoniq", "yoniq", "yoniq"],
              ["yoniq", "yoniq", "oʻchiq"],
              ["yoniq", "oʻchiq", "yoniq"],
            ],
          },
        },
      ],
      answer: {
        fields: {
          all: { label: "a) jami holatlar" },
          on: { label: "b) chiroq yonadi" },
        },
      },
      followUps: [
        "Toʻrtta kalitning nechta holati boʻlardi?",
        "Chiroq uchun oʻz qoidangni oʻylab top: u faqat bitta holatda yonsin.",
      ],
      hints: [
        "Qoidani yana bir oʻqi. Qaysi kalit albatta yoniq boʻlishi kerak?",
        "Har bir kalitning ikkita holati bor — yoniq va oʻchiq.",
        "Jadvalni tartib bilan davom ettir: avval A yoniq boʻlgan hamma holatlarni, keyin A oʻchiq boʻlganlarini yoz.",
        "Avval ikkita kalit uchun yech: A va B ning nechta holati bor? Ularni yozib chiq: yoniq-yoniq, yoniq-oʻchiq…",
        "A oʻchiq boʻlsa, chiroq hech qachon yonmaydi. A yoniq boʻlsa, B va C ga qara: chiroq faqat ikkalasi ham oʻchiq boʻlganda yonmaydi.",
      ],
      solution: {
        answer: "a) 8 ta holat; b) ulardan 3 tasida chiroq yonadi.",
        explanation: [
          "A ning har bir holati uchun B va C ning 4 ta holati bor: yoniq-yoniq, yoniq-oʻchiq, oʻchiq-yoniq, oʻchiq-oʻchiq. Jami `4 + 4 = 8`.",
          "A oʻchiq boʻlsa — 4 ta holat, chiroq yonmaydi.",
          "A yoniq boʻlsa — chiroq doim yonadi, faqat B ham, C ham oʻchiq boʻlgan holat bundan mustasno. Bu `4 − 1 = 3` ta holat.",
        ],
        discuss: [
          "Bu yerda eng muhimi — holatlarni tartib bilan koʻrib chiqish: shunda birortasi ham tushib qolmaydi va ikki marta sanalmaydi.",
          "Har bir yangi kalit qoʻshilganda holatlar soni ikki barobar ortadi: 2, 4, 8, 16… Bu qonuniyat 7-kunda yana uchraydi.",
        ],
      },
    },
    w3d2t6: {
      title: "Oʻrindiqda",
      body: [
        { text: "Ali, Bobur va Vasila oʻrindiqqa oʻtirishdi 🪑. Mana nima maʼlum:" },
        { items: ["Ali chetda oʻtiribdi.", "Bobur Alining yonida oʻtiribdi.", "Vasila Boburdan chapda oʻtiribdi."] },
        { text: "«Chapda» va «oʻngda» — biz oʻrindiqqa qaraganimizda qanday koʻrsak, shunday." },
      ],
      answer: {
        prompt: "Kim qayerda oʻtiribdi? Ismlarni chapdan oʻngga qarab bos:",
        items: {
          ali: { label: "Ali" },
          bobur: { label: "Bobur" },
          vika: { label: "Vasila" },
        },
      },
      followUps: [
        "Uchta shartdan birini olib tashlasak ham, javob yagona boʻlib qoladimi?",
        "Oʻrtada kim oʻtiribdi? Boshqacha boʻlishi mumkinmidi?",
      ],
      hints: [
        "Uchala shartni yana bir oʻqi. Ulardan qaysi biri kimdir qayerda oʻtirganini darrov aytadi?",
        "Joy hammasi boʻlib uchta — chap, oʻrta va oʻng. Ali chetdagi joylardan birida.",
        "Uch joyli oʻrindiq chiz va Alini avval chapga, keyin oʻngga oʻtqazib koʻr.",
        "Agar Ali chapda oʻtirsa, Bobur — oʻrtada. Unda Vasila qayerda? 3-shart bajariladimi?",
        "Vasila Boburdan chapda oʻtiradi — demak, Boburning chap tomonida Vasila uchun joy qolishi kerak. Unda Ali chap chetda oʻtira oladimi?",
      ],
      solution: {
        answer: "Chapdan oʻngga: Vasila, Bobur, Ali.",
        explanation: [
          "Agar Ali chapda oʻtirganida, Bobur oʻrtada, Vasila esa undan oʻngda oʻtirgan boʻlardi. Lekin Vasila Boburdan chapda boʻlishi kerak — ziddiyat.",
          "Demak, Ali oʻngda, Bobur — oʻrtada, Vasila esa chapda oʻtiribdi.",
        ],
        discuss: [
          "Bu yerda har bir shart kerak: uchtasidan istalganini olib tashlasangiz, ikki xil oʻtirish mos keladi. Masalan, 1-shartsiz «Vasila, Ali, Bobur» ham mos keladi, 3-shartsiz esa — «Ali, Bobur, Vasila».",
          "Farzandingiz javobini har bir shart boʻyicha alohida tekshirib chiqsa, juda yaxshi.",
        ],
      },
    },
    w3d2t7: {
      title: "Avtobus jadvali",
      body: [
        { text: "Bekatda shunday eʼlon ilingan 🚌:" },
        { text: "7-avtobus har 15 minutda qatnaydi. Birinchi avtobus soat 7:00 da keladi." },
        { text: "Qaysi gaplar rost, qaysilari yolgʻon?" },
      ],
      answer: {
        prompt: "Rostmi yoki yolgʻon?",
        items: {
          a: { label: "a) Avtobus soat 8:00 da keladi." },
          b: { label: "b) Avtobus soat 8:40 da keladi." },
          c: { label: "c) 7:30 dagi avtobusdan keyingisi 7:45 da keladi." },
          d: { label: "d) 7:00 dan 7:59 gacha toʻrtta avtobus keladi." },
          e: { label: "e) Soat 9:10 da avtobus bor." },
        },
        options: {
          true: { label: "Rost" },
          false: { label: "Yolgʻon" },
        },
      },
      followUps: ["{name} bekatga soat 8:40 da keldi. U avtobusni qancha kutadi?", "Bir soatda nechta avtobus keladi?"],
      hints: [
        "Eʼlonni yana bir oʻqi: birinchi avtobus soat nechada keladi va keyingilari necha minutdan keyin keladi?",
        "15 minut — bu chorak soat. 7:00 dan keyin avtobus 7:15 da keladi.",
        "Jadvalni tartib bilan yozib chiq: 7:00, 7:15, 7:30… 9:15 gacha.",
        "a) gapni tekshir: sening jadvalingda 8:00 bormi?",
        "Har bir gapni jadval bilan solishtir. Agar jadvalda bunday vaqt boʻlmasa — gap yolgʻon.",
      ],
      solution: {
        answer: "Rost: a), c), d). Yolgʻon: b), e).",
        explanation: [
          "Jadval: 7:00, 7:15, 7:30, 7:45, 8:00, 8:15, 8:30, 8:45, 9:00, 9:15…",
          "Jadvalda 8:40 ham, 9:10 ham yoʻq. 7:00 dan 7:59 gacha — toʻrtta avtobus: 7:00, 7:15, 7:30 va 7:45.",
        ],
        discuss: ["8:40 da kelgan kishi 5 minut kutadi — 8:45 dagi avtobusgacha. Bir soatda 4 ta avtobus keladi."],
      },
    },
    w3d2t8: {
      title: "Uchta orollik",
      body: [
        {
          text: "Orolda rostgoʻylar va yolgʻonchilar yashaydi. Rostgoʻylar doim rost gapiradi, yolgʻonchilar doim yolgʻon gapiradi.",
        },
        { text: "Sayyoh orolda uchta orollikni uchratdi — A, B va C. Ular shunday deyishdi:" },
        {
          visual: {
            items: [
              { name: "A", text: "B — yolgʻonchi" },
              { name: "B", text: "C — yolgʻonchi" },
              { name: "C", text: "A va B — ikkalasi ham yolgʻonchi" },
            ],
          },
        },
        { text: "Ulardan kim rostgoʻy, kim yolgʻonchi?" },
      ],
      answer: {
        prompt: "Bu kim?",
        items: {
          a: { label: "A" },
          b: { label: "B" },
          c: { label: "C" },
        },
        options: {
          knight: { label: "Rostgoʻy" },
          liar: { label: "Yolgʻonchi" },
        },
      },
      followUps: [
        "Javobingni tekshir: uchalasidan har biri oʻz gapini nega ayta olganini tushuntir.",
        "Orollik «Men yolgʻonchiman» deb ayta oladimi? Nega?",
      ],
      hints: [
        "Yana bir oʻqi: rostgoʻy faqat rost gapiradi, yolgʻonchi — faqat yolgʻon.",
        "Imkoniyatlar unchalik koʻp emas. A dan boshla: u yo rostgoʻy, yo yolgʻonchi.",
        "Ikki qatorli jadval chiz: «A — rostgoʻy» va «A — yolgʻonchi». Har bir qator uchun B va C unda kim boʻlishini aniqla.",
        "A — rostgoʻy deb faraz qil. Unda B — yolgʻonchi, demak, B ning gapi yolgʻon va C — rostgoʻy. Lekin C nima degan edi? Toʻgʻri keladimi?",
        "Faraz ziddiyatga olib keldimi — demak, ikkinchisi qoladi: A — yolgʻonchi. Unda hammasi toʻgʻri kelishini tekshirib koʻr.",
      ],
      solution: {
        answer: "A — yolgʻonchi, B — rostgoʻy, C — yolgʻonchi.",
        explanation: [
          "Faraz qilaylik, A — rostgoʻy. Unda B — yolgʻonchi, uning gapi yolgʻon, demak, C — rostgoʻy. Lekin C «A va B — ikkalasi ham yolgʻonchi» degan, A esa rostgoʻy. Rostgoʻy bunday xato qila olmaydi — ziddiyat.",
          "Demak, A — yolgʻonchi. Unda uning gapi yolgʻon: B — rostgoʻy. B rost gapiradi: C — yolgʻonchi. C ni tekshiramiz: «A va B — ikkalasi ham yolgʻonchi» — yolgʻon, chunki B rostgoʻy ✓.",
        ],
        discuss: [
          "Farzandingiz javobni har bir orollik uchun tekshirsa, juda yaxshi: «U shunday deya olarmidi?»",
          "Orolda hech kim «Men yolgʻonchiman» deya olmaydi: rostgoʻy bunda yolgʻon gapirgan, yolgʻonchi esa rost gapirgan boʻlardi.",
        ],
      },
    },
  },
  parent: {
    skills: [
      "«Va», «yoki», «emas» mantiqiy soʻzlari",
      "«Faraz qil va tekshir» usuli: ziddiyat izlash",
      "Barcha holatlarni tartib bilan koʻrib chiqish",
      "Rostgoʻylar va yolgʻonchilar haqidagi masalalar",
    ],
    observe: [
      "Farzandingiz barcha holatlarni tekshiradimi yoki birinchi mos kelganida toʻxtab qoladimi?",
      "Ziddiyatni oʻzi payqaydimi: «bunday boʻlishi mumkin emas, chunki…»?",
      "«Yoki» (kamida bittasi) bilan «va» (ikkalasi ham)ni farqlaydimi?",
    ],
    mistakes: [
      "Kundalik nutqda «yoki» koʻpincha «ikkitadan faqat bittasi» degan maʼnoda ishlatiladi. Matematikada esa ikkala variant ham toʻgʻri boʻlganda ham «yoki» bilan tuzilgan gap rost boʻladi — buni farzandingiz bilan alohida gaplashib oling.",
      "Rostgoʻylar va yolgʻonchilar haqidagi masalalar avvaliga chalkash tuyuladi. Ularni jadval va qalam bilan yechish — tabiiy hol.",
      "Chiroq haqidagi masalada bitta holatni tushirib qoldirish oson — tartib bilan koʻrib chiqish yordam beradi.",
    ],
    question:
      "Hech narsani tekshirib boʻlmasa, odam rost gapiryaptimi yoki yoʻqmi — buni qanday bilsa boʻladi? Savol berish mumkin boʻlsa-chi?",
  },
};
