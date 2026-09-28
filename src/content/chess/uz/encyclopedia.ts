import type { Uz } from "../../localize";
import type {
  CHESS_MATH,
  PIECE_NAMES,
  RECORDS,
  TIMELINE,
  UZBEK_CHESS,
  WOMEN_CHAMPIONS,
  WORLD_CHAMPIONS,
} from "../encyclopedia";

export const timelineUz: Uz<typeof TIMELINE> = [
  {
    when: "VI asr",
    place: "Hindiston",
    title: "Chaturanga",
    text: "Hindistonda chaturanga degan oʻyin oʻylab topildi — bu «toʻrt xil qoʻshin» degani. Donalar piyoda askarlarni, otliqlarni, jangovar fillarni va jang aravalarini tasvirlagan. Farzin hali yoʻq edi: shohning yonida maslahatchi turardi, u bor-yoʻgʻi bir katak yurardi.",
  },
  {
    when: "VII asr",
    place: "Eron",
    title: "Shatranj",
    text: "Oʻyin Eronga yetib keldi va shatranj deb atala boshladi. «Shoh» (podshoh) va «mot» (yengildi) soʻzlari ham oʻsha yerdan kelgan. Partiyalarni yozib borish va masalalar tuzishni birinchi boʻlib forslar boshlagan.",
  },
  {
    when: "VII–VIII asrlar",
    place: "Samarqand",
    title: "Afrosiyob donalari",
    text: "Afrosiyobda — qadimgi Samarqand xarobalarida — arxeologlar fil suyagidan yasalgan yettita shaxmat donasini topishgan: shoh, fil mingan jangchi, otliqlar, jang aravasi va piyodalar. Bu — dunyodagi eng qadimgi shaxmat toʻplamlaridan biri.",
  },
  {
    when: "IX–X asrlar",
    place: "Bagʻdod",
    title: "Ilk ustalar",
    text: "Bagʻdodda ilk mashhur shaxmat ustalari paydo boʻldi — ularni «aliya», yaʼni «oliy darajadagilar» deb atashgan. As-Suliy oʻz davrining eng kuchli oʻyinchisi hisoblangan, uning masalalar toʻplamlarini esa asrlar davomida qoʻlda koʻchirib kelishgan.",
  },
  {
    when: "XI asr",
    place: "Xorazm",
    title: "Beruniy va bugʻdoy donlari",
    text: "Xorazmda tugʻilgan buyuk olim Abu Rayhon Beruniy Hindiston haqidagi kitobida bugʻdoy donlari haqidagi rivoyatni yozib qoldirgan: birinchi katakka bitta don, keyingi har bir katakka esa ikki barobar koʻp. U qanday ulkan son chiqishini hisoblab bergan.",
  },
  {
    when: "XI–XII asrlar",
    place: "Ispaniya va Italiya",
    title: "Shaxmat Yevropaga yetib keladi",
    text: "Arablar boshqargan Ispaniya va savdo yoʻllari orqali shaxmat Yevropaga yetib bordi. Fil yepiskopga, maslahatchi qirolichaga, jang aravasi esa qayiq yoki minoraga aylandi: har bir xalq donalarga oʻz nomini berdi.",
  },
  {
    when: "XIV asr",
    place: "Samarqand",
    title: "Amir Temur shaxmati",
    text: "Sohibqiron Amir Temur shaxmatni juda sevgan. U 110 katakli taxtada yangi donalar — tuyalar, jirafalar va vazirlar bilan «katta shaxmat» oʻynagan. Rivoyatga koʻra, oʻgʻli tugʻilgani haqidagi xushxabar kelganda u endigina «shoh-rux» yurishini qilgan ekan — shuning uchun oʻgʻliga Shohrux deb ism qoʻygan.",
  },
  {
    when: "XV asr",
    place: "Ispaniya",
    title: "Farzin kuchga kiradi",
    text: "Farzin bilan fil hozirgidek yuradigan boʻldi — oʻyin tez va keskin tus oldi. Yangi shaxmatni avvaliga «telba qirolicha shaxmati» deb atashgan. 1497-yilda shaxmat haqidagi birinchi bosma kitob chiqdi.",
  },
  {
    place: "Fransiya",
    title: "Piyodalar — shaxmatning joni",
    text: "Musiqachi va XVIII asrning eng kuchli shaxmatchisi Fransua-Andre Filidor «Shaxmat oʻyini tahlili» degan kitob yozdi. Uning asosiy fikri: «Piyodalar — shaxmatning joni».",
  },
  {
    place: "London",
    title: "Birinchi xalqaro turnir",
    text: "Londonda birinchi xalqaro turnir boʻlib oʻtdi. Unda Adolf Andersen gʻolib chiqdi, tanaffus paytida esa «Oʻlmas partiya»ni oʻynadi.",
  },
  {
    place: "AQSH",
    title: "Birinchi jahon chempioni",
    text: "Vilgelm Steynits Iogann Sukertortni yengib, birinchi rasmiy jahon chempioni boʻldi. Oʻshandan beri bu unvon matchlarda qoʻldan-qoʻlga oʻtadi.",
  },
  {
    place: "Parij",
    title: "FIDE",
    text: "Xalqaro shaxmat federatsiyasi — FIDE tashkil topdi. Uning shiori: Gens una sumus — «Biz bir oilamiz». 1927-yildan beri FIDE Butunjahon shaxmat olimpiadalarini oʻtkazib keladi.",
  },
  {
    place: "Nyu-York",
    title: "Kompyuter chempionni yengadi",
    text: "Deep Blue kompyuteri jahon chempioni Garri Kasparovni matchda yengdi. Bugun shaxmat dasturlari har qanday odamdan kuchli — shaxmatchilar ham ulardan oʻrganadi.",
  },
  {
    place: "Tripoli",
    title: "Toshkentlik chempion",
    text: "Toshkentlik Rustam Qosimjonov finalda angliyalik Maykl Adamsni yengib, FIDE jahon chempionatida gʻolib chiqdi. Oʻzbekistondan chiqqan birinchi jahon chempioni!",
  },
  {
    place: "Toshkent",
    title: "12 yoshida grossmeyster",
    text: "Javohir Sindorov 12 yosh 10 oyligida grossmeyster boʻldi — shaxmat tarixidagi eng yosh grossmeysterlardan biri.",
  },
  {
    place: "Varshava",
    title: "Tezkor shaxmat boʻyicha jahon chempioni",
    text: "Nodirbek Abdusattorov 17 yoshida tezkor shaxmat boʻyicha jahon chempioni boʻldi. Bu yoʻlda u Magnus Karlsenni ham yutgan.",
  },
  {
    place: "Chennay",
    title: "Oʻzbekiston — Olimpiada chempioni",
    text: "Oʻzbekiston terma jamoasi — yosh grossmeysterlar jamoasi — shaxmatning vatani Hindistonda boʻlib oʻtgan Butunjahon shaxmat olimpiadasida gʻolib chiqdi.",
  },
  {
    place: "Singapur",
    title: "Eng yosh jahon chempioni",
    text: "Hindistonlik Gukesh Dommaraju Din Lijenni yengib, 18 yoshida tarixdagi eng yosh jahon chempioni boʻldi.",
  },
];

export const worldChampionsUz: Uz<typeof WORLD_CHAMPIONS> = [
  {
    name: "Vilgelm Steynits",
    country: "Avstriya, AQSH",
    note: "«Pozitsion oʻyin»ni oʻylab topgan: avval kichik ustunliklarni toʻpla, keyin hujumga oʻt.",
  },
  {
    name: "Emanuil Lasker",
    country: "Germaniya",
    note: "27 yil chempion boʻlgan — hammadan uzoq. Kasbi — matematik.",
  },
  {
    name: "Xose Raul Kapablanka",
    country: "Kuba",
    note: "4 yoshida otasining oʻyinlarini kuzatib, shaxmat oʻynashni oʻrganib olgan. Deyarli yutqazmagan.",
  },
  {
    name: "Aleksandr Alyoxin",
    country: "Rossiya, Fransiya",
    note: "Hujum va kombinatsiyalar ustasi. Unvonini hech kimga boy bermay olamdan oʻtgan yagona chempion.",
  },
  {
    name: "Maks Eyve",
    country: "Niderlandiya",
    note: "Matematika oʻqituvchisi boʻlgan. Keyinroq FIDE prezidenti boʻldi.",
  },
  {
    name: "Mixail Botvinnik",
    country: "SSSR",
    note: "Muhandis, sovet shaxmat maktabining asoschisi. Karpov, Kasparov va Kramnikka ustozlik qilgan.",
  },
  {
    name: "Vasiliy Smislov",
    country: "SSSR",
    note: "Juda chiroyli qoʻshiq aytardi — sal boʻlmasa opera xonandasi boʻlib ketardi.",
  },
  {
    name: "Mixail Tal",
    country: "SSSR",
    note: "«Rigalik sehrgar»: donalarni shunchalik dadil qurbon qilardiki, raqiblari dovdirab qolardi.",
  },
  {
    name: "Tigran Petrosyan",
    country: "SSSR",
    note: "«Temir Tigran» — himoya ustasi: uni yutish deyarli imkonsiz edi.",
  },
  {
    name: "Boris Spasskiy",
    country: "SSSR",
    note: "Har qanday uslubda oʻynay olardi. Uning Fisher bilan matchini butun dunyo kuzatgan.",
  },
  {
    name: "Robert Fisher",
    country: "AQSH",
    note: "15 yoshida grossmeyster boʻlgan. «Asr partiyasi»ning muallifi.",
  },
  {
    name: "Anatoliy Karpov",
    country: "SSSR",
    note: "Hammadan koʻp turnirda gʻolib chiqqan. Pochta markalarini yigʻadi.",
  },
  {
    name: "Garri Kasparov",
    country: "SSSR, Rossiya",
    note: "22 yoshida chempion boʻlgan. Kompyuterlarga qarshi matchlar oʻynagan.",
  },
  {
    name: "Vladimir Kramnik",
    country: "Rossiya",
    note: "Kasparovni matchda yenggan — birorta ham partiyada yutqazmasdan.",
  },
  {
    name: "Vishvanatan Anand",
    country: "Hindiston",
    note: "«Madras chaqmogʻi» — shaxmatning vatani Hindistondan chiqqan birinchi chempion.",
  },
  {
    name: "Magnus Karlsen",
    country: "Norvegiya",
    note: "Tarixdagi eng yuqori reyting uniki. Unvonni himoya qilish zerikarli boʻlib qolgani uchun undan voz kechgan.",
  },
  {
    name: "Din Lijen",
    country: "Xitoy",
    note: "Xitoydan chiqqan birinchi jahon chempioni.",
  },
  {
    name: "Gukesh Dommaraju",
    country: "Hindiston",
    years: "2024-yildan",
    note: "Tarixdagi eng yosh chempion — 18 yoshda.",
  },
];

export const womenChampionsUz: Uz<typeof WOMEN_CHAMPIONS> = [
  {
    name: "Vera Menchik",
    country: "Rossiya, Buyuk Britaniya",
    note: "Ayollar orasida birinchi jahon chempioni. Koʻplab erkak grossmeysterlarni yutgan.",
  },
  {
    name: "Nona Gaprindashvili",
    country: "SSSR, Gruziya",
    note: "Erkaklar qatorida grossmeyster unvonini olgan birinchi ayol.",
  },
  {
    name: "Mayya Chiburdanidze",
    country: "SSSR, Gruziya",
    note: "17 yoshida jahon chempioni boʻlgan.",
  },
  {
    name: "Xou Ifan",
    country: "Xitoy",
    note: "16 yoshida jahon chempioni boʻlgan.",
  },
  {
    name: "Ju Venjun",
    country: "Xitoy",
    years: "2018-yildan",
    note: "Hozirgi jahon chempioni.",
  },
];

export const fideNoteUz =
  "1993–2006-yillarda ikkita unvon boʻlgan: «klassik» jahon chempioni va FIDE jahon chempioni. FIDE chempionlari Anatoliy Karpov, Aleksandr Xalifman, Vishvanatan Anand, Ruslan Ponomaryov, Rustam Qosimjonov (2004) va Veselin Topalov boʻlgan. 2006-yilda ikki unvon birlashtirildi.";

export const polgarNoteUz =
  "Vengriyalik Yudit Polgar hech qachon ayollar unvoni uchun oʻynamagan — u erkaklar bilan bellashgan va dunyoning eng kuchli oʻnta shaxmatchisi qatoriga kirgan. Kasparov, Karpov, Anand va Karlsenni yutgan.";

export const pieceNamesTableUz: Uz<typeof PIECE_NAMES> = [
  { origin: "Fors tilidagi «shoh» — hukmdor degani. «Shoh!» deyish esa «ehtiyot boʻl, shoh!» degani." },
  { origin: "Fors tilidagi «farzin» — maslahatchi, donishmand degani. Yevropada bu dona qirolichaga aylangan." },
  {
    origin:
      "Fors tilidagi «rux» — jang aravasi degani. Ruscha «ladya» esa qayiq degani: qadimgi Rusda bu donani kemaga oʻxshatib yasashgan.",
  },
  {
    origin:
      "Fors tilidagi «fil» — xuddi oʻzbekchadagidek, fil degani. Hindistonda bu dona jangovar filni tasvirlagan. Inglizlar uni yepiskop, fransuzlar esa masxaraboz deb atashgan.",
  },
  { origin: "Otliq qoʻshin. Koʻp tillarda bu donani shunday atashadi — ot yoki chavandoz." },
  {
    origin:
      "Ruscha «peshka» — «peshiy», yaʼni «piyoda yuradigan» soʻzidan: piyoda askar degani. Oʻzbekcha «piyoda» ham xuddi shu maʼnoni bildiradi.",
  },
];

export const recordsUz: Uz<typeof RECORDS> = [
  {
    title: "Eng uzun partiya",
    text: "Nikolich — Arsovich, 1989-yil: 269 yurish va 20 soatdan ortiq oʻyin. Partiya durang bilan tugagan.",
  },
  {
    title: "Eng qisqa partiya",
    text: "Ahmoqona mot — bor-yoʻgʻi 2 yurish. Haqiqiy turnirlarda esa eng qisqa partiyalar 6–7 yurishda tugagan.",
  },
  {
    title: "Partiyalar soni",
    text: "Turli shaxmat partiyalari koinotdagi atomlardan ham koʻp. Matematik Klod Shennon ularning sonini taxminan birdan keyin 120 ta nol keladigan son deb hisoblagan.",
  },
  {
    title: "Bugʻdoy donlari haqidagi rivoyat",
    text: "Agar taxta kataklariga don qoʻyib, har safar ikki barobar oshirib borsang, jami 18 446 744 073 709 551 615 ta don boʻladi — bu insoniyat butun tarixi davomida yigʻib olgan hosildan ham koʻp.",
  },
  {
    title: "Ot bilan aylanib chiqish",
    text: "Ot 64 katakning hammasini aylanib chiqa oladi — har biriga roppa-rosa bir martadan tushib. Bunday yoʻllar milliardlab bor.",
  },
  {
    title: "Sakkiz farzin",
    text: "Taxtaga 8 ta farzinni birortasi boshqasini urmaydigan qilib qoʻyish mumkin — buning roppa-rosa 92 xil usuli bor.",
  },
  {
    title: "Koinotda shaxmat",
    text: "1970-yilda «Soyuz-9» kemasidagi kosmonavtlar Yerdagi Parvozlarni boshqarish markazi bilan partiya oʻynashgan. Partiya durang bilan tugagan.",
  },
  {
    title: "Eng yosh grossmeysterlar",
    text: "AQSHlik Abhimanyu Mishra 12 yosh 4 oyligida grossmeyster boʻlgan. Toshkentlik Javohir Sindorov esa — 12 yosh 10 oyligida.",
  },
  {
    title: "Maktabda shaxmat",
    text: "Armanistonda 2011-yildan beri shaxmat — maktabdagi majburiy fan. Oʻzbekistonda ham koʻplab maktab va bogʻchalarda shaxmat oʻrgatiladi.",
  },
  {
    title: "Shaxmat kuni",
    text: "Xalqaro shaxmat kuni 20-iyulda — FIDE tashkil topgan kunda nishonlanadi.",
  },
];

export const chessMathUz: Uz<typeof CHESS_MATH> = [
  {
    question:
      "Taxtada nechta katak bor? Har qanday oʻlchamdagi kvadratlar-chi — 1 × 1, 2 × 2 va hokazo 8 × 8 gacha — nechta?",
    answer: "Kataklar 64 ta. Barcha oʻlchamdagi kvadratlar esa 204 ta: `64 + 49 + 36 + 25 + 16 + 9 + 4 + 1`.",
    link: "Xuddi birinchi haftadagi «Nechta kvadrat?» masalasidagidek.",
  },
  {
    question: "Ot oq katakda turibdi. 7 marta sakragandan keyin u qanday rangli katakka tushadi?",
    answer:
      "Qora katakka: har bir sakrash rangni almashtiradi, 7 esa toq son. Bu — juft-toqlik, mantiq haftasidan tanish vosita.",
  },
  {
    question:
      "Birinchi katakka 1 ta don, ikkinchisiga — 2 ta, uchinchisiga — 4 ta qoʻyiladi… Oʻninchi katakda nechta don boʻladi?",
    answer:
      "512: sonlar ikki barobar ortib boradi — 1, 2, 4, 8, 16, 32, 64, 128, 256, 512. 64-katakda esa 19 xonali son boʻladi!",
    link: "Uchinchi haftadagi «Ikki barobar ogʻir» masalasidagi tarozi toshlarini va «Chiroq va kalitlar» masalasini esla.",
  },
  {
    question: "Boʻsh taxtada rux nechta katakni uradi? Bu uning qayerda turishiga bogʻliqmi?",
    answer:
      "Doim 14 ta: vertikal boʻylab 7 ta va gorizontal boʻylab 7 ta. Fil esa markazda 13 ta katakni uradi, burchakda — atigi 7 tani.",
  },
  {
    question: "Taxtaga 9 ta farzinni birortasi boshqasini urmaydigan qilib qoʻyish mumkinmi?",
    answer:
      "Yoʻq: har bir gorizontalda faqat bitta farzin tura oladi, gorizontallar esa hammasi boʻlib 8 ta. Bu — mantiq haftasidagi «quyonlar kataklardan koʻp» tamoyili.",
  },
  {
    question: "Oqlar birinchi yurishni necha xil usulda qila oladi?",
    answer:
      "20 xil: 8 ta piyodaning har biri bir yoki ikki katak yura oladi (16 ta yurish), har bir otning esa 2 tadan yurishi bor. Qoralar ham birinchi yurishini qilgach, turli pozitsiyalar soni 400 taga yetadi.",
  },
];

export const uzbekChessUz: Uz<typeof UZBEK_CHESS> = {
  title: "Oʻzbekistonda shaxmat",
  paragraphs: [
    "Oʻzbekiston zaminida shaxmat koʻp shaharlardan ham qadimiyroq. Samarqanddagi Afrosiyobdan topilgan donalar yer ostida 1200 yildan ortiq yotgan. Xorazmlik olim Abu Rayhon Beruniy shaxmat haqida yozgan, Samarqandda esa Amir Temur jirafa va tuyalari bor «katta shaxmat» oʻynagan.",
    "Bugun Oʻzbekiston — dunyodagi eng kuchli shaxmat mamlakatlaridan biri. Rustam Qosimjonov 2004-yilda FIDE jahon chempioni boʻldi, Nodirbek Abdusattorov — 2021-yilda tezkor shaxmat boʻyicha jahon chempioni. 2022-yilda esa terma jamoamiz Butunjahon shaxmat olimpiadasida gʻolib chiqdi.",
    "Donalarning oʻzbekcha nomlari — shoh, farzin, rux, fil, ot, piyoda — shatranj davridan beri deyarli oʻzgarmagan. Oʻynayotib, sen ming yildan ham qadimiy soʻzlarni tilga olasan.",
  ],
  people: [
    {
      name: "Rustam Qosimjonov",
      years: "1979-yilda tugʻilgan",
      text: "2004-yilgi FIDE jahon chempioni. Keyinchalik jahon chempioni Vishvanatan Anandga matchlarga tayyorlanishda yordam bergan.",
    },
    {
      name: "Nodirbek Abdusattorov",
      years: "2004-yilda tugʻilgan",
      text: "13 yoshida grossmeyster, 17 yoshida tezkor shaxmat boʻyicha jahon chempioni, 2022-yilgi olimpiada chempioni.",
    },
    {
      name: "Javohir Sindorov",
      years: "2005-yilda tugʻilgan",
      text: "12 yoshida grossmeyster, 2022-yilgi olimpiada chempioni.",
    },
  ],
};
