import type { Uz } from "../../localize";
import type { TACTICS, TACTICS_SCHOOL } from "../tactics";

export const tacticsSchoolUz: Uz<typeof TACTICS_SCHOOL> = {
  title: "Taktika",
  subtitle: "Usullar, mot naqshlari va maxsus qoidalar",
  about:
    "Vilka, bogʻlash, rentgen va ochiq shoh, turli donalar bilan mot, debyutdagi tezkor motlar, shohdan himoya va maxsus qoidalar: oʻtib ketayotganda olish, pat va durranglar. Har bir mavzuda — qisqa dars va haqiqiy shaxmat taxtasidagi mashqlar. Hamma pozitsiyalar shaxmat dvigateli bilan tekshirilgan.",
};

export const tacticsUz: Uz<typeof TACTICS> = {
  fork: {
    title: "Vilka",
    idea: "Bitta dona bir yoʻla ikkita nishonga hujum qiladi: raqib faqat bittasini qutqarib ulguradi.",
    lesson: [
      {
        title: "Bitta dona — ikkita nishon",
        text: [
          "Bitta dona raqibning ikkita donasiga bir yoʻla hujum qilsa, bu **vilka** deyiladi. Raqib faqat bittasini qutqarib ulguradi — ikkinchisini olamiz.",
          "Otning vilkasini allaqachon koʻrgansan. Lekin vilkani istalgan dona qoʻya oladi!",
        ],
      },
      {
        title: "Rux va fil",
        text: [
          "**Rux** vertikal va gorizontal boʻylab hujum qiladi, **fil** — diagonal boʻylab. Ikkala nishon ularning chiziqlarida tursa, vilka chiqadi.",
          "Mana bu yerda rux d5 ga chiqdi va bir paytda b5 dagi otga hamda g5 dagi filga hujum qilyapti.",
        ],
      },
      {
        title: "Piyoda va farzin",
        text: [
          "Piyoda oldinga diagonal boʻylab uradi — ham oʻngga, ham chapga. Piyodaning vilkasi ayniqsa alamli: u eng arzon dona.",
          "Farzin rux va filning kuchini birlashtirib hujum qiladi, shuning uchun u ham vilka ustasi.",
        ],
      },
      {
        title: "Vilkani qanday topish mumkin",
        text: [
          "Raqibning himoyasiz ikkita donasini izla. Yoki bitta juda qimmat va bitta zaif donasini.",
          "Dona turadigan katak urilmayotganini tekshir: aks holda raqib uni oddiygina urib oladi.",
          "Eng kuchli vilka — shoh bilan. Shoh shohga javob berishi shart, ikkinchi dona esa yoʻqoladi.",
        ],
      },
    ],
    terms: [
      { term: "Vilka", text: "Bitta donaning raqibning ikkita yoki undan koʻp donasiga bir yoʻla hujumi." },
      { term: "Himoyasiz dona", text: "Hech kim himoya qilmaydigan dona: uni tekinga urib olsa boʻladi." },
    ],
    exercises: {
      "tac-fork-rook": {
        title: "Rux bilan vilka",
        prompt: "Oqlar yuradi. Rux bilan shunday yurish top: undan keyin rux bir yoʻla ot va filga hujum qilsin.",
        hint: "Ot b5 da, fil g5 da — ikkalasi bir gorizontalda. Ruxni qayerga qoʻysang, ikkalasini ham koʻradi?",
        why: "Rux d5 ga boradi va beshinchi gorizontal boʻylab ham b5 dagi otga, ham g5 dagi filga hujum qiladi. Ikkala dona himoyasiz, ruxga esa hech kim hujum qilmaydi. Raqib faqat bittasini qutqaradi.",
      },
      "tac-fork-bishop": {
        title: "Fil bilan vilka",
        prompt: "Fil bilan shunday yurish top: u ikkala qora ruxga hujum qilsin.",
        hint: "Ruxlar b8 va h8 da, fil esa diagonal boʻylab yuradi. Ikkalasi koʻrinadigan katakni top.",
        why: "Fil e5 ga boradi: bir diagonal boʻylab b8 dagi ruxni, boshqasi boʻylab h8 dagi ruxni koʻradi. b8 dagi ruxni hech kim himoya qilmaydi, h8 dagisini shoh himoya qiladi, lekin fil ruxdan arzon — almashuv baribir oqlarga foydali.",
      },
      "tac-fork-pawn": {
        title: "Piyoda bilan vilka",
        prompt: "Piyoda bilan shunday yurish top: u ot va filga hujum qilsin.",
        hint: "Piyoda oldinga diagonal boʻylab uradi — bir yoʻla ikki katakka: chapga va oʻngga. c5 dagi ot va e5 dagi fil d4 katagining ikki yonida turibdi.",
        why: "Piyoda d4 ga boradi va c5 hamda e5 ga hujum qiladi. Fil piyodani ursa, c3 dagi piyoda filni urib oladi. Piyoda eng arzon dona, shuning uchun uning vilkasi ayniqsa alamli.",
      },
      "tac-fork-queen": {
        title: "Farzin bilan vilka",
        prompt: "Farzin bilan shunday yurish top: u rux va filga hujum qilsin.",
        hint: "Rux a8 da, fil g5 da. Farzin ikkalasini ham koʻradigan katakni top — diagonal va gorizontal boʻylab.",
        why: "Farzin d5 ga boradi: diagonal boʻylab a8 dagi ruxga, gorizontal boʻylab g5 dagi filga hujum qiladi. Ikkala dona himoyasiz, farzinga esa hech kim hujum qilmaydi.",
      },
      "tac-fork-knight": {
        title: "Ot bilan vilka",
        prompt: "Ot bilan shunday yurish top: u farzin va ruxga hujum qilsin.",
        hint: "Ot «L» harfi shaklida uradi. c7 dagi rux va e7 dagi farzindan bir sakrash narida turgan katak qaysi?",
        why: "Ot d5 ga sakraydi: u yerdan ham e7 dagi farzinni, ham c7 dagi ruxni koʻradi. Farzin ham, rux ham otga hujum qilmaydi. Farzin qochadi — ot ruxni oladi.",
      },
      "tac-fork-quiz": {
        title: "Vilka nima",
        prompt: "Oʻylab koʻr va javob ber.",
        hint: "Esla: vilka — bir vaqtning oʻzida ikkita nishonga hujum.",
        why: "Vilka — bitta donaning bir yoʻla ikkita nishonga hujumi. Uni istalgan dona qoʻya oladi, lekin oʻzi xavfsiz qolishi kerak.",
        questions: [
          {
            text: "Vilka nima?",
            options: [
              "Bitta donaning bir yoʻla ikkita nishonga hujumi",
              "Ikkita dona bilan bir yoʻla shoh berish",
              "Taxtaning chetida turgan dona",
            ],
          },
          {
            text: "Qaysi donalar vilka qoʻya oladi?",
            options: ["Faqat ot", "Istalganlari: piyoda, ot, fil, rux, farzin, shoh", "Faqat farzin"],
          },
          {
            text: "Vilka qoʻyishdan oldin nimani tekshirish kerak?",
            options: [
              "Vilka qoʻyayotgan donani tekinga urib olib boʻlmasligini",
              "Raqibda piyoda qolmaganini",
              "Bu partiyaning birinchi yurishi ekanini",
            ],
          },
        ],
      },
    },
  },
  pin: {
    title: "Bogʻlash",
    idea: "Dona chiziqdan chiqib keta olmaydi: uning ortida shoh yoki qimmatroq dona turibdi.",
    lesson: [
      {
        title: "Mixlab qoʻyilgan dona",
        text: [
          "**Bogʻlash** — raqibning donasi chiziqdan chiqib keta olmaydigan holat: uning ortida shoh turibdi. U ketsa, oʻz yurishidan shoh paydo boʻladi, bunday yurish esa mumkin emas.",
          "Mana bu yerda b5 dagi oq fil c6 dagi qora otni bogʻladi: ot ortida, xuddi shu diagonalda e8 dagi shoh turibdi.",
        ],
      },
      {
        title: "Shoh bilan bogʻlash va farzin bilan bogʻlash",
        text: [
          "Bogʻlangan dona ortida shoh tursa, bogʻlash **mutlaq**: qoidalar unga yurishni taqiqlaydi.",
          "Ortida farzin yoki rux tursa, bogʻlash **nisbiy**: yurish mumkin, lekin shunda qimmatroq dona yoʻqoladi. Bu yerda f6 dagi ot d8 dagi farzinni g5 dagi fildan toʻsib turibdi.",
        ],
      },
      {
        title: "Bogʻlangan donani nima qilish kerak",
        text: [
          "Bogʻlangan donani haydab yubormaslik kerak. Unga yana bir marta hujum qil — piyoda yoki yana bitta dona bilan.",
          "U qochib qutula olmaydi, sen esa uni yutasan. Sening donangni bogʻlashsa, uni qanday ochishni oʻylab koʻr: shohni chiziqdan chetga olib chiq yoki donani himoya qil.",
        ],
      },
    ],
    terms: [
      { term: "Bogʻlash", text: "Dona chiziqdan chiqa olmaydi, chunki uning ortida shoh yoki qimmatroq dona turibdi." },
      { term: "Mutlaq bogʻlash", text: "Bogʻlangan dona ortida shoh turibdi: qoidalar unga yurishni taqiqlaydi." },
      {
        term: "Nisbiy bogʻlash",
        text: "Bogʻlangan dona ortida farzin yoki rux turibdi: yurish mumkin, lekin bu foydasiz.",
      },
    ],
    exercises: {
      "tac-pin-bishop": {
        title: "Fil bilan bogʻlash",
        prompt:
          "Fil bilan shunday yurish top: u c6 dagi qora otni bogʻlasin — uning ortida, xuddi shu diagonalda shoh turibdi.",
        hint: "Fil diagonal boʻylab yuradi. c6 dagi ot va e8 dagi shoh bilan bir diagonalda yotgan katak qaysi?",
        why: "Fil b5 ga boradi: c6 dagi ot fil bilan e8 dagi shoh orasida qoladi. Ot yursa, fil shoh beradi — demak, ot bogʻlangan va yura olmaydi.",
      },
      "tac-pin-rook": {
        title: "Rux bilan bogʻlash",
        prompt: "Rux bilan shunday yurish top: u e5 dagi otni e8 dagi shoh bilan bogʻlasin.",
        hint: "Rux vertikal va gorizontal boʻylab yuradi. Ot va shoh turgan vertikalga chiq.",
        why: "Rux e1 ga boradi: e vertikalida e5 dagi ot va e8 dagi shoh turibdi, rux bilan ot orasida esa boʻsh. Ot bogʻlangan: vertikaldan chiqib keta olmaydi, aks holda shoh ochilib qoladi.",
      },
      "tac-pin-queen": {
        title: "Farzin bilan bogʻlash",
        prompt:
          "Farzin bilan shunday yurish top: u f7 dagi otni bogʻlasin — uning ortida diagonalda g8 dagi shoh turibdi.",
        hint: "Kerakli diagonal g8 dan pastga va chapga ketadi: f7, e6, d5, c4, b3. Farzin shunday joyga tursinki, uni piyoda urib olmasin.",
        why: "Farzin b3 ga boradi: f7 dagi ot g8 dagi shoh bilan bogʻlanadi. d5 da farzinni c6 dagi piyoda urib olardi, shuning uchun toʻgʻri yurish — b3.",
      },
      "tac-pin-rook2": {
        title: "Rux otga qarshi",
        prompt:
          "Rux bilan shunday yurish top: u f6 dagi otni bogʻlasin — uning ortida f vertikalida f8 dagi shoh turibdi.",
        hint: "Rux f vertikaliga oʻtishi kerak. Rux bilan shoh orasida u yerda nima turibdi?",
        why: "Rux f1 ga boradi: f6 dagi ot f8 dagi shoh bilan bogʻlanadi (f7 katak boʻsh). Endi otga yana hujum qilsa boʻladi — u qochib qutula olmaydi.",
      },
      "tac-pin-quiz": {
        title: "Bogʻlash nima",
        prompt: "Oʻylab koʻr va javob ber.",
        hint: "Oʻylab koʻr: nega bogʻlangan dona yura olmaydi?",
        why: "Bogʻlangan dona shohni shohdan himoya qiladi: uni chiziqdan olib ketsang, shoh zarba ostida qoladi. Shuning uchun unga yana hujum qilishadi.",
        questions: [
          {
            text: "Qaysi dona bogʻlangan deyiladi?",
            options: [
              "Ortida shoh turgani uchun chiziqdan chiqa olmaydigan dona",
              "Urib boʻlmaydigan dona",
              "Oʻz shohi yonida turgan dona",
            ],
          },
          {
            text: "Qoralar yuradi. Qora ot c6 dan e5 ga yura oladimi?",
            options: ["Yoʻq, uni fil bogʻlab qoʻygan", "Ha, albatta"],
          },
          {
            text: "Bogʻlangan donani qanday yutish mumkin?",
            options: [
              "Unga yana bir marta hujum qilish — u qochib qutula olmaydi",
              "U oʻzi ketishini kutish",
              "Filni ruxga almashtirish",
            ],
          },
        ],
      },
    },
  },
  skewer: {
    title: "Rentgen",
    idea: "Qimmat donaga shoh: u ketadi, ortida esa boshqa dona qoladi — uni olamiz.",
    lesson: [
      {
        title: "Rentgen, yaʼni oʻtib ketuvchi zarba",
        text: [
          "**Rentgen** — qimmat donaga shoh (yoki hujum), uning ortida esa xuddi shu chiziqda boshqa dona turadi. Qimmat dona ketishga majbur, ikkinchisi esa himoyasiz qoladi.",
          "Mana bu yerda a8 dagi rux d8 dagi shohga shoh berdi. Shoh ketadi — rux esa h8 dagi farzinni oladi.",
        ],
      },
      {
        title: "Teskari bogʻlash",
        text: [
          "Bogʻlashda oldinda zaif dona, ortida kuchlisi turadi. Rentgenda esa aksincha: oldinda kuchli, ortida zaif dona.",
          "Shuning uchun kuchli dona ketadi, zaifini esa olishadi. g2 dagi fil bu yerda diagonal boʻylab shoh beryapti, shoh ortida esa rux turibdi.",
        ],
      },
      {
        title: "Rentgenni qayerdan izlash kerak",
        text: [
          "Chiziqlarga qara — vertikal, gorizontal va diagonallarga: u yerda shoh va farzin yoki rux yonma-yon turadi.",
          "Rentgenni faqat chiziq boʻylab yuradigan donalar qoʻya oladi: rux, fil va farzin.",
        ],
      },
    ],
    terms: [
      {
        term: "Rentgen",
        text: "Qimmat donaga hujum, uning ortida xuddi shu chiziqda boshqa dona turadi: birinchisi ketadi, ikkinchisini olishadi.",
      },
      { term: "Shoh", text: "Shohga hujum: darrov himoyalanish kerak." },
    ],
    exercises: {
      "tac-skewer-rook": {
        title: "Rux bilan rentgen",
        prompt: "Rux bilan yur: d8 dagi shohga shoh, uning ortida esa xuddi shu gorizontalda qora farzin turibdi.",
        hint: "Shoh va farzin sakkizinchi gorizontalda turibdi. Ruxni qayerga qoʻysang, ikkalasi bir chiziqda boʻladi?",
        why: "Rux a8 ga boradi: shoh! Shoh ketishi shart, rux esa h8 dagi farzinni oladi. Oldinda shoh turibdi — uni olib boʻlmaydi, ortida esa farzin.",
      },
      "tac-skewer-bishop": {
        title: "Fil bilan rentgen",
        prompt: "Fil bilan shoh ber: undan keyin shoh ortida, xuddi shu diagonalda rux qolsin.",
        hint: "d5 dagi shoh va a8 dagi rux bir diagonalda turibdi. Fil shu diagonalga boshqa tomondan chiqishi mumkin.",
        why: "Fil g2 ga boradi: g2–a8 diagonali boʻylab shoh. Shoh ketadi, fil esa a8 dagi ruxni oladi.",
      },
      "tac-skewer-queen": {
        title: "Farzin bilan rentgen",
        prompt: "Farzin bilan shoh ber: shoh ketadi, farzin esa c8 dagi ruxni oladi.",
        hint: "c5 dagi shoh va c8 dagi rux c vertikalida turibdi. Farzin shu vertikalga pastdan chiqsin.",
        why: "Farzin c1 ga (yoki c2 ga) boradi: c vertikali boʻylab shoh. Shoh ketadi, farzin c8 dagi ruxni oladi. Ikkala yurish ham toʻgʻri.",
      },
      "tac-skewer-rook2": {
        title: "Rux va farzin",
        prompt: "Rux bilan shoh ber: shoh ortida xuddi shu vertikalda qora farzin turibdi.",
        hint: "e6 dagi shoh va e8 dagi farzin e vertikalida turibdi. b1 dagi rux shu vertikalga chiqsin.",
        why: "Rux e1 ga boradi: e vertikali boʻylab shoh. Shoh ketadi, rux esa e8 dagi farzinni oladi.",
      },
      "tac-skewer-quiz": {
        title: "Rentgen nima",
        prompt: "Oʻylab koʻr va javob ber.",
        hint: "Esla, oldinda kim turibdi: kuchli dona yoki zaifmi?",
        why: "Rentgenda oldinda kuchli dona turadi: u ketishga majbur, zaif dona esa himoyasiz qoladi. Uni rux, fil va farzin qoʻya oladi.",
        questions: [
          {
            text: "Rentgen bogʻlashdan nimasi bilan farq qiladi?",
            options: [
              "Oldinda qimmatroq dona turadi, u ketadi va ikkinchisini ochib qoʻyadi",
              "Rentgenda hech qachon shoh boʻlmaydi",
              "Ular bir xil narsa",
            ],
          },
          {
            text: "Rux shohga shoh berdi, shoh ortida esa xuddi shu chiziqda farzin turibdi. Keyin nima boʻladi?",
            options: ["Shoh ketadi, rux farzinni oladi", "Farzin ketadi, rux shohni oladi", "Hech narsa oʻzgarmaydi"],
          },
          {
            text: "Qaysi donalar rentgen qoʻya oladi?",
            options: ["Chiziq boʻylab yuradiganlari: rux, fil va farzin", "Ot va piyoda", "Faqat shoh"],
          },
        ],
      },
    },
  },
  discover: {
    title: "Ochiq shoh",
    idea: "Bir dona ketadi — ortidan shoh ochiladi. Shoh band, ketgan dona esa ura oladi.",
    lesson: [
      {
        title: "Yashiringan dona",
        text: [
          "**Ochiq shoh**: sening donang chiziqdan ketadi — va uning ortidan rux, fil yoki farzin ochilib, shoh beradi. Shohni yurgan dona emas, ortida turgani beradi!",
          "Mana bu yerda e2 dagi ot e vertikalini e1 dagi ruxdan toʻsib turibdi. Ot ketishi bilan rux e8 dagi shohga shoh beradi.",
        ],
      },
      {
        title: "Ikki barobar kuch",
        text: [
          "Shoh shohga javob berishi shart. U band ekan, chiziqdan ketgan dona xohlagan ishini qila oladi: farzinni olish, ruxga hujum qilish, vilka qoʻyish.",
          "Raqib hech narsaga ulgurmaydi. Shuning uchun ochiq shoh — eng kuchli usullardan biri.",
        ],
      },
      {
        title: "Ochiq shohni qanday oʻylab topish mumkin",
        text: [
          "Oʻz donangni top: u raqib shohiga qaratilgan rux, fil yoki farzin oldida turishi kerak.",
          "Endi oʻylab koʻr: u qayerga foydali yura oladi? Eng yaxshisi — nimanidir oladigan joyga.",
        ],
      },
    ],
    terms: [
      { term: "Ochiq shoh", text: "Shohni yurgan dona emas, uning ortida turgan va ochilib qolgan dona beradi." },
    ],
    exercises: {
      "tac-discover-knight": {
        title: "Ot yuradi — rux shoh beradi",
        prompt:
          "e1 dagi rux e2 dagi ot ortida yashiringan, e8 dagi shoh esa xuddi shu vertikalda. Ot bilan shunday yurish top: u farzinni olsin va shohni ochsin.",
        hint: "Ot e vertikalidan ketishi kerak — lekin yoʻlda qimmat narsani olsin.",
        why: "Ot d4 dagi farzinni oladi. Oʻzi shoh bermaydi — shohni e1 dagi rux beradi, chunki ot vertikaldan ketdi. Shoh oʻzini qutqarish bilan band, farzin esa taxtadan olib tashlangan.",
      },
      "tac-discover-bishop": {
        title: "Fil yuradi — rux shoh beradi",
        prompt:
          "c1 dagi rux c8 dagi shohga qaragan, lekin c3 dagi fil halaqit beryapti. Fil bilan shunday yurish top: u farzinni olsin.",
        hint: "Fil diagonal boʻylab yuradi va e5 dagi farzinni ura oladi. Shundan keyin rux c vertikali boʻylab shoh beradi.",
        why: "Fil e5 dagi farzinni oladi va c vertikalini ochadi: rux shoh beradi. Shohga farzin bilan ishi yoʻq — u allaqachon olingan.",
      },
      "tac-discover-pawn": {
        title: "Hatto piyoda ham!",
        prompt:
          "e4 dagi piyoda e vertikalini ruxdan toʻsib turibdi. Piyoda bilan shunday yurish top: u farzinni olsin va shohni ochsin.",
        hint: "Piyoda oldinga diagonal boʻylab uradi. d5 dagi farzin — yonginasida.",
        why: "Piyoda d5 dagi farzinni oladi va e vertikalidan ketadi: rux shoh beradi. Ochiq shohni hatto piyoda ham uyushtira oladi.",
      },
      "tac-discover-bishop2": {
        title: "Uzun diagonal",
        prompt:
          "a1 dagi fil diagonal boʻylab h8 dagi shohga qaragan, lekin d4 dagi ot halaqit beryapti. Ot bilan shunday yurish top: u farzinni olsin.",
        hint: "Ot «L» harfi shaklida uradi. e6 dagi farzin d4 dan bir sakrash narida.",
        why: "Ot e6 dagi farzinni oladi va diagonalni ochadi: a1 dagi fil h8 dagi shohga shoh beradi. Otning oʻzi shoh berishi shart emas — uning oʻrniga fil beradi.",
      },
      "tac-discover-quiz": {
        title: "Ochiq shoh nima",
        prompt: "Oʻylab koʻr va javob ber.",
        hint: "Oʻylab koʻr: yurishdan keyin shohga aslida kim qarab turibdi?",
        why: "Ochiq shohda shohni ortida turgan dona beradi. Ketgan dona esa bu paytda ura yoki hujum qila oladi — shoh band.",
        questions: [
          {
            text: "Ochiq shoh nima?",
            options: [
              "Shohni yurgan dona emas, uning ortida turgani beradigan shoh",
              "Partiyaning birinchi yurishidagi shoh",
              "Piyoda bilan berilgan shoh",
            ],
          },
          {
            text: "Nega ochiq shoh shunchalik kuchli?",
            options: [
              "Ketgan dona ura yoki hujum qila oladi, shoh esa shoh bilan band",
              "Chunki u chiroyli koʻrinadi",
              "Chunki uni qaytarib boʻlmaydi",
            ],
          },
          {
            text: "Ochiq shohda shohni qaysi dona beradi?",
            options: ["Joyida qolgani: ketgan dona ortidagi rux, fil yoki farzin", "Har doim yurgan dona", "Shoh"],
          },
        ],
      },
    },
  },
  mates: {
    title: "Turli donalar bilan mot",
    idea: "Mot qoʻyishni hamma dona biladi, hatto piyoda ham: shohning ketadigan joyi qolmasin, shohni esa bartaraf etib boʻlmasin.",
    lesson: [
      {
        title: "Mot uchun uchta shart",
        text: [
          "Mot boʻlishi uchun uchta narsa kerak: **shoh**; shohning **ketadigan joyi yoʻq** (yonidagi kataklar oʻz donalari bilan band yoki zarba ostida); shohni **bartaraf etib boʻlmaydi** — shoh bergan donani urib ham, undan toʻsilib ham boʻlmaydi.",
          "Mana bu yerda c4 dagi fil mot qoʻydi: g8 dagi shoh oʻz donalari bilan qisilgan, f7 katagi esa filning zarbasi ostida.",
        ],
      },
      {
        title: "Piyoda ham mot qoʻyadi",
        text: [
          "Piyoda oldinga diagonal boʻylab shoh beradi. Uni boshqa dona himoya qilishi kerak — aks holda shoh uni oddiygina urib oladi.",
          "Mana bu yerda g7 dagi piyodani g1 dagi rux himoya qilyapti: h8 dagi shoh piyodani ura olmaydi, ketadigan joyi ham yoʻq.",
        ],
      },
      {
        title: "Tayanchli farzin",
        text: [
          "Himoyasiz farzin shohning yonida — shunchaki sovgʻa: shoh uni urib oladi. Shuning uchun farzin sherik bilan birga mot qoʻyadi.",
          "Mana bu yerda d3 dagi fil h7 dagi farzinni himoya qilyapti, shuning uchun g8 dagi shoh uni ura olmaydi.",
        ],
      },
      {
        title: "Aylanish bilan mot",
        text: [
          "Oxirgidan oldingi gorizontalda turgan piyoda farzinga yoki ruxga aylanib, darrov mot qoʻyishi mumkin.",
          "Har doim tekshirib koʻr: aylanish bilan mot yoʻqmi? Uni payqamay qolish oson.",
        ],
      },
    ],
    terms: [
      {
        term: "Mot",
        text: "Himoyalanib boʻlmaydigan shoh: shohning ketadigan joyi yoʻq, shohni esa bartaraf etib boʻlmaydi.",
      },
      {
        term: "Tayanch",
        text: "Boshqa donani himoya qiladigan dona: tayanchsiz shoh ham farzinni, ham piyodani urib oladi.",
      },
    ],
    exercises: {
      "tac-mates-bishop": {
        title: "Fil bilan mot",
        prompt: "Fil bilan mot qoʻyadigan yurishni top: qora shoh g8 ga oʻz donalari xalaqit beryapti.",
        hint: "Shoh g8 ga diagonal boʻylab, f7 katagi orqali shoh berish kerak. Fil shu diagonalga qayerdan chiqa oladi?",
        why: "Fil c4 ga boradi: f7 orqali diagonal boʻylab shoh. Shohning ketadigan joyi yoʻq: f8 va h8 band, g7 va h7 da piyodalar turibdi, f7 katagi esa filning zarbasi ostida. Toʻsiladigan narsa yoʻq — bu mot.",
      },
      "tac-mates-pawn": {
        title: "Piyoda bilan mot",
        prompt: "Piyoda bilan mot qoʻyadigan yurishni top.",
        hint: "Piyoda oldinga diagonal boʻylab shoh beradi. U qaysi katakka tursa, h8 ga hujum qiladi va uni rux himoya qiladi?",
        why: "Piyoda g7 ga boradi: h8 dagi shohga shoh. Piyodani g1 dagi rux himoya qiladi, shuning uchun shoh uni ura olmaydi, g8 dagi fil esa faqat diagonal boʻylab yuradi va g7 ni urmaydi. Shohning ketadigan joyi yoʻq: g8 va h7 oʻz donalari bilan band.",
      },
      "tac-mates-queen": {
        title: "Tayanchli farzin",
        prompt: "Farzin bilan mot qoʻyadigan yurishni top. Unga fil yordam beradi.",
        hint: "d3 dagi fil h7 katagiga qarab turibdi. Farzin oʻsha yerga tursa, shoh uni ura oladimi?",
        why: "Farzin h7 dagi piyodani oladi: shoh farzinni ura olmaydi, chunki uni d3 dagi fil himoya qiladi. h8 katagi farzin zarbasi ostida, f8 ruxga band, f7 va g7 da piyodalar. Bu mot.",
      },
      "tac-mates-promotion": {
        title: "Aylanish bilan mot",
        prompt: "Shunday yurish top: piyoda aylanib, mot qoʻysin. Farzin ham, rux ham toʻgʻri keladi.",
        hint: "b7 dagi piyoda oxirgidan oldingi gorizontalda turibdi. U aylanib, qayerga tursa, g8 dagi shohga nima boʻladi?",
        why: "Piyoda b8 ga boradi va farzinga (yoki ruxga) aylanadi: sakkizinchi gorizontal boʻylab shoh. g8 dagi shohning ketadigan joyi yoʻq — f7, g7, h7 piyodalari uni yopib turibdi, shohdan toʻsilib boʻlmaydi. Mot!",
      },
      "tac-mates-quiz": {
        title: "Mot nima",
        prompt: "Oʻylab koʻr va javob ber.",
        hint: "Motning uchta shartini esla: shoh, ketadigan joy yoʻq, shohni bartaraf etib boʻlmaydi.",
        why: "Mot — qutulib boʻlmaydigan shoh. Shoh yonidagi dona esa himoya qilingan boʻlishi kerak, aks holda shoh uni urib oladi.",
        questions: [
          {
            text: "Mot boʻlishi uchun nima kerak?",
            options: [
              "Chiqib boʻlmaydigan shoh: shohning ketadigan joyi yoʻq va shohni bartaraf etib boʻlmaydi",
              "Shunchaki shohga shoh berish",
              "Farzinni urib olish",
            ],
          },
          {
            text: "Piyoda mot qoʻya oladimi?",
            options: [
              "Ha, agar uni boshqa dona himoya qilsa va shohning ketadigan joyi boʻlmasa",
              "Yoʻq, piyodalar shoh bermaydi",
              "Faqat bir katak yurganda",
            ],
          },
          {
            text: "Nega himoyasiz farzinni shoh yoniga qoʻyib boʻlmaydi?",
            options: [
              "Shoh farzinni oddiygina urib oladi",
              "Farzin yonma-yon shoh bera olmaydi",
              "Qoidalar buni taqiqlaydi",
            ],
          },
        ],
      },
    },
  },
  traps: {
    title: "Debyutdagi mot",
    idea: "Eng tezkor motlar — va ularga yoʻl qoʻymaslik usuli.",
    lesson: [
      {
        title: "Bolalar moti",
        text: [
          "Eng mashhur tezkor mot — **bolalar moti**. Farzin va fil f7 piyodasiga qaratiladi: partiya boshida uni faqat shoh himoya qiladi.",
          "Oqlar e4 piyodasini yuradi, keyin farzinni h5 ga, filni c4 ga chiqaradi — va f7 da farzin bilan mot qoʻyishga tahdid qiladi.",
        ],
      },
      {
        title: "Qanday himoyalanish kerak",
        text: [
          "Bolalar motini qaytarish oson. f7 ni himoya qilish yoki farzinni haydab yuborish kerak. Yaxshi yurishlar: g7 piyodasini g6 ga yurish (u farzinga hujum qiladi), farzinni e7 ga yoki otni h6 ga qoʻyish.",
          "Ammo g8 dagi otni f6 ga yurish — xato: farzin baribir f7 ni urib, mot qoʻyadi.",
        ],
      },
      {
        title: "Ahmoq moti",
        text: [
          "**Ahmoq moti** atigi ikki yurishda qoʻyiladi: oqlar oʻz shohiga diagonalni oʻzlari ochib beradi, qoralarning farzini esa h4 ga uradi.",
          "Shohni asra: f va g piyodalarini keraksiz yurma.",
        ],
      },
    ],
    terms: [
      {
        term: "Bolalar moti",
        text: "Farzin bilan f7 da, c4 dagi fil yordamida qoʻyiladigan mot — eng mashhur tezkor mot.",
      },
      { term: "Ahmoq moti", text: "Eng tezkor mot: f3 va g4 yurishlaridan keyin qora farzin h4 da mot qoʻyadi." },
      {
        term: "f7 — zaif nuqta",
        text: "Partiya boshida f7 piyodasini faqat shoh himoya qiladi — shuning uchun unga farzin va filni qaratishadi.",
      },
    ],
    exercises: {
      "tac-traps-scholar": {
        title: "Bolalar moti",
        prompt: "Oqlar yuradi. Farzin bilan f7 da mot qoʻyadigan yurishni top.",
        hint: "Farzin va fil f7 piyodasiga qaratilgan. Farzin uni oladi, c4 dagi fil esa farzinni himoya qiladi.",
        why: "Farzin f7 ni oladi: c4 dagi fil uni himoya qiladi, shuning uchun e8 dagi shoh farzinni ura olmaydi. Shoh atrofidagi kataklar band yoki zarba ostida — bu mot.",
      },
      "tac-traps-fool": {
        title: "Ahmoq moti",
        prompt: "Qoralar yuradi. Oqlar oʻz shohiga diagonalni ochib qoʻydi. Mot qoʻyadigan yurishni top.",
        hint: "Farzin diagonal boʻylab yuradi. d8 dan h4 ga, u yerdan esa e1 dagi shohga toʻgʻri qaraydi.",
        why: "Farzin h4 ga boradi: h4–e1 diagonali boʻylab shoh. f3 va g4 piyodalari uning yoʻlini oʻzlari ochib berdi. e1 dagi shohning ketadigan joyi yoʻq, f2 va g3 kataklariga esa oqlar toʻsish uchun hech narsa qoʻya olmaydi.",
      },
      "tac-traps-quiz": {
        title: "Tuzoqqa tushmaslik",
        prompt: "Oʻylab koʻr va javob ber.",
        hint: "Oʻylab koʻr: farzin f7 ni urib, mot qoʻya olmasligi uchun nima qilish kerak?",
        why: "g6 piyodasi farzinni haydaydi, mot yoʻq. Ot f6 yordam bermaydi: farzin f7 ni urib, mot qoʻyadi.",
        questions: [
          {
            text: "Qoralar yuradi. Oqlar f7 da farzin bilan mot qoʻyishga tahdid qilyapti. Qaysi yurish qutqaradi?",
            options: ["g7 piyodasi g6 ga: u farzinga hujum qiladi", "g8 dagi ot f6 ga", "a7 piyodasi a6 ga"],
          },
          {
            text: "Partiya boshida qoralarning eng zaif katagi qaysi?",
            options: ["f7: uni faqat shoh himoya qiladi", "a7", "d7"],
          },
          {
            text: "Ahmoq motiga tushmaslik uchun nima yordam beradi?",
            options: [
              "f va g piyodalarini keraksiz yurmaslik",
              "Farzinni darrov chiqarish",
              "Hech qachon rokirovka qilmaslik",
            ],
          },
        ],
      },
    },
  },
  defence: {
    title: "Shohdan himoya",
    idea: "Shohdan qutulishning uchta yoʻli: shoh bergan donani urish, toʻsilish yoki shoh bilan ketish.",
    lesson: [
      {
        title: "Uchta yoʻl",
        text: [
          "Shohga shoh berilsa, darrov himoyalanish kerak. Uchta yoʻl bor: shoh bergan donani **urib olish**, oʻz donang bilan **toʻsilish** yoki shoh bilan xavfsiz katakka **ketish**.",
          "Uchalasini ham tekshirib koʻr — ba'zan eng yaxshi yurish umuman shoh bilan emas.",
        ],
      },
      {
        title: "Toʻsilish",
        text: [
          "Rux, fil va farzindan toʻsilsa boʻladi: oʻz donangni ular bilan shoh orasidagi chiziqqa qoʻyish kerak. Ot va piyodaning shohidan toʻsilib boʻlmaydi — ular toʻgʻridan-toʻgʻri uradi.",
          "Mana bu yerda a1 dagi rux birinchi gorizontal boʻylab shoh beryapti. Fil b1 ga yoki f1 ga turib, shohni toʻsishi mumkin.",
        ],
      },
      {
        title: "Shoh bilan ketish va qoʻsh shoh",
        text: [
          "Shoh raqibning hech bir donasi urmaydigan katakka ketadi. Esingda boʻlsin: shoh bergan rux yoki filning chizigʻi shohdan keyin ham davom etadi.",
          "Agar shohni bir yoʻla ikkita dona bersa — **qoʻsh shoh** — urib ham, toʻsilib ham boʻlmaydi: faqat shoh ketishi mumkin.",
        ],
      },
    ],
    terms: [
      {
        term: "Qoʻsh shoh",
        text: "Ikkita donadan bir yoʻla berilgan shoh: undan faqat shohning yurishi bilan qutulish mumkin.",
      },
      { term: "Toʻsilish", text: "Oʻz donangni shoh bergan dona bilan shoh orasiga qoʻyish." },
    ],
    exercises: {
      "tac-defence-take-pawn": {
        title: "Shoh bergan donani urish",
        prompt: "Oqlarga shoh berildi. Piyoda bilan shoh bergan filni uradigan yurishni top.",
        hint: "b4 dagi fil shohga diagonal boʻylab shoh beryapti. Sening qaysi donang uni ura oladi?",
        why: "a3 dagi piyoda b4 dagi filni oladi: shoh beradigan dona qolmadi, shoh ham yoʻq. Shoh bergan donani oddiygina urish mumkin boʻlsa, bu koʻpincha eng yaxshi javob.",
      },
      "tac-defence-take-queen": {
        title: "Farzin otni uradi",
        prompt: "Oqlarga ot shoh berdi. Uni uradigan yurishni top.",
        hint: "Otning shohidan toʻsilib boʻlmaydi — u sakraydi. Lekin otni urib olsa boʻladi. Uni kim koʻryapti?",
        why: "Farzin diagonal boʻylab f3 dagi otni oladi. Otning shohidan toʻsilib boʻlmaydi, shuning uchun uni urish yoki shoh bilan ketish qoladi.",
      },
      "tac-defence-block": {
        title: "Fil bilan toʻsilish",
        prompt: "Oqlarga rux shoh berdi. Fil bilan shohni toʻsadigan yurishni top.",
        hint: "a1 dagi rux birinchi gorizontal boʻylab shoh beryapti. Filni shu gorizontalga, rux bilan shoh orasiga qoʻy.",
        why: "Fil f1 ga (yoki b1 ga) boradi va shohni toʻsadi. Ikkala yurish ham toʻgʻri: fil rux bilan shoh orasidagi chiziqqa turadi.",
      },
      "tac-defence-run": {
        title: "Shoh ketadi",
        prompt: "Oqlarga rux shoh berdi. Qutulishning yagona yoʻlini top.",
        hint: "Toʻsilish ham, urish ham mumkin emas. Shoh bilan ketish qoladi — rux urmaydigan katakka.",
        why: "Shoh f2 ga boradi: d1 dagi rux birinchi gorizontalni uradi, f2 esa uning chizigʻidan tashqarida. f1 va h1 da shoh shoh ostida qolardi, g2 va h2 kataklari esa piyodalar bilan band.",
      },
      "tac-defence-quiz": {
        title: "Shohdan qanday himoyalanish",
        prompt: "Oʻylab koʻr va javob ber.",
        hint: "Oʻylab koʻr: shoh bergan donaga nima qilish mumkin va shohga nima?",
        why: "Shohdan uch yoʻl bilan himoyalanishadi. Qoʻsh shohda faqat shohning yurishi qoladi, hech bir yoʻl yordam bermasa — bu mot.",
        questions: [
          {
            text: "Shohdan nechta usul bilan himoyalanish mumkin?",
            options: [
              "Uchta: shoh bergan donani urish, toʻsilish yoki shoh bilan ketish",
              "Bitta: shoh bilan ketish",
              "Ikkita: toʻsilish yoki urish",
            ],
          },
          {
            text: "Oqlarga rux shoh berdi. Bu yerda ular qanday himoyalana oladi?",
            options: ["Faqat shoh bilan: f2 ga ketish", "Piyoda bilan toʻsilish", "Ruxni urish"],
          },
          {
            text: "Shoh qoʻsh shoh ostida. Nima bilan himoyalanish mumkin?",
            options: [
              "Faqat shohning yurishi bilan",
              "Shoh bergan donalardan birini urish",
              "Istalgan dona bilan toʻsilish",
            ],
          },
        ],
      },
    },
  },
  rules: {
    title: "Maxsus qoidalar va durranglar",
    idea: "Oʻtib ketayotganda olish, pat va uchta durrang usuli: yutgan partiyani yoʻqotmaslik uchun ularni bilish kerak.",
    lesson: [
      {
        title: "Oʻtib ketayotganda olish",
        text: [
          "Piyoda **ikki katak** yurib, raqib piyodasi yoniga kelib tursa, uni xuddi bir katak yurganday olish mumkin: sening piyodang oʻtib ketilgan katakka turadi.",
          "Oʻtib ketayotganda faqat darrov, keyingi yurishda olinadi. Ulgurmasang — huquq yoʻqoladi. Mana bu yerda qora piyoda d7–d5 yurdi va oq e5 uni d6 da oladi.",
        ],
      },
      {
        title: "Pat: shoshilma!",
        text: [
          "**Pat** — shohga shoh berilmagan, lekin hech bir dona yura olmaydigan holat. Bu durrang, hatto bir tomonda donalar ancha koʻp boʻlsa ham.",
          "Yutayotganingda doim tekshir: yurishingdan keyin raqibda yurish bormi? Yoʻq va shoh ham yoʻq boʻlsa — bu mot emas, pat.",
        ],
      },
      {
        title: "Boshqa durranglar",
        text: [
          "**Uch marta takrorlanish**: bir xil pozitsiya bir xil yurish navbati bilan uch marta takrorlansa, durrang talab qilish mumkin.",
          "**50 yurish qoidasi**: har bir tomon 50 yurish davomida dona urmasa va piyoda yurmasa, durrang talab qilish mumkin.",
          "**Material yetarli emas**: yolgʻiz shoh yoki shoh va ot yoxud fil bilan mot qoʻyib boʻlmaydi — bu durrang.",
        ],
      },
    ],
    terms: [
      {
        term: "Oʻtib ketayotganda olish",
        text: "Piyoda hozirgina ikki katak yurib, yoniga kelib turgan piyodani xuddi bir katak yurganday olishi.",
      },
      { term: "Pat", text: "Shohga shoh yoʻq, lekin yurishga dona ham yoʻq: durrang." },
      { term: "Uch marta takrorlanish", text: "Bir xil pozitsiya uch marta: durrang talab qilish mumkin." },
    ],
    exercises: {
      "tac-rules-ep-white": {
        title: "Oʻtib ketayotganda olish",
        prompt: "Oqlar yuradi. Qora piyoda hozirgina ikki katak yurdi. Oʻtib ketayotganda olishni top.",
        hint: "e5 dagi oq piyoda d5 dagi piyodani diagonal boʻylab oladi — u sakrab oʻtgan katakka.",
        why: "e5 dagi piyoda d6 ga boradi va d5 dagi qora piyodani oladi, xuddi u bir katak yurganday. Oʻtib ketayotganda faqat darrov olinadi.",
      },
      "tac-rules-ep-black": {
        title: "Qoralar oʻtib ketayotganda oladi",
        prompt: "Qoralar yuradi. Oq piyoda hozirgina e2–e4 yurdi. Oʻtib ketayotganda olishni top.",
        hint: "d4 dagi qora piyoda pastga diagonal boʻylab uradi. Oq piyoda e3 ustidan sakrab oʻtdi.",
        why: "d4 dagi piyoda e3 ga boradi va e4 dagi piyodani oladi. Oʻtib ketayotganda olish ikkala tomon uchun ham ishlaydi.",
      },
      "tac-rules-mate-not-stale": {
        title: "Mot, pat emas",
        prompt: "Oqlar yuradi va yutadi. Mot top — lekin patdan ehtiyot boʻl!",
        hint: "Farzin shoh bersin, f6 dagi shoh esa uni himoya qilsin. Farzinning g6 ga yurishi pat beradi: qoralarda yurish ham, shoh ham yoʻq.",
        why: "Farzin g7 ga boradi: shoh, h8 dagi shoh farzinni ura olmaydi (uni f6 dagi shoh himoya qiladi) va ketadigan joyi ham yoʻq — bu mot. g6 ga yurish esa pat, durrang.",
      },
      "tac-rules-find-stalemate": {
        title: "Patni top",
        prompt: "Oqlar yutyapti, lekin farzinning bitta yurishi — pat. Uni top, hech qachon shunday yurmaslik uchun.",
        hint: "Shunday yurish kerak: qora shohga shoh yoʻq, lekin bitta ham boʻsh katak qolmaydi.",
        why: "b6 dagi farzin a8 dagi shohning hamma kataklarini yopadi, lekin shoh bermaydi: bu pat, durrang. Yutuq yoʻli — farzin b7 ga mot bilan.",
      },
      "tac-rules-quiz": {
        title: "Qoidalar va durranglar",
        prompt: "Oʻylab koʻr va javob ber.",
        hint: "Qoidalarni esla: oʻtib ketayotganda darrov olinadi, takrorlanish — uch marta, mot uchun material kerak.",
        why: "Oʻtib ketayotganda darrov olinadi. Takrorlanish bilan durrang — uchinchi martada. Yolgʻiz shoh va bitta ot (yoki fil) bilan mot qoʻyib boʻlmaydi.",
        questions: [
          {
            text: "e5 da oq piyoda, d5 dagi qora piyoda esa anchadan beri turibdi. Uni hozir oʻtib ketayotganda olsa boʻladimi?",
            options: ["Yoʻq: oʻtib ketayotganda faqat hozirgina ikki katak yurgan piyodani olishadi", "Ha, doim"],
          },
          {
            text: "Durrang talab qilish uchun pozitsiya necha marta takrorlanishi kerak?",
            options: ["Uch marta", "Ikki marta", "Oʻn marta"],
          },
          {
            text: "Shoh va ot yolgʻiz shohga mot qoʻyishga yetadimi?",
            options: ["Yoʻq, mot chiqmaydi — bu durrang", "Ha, doim", "Faqat oqlar yurganda"],
          },
        ],
      },
    },
  },
};
