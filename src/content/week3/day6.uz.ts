/** Неделя 3, день 6 — по-узбекски (накладка на day6.ts, правила — docs/uzbek-style.md). */
import type { Uz } from "../localize";
import type { Day } from "../types";

/**
 * Алфавит для узбекских шифров: только однобуквенные буквы в узбекском порядке — 24 буквы.
 * Oʻ, gʻ, sh и ch пишутся двумя знаками, поэтому в шифрах их нет, и слова в шифрах — без них.
 */
const UZ_ALPHABET = "ABDEFGHIJKLMNOPQRSTUVXYZ";

/** Таблица «буква — номер» по узбекскому алфавиту (вместо русской из 33 букв). */
const letterNumbers: [string, string][] = [...UZ_ALPHABET].map((ch, i) => [ch, String(i + 1)]);

/** Столбцы карты: русские А, Б, В, Г, Д → латинские по порядку. */
const mapCols = ["A", "B", "C", "D", "E"];

export const day6Uz: Uz<Day> = {
  title: "Shifrlar va kodlar",
  habit: { name: "Men shifrlarni yechaman" },
  intro: [
    "Bugun sen — razvedkachi va shifrlovchisan 🔐. Shifr — soʻzlarni sirli belgilarga aylantiradigan qoida. Qoidani bilgan odam xatni oʻqiy oladi, bilmagan esa hech narsa tushunmaydi.",
    "Eng zukkolari esa qoidani bilmasa ham, shifrni yechib oladi: ishoralarga, qonuniyatlarga qarab, qadamma-qadam mulohaza yuritib. Bugun aynan shu bilan shugʻullanamiz!",
  ],
  tasks: {
    w3d6t1: {
      title: "Harf-sonlar",
      body: [
        {
          text: "Har bir harf oʻrniga uning alifbodagi tartib raqami yozilgan: `A — 1`, `B — 2`, `D — 3` va hokazo. Oʻ, gʻ, sh va ch harflarini bu shifrga olmadik: ular ikki belgi bilan yoziladi.",
        },
        { visual: { pairs: { $replace: letterNumbers } } },
        { text: "Soʻzlarning shifrini och:" },
        // Номера букв — по узбекскому алфавиту, поэтому вопросы заменены целиком.
        { $replace: { type: "question", label: "a)", text: "`3, 1, 3, 1`" } },
        { $replace: { type: "question", label: "b)", text: "`5, 8, 11`" } },
        { $replace: { type: "question", label: "c)", text: "`23, 20, 11, 3, 20, 24`" } },
      ],
      answer: {
        fields: {
          a: { label: "a) soʻz", answer: "DADA" },
          b: { label: "b) soʻz", answer: "FIL" },
          c: { label: "c) soʻz", answer: "YULDUZ" },
        },
      },
      followUps: ["Oʻz ismingni sonlar bilan shifrla.", "24-raqam ostida qaysi harf yashiringan? 1-raqam ostida-chi?"],
      hints: [
        "Shartni qayta oʻqi: har bir son — harfning alifbodagi tartib raqami.",
        "Nima maʼlum: 1 — bu A. Jadvaldan 3 sonini top.",
        "Sonlarni bir qatorga yozib chiq, har birining tagiga topgan harfingni yoz.",
        "a) savolda bor-yoʻgʻi ikki xil son bor: 3 va 1. Bular qaysi harflar?",
        "Har bir sonni jadvalning pastki qatoridan izla va uning ustidagi harfni oʻqi.",
      ],
      solution: {
        answer: "a) DADA; b) FIL; c) YULDUZ.",
        explanation: [
          "3 — D, 1 — A: DADA.",
          "5 — F, 8 — I, 11 — L: FIL.",
          "23 — Y, 20 — U, 11 — L, 3 — D, 20 — U, 24 — Z: YULDUZ.",
        ],
        discuss: ["Bu eng oddiy shifr: sonlar 24 dan oshmasligini payqagan odam uni osongina yechadi."],
      },
    },
    w3d6t2: {
      title: "Soʻz qancha tortadi?",
      body: [
        {
          text: "Soʻzdagi hamma harflarning raqamlarini qoʻshsak, soʻzning «ogʻirligi» chiqadi. Masalan, FIL: `5 + 8 + 11 = 24`. Harflarning raqamlarini oldingi masaladagi jadvaldan qara.",
        },
        { text: "Har bir soʻz qancha «tortadi»?" },
        { label: "a)", text: "DUM" },
        { label: "b)", text: "OLMA" },
        { label: "c)", text: "OPA" },
      ],
      answer: {
        fields: {
          dom: { label: "a) DUM" },
          les: { label: "b) OLMA" },
          mama: { label: "c) OPA" },
        },
      },
      followUps: [
        "60 dan koʻp «tortadigan» soʻz top.",
        "Qaysi ikkita uch harfli soʻz bir xil «tortadi»? Topishga urinib koʻr.",
      ],
      hints: [
        "Shartni qayta oʻqi: soʻzning «ogʻirligi» — uning harflari raqamlarining yigʻindisi.",
        "Nima maʼlum: D — 3, U — 20, M — 12.",
        "Har bir harfning tagiga uning raqamini yoz, keyin qoʻsh.",
        "OPA uchun: `14 + 15 + 1`. Avval `14 + 1 = 15`, keyin `15 + 15`.",
        "Qulay tartibda qoʻsh: avval yaxlit sonlarni yoki bir xillarini, keyin qolganini.",
      ],
      solution: {
        answer: "a) 35; b) 38; c) 30.",
        explanation: ["DUM: `3 + 20 + 12 = 35`.", "OLMA: `14 + 11 + 12 + 1 = 38`.", "OPA: `14 + 15 + 1 = 30`."],
        discuss: [
          "Bu — ogʻzaki hisob uchun razminka. Musobaqa uyushtirsangiz ham boʻladi: kim uch harfli eng «ogʻir» soʻzni topadi?",
        ],
      },
    },
    w3d6t3: {
      title: "Yashirin nomlar",
      body: [
        {
          text: "Toʻrt razvedkachi — Ali, Bobur, Vasila va Diyor — yashirin nom oldi: Lochin, Yoʻlbars, Boʻri va Burgut. Har kimga bittadan nom tegdi, nomlar takrorlanmaydi.",
        },
        {
          items: [
            "Ali — Lochin ham, Burgut ham emas.",
            "Vasila — Boʻri ham, Yoʻlbars ham emas.",
            "Boburning yashirin nomi — qush.",
            "Diyor — Lochin ham, Yoʻlbars ham emas.",
            "Vasila — Lochin emas.",
          ],
        },
        {
          visual: {
            rows: ["Ali", "Bobur", "Vasila", "Diyor"],
            cols: ["Lochin", "Yoʻlbars", "Boʻri", "Burgut"],
          },
        },
      ],
      answer: {
        prompt: "Har kimning yashirin nomi qanday?",
        items: {
          ali: { label: "Ali" },
          bobur: { label: "Bobur" },
          vika: { label: "Vasila" },
          dima: { label: "Diyor" },
        },
        options: {
          falcon: { label: "Lochin" },
          tiger: { label: "Yoʻlbars" },
          wolf: { label: "Boʻri" },
          eagle: { label: "Burgut" },
        },
      },
      followUps: [
        "Qaysi ishora eng muhimi boʻlib chiqdi? Qaysi biridan boshlading?",
        "5-ishorani olib tashla. Unda nechta yechim boʻladi?",
      ],
      hints: [
        "Hamma ishoralarni qayta oʻqi. Qaysi nomlar — qushlar?",
        "Nima maʼlum: Lochin va Burgut — qushlar, Yoʻlbars va Boʻri — toʻrt oyoqli hayvonlar.",
        "Jadvalda nom aniq toʻgʻri kelmaydigan joyga ✗ qoʻy. Qaysi qatorda bitta boʻsh katak qolsa, unga ✓ qoʻy.",
        "Vasiladan boshla: 2- va 5-ishoralar uning toʻrtta nomidan uchtasini oʻchiradi.",
        "Kimningdir nomi topilsa, bu nomni qolgan hammada — ustun boʻylab oʻchirib chiq.",
      ],
      solution: {
        answer: "Ali — Yoʻlbars, Bobur — Lochin, Vasila — Burgut, Diyor — Boʻri.",
        explanation: [
          "Vasila — Boʻri ham, Yoʻlbars ham, Lochin ham emas: demak, Vasila — Burgut.",
          "Bobur — qush, lekin Burgut band: Bobur — Lochin.",
          "Diyor — Lochin ham, Yoʻlbars ham emas, Burgut esa band: Diyor — Boʻri.",
          "Aliga Yoʻlbars qoladi. 1-ishorani tekshiramiz: Ali — Lochin ham, Burgut ham emas ✓.",
        ],
        discuss: [
          "5-ishorasiz ikkita yechim boʻlardi: Vasila Lochin boʻlib chiqishi ham mumkin edi.",
          "Bu — birinchi haftadagidek chiqarib tashlash jadvali. Farzandingiz eng «kuchli» ishoradan oʻzi boshlasa, juda yaxshi.",
        ],
      },
    },
    w3d6t4: {
      title: "Harfma-harf",
      body: [
        {
          text: "Razvedkachi KITOB soʻzini **LJUPD** deb, TOP soʻzini esa **UPQ** deb shifrlagan. Shifrning qoidasini top.",
        },
        {
          text: "Alifbo: A B D E F G H I J K L M N O P Q R S T U V X Y Z. (Oʻ, gʻ, sh va ch bu shifrda ishlatilmaydi.)",
        },
        { label: "a)", text: "Shu qoida boʻyicha SUT soʻzini shifrla." },
        { label: "b)", text: "POB soʻzining shifrini och." },
      ],
      answer: {
        fields: {
          encode: { label: "a) shifrlangan soʻz", answer: "TVU" },
          decode: { label: "b) soʻz", answer: "ONA" },
        },
      },
      followUps: [
        "Bu qoida boʻyicha Z harfi qanday shifrlanadi?",
        "Ismingni shifrla va kattalardan shifrini ochib berishni soʻra.",
      ],
      hints: [
        "Shartni qayta oʻqi va soʻzni shifr bilan harfma-harf solishtir: K — L, I — J…",
        "Nima maʼlum: T harfi U ga, O — P ga, P esa Q ga aylangan. Bu harflar alifboda qayerda turadi?",
        "Alifboni yozib chiq va strelkalar bilan belgila: `T → U`, `O → P`, `P → Q`. Hamma strelkalarning qanday umumiy tomoni bor?",
        "Har bir harf alifbodagi keyingi harf bilan almashtirilgan. S qanday shifrlanadi?",
        "Shifrni ochish uchun teskarisini qil — oldingi harfni ol: `P → O`.",
      ],
      solution: {
        answer: "a) TVU; b) ONA.",
        explanation: [
          "Qoida: har bir harf alifbodagi keyingi harf bilan almashtiriladi.",
          "a) `S → T`, `U → V`, `T → U`: TVU.",
          "b) Shifrni teskari yoʻl bilan ochamiz — oldingi harfni olamiz: `P → O`, `O → N`, `B → A`. ONA chiqadi.",
        ],
        discuss: [
          "Z — oxirgi harf; undan keyin yana A keladi deb kelishib olish qulay. Keyingi masaladagi Sezar shifri ham shunday tuzilgan.",
        ],
      },
    },
    w3d6t5: {
      title: "Sezar shifri",
      body: [
        {
          text: "Qadimgi Rim sarkardasi Yuliy Sezar maxfiy xatlarini shunday yozgan: har bir harf oʻrniga alifboda undan **3 oʻrin keyin** turgan harfni qoʻygan: `A → E`, `B → F`, `D → G`… Alifbo oxiridagi harflar boshiga oʻtadi: `Z → D`.",
        },
        { text: "Razvedkachi Sezar shifri bilan, 3 ga siljitib yozilgan xat oldi. Uning shifrini och!" },
        { text: "Shifr jadvalidan foydalan: unda siljishni 3 qilib qoʻy." },
      ],
      answer: { alphabet: UZ_ALPHABET, encoded: "RIEULQ", answer: "OFARIN" },
      followUps: [
        "MANTIQ soʻzini Sezar shifri bilan shifrla.",
        "Nega Sezar shifrini siljishni bilmasdan ham oson buzish mumkin?",
      ],
      hints: [
        "Shartni qayta oʻqi: shifrlashda har bir harf 3 oʻrin oldinga surilgan. Shifrni ochish uchun nima qilish kerak?",
        "Nima maʼlum: shifrni ochish uchun harflarni 3 oʻrin orqaga surish kerak.",
        "Jadvalda siljishni 3 qilib qoʻy. Shifrdagi R harfini pastki qatordan top — uning ustida haqiqiy harf turadi.",
        "Birinchi harf — R. Undan 3 oʻrin orqaga: Q, P, O. Demak, birinchi harf — O.",
        "Har bir harfni shunday ochib, soʻzni oʻqi. Maʼnosiz narsa chiqsa, qaysi tomonga surayotganingni tekshir.",
      ],
      solution: {
        answer: "OFARIN.",
        explanation: [
          "Har bir harfni 3 oʻrin orqaga suramiz: `R → O`, `I → F`, `E → A`, `U → R`, `L → I`, `Q → N`.",
          "OFARIN chiqadi.",
        ],
        discuss: [
          "Sezar shifrini buzish oson: siljish bor-yoʻgʻi 23 xil boʻladi, hammasini birma-bir sinab, maʼnoli soʻz chiqadiganini topish mumkin. Shuning uchun bugun ancha murakkab shifrlardan foydalaniladi.",
          "MANTIQ Sezar shifrida PEQXLT boʻladi — hech kim oʻqiy olmaydigan gʻalati soʻz. Shifrga aynan shu kerak-da!",
        ],
      },
    },
    w3d6t6: {
      title: "Xaritadagi harflar",
      body: [
        {
          text: "Xaritaning kataklariga harflar yashiringan. Katak ustun harfi va qator raqami bilan ataladi — masalan, A1.",
        },
        {
          visual: {
            cols: mapCols,
            items: [
              { cell: "B4", emoji: "M", label: "M" },
              { cell: "D2", emoji: "I", label: "I" },
              { cell: "A1", emoji: "N", label: "N" },
              { cell: "E5", emoji: "O", label: "O" },
              { cell: "C3", emoji: "R", label: "R" },
              { cell: "A5", emoji: "A", label: "A" },
              { cell: "E1", emoji: "T", label: "T" },
              { cell: "C5", emoji: "L", label: "L" },
              { cell: "B2", emoji: "K", label: "K" },
              { cell: "D4", emoji: "S", label: "S" },
            ],
          },
        },
        { label: "a)", text: "Xabarni oʻqi: B4 D2 A1 E5 C3 A5." },
        { label: "b)", text: "SIR soʻzini shifrla: uning harflari qaysi kataklarda turibdi?" },
      ],
      answer: {
        fields: {
          word: { label: "a) xabar", answer: "MINORA" },
          t: { label: "b) S harfi", answer: "D4", cols: mapCols },
          o: { label: "b) I harfi", answer: "D2", cols: mapCols },
          k: { label: "b) R harfi", answer: "C3", cols: mapCols },
        },
      },
      followUps: [
        "Bu xaritadagi harflar bilan yana qanday soʻzlarni shifrlash mumkin? Kamida ikkitasini top.",
        "Harfli oʻz xaritangni chiz va unda kattalar uchun xabar shifrla.",
      ],
      hints: [
        "Shartni qayta oʻqi: avval ustun harfi (xaritaning pastida), keyin qator raqami (chap tomonda).",
        "Nima maʼlum: A1 — chap pastki katak. Unda qaysi harf turibdi?",
        "Barmogʻingni yurgiz: pastki chekka boʻylab kerakli ustungacha, keyin yuqoriga — kerakli qatorgacha.",
        "B4: B ustun, 4-qator. U yerda qaysi harf yashiringan?",
        "b) savol uchun xaritadan S, I va R harflarini top va ularning kataklarini ayt: avval ustunni, keyin qatorni.",
      ],
      solution: {
        answer: "a) MINORA; b) S — D4, I — D2, R — C3.",
        explanation: [
          "B4 — M, D2 — I, A1 — N, E5 — O, C3 — R, A5 — A: MINORA.",
          "S harfi D4 katakda, I — D2 da, R — C3 da. SIR soʻzining shifri: D4 D2 C3.",
        ],
        discuss: [
          "«Avval qatormi yoki ustunmi?» degan chalkashlik — eng koʻp uchraydigan xato. Kelishib oling: shaxmatdagidek, avval harf, keyin son.",
          "Xarita harflaridan, masalan, ONA, OTA, OLMA, ANOR, KALIT soʻzlarini tuzish mumkin.",
        ],
      },
    },
    w3d6t7: {
      title: "Palindrom vaqtlar",
      body: [
        {
          text: "Elektron soatda ⏰ 12:21 vaqti chapdan oʻngga ham, oʻngdan chapga ham bir xil oʻqiladi. Bunday vaqtni palindrom deb ataymiz.",
        },
        { label: "a)", text: "12:21 dan keyingi palindrom qachon boʻladi?" },
        { label: "b)", text: "10:00 dan 15:59 gacha soat necha marta palindrom koʻrsatadi?" },
      ],
      answer: {
        fields: {
          next: { label: "a) keyingi palindrom" },
          count: { label: "b) necha marta" },
        },
      },
      followUps: [
        "Nega 15:51 dan keyingi palindrom faqat 20:02 da keladi?",
        "20:00 dan 23:59 gacha boʻlgan hamma palindromlarni top.",
      ],
      hints: [
        "Shartni qayta oʻqi: vaqt toʻrtta raqam bilan yozilgan, masalan 12:21. Uni oʻngdan chapga oʻqib koʻr.",
        "Nima maʼlum: soat 13 boʻlsa, daqiqalar «31» boʻlishi kerak.",
        "10 dan 15 gacha soatlarni yozib chiq va har biriga palindrom hosil qiladigan daqiqalarni tanla.",
        "Soat 10 uchun daqiqalar — «01»: 10:01. Soat 11 uchun — 11:11. Davom ettir!",
        "10 dan 15 gacha har bir soatda roppa-rosa bitta palindrom bor: daqiqalar — soat raqamlarining teskari tartibda yozilgani.",
      ],
      solution: {
        answer: "a) 13:31; b) 6 marta.",
        explanation: [
          "Har bir soat uchun daqiqalar soat raqamlarini teskari tartibda yozishdan hosil boʻladi: 10:01, 11:11, 12:21, 13:31, 14:41, 15:51.",
          "12:21 dan keyingisi — 13:31. 10:00 dan 15:59 gacha — 6 ta palindrom.",
        ],
        discuss: [
          "Soat 16, 17, 18 va 19 da palindrom yoʻq: 61, 71, 81 va 91 daqiqa boʻlmaydi. Shuning uchun 15:51 dan keyingisi faqat 20:02 da.",
          "20:00 dan 23:59 gacha: 20:02, 21:12, 22:22, 23:32.",
        ],
      },
    },
    w3d6t8: {
      title: "Kodli qulf",
      body: [
        {
          text: "Qulfning 🔐 kodi — uch xonali son, undagi hamma raqamlar har xil. Razvedkachi toʻrt marta urinib koʻrdi, qulf esa har safar ishora berdi:",
        },
        {
          items: [
            "`5 9 2` — birorta ham raqam toʻgʻri kelmaydi.",
            "`1 4 2` — bitta raqam kodda bor va oʻz joyida turibdi.",
            "`7 9 2` — bitta raqam kodda bor, lekin oʻz joyida emas.",
            "`4 9 8` — ikkita raqam kodda bor, lekin ikkalasi ham oʻz joyida emas.",
          ],
        },
        { text: "Qulfning kodi qanday?" },
      ],
      answer: {
        fields: {
          code: { label: "Kod" },
        },
      },
      followUps: [
        "Istalgan bitta ishorani olib tashla. Kodni baribir aniq topa olasanmi?",
        "Kattalar uchun ishoralari bilan oʻz qulfingni oʻylab top.",
      ],
      hints: [
        "Hamma ishoralarni qayta oʻqi. Qaysi biridan boshlash eng oson?",
        "Birinchi ishoradan nima maʼlum: kodda 5, 9 va 2 raqamlari yoʻq. Ularni hamma urinishlarda oʻchirib chiq.",
        "Urinishlarni 5, 9 va 2 siz qayta yoz: `1 4 _`, `7 _ _`, `4 _ 8`. Endi har bir ishora nima deydi?",
        "`7 9 2` urinishida toʻgʻri raqam faqat 7, lekin u birinchi oʻrinda emas. `4 9 8` urinishida 4 va 8 toʻgʻri, lekin 4 birinchi oʻrinda emas, 8 esa uchinchi oʻrinda emas.",
        "Kod raqamlari — 4, 7 va 8. `1 4 2` urinishida bitta raqam oʻz joyida turgan boʻlsa, 4 qayerda turibdi?",
      ],
      solution: {
        answer: "847.",
        explanation: [
          "Kodda 5, 9 va 2 raqamlari yoʻq (1-ishora).",
          "4-ishora: kodda 4 va 8 bor; 4 birinchi emas, 8 uchinchi emas.",
          "3-ishora: kodda 7 bor va u birinchi emas. Demak, kod raqamlari — 4, 7 va 8, 1 esa kodda yoʻq.",
          "2-ishora: toʻgʻri raqam oʻz joyida turibdi — bu 4, u ikkinchi oʻrinda.",
          "7 birinchi emas — demak, uchinchi. Birinchi oʻringa 8 qoladi. Kod — 847. Tekshiramiz: toʻrttala ishora ham bajariladi ✓.",
        ],
        discuss: [
          "Bunday oʻyin «Buqalar va sigirlar» deb ataladi. Uni ikki kishi qogʻozda oʻynashi mumkin: biri son oʻylaydi, ikkinchisi ishoralarga qarab topadi.",
          "Bu yerda toʻrttala ishora ham kerak: istalgan bittasini olib tashlasangiz, bittadan koʻp kod mos keladi.",
        ],
      },
    },
  },
  parent: {
    skills: [
      "Almashtirish shifrlari: harf raqami, alifbo boʻyicha siljitish, Sezar shifri",
      "Misollarga qarab shifr qoidasini topish",
      "Xaritadagi koordinatalar",
      "Bir nechta ishoradan mantiqiy xulosa chiqarish",
    ],
    observe: [
      "Farzandingiz soʻzni shifr bilan harfma-harf solishtirib, shifr qoidasini oʻzi payqayaptimi?",
      "Shifrni ochish — «teskari shifrlash» ekanini tushunyaptimi?",
      "Qulf masalasida eng kuchli ishoradan («birorta ham raqam toʻgʻri kelmaydi») boshlayaptimi?",
    ],
    mistakes: [
      "Sezar shifrida koʻpincha harflarni teskari tomonga surishadi. Maʼnosiz soʻz chiqsa — bu yaxshi tekshiruv.",
      "Xaritada ustun bilan qatorni adashtirish — tabiiy hol. «Avval harf, keyin son» qoidasi yordam beradi.",
      "Qulf masalasi qiyin. Uni birga, qogʻozda raqamlarni oʻchirib borib yechish mumkin.",
    ],
    question: "Doʻstingga xatni qanday shifrlagan boʻlarding — undan boshqa hech kim oʻqiy olmasin?",
  },
};
