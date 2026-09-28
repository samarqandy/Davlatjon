import type { Uz } from "../../localize";
import type { ChessLevel } from "../types";

export const queenUz: Uz<ChessLevel> = {
  name: "Farzin",
  title: "Eng kuchli dona",
  goal: "Farzin qanday yurishini oʻrganasan, donalarning qiymatini bilib olasan va foydali almashinuv qilishni mashq qilasan.",
  legend: {
    hook: "Eng kuchli dona ming yil davomida eng zaif dona boʻlgan. Nima oʻzgardi ekan?",
    title: "Qirolichaga aylangan maslahatchi",
    story: [
      "Qadimgi shatranjda shohning yonida farzin turardi. «Farzin» — «maslahatchi» degani, xuddi ertaklardagi podshoning dono vaziriday. U atigi bir katak diagonal boʻylab yurar, hatto otdan ham kuchsiz edi. Biz esa bu donani hozir ham oʻsha qadimiy nom bilan — farzin deb ataymiz. Demak, sen «farzin» deganingda ming yildan ham qadimiy soʻzni aytasan!",
      "Yevropada esa farzinni qirolicha deb atay boshlashdi. Taxminan 1475-yilda Ispaniya va Italiyada unga bugungi kuchini hadya qilishdi: endi u ham rux, ham fil kabi yura oladigan boʻldi. Taxtada hammasi shunchalik tez sodir boʻla boshladiki, oʻyinchilar yangi shaxmatni «telba qirolicha shaxmati» deb atashdi.",
      "Baʼzi tarixchilarning fikricha, farzinni Izabella sharafiga shunchalik kuchli qilishgan. Izabella Kastiliya qirolichasi edi va Ispaniyani eri bilan teng boshqargan.",
    ],
    secret:
      "Taxta markazidagi farzin 27 ta katakni uradi — boshqa har qanday donadan koʻp. Lekin hujumga juda erta otlangan farzinning oʻzi zarba ostida qoladi. Bu darajada uni qanday quvib solishlarini koʻrasan.",
  },
  lesson: [
    {
      title: "Farzin qanday yuradi",
      text: [
        "Farzin **ham rux, ham fil kabi** yuradi: vertikal, gorizontal va diagonal boʻylab xohlagancha katakka. Donalar ustidan sakrab oʻtishni esa bilmaydi.",
        "Farzinni bosib koʻr: boʻsh taxtaning markazidan u naq 27 ta katakni uradi!",
      ],
    },
    {
      title: "Donalarning qiymati",
      text: [
        "Donalarning kuchi piyodalar bilan oʻlchanadi: **piyoda — 1, ot — 3, fil — 3, rux — 5, farzin — 9**. Shoh esa bebaho: usiz partiya boy berilgan boʻladi.",
        "Oʻyinchilar bir-birining donalarini urib olsa, bu **almashinuv** deyiladi. Foydali almashinuv — berganingdan koʻproq olganingda. Otni (3) berib ruxni (5) olish — foydali, farzinni (9) berib ruxni olish esa — yoʻq.",
      ],
    },
    {
      title: "Farzinni asra",
      text: [
        "Farzin eng kuchli dona, shuning uchun uni ehtiyot qilishadi. Agar partiyaning boshidayoq farzinni oʻyinga chiqarsang, raqib uni piyodalar va yengil donalar bilan quvlab, vaqtdan yutadi.",
        "Avval otlar va fillarni chiqar, farzinni esa — biroz keyinroq.",
      ],
    },
  ],
  rules: [
    "Farzin vertikal, gorizontal va diagonal boʻylab xohlagancha katakka yuradi.",
    "Farzin donalar ustidan sakrab oʻtmaydi.",
    "Donalarning qiymati: piyoda 1, ot 3, fil 3, rux 5, farzin 9.",
    "Urib olishdan oldin tekshir: olganingdan koʻprogʻini berib qoʻymaysanmi?",
  ],
  terms: [
    { term: "Farzin", text: "Eng kuchli dona: ham rux, ham fil kabi yuradi." },
    {
      term: "Donalarning qiymati",
      text: "Donaning piyodalar bilan oʻlchangan kuchi: ot va fil — 3, rux — 5, farzin — 9.",
    },
    { term: "Almashinuv", text: "Oʻyinchilarning bir-birining donalarini urib olishi." },
    {
      term: "Material",
      text: "Oʻyinchining barcha donalari birgalikda. «Material yutish» — raqibdan oʻzing berganingdan koʻproq olish.",
    },
  ],
  facts: [
    "Ilgari farzin eng zaif donalardan biri edi: u bor-yoʻgʻi bir katak diagonal boʻylab yurardi. Taxminan 500 yil oldin unga hozirgidek yurishga ruxsat berishdi — shundan keyin shaxmat tez va keskin oʻyinga aylandi.",
    "Oʻzbekcha «farzin» ham, ruscha «ferz» ham fors tilidan kelgan. Forschada «farzin» — «maslahatchi, donishmand» degani.",
    "Oddiy taxtaga 8 ta farzinni shunday qoʻyish mumkinki, birortasi boshqasini urmaydi. Bunday joylashtirishning 92 xil usuli bor — hech boʻlmasa bittasini topib koʻr!",
  ],
  exercises: {
    "queen-quiz": {
      title: "Farzin raqamlarda",
      prompt: "Farzinni qanchalik yaxshi bilishingni tekshirib koʻr.",
      questions: [
        { text: "Farzin boʻsh taxtaning markazidan, d4 dan nechta katakni uradi?" },
        { text: "Burchakdan, a1 dan-chi?" },
        { text: "Farzin nechta piyodaga teng?" },
      ],
      hint: "Farzin — bu rux bilan fil birgalikda. Ularning har biri nechta katakni urishini qoʻshib chiq.",
      why: "d4 dan: rux 14 ta, fil 13 ta katakni uradi — jami 27 ta. a1 dan: 14 va 7 — jami 21 ta. Farzin 9 ta piyodaga teng.",
    },
    "queen-moves": {
      title: "Farzin va toʻsiqlar",
      prompt:
        "Farzin d4 da turibdi. U qaysi kataklarga yura oladi? Oʻz piyodalaring xalaqit beradi, raqib donalarini esa urib olish mumkin.",
      hint: "Sakkizta yoʻnalishning hammasini birma-bir tekshir: yuqoriga, pastga, chapga, oʻngga va toʻrtta diagonal.",
      why: "Yuqoriga — d5, d6 va d7 dagi otni urish. Pastga — d3. Chapga — c4, oʻngga — e4. Diagonallar boʻylab — c5 va b6 dagi filni urish, e5, f6 va g7 dagi piyodani urish. Pastga qaragan diagonallarni oʻz piyodalari toʻsib turibdi. Hammasi boʻlib 11 ta katak.",
    },
    "queen-stars": {
      title: "Sayyoh farzin",
      prompt: "Farzin bilan barcha yulduzchalarni eng kam yurishda yigʻib ol. Oʻz piyodalaring xalaqit beradi.",
      hint: "Uzun diagonalni piyodalar toʻsib qoʻygan. Lekin taxtaning chetlari boʻsh — h1 burchagidan boshla.",
      why: "Masalan: a1 → h1 → a8 → h8 → e8 → e5. Besh yurish — bundan kami boʻlmaydi.",
    },
    "queen-eight": {
      title: "Toʻrtta farzin",
      prompt:
        "4 × 4 taxtaga toʻrtta farzinni shunday qoʻyki, birortasi boshqasini urmasin. Farzin qoʻyish yoki olib tashlash uchun kataklarni bos.",
      hint: "Har bir vertikalda va har bir gorizontalda faqat bitta farzin turishi mumkin. Burchaklarga qoʻyish foydasiz.",
      why: "Ikkita yechim bor: b1, d2, a3, c4 va uning koʻzgudagi aksi — c1, a2, d3, b4. Sakkiz farzin haqidagi mashhur masala ham xuddi shunday, faqat katta taxtada.",
    },
    "queen-best-capture": {
      title: "Foydali oʻlja",
      prompt:
        "Yurish navbati oqlarda. Farzin ruxni, otni yoki piyodani urib olishi mumkin. Qaysi birini olish foydali?",
      hint: "Har bir urishni tekshir: raqib bunga javoban farzinni urib ola oladimi? Farzin 9 ga teng — uni rux yoki piyodaga almashtirish foydasiz.",
      why: "b6 dagi otni hech kim himoya qilmayapti — bu sof yutuq. g7 dagi ruxni shoh, a4 dagi piyodani esa ot himoya qiladi: bunday urishlardan keyin oqlar farzindan ayriladi.",
    },
    "queen-fork": {
      title: "Farzin bilan vilka",
      prompt: "Yurish navbati oqlarda. Farzin bilan shunday yurish topki, u ham shoh bersin, ham ruxga hujum qilsin.",
      hint: "Shunday katak izla: u yerdan farzin bir diagonal boʻylab h7 dagi shohga, ikkinchi diagonal boʻylab esa a6 dagi ruxga qarab tursin.",
      why: "Farzin d3 ga yuradi: d3–h7 diagonali boʻylab shohga shoh beradi, d3–a6 diagonali boʻylab esa ruxga hujum qiladi. Shoh qochgach, farzin ruxni urib oladi.",
    },
    "queen-values": {
      title: "Foydali almashinuv",
      prompt: "Oʻylab koʻr: nima foydali-yu, nima foydasiz?",
      questions: [
        {
          text: "Raqibning ruxini olishing mumkin, lekin oʻz otingdan ayrilasan. Foydalimi?",
          options: ["Ha, foydali", "Yoʻq, foydasiz"],
        },
        {
          text: "Raqibning otini olishing mumkin, lekin farziningdan ayrilasan. Foydalimi?",
          options: ["Ha, foydali", "Yoʻq, foydasiz"],
        },
        {
          text: "Qaysi biri qimmatroq: ikkita rux yoki farzin?",
          options: ["Ikkita rux", "Farzin", "Teng"],
        },
      ],
      hint: "Qiymatlarni esla: ot — 3, rux — 5, farzin — 9. Qancha berib, qancha olayotganingni solishtir.",
      why: "Otni (3) berib ruxni (5) olish — foydali. Farzinni (9) berib otni (3) olish — yoʻq. Ikkita rux — bu `5 + 5 = 10`, farzindan (9) koʻp.",
    },
  },
};
