import type { Uz } from "../../localize";
import type { COURSE_3, COURSE_3_LESSONS, COURSE_3_MODULES } from "../course3";

export const course3Uz: Uz<typeof COURSE_3> = {
  title: "3-bosqich «Fil»",
  subtitle: "Shohga hujum taktikasi",
  about:
    "Shohga hujumda bogʻlash, rentgen, bogʻlash bilan material yutish, ochiq shoh va pistirma, qoʻsh shoh, «tegirmon», ochiq hujum, himoyani yoʻq qilish, chalgʻitish, toʻsib qoʻyish va jalb qilish. Darslar mavzusi va tartibi M.I. Glotovning «Shaxmat mahorati bosqichlari. 3-bosqich „Fil“» kitobi asosida; pozitsiyalar maktab uchun tuzilgan va shaxmat dvigateli bilan tekshirilgan.",
};

export const course3ModulesUz: Uz<typeof COURSE_3_MODULES> = {
  "pin-king": { title: "Shohga hujumda bogʻlash" },
  discovered: { title: "Ochiq va qoʻsh shoh" },
  "disc-attack": { title: "Ochiq hujum" },
  "remove-def": { title: "Himoyani yoʻq qilish" },
  deflection: { title: "Chalgʻitish va toʻsib qoʻyish" },
  decoy: { title: "Jalb qilish" },
};

export const course3LessonsUz: Uz<typeof COURSE_3_LESSONS> = {
  "c3-pin-attack": {
    title: "Shohga hujumda bogʻlash",
    idea: "Bogʻlangan piyoda himoya qilmaydi: uning katagiga farzin qoʻyish mumkin.",
    lesson: [
      {
        title: "Ura olmaydigan piyoda",
        text: [
          "Rokirovka oldidagi piyodalar shohni himoya qiladi. Lekin piyoda **bogʻlangan** boʻlsa — chiziq boʻylab uning ortida shoh tursa — u joyidan qimirlay olmaydi va ura olmaydi.",
          "Shunda farzin toʻgʻridan-toʻgʻri piyoda tagiga turadi va piyoda uni ura olmaydi. Shunday qilib bogʻlash hujum quroliga aylanadi.",
        ],
      },
    ],
    terms: [{ term: "Bogʻlangan piyoda", text: "Ortida oʻz shohi turgani uchun yura olmaydigan piyoda." }],
    exercises: {
      "c3-pin-attack-choose": {
        title: "Farzin piyoda tagiga",
        prompt: "Oqlar yuradi va 2 yurishda mot qiladi. Birinchi yurish qaysi?",
        hint: "g7 piyodasi c3 dagi fil bilan bogʻlangan. U h6 da ura oladimi?",
        why: "♕h6! — g7 piyodasi c3 dagi fil bilan bogʻlangan va farzinni ura olmaydi. Keyingi yurishda mot: ♕xh7# (h7 ni d3 dagi fil himoya qiladi) yoki ♕xg7# (g7 ni c3 dagi fil himoya qiladi). ♗xh7? dan keyin esa ♞d7 — qoralarda himoya bor.",
      },
    },
  },
  "c3-xray": {
    title: "Rentgen",
    idea: "Dona boshqa dona orqali «nur sochadi» va oʻsha chiziqdagi zarbani qoʻllab-quvvatlaydi.",
    lesson: [
      {
        title: "Dona orqali zarba",
        text: [
          "**Rentgen** — ikki dona bir chiziqda ketma-ket turganda. Orqadagi dona oldingisi orqali «koʻradi»: oldingi dona ketishi yoki almashilishi bilan orqadagisi oʻsha chiziq boʻylab uradi.",
          "Bir vertikalda juftlangan rux va farzin — kuchli batareya. Koʻpincha birinchi dona oʻzini qurbon qiladi, ikkinchisi esa mot qiladi.",
        ],
      },
    ],
    terms: [{ term: "Rentgen", text: "Dona boshqa dona orqali chiziq boʻylab taʼsir qiladi." }],
    exercises: {
      "c3-xray-choose": {
        title: "Rux ortidagi farzin",
        prompt: "Oqlar yuradi va 2 yurishda mot qiladi. Birinchi yurish qaysi?",
        hint: "d1 dagi farzin rux ortida turibdi va d8 ga qarab turibdi.",
        why: "♖xd8+! ♛xd8 ♕xd8# — farzin rux «orqali» urib turgan edi: rux d8 ga ketganda, farzin zarbani qoʻllab-quvvatladi va oxirgi gorizontalda mot qildi. ♖d7? dan keyin ♛xd7 — mot yoʻq.",
      },
    },
  },
  "c3-pin-gain": {
    title: "Bogʻlash: material yutish",
    idea: "Bogʻlangan donaga yana bir marta hujum qilinadi — va u olinadi.",
    lesson: [
      {
        title: "Bogʻla va hujum qil",
        text: [
          "Bogʻlangan dona yopishtirib qoʻyilganday joyida turadi. Demak, unga yana bir marta hujum qilish mumkin — eng yaxshisi piyoda bilan — va uni olish mumkin.",
          "**Qoʻsh bogʻlash** ham boʻladi: raqibning ikki donasi bir vaqtda bogʻlangan. Shunda himoyalanish yanada qiyin.",
        ],
      },
    ],
    terms: [
      { term: "Toʻliq bogʻlash", text: "Bogʻlangan dona ortida shoh turadi — qoida boʻyicha u bilan yurib boʻlmaydi." },
      { term: "Qoʻsh bogʻlash", text: "Raqibning ikki donasi bir vaqtda bogʻlangan." },
    ],
    exercises: {
      "c3-pin-gain-bishop": {
        title: "Otni bogʻla",
        prompt: "Oqlar yuradi. Otni shoh bilan bogʻla.",
        hint: "c6 dagi ot va e8 dagi shoh bitta diagonalda turibdi.",
        why: "♗b5 — c6 dagi ot e8 dagi shoh bilan bogʻlandi va keta olmaydi. Keyin d4–d5 piyoda bilan otga hujum qiladi va oqlar donani yutadi.",
      },
      "c3-pin-gain-quiz": {
        title: "Bogʻlangan dona nima qila oladi?",
        prompt: "Bogʻlash haqidagi savollarga javob ber.",
        questions: [
          {
            text: "Bogʻlangan ot ortida shoh turibdi. Ot yura oladimi?",
            options: ["yoʻq, bu qoidaga zid", "ha, juda zarur boʻlsa"],
          },
          {
            text: "Bogʻlangan donaga nima bilan hujum qilgan maʼqul?",
            options: ["piyoda bilan", "farzin bilan", "shoh bilan"],
          },
        ],
        hint: "Bogʻlangan dona bilan oʻz shohini ochib boʻlmaydi. Piyoda esa eng arzon dona.",
        why: "Shoh bilan bogʻlangan ot yura olmaydi — aks holda shoh shoh ostida qoladi. Bogʻlangan donaga piyoda bilan hujum qilgan maʼqul: uni ayamaysan, dona esa keta olmaydi.",
      },
    },
  },
  "c3-disc-mate": {
    title: "Ochiq shoh: mot",
    idea: "Dona chiziqdan ketadi — va shohni uning ortidagi dona beradi.",
    lesson: [
      {
        title: "Batareya",
        text: [
          "**Ochiq shoh** — dona chetga chiqadi va uzoqqa uradigan donaning — rux, fil yoki farzinning — chizigʻi ochiladi. Shohni yurgan dona emas, uning ortida turgan dona beradi.",
          "Batareya turganda oldingi dona istalgan joyga yura oladi — baribir shoh boʻladi.",
        ],
      },
    ],
    terms: [{ term: "Ochiq shoh", text: "Chizigʻi ochilgan donaning shohi." }],
    exercises: {
      "c3-disc-mate-knight": {
        title: "Ot chiziqni ochadi",
        prompt: "Oqlar yuradi. Mot qil.",
        hint: "d8 dagi ot ruxning shohga yoʻlini toʻsib turibdi.",
        why: "Ot bilan istalgan yurish — mot! a8 dagi rux sakkizinchi gorizontal boʻylab shoh beradi, g7 va h7 piyodalari shohni qamab qoʻygan. ♘f7# — bu yana qoʻsh shoh ham.",
      },
    },
  },
  "c3-ambush": {
    title: "Pistirma: ochiq shohga tayyorgarlik",
    idea: "Avval uzoqqa uradigan donani oʻz donang ortiga yashir — keyin chiziqni ochasan.",
    lesson: [
      {
        title: "Pistirmadagi rux",
        text: [
          "Ochiq shohni **tayyorlash** mumkin: jim yurish bilan rux, fil yoki farzinni shoh chizigʻidagi oʻz donang ortiga qoʻyish. Bu — **pistirma**.",
          "Raqib tahdidni koʻradi, lekin koʻpincha himoyalanishning iloji qolmaydi: oldingi dona istalgan tomonga shoh bilan ketadi.",
        ],
      },
    ],
    terms: [{ term: "Pistirma", text: "Dona oʻz donasi ortiga yashiringan va chiziq ochilishini kutadi." }],
    exercises: {
      "c3-ambush-choose": {
        title: "Ruxni yashir",
        prompt: "Oqlar yuradi va 2 yurishda mot qiladi. Birinchi yurish qaysi?",
        hint: "Ruxni h vertikalida ot ortiga qoʻy.",
        why: "♖h1! — rux ot ortida pistirmada. ♘f6# yoki ♘xg7# tahdidi: ot ketadi va rux h vertikali boʻylab shoh beradi. g7 piyodasi a1 dagi fil bilan bogʻlangan va qimirlay olmaydi. ♖e8? dan keyin ♜f8 yoki ♘f6? dan keyin g6 — qoralar himoyalanadi.",
      },
    },
  },
  "c3-double-mate": {
    title: "Qoʻsh shoh: mot",
    idea: "Ikki dona bilan bir vaqtda shoh: toʻsib ham, urib ham boʻlmaydi, faqat qochish mumkin.",
    lesson: [
      {
        title: "Bir vaqtda ikki shoh",
        text: [
          "**Qoʻsh shoh** — yurgan dona ham shoh beradigan ochiq shoh. Ikki shohdan toʻsib boʻlmaydi va ikkala donani urib boʻlmaydi — shohga faqat qochish qoladi.",
          "Agar qochadigan joy boʻlmasa — bu mot, hatto shoh berayotgan ikkala dona ham zarba ostida tursa ham.",
        ],
      },
    ],
    terms: [{ term: "Qoʻsh shoh", text: "Ikki dona bilan bir vaqtda shoh; faqat shoh yurishi qutqaradi." }],
    exercises: {
      "c3-double-mate-knight": {
        title: "Ikki shoh — va mot",
        prompt: "Oqlar yuradi. Mot qil.",
        hint: "Ot e vertikalidan ketadi va oʻzi ham shoh beradi.",
        why: "♘d6# (yoki ♘f6#) — qoʻsh shoh: ot ham, e1 dagi rux ham shoh beradi. Otni fil bilan urib boʻlmaydi — ruxning shohi qoladi, shohning esa qochadigan joyi yoʻq.",
      },
    },
  },
  "c3-disc-gain": {
    title: "Ochiq shoh: material yutish va «tegirmon»",
    idea: "Raqib shohdan qutulayotganda, yurgan dona xohlaganini oladi.",
    lesson: [
      {
        title: "Tekin yurish",
        text: [
          "Ochiq shohda raqibning donalarini qutqarishga vaqti yoʻq: avval shohdan himoyalanish kerak. Shuning uchun yurgan dona **istalgan narsani urib olishi** mumkin — hatto farzinni ham.",
        ],
      },
      {
        title: "«Tegirmon»",
        text: [
          "**Tegirmon** — ketma-ket ochiq shohlar. Rux shoh beradi, shoh chekinadi, rux ochiq shoh bilan ketib nimanidir uradi, keyin yana shoh beradi… Tegirmon qanotlari aylanadi, raqib donalari esa yoʻqoladi.",
        ],
      },
    ],
    terms: [{ term: "Tegirmon", text: "Material yutib, ketma-ket berilgan ochiq shohlar." }],
    exercises: {
      "c3-disc-gain-queen": {
        title: "Farzinni ol",
        prompt: "Oqlar yuradi. Shohni och va farzinni yut.",
        hint: "Fil e vertikalidan ketadi — va rux shoh beradi.",
        why: "♗xb7+ — fil farzinni urib oldi, shohni esa e1 dagi rux berdi. Qoralarning qaytarib olishga vaqti yoʻq: avval shohdan qochish kerak.",
      },
    },
  },
  "c3-disc-attack": {
    title: "Ochiq hujum",
    idea: "Dona tahdid bilan ketadi — va boshqa donaning hujumini ochadi.",
    lesson: [
      {
        title: "Bir vaqtda ikki tahdid",
        text: [
          "**Ochiq hujum** — ochiq shohga oʻxshaydi, faqat orqadagi dona shohga emas, boshqa donaga, masalan farzinga hujum qiladi.",
          "Eng kuchlisi — yurgan dona bunda **shoh bersa**: raqibning farzinni qutqarishga vaqti qolmaydi.",
        ],
      },
    ],
    terms: [{ term: "Ochiq hujum", text: "Dona ketib, boshqa donaning hujumini ochadi." }],
    exercises: {
      "c3-disc-attack-choose": {
        title: "Ot ruxni ochadi",
        prompt: "Oqlar yuradi. Farzinni qanday yutish mumkin?",
        hint: "Ot bilan d vertikalidan shoh berib ket.",
        why: "♘f5+! — ot shoh beradi, d1 dagi rux esa d8 dagi farzinga hujumni ochdi. Qora shoh qochadi va ♖xd8. ♘e6? dan keyin chiziq ham ochiladi, lekin shoh yoʻq — qoralarning oʻzi ♛xd1# bilan mot qiladi.",
      },
    },
  },
  "c3-remove-def": {
    title: "Himoyani yoʻq qilish",
    idea: "Mot katagini himoya qilayotgan donani ol — va mot qilish mumkin boʻladi.",
    lesson: [
      {
        title: "Kim himoya qilyapti?",
        text: [
          "Hujumdan oldin oʻzingdan soʻra: **qaysi dona motga xalaqit beryapti?** Koʻpincha bu raqibning bitta donasi — kerakli katakni ushlab turgan ot, fil yoki rux.",
          "Himoyachini ol — hatto oʻz donangni berib boʻlsa ham — va keyingi yurishda mot keladi.",
        ],
      },
    ],
    terms: [{ term: "Himoyani yoʻq qilish", text: "Muhim katakni himoya qilayotgan donani urib olish." }],
    exercises: {
      "c3-remove-def-rank": {
        title: "Yagona himoyachi",
        prompt: "Oqlar yuradi. Mot qil.",
        hint: "Qora rux oxirgi gorizontalni yolgʻiz oʻzi qoʻriqlayapti.",
        why: "♖xe8# — rux oxirgi gorizontalning yagona himoyachisini urib oldi, f7, g7 va h7 piyodalari esa shohni qochirmaydi.",
      },
      "c3-remove-def-choose": {
        title: "Otni yoʻqot",
        prompt: "Oqlar yuradi va 2 yurishda mot qiladi. Birinchi yurish qaysi?",
        hint: "f6 dagi ot h7 ni himoya qilyapti. Uni ol.",
        why: "♖xf6! — h7 ning himoyachisi yoʻqoldi. gxf6, g6 yoki ♚g8 dan keyin ♕xh7#: farzinni g5 dagi ot qoʻllab-quvvatlaydi. h6 yoki h5 ga esa — ♖f8#. ♕xh7+? dan keyin ♞xh7 — f6 dagi otning oʻzi farzinni urib oladi.",
      },
    },
  },
  "c3-deflect": {
    title: "Chalgʻitish",
    idea: "Himoyachini u qoʻriqlayotgan katak yoki chiziqdan ketishga majbur qil.",
    lesson: [
      {
        title: "Himoyachi ketadi",
        text: [
          "**Chalgʻitish** — shoh yoki qurbon, undan keyin himoyachi ketishga majbur. U shohni bir joyda qutqaradi — va boshqa katakni qoʻriqsiz qoldiradi.",
          "Eng yaxshisi **shoh berib** chalgʻitish: raqibning oʻylashga vaqti yoʻq, u javob berishga majbur.",
        ],
      },
    ],
    terms: [{ term: "Chalgʻitish", text: "Himoyachi ketishga majbur boʻladi va muhim katakni qoʻriqsiz qoldiradi." }],
    exercises: {
      "c3-deflect-choose": {
        title: "Farzin yettinchidan ketadi",
        prompt: "Oqlar yuradi va 2 yurishda mot qiladi. Birinchi yurish qaysi?",
        hint: "Qora farzin yettinchi gorizontal boʻylab g7 ni qoʻriqlayapti. Sakkizinchi boʻylab shoh ber.",
        why: "♖a8+! — qora farzin b8, c8 yoki d8 da toʻsishga majbur va yettinchi gorizontaldan ketadi. Keyin ♕xg7#: farzinni f5 dagi ot qoʻllab-quvvatlaydi. ♕xg7+? dan keyin ♛xg7 ♘xg7 — mot yoʻq.",
      },
    },
  },
  "c3-interfere": {
    title: "Toʻsib qoʻyish",
    idea: "Himoyachi bilan u qoʻriqlayotgan katak orasiga dona qoʻy.",
    lesson: [
      {
        title: "Chiziqdagi devor",
        text: [
          "Rux, fil va farzin uzoqdan — chiziq boʻylab himoya qiladi. **Toʻsib qoʻyish** — oʻz donangni shu chiziqqa qoʻyish, shunda himoya uziladi.",
          "Toʻsib qoʻyish toʻsgan donani urib boʻlmaganda yoki urish foydasiz boʻlganda ishlaydi: masalan, u himoyalangan yoki himoyachi bogʻlangan.",
        ],
      },
    ],
    terms: [{ term: "Toʻsib qoʻyish", text: "Dona himoyachining chizigʻiga turib, himoyani uzadi." }],
    exercises: {
      "c3-interfere-quiz": {
        title: "Qayerda toʻsish kerak?",
        prompt: "b5 dagi qora fil e8 katagini qoʻriqlayapti. Savollarga javob ber.",
        questions: [
          {
            text: "b5 dagi filni e8 katagidan toʻsish uchun donani qaysi katakka qoʻyish kerak?",
            options: ["c6 yoki d7", "c4 yoki d3", "b6 yoki b7"],
          },
          {
            text: "Qaysi donalarni toʻsib qoʻyish mumkin?",
            options: ["rux, fil va farzinni", "faqat otni", "faqat piyodani"],
          },
        ],
        hint: "Fil b5 – c6 – d7 – e8 diagonali boʻylab yuradi.",
        why: "b5 dagi fil e8 ni c6 va d7 orqali diagonal boʻylab qoʻriqlaydi — toʻsiq oʻsha yerga qoʻyiladi. Faqat uzoqqa uradigan donalarni toʻsib qoʻyish mumkin: rux, fil va farzinni. Ot esa donalar ustidan sakrab oʻtadi.",
      },
    },
  },
  "c3-decoy": {
    title: "Jalb qilish",
    idea: "Qurbon bilan raqib donasini yomon katakka turishga majbur qil.",
    lesson: [
      {
        title: "Oʻlja",
        text: [
          "**Jalb qilish** — qurbon, undan keyin raqib donasi biz uchun kerakli katakka turishga majbur. Shoh zarba ostiga boradi, rux oʻz shohini qamab qoʻyadi.",
          "Mashhur misol — **Filidor moti**: farzin g8 da oʻzini qurbon qiladi, rux uni urib olib shohni qamab qoʻyadi, ot esa «qisilgan» mot qiladi.",
        ],
      },
    ],
    terms: [{ term: "Jalb qilish", text: "Raqib donasini yomon katakka chorlaydigan qurbon." }],
    exercises: {
      "c3-decoy-choose": {
        title: "Farzin — oʻlja",
        prompt: "Oqlar yuradi va 2 yurishda mot qiladi. Birinchi yurish qaysi?",
        hint: "Ruxni g8 ga — shoh yoniga turishga majbur qil.",
        why: "♕g8+! — shoh ura olmaydi (farzinni b3 dagi fil himoya qiladi), faqat ♜xg8 qoladi. Rux oʻz shohini qamab qoʻydi va ♘f7# — qisilgan mot. ♘f7+? dan keyin ♚g8 — shoh qochadi.",
      },
    },
  },
};
