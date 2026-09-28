import type { Uz } from "../../localize";
import type { ChessLevel } from "../types";

export const bishopUz: Uz<ChessLevel> = {
  name: "Fil",
  title: "Diagonallar ustasi",
  goal: "Fil bilan diagonallar boʻylab yurishni va himoyasiz donalarni topishni oʻrganasan, fil nega hech qachon katak rangini almashtirmasligini tushunib olasan.",
  legend: {
    hook: "Bir mamlakatda bu dona — ruhoniy, boshqasida — masxaraboz, bizda esa — fil. Qanday qilib?",
    title: "Fil, ruhoniy va masxaraboz",
    story: [
      "Chaturangada bu dona jangovar fil edi, ustida esa filni boshqaradigan filbon oʻtirardi. Arablar uni «al-fil», yaʼni fil deb atashgan. Oʻzbekcha «fil» nomi shundan kelib chiqqan, ruslar ham bu donani «slon», yaʼni fil deyishadi. Afrosiyobdan topilgan shaxmat donalari orasida ham fil bor.",
      "Shaxmat Yevropaga yetib borganda, u yerdagilar tirik filni hech qachon koʻrmagan edi. Donaning tepasidagi ikki doʻngchani — fil tishlarini — ruhoniy-episkopning qalpogʻi deb oʻylashdi. Shu tariqa Angliyada fil bishop, yaʼni «episkop» boʻlib qoldi. Fransiyada esa buni masxarabozning qalpogʻi deb bilishdi va donani fou — «masxaraboz» deb atashdi.",
      "Qadimgi shatranjda fil kuchsiz edi: u diagonal boʻylab roppa-rosa bitta katakni hatlab sakrardi. Uzoqdan ura oladigan kuchli donaga u bundan atigi 500 yil oldin aylangan — farzin bilan bir vaqtda.",
    ],
    secret:
      "Fil butun partiya davomida bir xil rangdagi kataklarda yuradi. Shuning uchun sening ikkita filing bor: biri oq kataklarda, ikkinchisi qora kataklarda yuradi. Ikkalasi birga butun taxtani koʻradi, bittasi esa — faqat yarmini.",
  },
  lesson: [
    {
      title: "Fil qanday yuradi",
      text: [
        "Fil **diagonal boʻylab** istalgancha katak yuradi — oldinga ham, orqaga ham. Donalar ustidan sakrashni bilmaydi: oʻz donasi uni toʻxtatadi, raqib donasini esa urib olishi mumkin.",
        "Filni bos va u qanchalik uzoqni «nishonga olishini» koʻr.",
      ],
    },
    {
      title: "Fil rang almashtirmaydi",
      text: [
        "Bitta diagonaldagi hamma kataklar bir xil rangda. Shuning uchun fil butun partiya davomida **faqat bir xil rangdagi kataklarda** yuradi.",
        "Har bir oʻyinchida ikkita fil bor: **oq katakli** va **qora katakli**. Ikkalasi birga oq kataklarni ham, qora kataklarni ham nishonga oladi.",
      ],
    },
    {
      title: "Uzun diagonal",
      text: [
        "Eng uzun diagonallar — a1–h8 va h1–a8: ularning har birida 8 tadan katak bor. Uzun diagonaldagi fil butun taxtani u chetidan bu chetigacha «oʻqqa tutadi».",
      ],
    },
    {
      title: "Zarba ostida",
      text: [
        "Raqib donasi urib olishi mumkin boʻlgan dona **zarba ostida** turadi. Uni hech kim himoya qilmasa, shaxmatchilar «tekin dona» deyishadi.",
        "Urib olishdan oldin tekshirib koʻr: keyin oʻz donangni urib olishmaydimi? Bu yerda fil a6 dagi otni tekinga urib olishi mumkin, f7 dagi filni esa shoh himoya qilyapti.",
      ],
    },
  ],
  rules: [
    "Fil diagonal boʻylab istalgancha katak yuradi.",
    "Fil donalar ustidan sakrab oʻtmaydi.",
    "Fil butun partiya davomida bir xil rangdagi kataklarda qoladi.",
    "Fil xuddi yurganidek uradi: diagonal boʻylab raqib donasi turgan katakka boradi.",
  ],
  terms: [
    { term: "Fil", text: "Diagonallar boʻylab yuradigan dona." },
    { term: "Oq katakli fil", text: "Oq kataklarda yuradigan fil." },
    { term: "Qora katakli fil", text: "Qora kataklarda yuradigan fil." },
    { term: "Zarba ostida", text: "Raqib urib olishi mumkin boʻlgan dona haqida shunday deyiladi." },
    { term: "«Tekin dona»", text: "Zarba ostida turgan, lekin hech kim himoya qilmayotgan donani shunday atashadi." },
  ],
  facts: [
    "Qadimgi shaxmatda bu dona forscha «fil» soʻzi bilan — xuddi hayvon kabi atalgan. U diagonal boʻylab bor-yoʻgʻi bitta katakni hatlab yurgan. Oʻzbekcha «fil» nomi ham oʻshandan qolgan.",
    "Boʻsh taxtaning markazida turgan fil 13 ta katakni urib turadi, burchakda esa — atigi 7 tasini.",
    "Ingliz tilida bu dona «episkop», fransuz tilida esa «masxaraboz» deb ataladi. Har bir mamlakatda — oʻz nomi!",
  ],
  exercises: {
    "bishop-moves": {
      title: "Filning diagonallari",
      prompt: "Fil d4 dan yura oladigan hamma kataklarni belgila.",
      hint: "Fildan toʻrtta diagonal tarqaladi. Har biri boʻylab taxta chetigacha borib chiq.",
      why: "Toʻrtta diagonal: a7 tomonga (c5, b6, a7), h8 tomonga (e5, f6, g7, h8), g1 tomonga (e3, f2, g1) va a1 tomonga (c3, b2, a1) — jami 13 ta katak.",
    },
    "bishop-blocked": {
      title: "Fil va toʻsiqlar",
      prompt: "Fil c4 dan qayerga yura oladi? Oʻz piyodasi xalaqit beradi, raqib donalarini esa urib olish mumkin.",
      hint: "Oʻz piyodasi turgan e2 ga yetmasdan fil toʻxtaydi. Raqib donasiga yetganda esa uni urib olib toʻxtaydi.",
      why: "Yuqoriga va oʻngga — d5, e6 va f7 dagi piyodani urib olish. Yuqoriga va chapga — b5 va a6 dagi otni urib olish. Pastga va chapga — b3, a2. Pastga va oʻngga — faqat d3: undan keyin oʻz piyodasi turibdi.",
    },
    "bishop-stars": {
      title: "Fil yulduz yigʻadi",
      prompt: "Fil bilan hamma yulduzchalarni eng kam yurishda yigʻ.",
      hint: "Hamma yulduzlar filning oʻzi kabi qora kataklarda. Ularni qaysi tartibda yigʻishni oʻylab koʻr: har bir yulduz keyingisi bilan bitta diagonalda boʻlsin.",
      why: "Masalan: a1 → d4 → b6 → f2 → h4. Toʻrtta yurish — har bir yulduzga bittadan.",
    },
    "bishop-unreachable": {
      title: "Yetib boʻlmas yulduz",
      prompt: "Bu fil qancha yurmasin, bitta yulduzchani hech qachon ololmaydi. Oʻshani bos.",
      hint: "Qara-chi: fil qanday rangli katakda turibdi? Yulduzchalar-chi?",
      why: "Fil c1 dagi qora katakda turibdi va hech qachon oq katakka tusha olmaydi. Yulduzlarning hammasi qora kataklarda, faqat b5 — oq katakda.",
    },
    "bishop-detour": {
      title: "Fil aylanib oʻtadi",
      prompt: "Filning yoʻlini oʻz piyodasi toʻsib turibdi — u e3 da. Hamma yulduzchalarni eng kam yurishda yigʻ.",
      hint: "Piyoda toʻsib turgani uchun c1 dan toʻppa-toʻgʻri f4 ga borib boʻlmaydi. Avval a3 dagi yulduzni ol, keyin u yerdan qolganlariga qanday borishni oʻylab koʻr.",
      why: "Masalan: c1 → a3 → d6 → f4 → h6 → g5 → d8. Piyoda e3 da turgani uchun ortiqcha yurishlar qilishga toʻgʻri keladi — buni 6 ta yurishdan kamroqda uddalab boʻlmaydi.",
    },
    "bishop-free-piece": {
      title: "Oson oʻlja",
      prompt:
        "Yurish navbati oqlarda. Fil ikkita qora donadan birini urib olishi mumkin. Qaysi birini urib olish foydali?",
      hint: "Urib olganingdan keyin tekshirib koʻr: raqib javob yurishida filingni urib ola oladimi?",
      why: "Ot a6 da himoyasiz turibdi — uni tekinga urib olish mumkin. Agar f7 dagi filni olsang, shoh oq filni urib oladi: fil evaziga fil.",
    },
    "bishop-quiz": {
      title: "Fil haqida hammasi",
      prompt: "Oʻzingni sinab koʻr.",
      questions: [
        { text: "Boʻsh taxtaning markazida — d4 da turgan fil nechta katakni urib turadi?" },
        { text: "Qora katakli fil oq katakka tusha oladimi?", options: ["Ha", "Yoʻq"] },
        { text: "Partiya boshida har bir oʻyinchida nechta fil boʻladi?" },
      ],
      hint: "«Filning diagonallari» mashqini va «Fil rang almashtirmaydi» darsini esla.",
      why: "d4 dagi fil 13 ta katakni urib turadi. Diagonaldagi kataklar bir xil rangda, shuning uchun fil rang almashtirmaydi. Har bir oʻyinchining ikkita fili bor.",
    },
  },
};
