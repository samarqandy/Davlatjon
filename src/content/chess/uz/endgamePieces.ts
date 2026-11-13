import type { Uz } from "../../localize";
import type { ENDGAME_PIECES, ENDGAME_PIECES_SCHOOL } from "../endgamePieces";

export const endgamePiecesSchoolUz: Uz<typeof ENDGAME_PIECES_SCHOOL> = {
  title: "Endshpil: rux, farzin va fil",
  subtitle: "Yoddan bilish kerak boʻlgan beshta pozitsiya",
  about:
    "Rux endshpilida «koʻprik» va Filidor pozitsiyasi, farzin piyodaga qarshi, pat bilan qutulish, «notoʻgʻri rangli» fil. Har bir mavzuda — qisqa dars va mashqlar: qaysi yurish yutadi, qaysisi gʻalabani qoʻldan chiqaradi.",
};

export const endgamePiecesUz: Uz<typeof ENDGAME_PIECES> = {
  "eg-lucena": {
    title: "Koʻprik",
    idea: "Piyoda farzinga bir qadam qoldi, lekin shoh uning oldida qamalib qolgan. «Koʻprik» yutadi: rux shohni toʻsadi va unga boshqa shoh berib boʻlmaydi.",
    lesson: [
      {
        title: "Shoh piyoda oldida qamalgan",
        text: [
          "Oqlarda ortiqcha piyoda bor, u allaqachon yettinchi gorizontalda. Lekin oq shoh uning oldida turibdi va chiqa olmaydi: chetga qadam qoʻyishi bilan qora rux shoh bera boshlaydi.",
          "Bunday holat **Lusena pozitsiyasi** deb ataladi. U yutuqli — agar **koʻprik** degan usulni bilsang.",
        ],
      },
      {
        title: "Koʻprik tayanchi",
        text: [
          "Avval shoh berib, qora shohni piyodadan uzoqroqqa haydaymiz. Keyin ruxni **toʻrtinchi gorizontalga** qoʻyamiz — bu boʻlajak koʻprikning tayanchi.",
          "Endi shoh piyoda oldidan chiqadi va shoh berayotgan rux tomon yuradi: yettinchi gorizontaldan oltinchiga, oltinchidan beshinchiga.",
        ],
      },
      {
        title: "Koʻprik",
        text: [
          "Shoh beshinchi gorizontalga yetib, oʻz ruxining yoniga turdi. Yana shoh berildi — rux shohni toʻsadi. Koʻprik mana shu.",
          "Shoh berishlar tugadi, piyodani endi toʻxtatib boʻlmaydi. Lekin shoshilma: shoh ruxdan uzoqda boʻlsa, toʻsishga hali erta — ruxni shunchaki urib olishadi.",
        ],
      },
    ],
    terms: [
      {
        term: "Lusena pozitsiyasi",
        text: "Ruxga qarshi rux va yettinchi gorizontaldagi piyoda; shoh piyoda oldida turadi.",
      },
      { term: "Koʻprik", text: "Rux oʻz shohi bilan shoh berayotgan rux orasiga turadi — shoh berishlar tugaydi." },
    ],
    exercises: {
      "eg-lucena-king": {
        title: "Hali erta",
        prompt: "Oqlarga shoh berildi. Qanday oʻynagan yaxshi?",
        hint: "Shoh oʻz ruxidan hali uzoqda. Ruxni kim himoya qiladi?",
        why: "♔e5! Shoh ruxga yaqinlashadi: yana shoh berilsa, rux uni e4 da toʻsadi. ♖f4? hali erta — ruxni hech kim himoya qilmaydi: ♜xf4+, gʻalaba qoʻldan ketdi.",
      },
      "eg-lucena-bridge": {
        title: "Koʻprik qurildi",
        prompt: "Oqlarga yana shoh berildi. Qanday oʻynagan yaxshi?",
        hint: "Shoh endi ruxning yonida. Rux bilan toʻsil — shoh berishlar tugaydi.",
        why: "♖e4! Koʻprik qurildi: rux shohni toʻsdi, e7 piyodani endi toʻxtatib boʻlmaydi. ♔f5? dan keyin shoh piyodani tashlab ketdi: ♜xe7 — durang.",
      },
    },
  },
  "eg-philidor": {
    title: "Filidor pozitsiyasi",
    idea: "Piyodasiz himoya: rux raqib shohi oldidagi gorizontalni ushlab turadi, piyoda yurganda esa orqadan shoh beradi.",
    lesson: [
      {
        title: "Rux qorovulda",
        text: [
          "Raqibda ortiqcha piyoda bor, lekin sening shohing uning oldida turibdi. Durang qilish uchun raqib shohini oldinga oʻtkazma: ruxni u qadam qoʻymoqchi boʻlgan gorizontalga qoʻy va undan ketma.",
          "Bu himoya usuli XVIII asr shaxmatchisi — fransuz Filidor nomi bilan ataladi. Asosiy xato — ruxni oxirgi gorizontalga olib ketib, shunchaki kutish: bunday passiv himoya bu yerda yutqazadi.",
        ],
      },
      {
        title: "Piyoda yurdi — rux orqaga",
        text: [
          "Ruxni haydash uchun raqib piyodani surishga majbur. Lekin shunda uning shohi yashirinadigan joysiz qoladi: avval u oʻz piyodasi oldiga tura olardi, endi esa bu katak band.",
          "Rux darhol birinchi gorizontalga ketadi va orqadan shoh beradi. Durang!",
        ],
      },
    ],
    terms: [
      {
        term: "Filidor pozitsiyasi",
        text: "Rux endshpilidagi durang himoyasi: shoh piyoda oldida, rux raqib shohini oldinga oʻtkazmaydi.",
      },
      { term: "Passiv himoya", text: "Rux oxirgi gorizontalda turib, shohni faqat motdan qoʻriqlaydi." },
    ],
    exercises: {
      "eg-philidor-wait": {
        title: "Rux chiziqni ushlaydi",
        prompt: "Oqlarda ortiqcha piyoda. Durangni qanday saqlash mumkin?",
        hint: "Oq shoh e6 ga oʻtmoqchi. Uni kim oʻtkazmayapti?",
        why: "♜g6! Rux oltinchi gorizontalda qoladi va shohni e6 ga oʻtkazmaydi — durang. Passiv ♜h8? yutqazadi: oq shoh oldinga oʻtib oladi.",
      },
      "eg-philidor-back": {
        title: "Orqadan shoh berish",
        prompt: "Piyoda d6 ga yurdi. Durangni qanday saqlash mumkin?",
        hint: "Oq shohning yashirinadigan joyi qolmadi. Unga qayerdan shoh berish kerak?",
        why: "♜h1! Rux orqadan shoh beradi, shohning esa pana joyi yoʻq — durang. ♜xd6? ♔xd6 — rux yoʻqotildi.",
      },
    },
  },
  "eg-queen-pawn": {
    title: "Farzin piyodaga qarshi",
    idea: "Piyoda farzinga aylanishiga bir qadam qoldi. Farzin shoh bera-bera qora shohni piyoda oldiga haydaydi — va oʻz shohini yaqinlashtiradi.",
    lesson: [
      {
        title: "Shoh berish zinapoyasi",
        text: [
          "Piyoda oxiridan oldingi gorizontalda, yonida shohi bor. Agar u farzinga aylansa — durang. Yolgʻiz farzin mot qila olmaydi, shoh kerak. Lekin uning yetib kelishiga vaqtni qayerdan olamiz?",
          "Farzin shoh berib, tobora yaqinlashadi — qora shohga bitta yoʻl qolguncha: **oʻz piyodasining oldiga** turish. Piyoda qamaldi — oq shoh bir qadam tashlaydi.",
        ],
      },
      {
        title: "Piyodani vaqtidan oldin olma",
        text: [
          "Keyin hammasi takrorlanadi: shoh berishlar, qora shoh yana piyoda oldida, oq shohning yana bir qadami. Shoh yetib kelgach, piyoda olinadi yoki mot qilinadi.",
          "Lekin undan oldin emas: piyodani shohi himoya qilib turganda farzin uni olsa, farzinning oʻzi uriladi.",
        ],
      },
    ],
    terms: [
      {
        term: "Shoh berish zinapoyasi",
        text: "Farzin shoh bera-bera shohga yaqinlashadi, toki u oʻz piyodasining oldiga turmaguncha.",
      },
    ],
    exercises: {
      "eg-queen-pawn-check": {
        title: "Avval shoh",
        prompt: "Piyoda hozir farzin boʻladi. Qanday oʻynagan yaxshi?",
        hint: "Shoh bilan yursang, piyoda farzinga aylanadi. Shoh berishni top.",
        why: "♕e3+! Piyodani yoʻqotmaslik uchun qora shoh uning oldiga turadi — oq shoh faqat shundan keyin yuradi. ♔b7? d1♛ — qoralarda ham farzin, durang.",
      },
      "eg-queen-pawn-king": {
        title: "Endi shoh",
        prompt: "Qora shoh piyoda oldiga turdi. Qanday oʻynagan yaxshi?",
        hint: "Piyodani oʻz shohi qamab qoʻydi. Oqlarda boʻsh yurish bor.",
        why: "♔b7! Piyoda yura olmaydi, oq shoh esa bir qadam yaqinlashadi. ♕xd2+? ♚xd2 — farzin yoʻqotildi, durang.",
      },
    },
  },
  "eg-queen-rook-pawn": {
    title: "Chekka piyoda va fil piyodasi",
    idea: "Chekka piyoda va fil piyodasiga qarshi zinapoya ish bermaydi: kuchsiz tomonni pat qutqaradi.",
    lesson: [
      {
        title: "Shoh burchakda",
        text: [
          "Chekka piyoda bilan («a» yoki «h» chizigʻida) shoh berish zinapoyasi yordam bermaydi. Qora shoh piyoda oldidagi burchakka yashirinadi — va endi uning yuradigan joyi yoʻq. Oq shoh bir qadam tashlashi bilan taxtada **pat**.",
          "Oqlar farzinni olib ketishga majbur, shoh burchakdan chiqadi — va hammasi boshidan boshlanadi. Durang.",
        ],
      },
      {
        title: "Fil piyodasi",
        text: [
          "Fil piyodasi bilan («c» yoki «f» chizigʻida) hiyla boshqacha. Shoh burchakka ketadi va **piyodani tashlab qoʻyadi**: farzin uni olsa — pat.",
          "Shuning uchun eslab qol: markaziy piyoda va ot piyodasini farzin toʻxtatadi, chekka piyoda va fil piyodasini esa — odatda yoʻq.",
        ],
      },
    ],
    terms: [
      { term: "Chekka piyoda", text: "Chekka chiziqdagi piyoda — «a» yoki «h»." },
      {
        term: "Fil piyodasi",
        text: "«c» yoki «f» chizigʻidagi piyoda — partiya boshida fillar turadigan chiziqlar.",
      },
    ],
    exercises: {
      "eg-queen-rook-pawn-corner": {
        title: "Burchakka!",
        prompt: "Qoralarga shoh berildi. Shoh qayerga ketsin?",
        hint: "Shoh qayerda yurishi qolmaydigan uychaga kirib oladi?",
        why: "♚h1! Shoh burchakda, yurishi yoʻq: oq shoh bir qadam tashlashi bilan — pat. ♚f1? ♕xh2 — piyoda yoʻqotildi.",
      },
      "eg-queen-rook-pawn-quiz": {
        title: "Pat qutqaradi",
        prompt: "Taxtaga qarab javob ber.",
        hint: "Qora shohning bitta boʻlsa ham yurishi bormi — tekshir.",
        why: "♕xf2 dan keyin qoralarning yurishi yoʻq, shoh ham berilmagan — pat. Chekka piyodada pat shoh burchakda oʻz piyodasi bilan qamalib qolganda chiqadi.",
        questions: [
          {
            text: "Farzin f2 dagi piyodani oladi. Nima boʻladi?",
            options: ["oqlar gʻalabasi", "pat"],
          },
          {
            text: "Shoh b7 ga qadam tashladi. Taxtada nima?",
            options: ["pat", "qoralarda yurish bor"],
          },
          {
            text: "Oxiridan oldingi gorizontaldagi qaysi piyodalarga qarshi farzin odatda yuta olmaydi?",
            options: ["markaziy piyoda va ot piyodasiga", "chekka piyoda va fil piyodasiga"],
          },
        ],
      },
    },
  },
  "eg-wrong-bishop": {
    title: "Fil va chekka piyoda",
    idea: "«Notoʻgʻri rangli» fil: kuchsiz tomon shohi burchakka ulgursa, ortiqcha fil va piyoda yuta olmaydi.",
    lesson: [
      {
        title: "Burchak boshqa rangda",
        text: [
          "Oqlarda ortiqcha fil va chekka piyoda bor — gʻalaba oson koʻrinadi. Lekin piyoda qaysi katakda farzinga aylanishiga qara. Agar fil **boshqa rangdagi** kataklarda yursa, shohni burchakdan hayday olmaydi.",
          "Kuchsiz tomon shohi burchakka yetib olib, oʻsha yerda u yoq-bu yoqqa yursa, bas. Durang!",
        ],
      },
      {
        title: "Toʻgʻri rangli fil",
        text: [
          "Agar fil aylanish burchagi bilan bir xil rangdagi kataklarda yursa, u shohni haydaydi — va piyoda oʻtadi.",
          "Lekin bu yerda ham tuzoq bor: shoh bermasdan piyodani shohga taqab qoʻyma — pat boʻladi.",
        ],
      },
    ],
    terms: [
      {
        term: "Notoʻgʻri rangli fil",
        text: "Oʻz chekka piyodasi farzinga aylanadigan burchak katagiga hujum qila olmaydigan fil.",
      },
    ],
    exercises: {
      "eg-wrong-bishop-run": {
        title: "Burchakka yugur",
        prompt: "Oqlarda fil va piyoda. Qanday qutulish mumkin?",
        hint: "Piyoda a8 ga — oq katakka boradi. Oqlarning fili qanaqa?",
        why: "♚b8! Shoh a8 burchagiga ulguradi. Fil qora kataklarda yuradi va oq burchakka yeta olmaydi — durang. ♚d8? burchakdan uzoqlashadi, piyoda farzinga aylanadi.",
      },
      "eg-wrong-bishop-stalemate": {
        title: "Toʻgʻri rangli fil",
        prompt: "Endi fil oq kataklarda yuradi. Qanday oʻynagan yaxshi?",
        hint: "Piyoda yursa, qora shohning birorta yurishi qolmaydi — shoh ham berilmagan.",
        why: "♗e4+! Fil shohni burchakdan haydaydi: ♚b8, a7+ ♚c8, a8♕+. a7? dan keyin esa qoralarning yurishi yoʻq, shoh ham berilmagan — pat.",
      },
    },
  },
};
