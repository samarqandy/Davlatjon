import type { Uz } from "../../localize";
import type { ChessPuzzle, PuzzleThemeInfo } from "../puzzles";

export const themesUz: Uz<PuzzleThemeInfo[]> = {
  mate1: {
    name: "Bir yurishda mot",
    about: "Shunday yurish top-ki, raqib shohining qochadigan joyi qolmasin.",
    hint: "Shoh beradigan yurishlarni birma-bir tekshirib koʻr. Qaysi biridan keyin shohning qochadigan joyi, toʻsadigan donasi va donangni urib oladigan himoyachisi qolmaydi?",
  },
  backrank: {
    name: "Oxirgi gorizontalda mot",
    about:
      "Shoh oʻz piyodalari ortiga yashiringan — va oʻzini oʻzi qamab qoʻygan. Rux yoki farzin taxtaning chetida mot qiladi.",
    hint: "Raqib shohi chetki gorizontaldan chiqib keta oladimi? Qaysi donang shu gorizontalga shoh berib yetib bora oladi?",
  },
  hanging: {
    name: "Tekin dona",
    about: "Kimdir donasini himoyasiz qoldiribdi. Qani, urib ol!",
    hint: "Raqibning har bir donasini tekshir: uni kimdir himoya qilyaptimi? Tekinga urib olsa boʻladiganini top.",
  },
  fork: {
    name: "Vilka",
    about: "Bitta yurish bilan birdaniga ikki donaga hujum qil.",
    hint: "Bitta donang birdaniga ikki donaga hujum qiladigan yurishni izla. Vilkani koʻpincha ot yoki farzin qiladi — ayniqsa shoh berib.",
  },
  pin: {
    name: "Bogʻlash",
    about: "Dona joyidan qimirlay olmaydi: orqasida shoh turibdi.",
    hint: "Raqibning shunday donasini top-ki, uning ortida bir chiziqda shoh yoki farzin tursin. Unga hujum qil — u joyidan qimirlay olmaydi.",
  },
  skewer: {
    name: "Rentgen",
    about: "Shoh berasan — shohning ortida esa yana bir dona yashirinib turibdi.",
    hint: "Chiziq boʻylab shunday shoh ber-ki, shoh chekinsin, uning ortida esa boshqa dona ochilib qolsin.",
  },
  discovered: {
    name: "Ochiq shoh",
    about: "Bir dona chiziqdan chetga chiqadi — va boshqa donaning zarbasiga yoʻl ochadi.",
    hint: "Donang oʻzingning boshqa donang bilan raqib shohi orasida turibdi. Uni tahdid bilan chetga olib chiq — shohni orqadagi dona beradi.",
  },
  doublecheck: {
    name: "Qoʻsh shoh",
    about: "Ikki dona birdaniga shoh beradi. Toʻsib ham, ikkalasini urib ham boʻlmaydi — shoh faqat qochishi mumkin.",
    hint: "Shunday yurish top-ki, undan keyin ikki dona birdaniga shoh bersin: yurgan dona ham, u yoʻl ochib bergan dona ham.",
  },
  promotion: {
    name: "Piyodaning aylanishi",
    about: "Piyoda taxtaning narigi chetiga yetib boradi va farzinga aylanadi.",
    hint: "Qaysi piyoda oxirgi gorizontalga eng yaqin? Unga nima xalaqit beryapti? Yoʻlini ochib ber.",
  },
  pawnend: {
    name: "Piyodali endshpil",
    about:
      "Taxtada faqat shohlar va piyodalar qolgan. Kim birinchi boʻlib piyodasini farzinga aylantirsa, odatda oʻsha yutadi.",
    hint: "Yurishlarni sanab koʻr: shoh piyodaga yetib ola oladimi? Oppozitsiyani unutma — shohlar bir katak oralab bir-biriga qarab turadi.",
  },
  stalemate: {
    name: "Mot, pat emas!",
    about: "Ehtiyot boʻl: bitta notoʻgʻri yurish — va gʻalaba oʻrniga durang.",
    hint: "Yurishingdan keyin raqib shohiga shoh berilgan boʻlishi kerak. Shoh ham, yurish ham yoʻq boʻlsa — bu pat, yaʼni durang.",
  },
  mate2: {
    name: "Ikki yurishda mot",
    about: "Birinchi yurish — tahdid yoki qurbon, ikkinchisi — raqib qanday himoyalanmasin, mot.",
    hint: "Birinchi yurish — shoh, qurbon yoki jimgina tahdid. Tekshirib koʻr: undan keyin raqib qanday himoyalana oladi?",
  },
  smothered: {
    name: "Boʻgʻiq mot",
    about: "Shohni oʻz donalari oʻrab olgan, ot esa toʻsib boʻlmaydigan mot qiladi.",
    hint: "Raqib shohi oʻz donalari orasida siqilib qolgan. Qaysi ot yurishi shoh beradi? Balki avval raqib donasini oxirgi boʻsh katakka kelishga majbur qilish kerakdir?",
  },
  trapped: {
    name: "Qamalgan dona",
    about: "Raqib donasining chekinadigan joyi yoʻq. Unga hujum qil — u seniki.",
    hint: "Boʻsh kataklari kam qolgan raqib donasini top. Shunday hujum qil-ki, uning qochadigan joyi qolmasin.",
  },
  defender: {
    name: "Himoyachini yoʻqot",
    about: "Qoʻriqlab turgan donani urib ol yoki haydab yubor — u himoya qilgan narsa himoyasiz qoladi.",
    hint: "Raqibning muhim donasini yoki katagini nima himoya qilyapti? Avval oʻsha himoyachini yoʻqot.",
  },
  deflection: {
    name: "Chalgʻitish",
    about: "Raqib donasini muhim joyidan ketishga majbur qil — va boʻshab qolgan joydan foydalan.",
    hint: "Raqibning qaysi donasi himoyani yolgʻiz oʻzi ushlab turibdi? Unga urib olish imkonini yoki eʼtiborsiz qoldirib boʻlmaydigan tahdidni taklif qil.",
  },
  attraction: {
    name: "Jalb qilish",
    about: "Qurbon berib, shohni yoki donani yomon katakka chaqirib olasan — u yerda esa uni zarba kutib turadi.",
    hint: "Qurbon berib, shohni yoki donani vilka, bogʻlash yoki mot kutib turgan katakka chaqirib olsa boʻladimi?",
  },
  defense: {
    name: "Himoya",
    about: "Raqib zarba tayyorlayapti. Qutqaradigan yurishni top.",
    hint: "Avval raqibning tahdidini top: u keyingi yurishda nima qilmoqchi? Keyin shu tahdidni qaytaradigan yurishni izla.",
  },
  mate3: {
    name: "Uch yurishda mot",
    about: "Ketma-ket uchta aniq yurish — va raqibga mot. Baʼzi kombinatsiyalar mashhur partiyalardan olingan.",
    hint: "Kuchli yurishlarni izla: shoh berish, urib olish, tahdid. Har bir yurishing raqibga iloji boricha kamroq tanlov qoldirsin.",
  },
};

export const puzzlesUz: Uz<ChessPuzzle[]> = {
  // --- Мат в 1 ход -----------------------------------------------------------
  "m1-backrank": {
    title: "Oxirgi gorizontal",
    hint: "Qora shohni oʻzining piyodalari qamab qoʻygan. Qoralarning ruxi sakkizinchi gorizontalni qoʻriqlab turibdi — lekin bitta rux yetarmikan?",
    explanation:
      "♖xd8#: rux raqib ruxini urib, shoh beradi. Ikkinchi rux esa e1 da turib, shohni tashqariga chiqarmaydi... toʻgʻrisi, shohning chiqadigan joyi ham yoʻq: f7, g7 va h7 ni oʻz piyodalari egallab olgan.",
  },
  "m1-scholar": {
    title: "Bolalar moti",
    hint: "f7 katakka ikkita oq dona hujum qilyapti, uni esa faqat shoh himoya qiladi.",
    explanation:
      "♕xf7#: farzin piyodani urib, shoh beradi. Farzinni c4 dagi fil himoya qiladi, shohning esa qochadigan joyi yoʻq.",
  },
  "m1-queen-king": {
    title: "Shoh farzinga yordam beradi",
    hint: "Oq shoh qora shohdan g7 va g8 kataklarini allaqachon tortib olgan. Endi farzin shunday shoh berishi kerakki, h7 ham qolmasin.",
    explanation:
      "Bu yerda bir nechta yurish mot qiladi: masalan, ♕g7#, ♕g8# yoki ♕h1#. Eng muhimi — shoh bilan farzin birga ishlaydi.",
  },
  "m1-ladder": {
    title: "Narvon",
    hint: "Bitta rux yettinchi gorizontalni allaqachon toʻsib qoʻygan. Ikkinchisi sakkizinchi gorizontal boʻylab shoh berishi kerak.",
    explanation:
      "♖g8#: g1 dagi rux g8 ga yuradi — sakkizinchi gorizontal boʻylab shoh, yettinchisini esa h7 dagi rux ushlab turibdi. «Narvon» moti mana shunday qilinadi.",
  },
  "m1-queen-rank": {
    title: "Farzin oxirgi chiziqda",
    hint: "f7, g7 va h7 dagi piyodalar shohni qochirmaydi. Shohga qaysi chiziq ochiq?",
    explanation:
      "♕e8#: sakkizinchi gorizontal boʻylab shoh. Shoh farzinni ura olmaydi — u uzoqda, qochishga esa joy yoʻq.",
  },
  "m1-rook-king": {
    title: "Shohga qarshi shoh",
    hint: "Oq shoh qora shohning roʻparasida turib, d7, e7 va f7 kataklarini ushlab turibdi. Endi rux sakkizinchi gorizontalni yopsa bas.",
    explanation:
      "♖h8#: sakkizinchi gorizontal boʻylab shoh. Yettinchi gorizontalga esa shoh chiqa olmaydi — u yerda uni oq shoh kutib turibdi.",
  },
  "m1-queen-opposition": {
    title: "Shohlar yuzma-yuz",
    hint: "c7, d7 va e7 kataklarini oq shoh ushlab turibdi. Farzin sakkizinchi gorizontal boʻylab shoh berishi kerak.",
    explanation:
      "♕g8#: sakkizinchi gorizontal boʻylab shoh. c8 va e8 kataklari ham farzinning zarbasi ostida, oldinga esa oq shoh yoʻl bermaydi.",
  },
  "m1-bishop-rook": {
    title: "Fil va rux",
    hint: "g1 dagi rux butun g vertikalini ushlab turibdi. Shoh berish uchun fil qaysi diagonalga chiqishi kerak?",
    explanation: "♗c3#: fil a1–h8 katta diagonaliga chiqib, shoh beradi. g7 va g8 kataklarini esa rux ushlab turibdi.",
  },
  "m1-arabian": {
    title: "Arab moti",
    hint: "f6 dagi ot g8 va h7 kataklarini ushlab turibdi. Rux qayerga turishi kerakki, ot uni himoya qilsin?",
    explanation:
      "♖h7#: rux shohning yonginasida turib shoh beradi. Ot ruxni himoya qiladi va shu bilan birga shohdan g8 katagini ham tortib oladi. Bu motni bundan ming yil oldin Bagʻdodda ham bilishgan.",
  },
  "m1-two-bishops": {
    title: "Ikki fil",
    hint: "Oq katakli fil g8 katagini, shoh esa g7 va h7 ni ushlab turibdi. Qora katakli fil qayerga turishi kerak?",
    explanation:
      "♗b2#: fil katta diagonal boʻylab shoh beradi. Qochadigan hamma kataklarni esa ikkinchi fil bilan shoh yopib qoʻygan.",
  },
  "m1-black-rank": {
    title: "Qoralar yuradi",
    hint: "Bu safar oq shoh qamalib qolgan. Unga qaysi chiziq ochiq?",
    explanation: "♖a1#: rux birinchi gorizontal boʻylab shoh beradi. f2, g2 va h2 dagi piyodalar shohni chiqarmaydi.",
  },
  "m1-fools": {
    title: "Ahmoqona mot",
    hint: "Oqlar e1–h4 diagonalini ochib qoʻyishdi. Qoralarning qaysi donasi bundan foydalana oladi?",
    explanation:
      "♕h4#: farzin diagonal boʻylab shoh beradi. Toʻsadigan dona yoʻq, farzinni uradigan ham yoʻq. Bu — shaxmatdagi eng tez mot.",
  },
  "m1-promotion": {
    title: "Aylanish va mot",
    hint: "Piyoda yettinchi gorizontalda turibdi. Uni qaysi donaga aylantirsang, qutulib boʻlmaydigan shoh chiqadi?",
    explanation:
      "f8=♕# (yoki f8=♖#): yangi dona sakkizinchi gorizontal boʻylab shoh beradi, h7 katagini esa oq shoh ushlab turibdi.",
  },

  // --- Мат в 2 хода ----------------------------------------------------------
  "m2-king-queen": {
    title: "Shoh yaqinlashadi",
    hint: "Farzin yolgʻiz oʻzi mot qila olmaydi: avval shohni yaqinlashtir, qora shohdan kataklarni tortib ol.",
    explanation:
      "1.♔g6 ♔g8 2.♕b8#: oq shoh qora shohdan g7 va h7 kataklarini tortib oladi, farzin esa sakkizinchi gorizontal boʻylab mot qiladi.",
  },
  "m2-two-rooks": {
    title: "Ikki rux bittaga qarshi",
    hint: "Sakkizinchi gorizontalni bitta qora rux himoya qilyapti. d vertikalida esa oqlarning ikkita ruxi bor.",
    explanation:
      "1.♖d8+ ♖xd8 2.♖xd8#: birinchi rux himoyachini yoʻqotish uchun qurbon qilinadi, ikkinchisi esa mot qiladi.",
  },
  "m2-black-rooks": {
    title: "Qoralar yuradi: ikki rux",
    hint: "Gʻoya xuddi oʻsha, faqat bu safar qoralar uchun: oqlarning birinchi gorizontalini bitta rux himoya qilyapti.",
    explanation: "1…♖d1+ 2.♖xd1 ♖xd1#: birinchi rux qurbon boʻlib, himoyachini yoʻqotadi, ikkinchi rux esa mot qiladi.",
  },
  "m2-king-rook": {
    title: "Rux va shoh",
    hint: "Rux g vertikalini ushlab turibdi. Shohni shunday yaqinlashtirki, qora shohga bitta katak qolsin. Keyin esa h vertikali boʻylab shoh ber.",
    explanation:
      "1.♔f7 ♔h7 2.♖h1#: oq shoh yurgach, qora shohga faqat h7 qoladi, rux esa h vertikali boʻylab mot qiladi.",
  },
  "m2-promotion": {
    title: "Piyodadan farzin",
    hint: "Avval piyodani farzinga aylantirib, shoh ber. Keyin yangi farzin bilan shoh birga mot qiladi.",
    explanation:
      "1.f8=♕+ ♔h7 2.♕g7#: farzin qora shohning yonginasida mot qiladi, chunki uni oq shoh himoya qilib turibdi.",
  },
  "m2-smothered": {
    title: "Boʻgʻiq mot",
    hint: "Raqib shohini oʻzining piyodalari qisib qoʻygan. Agar g8 katakda qora dona tursa, ot f7 dan mot qilardi. Ruxni g8 ga kelishga qanday majbur qilasan?",
    explanation:
      "1.♕g8+!! ♖xg8 2.♘f7#: farzin qurbon qilinib, ruxni g8 ga tortib keladi, ot esa boʻgʻiq mot qiladi — shohni oʻzining donalari oʻrab olgan.",
  },
  "m2-anastasia": {
    title: "Anastasiya moti",
    hint: "e7 dagi ot g8 va g6 kataklarini ushlab turibdi. Agar h vertikalini ochsang, rux mot qiladi. Nima xalaqit beryapti? h7 dagi piyoda.",
    explanation:
      "1.♕xh7+!! ♔xh7 2.♖h3#: farzin h vertikalini ochish uchun qurbon qilinadi, rux esa uchinchi gorizontal boʻylab h3 ga oʻtib, mot qiladi.",
  },
  "m2-opera": {
    title: "Operadagi partiya",
    hint: "d1 dagi rux d7 dagi ot orqali shohga qarab turibdi. Otni d vertikalidan shoh berib qanday ketkazish mumkin?",
    explanation:
      "1.♕b8+!! ♘xb8 2.♖d8#: farzin qurbon qilinib, otni chalgʻitadi, rux esa mot qiladi — e7 katagini g5 dagi fil ushlab turibdi.",
    source: "Morfi — Braunshveyg gersogi va graf Izuar, Parij, 1858",
  },
  "m3-reti": {
    title: "Reti qurboni",
    hint: "Qora shoh hali markazda, d1 dagi rux bilan d2 dagi fil esa unga qarab turibdi. Birinchi yurish — shoh berib, farzinni qurbon qilish.",
    explanation: "1.♕d8+!! ♔xd8 2.♗g5+ (qoʻsh shoh!) ♔c7 3.♗d8# — agar 2…♔e8 boʻlsa, unda 3.♖d8#.",
    source: "Reti — Tartakover, Vena, 1910",
  },

  // --- Выигрыш материала -----------------------------------------------------
  "hang-knight": {
    title: "Himoyasiz ot",
    hint: "Qora ot markazga sakrab chiqdi, lekin uni hech kim himoya qilmayapti. Uni kim ura oladi?",
    explanation: "dxe4: piyoda otni tekinga urib oladi. Urishdan oldin har doim tekshirib koʻr: dona himoyalanganmi?",
  },
  "hang-knight-black": {
    title: "Qoralar yuradi: markazdagi ot",
    hint: "Oq ot e5 dagi piyodani urib oldi, lekin himoyasiz qoldi. ♘xe4 dan ham yaxshiroq yurish bor.",
    explanation:
      "dxe5: piyoda otni urib oladi. e4 dagi piyodani ot bilan urish — bor-yoʻgʻi bir ochko, ot esa uch ochkoga teng.",
  },
  "fork-knight": {
    title: "Ot bilan vilka",
    hint: "Shunday katak topki, u yerdan ot ham shohga, ham farzinga hujum qilsin.",
    explanation:
      "♘f6+: ot shoh beradi va d7 dagi farzinga ham hujum qiladi. Shoh qochadi — ot esa farzinni urib oladi.",
  },
  "fork-pawn": {
    title: "Piyoda bilan vilka",
    hint: "Kichkina piyoda ham birdaniga ikki donaga hujum qila oladi. d6 dagi ot bilan f6 dagi filga qara.",
    explanation:
      "e5: piyoda ham otga, ham filga hujum qiladi. Ikkalasini qutqarib boʻlmaydi, agar fil piyodani ursa — uni f3 dagi ot urib oladi.",
  },
  "fork-rook": {
    title: "Rux bilan vilka",
    hint: "Sakkizinchi gorizontal boʻylab shoh — bu chiziqda yana nima turibdi?",
    explanation:
      "♖e8+: rux shoh beradi, oʻsha chiziqda esa g8 dagi ot ham bor. Shoh chetga chiqadi — rux otni urib oladi.",
  },
  "pin-queen": {
    title: "Farzinni bogʻlash",
    hint: "Qoralarning farzini bilan shohi bitta chiziqda turibdi. Ruxni shunday qoʻyki, farzin qocha olmasin.",
    explanation:
      "♖e1: farzin bogʻlandi — e vertikalidan keta olmaydi, orqasida shoh turibdi. Rux farzinni urib oladi (yoki farzin ruxni uradi, oq shoh esa farzinni urib oladi — baribir foydali).",
  },
  "skewer-bishop": {
    title: "Fil bilan rentgen",
    hint: "Qoralarning shohi bilan ruxi bitta diagonalda turibdi. Shu diagonal boʻylab shoh ber.",
    explanation:
      "♗b2+: fil katta diagonal boʻylab shoh beradi. Shoh qochishga majbur — fil esa h8 dagi ruxni urib oladi.",
  },
  "skewer-rook": {
    title: "Rux bilan rentgen",
    hint: "Qoralarning shohi bilan farzini bitta vertikalda. Shu vertikal boʻylab shoh ber!",
    explanation:
      "♖b8+: b vertikali boʻylab shoh. Shoh chetga qochadi — rux farzinni urib oladi. Farzin ruxni ura olmaydi: oʻz shohi toʻsib turibdi.",
  },
  "discovered-check": {
    title: "Ochiq shoh",
    hint: "b2 dagi fil shohga qarab turibdi, ammo yoʻlini ot toʻsib qoʻygan. Otni shunday yurgizki, u yoʻldan chiqib, farzinga hujum qilsin.",
    explanation:
      "♘f7+ (yoki ♘c6+): ot yoʻldan chiqadi — endi fil shoh beradi, ot esa oʻzi farzinga hujum qiladi. Qoʻsh shoh — shoh qochishi shart, ot esa farzinni urib oladi.",
  },

  // --- Мат, а не пат ---------------------------------------------------------
  "stale-queen-1": {
    title: "Ehtiyot boʻl, pat!",
    hint: "Bir yurishda mot top. Lekin tekshirib koʻr: sening yurishingdan keyin qoralarga shoh berilgan boʻlishi kerak, shunchaki «yurish yoʻq» emas.",
    explanation:
      "♕c8# yoki ♕a7#. ♕c7?? yoki ♕b5?? esa — pat: qora shoh hech qayerga yura olmaydi, lekin unga shoh ham berilmagan. Durang!",
  },
  "stale-queen-2": {
    title: "Yana pat haqida",
    hint: "Mot yo sakkizinchi gorizontal boʻylab shoh bilan, yo shohning yonginasiga turgan farzin bilan qilinadi. ♕f7 dan keyin-chi, nima boʻladi?",
    explanation:
      "Masalan, ♕f8# yoki ♕g7#. ♕f7?? yurishi esa — pat: shohning yuradigan joyi yoʻq, lekin shoh ham berilmagan.",
  },
};
