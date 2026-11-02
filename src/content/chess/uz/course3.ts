import type { Uz } from "../../localize";
import type { COURSE_3, COURSE_3_LESSONS, COURSE_3_MODULES } from "../course3";

export const course3Uz: Uz<typeof COURSE_3> = {
  title: "3-bosqich «Fil»",
  subtitle: "Hujum, oʻtuvchi piyodalar va endshpil",
  about:
    "Gorvits fillari, «ochkoʻz qator», ikki rux bilan hujum, hujumdagi oʻtuvchi piyoda. Darslar mavzusi va tartibi M.I. Glotovning «Shaxmat mahorati bosqichlari. 3-bosqich „Fil“» kitobi asosida; pozitsiyalar maktab uchun tuzilgan va shaxmat dvigateli bilan tekshirilgan.",
};

export const course3ModulesUz: Uz<typeof COURSE_3_MODULES> = {
  horwitz: { title: "Gorvits fillari" },
  seventh: { title: "Ochkoʻz qator" },
  passer: { title: "Oʻtuvchi piyoda" },
};

export const course3LessonsUz: Uz<typeof COURSE_3_LESSONS> = {
  "c3-horwitz": {
    title: "Gorvits fillari",
    idea: "Qoʻshni diagonallardagi ikki fil rokirovkaga ikki projektor kabi uradi.",
    lesson: [
      {
        title: "Ikki projektor",
        text: [
          "**Gorvits fillari** — yonma-yon turib, raqib rokirovkasiga qoʻshni diagonallar boʻylab qarab turgan ikki fil: biri g7 ni, ikkinchisi h7 ni uradi. Usul XIX asrdagi nemis ustasi Bernhard Gorvits nomi bilan atalgan.",
          "Fillar bilan birga farzin ham hujum qiladi: u fil himoyasida g7 yoki h7 ga bostirib kiradi — va mot qiladi.",
        ],
      },
    ],
    terms: [{ term: "Gorvits fillari", text: "Qoʻshni diagonallarda turib, shohga qaratilgan ikki fil." }],
    exercises: {
      "c3-horwitz-g7": {
        title: "g7 ga zarba",
        prompt: "Oqlar yuradi. Mot qil.",
        hint: "b2 dagi fil g7 ga qarab turibdi.",
        why: "♕xg7# — farzin b2 dagi fil himoyasida piyodani urib oladi, shohning qochadigan joyi yoʻq.",
      },
      "c3-horwitz-h7": {
        title: "h7 ga zarba",
        prompt: "Oqlar yuradi. Mot qil.",
        hint: "d3 dagi fil h7 ga qarab turibdi.",
        why: "♕xh7# — farzinni d3 dagi fil himoya qiladi, shuning uchun shoh uni urib ololmaydi, g8 katagini esa farzinning oʻzi ushlab turibdi.",
      },
    },
  },
  "c3-seventh": {
    title: "Ochkoʻz qator",
    idea: "Yettinchi gorizontaldagi rux piyodalarni «yeydi» va shohni qamab qoʻyadi.",
    lesson: [
      {
        title: "Yettinchi gorizontaldagi rux",
        text: [
          "Shaxmatchilar raqibning yettinchi gorizontalini (qoralar uchun — ikkinchisini) hazillashib **«ochkoʻz qator»** deyishadi: u yerga bostirib kirgan rux oʻz joyida turgan piyodalarga hujum qiladi va shohni oxirgi gorizontalda qamab qoʻyadi.",
          "Shuning uchun ruxni **ochiq vertikal** boʻylab olib borishadi — va birinchi imkoniyatdayoq yettinchi gorizontalga qoʻyishadi.",
        ],
      },
    ],
    terms: [
      {
        term: "Ochkoʻz qator",
        text: "Raqibning yettinchi gorizontali: u yerda rux piyodalarni «yeydi» va shohni qamab qoʻyadi.",
      },
    ],
    exercises: {
      "c3-seventh-choose": {
        title: "Rux qayerga?",
        prompt: "Oqlar yuradi. Rux bilan qayerga yurgan yaxshiroq?",
        hint: "Rux qayerda raqib piyodalariga hujum qiladi?",
        why: "♖b7 — rux yettinchi gorizontalda: u f7 piyodasiga hujum qiladi va shohni oldinga qoʻyib yubormaydi. b3 da esa rux hech narsa qilmaydi.",
      },
      "c3-seventh-mate": {
        title: "Yettinchidagi rux va farzin",
        prompt: "Oqlar yuradi. Mot qil — istalgani toʻgʻri.",
        hint: "Yettinchi gorizontaldagi rux va farzin bir-birini himoya qiladi.",
        why: "Motlar beshta: ♖a8#, ♕a8#, ♕b8#, ♕c8# va ♕xg7#. Eng chiroylisi — ♕xg7#: farzinni a7 dagi rux yettinchi gorizontal boʻylab himoya qiladi.",
      },
    },
  },
  "c3-two-rooks": {
    title: "Ikki rux bilan hujum",
    idea: "Yettinchidagi ikki rux: biri gorizontalni ushlaydi, ikkinchisi shoh beradi.",
    lesson: [
      {
        title: "Qoʻshaloq ruxlar",
        text: [
          "Yettinchi gorizontalga bostirib kirgan ikki rux — ulkan kuch: ular **bir-birini himoya qiladi** va yoʻlidagi hamma narsani urib oladi.",
          "Burchakdagi shohga qarshi bir rux yettinchi gorizontalni ushlab turadi, ikkinchisi esa sakkizinchida shoh beradi — mot.",
        ],
      },
    ],
    terms: [{ term: "Qoʻshaloq ruxlar", text: "Bir chiziqda turib, bir-birini himoya qiladigan ikki rux." }],
    exercises: {
      "c3-two-rooks-mate": {
        title: "Ikki rux bilan mot",
        prompt: "Oqlar yuradi. Mot qil — ikki usul bor.",
        hint: "Bir rux yettinchida qoladi, ikkinchisi sakkizinchi boʻylab shoh beradi.",
        why: "♖b8# yoki ♖f8# — sakkizinchi gorizontal boʻylab shoh, yettinchisini esa ikkinchi rux ushlab turibdi.",
      },
    },
  },
  "c3-passed": {
    title: "Oʻtuvchi piyoda",
    idea: "Oʻtuvchi piyodani yurgizish kerak: u raqib donalarini chalgʻitadi va farzinlikka intiladi.",
    lesson: [
      {
        title: "Piyodalar — farzinlikka!",
        text: [
          "Oʻtuvchi piyoda — katta kuch: uni toʻxtatish uchun raqib uning oldiga dona qoʻyishga majbur. Piyoda oxirgi gorizontalga qancha yaqin boʻlsa, shuncha xavfli.",
          "Agar piyodani dona qoʻriqlayotgan boʻlsa, baʼzan uni **aylanish bilan urib olish** — va darhol donani yutish mumkin.",
        ],
      },
    ],
    terms: [
      {
        term: "Aylanish bilan urish",
        text: "Piyoda oxirgi gorizontaldagi donani urib, darhol boshqa donaga aylanadi.",
      },
    ],
    exercises: {
      "c3-passed-choose": {
        title: "Qaysi aylanish yaxshiroq?",
        prompt: "Oqlar yuradi. b7 piyodasi ikki usulda aylanishi mumkin. Qaysi biri yaxshiroq?",
        hint: "a8 dagi rux b8 katagini qoʻriqlab turibdi.",
        why: "bxa8♕# — piyoda ruxni urib oladi va darhol oxirgi gorizontalda mot qiladi. b8♕+? ♖xb8 dan keyin esa farzin qoʻldan ketadi.",
      },
    },
  },
  "c3-passed-attack": {
    title: "Hujumdagi oʻtuvchi piyoda",
    idea: "Oʻtuvchi piyoda rux bilan birga partiyani mot bilan hal qila oladi.",
    lesson: [
      {
        title: "Piyoda va rux",
        text: [
          "Oʻtuvchi piyodaning **orqasida** turgan rux uni butun yoʻl davomida himoya qiladi. Piyoda chetga yetganda, yangi farzin himoya ostida boʻladi — va mot qilishi mumkin.",
        ],
      },
    ],
    terms: [{ term: "Piyoda orqasidagi rux", text: "Oʻtuvchi piyodani butun yoʻli davomida himoya qiladi." }],
    exercises: {
      "c3-passed-attack-mate": {
        title: "Nafis yakun",
        prompt: "Oqlar yuradi. Mot qil.",
        hint: "Yangi farzin e1 dagi rux himoyasida boʻladi.",
        why: "e8♕# — farzinni e1 dagi rux himoya qiladi, u f7 va f8 ni ushlab turadi, g7 va h7 piyodalari esa shohni qamab qoʻygan.",
      },
      "c3-passed-quiz": {
        title: "Ruxni qayerga qoʻyish kerak?",
        prompt: "Savollarga javob ber.",
        questions: [
          {
            text: "Oʻz oʻtuvchi piyodasiga yordam berish uchun rux qayerda turgani yaxshi?",
            options: ["piyoda orqasida", "piyoda oldida"],
          },
          { text: "Oʻtuvchi piyoda bilan nima qilish kerak?", options: ["oldinga yurgizish", "joyida ushlab turish"] },
        ],
        hint: "Piyoda orqasidagi rux uni har bir qadamda himoya qiladi.",
        why: "Oʻtuvchi piyoda orqasidagi rux uni butun yoʻl davomida himoya qiladi. Oʻtuvchi piyodalarni yurgizish kerak — ular raqib donalarini chalgʻitadi.",
      },
    },
  },
};
