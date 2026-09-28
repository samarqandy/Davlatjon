/** Неделя 3, день 3 — по-узбекски (накладка на day3.ts, правила — docs/uzbek-style.md). */
import type { Uz } from "../localize";
import type { Day } from "../types";

export const day3Uz: Uz<Day> = {
  title: "Eyler doiralari",
  habit: { name: "Men doiralarga ajrataman" },
  intro: [
    "Bugun biz hamma narsani doiralarga joylaymiz ⭕. Bu usulni 250 yildan koʻproq vaqt oldin buyuk matematik Leonard Eyler oʻylab topgan.",
    "Har bir doira — umumiy xossaga ega guruh: masalan, «juft sonlar» yoki «futbolni yaxshi koʻradi». Agar biror narsa ikkala guruhga ham mos kelsa, u doiralar kesishgan joyda turadi. Hech bir guruhga mos kelmaydigan narsa esa tashqarida qoladi.",
  ],
  tasks: {
    w3d3t1: {
      title: "Kim nimani yaxshi koʻradi?",
      body: [
        { text: "Sinfdagi bolalar Eyler doiralarini chizishdi: kim futbolni, kim suzishni yaxshi koʻradi." },
        {
          visual: {
            sets: ["Futbol ⚽", "Suzish 🏊"],
            regions: {
              a: ["Ali", "Diyor", "Temur"],
              ab: ["Vasila", "Bobur"],
              b: ["Kamola", "Lola", "Sanam"],
              none: ["Zarina"],
            },
          },
        },
        { label: "a)", text: "Futbolni nechta bola yaxshi koʻradi?" },
        { label: "b)", text: "Suzishni nechta bola yaxshi koʻradi?" },
        { label: "c)", text: "Nechta bola futbolni ham, suzishni ham yaxshi koʻradi?" },
        { label: "d)", text: "Rasmda hammasi boʻlib nechta bola bor?" },
      ],
      answer: {
        fields: {
          football: { label: "a) futbolni yaxshi koʻradi" },
          swim: { label: "b) suzishni yaxshi koʻradi" },
          both: { label: "c) ikkalasini ham yaxshi koʻradi" },
          all: { label: "d) jami bolalar" },
        },
      },
      followUps: [
        "Futbolni 5 ta bola, suzishni ham 5 ta bola yaxshi koʻradi. Unda nega jami bolalar 10 ta emas?",
        "Zarina haqida nima deyish mumkin?",
      ],
      hints: [
        "Yana bir oʻqi: har bir doira — bu guruh. «Futbol» doirasi ichida kim boʻlsa, oʻsha futbolni yaxshi koʻradi.",
        "Vasila bilan Bobur doiralar kesishgan joyda turibdi. Demak, ular bir vaqtning oʻzida ikkala doirada ham bor.",
        "Barmogʻing bilan butun «Futbol» doirasi boʻylab aylanib chiq — ikkinchi doira bilan umumiy qismi ham ichida qolsin. Ichida kimlar qoldi?",
        "Avval faqat «Futbol» doirasida turganlarni sana (3), keyin umumiy qismdagilarni qoʻsh.",
        "«Futbol» doirasida — Ali, Diyor, Temur, Vasila va Bobur. Jami bolalar — rasmdagi hamma ismlar: doiralar ichidagilar ham, tashqaridagilar ham.",
      ],
      solution: {
        answer: "a) 5; b) 5; c) 2; d) 9.",
        explanation: [
          "Futbolni Ali, Diyor, Temur, Vasila va Bobur yaxshi koʻradi — 5 ta bola.",
          "Suzishni Kamola, Lola, Sanam, Vasila va Bobur yaxshi koʻradi — 5 ta bola.",
          "Ikkalasini ham Vasila va Bobur yaxshi koʻradi — ular doiralarning umumiy qismida.",
          "Jami: `3 + 2 + 3 + 1 = 9` ta bola. Zarina na futbolni, na suzishni yaxshi koʻradi.",
        ],
        discuss: [
          "`5 + 5 = 10`, bolalar esa 9 ta: Vasila bilan Bobur ikki marta — ikkala doirada ham sanaldi. Bu fikr «Toʻgaraklar» masalasida asqotadi.",
        ],
      },
    },
    w3d3t2: {
      title: "Hamma, baʼzi, birorta ham",
      body: [
        { text: "Sonlarga qara:" },
        null,
        {
          text: "«Baʼzi» — «kamida bittasi, balki bir nechtasi» degani. «Birorta ham» esa «hatto bittasi ham» degani.",
        },
      ],
      answer: {
        prompt: "Bu sonlar haqidagi qaysi gaplar rost? Hammasini belgila:",
        options: {
          a: { label: "Hamma sonlar juft." },
          b: { label: "Baʼzi sonlar 20 dan katta." },
          c: { label: "Birorta ham son 5 bilan tugamaydi." },
          d: { label: "Hamma sonlar 10 dan katta." },
          e: { label: "Baʼzi sonlar toq." },
        },
      },
      followUps: [
        "«Birorta ham son 5 bilan tugamaydi» gapi rost boʻlishi uchun qaysi bitta sonni olib tashlash kerak?",
        "Bu sonlar haqida «hamma» soʻzi bilan oʻz gapingni oʻylab top.",
      ],
      hints: [
        "Har bir gapni shoshilmay oʻqi. U qaysi soʻzga tayanadi: «hamma», «baʼzi» yoki «birorta ham»?",
        "«Hamma» soʻzli gap yolgʻon boʻlishi uchun bitta mos kelmaydigan son kifoya.",
        "Har bir gap uchun unga mos keladigan sonlarning tagiga chiz, mos kelmaydiganlarini esa ustidan chizib qoʻy.",
        "«Hamma sonlar juft» gapini navbat bilan tekshir: 12 — juft, 15 — …",
        "«Hamma» — istisnosiz barcha sonlar mos keladi. «Baʼzi» — kamida bittasi mos keladi. «Birorta ham» — bittasi ham mos kelmaydi.",
      ],
      solution: {
        answer: "Rost: b), d), e).",
        explanation: [
          "a) Yolgʻon: 15 va 21 — toq.",
          "b) Rost: 21, 24 va 30 — 20 dan katta.",
          "c) Yolgʻon: 15 soni 5 bilan tugaydi.",
          "d) Rost: hamma sonlar 10 dan katta.",
          "e) Rost: 15 va 21 — toq.",
        ],
        discuss: [
          "«Hamma» soʻzli gapni bitta misol rad etadi. «Baʼzi» soʻzli gapni isbotlash uchun esa bitta mos misol kifoya.",
        ],
      },
    },
    w3d3t3: {
      title: "Doiralarga joyla",
      body: [
        {
          text: "Chap doirada **juft** sonlar, oʻng doirada esa **10 dan katta** sonlar yashaydi. Sonlarni doiralarga joyla.",
        },
        {
          text: "14 soni allaqachon oʻz joyida: u ham juft, ham 10 dan katta — shuning uchun doiralarning umumiy qismida turibdi.",
        },
      ],
      answer: {
        sets: ["Juft sonlar", "10 dan katta"],
      },
      followUps: [
        "Rasmning toʻrtala qismining har biri uchun bittadan yangi son oʻylab top.",
        "10 soni qayerga tushadi? 11 soni-chi?",
      ],
      hints: [
        "Yana bir oʻqi: chap doirada qanday sonlar yashaydi, oʻngdagisida-chi?",
        "Har bir son uchun ikkita savolga javob berish kerak. U juftmi? U 10 dan kattami?",
        "Kichkina jadval chiz: son — juftmi? — 10 dan kattami? — qayerga qoʻyiladi.",
        "4 sonini ol. U juftmi — ha. 10 dan kattami — yoʻq. Demak, u chap doirada, lekin umumiy qismda emas.",
        "Ikkita «ha» — umumiy qismga. Faqat birinchisi «ha» — chap doiraga. Faqat ikkinchisi — oʻng doiraga. Ikkita «yoʻq» — tashqariga.",
      ],
      solution: {
        answer:
          "Faqat «Juft sonlar»: 4, 8. Umumiy qism: 12, 16 (va 14). Faqat «10 dan katta»: 13, 17. Tashqarida: 5, 9.",
        explanation: [
          "4 va 8 — juft, lekin 10 dan katta emas.",
          "12 va 16 — xuddi 14 kabi juft va 10 dan katta.",
          "13 va 17 — 10 dan katta, lekin toq.",
          "5 va 9 — toq va 10 dan katta emas: ular ikkala doiradan ham tashqarida.",
        ],
        discuss: [
          "Har bir son ikkita savolga «ha» yoki «yoʻq» deb javob beradi — rasmning toʻrt qismi shundan kelib chiqadi. Bu birinchi haftadagi «Saralovchi mashina»ning xuddi oʻzi.",
          "10 — juft, lekin 10 dan katta emas: u chap doirada. 11 — 10 dan katta, lekin toq: oʻng doirada.",
        ],
      },
    },
    w3d3t4: {
      title: "Doiraning qoidasini top",
      body: [
        { text: "Sonlar doiralarga joylab boʻlingan, lekin doiralarning nomlari oʻchib ketgan." },
        { visual: { sets: ["1-doira", "2-doira"] } },
        {
          text: "Har bir doiraning qoidasi qanday? Qoida doira ichidagi hamma sonlarga mos kelishi, tashqaridagilarning esa birortasiga ham mos kelmasligi kerak.",
        },
      ],
      answer: {
        prompt: "Doiraning qoidasi qanday?",
        items: {
          c1: { label: "1-doira" },
          c2: { label: "2-doira" },
        },
        options: {
          even: { label: "Juft sonlar" },
          end5: { label: "5 bilan tugaydi" },
          less20: { label: "20 dan kichik" },
          more20: { label: "20 dan katta" },
        },
      },
      followUps: [
        "45 sonini qayerga qoʻyish kerak? 10 sonini-chi?",
        "Sonlar solingan oʻz doiralaringni chiz va kattalardan ularning qoidasini topishni soʻra.",
      ],
      hints: [
        "Yana bir oʻqi: doiraning qoidasi ichidagi hamma sonlarga mos kelishi va tashqaridagi sonlarga mos kelmasligi kerak.",
        "1-doirada 25, 35, 5 va 15 turibdi. Ularning umumiy tomoni nima?",
        "Har bir qoidani navbat bilan tekshir: u doiradagi hamma sonlarga mos keladimi? Doiradan tashqarida unga mos son yoʻqmi?",
        "1-doira uchun «20 dan katta» qoidasini sinab koʻr: 25 — ha, 35 — ha, 5 soni-chi?",
        "2-doiradagi hamma sonlar — 5, 15, 3, 8, 12 — kichkina. 2-doiradan tashqarida esa 25, 35, 21 va 40 turibdi.",
      ],
      solution: {
        answer: "1-doira — «5 bilan tugaydi», 2-doira — «20 dan kichik».",
        explanation: [
          "1-doira: 25, 35, 5, 15 — 5 bilan tugaydi. 1-doiradan tashqarida — 3, 8, 12, 21, 40: birortasi ham 5 bilan tugamaydi ✓.",
          "2-doira: 5, 15, 3, 8, 12 — 20 dan kichik. 2-doiradan tashqarida — 25, 35, 21, 40: hammasi 20 dan kichik emas ✓.",
          "Qolgan qoidalar mos kelmaydi: masalan, «Juft sonlar» 3 va 5 ga, «20 dan katta» esa 5 va 15 ga mos kelmaydi.",
        ],
        discuss: [
          "Doira ichidagi sonlarni ham, tashqaridagilarini ham tekshirish kerak. «50 dan kichik» qoidasi 2-doiradagi hamma sonlarga mos kelardi, lekin tashqaridagilarga ham — demak, u izlangan qoida emas.",
          "45 faqat 1-doiraga, 10 esa faqat 2-doiraga tushadi.",
        ],
      },
    },
    w3d3t5: {
      title: "Sonlar elagi",
      body: [
        { text: "Mana, 1 dan 30 gacha boʻlgan sonlar. Ularni «elak»dan oʻtkaz — uchta qadamni tartib bilan bajar:" },
        null,
        {
          items: [
            "Hamma juft sonlarni chizib tashla.",
            "20 dan katta hamma sonlarni chizib tashla.",
            "5 bilan tugaydigan hamma sonlarni chizib tashla.",
          ],
        },
        { text: "Har bir qadamdan keyin nechta son qoladi?" },
      ],
      answer: {
        fields: {
          step1: { label: "1-qadamdan keyin" },
          step2: { label: "2-qadamdan keyin" },
          step3: { label: "3-qadamdan keyin" },
        },
      },
      followUps: [
        "Qadamlarni boshqa tartibda bajar: 3, 1, 2. Oxirida nechta son qoladi?",
        "Qaysi sonlar qoldi? Ularni bitta gap bilan taʼriflab ber.",
      ],
      hints: [
        "Qadamlarni yana bir oʻqi. Har bir qadam oldingi qadamdan keyin qolgan sonlar orasidan chizib tashlaydi.",
        "Juft sonlar — har ikkinchi son: 2, 4, 6… 1 dan 30 gacha ular nechta?",
        "1 dan 30 gacha sonlarni yozib chiq va har bir qadamda boshqa rangda chizib tashla.",
        "1-qadamdan keyin 1, 3, 5, 7, …, 29 qoladi. Ular orasida 20 dan kattasi nechta?",
        "2-qadamdan keyin 20 gacha boʻlgan toq sonlar qoladi. Ulardan qaysilari 5 bilan tugaydi?",
      ],
      solution: {
        answer: "15, keyin 10, keyin 8.",
        explanation: [
          "1-qadam: 1, 3, 5, …, 29 toq sonlari qoladi — ular 15 ta.",
          "2-qadam: 21, 23, 25, 27, 29 ni chizib tashlaymiz — 10 ta son qoladi.",
          "3-qadam: 5 va 15 ni chizib tashlaymiz — 1, 3, 7, 9, 11, 13, 17, 19 qoladi. Ular 8 ta.",
        ],
        discuss: [
          "Qadamlar boshqa tartibda bajarilsa ham, oxirida oʻsha 8 ta son qoladi: toq, 20 dan katta boʻlmagan va 5 bilan tugamaydigan sonlar. Tekshirish tartibi muhim emas — bu Eyler doiralarining kesishmasiga oʻxshaydi.",
          "Bunday «elak»ni qadimgi yunon olimi Eratosfen oʻylab topgan — toʻgʻri, u sonlarni boshqa qoidalar boʻyicha elagan.",
        ],
      },
    },
    w3d3t6: {
      title: "Ikkita toʻgʻri toʻrtburchak",
      body: [
        {
          text: "Katakli maydonga qizil va koʻk toʻgʻri toʻrtburchak chizildi. Ular qisman bir-birining ustiga tushgan.",
        },
        null,
        { label: "a)", text: "Nechta katak ham qizil, ham koʻk rangga boʻyalgan?" },
        { label: "b)", text: "Nechta katak kamida bitta rangga boʻyalgan?" },
        { label: "c)", text: "Maydonning nechta katagi umuman boʻyalmagan?" },
      ],
      answer: {
        fields: {
          both: { label: "a) ikkala rangda" },
          any: { label: "b) kamida bitta rangda" },
          none: { label: "c) boʻyalmagan" },
        },
      },
      followUps: [
        "b) ni kataklarni bittalab sanamasdan qanday hisoblash mumkin?",
        "Umumiy qismi roppa-rosa bitta katak boʻlgan ikkita toʻgʻri toʻrtburchak chiz.",
      ],
      hints: [
        "Yana bir oʻqi: «kamida bitta rangda» — «qizil, koʻk yoki ikkala rangda» degani.",
        "Har bir toʻgʻri toʻrtburchak `4 × 3` katakni egallaydi — 12 tadan katak.",
        "Toʻgʻri toʻrtburchaklarning umumiy qismini qalam bilan chizib ajrat. Uning oʻlchami qanday?",
        "Umumiy qism — 2 ga 2 kvadratcha. Unda nechta katak bor?",
        "12 bilan 12 ni qoʻshsak, umumiy qismdagi kataklar ikki marta sanaladi. Qancha ortiqchasini olib tashlash kerak? Maydonda esa jami `7 × 5 = 35` ta katak bor.",
      ],
      solution: {
        answer: "a) 4; b) 20; c) 15.",
        explanation: [
          "Har bir toʻgʻri toʻrtburchak — 12 ta katak. Umumiy qism — 2 ga 2 kvadrat, bu 4 ta katak.",
          "Kamida bitta rangda: `12 + 12 − 4 = 20` ta katak — umumiy qismni ayiramiz, chunki uni ikki marta sanadik.",
          "Maydonda jami `7 × 5 = 35` ta katak, boʻyalmagani — `35 − 20 = 15` ta.",
        ],
        discuss: [
          "Bu «Kim nimani yaxshi koʻradi?» masalasidagi fikrning xuddi oʻzi: `12 + 12` yigʻindida umumiy qism ikki marta sanalgan.",
          "Agar farzandingiz hali koʻpaytirishni bilmasa, kataklarni qatorlab sanash mumkin: 4, 8, 12.",
        ],
      },
    },
    w3d3t7: {
      title: "Toʻgaraklar",
      body: [
        {
          text: "Sinfda 25 ta oʻquvchi bor. Ulardan 15 tasi rasm toʻgaragiga 🎨, 12 tasi musiqa toʻgaragiga 🎵 qatnaydi, 4 ta oʻquvchi esa birorta ham toʻgarakka qatnamaydi.",
        },
        { label: "a)", text: "Nechta oʻquvchi ikkala toʻgarakka ham qatnaydi?" },
        { label: "b)", text: "Nechta oʻquvchi faqat rasm toʻgaragiga qatnaydi?" },
        { text: "Ikkita Eyler doirasini chiz va har bir qismda nechta oʻquvchi borligini yozib qoʻy." },
      ],
      answer: {
        fields: {
          both: { label: "a) ikkala toʻgarakka" },
          onlyArt: { label: "b) faqat rasm toʻgaragiga" },
        },
      },
      followUps: [
        "Nechta oʻquvchi faqat musiqa toʻgaragiga qatnaydi?",
        "Tekshirib koʻr: rasmning toʻrtala qismidagi sonlarni qoʻsh. 25 chiqdimi?",
      ],
      hints: [
        "Yana bir oʻqi: jami nechta oʻquvchi bor va ulardan nechtasi hech qayerga qatnamaydi?",
        "Toʻgaraklarga `25 − 4 = 21` ta oʻquvchi qatnaydi — kamida bittasiga.",
        "Kesishgan ikkita doira chiz: «Rasm» va «Musiqa». 15 bilan 12 ni qoʻshsak, kimlarni ikki marta sanaymiz?",
        "Qoʻsh: `15 + 12 = 27`. Toʻgaraklarda esa atigi 21 ta oʻquvchi bor. Ortiqchalari qayerdan keldi?",
        "Ortiqchalar — ikkala toʻgarakka qatnaydiganlar: ular ikki marta sanalgan. `27 − 21` — qancha?",
      ],
      solution: {
        answer: "a) 6 ta oʻquvchi; b) 9 ta oʻquvchi.",
        explanation: [
          "Kamida bitta toʻgarakka `25 − 4 = 21` ta oʻquvchi qatnaydi.",
          "`15 + 12 = 27` deb qoʻshsak, ikkala toʻgarakka qatnaydiganlar ikki marta sanaladi. Ular `27 − 21 = 6` ta.",
          "Faqat rasm bilan `15 − 6 = 9` ta oʻquvchi shugʻullanadi.",
        ],
        discuss: [
          "Faqat musiqa bilan `12 − 6 = 6` ta oʻquvchi shugʻullanadi. Tekshiruv: `9 + 6 + 6 + 4 = 25` ✓.",
          "Eyler doiralari chalkash masalani aniq rasmga aylantiradi. Farzandingiz «Kim nimani yaxshi koʻradi?» masalasini oʻzi eslasa, juda yaxshi.",
        ],
      },
    },
    w3d3t8: {
      title: "Olma va nok",
      body: [
        {
          text: "Sinfda 20 ta bola bor. Ulardan 12 tasi olmani 🍎, 14 tasi esa nokni 🍐 yaxshi koʻradi. Kimdir olmani ham, nokni ham yaxshi koʻrishi, kimdir esa ikkalasini ham yoqtirmasligi mumkin.",
        },
        {
          label: "a)",
          text: "Olmani ham, nokni ham yaxshi koʻradigan bolalar **eng kamida** nechta boʻlishi mumkin?",
        },
        {
          label: "b)",
          text: "Ikkalasini ham yaxshi koʻradigan bolalar **eng koʻpi bilan** nechta boʻlishi mumkin?",
        },
      ],
      answer: {
        fields: {
          min: { label: "a) eng kami" },
          max: { label: "b) eng koʻpi" },
        },
      },
      followUps: [
        "Agar ikkala mevani ham 6 ta bola yaxshi koʻrsa, nechta bola na olmani, na nokni yaxshi koʻradi? 12 ta boʻlsa-chi?",
        "Agar sinfda 26 ta bola boʻlganida, eng kami nechta boʻlardi?",
      ],
      hints: [
        "Yana bir oʻqi: jami nechta bola bor va har bir mevani nechtasi yaxshi koʻradi?",
        "`12 + 14 = 26`, bolalar esa hammasi 20 ta. Demak, kimdir ikki marta sanalgan.",
        "Eyler doiralarini chiz. Umumiy qismga har xil sonlarni qoʻyib koʻr va hammasi 20 ta bolaga sigʻadimi — tekshir.",
        "a) uchun: aytaylik, 20 ta bolaning hammasi kamida bitta mevani yaxshi koʻradi. Unda nechta bola ikki marta sanalgan?",
        "b) uchun: umumiy qismda kichikroq doiradagidan koʻp bola boʻla olmaydi. Olmani nechta bola yaxshi koʻradi?",
      ],
      solution: {
        answer: "a) 6 ta bola; b) 12 ta bola.",
        explanation: [
          "a) `12 + 14 = 26` — bu 20 ta boladan koʻp. Har bir bola kamida bitta mevani yaxshi koʻrgan taqdirda ham, 6 ta bola ikki marta sanalgan boʻladi: `26 − 20 = 6`. 6 tadan kam boʻlishi mumkin emas.",
          "b) Ikkala mevani yaxshi koʻradiganlar olmani yaxshi koʻradiganlardan — 12 tadan — koʻp boʻla olmaydi. Olmani yaxshi koʻradiganlarning hammasi nokni ham yaxshi koʻrsa, aynan shunday boʻladi. Unda nokni yana 2 ta bola yaxshi koʻradi, `20 − 14 = 6` ta bola esa ikkalasini ham yoqtirmaydi.",
        ],
        discuss: [
          "Bu — tadqiqot masalasi: javob bitta son emas, balki chegaralar: «6 dan 12 gacha». Farzandingiz ikkala chekka holatni ham chizsa, juda yaxshi.",
          "Agar sinfda 26 ta bola boʻlganida, eng kami 0 boʻlardi: har kim faqat bitta mevani yaxshi koʻrishi mumkin edi.",
        ],
      },
    },
  },
  parent: {
    skills: [
      "Eyler doiralari: guruhlar, umumiy qism, «tashqarida»",
      "«Hamma», «baʼzi», «birorta ham» soʻzlari",
      "Ikki marta sanamasdan hisoblash: `12 + 12 − 4`",
      "Qoidani barcha misollarda tekshirish — guruh ichida ham, tashqarisida ham",
    ],
    observe: [
      "Farzandingiz doiralarning umumiy qismi ikkala doiraga ham kirishini tushunadimi?",
      "Ikki guruhni qoʻshganda umumiy qism ikki marta sanalishini payqaydimi?",
      "Qoidani doiradan tashqaridagi sonlarda ham tekshiradimi?",
    ],
    mistakes: [
      "Doirada faqat «oʻz» qismini sanab, umumiy qismini unutish — koʻp uchraydigan xato. Doirani barmogʻi bilan toʻliq aylanib chiqishni soʻrang.",
      "Hayotda «baʼzi» soʻzi koʻpincha «hammasi emas» degan maʼnoni beradi. Matematikada esa u «kamida bittasi» degani — hammasi mos kelsa ham, gap rost boʻlaveradi.",
      "«Olma va nok» masalasida avval har xil sonlarni sinab koʻrish — tabiiy hol: chegaralarni tushunish shundan boshlanadi.",
    ],
    question: "Oilamiz haqida qanday ikkita Eyler doirasini chizish mumkin? Umumiy qismga kim tushadi?",
  },
};
