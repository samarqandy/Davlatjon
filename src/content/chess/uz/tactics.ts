import type { Uz } from "../../localize";
import type { TACTICS, TACTICS_SCHOOL } from "../tactics";

export const tacticsSchoolUz: Uz<typeof TACTICS_SCHOOL> = {
  title: "Taktika",
  subtitle: "Donalarni yutib beradigan toʻrtta usul",
  about:
    "Vilka, bogʻlash, rentgen va ochiq shoh. Har bir mavzuda — qisqa dars va haqiqiy shaxmat taxtasidagi mashqlar. Hamma pozitsiyalar shaxmat dvigateli bilan tekshirilgan.",
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
};
