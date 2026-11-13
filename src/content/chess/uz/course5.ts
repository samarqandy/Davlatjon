import type { Uz } from "../../localize";
import type { COURSE_5, COURSE_5_LESSONS, COURSE_5_MODULES } from "../course5";

export const course5Uz: Uz<typeof COURSE_5> = {
  title: "5-bosqich «Farzin»",
  subtitle: "Kombinatsiyalar va shohga hujum",
  about:
    "Hujumda bogʻlash va qoʻsh bogʻlash, bogʻlamdan chiqish va Legal gʻoyasi, qoʻsh shoh, tegirmon, qoʻsh zarba, chalgʻitish va toʻsish, mot toʻriga jalb qilish, Edvard Laskerning durdonasi, qisilgan mot, farzinni tutish, oraliq yurish, chiziqni boʻshatish va ochish, oxirgi gorizontalning zaifligi, mix-piyoda, punktni egallash, h7, h6 va f6 dagi qurbonlar, ikki fil qurboni, hujumning bosh tamoyili, piyodalar hujumi, zaif kataklar, yomon pozitsiyada qutulish, Morfi, Fisher, Greko va Tal partiyalari, donalar hamkorligi, rokirovka qilmagan shohga hujum, f7 dagi qurbon, jim yurish, himoyadagi yagona yurish, Steynits va Rubinshteyn durdonalari. Darslar mavzusi va tartibi M.I. Glotovning «Shaxmat mahorati bosqichlari. 5-bosqich „Farzin“» kitobi asosida; pozitsiyalar maktab uchun tuzilgan va shaxmat dvigateli bilan tekshirilgan.",
};

export const course5ModulesUz: Uz<typeof COURSE_5_MODULES> = {
  "q-pin": { title: "Hujumda bogʻlash" },
  "q-double": { title: "Qoʻsh shoh va qoʻsh zarba" },
  "q-deflect": { title: "Chalgʻitish va toʻsish" },
  "q-decoy": { title: "Jalb qilish" },
  "q-trap": { title: "«Farzinga mot»" },
  "q-between": { title: "Oraliq yurish" },
  "q-lines": { title: "Chiziqlar va oxirgi gorizontal" },
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
  "c5-pin-exchange": {
    title: "Bogʻlangan donada almashuv",
    idea: "Bogʻlangan dona uriladi, uning oʻrniga yangisi keladi — u ham bogʻlangan.",
    lesson: [
      {
        title: "Bogʻlamga zarba ber",
        text: [
          "Bogʻlangan dona keta olmaydi. Demak, unga yana va yana hujum qilish mumkin — himoyachilar hujumchilardan kam boʻlib qolguncha.",
          "Kuchli usul — **bogʻlash katagida almashuv**: bogʻlangan donani uramiz, uni javoban olishadi, lekin olgan donaning oʻzi bogʻlamga tushadi. Endi yana bir hujumchi olib kelamiz — va uni yutamiz. Morfi Parij operasidagi partiyada shunday gʻalaba qilgan.",
        ],
      },
    ],
    terms: [
      {
        term: "Bogʻlash katagida almashuv",
        text: "Bogʻlangan donani urish: undan keyin javoban olgan dona bogʻlamga tushadi.",
      },
    ],
    exercises: {
      "c5-pin-exchange-rook": {
        title: "Ot evaziga rux",
        prompt: "d7 dagi ot fil bilan bogʻlangan. Qanday oʻynash yaxshiroq?",
        hint: "d7 dagi almashuvdan keyin u yerda rux turadi — u ham bogʻlangan. Unga yana nima bilan hujum qilish mumkin?",
        why: "♖xd7! ♜xd7, ♖d1 — d7 dagi rux bogʻlangan va unga ikki marta hujum qilinyapti, himoyachisi esa faqat shoh: oqlar uni oladi va ortiqcha filli boʻlib qoladi. ♗xd7+ ♜xd7, ♖xd7 ♚xd7 dan keyin hammasi teng almashgan.",
      },
    },
  },
  "c5-morphy-pin": {
    title: "Morfi: bogʻlash ishda",
    idea: "Bogʻlangan dona — nishon: Morfi unga ikki marta hujum qilib, partiyani yutdi.",
    lesson: [
      {
        title: "Nyu-York, 1857",
        text: [
          "1857-yilda Pol Morfi Jon Shultenga qarshi qoralar bilan oʻynadi. Oq shoh rokirovka qilishga ulgurmadi, e2 dagi fil esa bogʻlamga tushdi: uning ortida diagonalda d1 dagi farzin turibdi.",
          "Morfi shu fil uchun ruxini berdi: 13... ♜xe2! e2 ga ot keldi — u ham bogʻlamga tushdi. Shu zahoti ot d4 ga sakradi: bogʻlangan donaga ikki marta hujum. Oqlar uni yoʻqotdi, shoh esa mot hujumi ostida qoldi.",
        ],
      },
    ],
    terms: [{ term: "Bogʻlangan donaga bosim", text: "Bogʻlangan donaga qayta-qayta hujum qilinadi: u keta olmaydi." }],
    exercises: {
      "c5-morphy-pin-rook": {
        title: "Fil evaziga rux",
        prompt: "Morfi (qoralar) yuradi. U qanday oʻynagan?",
        hint: "e2 dagi fil bogʻlangan. Uni urishsa, oʻrniga kim turadi?",
        why: "13... ♜xe2! 14. ♘xe2 ♞d4 — e2 da endi ot, u g4 dagi fil orqali farzin bilan bogʻlangan. Darhol 13... ♞d4 ni Morfi oʻynamagan: e2 dagi filni uchta dona himoya qilib turibdi.",
      },
      "c5-morphy-pin-knight": {
        title: "Ikkinchi zarba",
        prompt: "Morfi (qoralar) yuradi. Bosimni qanday kuchaytirish mumkin?",
        hint: "e2 dagi ot bogʻlangan. Unga yana bir marta hujum qil.",
        why: "14... ♞d4! — e2 dagi ot bogʻlangan va unga ikki marta hujum qilinyapti: g4 dagi fil va d4 dagi ot. Partiyada 15. ♕b1 ♝xe2+ boʻlgan — qoralar dona yutib, mot hujumini boshladi. 14... ♝xe2+ 15. ♕xe2 dan keyin bogʻlam yoʻqoladi.",
      },
      "c5-morphy-pin-mate": {
        title: "Partiya yakuni",
        prompt: "Qoralar yuradi. Morfi kabi mot qil.",
        hint: "Oq shoh g5 gacha kelib qoldi. Qaysi shoh undan hamma kataklarni tortib oladi?",
        why: "23... ♛h5# — shoh f1 dan g5 gacha yoʻl bosib, mot boʻldi.",
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
  "c5-unpin": {
    title: "Bogʻlamdan chiqish",
    idea: "Bogʻlangan dona shoh berib ketsa, oʻzi ozod boʻladi.",
    lesson: [
      {
        title: "Shoh berib ketish",
        text: [
          "Bogʻlash abadiy emas. **Bogʻlamdan chiqish**ning bir necha yoʻli bor: chiziqni boshqa dona bilan toʻsish, bogʻlagan donani haydash yoki urib olish, shohni yoki farzinni zarba ostidan olib ketish.",
          "Eng kuchli yoʻl — bogʻlangan dona bilan **shoh berib** ketish. Raqib shohini qutqarishi kerak, bogʻlam ortida turgan donani urishga esa ulgurmaydi.",
        ],
      },
    ],
    terms: [{ term: "Bogʻlamdan chiqish", text: "Donani bogʻlashdan ozod qilish." }],
    exercises: {
      "c5-unpin-check": {
        title: "Bogʻlangan ot",
        prompt: "d4 dagi ot bogʻlangan: ortida farzin. Qanday oʻynash yaxshiroq?",
        hint: "Ot bilan shoh beradigan yurishni top va ot yana kimga hujum qilayotganiga qara.",
        why: "♘e6+! — shoh va d8 dagi ruxga hujum. Qoralar shohni olib ketishi kerak, farzinni urishga ulgurmaydi, ot esa ruxni oladi. ♘f3? dan keyin ♜xd1+ — farzin yoʻqotiladi.",
      },
    },
  },
  "c5-legal": {
    title: "Legal gʻoyasi",
    idea: "Bogʻlangan ot baribir yuradi — agar farzin evaziga mot boʻlsa. Lekin avval otni urib olishmaydimi, tekshir.",
    lesson: [
      {
        title: "Aslida yoʻq bogʻlash",
        text: [
          "XVIII asrda fransuz ustasi Legal, Filidorning ustozi, shuni koʻrsatdi: fil otni **farzin** bilan bogʻlaganda, ot baribir yura oladi — qoidalar buni taqiqlamaydi. Gap faqat farzin urilgandan keyin nima boʻlishida.",
          "Legal moti senga birinchi bosqichda uchragan: ♘xe5, fil f7 da shoh berib uradi, ikkinchi ot d5 dan mot qiladi. Endi asosiysi — gʻoya ishlaydimi yoki yoʻqmi, **tekshirishni** oʻrganish.",
        ],
      },
      {
        title: "Gʻoya ishlamaydigan holat",
        text: [
          "Ot sakrashidan oldin oʻzingga ikkita savol ber. Birinchisi: raqib farzinni ursa — mot bormi? Ikkinchisi: agar u **otni** ursa-chi?",
          "Agar e5 dagi otni c6 dagi ot ursa, g4 dagi fil himoyalangan boʻlib qoladi — va oqlar bir donasiz qoladi. Bunday paytda bogʻlamdan xotirjam chiqish kerak: h3 yurishi bilan.",
        ],
      },
    ],
    terms: [
      {
        term: "Legal gʻoyasi",
        text: "Farzin bilan bogʻlangan ot zarba berib ketadi: farzin urilsa, yengil donalar mot qiladi.",
      },
    ],
    exercises: {
      "c5-legal-choose": {
        title: "Ot baribir yuradi",
        prompt: "Fil f3 dagi otni farzin bilan bogʻlagan. Qanday oʻynash yaxshiroq?",
        hint: "Qoralar farzinni ursa, nima boʻladi? c4 dagi fil va c3 dagi otga qara.",
        why: "5. ♘xe5! Agar 5... ♝xd1 boʻlsa, 6. ♗xf7+ ♚e7 7. ♘d5# — Legal moti. Agar 5... dxe5 boʻlsa, 6. ♕xg4 — oqlarda ortiqcha piyoda. h3 yurishi filni faqat haydaydi.",
      },
      "c5-legal-fails": {
        title: "Avval tekshir",
        prompt: "Oʻxshash, lekin qoralarning oti c6 da. Qanday oʻynash yaxshiroq?",
        hint: "e5 dagi otni kim ura oladi? Shundan keyin g4 dagi filni kim himoya qiladi?",
        why: "Bu yerda Legal gʻoyasi ishlamaydi: 5. ♘xe5? ga qoralar 5... ♞xe5! deb javob beradi. e5 dagi ot g4 dagi filni himoya qiladi va oqlar bir donasiz qoladi. Toʻgʻrisi — xotirjam 5. h3: fil qayerga ketishni hal qilishi kerak.",
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
  "c5-windmill": {
    title: "Tegirmon",
    idea: "Rux ochiq shoh bilan uradi va shoh berib qaytadi — qayta-qayta.",
    lesson: [
      {
        title: "Shoh, urish, shoh, urish",
        text: [
          "**Tegirmon** — takrorlanadigan ochiq shoh. Rux gorizontal boʻylab ketib, biror narsani uradi, fil esa shu payt shoh eʼlon qiladi. Shoh chekinadi — rux shoh berib qaytadi, shoh ortga yuradi va hammasi boshidan boshlanadi.",
          "Eng mashhur tegirmonni meksikalik Karlos Torre 1925-yilda Moskvada Emanuil Laskerga qarshi qurgan: oqlar farzinni berdi, rux esa shohlar bilan piyodalar va filni oldi — oxirida farzinni ham qaytarib oldi.",
        ],
      },
    ],
    terms: [
      {
        term: "Tegirmon",
        text: "Ketma-ket ochiq shohlar: bitta dona shoh berib, raqibning donalari va piyodalarini olib chiqadi.",
      },
    ],
    exercises: {
      "c5-windmill-start": {
        title: "Tegirmonni ishga tushir",
        prompt: "g7 dagi rux filni toʻsib turibdi. Tegirmonni qaysi yurish boshlaydi?",
        hint: "Rux yettinchi gorizontal boʻylab ketishi va har safar biror narsani urishi kerak.",
        why: "♖xf7+! ♚g8, ♖g7+ ♚h8, ♖xd7+ ♚g8, ♖g7+ ♚h8, ♖xb7+ ♚g8, ♖g7+ ♚h8, ♖xa7+ ♚g8 va ♖xa8 — rux ikkita piyoda, fil, ot va ruxni yigʻib oldi. ♖g3+? dan keyin ♚h7 — shoh qochadi va tegirmon toʻxtaydi.",
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
  "c5-deflection": {
    title: "Chalgʻitish",
    idea: "Qurbon himoyachini joyidan ketkazadi — va zarba oʻtadi.",
    lesson: [
      {
        title: "Qorovulni ketkaz",
        text: [
          "Raqibda koʻpincha hammasi bitta donaga bogʻliq boʻladi: u mot katagini yoki boshqa donani qoʻriqlaydi. **Chalgʻitish** — himoyachini oʻz joyidan ketishga majbur qiladigan yurish.",
          "Himoyachi koʻpincha qurbon bilan chalgʻitiladi: unga shunday joyda dona taklif qilinadiki, u yerdan u endi hech narsani qoʻriqlay olmaydi. Shohga hujumda chalgʻitish koʻpincha bogʻlash bilan birga keladi.",
        ],
      },
    ],
    terms: [
      {
        term: "Chalgʻitish",
        text: "Raqib donasini muhim katak yoki dona himoyasini tashlab ketishga majbur qiladigan usul.",
      },
    ],
    exercises: {
      "c5-deflection-rook": {
        title: "Qorovul farzin",
        prompt: "Oqlar yuradi va 2 yurishda mot qiladi. Birinchi yurish qaysi?",
        hint: "f8 dagi farzin g7 katagini qoʻriqlaydi. Uni qanday ketkazish mumkin?",
        why: "♖e8! Rux farzinni bogʻladi: u sakkizinchi gorizontaldan keta olmaydi. Agar ♛xe8 boʻlsa, g7 katagi himoyasiz qoladi — ♕g7#. Boshqa har qanday yurishga ham mot: ♕g7# yoki ♕xf8#. ♕xf8+? dan keyin ♚xf8 — mot yoʻq.",
      },
    },
  },
  "c5-deflection-defence": {
    title: "Himoyada chalgʻitish",
    idea: "Mot tahdid qilishyaptimi? Baʼzan eng yaxshi himoya — hujumchi donani olib ketadigan shoh.",
    lesson: [
      {
        title: "Hujumchini olib ket",
        text: [
          "Faqat himoyachilarni emas, **hujumchilarni** ham chalgʻitish mumkin. Raqib mot bilan tahdid qilyapti — sen esa shoh berasan va shoh bergan donani faqat mot qilmoqchi boʻlgan dona ura oladi.",
          "Raqib donasi oʻz joyidan ketdi — mot tahdidi yoʻq. Agar u muhim narsani, masalan, oxirgi gorizontalni tashlab ketgan boʻlsa, himoya darhol hujumga aylanadi.",
        ],
      },
    ],
    terms: [
      {
        term: "Himoyada chalgʻitish",
        text: "Raqibning hujumchi donasini xavfli katakdan ketishga majbur qiladigan yurish (koʻpincha shoh).",
      },
    ],
    exercises: {
      "c5-deflection-defence-rook": {
        title: "Farzin, h3 dan ket",
        prompt: "Qoralar ♛g2# bilan tahdid qilyapti. Qanday oʻynash yaxshiroq?",
        hint: "Faqat farzin javob bera oladigan shohni top.",
        why: "♖c8+! ♛xc8 — farzin h3 dan ketdi, g2 da mot yoʻq. Va darhol ♖xc8# — shohni oʻz piyodalari qamab qoʻygan. ♖c3? dan keyin ♛g2# boʻladi.",
      },
    },
  },
  "c5-interference": {
    title: "Toʻsish",
    idea: "Dona chiziqqa turadi — va raqibning uzoqqa uradigan donasi endi nishonni koʻrmaydi.",
    lesson: [
      {
        title: "Yoʻlni yop",
        text: [
          "Fil, rux va farzin uzoqdan — chiziqlar boʻylab ishlaydi. **Toʻsish** — shunday chiziqqa oʻz donamizni qoʻyadigan yurish. Raqibning uzoqqa uradigan donasi toʻsiq ortidagi katak yoki donani endi qoʻriqlay olmaydi.",
          "Eng yaxshisi — piyoda himoya qilayotgan dona bilan toʻsish: uni urishsa, piyoda qaytarib uradi va chiziq yopiqligicha qoladi.",
        ],
      },
    ],
    terms: [
      {
        term: "Chiziqni toʻsish",
        text: "Raqib donasi katak yoki boshqa donani himoya qilayotgan chiziqqa oʻz donasini qoʻyish.",
      },
    ],
    exercises: {
      "c5-interference-knight": {
        title: "Fil a8 ni qoʻriqlaydi",
        prompt: "e4 dagi fil a8 katagini ushlab turibdi. Qanday oʻynash yaxshiroq?",
        hint: "Otni filning diagonaliga qoʻy — otni piyoda himoya qiladigan joyga.",
        why: "♘d5! Ot diagonalni yopdi, fil endi a8 katagini koʻrmaydi. Agar ♝xd5 boʻlsa, cxd5 — diagonal piyoda bilan yopiladi va keyingi yurishda a7 dagi piyoda farzinga aylanadi. a8♕? dan keyin ♝xa8 — piyoda shunchaki yoʻqotiladi.",
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
  "c5-decoy-fork": {
    title: "Ayri zarbaga jalb qilish",
    idea: "Qurbon shohni ayri zarba yetadigan katakka chorlaydi.",
    lesson: [
      {
        title: "Chorla va ur",
        text: [
          "Jalb qilish faqat mot uchun emas, **dona yutish** uchun ham yordam beradi. Qurbon bilan shoh yoki farzinni qoʻsh zarba yetadigan katakka chorlaymiz.",
          "Koʻpincha ot uradi: shoh qurbonni oldi — ot esa shoh berib, farzinga ham hujum qiladi.",
        ],
      },
    ],
    terms: [
      {
        term: "Ayri zarbaga jalb qilish",
        text: "Qurbon: undan keyin raqib donasi qoʻsh zarba uchun qulay katakka turadi.",
      },
    ],
    exercises: {
      "c5-decoy-fork-rook": {
        title: "Rux shohni chaqiradi",
        prompt: "Oqlar yuradi. Farzinni qanday yutish mumkin?",
        hint: "f7 piyodasini faqat shoh himoya qiladi. Uni qayerga olib ketish mumkin?",
        why: "♖h8+! ♚xh8, ♘xf7+ — ayri: shohga shoh va d6 dagi farzinga hujum. Oqlar ruxni berib, piyoda va farzinni oldi. Darhol ♘xf7? ♚xf7 — ot yoʻqotiladi.",
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
  "c5-fischer": {
    title: "Fisher sabogʻi",
    idea: "f7 dagi qurbon shohni chiqarib oldi — va farzinning ketadigan joyi qolmadi.",
    lesson: [
      {
        title: "Nyu-York, 1958",
        text: [
          "Bobbi Fisher AQSH chempionatida grossmeyster Samuel Reshevskiy bilan oʻynaganida 15 yoshda edi. Qoralar ehtiyotsizlik bilan otni taxta chetiga olib ketdi — va d8 dagi farzin boʻsh kataksiz qoldi: atrofida oʻz donalari va piyodalari.",
          "Fisher f7 da filini qurbon qildi va ot bilan e6 ga sakradi — shoh va piyodaning zarbasi ostiga! Agar otni piyoda ursa, oq farzin qora farzinni oladi. Agar shoh ursa — uni taxta markazida mot kutadi. Reshevskiy farzinini berdi, lekin partiyani qutqara olmadi.",
        ],
      },
    ],
    terms: [
      {
        term: "Farzinga mot",
        text: "Farzinning boʻsh katagi qolmaganda uni tutishadi: unga qilingan hujum farzinni yutadi.",
      },
    ],
    exercises: {
      "c5-fischer-bishop": {
        title: "Fil f7 ni uradi",
        prompt: "Fisher (oqlar) yuradi. Kombinatsiya qanday boshlangan?",
        hint: "d8 dagi farzinning yuradigan joyi yoʻq. Ot unga qaysi katakdan hujum qila oladi?",
        why: "10. ♗xf7+! ♚xf7 11. ♘e6! — ot farzinga hujum qiladi, uning esa chekinadigan joyi yoʻq. Fil f7 piyodasini yoʻq qilish uchun berildi: u e6 dagi otni «d» chizigʻini ochmasdan urgan boʻlardi.",
      },
      "c5-fischer-knight": {
        title: "Ot e6 ga boradi",
        prompt: "Fisher (oqlar) yuradi. Farzinni qanday tutish mumkin?",
        hint: "d8 dagi farzinning bitta ham boʻsh katagi yoʻq.",
        why: "11. ♘e6! Farzinning ketadigan joyi yoʻq. 11... dxe6 12. ♕xd8 — partiyada shunday boʻlgan. Agar 11... ♚xe6 boʻlsa, 12. ♕d5+ ♚f5 13. g4+ ♚xg4 — va shoh koʻpi bilan toʻrt yurishda mot boʻladi.",
      },
    },
  },
  "c5-zwischenzug": {
    title: "Oraliq yurish",
    idea: "Javoban urishga shoshilma: avval kuchliroq shoh yoki urishni qidir.",
    lesson: [
      {
        title: "Avval shoh",
        text: [
          "Raqib donangni urdi — qoʻl oʻzi javoban urishga choʻziladi. Shoshilma! Baʼzan kuchliroq yurish bor: shoh, urish yoki mot tahdidi. Javob urishdan **oldin** qilingan bunday yurish **oraliq yurish** deyiladi.",
          "Javob urish qochib ketmaydi: avval yomon turgan narsani ol, keyin javoban ur. Har bir almashuvdan oldin tekshir: shoh yoʻqmi?",
        ],
      },
    ],
    terms: [
      {
        term: "Oraliq yurish",
        text: "Kutilgan javob urish oʻrniga qilingan kuchli yurish (koʻpincha shoh).",
      },
    ],
    exercises: {
      "c5-zwischenzug-check": {
        title: "Farzin kutib turadi",
        prompt: "Qoralar e2 da farzinni urdi. Qanday oʻynash yaxshiroq?",
        hint: "d8 dagi ruxni farzin himoya qilardi. Endi-chi?",
        why: "♖xd8+! — oraliq shoh: d8 dagi ruxni faqat farzin himoya qilardi, u esa e2 ga ketdi. Qoralar shohni olib ketadi yoki toʻsadi, oqlar shundan keyingina farzinni uradi — ularda ortiqcha rux. ♗xe2? dan keyin ♜xd1+ ♗xd1 — donalar teng.",
      },
    },
  },
  "c5-clearance": {
    title: "Chiziqni boʻshatish",
    idea: "Oʻz donang xalaqit beryaptimi? Uni shoh berib qurbon qil — chiziq ochiladi.",
    lesson: [
      {
        title: "Yoʻldan chetga chiq",
        text: [
          "Baʼzan kerakli chiziq yoki katakni **oʻzimizning** donamiz egallab turadi. Kutishga vaqt yoʻq — raqib himoyalanib ulguradi. Shunda xalaqit berayotgan dona shoh berib qurbon qilinadi: u yoʻldan ketadi, raqib esa yurishini uni urishga sarflaydi.",
          "Rux shu tarzda farzin uchun vertikalni, ot esa fil uchun diagonalni boʻshatadi.",
        ],
      },
    ],
    terms: [
      {
        term: "Chiziqni boʻshatish",
        text: "Boshqa donaning chiziq boʻylab oʻtishiga yoki kerakli katakka turishiga xalaqit berayotgan oʻz donasini qurbon qilish.",
      },
    ],
    exercises: {
      "c5-clearance-rook": {
        title: "Farzinga yoʻl",
        prompt: "Oqlar yuradi va 3 yurishda mot qiladi. Birinchi yurish qaysi?",
        hint: "Farzinga h chizigʻi kerak, lekin unda oʻz ruxi turibdi. Ruxni shoh berib qurbon qil.",
        why: "♖h8+! ♚xh8, ♕h1+ ♚g8, ♕h7# — g6 dagi piyoda farzinni himoya qiladi va shohdan f7 katagini tortib oladi. ♕h5? dan keyin qoralar himoyalanib ulguradi: ♛xg6 — hujumning asosiy piyodasi yoʻq.",
      },
    },
  },
  "c5-back-rank": {
    title: "Oxirgi gorizontalning zaifligi",
    idea: "Shoh oʻz piyodalari ortida «darcha»siz qolgan — taxta chetidagi qurbon motga olib keladi.",
    lesson: [
      {
        title: "Qamalgan shoh",
        text: [
          "Rokirovkadan keyin shoh piyodalar ortiga yashirinadi. Lekin ulardan birortasi ham yurmagan boʻlsa, shohning oxirgi gorizontaldan ketadigan joyi yoʻq: shu gorizontal boʻylab rux yoki farzin bilan berilgan shoh — darhol mot.",
          "Agar gorizontalni bitta dona himoya qilayotgan boʻlsa, u **qurbon** bilan chalgʻitiladi. Oʻzing bunday motga tushmasliging uchun vaqtida «darcha» och — chetdagi piyoda bilan yur.",
        ],
      },
    ],
    terms: [
      {
        term: "Oxirgi gorizontalning zaifligi",
        text: "Shoh taxta chetida oʻz piyodalari bilan qamalgan, gorizontalni esa kam dona himoya qiladi.",
      },
    ],
    exercises: {
      "c5-back-rank-queen": {
        title: "Taxta chetidagi qurbon",
        prompt: "Oqlar yuradi va 2 yurishda mot qiladi. Birinchi yurish qaysi?",
        hint: "Sakkizinchi gorizontalni bitta rux himoya qilyapti. U ursa, nima boʻladi?",
        why: "♕e8+! ♜xe8, ♖xe8# — shohning «darcha»si yoʻq. Rux bilan boshlash ham mumkin: ♖e8+ ♜xe8, ♕xe8#. ♕b7? dan keyin qoralar ruxni olib ketishga yoki «darcha» ochishga ulguradi.",
      },
    },
  },
  "c5-open-file": {
    title: "Chiziqni ochish",
    idea: "Shoh yonidagi qurbon vertikalni ochadi — rux shu chiziqdan mot bilan kirib keladi.",
    lesson: [
      {
        title: "Ruxga yoʻl och",
        text: [
          "Ruxga ochiq vertikal kerak. Agar raqib shohi yonidagi chiziqni piyoda yopib turgan boʻlsa, uni **ochish** mumkin: almashuv yoki qurbon bilan.",
          "Eng keskin yoʻl — shohni toʻsib turgan piyodaga qurbon berish. Shoh uradi, vertikal ochiladi va rux boʻsh chiziq boʻylab shoh beradi.",
        ],
      },
    ],
    terms: [
      {
        term: "Chiziqni ochish",
        text: "Almashuv yoki qurbon: undan keyin shohga boradigan vertikal yoki diagonal ochiq boʻladi.",
      },
    ],
    exercises: {
      "c5-open-file-queen": {
        title: "«h» chizigʻi",
        prompt: "Oqlar yuradi va 3 yurishda mot qiladi. Birinchi yurish qaysi?",
        hint: "h7 dagi piyodani faqat shoh himoya qiladi. U ursa, nima boʻladi?",
        why: "♕xh7+! ♚xh7, ♖h1+ ♚g8, ♖h8# — h8 katagini f6 dagi fil ushlab turibdi. ♖h1? dan keyin qoralar h5 yurishi bilan chiziqni yopishga ulguradi — uch yurishda mot yoʻq.",
      },
    },
  },
  "c5-attack-principle": {
    title: "Hujumning bosh tamoyili",
    idea: "Raqib himoyachilaridan koʻra donalaring koʻp boʻlgan joyda hujum qil.",
    lesson: [
      {
        title: "Kuch qayerda koʻp — oʻsha yerda hujum",
        text: [
          "Hujumning bosh tamoyili oddiy: raqib himoyachilaridan koʻra **donalaring koʻp** boʻlgan joyda hujum qil. Bitta himoyachiga qarshi uchta dona — bu deyarli har doim mot yoki dona yutish.",
          "Hujumdan oldin sanab chiq: nechta donang shohga qarab turibdi va raqibning nechta donasi uni himoya qilyapti. Boshqa qanotdagi donalar hisobga kirmaydi: ular ulgurmaydi.",
        ],
      },
      {
        title: "Bir qismdagi ustunlik",
        text: [
          "Ustunlik butun qoʻshinda boʻlishi shart emas. Raqibda donalar hatto koʻproq boʻlishi mumkin — lekin ular farzin qanotiga ketib qolgan boʻlsa, shoh yonida seniki koʻp. Bu — **bir qismdagi kuchlar ustunligi**.",
          "Ustunlik oldindan yaratiladi: donalar raqib shohiga yaqinroq olib kelinadi. Himoyachi xalaqit bersa — uni almashtirishadi yoki qurbon bilan chalgʻitishadi.",
        ],
      },
    ],
    terms: [
      {
        term: "Bir qismdagi kuchlar ustunligi",
        text: "Taxtaning bir qismida hujumchilarning donalari raqib himoyachilaridan koʻp.",
      },
    ],
    exercises: {
      "c5-attack-principle-count": {
        title: "Kuchlarni sana",
        prompt: "Taxtaga qarab javob ber.",
        hint: "Farzin, fil va otdan h7 katagiga chiziq tort.",
        why: "h7 ga oqlarning uchta donasi — farzin, fil va ot qarab turibdi, uni esa yolgʻiz shoh himoya qiladi. Qoralarda ikki rux, farzin va fil bor, lekin hammasi uzoqda.",
        questions: [
          { text: "Oqlarning nechta donasi h7 katagiga hujum qilyapti?", options: ["bitta", "ikkita", "uchta"] },
          {
            text: "Qoralarning nechta donasi h7 katagini himoya qilyapti?",
            options: ["bitta — faqat shoh", "ikkita", "uchta"],
          },
          {
            text: "Hujumni qayerdan boshlash kerak?",
            options: ["raqib himoyachilaridan koʻra donalaring koʻp boʻlgan joydan", "oʻz shohing turgan joydan"],
          },
        ],
      },
      "c5-attack-principle-mate": {
        title: "Uch kishi bir kishiga",
        prompt: "Oqlar yuradi. Mot qil.",
        hint: "Oqlarning uchta donasi birdaniga qaysi katakka qarab turibdi?",
        why: "♕xh7# — farzinni fil va ot himoya qiladi. Qoralarda donalar koʻproq, lekin shoh yonida bitta ham yordamchi yoʻq.",
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
  "c5-seize-point": {
    title: "Punktni egallash",
    idea: "Muhim katakning himoyachisini yoʻq qil — katak seniki.",
    lesson: [
      {
        title: "Nishondagi katak",
        text: [
          "Hujumda koʻpincha hammasini bitta katak — shoh yonidagi **punkt**, masalan, h7 hal qiladi. Agar unga sening ikkita donang qarab turgan, raqibning esa bitta donasi himoya qilayotgan boʻlsa, oʻsha himoyachini yoʻq qilish kerak.",
          "Eng oson yoʻli — uni **yoʻq qilish**: qurbon evaziga boʻlsa ham urib olish. Punkt himoyasiz qoladi — va unga farzin bostirib kiradi.",
        ],
      },
    ],
    terms: [
      {
        term: "Punktni egallash",
        text: "Muhim katak uchun kurash: bu katakning himoyachilari almashtiriladi, chalgʻitiladi yoki yoʻq qilinadi.",
      },
    ],
    exercises: {
      "c5-seize-point-rook": {
        title: "h7 punkti",
        prompt: "Farzin va fil h7 ga qarab turibdi. Qanday oʻynash yaxshiroq?",
        hint: "h7 katagini f6 dagi ot himoya qiladi. Uni nima bilan urish mumkin?",
        why: "♖xf6! h7 punktining himoyachisi yoʻq qilindi. Ruxni urishsa — ♕xh7#. Urishmasa, oqlarda ortiqcha ot. Darhol ♕xh7+? ♞xh7 — farzin yoʻqotiladi.",
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
  "c5-pawn-storm": {
    title: "Piyodalar hujumi",
    idea: "Shohlar turli qanotlarda — piyodalar raqib shohiga yurib, chiziqlarni ochadi.",
    lesson: [
      {
        title: "Shohlar turli qanotlarda",
        text: [
          "Shohlar **turli tomonga** rokirovka qilgan boʻlsa, raqib shohi turgan qanotdagi piyodalarni bemalol oldinga surish mumkin: oʻz shohing uzoqda, unga ular kerak emas.",
          "Rokirovka piyodalarigacha yetib borgan piyoda **chiziqni ochadi**: almashuvdan keyin shoh oldida rux va farzin uchun vertikal ochiladi. Kim raqib shohi yonida chiziqni birinchi ochsa, odatda oʻsha yutadi.",
        ],
      },
      {
        title: "Yopma, ur",
        text: [
          "Raqib piyodalariga yetib borgach, piyoda yonidan oʻtib ketmasdan **urishi** kerak. Yonidan oʻtib ketsa, chiziq yopiq qoladi — va hujum toʻxtaydi.",
        ],
      },
    ],
    terms: [
      {
        term: "Piyodalar hujumi",
        text: "Ruxlar va farzin uchun chiziqlarni ochish maqsadida raqib rokirovkasiga piyodalar bilan yurish.",
      },
    ],
    exercises: {
      "c5-pawn-storm-open": {
        title: "«h» chizigʻini och",
        prompt: "Oqlar yuradi va 3 yurishda mot qiladi. Birinchi yurish qaysi?",
        hint: "Farzin va rux «h» chizigʻida turibdi. Ularga nima xalaqit beryapti?",
        why: "hxg6! «h» chizigʻi ochildi: hxg6 ga ♕h8#, fxg6 ga ♕xh7# keladi. Qolgan yurishlar motni faqat kechiktiradi. h6? dan keyin «h» chizigʻi oʻz piyodasi bilan yopilib qoladi.",
      },
    },
  },
  "c5-nail": {
    title: "Mix-piyoda",
    idea: "Shoh yonidagi f6 piyoda — mixdek: g7 katagini tortib oladi va mot qilishga yordam beradi.",
    lesson: [
      {
        title: "Shoh yonidagi mix",
        text: [
          "f6 yoki h6 gacha — raqib rokirovkasining yoniga yetib borgan piyoda **mix** deyiladi. Uni urib chiqarish qiyin, u esa g7 katagini ushlab turadi: farzin piyoda himoyasida oʻsha yerga turadi — va mot.",
          "Agar g7 katagini rux bilan himoya qilishga ulgurishgan boʻlsa ham, mix yordam beradi: shoh burchakda qamalgan va «h» chizigʻi boʻylab bitta shoh yetarli.",
        ],
      },
    ],
    terms: [
      {
        term: "Mix-piyoda",
        text: "Raqib shohi yonida, oltinchi gorizontalda turgan piyoda: shohdan kataklarni tortib oladi va oʻz donalarini qoʻllaydi.",
      },
    ],
    exercises: {
      "c5-nail-queen": {
        title: "Shoh qamalgan",
        prompt: "Oqlar yuradi va 2 yurishda mot qiladi. Birinchi yurish qaysi?",
        hint: "g8 dagi rux g7 ni himoya qiladi. h7 ni-chi, kim himoya qiladi?",
        why: "♕xh7+! ♚xh7, ♖h3# — shoh qamalgan: g7 katagini f6 dagi mix-piyoda ushlab turibdi, g8 da oʻz ruxi. ♕g7+? dan keyin ♜xg7 — farzin yoʻqotiladi.",
      },
    },
  },
  "c5-weak-squares": {
    title: "Zaif kataklar",
    idea: "Piyoda bilan himoya qilib boʻlmaydigan katak — hujumchi donalar uchun eshik.",
    lesson: [
      {
        title: "Shoh yonidagi teshiklar",
        text: [
          "Katakni bitta ham piyoda himoya qila olmasa, u **zaif** deyiladi. g7 piyodasi g6 ga ketdi — va shoh yonidagi f6 va h6 kataklari piyoda himoyasisiz qoldi.",
          "Odatda bunday kataklarni fil qoʻriqlaydi. U almashib ketgan boʻlsa, zaif kataklarga hujumchi donalar kiradi: fil f6 ga, farzin h6 ga turadi va g7 dagi motni qaytarib boʻlmaydi.",
        ],
      },
    ],
    terms: [
      {
        term: "Zaif katak",
        text: "Piyoda bilan himoya qilib boʻlmaydigan katak; unga oʻz donalarini qoʻyish qulay.",
      },
    ],
    exercises: {
      "c5-weak-squares-queen": {
        title: "Farzin h6 ga kiradi",
        prompt: "Oqlar yuradi va 2 yurishda mot qiladi. Birinchi yurish qaysi?",
        hint: "f6 dagi fil g7 katagini ushlab turibdi. Farzin u yerga qayerdan tusha oladi?",
        why: "♕h6! — jim yurish: ♕g7# tahdidi bor va qoralar g7 katagini himoya qila olmaydi. ♕d4? hech narsa bilan tahdid qilmaydi: g7 ga yoʻlni oʻz fili toʻsib turibdi.",
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
  "c5-h7-greco": {
    title: "h7 dagi fil qurboni",
    idea: "Fil h7 piyodasini shoh berib uradi, ot g5 ga sakraydi, farzin h5 ga shoshadi — rokirovkaga qilingan eng qadimgi hujum.",
    lesson: [
      {
        title: "Greko sovgʻasi",
        text: [
          "Taxminan 1620-yilda italiyalik Joakino Greko hozirgacha oʻrganiladigan partiyani yozib qoldirgan. Oq fil h7 piyodasini shoh berib urdi. Shoh filni oldi — va shu zahoti g5 dan otdan shoh oldi.",
          "Qoralar otni fil bilan urdi, lekin oqlarning h4 piyodasi javoban urdi va h1 dagi rux shoh berdi: uning oldida «h» chizigʻi ochildi. Farzin h5 ga chiqdi va partiya h8 dagi mot bilan tugadi.",
        ],
      },
      {
        title: "Qurbon qachon oʻtadi",
        text: [
          "h7 dagi qurbondan oldin uch narsani tekshir. Ot g5 ga shoh berib yeta olishi kerak. Farzin h5 ga tusha olishi kerak. Raqibda esa h7 katagini himoya qiladigan dona boʻlmasligi kerak — koʻpincha bu f6 dagi ot.",
          "Bitta shart ham bajarilmasa, fil bekorga berilgan. Qurbon — bu umid emas, hisob-kitob.",
        ],
      },
    ],
    terms: [
      {
        term: "h7 dagi fil qurboni",
        text: "Fil h7 piyodasini shoh berib uradi; keyin hujumga ot (g5 ga) va farzin (h5 ga) kiradi.",
      },
    ],
    exercises: {
      "c5-h7-greco-bishop": {
        title: "Fil h7 ni uradi",
        prompt: "Greko (oqlar) yuradi. Hujum qanday boshlangan?",
        hint: "f3 dagi ot g5 ga sakrashga, farzin h5 ga chiqishga tayyor. Nima yetishmayapti?",
        why: "7. ♗xh7+! ♚xh7 8. ♘g5+ ♝xg5 9. hxg5+ — shohni h1 dagi rux beradi: «h» chizigʻi ochildi. 9... ♚g8 10. ♕h5 f5 11. g6 ♜e8 dan keyin partiya mot bilan tugadi: 12. ♕h8#.",
      },
      "c5-h7-greco-mate": {
        title: "Greko moti",
        prompt: "Oqlar yuradi. Mot qil.",
        hint: "g6 dagi piyoda shohdan f7 va h7 kataklarini tortib oldi.",
        why: "♕h8# — farzinni h1 dagi rux himoya qiladi, g6 dagi piyoda esa f7 va h7 kataklarini ushlab turibdi.",
      },
    },
  },
  "c5-h6-sac": {
    title: "h6 dagi qurbon",
    idea: "Fil h6 piyodasini uradi: uni olishsa, farzin shoh yoniga bostirib kiradi.",
    lesson: [
      {
        title: "Himoyani buz",
        text: [
          "Shoh yonidagi h6 piyodasi foydali koʻrinadi: u donalarni g5 ga qoʻymaydi. Lekin uning oʻzi **nishonga** aylanadi: agar ortidan h6 ga farzin kelsa, uni fil bilan urish mumkin.",
          "h6 dagi qurbon hujumchilarda yordamchi — g7 katagini ushlab turgan dona boʻlganda oʻtadi. Shunda fil urilgandan keyin farzin h6 ga turadi va g7 dagi motni qaytarib boʻlmaydi.",
        ],
      },
    ],
    terms: [
      {
        term: "h6 dagi qurbon",
        text: "Shohni ochish va farzinni h6 ga olib kelish uchun dona h6 piyodasi evaziga beriladi.",
      },
    ],
    exercises: {
      "c5-h6-sac-bishop": {
        title: "Fil h6 ni uradi",
        prompt: "f5 dagi ot g7 ga qarab turibdi. Qanday oʻynash yaxshiroq?",
        hint: "g7 piyodasi filni ursa, nima boʻladi? Farzin qayerga keladi?",
        why: "♗xh6! Agar gxh6 boʻlsa, ♕xh6 — va g7 dagi motdan himoya yoʻq. Filni urishmasa, oqlar piyoda yutdi, hujum esa davom etadi. ♕d4 dan keyin qoralar f6 yurishi bilan yopiladi.",
      },
    },
  },
  "c5-f6-sac": {
    title: "f6 dagi qurbon",
    idea: "Ot shoh berib f6 ga boradi: g7 piyodasi uradi — va shoh ochiq qoladi.",
    lesson: [
      {
        title: "g7 piyodasini sindiramiz",
        text: [
          "g7 piyodasi — rokirovkadan keyin shohning asosiy qalqoni. **f6 dagi qurbon** uni joyidan ketishga majbur qiladi: ot yoki rux f6 ga turadi, piyoda uradi va «g» chizigʻi katta diagonal bilan birga ochiladi.",
          "Keyin farzin va fil ishlaydi: farzin «g» chizigʻi boʻylab shoh beradi, fil esa uzun diagonal boʻylab uradi.",
        ],
      },
    ],
    terms: [
      { term: "f6 dagi qurbon", text: "g7 piyodasi ketishi va shoh himoyasiz qolishi uchun dona f6 da beriladi." },
    ],
    exercises: {
      "c5-f6-sac-knight": {
        title: "Ot f6 ga boradi",
        prompt: "Oqlar yuradi va 3 yurishda mot qiladi. Birinchi yurish qaysi?",
        hint: "Ot shoh beradi, h7 katagi esa farzin zarbasi ostida.",
        why: "♘f6+! Shoh h8 ga ketsa — ♕xh7#. Agar gxf6 boʻlsa, ♕g3+ ♚h8 va ♗xf6#. ♕g3 dan keyin qoralar g6 yurishi bilan yopiladi.",
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
      "c5-only-move-quiet": {
        title: "Jim himoya",
        prompt:
          "Oqlarga shoh berilmagan va ular b7 dagi filni urib olishi mumkin. Lekin qoralar mot bilan tahdid qilyapti: ♜e1. Qaysi yurish qutqaradi?",
        hint: "h3 darchasi yordam bermaydi: h2 katagini d6 dagi fil nazorat qiladi. Qaysi dona qaytib, e1 katagini himoya qila oladi?",
        why: "♖a1! — rux qaytib, e1 katagini himoya qiladi: mot yoʻq, donalar esa teng. ♖xb7? ♜e1# — ochkoʻzlik jazolandi. h3? ♜e1#: shoh h2 ga keta olmaydi, bu katakni d6 dagi fil urib turadi. g2 piyodasi esa yura olmaydi: uni b7 dagi fil bogʻlab turibdi.",
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
  "c5-stalemate-save": {
    title: "Yomon pozitsiyada qutulish",
    idea: "Pozitsiya yomonmi? Eng keskin yurishni qidir: abadiy shoh, pat yoki qarshi zarba.",
    lesson: [
      {
        title: "Taslim boʻlma",
        text: [
          "Pozitsiya yomon, raqib mot bilan tahdid qilyapti. Taslim boʻlishga hali erta: **eng keskin yurishni** qidir — shoh, qurbon, qarshi tahdid. Qiyin pozitsiyada tinch yurishlar aniq yutqazadi, keskin yurishlar esa imkon beradi.",
          "Uchta qutqaruvchi usulni yoddan bilish kerak: **abadiy shoh**, **pat** va **qarshi hujum** — raqib tahdididan xavfliroq boʻlgan qarshi zarba.",
        ],
      },
      {
        title: "Pat ham najot",
        text: [
          "Shohingning yuradigan joyi yoʻq, boshqa yurishlaring ham deyarli qolmagan boʻlsa, patga eʼtibor ber. Oxirgi donangni shoh berib shunday berki, uni urishga majbur boʻlishsin — va yurishing qolmaydi. Pat — durang, raqibda ortiqcha farzin boʻlsa ham.",
        ],
      },
    ],
    terms: [
      {
        term: "Keskinlashtirish",
        text: "Tahdidlar yaratadigan va raqibni qiyin masalalarni yechishga majbur qiladigan yurish.",
      },
    ],
    exercises: {
      "c5-stalemate-save-queen": {
        title: "Qutqaruvchi qurbon",
        prompt: "Qoralar mot bilan tahdid qilyapti. Qanday qutulish mumkin?",
        hint: "Oq shohning yuradigan joyi yoʻq, h3 piyodasi qamalgan. Oqlarda farzin qolmasa, nima boʻladi?",
        why: "♕e3+! ♝xe3 — boshqa javob yoʻq va oqlarga pat: shohning yuradigan joyi yoʻq, h3 piyodasi qamalgan. Durang! ♕xc5? dan keyin ♛g2# boʻladi.",
      },
      "c5-stalemate-save-quiz": {
        title: "Uchta najot",
        prompt: "Savollarga javob ber.",
        hint: "Darsdagi uchta usulni esla: abadiy shoh, pat, qarshi hujum.",
        why: "Yomon pozitsiyada keskin yurishlar qidiriladi. Pat va abadiy shoh — durang, raqibda qancha dona boʻlmasin.",
        questions: [
          {
            text: "Pozitsiya yomon. Birinchi navbatda qanday yurishni qidirish kerak?",
            options: ["eng keskinini: shoh, qurbon, qarshi tahdid", "eng tinchini"],
          },
          {
            text: "Pat boʻlsa, partiya qanday tugaydi?",
            options: ["durang bilan", "donasi koʻp tomonning gʻalabasi bilan"],
          },
          {
            text: "Abadiy shoh nima?",
            options: ["shoh yashirina olmaydigan shohlar — durang", "darhol mot boʻladigan shoh"],
          },
        ],
      },
    },
  },
  "c5-two-bishops": {
    title: "Ikki fil qurboni",
    idea: "Birinchi fil h7 da, ikkinchisi g7 da beriladi: shoh yonida bitta ham piyoda qolmaydi.",
    lesson: [
      {
        title: "Amsterdam, 1889",
        text: [
          "Emanuil Lasker — ikkinchi jahon chempioni. 1889-yilda, hali chempion boʻlmasidan oldin, u Iogann Bauer bilan hozirgacha eslanadigan partiya oʻynadi: Lasker **ikkala filini** qurbon qildi.",
          "Birinchi fil h7 dagi piyodani shoh berib urdi — shoh filni oldi. Farzin h5 dagi otni shoh berib oldi, shoh g8 ga qaytdi. Shunda ikkinchi fil g7 dagi piyodani urdi! Shohni endi bitta ham piyoda toʻsmaydi.",
        ],
      },
      {
        title: "Rux ishni tugatadi",
        text: [
          "Qoralar ikkinchi filni ham oldi. Farzin g4 dan shoh berdi, shoh h7 ga ketdi — va jangga rux kirdi: f3 ga, u yerdan h3 ga. Mot boʻlmaslik uchun Bauer farzinini ruxga berdi.",
          "Soʻnggi zarba — farzinning d7 ga yurishi: qoralarning ikki filiga qoʻsh zarba. Ulardan biri yoʻqotiladi va Lasker partiyani yutdi.",
        ],
      },
    ],
    terms: [
      {
        term: "Ikki fil qurboni",
        text: "Fillar h7 va g7 piyodalari evaziga beriladi; himoyasiz qolgan shohga farzin va rux hujum qiladi.",
      },
    ],
    exercises: {
      "c5-two-bishops-first": {
        title: "Birinchi fil",
        prompt: "Lasker (oqlar) yuradi. Kombinatsiya qanday boshlangan?",
        hint: "Farzin h5 dagi otni shoh berib oladi — agar avval h7 piyodasi yoʻq qilinsa.",
        why: "15. ♗xh7+! ♚xh7 16. ♕xh5+ ♚g8 — farzin otni shoh berib oldi, shohning h7 piyodasi esa endi yoʻq. Oddiy 15. ♕xh5 ga qoralar f5 deb javob beradi: d3 dagi filning diagonali yopiladi va hujum sekinlashadi.",
      },
      "c5-two-bishops-second": {
        title: "Ikkinchi fil",
        prompt: "Lasker (oqlar) yuradi. Hujumni qanday davom ettirish kerak?",
        hint: "Shoh yonida bitta piyoda qoldi. Uni nima bilan urish mumkin?",
        why: "17. ♗xg7! ♚xg7 18. ♕g4+ ♚h7 (18... ♚f6 19. ♕g5#) 19. ♖f3 — rux h3 ga boradi va qoralar farzinni berishga majbur boʻldi. 17. ♕g4 ga qoralar f6 yurishi bilan himoyalanishga ulguradi.",
      },
      "c5-two-bishops-fork": {
        title: "Qoʻsh zarba",
        prompt: "Lasker (oqlar) yuradi. Filni qanday yutish mumkin?",
        hint: "Farzin birdaniga ikki filga hujum qiladigan katakni top.",
        why: "22. ♕d7! — qoʻsh zarba: b7 va e7 dagi fillar zarba ostida, ikkalasini himoya qilib boʻlmaydi. Partiyada 22... ♝f6 23. ♕xb7 boʻlgan. fxe5 yurishi faqat piyoda yutadi.",
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
  "c5-tal": {
    title: "Tal: hujum uchun qurbonlar",
    idea: "Raqib shohi markazda qolgan — tez hujum dona sonidan muhimroq.",
    lesson: [
      {
        title: "Amsterdam, 1964",
        text: [
          "Mixail Tal — sakkizinchi jahon chempioni, «Rigalik sehrgar». U shohga yetib borish uchun donalarini qurbon qilishni yaxshi koʻrardi. 1964-yilda Amsterdamda Tal bolgariyalik shaxmatchi Georgi Tringov bilan oʻynadi.",
          "Qora farzin piyoda ortidan uzoqqa ketdi, shoh esa markazda qoldi. Tal c3 dagi otni qutqarib oʻtirmadi: uning oʻrniga ruxni d1 ga qoʻydi. Oqlarning hamma donalari shohga qarab turardi.",
        ],
      },
      {
        title: "Fil, ot, farzin",
        text: [
          "Keyin — ketma-ket uchta zarba. Fil f7 piyodasini shoh berib urdi. Shoh filni oldi — ot g5 dan shoh berdi. Shoh e8 ga qaytdi — va farzin e6 ga shoh berib turdi: uch yurishda mot. Tringov taslim boʻldi.",
        ],
      },
    ],
    terms: [
      {
        term: "Markazdagi shohga hujum",
        text: "Shoh rokirovka qilmagan, markazdagi chiziqlar ochiq — hujumchi donalar shoh berib kiradi.",
      },
    ],
    exercises: {
      "c5-tal-bishop": {
        title: "f7 ga zarba",
        prompt: "Tal (oqlar) yuradi. U hujumni qanday boshlagan?",
        hint: "f7 piyodasini faqat shoh himoya qiladi.",
        why: "15. ♗xf7+! ♚xf7 16. ♘g5+ ♚e8 17. ♕e6+ — va qoralar taslim boʻldi: koʻpi bilan ikki yurishda mot. Tal c3 dagi farzinga vaqt sarflamadi: shohlar muhimroq.",
      },
      "c5-tal-queen": {
        title: "Farzin e6 ga boradi",
        prompt: "Tal (oqlar) yuradi va 3 yurishda mot qiladi. Birinchi yurish qaysi?",
        hint: "Shoh farzin qanotiga qocha olmaydigan shohni qidir.",
        why: "17. ♕e6+! Agar 17... ♚f8 boʻlsa, ♕f7#. Agar 17... ♚d8 boʻlsa, ♘f7+ ♚c7 va ♕d6#. Agar 17... ♞e7 boʻlsa, ♕f7+ ♚d8 va ♘e6#.",
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
