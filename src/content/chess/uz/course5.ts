import type { Uz } from "../../localize";
import type { COURSE_5, COURSE_5_LESSONS, COURSE_5_MODULES } from "../course5";

export const course5Uz: Uz<typeof COURSE_5> = {
  title: "5-bosqich «Farzin»",
  subtitle: "Kombinatsiyalar va shohga hujum",
  about:
    "Hujumda bogʻlash va qoʻsh bogʻlash, qoʻsh shoh, qoʻsh zarba, mot toʻriga jalb qilish, Edvard Laskerning durdonasi, qisilgan mot, farzinni tutish, donalar hamkorligi, rokirovka qilmagan shohga hujum, f7 dagi qurbon va jim yurish. Darslar mavzusi va tartibi M.I. Glotovning «Shaxmat mahorati bosqichlari. 5-bosqich „Farzin“» kitobi asosida; pozitsiyalar maktab uchun tuzilgan va shaxmat dvigateli bilan tekshirilgan.",
};

export const course5ModulesUz: Uz<typeof COURSE_5_MODULES> = {
  "q-pin": { title: "Hujumda bogʻlash" },
  "q-double": { title: "Qoʻsh shoh va qoʻsh zarba" },
  "q-decoy": { title: "Jalb qilish" },
  "q-trap": { title: "«Farzinga mot»" },
  "q-attack": { title: "Shohga hujum" },
  "q-sacrifice": { title: "Odatiy qurbonlar" },
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
};
