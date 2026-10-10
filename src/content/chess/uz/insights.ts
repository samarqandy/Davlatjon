import type { Uz } from "../../localize";
import type { DIALOGUES, NEW_VIEWS, THOUGHTS } from "../insights";

/** Buyuklarning fikrlari, suhbatlar va shaxmatga «yangi nigoh» — oʻzbekcha. */
export const thoughtsUz: Uz<typeof THOUGHTS> = {
  "franklin-foresight": {
    author: "Benjamin Franklin",
    where: "olim va siyosatchi · 1706–1790",
    quote: "Uzoqni koʻra bilish biroz oldinga qaraydi va qilingan ishning oqibatlari haqida oʻylaydi.",
    source: "«Shaxmat axloqi», 1786",
    meaning: "Yurishdan oldin oʻzingdan soʻra: bu yurishdan keyin nima boʻladi va raqib nima qila oladi?",
    try: "Partiyada har yurishdan oldin raqibning bitta javobini ovoz chiqarib ayt.",
  },
  "franklin-caution": {
    author: "Benjamin Franklin",
    where: "olim va siyosatchi · 1706–1790",
    quote: "Ehtiyotkorlik — yurishlarimizni juda shoshib qilmaslik.",
    source: "«Shaxmat axloqi», 1786",
    meaning: "Tez yurish har doim ham aqlli yurish emas. Biroz oʻylab olgan maʼqul, keyin uzoq tuzatgandan koʻra.",
    try: "Keyingi partiyada har yurishdan oldin uch marta nafas ol.",
  },
  "franklin-hope": {
    author: "Benjamin Franklin",
    where: "olim va siyosatchi · 1706–1790",
    quote:
      "Hozirgi yomon ahvoldan ruhni tushirmaslik odati, yaxshi tomonga oʻzgarishga umid qilish odati va chiqish yoʻlini tinmay izlash odati.",
    source: "«Shaxmat axloqi», 1786",
    meaning: "Yomon pozitsiyada ham hammasini oʻzgartiradigan yurish topilishi mumkin.",
    try: "Partiya yomon ketsa, himoya qiladigan uchta yurishni top — va eng yaxshisini tanla.",
  },
  "franklin-victory": {
    author: "Benjamin Franklin",
    where: "olim va siyosatchi · 1706–1790",
    quote: "Raqibni yutish istagini jilovla va oʻzingni yengganingdan quvon.",
    source: "«Shaxmat axloqi», 1786",
    meaning: "Eng katta gʻalaba — bugun kechagidan yaxshiroq oʻynaganingda.",
    try: "Partiyadan keyin bugun avvalgidan yaxshiroq chiqqan bitta narsani ovoz chiqarib ayt.",
  },
  "capablanca-pawn": {
    author: "Xose Raul Kapablanka",
    where: "jahon chempioni · 1888–1942",
    quote:
      "Piyodani yutish — partiyada boʻlishi mumkin boʻlgan eng kichik moddiy ustunlik, lekin u koʻpincha gʻalaba uchun yetadi.",
    source: "«Shaxmat asoslari», 1921",
    meaning: "Mayda narsalar hal qiladi. Saqlab qolingan kichik ustunlik gʻalabaga aylanadi.",
    try: "Partiyada har bir piyodani asra: berishdan oldin — nima evaziga? — deb soʻra.",
  },
  "lasker-independent": {
    author: "Emanuel Lasker",
    where: "jahon chempioni · 1868–1941",
    quote:
      "Shaxmat taʼlimi mustaqil fikrlash va baho berish taʼlimi boʻlishi kerak. Shaxmatni yodlash shart emas — bunga ular yetarlicha muhim emas.",
    source: "«Shaxmat darsligi» (Vikiiqtibosdagi keltirishga koʻra, 337-bet)",
    meaning: "Yurishlarni yodlama — nega ular yaxshi ekanini tushunishga harakat qil.",
    try: "Partiyadan bitta yurishni tanla va doʻstingga uni nima uchun qilganingni tushuntir.",
  },
  "lasker-methods": {
    author: "Emanuel Lasker",
    where: "jahon chempioni · 1868–1941",
    quote: "Ismlarni ham, sonlarni ham, alohida holatlarni ham, hatto natijalarni ham emas, faqat usullarni eslab qol.",
    source: "«Shaxmat darsligi» (Vikiiqtibosdagi keltirishga koʻra, 338-bet)",
    meaning: "Gʻoyalar va usullar alohida partiyalardan muhimroq: usulni minglab pozitsiyada qoʻllash mumkin.",
    try: "Sevimli usulingni (masalan, vilkani) tanla va uni uchta turli partiyadan top.",
  },
  "lasker-lies": {
    author: "Emanuel Lasker",
    where: "jahon chempioni · 1868–1941",
    quote: "Shaxmat taxtasida yolgʻon va ikkiyuzlamachilik uzoq yashamaydi.",
    source: "«Shaxmat darsligi» (Vikiiqtibosdagi keltirishga koʻra, 235-bet)",
    meaning: "Taxta yurish yaxshi yoki yomonligini halol koʻrsatadi — hech qanday soʻz buni oʻzgartirmaydi.",
    try: "Gʻoyangni faqat soʻz bilan emas, taxtada yurish bilan tekshir.",
  },
  "lasker-brilliancy": {
    author: "Laskerga nisbat beriladi",
    where: "manba topilmagan",
    quote: "Xatosiz goʻzal kombinatsiya boʻlmaydi.",
    source: "Koʻpincha Laskerga nisbat beriladi; birlamchi manba topilmagan",
    meaning:
      "Goʻzallik oʻyinchilar tavakkal qilib, xato qilgan joyda tugʻiladi. Iqtibosni tekshirib boʻlmasa — bu ham saboq.",
    try: "Soʻra: buni kim, qachon va qayerda aytgan? Haqiqiy tadqiqotchi shunday ishlaydi.",
  },
  "tarrasch-happy": {
    author: "Zigbert Tarrash",
    where: "grossmeyster · 1862–1934",
    quote: "Shaxmat ham sevgi kabi, ham musiqa kabi odamlarni baxtli qila oladi.",
    source: "«Shaxmat oʻyini» (1931) soʻzboshisi, Vikiiqtibosga koʻra",
    meaning: "Shaxmat — quvonch, faqat gʻalaba va ochko emas.",
    try: "Bir partiyani shunchaki zavq uchun oʻyna — ochkoni sanamasdan.",
  },
  "tarrasch-master": {
    author: "Zigbert Tarrash",
    where: "grossmeyster · 1862–1934",
    quote: "Koʻplar shaxmat ustasi boʻldi, lekin hech kim Shaxmat Ustasi boʻla olmadi.",
    source: "D. Levining «Shaxmat va kompyuterlar» (1976) kitobidagi keltirishga koʻra",
    meaning: "Shaxmatda har doim oʻrganadigan narsa bor — eng buyuklardan ham.",
    try: "Shaxmat haqida hali bilmaydigan narsangni top va bugunoq oʻrgan.",
  },
  "tal-fear": {
    author: "Mixail Tal",
    where: "jahon chempioni · 1936–1992",
    quote: "Men oddiy haqiqatni tushundim: faqat men emas, raqibim ham hayajonlanyapti.",
    source: "«Mixail Talning hayoti va partiyalari» (Vikiiqtibosga koʻra)",
    meaning: "Partiya oldidan hamma qoʻrqadi. Bu zaiflik emas, oʻyinning bir qismi.",
    try: "Keyingi partiyadan oldin oʻzingga ayt: «Raqib ham xuddi shunday hayajonlanyapti».",
  },
  "kasparov-process": {
    author: "Garri Kasparov",
    where: "jahon chempioni · tugʻilgan 1963",
    quote: "Kuchsiz inson, qoʻshimcha mashina va yaxshiroq jarayon kuchli kompyuterning oʻzidan kuchliroq chiqdi.",
    source: "The New York Review of Books, 2010-yil 11-fevral",
    meaning: "Eng kuchli ishtirokchi emas, yordamchi bilan eng yaxshi ishlay oladigan kishi yutadi.",
    try: "Masalani dada yoki oyi bilan birga yech: sen oʻylaysan, ular tekshiradi — kim qanday yaxshiroq ishlaydi?",
  },
  "kasparov-question": {
    author: "Garri Kasparov",
    where: "jahon chempioni · tugʻilgan 1963",
    quote: "Odatiy tartibga har doim shubha bilan qara — ayniqsa hammasi yaxshi ketayotgan paytda.",
    source: "«Hayot shaxmatga qanday taqlid qiladi» (2007, 135-bet; Vikiiqtibosga koʻra)",
    meaning: "Yutayotgan paytda ham soʻra: nimani yaxshilash mumkin?",
    try: "Yutgan partiyadan keyin yaxshiroq oʻynash mumkin boʻlgan bitta yurishni top.",
  },
  "judit-stove": {
    author: "Yudit Polgar",
    where: "grossmeyster · tugʻilgan 1976",
    quote: "Siz ovqatni plitaga qaramasdan pishirasizmi?",
    source: "Besh yoshida u bilan koʻrmay oʻynagan kattaga javobi (Vikipediyaga koʻra)",
    meaning: "Taxtani «ichki koʻz» bilan koʻra bilish — oʻrganish mumkin boʻlgan mahorat.",
    try: "Koʻzingni yum va oq piyodalar qayerda turganini ayt.",
  },
  gelfand: {
    author: "Boris Gelfand",
    where: "grossmeyster · tugʻilgan 1968",
    quote:
      "Faqat bir qismi kasbiy oʻynaydi, qolganlari esa reja tuza olish mahoratini, oʻylash odatini, oʻz qilmishiga javob berishni va raqibni hurmat qilishni egallaydi.",
    source: "Ian Rojers bayoniga koʻra, chess.com, 2016",
    meaning: "Shaxmat faqat kelajak chempionlari uchun emas: u fikrlash va boshqalarni hurmat qilishni oʻrgatadi.",
    try: "Ota-onangdan soʻra: shaxmatdagi qaysi mahorat ularning ishida asqotardi?",
  },
  "carlsen-normal": {
    author: "Magnus Karlsen",
    where: "jahon chempioni · tugʻilgan 1990",
    quote: "Men qandaydir moʻjiza emasman. Shaxmatda juda kuchli boʻlsam ham, oddiy odamman.",
    source: "TIME jurnali, 2009",
    meaning: "Kuchli shaxmatchi sehrgar emas: u koʻp oʻynagan va koʻp oʻylagan oddiy inson.",
    try: "Oxirgi yaxshi yurishingni qanday oʻylab topganingni tushuntirib koʻr.",
  },
  abdusattorov: {
    author: "Nodirbek Abdusattorov",
    where: "rapid boʻyicha jahon chempioni · tugʻilgan 2004",
    quote: "Bu uzoq yoʻl boʻldi. Har safar juda yaqin edim, lekin yildan yilga uddalay olmadim.",
    source: "chess.com intervyusi, 2026-yil fevral",
    meaning: "Gʻalaba koʻpincha bir necha muvaffaqiyatsizlikdan keyin keladi — agar tashlab ketmasang.",
    try: "Uzoq vaqt uddalay olmagan, endi esa uddalayotgan narsangni eslab koʻr.",
  },
  hassabis: {
    author: "Demis Xassabis",
    where: "AlphaZero yaratuvchisi · tugʻilgan 1976",
    quote:
      "Shaxmat menga masalalarni yechishni, reja va strategiya tuzishni, musobaqaning kuchli bosimiga bardosh berishni oʻrgatdi.",
    source: "«Game Changer» (2019) kitobining soʻzboshisi",
    meaning: "Shaxmat nafaqat xotirani, balki reja tuzishni va qiyin paytda oʻzini tutishni ham mashq qildiradi.",
    try: "Partiyadan oldin qisqa reja tuz: dastlabki oʻn yurishda nimaga erishmoqchiman?",
  },
};

export const dialoguesUz: Uz<typeof DIALOGUES> = {
  lose: {
    title: "Yutqazdi — endi nima?",
    hook: "Malika birinchi turda yutqazib, xafa boʻldi. Bobosi unga nima dedi?",
    lines: [
      { who: "Malika", text: "Birinchi turda yutqazdim. Uyalyapman." },
      {
        who: "Bobo",
        text: "Jahon chempioni Kapablankaning kitobini olaylik. Qara: bu yerda u yutqazgan partiyalarini oʻzi chop etgan.",
      },
      { who: "Malika", text: "Chempion oʻz magʻlubiyatlarini chop etadimi? Uyalmaydimi?" },
      {
        who: "Bobo",
        text: "Bunday partiyalardan birini u shunday izohlagan: «Sabab — bu debyut variantlarini umuman bilmaslik». Magʻlubiyat unga nimani oʻrganish kerakligini koʻrsatgan.",
      },
      { who: "Malika", text: "Boshqalarda ham shunday boʻlganmi?" },
      {
        who: "Bobo",
        text: "2025-yil avgustda Nodirbek Abdusattorov katta turnirda oxirgi oʻrinni egalladi. Toʻrt oydan keyin boshqa turnirda yutdi, 2026-yil fevralda esa — «Tata Stil»da.",
      },
      { who: "Malika", text: "Demak, magʻlubiyat — oxiri emas?" },
      { who: "Bobo", text: "Bu — saboq. Shaxmatda saboqlar eng qimmatli narsa." },
    ],
    insight: "Magʻlubiyat hukm emas, maʼlumot: u nimani oʻrganish kerakligini koʻrsatadi.",
    basis: "Kapablanka, «Shaxmat asoslari» (1921); Abdusattorov, 2025–2026. Suhbat oʻylab topilgan, faktlar haqiqiy.",
  },
  fear: {
    title: "Xato qilishdan qoʻrqaman",
    hook: "Dilshodning partiya oldidan qoʻllari titraydi. Murabbiy unga nima dedi?",
    lines: [
      { who: "Dilshod", text: "Partiya oldidan qoʻllarim titraydi. Agar xato qilsam-chi?" },
      {
        who: "Murabbiy",
        text: "Jahon chempioni Mixail Tal nima degan, bilasanmi? «Men oddiy haqiqatni tushundim: faqat men emas, raqibim ham hayajonlanyapti».",
      },
      { who: "Dilshod", text: "Demak, u ham qoʻrqarkan?" },
      {
        who: "Murabbiy",
        text: "Har taxta oldida ikki hayajonlangan odam oʻtiradi. Buni tushungan kishi qoʻrquv haqida emas, pozitsiya haqida oʻylaydi.",
      },
      { who: "Dilshod", text: "Unda men unga qiyinroq masala qoʻyib koʻraman." },
    ],
    insight: "Qoʻrquv — oʻyinning oddiy qismi, raqibda ham shunday.",
    basis:
      "Talning soʻzlari — «Mixail Talning hayoti va partiyalari» kitobidan (Vikiiqtibosga koʻra); suhbat oʻylab topilgan.",
  },
  sacrifice: {
    title: "Nega ruxni berdi?",
    hook: "Aliya akasi nega ruxni berganini tushunmadi. U kalit misolida tushuntirdi.",
    lines: [
      { who: "Aliya", text: "Sen ruxni berib yubording! Nega?" },
      {
        who: "Aka",
        text: "Bu — qurbonlik. Kichikroq narsani berasan, kattaroq narsa olish uchun — kalit uchun tanga berganday.",
      },
      { who: "Aliya", text: "Agar bajarilmasa-chi?" },
      {
        who: "Aka",
        text: "Unda bu xato edi. Shuning uchun qurbonlikdan oldin hisoblashadi. Mashhur 1851-yilgi «Oʻlmas partiya»: Anderssen filni, ikkala ruxni va farzinni berdi — va yengil donalar bilan mot qoʻydi.",
      },
      { who: "Aliya", text: "Kompyuterlar ham qurbonlik qiladimi?" },
      {
        who: "Aka",
        text: "Kasparov yozgan: kompyuter qurbonlik haqida oʻylamaydi — u shunchaki eng yaxshi ishlaydigan narsani oʻynaydi. «Qurbonlik» — bizning soʻzimiz.",
      },
    ],
    insight: "Qurbonlik — ayirboshlash: hozir kichigini beramiz, keyin kattasini olamiz.",
    basis: "«Oʻlmas partiya» (London, 1851); Kasparovning «Game Changer» soʻzboshisi. Suhbat oʻylab topilgan.",
  },
  computer: {
    title: "Kompyuter kuchli boʻlsa, nega oʻynash kerak?",
    hook: "Bobur onasidan soʻradi: kompyuter hammani yutsa, nega unga oʻrganish kerak?",
    lines: [
      { who: "Bobur", text: "Kompyuter har qanday chempiondan yaxshi oʻynaydi. Nega men oʻrganishim kerak?" },
      {
        who: "Ona",
        text: "Kasparov payqagan: «kuchsiz inson, qoʻshimcha mashina va yaxshiroq jarayon» kuchli kompyuterning oʻzidan kuchliroq ekan.",
      },
      { who: "Bobur", text: "Demak, kompyuter bilan doʻst boʻlsa boʻladimi?" },
      {
        who: "Ona",
        text: "Boʻladi. Lekin buning uchun oʻzing oʻylashing kerak: tushunmagan kishi mashinaga yaxshi savol bera olmaydi.",
      },
    ],
    insight: "Kompyuter — hamroh, raqib emas. Oʻylash baribir senga qoladi.",
    basis: "Kasparov, The New York Review of Books, 2010. Suhbat oʻylab topilgan.",
  },
  "not-war": {
    title: "Shaxmat — urushmi?",
    hook: "Donalar urushadi. Ammo oʻyinchilar-chi?",
    lines: [
      { who: "Diyor", text: "Donalar urushadi, demak shaxmat — urushmi?" },
      {
        who: "Ustoz",
        text: "Donalar — qoʻshin. Ammo oʻyinchilar-chi? Franklin maslahat beradi: maqtanma, raqibni shoshirma, u yutqazsa — taskin ber.",
      },
      { who: "Diyor", text: "Raqib boʻlsak ham mehribon boʻlsa boʻladimi?" },
      {
        who: "Ustoz",
        text: "2025-yilda bir turnirda Tin Szinyaoning raqibi tirbandlik tufayli kechikdi. Tin gʻalabani talab qilishi mumkin edi, lekin oʻynashga ruxsat berdi. 2026-yilda FIDE unga halol oʻyin sovrinini topshirdi.",
      },
      { who: "Diyor", text: "Demak, donalar urushadi, biz esa birga oʻynaymiz." },
    ],
    insight: "Donalar urushadi, oʻyinchilar esa hamkor: hurmatsiz yaxshi partiya boʻlmaydi.",
    basis: "Franklin, «Shaxmat axloqi» (1786); FIDE Gligorich sovrini, 2026. Suhbat oʻylab topilgan, faktlar haqiqiy.",
  },
  patience: {
    title: "Men juda tez yuraman",
    hook: "Diyor darrov yuradi. Murabbiy unga Franklin va Kapablankani eslatdi.",
    lines: [
      { who: "Diyor", text: "Men darrov yuraman. Nega uzoq oʻylash kerak?" },
      {
        who: "Murabbiy",
        text: "Franklin yozgan: «Ehtiyotkorlik — yurishlarimizni juda shoshib qilmaslik». Uch marta nafas olguncha oʻylab koʻr.",
      },
      { who: "Diyor", text: "Lekin Kapablanka ham tez yurgan-ku!" },
      {
        who: "Murabbiy",
        text: "Alyoxin uning «shaxmatni hayratlanarli tez tushunishi» haqida yozgan. Uning tezligi bilimdan, seniki esa hozircha tezroq boʻlish istagidan. Tanaffusdan boshla — tezlik oʻzi keladi.",
      },
    ],
    insight: "Tezlik bilimdan keladi, shoshqaloqlikdan emas.",
    basis:
      "Franklin, «Shaxmat axloqi» (1786); Alyoxinning Kapablanka haqidagi soʻzlari (Vikipediyaga koʻra). Suhbat oʻylab topilgan.",
  },
  champion: {
    title: "Baribir chempion boʻlolmayman",
    hook: "Malika murabbiyidan soʻradi: chempion boʻlmasang, nega oʻynash kerak?",
    lines: [
      { who: "Malika", text: "Men baribir chempion boʻlolmayman. Menga shaxmat nega kerak?" },
      {
        who: "Murabbiy",
        text: "Franklin yaxshi oʻynagan, lekin eng yaxshi emas edi — uning shaxmat haqidagi essesini esa 240 yildan keyin ham oʻqishmoqda.",
      },
      {
        who: "Murabbiy",
        text: "Grossmeyster Boris Gelfand shunday deydi: «Faqat bir qismi kasbiy oʻynaydi, qolganlari esa reja tuza olish mahoratini, oʻylash odatini, oʻz qilmishiga javob berishni va raqibni hurmat qilishni egallaydi».",
      },
      { who: "Malika", text: "Demak, shaxmat faqat unvonlar haqida emas ekan." },
      { who: "Murabbiy", text: "U sen qanday inson boʻlib borayotganing haqida." },
    ],
    insight:
      "Shaxmat faqat chempionlar uchun emas: u oʻylashni, reja tuzishni va boshqalarni hurmat qilishni oʻrgatadi.",
    basis: "Franklin, «Shaxmat axloqi» (1786); Gelfand (Ian Rojers bayoni, chess.com, 2016). Suhbat oʻylab topilgan.",
  },
  blunder: {
    title: "Chempionlar ham xato qiladi",
    hook: "Bobur bir yurishlik motni sezmay qoldi. Onasi buni jahon chempioni ham qilganini koʻrsatdi.",
    lines: [
      { who: "Bobur", text: "Bir yurishlik motni sezmay qoldim! Men naqadar tentakman." },
      {
        who: "Ona",
        text: "2006-yilda jahon chempioni Vladimir Kramnik Deep Fritz dasturi bilan matchda bir yurishlik motni sezmadi — va matchni yutqazdi.",
      },
      { who: "Bobur", text: "Jahon chempioni? U nima dedi?" },
      {
        who: "Ona",
        text: "Bu «qandaydir tutilish edi: men bu variantni koʻp marta hisoblagan edim». Xato unga nimani sezmaganini koʻrsatdi, tentakligini emas.",
      },
      { who: "Bobur", text: "Unda men ham qarayman: nimani sezmadim?" },
    ],
    insight: "Xato — nimani sezmaganing haqidagi maʼlumot, senga berilgan baho emas.",
    basis:
      "Kramnik — Deep Fritz matchi (Bonn, 2006), matbuot anjumanidagi soʻzlari (ChessBase). Suhbat oʻylab topilgan.",
  },
};

export const newViewsUz: Uz<typeof NEW_VIEWS> = {
  "learn-from-loss": {
    myth: "Shaxmat — gʻalaba haqida.",
    truth: "Shaxmat — oʻrganish haqida, magʻlubiyatlar esa eng yaxshi oʻrgatadi.",
    proof: [
      "Kapablanka darslikda yutqazgan partiyalarini ham chop etgan.",
      "Franklin: «oʻzingni yengganingdan quvon».",
      "Abdusattorov oxirgi oʻrinni egalladi, toʻrt oydan keyin esa turnirda yutdi.",
    ],
  },
  practice: {
    myth: "Faqat daholar oʻynaydi.",
    truth: "Mashq juda koʻp narsani hal qiladi, lekin odamlar turli tezlikda oʻrganadi.",
    proof: [
      "Polgarlar oilasida bu uddalandi: uch opa-singil kichikligidan oʻrganib, uchalasi ham kuchli shaxmatchi boʻldi.",
      "Tadqiqotchilar shaxmatchilarni oʻrgandi: baʼzi ustalarga taxminan uch ming soat mashq yetdi, boshqalarga yigirma mingdan ortiq.",
    ],
    note: "Qizlar uchta edi, solishtirish guruhi yoʻq edi: bu nima mumkinligini koʻrsatadi, hamma uchun shunday boʻlishini emas. Mashq soatlari boʻyicha tadqiqotlarda 25 ming soat ham ustalikka yetmaganlar bor. Biz «daho boʻlish»ni vaʼda qilmaymiz.",
  },
  smarter: {
    myth: "Shaxmatning oʻzi aqlli qiladi.",
    truth: "Halol javob: isbotlar hozircha yoʻq — lekin baribir oʻynash yaxshi.",
    proof: [
      "2016-yilda Angliyada yuzga yaqin maktabda shaxmat darslari sinab koʻrildi: 9–10 yoshli bolalar uchun 25–30 soat. Bir yildan keyin matematika, oʻqish va tabiatshunoslik imtihonlarida farq topilmadi.",
      "Tadqiqotlarning katta taqqoslashi kichik ustunlikni koʻrsatdi, lekin koʻpchiligida nazorat guruhlari yoʻq edi.",
      "Ammo oʻqituvchilar va bolalarning koʻpchiligi mamnun boʻldi, koʻpi bir yildan keyin ham oʻynashda davom etdi.",
    ],
    note: "Shaxmat oʻz-oʻzidan ajoyib: oʻyin sifatida, sabr mashqi va muloqot sifatida. Lekin undan matematikadan tez baho kutish kerak emas. Bu band ataylab xotirjam va vaʼdasiz yozilgan.",
  },
  "mistake-info": {
    myth: "Xato — uyat.",
    truth: "Xato — nimani sezmaganing haqidagi maʼlumot.",
    proof: [
      "2006-yilda jahon chempioni Kramnik bir yurishlik motni sezmadi.",
      "Lasker «xatolarni tan ola olmaslik»ni oʻlik odatlardan biri deb hisoblagan.",
    ],
  },
  "computer-chess": {
    myth: "Kompyuter shaxmatni oʻldirdi.",
    truth: "Shaxmat avvalgidan ham tirik: odamlar kompyuterlardan oʻrganadi va ular bilan birga oʻynaydi.",
    proof: [
      "2026-yil sentyabrda Samarqandda deyarli ikki ming kishi oʻynadi.",
      "Kasparov AlphaZeroni «teleskop» deb atadi: odamlar oʻrniga emas, uzoqroqqa qarash uchun.",
      "2005-yilgi turnirda uchta kompyuter bilan mohirona ishlagan havaskorlar gʻolib chiqdi.",
    ],
  },
  sacrifice: {
    myth: "Donani qurbon qilish — yoʻqotish.",
    truth: "Qurbonlik — ayirboshlash: kattaroq narsa uchun kichigini beraman.",
    proof: [
      "«Oʻlmas partiya»da (1851) Anderssen filni, ikki ruxni va farzinni berdi — va yengil donalar bilan yutdi.",
      "AlphaZero faol donalar uchun piyodalarni berishni yaxshi koʻrardi. Lekin Kasparov payqagan: mashina «shunchaki eng yaxshi ishlaydigan narsani oʻynaydi» — «qurbonlik» bizning soʻzimiz.",
    ],
  },
  "pawn-hero": {
    myth: "Piyoda — eng zaif dona.",
    truth: "Piyoda — niqobdagi qahramon: chetga yetsa — farzin boʻladi.",
    proof: [
      "Qoidaga koʻra, oxirgi qatorga yetgan piyoda farzin, rux, fil yoki otga aylanadi.",
      "Kapablanka: bitta piyodani yutish koʻpincha gʻalaba uchun yetadi.",
      "Temurning «katta shaxmati»da har bir piyodaning oʻz taqdiri bor edi.",
    ],
  },
  conversation: {
    myth: "Shaxmat — oʻz yurishlaringni qilish.",
    truth: "Shaxmat — suhbat: har bir yurish raqibga savol.",
    proof: [
      "Franklin yurishdan oldin soʻrashni maslahat beradi: «raqib bundan nima qila oladi?»",
      "Lasker aynan qarshisida oʻtirgan kishi uchun eng noqulay yurishni izlagan.",
      "1999-yilda minglab odam muloqot qilib, Kasparovga qarshi birga oʻynadi.",
    ],
  },
  huge: {
    myth: "Shaxmat — kichik oʻyin: atigi 64 katak.",
    truth: "Shaxmat tasavvur qilib boʻlmas darajada katta.",
    proof: [
      "Har ikki tomon ikkitadan yurish qilgandan keyin 197 281 xil partiya boʻlishi mumkin.",
      "Mumkin boʻlgan partiyalar soni taxminan 10 ning 120-darajasi deb baholanadi — koʻrinadigan Olamdagi atomlardan (taxminan 10 ning 80-darajasi) koʻp.",
      "Bir-birini urmaydigan sakkizta farzinni 92 xil usulda joylashtirish mumkin.",
    ],
    note: "10^120 bahosi — Klod Shennonning (1950) quyi bahosi.",
  },
  partners: {
    myth: "Shaxmat — urush, mehribonlik esa zaiflik.",
    truth: "Donalar urushadi, oʻyinchilar esa hamkor.",
    proof: [
      "Franklin: maqtanma, shoshirma, yutqazganga taskin ber — shunda hurmatga erishasan.",
      "«Vera Menchik klubi» haqidagi hazil kuch belgisiga aylantirildi.",
      "FIDEning 2026-yilgi halol oʻyin sovrinini raqibga yon bergan oʻyinchilar oldi.",
    ],
  },
};
