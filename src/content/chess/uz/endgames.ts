import type { Uz } from "../../localize";
import type { ENDGAME_LESSONS, ENDGAME_MATES, ENDGAME_SCHOOL } from "../endgames";

export const endgameSchoolUz: Uz<typeof ENDGAME_SCHOOL> = {
  title: "Endshpil maktabi",
  subtitle: "Shoh va piyoda yolgʻiz shohga qarshi",
  about:
    "Taxtada deyarli hech kim qolmaganda partiyani piyodani farzinga olib chiqish — yoki uni oʻtkazmaslik mahorati hal qiladi. Uchta asosiy usul, har biriga masalalar va birorta ham xato qilmaydigan robot bilan oʻyin.",
};

export const endgamesUz: Uz<typeof ENDGAME_LESSONS> = {
  square: {
    title: "Kvadrat qoidasi",
    idea: "Shoh piyodaga yetib oladimi? Yurishlarni sanab oʻtirma — kvadrat chiz.",
    text: [
      "Piyoda farzin boʻlishga shoshilyapti, raqib shohi esa uni quvib yetmoqchi. Yurishlarni sanash uzoq — tezroq yoʻli bor.",
      "Xayolan kvadrat chiz: uning bir tomoni — piyodaning oʻz katagidan oxirgi gorizontalgacha boʻlgan yoʻli, ikkinchi tomoni — xuddi shunday uzunlikda shoh tomonga.",
      "Agar shoh kvadrat ichida boʻlsa yoki oʻz yurishida unga qadam qoʻya olsa — piyodaga yetib oladi. Aks holda piyoda farzin boʻladi.",
      "Ikki nozik jihat bor. Agar hozir piyodaning yurishi boʻlsa, avval uni bir katak surib qoʻy, keyin kvadratni chiz. Boshlangʻich katagidan esa piyoda birdaniga ikki katak sakraydi — shuning uchun uni goʻyo bir katak oldinda turgandek hisobla.",
    ],
    demo: {
      caption: "a4 piyodaning kvadrati — a4 dan e8 gacha. Qoralar yuradi: shoh e4 ga qadam qoʻyib, kvadratga kiradi.",
    },
    drills: {
      "square-1": {
        prompt: "Qoralar yuradi. Shoh piyodaga yetib oladimi?",
        why: "a4 piyodaning kvadrati — a4 dan e8 gacha. Shoh f3 dan e4 ga oʻtadi va kvadrat ichiga tushadi: yetib oladi.",
      },
      "square-2": {
        prompt: "Xuddi shu holat, lekin endi oqlar yuradi. Shoh endi ham yetib oladimi?",
        why: "Avval piyoda yuradi: a5. Endi kvadrat a5 dan d8 gacha, f3 dagi shoh esa unga kira olmaydi. Bitta yurish hammasini hal qildi!",
      },
      "square-3": {
        prompt: "Qoralar yuradi. Shoh piyodaga yetib oladimi?",
        why: "c4 piyodaning kvadrati — c4 dan g8 gacha. g5 dagi shoh allaqachon ichkarida: yetib oladi.",
      },
      "square-4": {
        prompt: "Qoralar yuradi. Shoh piyodaga yetib oladimi?",
        why: "Kvadrat — c4 dan g8 gacha. h2 dagi shoh faqat uchinchi gorizontalga qadam qoʻya oladi, kvadrat esa toʻrtinchisidan boshlanadi. Yetib ololmaydi.",
      },
      "square-5": {
        prompt: "Qoralar yuradi. Ayyorona savol: piyoda hali boshlangʻich katagida. Shoh yetib oladimi?",
        why: "Boshlangʻich katakdan piyoda birdaniga b4 ga sakraydi, shuning uchun kvadratni b3 dan hisoblaymiz: b3 dan g8 gacha. h1 dagi shoh faqat ikkinchi gorizontalga oʻta oladi — kvadratdan pastda. Yetib ololmaydi!",
      },
    },
  },
  opposition: {
    title: "Oppozitsiya",
    idea: "Shohlar bir katak oraliqda yuzma-yuz turibdi. Shu paytda yurish navbati kimda boʻlmasa, oʻsha kuchliroq.",
    text: [
      "Shohlar yonma-yon tura olmaydi. Ular orasida roppa-rosa bitta katak qolganda, goʻyo peshonama-peshona tiralib qolishadi: hech biri oldinga qadam qoʻya olmaydi.",
      "Bunday holat **oppozitsiya** deyiladi. Hozir kimning yurishi boʻlsa, oʻsha yoʻl berishga majbur — yon tomonga yoki orqaga chekinadi. Shaxmatchilar aytadi: oppozitsiya oxirgi yurishni qilgan tomonda.",
      "«Shoh va piyoda yolgʻiz shohga qarshi» endshpilida hammasini oppozitsiya hal qiladi. Uni kuchli tomonning shohi egallasa — oldinga oʻtadi va piyodani farzinga olib chiqadi. Himoyachi egallasa — durang boʻladi.",
    ],
    demo: {
      caption:
        "Shohlar e4 va e6 da, oraliqda bitta katak. Qoralar yuradi — demak, oppozitsiya oqlarda: qora shoh chekinishga majbur.",
    },
    drills: {
      "opp-1": {
        prompt: "Oqlar yuradi. Gʻalabaga faqat bitta yurish olib boradi. Uni top!",
        hint: "Shohingni qora shohning roppa-rosa roʻparasiga, bir katak oraliqda qoʻy.",
        why: "♔e4! Shohlar yuzma-yuz keldi, yurish esa qoralarda — ular yoʻl berishga majbur.",
      },
      "opp-2": {
        prompt: "Oqlar yuradi. Gʻalabani qoʻldan chiqarmaslik uchun qanday yurish kerak?",
        hint: "Shoh oʻz piyodasidan oldinda — va qora shohning roʻparasida turishi kerak.",
        why: "♔e5! Oppozitsiya, shoh esa allaqachon piyodadan oldinda. Qoralar yon tomonga chekinadi, oq shoh esa olgʻa yuradi.",
      },
      "opp-3": {
        prompt: "Endi sen himoyadasan. Qoralar yuradi: duranga olib boradigan yagona yurishni top.",
        hint: "Oq shohning roʻparasiga tur.",
        why: "♔e6! Oppozitsiya qoralarda: oq shohning yoʻli yopiq, piyoda oldinga yursa, qora shoh roppa-rosa uning oldiga turib oladi.",
      },
      "opp-4": {
        prompt: "Qoralar yuradi. Oqlar oʻtib ketmasligi uchun shoh qayerda turishi kerak?",
        hint: "Oq shoh qayerda turganiga qara va uning roʻparasiga tur.",
        why: "♔d6! Oppozitsiya: d4 dagi oq shoh oldinga qadam qoʻya olmaydi, aylanib oʻtishga esa ulgurmaydi.",
      },
    },
  },
  key: {
    title: "Shoh — piyodadan oldinda",
    idea: "Piyodani farzinga shoh olib boradi: avval u oldinga yuradi, piyoda esa ortidan.",
    text: [
      "Yolgʻiz piyoda ojiz: qora shoh uning oldiga turib oladi va piyoda qotib qoladi. Shuning uchun avval oʻz shohing oldinga yuradi.",
      "Piyodaning **kalit kataklari** bor — undan ikki gorizontal oldindagi katak va uning ikki yonidagilar. Oq shoh kalit katakka chiqib olsa, qoralar qanday himoyalanmasin, piyoda albatta farzin boʻladi.",
      "Baʼzan kalit katakka aylanib oʻtib boriladi: avval yon tomonga qadam tashlab, keyin oldinga yorib oʻtiladi.",
      "Istisnoni esda tut: chetdagi piyoda, yaʼni a yoki h vertikalidagi piyoda. Agar qora shoh uning oldidagi burchakka ulgurib kelsa — oppozitsiyasiz ham durang.",
    ],
    demo: {
      caption:
        "e3 piyodaning kalit kataklari — d5, e5 va f5. Oq shoh ulardan biriga yetib borsa — piyoda farzin boʻladi.",
    },
    drills: {
      "key-1": {
        prompt: "Oqlar yuradi. Shohni kalit katakka olib chiq.",
        hint: "e4 piyodaning kalit kataklari — d6, e6 va f6. Ulardan qaysi biriga hoziroq chiqa olasan?",
        why: "♔d6! Shoh kalit katakka chiqdi — endi piyoda farzinga yoʻl oladi, qoralar uni toʻxtata olmaydi.",
      },
      "key-2": {
        prompt: "Oqlar yuradi. Piyoda hali boshlangʻich katagida, lekin hammasini birinchi yurish hal qiladi.",
        hint: "Oppozitsiyani egalla: qora shohning roʻparasiga tur.",
        why: "♔e3! Oppozitsiya oqlarda: qoralar yoʻl beradi, oq shoh esa oldinga oʻtadi. e2 piyodaning yurishi esa zaxira yurish — u hali asqotadi.",
      },
    },
  },
  practice: {
    title: "Robot bilan oʻyna",
    idea: "Robot bu holatlarni yoddan biladi va xato qilmaydi. Usullarni oʻrganganingni tekshirib koʻr.",
    text: [
      "Bitta noaniq yurish — va holat durangga aylanadi, robot esa uni ushlab turadi. Unda qaytadan boshla va qayerda kuchliroq yurish borligini top.",
    ],
    drills: {
      "play-1": {
        prompt: "Oqlar bilan oʻynaysan. Piyodani farzinga olib chiq.",
        hint: "Birinchi yurish — oppozitsiya. Keyin esa shoh doim piyodadan oldinda boʻlsin.",
        why: "Uddalading! Oppozitsiya, shoh piyodadan oldinda — va piyoda farzin boʻldi.",
      },
      "play-2": {
        prompt: "Oqlar bilan oʻynaysan. Piyoda hali boshlangʻich katakda — yut!",
        hint: "Piyodani surishga shoshilma: u zaxira yurish boʻlib, navbatni raqibga berishga asqotadi.",
        why: "Ajoyib! Zaxira yurishni asrading va oppozitsiyani yutding.",
      },
      "play-3": {
        prompt: "Qoralar bilan oʻynaysan. Durangni ushlab tur: piyodani farzinga oʻtkazma.",
        hint: "Oppozitsiyani ushla, piyoda oldinga yursa — roppa-rosa uning oldiga tur.",
        why: "Durang! Sen oppozitsiyani ushlab turding va oqlar oʻta olmadi.",
      },
      "play-4": {
        prompt: "Qoralar bilan oʻynaysan. Chetdagi piyoda — burchakni qoʻldan berma!",
        hint: "Shoh bilan h8 va g8 oraligʻida yur. Burchakdan chiqma.",
        why: "Durang! Chetdagi piyodani burchakdan quvib chiqarib boʻlmaydi: oqlarda faqat pat chiqadi.",
      },
    },
  },
};

export const endgameMatesUz: Uz<typeof ENDGAME_MATES> = [
  { title: "Farzin bilan mot", text: "Piyoda farzin boʻldi — endi mot qil." },
  { title: "Rux bilan mot", text: "Shoh va rux yolgʻiz shohni chetga siqib boradi." },
  { title: "Ikki rux bilan mot", text: "Narvon: ruxlar navbatma-navbat qadam tashlaydi." },
];
