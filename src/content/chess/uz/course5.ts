import type { Uz } from "../../localize";
import type { COURSE_5, COURSE_5_LESSONS, COURSE_5_MODULES } from "../course5";

export const course5Uz: Uz<typeof COURSE_5> = {
  title: "5-bosqich «Farzin»",
  subtitle: "Kombinatsiyalar va shohga hujum",
  about:
    "Hujumda bogʻlash va qoʻsh bogʻlash, qoʻsh shoh, qoʻsh zarba, mot toʻriga jalb qilish, Edvard Laskerning durdonasi, qisilgan mot, farzinni tutish, donalar hamkorligi, rokirovka qilmagan shohga hujum, f7 dagi qurbon, jim yurish, himoyadagi yagona yurish, Steynits va Rubinshteyn durdonalari. Darslar mavzusi va tartibi M.I. Glotovning «Shaxmat mahorati bosqichlari. 5-bosqich „Farzin“» kitobi asosida; pozitsiyalar maktab uchun tuzilgan va shaxmat dvigateli bilan tekshirilgan.",
};

export const course5ModulesUz: Uz<typeof COURSE_5_MODULES> = {
  "q-pin": { title: "Hujumda bogʻlash" },
  "q-double": { title: "Qoʻsh shoh va qoʻsh zarba" },
  "q-decoy": { title: "Jalb qilish" },
  "q-trap": { title: "«Farzinga mot»" },
  "q-attack": { title: "Shohga hujum" },
  "q-sacrifice": { title: "Odatiy qurbonlar" },
  "q-defence": { title: "Himoya" },
  "q-classics": { title: "Shaxmat klassikasi" },
  "finish-5": { title: "Bosqich marrasi" },
};

export const course5LessonsUz: Uz<typeof COURSE_5_LESSONS> = {
  "c5-pin-mate": {
    title: "Shohga hujumda bogʻlash",
    idea: "Bogʻlangan himoyachi ura olmaydi: u qoʻriqlayotgan katak boʻsh.",
    lesson: [
      {
        title: "Bogʻlab qoʻyilgan himoyachi",
        text: [
          "Beshinchi bosqichda bogʻlash hujum quroliga aylanadi. Avval **mot katagini kim himoya qilayotganini** qara — keyin bu himoyachi bogʻlanmaganmi, tekshir.",
          "Bogʻlangan dona katakni faqat «qogʻozda» qoʻriqlaydi: u ura olmaydi, aks holda oʻz shohini ochib qoʻyadi.",
        ],
      },
    ],
    terms: [{ term: "Bogʻlangan himoyachi", text: "Ortida chiziq boʻylab shoh turgani uchun ura olmaydigan dona." }],
    exercises: {
      "c5-pin-mate-h7": {
        title: "Ot yordam bera olmaydi",
        prompt: "Oqlar yuradi. Mot qil.",
        hint: "f8 dagi ot h7 ni himoya qiladi, lekin u a8 dagi rux bilan bogʻlangan.",
        why: "♕xh7# — f8 dagi ot farzinni urishi mumkin edi, lekin u a8 dagi rux bilan shohga bogʻlangan. Farzinni d3 dagi fil himoya qiladi.",
      },
    },
  },
  "c5-double-pin": {
    title: "Qoʻsh bogʻlash",
    idea: "Raqibning ikki donasi bir vaqtda bogʻlangan — ikkalasi ham qimirlay olmaydi.",
    lesson: [
      {
        title: "Ikki bogʻlash",
        text: [
          "**Qoʻsh bogʻlash** — raqibning ikki donasi bir vaqtda bogʻlanganda. Bitta bogʻlash himoyaga xalaqit beradi, ikkitasi esa koʻpincha partiyani hal qiladi.",
          "Shohga olib boradigan chiziqlarni qidir: vertikal, gorizontal va diagonallar. Ularning har birida bogʻlash mumkin boʻlgan dona turgan boʻlishi mumkin.",
        ],
      },
    ],
    terms: [{ term: "Qoʻsh bogʻlash", text: "Raqibning ikki donasi bir vaqtda bogʻlangan." }],
    exercises: {
      "c5-double-pin-rook": {
        title: "Ikkinchi bogʻlash",
        prompt: "Oqlar yuradi. d7 dagi ot allaqachon bogʻlangan. Yana bitta donani bogʻla.",
        hint: "e6 dagi fil shoh bilan bitta vertikalda turibdi.",
        why: "♖e1 — endi d7 dagi ot ham (b5 dagi fil bilan), e6 dagi fil ham (rux bilan) bogʻlangan. Qoʻsh bogʻlash: qoralarga himoyalanish qiyin.",
      },
    },
  },
  "c5-reti": {
    title: "Qoʻsh shoh: Reti — Tartakover",
    idea: "Qoʻsh shoh va mot uchun farzin qurbonligi.",
    lesson: [
      {
        title: "Mashhur miniatyura",
        text: [
          "1910 yili Venada Rixard Reti Savely Tartakover bilan barcha darsliklarga kirgan qisqa partiya oʻynagan. Qora shoh markazda qolib ketgan, oqlar esa allaqachon uzun rokirovka qilgan edi.",
          "**Qoʻsh shoh** — eng kuchli shoh: undan toʻsib ham, ikkala donani urib ham boʻlmaydi, shohga faqat qochish qoladi.",
        ],
      },
    ],
    terms: [{ term: "Qoʻsh shoh", text: "Ikki dona bilan bir vaqtda shoh; faqat shoh yurishi qutqaradi." }],
    exercises: {
      "c5-reti-choose": {
        title: "Farzin qurbonligi",
        prompt: "Reti (oqlar) yuradi va 3 yurishda mot qiladi. Birinchi yurish qaysi?",
        hint: "Farzin shoh berib oʻzini qurbon qiladi, keyin fil va rux bilan qoʻsh shoh.",
        why: "9. ♕d8+!! ♚xd8 10. ♗g5+ — qoʻsh shoh: fil va d1 dagi rux bilan. 10... ♚c7 ga 11. ♗d8# javob boʻladi, 10... ♚e8 ga — 11. ♖d8#. ♕xe4? dan keyin ♛xe4 — oqlar shunchaki farzinni yoʻqotadi.",
      },
    },
  },
  "c5-fork": {
    title: "Qoʻsh zarba",
    idea: "Farzin bir vaqtda ikki nishonga hujum qiladi — raqib ulardan birini yoʻqotadi.",
    lesson: [
      {
        title: "Farzin — vilka ustasi",
        text: [
          "Farzin hamma tomonga yuradi, shuning uchun **qoʻsh zarbani** hammadan yaxshi qiladi. Ayniqsa nishonlardan biri shoh boʻlsa kuchli: shohdan himoyalanish kerak, ikkinchi dona esa yoʻqoladi.",
        ],
      },
    ],
    terms: [{ term: "Qoʻsh zarba", text: "Bir vaqtda ikki nishonga hujum." }],
    exercises: {
      "c5-fork-queen": {
        title: "Shoh va rux",
        prompt: "Oqlar yuradi. Qoʻsh zarbani top.",
        hint: "Farzin shohga shoh beradigan va a8 dagi ruxga hujum qiladigan katakni top.",
        why: "♕d5+ — g8 dagi shohga shoh va a8 dagi ruxga hujum. Shoh qochadi, farzin esa ruxni oladi.",
      },
    },
  },
  "c5-decoy-net": {
    title: "Mot toʻriga jalb qilish",
    idea: "Shoh berib qilingan qurbon shohni mot kutayotgan katakka haydaydi.",
    lesson: [
      {
        title: "Shoh tuzoqqa boradi",
        text: [
          "Baʼzan shohni xavfsiz joyga ketishiga yoʻl qoʻyib boʻlmaydi. Shoh berib qilingan qurbon uni kerakli katakka **jalb qiladi** — va keyingi yurishda mot.",
        ],
      },
    ],
    terms: [{ term: "Mot toʻri", text: "Shohning motdan qochadigan joyi qolmagan holat." }],
    exercises: {
      "c5-decoy-net-choose": {
        title: "Fil-oʻlja",
        prompt: "Oqlar yuradi va 2 yurishda mot qiladi. Birinchi yurish qaysi?",
        hint: "Fil bilan shoh shohni burchakka haydaydi.",
        why: "♗xh7+! — filni urib boʻlmaydi (uni c2 dagi farzin himoya qiladi), shoh h8 ga ketadi. Endi ♖xf8#: g8 katagini h7 dagi fil ushlab turibdi. ♖xf8+? dan keyin ♚xf8 — shoh qutuladi.",
      },
    },
  },
  "c5-lasker": {
    title: "Edvard Laskerning durdonasi",
    idea: "Farzin qurbonligi — va butun taxta boʻylab shohni ovlash.",
    lesson: [
      {
        title: "London, 1912",
        text: [
          "1912 yili Londonda Edvard Lasker Jorj Tomas bilan oʻynagan. Oqlar h7 da farzinni qurbon qilib, qora shohni shohlar bilan butun taxta boʻylab g1 gacha haydab borgan va u yerda mot qilgan.",
          "Bu shaxmat tarixidagi eng mashhur «shoh ovi»laridan biri.",
        ],
      },
    ],
    terms: [{ term: "Shoh ovi", text: "Shohni shohlar bilan panohdan haydab chiqaradigan hujum." }],
    exercises: {
      "c5-lasker-choose": {
        title: "Ov boshlanishi",
        prompt: "E. Lasker (oqlar) yuradi. Shoh ovini qanday boshlash kerak?",
        hint: "Eng jasur shoh — farzin bilan h7 da.",
        why: "11. ♕xh7+!! ♚xh7 12. ♘xf6+ (qoʻsh shoh) ♚h6 13. ♘eg4+ ♚g5 14. h4+ ♚f4 15. g3+ ♚f3 16. ♗e2+ ♚g2 17. ♖h2+ ♚g1 18. ♔d2# — shoh butun taxtani bosib oʻtdi. ♘xf6+? dan keyin qoralar shunchaki otni urib oladi va shoh panohda qoladi.",
      },
    },
  },
  "c5-smothered": {
    title: "Qisilgan mot: toʻliq rasm",
    idea: "Ot shoh beradi, farzin oʻzini qurbon qiladi, rux shohni qamaydi — ot bilan mot.",
    lesson: [
      {
        title: "Filidor moti",
        text: [
          "Qisilgan motning toʻliq rasmi: ot shoh beradi (♘f7+), shoh g8 ga ketadi, qoʻsh shoh (♘h6+) uni burchakka qaytaradi, farzin g8 da oʻzini qurbon qiladi — rux uni urib, shohni qamab qoʻyadi va ♘f7#.",
          "Bu usulni fransuz shaxmatchisi Fransua Andre Filidor hali XVIII asrda tasvirlab bergan.",
        ],
      },
    ],
    terms: [{ term: "Qisilgan mot", text: "Oʻz donalari qamab qoʻygan shohga ot bilan qilingan mot." }],
    exercises: {
      "c5-smothered-choose": {
        title: "4 yurishda mot",
        prompt: "Oqlar yuradi va 4 yurishda mot qiladi. Birinchi yurish qaysi?",
        hint: "Ot bilan shoh berishdan boshla.",
        why: "♘f7+ ♚g8 ♘h6+ (qoʻsh shoh) ♚h8 ♕g8+! ♜xg8 ♘f7# — qisilgan mot. Agar ♘h6+ dan keyin shoh f8 ga ketsa, ♕f7#. ♕g8+? dan keyin darhol ♚xg8: farzin himoyalanmagan.",
      },
    },
  },
  "c5-queen-trap": {
    title: "«Farzinga mot»: farzinni tutish",
    idea: "Piyoda ortidan burchakka kirib qolgan farzin tuzoqqa tushishi mumkin.",
    lesson: [
      {
        title: "Ochkoʻz farzin",
        text: [
          "Shaxmatchilar farzinni tutishni hazil qilib «farzinga mot» deyishadi: farzinga hujum qilingan, chekinadigan kataklarning hammasi esa band yoki zarba ostida.",
          "Koʻpincha piyoda yoki rux ortidan burchakka kirib qolgan farzin tuzoqqa tushadi. Tutishdan oldin u keta oladigan **har bir** katakni tekshir.",
        ],
      },
    ],
    terms: [{ term: "«Farzinga mot»", text: "Farzinga hujum qilingan va uning yashirinadigan joyi yoʻq." }],
    exercises: {
      "c5-queen-trap-choose": {
        title: "Burchakdagi farzin",
        prompt: "Qora farzin a1 dagi ruxni urib oldi. Oqlar yuradi. Farzinni qanday tutish mumkin?",
        hint: "Farzinga katta diagonalni yopadigan qilib hujum qil.",
        why: "♗c3! — farzinga hujum qilindi va qutulish yoʻq: ♛xa2 ♗xa2, ♛b2+ ♗xb2, ♛xc3+ dxc3, ♛xb1+ ♔xb1. ♗b4? dan keyin farzin diagonal boʻylab qochadi: ♛d4.",
      },
    },
  },
  "c5-cooperation": {
    title: "Hujumda donalar hamkorligi",
    idea: "Farzin hujum qiladi, boshqa dona uni qoʻllab-quvvatlaydi — birgalikda mot qilishadi.",
    lesson: [
      {
        title: "Yolgʻiz otliq jangchi emas",
        text: [
          "Hujumning asosiy tamoyili: **shohga bir vaqtda bir nechta dona hujum qiladi**. Farzin kuchli, lekin yolgʻiz oʻzi odatda mot qila olmaydi — fil, ot yoki ruxning yordami kerak.",
          "Hujumdan oldin sana: shoh yonidagi katakni sening nechta donang uradi va raqibning nechta donasi uni himoya qiladi.",
        ],
      },
    ],
    terms: [
      {
        term: "Donalar hamkorligi",
        text: "Donalar bir-biriga yordam beradi va birgalikda bitta nishonga hujum qiladi.",
      },
    ],
    exercises: {
      "c5-cooperation-bishop": {
        title: "Farzin va fil",
        prompt: "Oqlar yuradi. Mot qil.",
        hint: "c3 dagi fil g7 ga qarab turibdi.",
        why: "♕xg7# — farzinni c3 dagi fil katta diagonal boʻylab qoʻllab-quvvatlaydi va shoh uni ura olmaydi.",
      },
      "c5-cooperation-knight": {
        title: "Farzin va ot",
        prompt: "Oqlar yuradi. Mot qil.",
        hint: "h5 dagi ot g7 katagini himoya qiladi.",
        why: "♕g7# — farzinni h5 dagi ot himoya qiladi, f8 dagi rux va piyodalar esa shohni qochirmaydi.",
      },
    },
  },
  "c5-uncastled": {
    title: "Rokirovka qilmagan shohga hujum",
    idea: "Shoh markazda — ochiq chiziqlar toʻgʻri unga olib boradi.",
    lesson: [
      {
        title: "Rokirovkani unutma",
        text: [
          "Markazda qolib ketgan shoh — oson oʻlja: e vertikali tez ochiladi va ruxlar hamda farzin toʻgʻridan-toʻgʻri unga uradi.",
          "Bunday shohga hujum qilganda chiziqlarni och va uni qanotga qochirma.",
        ],
      },
    ],
    terms: [{ term: "Rokirovka qilmagan shoh", text: "Markazda qolgan va rokirovka bilan yashirinmagan shoh." }],
    exercises: {
      "c5-uncastled-choose": {
        title: "e vertikali boʻylab rux",
        prompt: "Oqlar yuradi va 2 yurishda mot qiladi. Birinchi yurish qaysi?",
        hint: "e vertikali boʻylab shoh. Shunda shoh qayerga boradi?",
        why: "♖e4+! — shoh f8 ga bora olmaydi (bu katakni b4 dagi farzin uradi), faqat ♚d8 qoladi. Keyin ♕b8#: farzin c7 va c8 ni, rux — e7 va e8 ni ushlab turadi. ♕e7+? dan keyin ♚xe7 — farzin yoʻqoladi.",
      },
    },
  },
  "c5-f7-sac": {
    title: "f7 dagi odatiy qurbon",
    idea: "f7 piyodasini faqat shoh himoya qiladi — unga zarba koʻpincha partiyani hal qiladi.",
    lesson: [
      {
        title: "Zaif joy — f7",
        text: [
          "Rokirovkadan keyin f7 piyodasini (oqlarda — f2) koʻpincha faqat shoh himoya qiladi. Agar unga ikki dona zarba bersa, f7 dagi qurbon shohni ochib beradi.",
          "Tekshir: f7 dagi donani kim qoʻllab-quvvatlaydi va urishdan keyin shoh qayerga boradi?",
        ],
      },
    ],
    terms: [{ term: "f7 punkti", text: "Partiya boshida faqat shoh himoya qiladigan piyoda." }],
    exercises: {
      "c5-f7-sac-rook": {
        title: "Farzin f7 ni oladi",
        prompt: "Oqlar yuradi va 2 yurishda mot qiladi. Birinchi yurish qaysi?",
        hint: "f7 dagi farzinni e7 dagi rux qoʻllab-quvvatlaydi.",
        why: "♕xf7+! — urib boʻlmaydi: farzinni e7 dagi rux himoya qiladi. Shoh h8 yoki h7 ga ketadi va ♕xg7#. ♖xf7? dan keyin ♚h8 — 2 yurishda mot yoʻq.",
      },
      "c5-f7-sac-bishop": {
        title: "Fil yordam beradi",
        prompt: "Oqlar yuradi va 2 yurishda mot qiladi. Birinchi yurish qaysi?",
        hint: "c4 dagi fil f7 ga qarab turibdi.",
        why: "♕xf7+! — farzinni c4 dagi fil himoya qiladi, shoh h8 ga ketadi va ♕f8# (yoki ♕g8#). ♖xg6+? dan keyin 2 yurishda mot yoʻq.",
      },
    },
  },
  "c5-quiet": {
    title: "Jim yurish",
    idea: "Shohsiz va urishsiz yurish, undan keyin raqib himoyalana olmaydi.",
    lesson: [
      {
        title: "Shohdan kuchliroq",
        text: [
          "Har doim ham shoh berish shart emas. Baʼzan **jim yurish** kuchliroq: dona shunday turadiki, bir vaqtda bir nechta mot bilan tahdid qiladi va raqib barcha teshiklarni yopishga ulgurmaydi.",
        ],
      },
    ],
    terms: [{ term: "Jim yurish", text: "Qaytarib boʻlmaydigan tahdid yaratadigan, shohsiz va urishsiz yurish." }],
    exercises: {
      "c5-quiet-choose": {
        title: "Farzin f7 da",
        prompt: "Oqlar yuradi va 2 yurishda mot qiladi. Birinchi yurish qaysi?",
        hint: "Farzinni shunday qoʻyki, u ham g7 da, ham oxirgi gorizontalda mot bilan tahdid qilsin.",
        why: "♕f7! — jim yurish. ♕xg7# (a1 dagi fil qoʻllab-quvvatlaydi) va ♕f8# yoki ♕e8# bilan tahdid qiladi. Qoralar bitta yurish bilan hamma tahdiddan himoyalana olmaydi. ♕g8+? dan keyin ♚xg8 — farzin yoʻqoladi.",
      },
    },
  },
  "c5-only-move": {
    title: "Yagona yurish",
    idea: "Mot xavfi tugʻilganda barcha himoyalarni top va har birini oxirigacha tekshir: baʼzan faqat bitta yurish qutqaradi.",
    lesson: [
      {
        title: "Avval — raqibning tahdidi",
        text: [
          "Kuchli shaxmatchi faqat hujum qilishni emas, himoyalanishni ham biladi. Oʻz yurishidan oldin u soʻraydi: **agar men yurishni oʻtkazib yuborsam, raqib nima qiladi?** Javob «mot» boʻlsa, qolgan hamma rejalar kutib turadi.",
          "Motdan toʻrt xil himoya bor: shoh bilan **ketish**, **toʻsish**, hujum qilayotgan donani **urib olish**, mot qilinadigan katakni **himoya qilish**. Hammasini top — keyin tanla.",
        ],
      },
      {
        title: "Himoyani oxirigacha tekshir",
        text: [
          "Birinchi tahdidni qaytargan yurish ikki-uch yurishdan keyin yutqazishi mumkin. Shuning uchun har bir himoyani tekshir: undan keyin raqibda qanday shohlar bor?",
          "Agar bittasidan boshqa hamma himoyalar motga olib kelsa, oʻsha bittasi **yagona yurish** deyiladi. Uni topish — kombinatsiya topish kabi mahorat.",
        ],
      },
    ],
    terms: [
      {
        term: "Yagona yurish",
        text: "Usiz partiya darhol yutqaziladigan yurish: qolgan hammasi motga yoki katta yoʻqotishga olib keladi.",
      },
    ],
    exercises: {
      "c5-only-move-queen": {
        title: "Shoh! Nima qilish kerak?",
        prompt: "Oqlarga shoh berilgan. Motdan faqat bitta yurish qutqaradi. Qaysi biri?",
        hint: "Shoh bilan burchakka ketsangmi? Qisilgan motni esla. Farzinlar almashib ketishi uchun nima bilan toʻsish mumkin?",
        why: "♕d4! — yagona yurish: ♛xd4+ cxd4 dan keyin farzinlar yoʻq va hujum tugadi. ♔f1? ♛f2#. ♔h1? ♞f2+ ♔g1 ♞h3+ (qoʻsh shoh) ♔h1 ♛g1+! — urib olingach ♞f2#, qisilgan mot. ♖e3? ♛xe3+ ♔h1 ♞f2+ ♔g1 ♞h3+ ♔h1 ♛g1+ ♕xg1 ♞f2#.",
      },
      "c5-only-move-rook": {
        title: "Urib olishmi yoki toʻsish?",
        prompt:
          "Oqlarga d1 dagi ruxdan shoh berilgan, uning ortida ikkinchi rux turibdi. Qaysi yurish motdan qutqaradi?",
        hint: "Toʻssang, donangni shoh berib urib olishadi. Birinchi gorizontalda nechta qora rux bor?",
        why: "♖xd1! — rux shoh berayotgan donani urib oladi, ♜xd1+ dan keyin esa toʻsish mumkin: ♖e1 yoki ♕g1. ♖e1? ♜xe1+ ♕xe1 ♜xe1#. ♕g1? ♜xg1#. Chiziqda ikkita rux turganda toʻsish foydasiz: avval bittasini urib olish kerak.",
      },
      "c5-only-move-quiz": {
        title: "Himoya qanday qidiriladi",
        prompt: "Savollarga javob ber.",
        questions: [
          {
            text: "Raqib bir yurishda mot qilmoqchi. Nimadan boshlash kerak?",
            options: ["barcha himoyalarni topib, har birini tekshirish", "oldindan oʻylab qoʻyilgan yurishni qilish"],
          },
          {
            text: "Shunday yurish topdingki, undan keyin bir yurishda mot yoʻq. Keyin nima qilasan?",
            options: ["shu yurishdan keyin raqibning shohlarini koʻrib chiqaman", "darhol yuraman"],
          },
          {
            text: "Shohing bilan bir chiziqda raqibning ikkita ruxi turibdi, oldingisi shoh beryapti. Qaysi biri ishonchliroq?",
            options: ["iloji boʻlsa, ruxni urib olish", "farzin bilan toʻsish"],
          },
        ],
        hint: "Yagona yurish saralash bilan topiladi: barcha himoyalar, har biri — oxirigacha.",
        why: "Himoya ham hujum kabi diqqat bilan qidiriladi: barcha nomzod yurishlar, har biri oxirigacha tekshiriladi.",
      },
    },
  },
  "c5-steinitz": {
    title: "Steynits durdonasi",
    idea: "Rux oʻzini qurbon qilib, toʻxtovsiz shoh beradi — uni urib boʻlmaydi.",
    lesson: [
      {
        title: "Gastings, 1895",
        text: [
          "Vilgelm Steynits — birinchi rasmiy jahon chempioni. 1895 yili Gastingsda u Kurt fon Bardeleben bilan tarixdagi eng chiroyli partiyalardan biri deb ataladigan partiyani oʻynagan.",
          "Oq rux shoh berib e7 ga bordi va shoh berishda davom etdi: f7, g7, h7. Agar shoh ruxni urib olsa, g4 dagi oq farzin d7 dagi farzinni shoh berib urib oladi.",
        ],
      },
    ],
    terms: [{ term: "Qutirgan rux", text: "Rux toʻxtovsiz shoh beradi va uni urish foydasiz." }],
    exercises: {
      "c5-steinitz-choose": {
        title: "Rux e7 ga boradi",
        prompt: "Steynits (oqlar) yuradi. Mashhur kombinatsiya qaysi yurishdan boshlangan?",
        hint: "e1 dagi rux e7 dagi otga, g4 dagi farzin esa d7 dagi farzinga qarab turibdi.",
        why: "22. ♖xe7+! ♚f8 23. ♖f7+ ♚g8 24. ♖g7+ ♚h8 25. ♖xh7+ — rux toʻxtovsiz shoh beradi. Bardeleben turnir zalidan chiqib ketdi, Steynits esa tomoshabinlarga motni koʻrsatdi: 25... ♚g8 26. ♖g7+ ♚h8 27. ♕h4+ ♚xg7 28. ♕h7+ ♚f8 29. ♕h8+ ♚e7 30. ♕g7+ ♚e8 31. ♕g8+ ♚e7 32. ♕f7+ ♚d8 33. ♕f8+ ♛e8 34. ♘f7+ ♚d7 35. ♕d6#. ♕xd7+? dan keyin ♚xd7 — farzinlar almashildi va hujum tugadi.",
      },
    },
  },
  "c5-rubinstein": {
    title: "Rubinshteyn durdonasi",
    idea: "Rux qurbonligi fillarga shoh tomon yoʻl ochadi.",
    lesson: [
      {
        title: "Lodz, 1907",
        text: [
          "Akiba Rubinshteyn qora donalar bilan Georg Rotlevi bilan oʻynagan. b6 va b7 dagi qora fillar allaqachon oq shohga qarab turgan edi — ularga faqat c3 dagi ot va e4 dagi fil xalaqit berardi.",
          "Rubinshteyn bu diagonallarni ochish uchun farzin va ikki ruxni qurbon qildi. Bu partiya «Rubinshteynning oʻlmas partiyasi» deb ataladi.",
        ],
      },
    ],
    terms: [{ term: "Diagonal hujum", text: "Fillar uzoqdan rokirovkaga uradi." }],
    exercises: {
      "c5-rubinstein-choose": {
        title: "Rux c3 da",
        prompt: "Rubinshteyn (qoralar) yuradi. h4 dagi farzin zarba ostida. Hujumni qanday davom ettirish kerak?",
        hint: "c3 dagi otni yoʻqot — u b7 dagi filning diagonalini toʻsib turibdi.",
        why: "22... ♜xc3!! 23. gxh4 ♜d2!! 24. ♕xd2 ♝xe4+ 25. ♕g2 ♜h3 — oqlar taslim boʻldi: ularning deyarli har qanday yurishiga qoralarda bir yurishda mot bor. ♜d2? dan keyin ♕xd2 — rux shunchaki yoʻqoladi.",
      },
    },
  },
  "c5-final-test": {
    title: "«Farzin» bosqichining yakuniy testi",
    idea: "Oʻzingni sinab koʻr: qurbon, jalb qilish, qisilgan mot va shohga hujum.",
    lesson: [
      {
        title: "Test oldidan",
        text: [
          "Beshinchi bosqich ortda qoldi — kombinatsiyalar va shohga hujum. Har bir masalada shohlar, urishlar va tahdidlarni qidir va oʻzingdan soʻra: raqibning qaysi donasi mot katagini himoya qilyapti va uni qanday yoʻqotish mumkin?",
        ],
      },
    ],
    terms: [{ term: "«Farzin» bosqichi", text: "Kursning beshinchi bosqichi: kombinatsiyalar va shohga hujum." }],
    exercises: {
      "c5-final-smothered": {
        title: "1-masala",
        prompt: "Oqlar yuradi. Mot qil.",
        hint: "Shohni oʻz donalari qamab qoʻygan.",
        why: "♘f7# — qisilgan mot: g8 dagi rux va g7, h7 piyodalari shohni qochirmaydi.",
      },
      "c5-final-rook": {
        title: "2-masala",
        prompt: "Oqlar yuradi va 2 yurishda mot qiladi. Birinchi yurish qaysi?",
        hint: "Sakkizinchi gorizontal boʻylab shoh.",
        why: "♖c8+! — faqat rux bilan toʻsish mumkin: ♜f8. Keyin ♖xf8#. ♕xg7+? dan keyin ♜xg7 — mot yoʻq.",
      },
      "c5-final-queen": {
        title: "3-masala",
        prompt: "Oqlar yuradi va 2 yurishda mot qiladi. Birinchi yurish qaysi?",
        hint: "Shoh markazda qolib ketgan. Sakkizinchi gorizontal boʻylab shoh.",
        why: "♕h8+! — faqat ot bilan toʻsish mumkin: ♞g8. Keyin ♕xg8# — markazdagi shoh yashirinishga ulgurmadi. ♖xf6? dan keyin ♚d8 — shoh qochadi.",
      },
      "c5-final-quiz": {
        title: "4-masala: savollar",
        prompt: "Bosqich boʻyicha savollarga javob ber.",
        questions: [
          {
            text: "Oʻz donalari qamab qoʻygan shohga ot bilan qilingan mot qanday ataladi?",
            options: ["qisilgan mot", "chiziqli mot", "Legal moti"],
          },
          {
            text: "Jalb qilish nima?",
            options: [
              "raqib donasini yomon katakka chorlaydigan qurbon",
              "farzinlarni almashish",
              "shohni burchakka yurish",
            ],
          },
          {
            text: "Shaxmat boʻyicha birinchi rasmiy jahon chempioni kim boʻlgan?",
            options: ["Vilgelm Steynits", "Pol Morfi", "Akiba Rubinshteyn"],
          },
        ],
        hint: "Qisilgan mot, jalb qilish va Steynits durdonasi haqidagi darslarni esla.",
        why: "Qisilgan motni shohni oʻz donalari qamab qoʻyganda ot qiladi. Jalb qilish — raqib donasini yomon katakka chorlaydigan qurbon. Birinchi rasmiy jahon chempioni Vilgelm Steynits boʻlgan (1886).",
      },
    },
  },
};
