import type { Uz } from "../../localize";
import type { COURSE_2, COURSE_2_LESSONS, COURSE_2_MODULES } from "../course2";

export const course2Uz: Uz<typeof COURSE_2> = {
  title: "2-bosqich «Ot»",
  subtitle: "Taktika va mot — darsma-dars",
  about:
    "Bogʻlash, ochiq hujum va qoʻsh shoh yordamida mot, motga tayyorgarlik va shohga hujum, buyuk ustalarning oʻquv partiyalari. Darslar tartibi M.I. Glotovning «Shaxmat mahorati bosqichlari» metodikasi asosida; pozitsiyalar maktab uchun tuzilgan va shaxmat dvigateli bilan tekshirilgan.",
};

export const course2ModulesUz: Uz<typeof COURSE_2_MODULES> = {
  "tactic-mates": { title: "Taktika yordamida mot" },
  attack: { title: "Motga tayyorgarlik va shohga hujum" },
  games: { title: "Oʻquv partiyalari" },
};

export const course2LessonsUz: Uz<typeof COURSE_2_LESSONS> = {
  "c2-pin-mate": {
    title: "Bogʻlash yordamida mot",
    idea: "Bogʻlangan dona himoya qilmaydi: u oʻz shohini ochmasdan joyidan qimirlay olmaydi.",
    lesson: [
      {
        title: "Yordam bera olmaydigan himoyachi",
        text: [
          "«Piyoda» bosqichida **bogʻlash** nimaligini bilib oldik. Endi undan foyda olishni oʻrganamiz: bogʻlangan dona faqat himoyachiga oʻxshaydi. U qimirlay olmaydi — orqasida oʻz shohi turibdi.",
          "Shuning uchun bogʻlangan dona «himoya qilayotgan» katakda yoki u shohni toʻsishi mumkin boʻlgan joyda ham mot qilish mumkin.",
        ],
      },
    ],
    terms: [{ term: "Bogʻlangan dona", text: "Chiziqdan keta olmaydi, chunki orqasida oʻz shohi turibdi." }],
    exercises: {
      "c2-pin-mate-rook": {
        title: "Rux toʻsa olmaydi",
        prompt: "Oqlar yuradi. Mot qil.",
        hint: "f7 dagi qora ruxni c4 dagi fil bogʻlab qoʻygan. U f8 ga tura oladimi?",
        why: "♖e8# — f7 dagi rux f8 ga oʻtib shohni toʻsardi, lekin uni c4 dagi fil bogʻlab qoʻygan, u qimirlay olmaydi.",
      },
      "c2-pin-mate-queen": {
        title: "Hatto farzin ham ojiz",
        prompt: "Oqlar yuradi. Mot qil.",
        hint: "Qora farzin bogʻlangan. U shohni e8 yoki f8 da toʻsa oladimi?",
        why: "♖d8# — f7 dagi farzinni c4 dagi fil bogʻlagan: f8 yoki e8 ga oʻtsa, shohni ochib qoʻyadi, shuning uchun bunday yurish mumkin emas.",
      },
    },
  },
  "c2-discover-mate": {
    title: "Ochiq hujum bilan mot",
    idea: "Oʻz donang chiziqni toʻsib turibdi — uni olib ketsang, shohga zarba ochiladi.",
    lesson: [
      {
        title: "Chiziqni och",
        text: [
          "**Ochiq hujum** — dona chiziqdan ketib, orqasida turgan boshqa donaning zarbasini ochadi. Agar zarba shohga ochilsa, bu **ochiq shoh**.",
          "Ketayotgan dona esa bu vaqtda shohning chekinish yoʻllarini yopishi mumkin — shunda mot boʻladi.",
        ],
      },
    ],
    terms: [
      { term: "Ochiq hujum", text: "Dona chiziqdan ketib, orqasida turgan donaning zarbasini ochadi." },
      { term: "Ochiq shoh", text: "Shohga qaratilgan ochiq hujum." },
    ],
    exercises: {
      "c2-discover-mate-bishop": {
        title: "Fil yoʻl beradi",
        prompt: "Oqlar yuradi. Ochiq shoh bilan mot qil — ikki usul bor.",
        hint: "Fil ketsa, e1 dagi rux shoh beradi. Shohga f8 katagini yopish uchun fil qayerga turishi kerak?",
        why: "♗d6# yoki ♗g7# — rux e vertikali boʻylab shoh beradi, fil esa f8 ni ushlab turadi. d8 katagini oʻz rux egallagan.",
      },
      "c2-discover-mate-rank": {
        title: "Sakkizinchi gorizontaldagi rux",
        prompt: "Oqlar yuradi. Ochiq shoh bilan mot qil — fil bilan istalgan yurish toʻgʻri.",
        hint: "c8 dagi fil ruxga sakkizinchi gorizontalni toʻsib turibdi.",
        why: "Fil bilan istalgan yurish a8 dagi ruxni ochadi: sakkizinchi gorizontal boʻylab shoh, g7 va h7 piyodalari esa shohni qamab qoʻygan.",
      },
    },
  },
  "c2-double-check": {
    title: "Qoʻsh shoh bilan mot",
    idea: "Qoʻsh shoh: shohga birdaniga ikki dona hujum qiladi. Najot bitta — qochish.",
    lesson: [
      {
        title: "Bir yurishda ikki shoh",
        text: [
          "**Qoʻsh shoh** — birdaniga ikki donadan shoh: biri yurib, oʻzi shoh berdi, ikkinchisini esa ochib qoʻydi. Ikkala donani urib olish yoki ikkalasidan birdan toʻsilish mumkin emas — shoh faqat **qochishi** mumkin.",
          "Agar qochadigan joy boʻlmasa, qoʻsh shoh motga aylanadi.",
        ],
      },
    ],
    terms: [{ term: "Qoʻsh shoh", text: "Birdaniga ikki donadan shoh. Himoya bitta — shohning qochishi." }],
    exercises: {
      "c2-double-check-knight": {
        title: "Ot va rux",
        prompt: "Oqlar yuradi. Qoʻsh shoh bilan mot qil — ikki usul bor.",
        hint: "Ot e vertikalidan ketib, oʻzi ham shoh beradi — birdaniga ikkitasi shoh beradi.",
        why: "♘c7# yoki ♘g7# — ham otdan, ham e1 dagi ruxdan shoh. d8 dagi farzin va f8 dagi fil oʻz shohini qamab qoʻydi.",
      },
    },
  },
  "c2-reti-game": {
    title: "Oʻquv partiyasi: qoʻsh shoh",
    idea: "Reti — Tartakover, Vena, 1910: farzin qurbon qilinadi va qoʻsh shoh bilan mot.",
    lesson: [
      {
        title: "Rivojlanish va tuzoq",
        text: [
          "1. e4 c6 2. d4 d5 3. ♘c3 dxe4 4. ♘xe4 ♘f6 5. ♕d3 e5? 6. dxe5 ♕a5+ 7. ♗d2 ♕xe5 8. 0-0-0! ♘xe4?",
          "Oqlar uzun rokirovka qildi va ularning ruxi d vertikaliga turdi. Qoralar otni urib oldi — va tahdidni payqamadi.",
        ],
      },
      {
        title: "9. ♕d8+!! ♔xd8 10. ♗g5+",
        text: [
          "Farzin shohni d8 ga olib chiqish uchun oʻzini qurbon qiladi. Endi fil d vertikalidan ketadi — va birdaniga ikkitasi shoh beradi: g5 dagi fil va d1 dagi rux. Bu **qoʻsh shoh**.",
          "10... ♔c7 11. ♗d8# (yoki 10... ♔e8 11. ♖d8#) — mot.",
        ],
      },
    ],
    terms: [{ term: "Qurbon", text: "Koʻproq narsaga — mot yoki yutuqqa erishish uchun donani ataylab berish." }],
    exercises: {
      "c2-reti-choose": {
        title: "Reti gʻoyasini top",
        prompt: "Oqlar yuradi. Qaysi yurish motga olib boradi?",
        hint: "Farzin shoh bersa, shoh qayerga turishga majbur boʻlishini oʻylab koʻr.",
        why: "9. ♕d8+!! — shoh farzinni urishga majbur, keyin esa 10. ♗g5+ — qoʻsh shoh va keyingi yurishda mot. 9. ♕xe4? ♕xe4 dan keyin esa oqlar shunchaki farzinni yoʻqotadi.",
      },
      "c2-reti-mate": {
        title: "Soʻnggi zarba",
        prompt: "Oqlar yuradi. Reti kabi mot qil.",
        hint: "Fil shohning yonginasiga turadi — uni kim himoya qiladi?",
        why: "11. ♗d8# — filni d1 dagi rux himoya qiladi, shoh atrofidagi hamma kataklar esa band yoki hujum ostida.",
      },
    },
  },
  "c2-prepare": {
    title: "Motga tayyorgarlik",
    idea: "Baʼzan mot ikki yurishda: avval himoyachini olib tashla, keyin ur.",
    lesson: [
      {
        title: "Avval — tayyorgarlik",
        text: [
          "Har qanday mot darhol qilinmaydi. Koʻpincha birinchi yurishda himoyachini **chalgʻitish** yoki **almashtirish** kerak, faqat ikkinchisida — mot qilish.",
          "Raqibning muhim katakni himoya qilayotgan donasini qidir. Uni shoh berib yoki almashib joyidan olib ketish mumkinmi?",
        ],
      },
    ],
    terms: [{ term: "Chalgʻitish", text: "Himoyachini muhim katakdan olib ketishadi — va himoya buziladi." }],
    exercises: {
      "c2-prepare-choose": {
        title: "Bitta ruxga qarshi ikkita rux",
        prompt: "Oqlar yuradi. Qaysi yurish motga olib boradi?",
        hint: "d8 dagi qora rux oxirgi gorizontalni yolgʻiz oʻzi himoya qilyapti.",
        why: "♖e8+! ♖xe8 ♖xe8# — birinchi rux himoyachiga almashinadi, ikkinchisi mot qiladi. ♖e7 dan keyin esa qoralar himoyalanishga ulguradi.",
      },
      "c2-prepare-mate": {
        title: "Himoyachi ketdi",
        prompt: "Oqlar yuradi. Mot qil.",
        hint: "e8 dagi rux — sakkizinchi gorizontalning oxirgi himoyachisi.",
        why: "♖xe8# — rux himoyachini urib oladi va oxirgi gorizontalda mot.",
      },
    },
  },
  "c2-attack": {
    title: "Shohga hujum",
    idea: "Mot uchun farzinni qurbon qilish: Filidorning «boʻgʻiq moti».",
    lesson: [
      {
        title: "Mot uchun qurbon",
        text: [
          "Shohga hujumda donalarning qiymati ikkinchi oʻringa tushadi: agar qurbon motga olib borsa, uni qilish kerak.",
          "Mashhur usul — **boʻgʻiq mot**: farzin g8 da oʻzini qurbon qiladi, raqib ruxi uni urishga majbur boʻlib, oʻz shohini qamab qoʻyadi, ot esa f7 da mot qiladi.",
        ],
      },
    ],
    terms: [{ term: "Boʻgʻiq mot", text: "Shoh oʻz donalari bilan qamalgan, motni ot qiladi." }],
    exercises: {
      "c2-attack-choose": {
        title: "Farzin qurbon qilinadi",
        prompt: "Oqlar yuradi. Qaysi yurish motga olib boradi?",
        hint: "Shoh g8 dagi farzinni urib ololmaydi: bu katakni h6 dagi ot ushlab turibdi. Unda farzinni kim uradi?",
        why: "♕g8+!! ♖xg8 ♘f7# — rux oʻzi shohni qamab qoʻydi. ♘f7+ dan keyin esa shoh g8 ga qochadi va mot yoʻq.",
      },
    },
  },
  "c2-greco": {
    title: "Oʻquv partiyasi: Greko",
    idea: "Joakino Greko, XVII asr: 2... f6 kuchsiz yurishini qanday jazolash kerak.",
    lesson: [
      {
        title: "Kuchsiz f6 yurishi",
        text: [
          "1. e4 e5 2. ♘f3 f6? — qoralar piyodani himoya qiladi, lekin shohni zaiflashtiradi: e8–h5 diagonali ochiladi.",
          "3. ♘xe5! fxe5? 4. ♕h5+ — va qora shoh taxta markaziga chiqishga majbur boʻladi.",
        ],
      },
      {
        title: "Shoh ovi",
        text: [
          "4... ♔e7 5. ♕xe5+ ♔f7 6. ♗c4+ d5 7. ♗xd5+ ♔g6 8. h4 h5 9. ♗xb7 ♗xb7 10. ♕f5+ ♔h6 11. d4+ g5 12. ♕f7 ♕e7 13. hxg5+ ♕xg5 14. ♖xh5#.",
          "Shoh panadan chiqdi — va oqlarning hamma donalari ovga qoʻshildi. Xulosa: oʻz shohing oldidagi piyodalarni zaiflashtirma.",
        ],
      },
    ],
    terms: [{ term: "Oʻquv partiyasi", text: "Qoida yoki usul yaqqol koʻrinadigan partiya." }],
    exercises: {
      "c2-greco-choose": {
        title: "Xatoni jazola",
        prompt: "Oqlar yuradi. Qoralar 2... f6 yurdi. Qanday jazolash kerak?",
        hint: "f6 piyodasi e5 ni himoya qiladi, lekin uni ursang — shohga diagonal ochiladi.",
        why: "3. ♘xe5! — agar 3... fxe5 boʻlsa, 4. ♕h5+ va shoh hujum ostiga chiqadi. ♗c4 yurishi ham yomon emas, lekin qoralarning xatosidan foydalanmaydi.",
      },
      "c2-greco-mate": {
        title: "Greko moti",
        prompt: "Oqlar yuradi. Greko kabi mot qil.",
        hint: "g5 dagi qora farzin va h6 dagi shoh c1 dagi fil bilan bitta diagonalda turibdi.",
        why: "14. ♖xh5# — h vertikali boʻylab shoh. g5 dagi farzin ruxni urib ololmaydi: uni c1 dagi fil bogʻlagan (c1–h6 diagonali). Shoh ham urolmaydi — ruxni f7 dagi farzin himoya qiladi, u g6 va g7 ni ham ushlab turadi.",
      },
    },
  },
};
