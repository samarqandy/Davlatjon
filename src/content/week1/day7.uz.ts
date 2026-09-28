/** Неделя 1, день 7 — по-узбекски (накладка на day7.ts, правила — docs/uzbek-style.md). */
import type { Uz } from "../localize";
import type { Day } from "../types";

// Условие «Кто выше?» вынесено отдельно: тип Uz<Block[]> распадается на массивы блоков одного вида,
// и список `{ items }` рядом с абзацами `{ text }` не проходит проверку лишних полей в литерале.
const w1d7t2Body = [
  { text: "Toʻrtta doʻst oʻz boʻyini oʻlchab koʻrdi." },
  { items: ["Ali Boburdan baland.", "Vasila Boburdan past.", "Diyor Alidan baland."] },
  { text: "Doʻstlarni boʻyiga qarab tartib bilan qoʻy — eng balandidan eng pastigacha." },
];

export const day7Uz: Uz<Day> = {
  title: "Tadqiq qil!",
  habit: { name: "Men tadqiq qilaman" },
  intro: [
    "Bugun alohida kun: sen — tadqiqotchisan 🧑‍🔬.",
    "Avval qisqa razminka, keyin esa — haqiqiy matematik tadqiqot. Unda bitta javobni taxmin qilish emas, balki sinab koʻrish, payqash va tushuntirish kerak.",
  ],
  tasks: {
    w1d7t1: {
      title: "Ikki barobar",
      body: [{ text: "Har bir sonni ikki barobar qil — yaʼni uni ikki marta ol: 15, 24, 38, 45." }],
      followUps: ["Qaysi sonni ikki barobar qilish eng qiyin boʻldi? Buni qanday uddalading?"],
      hints: [
        "Yana bir oʻqib chiq: ikki barobar qilish — sonni oʻziga oʻzini qoʻshish degani.",
        "38 soni nimalardan tashkil topgan? Unda nechta oʻnlik va nechta birlik bor?",
        "38 ni 3 ta tayoqcha (oʻnliklar) va 8 ta nuqta (birliklar) qilib chiz — keyin hammasini yana bir marta chiz.",
        "Alohida 30 ni, alohida 8 ni ikki barobar qil, keyin ularni qoʻsh.",
        null,
      ],
      solution: {
        explanation: [
          "Oʻnliklar va birliklarni alohida-alohida ikki barobar qilish qulay: `38 + 38 = 60 + 16 = 76`, `45 + 45 = 80 + 10 = 90`.",
        ],
        discuss: [
          "Ikki barobar qilish butun hafta davomida uchradi: 2, 4, 8, 16 qatori; «+» va «−» ishoralarini qoʻyish variantlari soni — 2, 4, 8. Farzandingiz buni eslay oladimi, soʻrab koʻring.",
        ],
      },
    },
    w1d7t2: {
      title: "Kimning boʻyi baland?",
      body: w1d7t2Body,
      answer: {
        prompt: "Ismlarni tartib bilan bos — eng baland boʻylidan eng past boʻyligacha:",
        items: {
          ali: { label: "Ali" },
          bobur: { label: "Bobur" },
          vika: { label: "Vasila" },
          dima: { label: "Diyor" },
        },
      },
      followUps: ["Shartlardan birini olib tashlasak ham doʻstlarni aniq tartiblab boʻladimi? Nega?"],
      hints: [
        "Har bir shartni yana bir oʻqib chiq. Kim kim bilan solishtirilyapti?",
        "Bobur haqida aniq nimani bilamiz? Kim undan baland, kim past?",
        "Boʻyi har xil tayoqcha-odamchalar chiz va ularning ismini yozib qoʻy.",
        "Ikkitasidan boshla: Ali Boburdan baland. Ularni chiz. Vasilani qayerga qoʻyasan?",
        "Hammasini bir qatorga tiz — balanddan pastga — va har bir shartni tekshirib chiq.",
      ],
      solution: {
        answer: "Diyor, Ali, Bobur, Vasila.",
        explanation: [
          "Ali Boburdan baland, Vasila Boburdan past: Ali — Bobur — Vasila.",
          "Diyor Alidan baland — demak, eng baland boʻylisi u: Diyor — Ali — Bobur — Vasila.",
        ],
        discuss: [
          "Hech bir shartni olib tashlab boʻlmaydi — aks holda javob bir nechta boʻlib qoladi. Agar «A B dan baland», «B esa C dan baland» boʻlsa, unda «A C dan baland» — bu muhim mantiqiy xossa (tranzitivlik). Bu soʻzni bilish shart emas — shu xossadan foydalana olish muhim.",
        ],
      },
    },
    w1d7t3: {
      title: "Sehrli kvadrat",
      body: [
        {
          text: "Sehrli kvadratda har bir qatordagi, har bir ustundagi va ikkala diagonaldagi (burchakdan burchakka tortilgan qiya chiziqdagi) sonlar yigʻindisi bir xil boʻladi.",
        },
        { text: "Yetishmayotgan sonlarni top." },
      ],
      followUps: [
        "Kvadratda 1 dan 9 gacha qaysi sonlar bor? Ularning har biri bir martadan uchraydimi?",
        "Oʻzing sehrli kvadrat tuzib koʻr.",
      ],
      hints: [
        "Yana bir oʻqib chiq: hamma qatorlar, ustunlar va diagonallarda yigʻindi bir xil. Lekin qancha?",
        "Uchala soni ham maʼlum boʻlgan chiziq bormi?",
        "Diagonallarga qara: 2, 5, 8 va 6, 5, 4. Ulardagi sonlarni qoʻsh.",
        "Endi sehrli yigʻindini bilasan — yuqori qatordagi sonni top: `2 + ? + 6` shu yigʻindiga teng boʻlishi kerak.",
        "Har bir boʻsh katak uchun faqat shu son nomaʼlum boʻlgan chiziqni top.",
      ],
      solution: {
        answer: "Yuqori qator: 2, 7, 6; oʻrta qator: 9, 5, 1; pastki qator: 4, 3, 8.",
        explanation: [
          "Avval hamma sonlari maʼlum boʻlgan diagonal boʻyicha sehrli yigʻindini topamiz: `2 + 5 + 8 = 15` (`6 + 5 + 4 = 15` ham).",
          "Yuqori qator: `2 + ? + 6 = 15` → 7. Pastki qator: `4 + ? + 8 = 15` → 3.",
          "Chap ustun: `2 + ? + 4 = 15` → 9. Oʻng ustun: `6 + ? + 8 = 15` → 1.",
          "Tekshiramiz: `9 + 5 + 1 = 15`, `7 + 5 + 3 = 15` ✓.",
        ],
        discuss: [
          "Kvadratda 1 dan 9 gacha boʻlgan hamma sonlar bir martadan ishlatilgan. Bu kvadrat (Lo Shu) odamlarga bir necha ming yildan beri maʼlum.",
        ],
      },
    },
    w1d7t4: {
      title: "Robot yulduzlarni yigʻadi",
      body: [
        {
          text: "Robot 🤖 hamma yulduzlarni ⭐ yigʻib, bayroqchaga 🚩 yetib borishi kerak. Yulduzlarni qaysi tartibda yigʻishni oʻzing hal qil.",
        },
        { text: "Dastur tuz. Keyin uni iloji boricha qisqaroq qilishga harakat qil!" },
      ],
      followUps: [
        "Birinchi va oxirgi dasturingni solishtir. Nechta buyruqqa qisqartira olding?",
        "Yulduzlarni qaysi tartibda yigʻish foydaliroq? Nega?",
      ],
      hints: [
        "Yana bir oʻqib chiq: avval hamma yulduzlarni yigʻish kerak, bayroqcha esa — eng oxirida.",
        "Maydonda nechta yulduz bor? Ularning har biri qayerda?",
        "Maydonga bir nechta yoʻlni har xil rangda chizib chiq va har birining qadamlarini sana.",
        "Kichikroq masalani yech: avval hamma yulduzlarni yigʻadigan istalgan dasturni top — uzun boʻlsa ham mayli. Undagi buyruqlarni sana.",
        "Tartib muhim! Kamida ikki xil tartibni solishtir — baʼzan eng yaqin yulduzdan boshlamagan maʼqul.",
      ],
      solution: {
        answer: "Eng qisqa dastur — 16 ta buyruq. Masalan: → → → → ↑ ← ← ↑ ← ← ↑ ↑ → → → →.",
        explanation: [
          "Avval pastki qator boʻylab oʻngdagi yulduzga (5 ta buyruq), keyin oʻrtadagi yulduzga (3 ta buyruq), soʻng burchakdagi yulduzga (4 ta buyruq) va yuqori qator boʻylab bayroqchaga (4 ta buyruq): `5 + 3 + 4 + 4 = 16`.",
          "Xuddi shu uzunlikdagi boshqa yoʻl ham bor: avval yuqori chap burchakdagi yulduzga borish.",
        ],
        discuss: [
          "Agar avval eng yaqin yulduzga (oʻrtadagisiga) borilsa, 18 ta buyruq chiqadi — uzunroq! «Avval eng yaqini» degan ochkoʻz tanlov har doim ham eng yaxshisi boʻlavermaydi. Bu algoritmlardagi muhim gʻoya.",
        ],
      },
    },
    w1d7t5: {
      title: "Kubik yasa",
      body: [
        {
          text: "Katak chiziqlari boʻylab buklaganda bu shakllarning qaysilaridan kubik (xuddi qutichaga oʻxshab) yasasa boʻladi?",
        },
      ],
      answer: {
        prompt: "Kubik chiqadigan hamma shakllarni belgila:",
        // Буквы вариантов: А Б В Г → A B C D (id вариантов не меняются).
        options: { a: { label: "A" }, b: { label: "B" }, c: { label: "C" }, d: { label: "D" } },
      },
      followUps: [
        "Shakllarni katakli qogʻozga chizib ol, qirqib, tekshirib koʻr!",
        "6 ta kvadratdan iborat, kubik chiqadigan yana bitta shakl oʻylab top.",
      ],
      hints: [
        "Yana bir qara: kubikning 6 ta yogʻi bor — ularning har biri kvadratcha. Har bir shakl nechta kvadratdan iborat?",
        "Qaysi kvadratlar tag, qopqoq va devorlar boʻladi?",
        "Shakllarni katakli qogʻozga chizib ol, qirqib, buklab koʻr!",
        "«Plyus»ga oʻxshagan shaklni ol. Oʻrtadagi kvadrat — tag, deb tasavvur qil. Qolganlari qayoqqa bukiladi?",
        "Agar buklaganda ikkita kvadrat bir-birining ustiga tushib qolsa — kubik chiqmaydi.",
      ],
      solution: {
        answer: "A va C.",
        explanation: [
          "A — «plyus»ga oʻxshagan shakl: 4 ta kvadratdan iborat ustuncha kubikni aylanib oʻraydi, ikkita yon kvadrat esa yon tomonlarini yopadi.",
          "C — «zinapoya»: bu ham kubik boʻlib buklanadi (qogʻozda tekshirib koʻring!).",
          "B — 2 × 3 toʻgʻri toʻrtburchak: buklaganda kvadratlar bir-birining ustiga tushib qoladi.",
          "D — unda 2 × 2 kvadrat bor: kvadrat boʻlib yigʻilgan toʻrtta kvadrat bitta kubikning yoqlari boʻla olmaydi.",
        ],
        discuss: [
          "Kubning roppa-rosa 11 xil yoyilmasi bor. Farzandingizga yoqqan boʻlsa — 11 tasining hammasini izlab topish oʻyinini uyushtirish mumkin!",
          "Yana bir yoyilmaga misol: 4 ta kvadratdan iborat qator va uning ustida hamda ostida bittadan kvadrat — qatordagi istalgan kvadratning ustida va istalgan kvadratning ostida.",
        ],
      },
    },
    w1d7r: {
      title: "Sehrli uchburchak",
      body: [
        {
          text: "Uchburchakning tomonlarida 6 ta doiracha bor: 3 tasi burchaklarda, 3 tasi tomonlarning oʻrtasida. Ularga 1, 2, 3, 4, 5, 6 sonlarini — har birini bir martadan — joylashtir: har bir tomondagi uchta sonning yigʻindisi bir xil boʻlsin.",
        },
        { label: "1. Yech.", text: "Har bir tomondagi yigʻindi 9 ga teng boʻladigan joylashuvni top." },
        { label: "2. Tushuntir.", text: "Burchaklarga qaysi sonlar tushdi? Sencha, nega aynan ular?" },
        {
          label: "3. Boshqa yoʻlini top.",
          text: "Yigʻindisi 9 boʻlgan masalani boshqacha yech: burchaklardan emas, 6 sonidan boshla. 6 burchakda tura oladimi? Nega?",
        },
        {
          label: "4. Shartni oʻzgartir.",
          text: "Yigʻindini 10 qilsa boʻladimi? 11 qilsa-chi? 12 qilsa-chi? 8 yoki 13 qilsa-chi? Joylashuvlarni top yoki nega chiqmasligini tushuntir.",
        },
        {
          label: "5. Tadqiq qil.",
          text: "Eng kichik yigʻindi qancha, eng kattasi-chi? Yigʻindi ortib borganda burchaklardagi sonlar bilan nima boʻladi?",
        },
        {
          label: "6. Oʻylab top.",
          text: "Shunga oʻxshash masala oʻylab top — masalan, 2 dan 7 gacha sonlar bilan yoki kvadrat bilan — va uni oyingga yoki dadangga topishmoq qilib ber.",
        },
        { visual: { head: ["Tomondagi yigʻindi", "Burchaklardagi sonlar", "Chiqdimi?"] } },
      ],
      followUps: ["Tadqiqotgacha bilmagan qanday yangilikni kashf qilding?", "Keyingi savoling qanday boʻlardi?"],
      hints: [
        "Shartni yana bir oʻqib chiq. Har bir tomonda nechta son bor? Qaysi doirachalar bir vaqtda ikkita tomonda turibdi?",
        "Nima maʼlum: burchaklardagi sonlar ikki marta hisoblanadi — ular bir vaqtning oʻzida ikkita tomonda turadi.",
        "Doirachali bir nechta uchburchak chiz va sinab koʻr. Nima chiqqanini jadvalga yozib bor.",
        "Kichikroq masalani yech: burchaklarga istalgan uchta sonni, qolganlarini esa oʻrtalarga qoʻy. Tomonlarda qanday yigʻindilar chiqdi?",
        "Burchaklarga kichik sonlarni qoʻysang nima boʻladi? Kattalarini-chi? Tomonlardagi yigʻindilarni solishtir.",
      ],
      solution: {
        answer: "9, 10, 11 va 12 yigʻindilar boʻlishi mumkin. 8 va 13 boʻlishi mumkin emas.",
        explanation: [
          "Yigʻindi 9: burchaklarda 1, 2, 3; 1 bilan 2 orasida — 6, 2 bilan 3 orasida — 4, 3 bilan 1 orasida — 5.",
          "Boshqa yoʻl (3-qadam): agar 6 burchakda tursa, uning ikkala tomonida ham qolgan ikki sonning yigʻindisi `9 − 6 = 3` boʻlishi kerak — bu faqat 1 va 2, juftlik esa ikkita kerak. Demak, 6 tomonning oʻrtasida turadi, uning yonidagi burchaklarda esa — 1 va 2.",
          "Yigʻindi 10: burchaklarda 1, 3, 5; 1 bilan 3 orasida — 6, 3 bilan 5 orasida — 2, 5 bilan 1 orasida — 4.",
          "Yigʻindi 11: burchaklarda 2, 4, 6; 2 bilan 4 orasida — 5, 4 bilan 6 orasida — 1, 6 bilan 2 orasida — 3.",
          "Yigʻindi 12: burchaklarda 4, 5, 6; 4 bilan 5 orasida — 3, 5 bilan 6 orasida — 1, 6 bilan 4 orasida — 2.",
          "Nega 8 boʻlmaydi: burchaklarga eng kichik sonlarni (1, 2, 3) qoʻysak ham 9 chiqadi. Nega 13 boʻlmaydi: burchaklarga eng katta sonlarni (4, 5, 6) qoʻysak ham bor-yoʻgʻi 12 chiqadi.",
        ],
        discuss: [
          "Asosiy kashfiyot: burchaklardagi sonlar «ikki marta ishlaydi», shuning uchun burchaklardagi kichik sonlar kichik yigʻindi, kattalari esa katta yigʻindi beradi.",
          "Chiroyli simmetriya: agar 9 yigʻindili yechimda har bir n sonni `7 − n` ga almashtirsak, 12 yigʻindili yechim hosil boʻladi (10 ↔ 11 ham xuddi shunday).",
          "Kattalar uchun: uchala tomonni qoʻshsak, `(1 + 2 + … + 6) + (burchaklar yigʻindisi) = 21 + (burchaklar yigʻindisi)` chiqadi, bu esa `3 × (tomondagi yigʻindi)` ga teng. Bundan burchaklar yigʻindisi = `3 × (tomondagi yigʻindi) − 21`: 9 yigʻindi uchun burchaklar 6 ni, 12 yigʻindi uchun esa 15 ni beradi.",
        ],
      },
    },
  },
  parent: {
    skills: [
      "Tadqiqot: tajriba, natijalarni yozib borish, qonuniyat izlash.",
      "«Nega?» degan savolga javob berish va nimadir nega mumkin emasligini isbotlash.",
      "Shartni oʻzgartirish va oʻz masalalarini oʻylab topish.",
    ],
    observe: [
      "Farzandingiz urinishlari natijalarini yozib boradimi (jadval) yoki tartibsiz sinab koʻradimi.",
      "Kichik yigʻindi uchun burchaklarga kichik sonlar kerakligini oʻzi payqaydimi.",
    ],
    mistakes: [
      "8 yoki 13 yigʻindini uzoq vaqt hosil qilishga urinish. Bu tabiiy va foydali: aynan shunda «balki bu umuman mumkin emasdir?» degan savol tugʻiladi.",
    ],
    question: "Bugun ertalab bilmagan qanday yangilikni kashf qilding?",
  },
};
