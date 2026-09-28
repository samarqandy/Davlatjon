import type { Uz } from "../../localize";
import type { FamousGame } from "../games";

/** Знаменитые партии по-узбекски: только тексты, ходы и позиции — из русского оригинала. */
export const gamesUz: Uz<FamousGame[]> = {
  "fools-mate": {
    title: "Ahmoqona mot",
    white: "Ehtiyotsiz oʻyinchi",
    black: "Diqqatli oʻyinchi",
    place: "Oʻquv partiyasi",
    era: "Eng qisqa partiya",
    story: [
      "Bu shaxmatda boʻlishi mumkin boʻlgan eng qisqa partiya: ikkinchi yurishdayoq mot! Bunday motni «ahmoqona» deb atashadi — oqlar ahmoq boʻlgani uchun emas, balki dunyodagi eng ehtiyotsiz ikki yurishni qilgani uchun.",
      "Shohni f va g piyodalari qoʻriqlab turadi. Oʻyin boshida ikkalasini ham surib yuborsang, shohga diagonal boʻylab yoʻl ochiladi — qoralarning farzini esa bundan darhol foydalanadi.",
    ],
    comments: {
      1: "Piyoda f3 ga yurdi: bu hech bir donaga yoʻl ochmaydi, aksincha, shohga boradigan diagonalni ochib qoʻyadi. Yomon birinchi yurish.",
      2: "Qoralar farzin va filga yoʻl ochadi.",
      3: "Ikkinchi xato: endi e1–h4 diagonali butunlay ochiq.",
      4: "Farzin shoh beradi, shohning esa qochishga joyi yoʻq: toʻsadigan dona ham, farzinni uradigan dona ham yoʻq. Mot!",
    },
    keyMoments: [{ caption: "Ikkinchi yurishda mot: e1–h4 diagonali ochiq" }],
    lesson: "Partiya boshida shoh oldidagi piyodalarni sababsiz surma. Avval otlar va fillarni oʻyinga olib chiq.",
    facts: [
      "Haqiqiy turnirlarda ahmoqona mot uchramaydi — lekin har bir yangi boshlovchi hech boʻlmasa bir marta unga tushib qolay degan.",
      "Qoralar ham f6 va g5 yurishlarini qilsa, xuddi shunday mot boʻlishi mumkin.",
    ],
  },
  "scholars-mate": {
    title: "Bolalar moti",
    white: "Hujumchi",
    black: "Parishonxotir",
    place: "Oʻquv partiyasi",
    era: "Yangi boshlovchilar uchun tuzoq",
    story: [
      "Yangi boshlovchilar uchun eng mashhur tuzoq. Oqlar farzin va filni f7 katagiga qaratadi — partiya boshida bu katakni faqat shoh himoya qiladi.",
      "Bolalar motiga tushib qolish oson, lekin undan saqlanish ham qiyin emas — faqat oq farzin qayerga qarab turganini bilsang boʻldi. Partiyani koʻrib chiq va qanday himoyalanishni eslab qol!",
    ],
    comments: {
      3: "Fil f7 ga qarab turibdi.",
      5: "Farzin ham f7 ga qaradi! Ikki dona hujum qilyapti, katakni esa faqat shoh himoya qilyapti.",
      6: "Xato: ot chiqdi-yu, xavfni payqamadi. f7 ni himoya qilish kerak edi — masalan, ♕e7 yurishi yoki farzinni quvib yuboradigan g6 bilan.",
      7: "Farzin piyodani urib, shoh beradi. Farzinni c4 dagi fil himoya qilyapti — uni urib boʻlmaydi. Mot!",
    },
    keyMoments: [{ caption: "Farzin va fil f7 ni moʻljalga oldi" }, { caption: "Mot: farzinni fil himoya qilyapti" }],
    lesson:
      "Raqib farzinni erta olib chiqsa, oʻzingdan soʻra: «U qayerga qarab turibdi?» Qoralarda f7 katagini, oqlarda esa f2 ni ehtiyot qil.",
    facts: [
      "3.♕h5 dan keyin eng yaxshi himoya — g6 yurishi: farzin chekinishga majbur, qoralar esa vaqt yutadi.",
      "Farzinni erta olib chiqish — yomon fikr: raqib uni quvib, osongina vaqt yutib oladi.",
    ],
  },
  legal: {
    title: "Legal moti",
    white: "Kermyur de Legal",
    black: "Sen-Bri",
    place: "Parij, «Rejans» kafesi",
    era: "Qadimiy tuzoq",
    story: [
      "Kermyur de Legal XVIII asrda Parijning eng kuchli shaxmatchisi, buyuk Filidorning ustozi boʻlgan. Bu partiyani u shahardagi barcha shaxmatchilar yigʻiladigan mashhur «Rejans» kafesida oʻynagan.",
      "Goʻyo Legal koʻrmay qolib, farzinini boy berib qoʻygandek edi. Raqib xursand boʻlib, uni darrov urib oldi — ikki yurishdan soʻng esa uchta yengil dona uni mot qildi. Hozirgacha «Legal moti» deb ataladigan tuzoq shunday tugʻilgan.",
    ],
    comments: {
      6: "Fil f3 dagi otni bogʻlab qoʻydi: ot joyidan jilsa, d1 dagi farzin zarba ostida qoladi.",
      8: "Qoralar vaqtni bekorga sarflayapti. Otni chiqargan maʼqul edi: ♘c6.",
      9: "Ot baribir joyidan ketib, farzinni «sovgʻa qiladi»! Lekin bu tuzoq: ot f7 va g4 ga hujum qilyapti.",
      10: "Ochkoʻzlik jazosiz qolmaydi: qoralar farzinni urib oldi. Otni piyoda bilan urish kerak edi — dxe5 — shunda qoralar bor-yoʻgʻi bitta piyodani boy berardi.",
      11: "Fil shoh beradi. Shoh oldinga yurishga majbur: orqaga yoʻl yoʻq.",
      13: "Ot mot qiladi. Shohni oʻz donalari oʻrab olgan, otni esa uradigan hech kim yoʻq. Uchta yengil dona farzinsiz ham uddasidan chiqdi!",
    },
    keyMoments: [
      { caption: "Legal farzinni «boy beradi» — aslida esa tuzoq qoʻyadi" },
      { caption: "Legal moti: ot, fil va ot" },
    ],
    lesson:
      "Donani urishdan oldin oʻzingdan soʻra: «Nega uni menga berishyapti?» Shaxmatdagi sovgʻalar baʼzan hiylali boʻladi.",
    facts: [
      "Bu tuzoq hozir ham ishlaydi: uni bolalar turnirlarida ham, internetda ham qoʻyishadi.",
      "Legalning shogirdi Filidor XVIII asrning eng kuchli shaxmatchisiga aylandi va shunday deb yozdi: «Piyodalar — shaxmatning joni».",
    ],
  },
  opera: {
    title: "Operadagi partiya",
    white: "Pol Morfi",
    black: "Braunshveyg gersogi va graf Izuar",
    place: "Parij, Italyan operasi",
    era: "Romantik shaxmat",
    story: [
      "Amerikalik Pol Morfi 21 yoshida Yevropaga kelib, eng kuchli shaxmatchilarning hammasini yengdi. Bir kuni uni operaga taklif qilishdi — u yerda esa gersog bilan graf «Sevilya sartaroshi» spektakli ketayotgan paytda, toʻppa-toʻgʻri lojaning oʻzida unga qarshi ikkovlashib oʻynay boshlashdi.",
      "Morfi musiqa tinglashni istardi, shuning uchun tez va chiroyli oʻynadi. Har yurishda oʻyinga yangi dona olib chiqdi, soʻng ot, rux va farzinni qurbon qildi — va 17 yurishda mot qildi. Bu partiyani donalarni olib chiqish boʻyicha eng yaxshi dars deb atashadi.",
    ],
    comments: {
      6: "Fil otni bogʻlab qoʻydi. Lekin qoralar hali boshqa birorta donani ham olib chiqmagan.",
      13: "Farzin bir yoʻla ikki piyodaga hujum qilyapti: b7 va f7 ga. Bu — ikki tomonlama hujum.",
      14: "Qoralar f7 ni farzin bilan himoya qiladi. b7 dagi piyoda himoyasiz qoldi, lekin Morfi uni olmaydi: farzinlar almashsa, hujum tugab qolardi.",
      15: "Piyodani olish oʻrniga — oʻyinga yangi dona. Sanab koʻr: oqlarda farzin, fil va ot chiqqan, qoralarda esa faqat farzin bilan ot.",
      19: "Ot qurbon qilindi! Morfi qora shohga yoʻl ochish uchun otni piyodaga beradi.",
      21: "Fil shoh beradi. Qoralar ot bilan toʻsiladi, lekin endi ularning hamma donalari bogʻlangan va bir-biriga siqilib qolgan.",
      23: "Uzun rokirovka: shoh xavfsiz joyda, rux esa darhol ochiq d vertikaliga chiqadi.",
      25: "Rux otni uradi — yana bir qurbon. Buning evaziga ikkinchi rux darhol d vertikalini egallaydi.",
      31: "Partiyaning eng chiroyli yurishi: farzin qurbon qilinadi! Ot uni urishga majbur.",
      33: "Rux mot qiladi. U butun d vertikali va 8-gorizontalni nazorat qiladi, g5 dagi fil esa shohni e7 ga qoʻymaydi. Oʻzing tekshirib koʻr: shohning boradigan joyi yoʻq!",
    },
    keyMoments: [
      { caption: "Farzin b7 va f7 ga bir yoʻla hujum qiladi" },
      { caption: "Ot qurbon qilinib, yoʻllar ochiladi" },
      { caption: "Farzin qurbon qilinadi: ♕b8+!!" },
      { caption: "d8 da rux bilan mot" },
    ],
    lesson: "Donalarni tez olib chiq, har yurishda — yangisini. Joyida turgan donalar shohga yordam bermaydi.",
    facts: [
      "Morfining fikricha, gersog bilan graf unchalik yomon oʻynamagan — shunchaki u operaga qaytish uchun juda tez oʻynagan.",
      "Pol Morfi 22 yoshida shaxmatni tashlab ketgan, lekin uning partiyalarini hozirgacha oʻrganishadi.",
    ],
  },
  immortal: {
    title: "Oʻlmas partiya",
    white: "Adolf Anderssen",
    black: "Lionel Kizeritskiy",
    place: "London",
    event: "Birinchi xalqaro turnir paytidagi oʻrtoqlik partiyasi",
    era: "Romantik shaxmat",
    story: [
      "1851-yilda Londonda tarixdagi birinchi xalqaro shaxmat turniri boʻlib oʻtdi. Unda nemis matematika oʻqituvchisi Adolf Anderssen gʻolib chiqdi. Bu partiyani esa u tanaffus paytida, shunchaki zavq uchun oʻynagan.",
      "Anderssen fil, ikkala rux va farzinni qurbon qildi — va qolgan uchta yengil dona bilan mot qildi. Zamondoshlari shunchalik qoyil qolishdiki, partiyani «Oʻlmas» deb atashdi.",
    ],
    comments: {
      3: "Shoh gambiti: oqlar yoʻllarni tezroq ochish uchun f4 dagi piyodani qurbon qiladi.",
      6: "Farzin erta shoh beradi. Oqlar rokirovka qilish huquqini yoʻqotadi, lekin tez orada qora farzinning oʻzi zarbalar ostida qoladi.",
      21: "Rux g1 ga oʻtdi, b5 dagi fil esa zarba ostida qoldi! Oqlar uchun hujum muhimroq.",
      22: "Qoralar filni urib oldi, lekin ularning donalari hali ham oʻz joylarida turibdi.",
      28: "Qora ot g8 ga qaytadi: qoralarda faqat farzin oʻyinga chiqqan.",
      35: "d6 dagi fil farzinning orqaga qaytish yoʻlini toʻsadi — partiyaning yakuniy qismi boshlanadi.",
      36: "Qoralar g1 dagi ruxni olib qoʻyadi…",
      38: "…va shoh berib, ikkinchi ruxni ham oladi. Qoralarda donalar ancha koʻp — lekin qara-chi, ular qayerda turibdi.",
      43: "Farzin shoh berib, qurbon boʻladi! Ot uni urishga majbur.",
      45: "Fil mot qiladi. Oqlarda faqat ikki ot va bitta fil qolgan edi, qoralarda esa farzin, ikki rux va ikki fil — lekin shuning oʻzi yetarli boʻldi.",
    },
    keyMoments: [
      { caption: "b5 dagi fil zarba ostida: hujum muhimroq" },
      { caption: "Qoralar ikkala ruxni ham oldi, lekin donalari hamon joyida" },
      { caption: "Farzin qurbon qilinadi: ♕f6+!!" },
      { caption: "Uchta yengil dona bilan mot" },
    ],
    lesson: "Eng muhimi — donalar soni emas. Oʻyinda qatnashmayotgan donalar goʻyo umuman yoʻqdek.",
    facts: [
      "Anderssen maktabda matematikadan dars bergan, shaxmatni esa zavq uchun oʻynagan.",
      "Yakuniy pozitsiyada qoralarning donalari oqlarnikidan koʻp — lekin aynan qoralar mot boʻldi.",
    ],
  },
  evergreen: {
    title: "Doimo yashil partiya",
    white: "Adolf Anderssen",
    black: "Jan Dyufresne",
    place: "Berlin",
    era: "Romantik shaxmat",
    story: [
      "«Oʻlmas partiya»dan bir yil oʻtib, Anderssen yana bir afsonaviy partiyani oʻynadi — bu safar shogirdi Jan Dyufresnega qarshi. Birinchi jahon chempioni Vilgelm Steynits uni «Anderssenning dafna gulchambaridagi doimo yashil barg» deb atagan.",
      "Bu yerda ham farzin qurbon qilinadi, lekin eng chiroylisi — butun kombinatsiyani tayyorlaydigan sokin rux yurishi.",
    ],
    comments: {
      7: "Evans gambiti: oqlar donalarini tezroq olib chiqish uchun b4 dagi piyodani qurbon qiladi.",
      13: "Rokirovka. Oqlar hujumga tayyor, qora shoh esa hali markazda.",
      33: "Ot qurbon qilinadi: oqlar qora shohning himoyasini ochib tashlaydi.",
      37: "Sokin yurish! Oqlar hech narsani urmaydi, shoh ham bermaydi — shunchaki ruxni d vertikaliga qoʻyadi. Lekin yakunni aynan shu yurish tayyorlaydi.",
      38: "Qoralar otni urib, g2 da mot qilish bilan tahdid qiladi. Goʻyo ular yutayotgandek…",
      39: "…lekin oqlar kombinatsiyani boshlaydi: rux shoh beradi.",
      41: "Farzin shoh berib, qurbon boʻladi! Shoh uni urishga majbur.",
      43: "Qoʻsh shoh: fil ham, rux ham shoh beryapti! Bunday shohdan faqat shohni qochirib qutulish mumkin.",
      47: "Fil mot qiladi. Kombinatsiya yakunlandi.",
    },
    keyMoments: [
      { caption: "Sokin yurish ♖ad1!! kombinatsiyani tayyorlaydi" },
      { caption: "Farzin qurbon qilinadi: ♕xd7+!!" },
      { caption: "e7 da fil bilan mot" },
    ],
    lesson:
      "Eng kuchli yurishlar har doim ham shoh berish yoki urish emas. Baʼzan eng yaxshi yurish — sokin yurish: u zarbani tayyorlaydi.",
    facts: [
      "«Doimo yashil» degan nomni Steynits oʻylab topgan va bu nom partiyaga bir umrga yopishib qolgan.",
      "Evans gambiti uni 1820-yillarda oʻylab topgan kema kapitani Uilyam Evans sharafiga nomlangan.",
    ],
  },
  "reti-tartakower": {
    title: "Qoʻsh shoh",
    white: "Rixard Reti",
    black: "Saveliy Tartakover",
    place: "Vena",
    era: "XX asr boshi",
    story: [
      "Ikki boʻlajak grossmeysterning qisqa partiyasi. Reti toʻqqizinchi yurishda farzinni qurbon qildi — va ikki yurishdan soʻng mot qildi.",
      "Sir — qoʻsh shohda: ikki dona bir vaqtda shoh bersa, toʻsib ham, ulardan birini urib ham qutulib boʻlmaydi. Shohga faqat qochish qoladi.",
    ],
    comments: {
      2: "Karo-Kann himoyasi: qoralar markaz uchun kurashish maqsadida d5 ni tayyorlaydi.",
      15: "Uzun rokirovka: rux darhol d vertikaliga chiqib, qora shoh tomonga qarab turadi.",
      16: "Qoralar otni urib, bir dona yutdik deb oʻylaydi. Lekin qora shoh hali markazda…",
      17: "Farzin shoh berib, qurbon boʻladi! Shoh uni urishga majbur: boshqa himoya yoʻq.",
      19: "Qoʻsh shoh: g5 dagi fil va d1 dagi rux shohga bir vaqtda hujum qilyapti. Toʻsib boʻlmaydi, ikkala donani birdan urib ham boʻlmaydi.",
      20: "Agar shoh e8 ga borganida, rux mot qilardi: ♖d8#.",
      21: "Fil mot qiladi. Hammasi boʻlib 11 yurish!",
    },
    keyMoments: [
      { caption: "Farzin qurbon qilinadi: ♕d8+!!" },
      { caption: "Fil va rux bilan qoʻsh shoh" },
      { caption: "11-yurishda mot" },
    ],
    lesson:
      "Qoʻsh shoh — eng kuchli shoh: undan faqat shohni qochirib qutulish mumkin. Ikki donang raqib shohiga qarab turgan boʻlsa, qoʻsh shohni izla.",
    facts: [
      "Tartakover hazilkashligi bilan mashhur boʻlgan. Unga shunday soʻzlar nisbat beriladi: «Har bir partiyada xato bor, faqat uni topish kerak».",
      "Keyinchalik Reti oʻz nomi bilan ataladigan mashhur debyutni yaratdi.",
    ],
  },
  "game-of-the-century": {
    title: "Asr partiyasi",
    white: "Donald Byrne",
    black: "Robert Fisher",
    place: "Nyu-York",
    event: "Rozenvald xotirasiga bagʻishlangan turnir",
    era: "Zamonaviy shaxmat",
    story: [
      "Bobbi Fisher bu partiyani kuchli usta Donald Byrnega qarshi oʻynaganida atigi 13 yoshda edi. Oʻn uch yoshli bola farzinini qurbon qildi — va gʻalaba qozondi!",
      "Jurnalistlar uni «asr partiyasi» deb atashdi. Oradan 16 yil oʻtib, Fisher jahon chempioni boʻldi. Partiya uzun, shuning uchun asosiy lahzalarga eʼtibor ber — ular belgilab qoʻyilgan.",
    ],
    comments: {
      21: "Fil g5 ga oʻtadi — bu vaqtni bekorga sarflash. Oqlar hali f1 dagi filni olib chiqmagan, rokirovka ham qilmagan.",
      22: "Ot a4 ga yuradi! Fisher kombinatsiyani boshlaydi: u oqlarga e7 dagi piyodani urib, farzinga hujum qilishga imkon beradi.",
      27: "Oqlar piyodani urib, farzinga hujum qiladi. Qoralarning ishi chatoqqa oʻxshaydi…",
      34: "Partiyaning eng mashhur yurishi: fil e6 ga oʻtib, farzinni zarba ostida qoldiradi! Agar oqlar farzinni olsa, qoralar shoh berib-berib hamma narsani olib ketadi.",
      35: "Oqlar baribir farzinni urib oladi.",
      36: "Fil shoh beradi — «tegirmon» boshlanadi: qoralar oqlarning donalarini birin-ketin olib ketadi, har safar shoh berib.",
      56: "Farzin evaziga qoralar rux, ikki fil va ot oldi. Ularning donalari koʻp va hammasi birgalikda ishlaydi, oq farzin esa yolgʻiz.",
      82: "Rux mot qiladi. Oʻn uch yoshli Fisher ustani yengdi.",
    },
    keyMoments: [
      { caption: "♗e6!! — Fisher farzinni zarba ostida qoldiradi" },
      { caption: "Shoh berishlar «tegirmoni» boshlanadi" },
      { caption: "Farzin evaziga — rux, ikki fil va ot" },
      { caption: "Mot: 13 yoshli Fisher gʻolib" },
    ],
    lesson:
      "Variantlarni hisoblab koʻr va agar evaziga koʻproq narsa olsang, eng kuchli donangni berishdan qoʻrqma — ayniqsa raqib shohi himoyasiz qolayotgan boʻlsa.",
    facts: [
      "Fisher 1972-yilda Boris Spasskiyni yengib, jahon chempioni boʻldi.",
      "Fisher 15 yoshida oʻsha paytdagi dunyoning eng yosh grossmeysteri boʻlgan. Bugun bu rekord hali 13 yoshga ham toʻlmagan oʻyinchilarga tegishli.",
    ],
  },
};
