import type { Uz } from "../../localize";
import type { DID_YOU_KNOW, DILARAM, PIECE_NAMES_RU, RIDDLES, SAGES, SECRETS, TURK_OPTIONS } from "../secrets";

/** «Shaxmat sirlari» — по-узбекски. Крючок и история читаются вслух, поэтому фразы короткие и «сказочные». */
export const secretsUz: Uz<typeof SECRETS> = {
  sissa: {
    hook: "Donishmand podshodan birinchi katak uchun «atigi» bitta bugʻdoy doni soʻradi. Nega podsho bu haqni toʻlay olmadi?",
    title: "Podshoni xonavayron qilgan don",
    when: "Hindiston · afsona",
    story: [
      "Shaxmat podshoga shu qadar yoqib qolibdiki, u oʻyinni oʻylab topgan donishmand Sissani saroyga chaqirtiribdi-da: «Nima tilasang, soʻra!» — debdi. Donishmand bugʻdoy soʻrabdi: taxtaning birinchi katagi uchun bitta don, ikkinchisi uchun ikkita, uchinchisi uchun toʻrtta — va shu tariqa har safar ikki baravar koʻpaytirib, oltmish toʻrtinchi katakkacha.",
      "Podsho kulib yuboribdi: «Buncha kamtar tilak!» Ammo xazinachilar tun boʻyi hisob-kitob qilib, rangi quv oʻchgan holda qaytib kelishibdi: bunchalik bugʻdoy na podshoning omborlarida, na butun mamlakatda, na butun Yer yuzida bor ekan.",
      "Quyidagi taxtaning kataklarini bosib koʻr — son qanchalik tez oʻsishini oʻz koʻzing bilan koʻrasan. Yigirmanchi katakka yetganda donlar allaqachon milliondan oshib ketadi, oxirgi katakda esa dunyodagi barcha sohillardagi qum zarralaridan ham koʻp boʻladi.",
    ],
    deeper:
      "Hammasi boʻlib 18 446 744 073 709 551 615 ta don chiqadi. Bu sonni birinchi boʻlib XI asrda xorazmlik olim Abu Rayhon Beruniy aniq hisoblab chiqqan — va bunchalik bugʻdoyni ming yillar davomida ham yigʻib boʻlmasligini koʻrsatib bergan.",
    link: { label: "Taxtadagi boshqa matematik sirlar" },
  },
  envoy: {
    hook: "Hind podshosi Eronga taxta bilan donalarni yubordi — ammo qoidalarini aytmadi. Bu oʻyinning sirini kim ochadi?",
    title: "Hind elchisining jumbogʻi",
    when: "«Shohnoma» · Eron, taxminan 1010-yil — VI asr voqealari haqida",
    story: [
      "Shoir Firdavsiy hikoya qiladi: hind rojasi Eron shohi Xusravga qimmatbaho sovgʻalar va shaxmat taxtasini yuboribdi. Yoniga esa bir shart ham qoʻshibdi: «Agar donishmandlaringiz bu oʻyinning qoidalarini topsa, men sizga oʻlpon toʻlayman. Topolmasa — oʻlponni siz toʻlaysiz».",
      "Donishmand Buzurgmehr kechayu kunduz donalarga tikilib oʻtiribdi va nihoyat tushunibdi: bu — ikki qoʻshin! Oʻrtada shoh va uning maslahatchisi, chetlarda fillar, otliqlar va jang aravalari, oldinda esa piyoda askarlar. U har bir donaning yurishini birma-bir aytib beribdi — va hind elchisi yengilganini tan olibdi.",
      "Bunga javoban Buzurgmehr yangi oʻyin — nardni oʻylab topibdi va uni Hindistonga joʻnatibdi. U yerda uning qoidalarini hech kim topa olmabdi. Qani, sen ham donishmanddek donani yurishlariga qarab topib koʻr-chi!",
    ],
    deeper:
      "«Shohnoma», yaʼni «Shohlar kitobi» — bir muallif yozgan eng uzun doston: unda 50 000 ga yaqin bayt bor. Firdavsiy uni 30 yildan ortiq yozgan. Dostonda shaxmat haqida ikki hikoya bor: mana shu va oʻyin qanday oʻylab topilgani haqidagisi.",
  },
  "gav-talhand": {
    hook: "Nega shaxmatda shohni oʻldirib boʻlmaydi, faqat qoʻlga tushirish mumkin?",
    title: "Shaxmat qanday paydo boʻlgan: ikki aka-uka haqida rivoyat",
    when: "«Shohnoma» · Hindiston haqida afsona",
    story: [
      "Hind malikasining ikki oʻgʻli bor ekan — Gav va Talxand. Ular taxt talashib qolishibdi va aka-ukaning qoʻshinlari jangda toʻqnashibdi. Gav askarlariga Talxandga tegmaslikni buyuribdi. Lekin Talxand baribir halok boʻlibdi: u har tomondan qurshovda, oʻz fili ustida yolgʻiz qolgan, tanasida esa birorta ham yara yoʻq ekan.",
      "Malika oʻgʻlini hech kim oʻldirmaganiga ishonmabdi va hammasi qanday boʻlganini koʻrsatishni talab qilibdi. Shunda donishmandlar taxta va ikki qoʻshinni oʻyib yasashibdi-da, malikaning koʻz oldida jangni qaytadan koʻrsatib berishibdi. Malika koʻribdiki: shoh oʻldirilmagan — shunchaki uning qochadigan joyi qolmagan.",
      "Oʻshandan beri shaxmatda shohni urib olishmaydi. Agar uning qochadigan joyi qolmasa va uni hech kim himoya qila olmasa — bu mot, partiya tugadi.",
    ],
    deeper:
      "«Shoh mot» — forscha «shoh» (podsho) va «mot» (chorasiz, dong qotib qolgan) soʻzlaridan. «Shoh oʻldi» degan tarjima esa aniq emas: qoidaga koʻra shohga hech kim tegmaydi — uni qurshab olishadi, xolos.",
    link: { label: "«Shoh» darajasi: shoh berish, mot va pat" },
  },
  khwarizmi: {
    hook: "Taxtamizdagi robot bilan 1200 yil oldin yashagan xorazmlik olimni nima bogʻlaydi?",
    title: "Al-Xorazmiy va «algoritm» soʻzi",
    when: "Xorazm — Bagʻdod · IX asr",
    story: [
      "Muhammad ibn Muso al-Xorazmiy Xorazmda tugʻilgan va Bagʻdoddagi Donishmandlar uyida ishlagan. Uning «Al-jabr» kitobi algebra faniga nom bergan. Lotin tilida kitob koʻchirgan kotiblar esa olimning ismini «algoritm» soʻziga aylantirib yuborishgan. Hozir javobga olib boradigan aniq qadamlar ketma-ketligini shunday atashadi.",
      "Bizning robot ham aynan shunday yuradi — algoritm boʻyicha. U oʻzining barcha yurishlarini, har biriga raqib qanday javob qaytarishini birma-bir koʻrib chiqadi, donalar va kataklar uchun ball hisoblaydi va eng yaxshisini tanlaydi. Na sehr, na omad — faqat qadamlar, xuddi al-Xorazmiy oʻrgatganidek.",
      "Xuddi oʻsha Bagʻdodda, xuddi oʻsha yillarda shaxmat haqidagi ilk kitoblar ham paydo boʻldi: ularni taxminan 840-yilda usta al-Adliy yozgan. U paytlarda Bagʻdod ham ilm-fanning, ham shaxmatning poytaxti edi.",
    ],
    deeper:
      "Robot «Farzin» bir soniyada oʻn minglab pozitsiyalarni koʻrib chiqadi. Uning algoritmi «alfa-beta» deb ataladi: u allaqachon topilganlaridan aniq yomonroq boʻlgan yurishlarni chetga surib qoʻyadi va shu tufayli toʻrt yurish oldinga qarashga ulguradi.",
    link: { label: "Robot bilan oʻynash" },
  },
  biruni: {
    hook: "Taxtadagi donlarni birinchi boʻlib aniq sanab chiqqan va toʻrt kishilik shaxmatni tasvirlab bergan olim",
    title: "Beruniy: bir taxtada toʻrt qoʻshin",
    when: "Xorazm — Hindiston · XI asr",
    story: [
      "Abu Rayhon Beruniy Xorazmda tugʻilgan va koʻp yillar Hindistonda yashagan. Hindiston haqidagi kitobida u oʻsha yerning shaxmatini tasvirlab bergan: taxta atrofida toʻrt oʻyinchi oʻtirar, har birining oʻz qoʻshini boʻlar, qaysi dona bilan yurishni esa oʻyin soqqasi hal qilar ekan!",
      "Beruniy birovning gapiga koʻr-koʻrona ishonishni yoqtirmasdi. Donlar haqidagi afsonani eshitgach, u oʻtirib hisoblab koʻrdi: yigirma xonali son chiqdi. Keyin esa bu sonni omborlarga va bugʻdoy togʻlariga aylantirib hisobladi, toki hamma koʻrsin: bunchalik bugʻdoy butun dunyoda yoʻq!",
      "U Yerni oʻlchagan, yulduzlar, qimmatbaho toshlar va dorilar haqida yozgan — shaxmat haqida ham, chunki haqiqiy olimga hamma narsa qiziq.",
    ],
    deeper:
      "Beruniy Yer radiusini bir foizdan ham kam xato bilan hisoblab chiqqan: u togʻ ustida turib, ufqqacha boʻlgan burchakni oʻlchagan. Qoraqalpogʻistondagi bir shahar uning nomi bilan — Beruniy deb ataladi: olim 973-yilda oʻsha yerlarda tugʻilgan.",
    link: { label: "Oʻzbekistonda shaxmat" },
  },
  mamun: {
    hook: "Xalifa dunyoning yarmini boshqargan-u, 64 ta katakka bas kela olmasligini tan olgan",
    title: "Xalifa al-Maʼmunning iqrori",
    when: "Bagʻdod · IX asr",
    story: [
      "Al-Xorazmiy Donishmandlar uyida ishlagan davrdagi xalifa al-Maʼmun shaxmatni jonidan ortiq sevar, lekin oʻzi boʻshroq oʻynardi. Aytishlaricha, u shunday degan ekan: «Gʻalati-ya: men Hind daryosidan Andalusiyagacha boʻlgan dunyoni boshqaraman-u, ikki tirsaklik taxtadagi oʻttiz ikkita donaning uddasidan chiqa olmayman».",
      "Xalifalar saroyiga eng kuchli oʻyinchilar yigʻilardi. Ularni darajalarga ajratishardi — xuddi bugun sportchilarga razryad berganlaridek. Eng yuqori daraja «aliya» deb atalardi. «Aliya»lar ichida eng kuchlisi as-Suliy edi.",
      "Shaxmat hatto hukmdorlarni ham kamtarlikka oʻrgatadi: taxta ustida na unvon, na boylik yordam beradi — faqat oʻz aqling.",
    ],
    deeper:
      "As-Suliydan keyin ham besh yuz yil davomida Sharqda kuchli oʻyinchi haqida: «As-Suliydek oʻynaydi», — deyishardi. Bu eng oliy maqtov edi.",
  },
  suli: {
    hook: "Ming yil davomida hech kim yecha olmagan masala",
    title: "As-Suliy va uning ming yillik jumbogʻi",
    when: "Bagʻdod, X asr — Moskva, 1986-yil",
    story: [
      "Abu Bakr as-Suliy Bagʻdodning eng kuchli shaxmatchisi va shaxmatning birinchi tarixchisi edi: u ustalarning partiyalari va masalalarini yozib borar, kitoblarini esa xalifalarga bagʻishlardi.",
      "Bir pozitsiyani — ikki shoh va ikki farzin — u «hech kim yecha olmaydigan» masala deb atagan. Uni qoʻlyozmadan qoʻlyozmaga koʻchirib yozishardi, ammo yechimini hech kim topa olmasdi.",
      "Faqat 1986-yilda moskvalik grossmeyster Yuriy Averbax bu pozitsiyada qanday yutish mumkinligini topdi. Masala bilan javob oʻrtasida ming yildan ortiq vaqt oʻtgan edi.",
    ],
    deeper:
      "As-Suliy 880–946-yillarda yashagan. Yuriy Averbax 1922-yilda tugʻilib, roppa-rosa yuz yil umr koʻrdi: u dunyodagi eng keksa grossmeyster va shaxmat tarixchisi edi — xuddi as-Suliy kabi.",
  },
  dilaram: {
    hook: "«Ikki ruxingni ber — meni qutqar!» Ortida sevgi qissasi bor masala",
    title: "Dilorom masalasi",
    when: "Eron va arab dunyosi · qadimiy qoʻlyozmalar",
    story: [
      "Afsonada aytilishicha, bir aslzoda oʻyinchi oʻyinga shunchalik berilib ketibdiki, butun boyligini, keyin esa suyukli xotini Diloromni ham tikib qoʻyibdi. Partiya yomon ketayotgan ekan: qoralar mana-mana mot qilay deb turishibdi.",
      "Dilorom parda ortidan taxtaga qarab turgan ekan, birdan: «Ikkala ruxingni ber, lekin meni berma!» — deb qichqirib yuboribdi. Eri taxtaga diqqat bilan tikilibdi va koʻribdiki: avval bitta ruxni, keyin ikkinchisini qurbon qilsa, mot qiladigan oʻzi boʻlar ekan!",
      "Bu masalani ming yil davomida qoʻlyozmadan qoʻlyozmaga koʻchirib kelishgan. Quyida u shatranjning qadimiy qoidalari boʻyicha koʻrsatilgan: «al-fil» deb atalgan fil bir katak oshib sakraydi.",
    ],
    deeper:
      "Shatranjda fil diagonal boʻylab roppa-rosa bitta katak oshib sakrardi, farzin esa bor-yoʻgʻi bir katak yurardi. Shuning uchun qadimiy masalalar hozirgi qoidalarda har doim ham toʻgʻri chiqavermaydi — bu masalani biz eski qoidalar boʻyicha koʻrsatyapmiz.",
  },
  khayyam: {
    hook: "Shoir va matematik butun dunyoni shaxmat taxtasiga oʻxshatgan",
    title: "Umar Xayyom: kecha va kunduz taxtasi",
    when: "Nishopur · XI–XII asrlar",
    story: [
      "Umar Xayyom kim boʻlgan? Matematik — u uchinchi darajali tenglamalarni yechishni uddalagan. Astronom — juda aniq taqvim tuzgan. Shoir — uning ruboiylarini hozirgacha oʻqishadi.",
      "Ruboiylaridan birida u dunyoni shaxmat taxtasiga oʻxshatgan: kun va tun — uning yorugʻ va qorongʻi kataklari, odamlar esa taqdir u yoqdan-bu yoqqa surib, soʻng qutiga solib qoʻyadigan donalar.",
      "Shaxmatchilar u bilan bahslashgan boʻlardi: taxtada donalarni taqdir emas, oʻylay oladigan odam suradi. Lekin oʻxshatish chiroyli — shuning uchun uni toʻqqiz yuz yildan beri eslab kelishadi.",
    ],
    deeper:
      "Xayyomning taqvimi hozirgi grigorian taqvimidan ham aniqroq edi: unda bir kunlik xato faqat bir necha ming yilda yigʻiladi.",
  },
  "ibn-sina": {
    hook: "Masala yechilmay qiynalganlarga buxorolik buyuk tabibning maslahati",
    title: "Ibn Sino: masala yechilmasa, nima qilish kerak",
    when: "Buxoro · X–XI asrlar",
    story: [
      "Abu Ali ibn Sino 980-yilda Buxoro yaqinidagi Afshona qishlogʻida tugʻilgan. Oʻn yoshida u Qurʼonni yoddan bilardi, oʻn olti yoshida esa odamlarni davolardi. Uning «Tib qonunlari» kitobini Yevropa tabiblari olti yuz yil davomida oʻrganishgan.",
      "Oʻz hayoti haqidagi qissasida u qiyin savollar ustida qanday ishlaganini yozib qoldirgan. Agar javob topilmasa, u kech kirguncha masala bilan olishib oʻtirmasdi: masjidga borib namoz oʻqir, keyin uxlashga yotardi — va koʻpincha javob tushida yoki tiniq tongda oʻzi kelardi.",
      "Ibn Sinoning yosh shaxmatchiga maslahati: yurish koʻrinmayaptimi — taxtaga tikilib oʻtiraverma. Biroz chalgʻib ol, yaxshilab uxla, keyin tiniq bosh bilan qaytib kel. Grossmeysterlar ham shunday qilishadi.",
    ],
    deeper:
      "Ibn Sino toʻrt yuzdan ortiq kitob yozgan — tibbiyot, matematika, musiqa va yulduzlar haqida. «Tib qonunlari» besh jilddan iborat boʻlib, Yevropada bosib chiqarilgan ilk tibbiyot darsliklaridan biri edi.",
  },
  turk: {
    hook: "1770-yilda bir mashina Yevropaning eng kuchli oʻyinchilarini yutardi. Qanday qilib? Bu sir yarim asr davomida ochilmadi",
    title: "«Turk» — shaxmat oʻynagan mashina",
    when: "Vena — Parij — Amerika · 1770–1854",
    story: [
      "Ixtirochi Volfgang fon Kempelen imperatritsa Mariya Tereziyaga bir moʻjizani koʻrsatdi: ustiga shaxmat taxtasi oʻrnatilgan katta quti ortida turkcha toʻn kiygan qoʻgʻirchoq oʻtirar va donalarni oʻzi surardi. Kempelen qutining eshikchalarini ochib koʻrsatardi — ichida faqat tishli gʻildiraklar.",
      "«Turk» Yevropa va Amerika boʻylab safar qilib, deyarli hammani yutdi. Rivoyat qilishlaricha, u bilan Napoleonning oʻzi ham oʻynagan: imperator ataylab qoidani buzib yurgan, qoʻgʻirchoq donani joyiga qaytarib qoʻyavergan, uchinchi gal esa taxtadagi hamma donalarni supurib tashlagan.",
      "Sencha, sir nimada edi? Quyida javobni tanla — keyin haqiqatni bilib olasan.",
    ],
    deeper:
      "Haqiqiy shaxmat avtomatini faqat 1912-yilda ispaniyalik Leonardo Torres Kevedo yasadi: uning «El Axedresista»si rux bilan mot qila olardi. 1997-yilda esa Deep Blue kompyuteri jahon chempioni Garri Kasparovni yutdi.",
    link: { label: "Kompyuter chempionni yengadi" },
  },
  adli: {
    hook: "Ot 64 ta katakning hammasini, birortasiga ikki marta qadam bosmay, aylanib chiqa oladimi? Javobni Bagʻdodda 1200 yil oldin bilishgan",
    title: "Otning sayohati",
    when: "Bagʻdod, IX asr — Sankt-Peterburg, XVIII asr",
    story: [
      "Shaxmat haqidagi birinchi kitob muallifi — bagʻdodlik usta al-Adliyning qoʻlyozmalarida otning butun taxtani aylanib chiqadigan yoʻllari saqlanib qolgan. Bunda ot birorta katakka ikki marta qadam bosmaydi.",
      "Toʻqqiz yuz yil oʻtib, xuddi shu masalani Peterburgda buyuk matematik Leonard Eyler oʻrgandi. U bir qoida topdi: avval burchak va chetlarni aylanib chiq, oʻrtasini esa keyinga qoldir.",
      "Quyidagi taxtada oʻzing sinab koʻr. Maslahatni yoqsang, keyingi sakrash uchun eng kam yoʻl qolgan kataklar belgilanadi: ularni birinchi boʻlib aylanib oʻtgan maʼqul. Bu oʻsha Eyler qoidasi — keyinroq uni Varnsdorf aniqlashtirgan.",
    ],
    deeper:
      "Otning yopiq yoʻllari — oxirgi katakdan yana birinchisiga sakrab oʻtsa boʻladiganlari — roppa-rosa 26 534 728 821 064 ta. Ularni faqat 1990-yillarda kompyuterda sanab chiqishgan.",
    link: { label: "«Ot» darajasi" },
  },
  "mad-queen": {
    hook: "Eng kuchli dona bir paytlar eng kuchsizi boʻlgan. 500 yil oldin nima yuz berdi?",
    title: "Telba qirolicha",
    when: "Ispaniya — Italiya · taxminan 1475–1495",
    story: [
      "Ming yil davomida shohning yonida uning maslahatchisi — «farzin» turgan. U diagonal boʻylab atigi bir katak yurar, hatto otdan ham kuchsiz edi. Bilasanmi, sening tilingda bu dona hali ham shunday ataladi — farzin! Har gal «farzin» deganingda, sen ming yillik soʻzni tilga olasan.",
      "XV asr oxirida Ispaniya va Italiyada bu donaga rux bilan filning yurishlarini birga hadya qilishdi. Oʻyin tez va xavfli boʻlib ketdi. Yevropada farzinni «qirolicha» deb atashadi — oʻsha davr odamlari esa yangi oʻyinni «telba qirolicha shaxmati» deb nomlashdi.",
      "Baʼzi tarixchilarning fikricha, dona bu yangi kuchni Kastiliyalik Izabella sharafiga olgan. U Ispaniyani eri bilan teng boshqargan qirolicha edi. Yangi qoidalar yozilgan birinchi kitob esa 1497-yilda Ispaniyada chiqdi.",
    ],
    deeper:
      "Farzin bilan birga filni ham kuchaytirishdi: endi u bir katak oshib sakramay, butun diagonal boʻylab yuradigan boʻldi. Donalar chaqqonlashgach, shohga panoh kerak boʻlib qoldi — shunday qilib rokirovka paydo boʻldi.",
    link: { label: "«Farzin» darajasi" },
  },
  alfonso: {
    hook: "Oʻyinlar kitobini yaratgan qirol: unda masalalar ham, toʻrt kishilik shaxmat ham bor",
    title: "Qirol Alfonsoning «Oʻyinlar kitobi»",
    when: "Ispaniya · 1283-yil",
    story: [
      "Kastiliya qiroli Alfonso X Donishmand «Oʻyinlar kitobi»ni yozishni buyurdi: unda shaxmat, nard va soqqa haqida hikoya qilinadi. Kitobda yuz ellikka yaqin surat bor: taxtalar atrofida erkaklar va ayollar, bolalar va qariyalar, nasroniylar va musulmonlar — hammasi birga oʻtiribdi.",
      "Kitobga yuz uchta shaxmat masalasi kiritilgan — hali farzin kuchsiz boʻlgan eski qoidalar boʻyicha. Yana gʻaroyib bir turi ham bor — «Toʻrt fasl»: toʻrt oʻyinchi, toʻrt qoʻshin, toʻrt rang.",
      "Kitobga yetti yuz yildan oshdi, lekin u hanuz butun: Madrid yaqinidagi Eskorial kutubxonasida saqlanadi.",
    ],
    link: { label: "Bizning masalalar — yangi qoidalar boʻyicha" },
  },
  sages: {
    hook: "Donishmandlarning yosh shaxmatchiga beshta maslahati",
    title: "Donishmandlar maslahati",
    when: "Xorazm, Buxoro, Bagʻdod, Parij",
    story: [
      "Bu insonlar shaxmatdan darslik yozishmagan. Lekin ularning qanday fikrlagani va ishlagani taxta ustida yurishlarni bilishdan kam yordam bermaydi.",
    ],
  },
};

export const sagesUz: Uz<typeof SAGES> = [
  {
    name: "Ibn Sino",
    where: "Buxoro, X–XI asrlar",
    fact: "Masala yechilmay qolsa, u masjidga borar, keyin uxlardi — javob esa ertalab oʻzi kelardi.",
    advice: "Qiynaldingmi? Biroz chalgʻib ol, keyin tiniq bosh bilan qaytib kel. Yurish albatta topiladi.",
  },
  {
    name: "Abu Rayhon Beruniy",
    where: "Xorazm, X–XI asrlar",
    fact: "Donlar haqidagi afsonaga shunchaki ishonib qoʻya qolmadi — oʻtirib, hisoblab chiqdi.",
    advice: "Yurish yaxshidek tuyulyaptimi? Shoshilib ishonma — raqib qanday javob berishini hisoblab koʻr.",
  },
  {
    name: "Muhammad al-Xorazmiy",
    where: "Xorazm — Bagʻdod, IX asr",
    fact: "Masalalarni qadamma-qadam yechishni oʻylab topdi — «algoritm» soʻzi shunday tugʻildi.",
    advice: "Katta masalani qadamlarga boʻl: raqib nimaga tahdid qilyapti, men nima qila olaman, keyin nima boʻladi.",
  },
  {
    name: "As-Suliy",
    where: "Bagʻdod, X asr",
    fact: "Ustalarning partiyalarini birinchi boʻlib yozib bora boshladi — uning kitoblaridan yuzlab yillar davomida oʻrganishdi.",
    advice: "Partiyalaringni kundalikka yozib bor: yozib qoʻyilgan xato boshqa takrorlanmaydi.",
  },
  {
    name: "Filidor",
    where: "Parij, XVIII asr",
    fact: "Birinchi boʻlib shunday deb yozdi: partiyani faqat kuchli donalar emas, piyodalar ham hal qiladi.",
    advice: "Piyodalarni asra va kuzat: har biri farzinga aylanishi mumkin — seniki ham, raqibniki ham.",
  },
];

export const riddlesUz: Uz<typeof RIDDLES> = [
  {
    text: "«L» harfidek yuraman, hammaning ustidan sakrayman, qanday yursam — xuddi shunday uraman.",
    options: ["Ot", "Fil", "Rux", "Piyoda"],
    answer: "Ot",
    why: "Donalar ustidan faqat ot sakrab oʻta oladi — oʻzinikidan ham, raqibnikidan ham.",
  },
  {
    text: "Umrim boʻyi faqat bir xil rangdagi kataklarda yuraman.",
    options: ["Shoh", "Fil", "Farzin", "Ot"],
    answer: "Fil",
    why: "Fil diagonal boʻylab yuradi, diagonal esa doim bir xil rangda boʻladi.",
  },
  {
    text: "Faqat oldinga yuraman, urganimda esa qiya uraman. Chetga yetib borsam — kim boʻlishni xohlasam, oʻsha boʻlaman.",
    options: ["Piyoda", "Rux", "Ot", "Shoh"],
    answer: "Piyoda",
    why: "Piyoda orqaga yurmaydi, oxirgi gorizontalga yetganda esa boshqa donaga aylanadi.",
  },
  {
    text: "Eng kuchli donaman — lekin ming yil oldin eng kuchsizi edim.",
    options: ["Rux", "Farzin", "Fil", "Shoh"],
    answer: "Farzin",
    why: "Shatranjda farzin diagonal boʻylab bor-yoʻgʻi bir katak yurardi. Hozirgi kuchini u taxminan 1475-yilda oldi.",
  },
  {
    text: "Meni urib olib boʻlmaydi — lekin qoʻlga tushirsa boʻladi.",
    options: ["Shoh", "Farzin", "Piyoda", "Rux"],
    answer: "Shoh",
    why: "Shohni taxtadan olib tashlashmaydi: uning qochadigan joyi qolmasa, mot eʼlon qilinadi.",
  },
  {
    text: "Toʻgʻri chiziqlar boʻylab yuraman, shoh bilan birga esa alohida bir yurish qila olaman.",
    options: ["Fil", "Ot", "Rux", "Farzin"],
    answer: "Rux",
    why: "Rux vertikal va gorizontal boʻylab yuradi, shoh bilan birga esa rokirovka qiladi.",
  },
  {
    text: "Meni shohga eʼlon qilishadi — shunda u darhol oʻzini qutqarishi shart.",
    options: ["Mot", "Shoh", "Pat", "Vilka"],
    answer: "Shoh",
    why: "Shoh berish — bu shohga hujum. Undan albatta himoyalanish kerak: shohni boshqa katakka olib qochish, oʻrtaga dona qoʻyib toʻsish yoki hujum qilayotgan donani urib olish mumkin.",
  },
  {
    text: "Yurish yoʻq, shoh ham berilmagan — natija esa durang.",
    options: ["Mot", "Shoh", "Pat", "Rokirovka"],
    answer: "Pat",
    why: "Pat — oʻyinchining qoidaga mos birorta ham yurishi qolmagan, shohiga esa shoh berilmagan holat. Partiya durang bilan tugaydi.",
  },
];

export const didYouKnowUz: Uz<typeof DID_YOU_KNOW> = [
  { q: "Shaxmat taxtasida nechta katak bor?", a: "64 ta. Turli oʻlchamdagi kvadratlar esa — 204 ta!" },
  { q: "Qaysi dona boshqa donalar ustidan sakray oladi?", a: "Faqat ot." },
  {
    q: "Ming yil oldin farzinni qanday atashgan?",
    a: "Xuddi shunday — farzin, yaʼni «maslahatchi». Sening tilingda bu nom hali ham yashayapti!",
  },
  { q: "Eng qisqa partiya necha yurishdan iborat?", a: "Ikki yurishdan. Buni «ahmoqona mot» deyishadi." },
  { q: "Taxtadagi donlarni birinchi boʻlib kim aniq sanab chiqqan?", a: "Xorazmlik Abu Rayhon Beruniy, XI asrda." },
  { q: "«Algoritm» soʻzi qayerdan kelib chiqqan?", a: "Olim Muhammad al-Xorazmiyning ismidan." },
  { q: "«Shoh mot» nimani anglatadi?", a: "Forschada «shoh chorasiz qoldi» degani." },
  {
    q: "Afrosiyobdan topilgan shaxmat donalariga necha yil boʻldi?",
    a: "1200 yildan ortiq — ular VIII asrga oid.",
  },
  {
    q: "Hammasi boʻlib nechta jahon chempioni boʻlgan?",
    a: "Oʻn sakkizta. Birinchisi — Steynits, hozirgisi — Gukesh.",
  },
  { q: "Eng yosh jahon chempioni kim?", a: "Gukesh Dommaraju — 18 yoshida." },
  { q: "Kim eng uzoq vaqt jahon chempioni boʻlgan?", a: "Emanuil Lasker — 27 yil." },
  {
    q: "8 ta farzinni bir-birini urmaydigan qilib necha xil usulda joylashtirish mumkin?",
    a: "Roppa-rosa 92 xil usulda.",
  },
  {
    q: "1770-yilda «Turk» mashinasi qanday qilib shaxmat oʻynagan?",
    a: "Qutining ichida tirik shaxmatchi oʻtirgan.",
  },
  {
    q: "Kompyuter jahon chempionini qaysi yili yutgan?",
    a: "1997-yilda: Deep Blue Kasparovni yengdi.",
  },
  { q: "Shaxmat qayerda oʻylab topilgan?", a: "Hindistonda, taxminan 1500 yil oldin." },
  {
    q: "Oqlar birinchi yurishni necha xil qilishi mumkin?",
    a: "Yigirma xil: 16 tasi — piyodalar bilan, 4 tasi — otlar bilan.",
  },
  {
    q: "Jahon chempionlaridan qaysi biri matematika oʻqituvchisi boʻlib ishlagan?",
    a: "Niderlandiyalik Maks Eyve.",
  },
  { q: "Pat nima?", a: "Durang: yurish yoʻq, shoh ham berilmagan." },
  { q: "Shaxmat haqidagi birinchi kitobni kim yozgan?", a: "Al-Adliy, Bagʻdodda, taxminan 840-yilda." },
  { q: "Oʻzbekcha «rux» soʻzi qayerdan kelgan?", a: "Forscha «rux» soʻzidan — bu jang aravasi degani." },
  {
    q: "Ot turgan katagi bilan bir xil rangdagi katakka hujum qila oladimi?",
    a: "Yoʻq: ot har yurishda katak rangini almashtiradi.",
  },
  {
    q: "Koinotda kim shaxmat oʻynagan?",
    a: "1970-yilda «Soyuz-9» ekipaji — Yerdagilar bilan!",
  },
  { q: "Dunyoda qaysi birinchi yurish eng mashhur?", a: "1.e4 — shoh oldidagi piyoda ikki katak yuradi." },
  {
    q: "Eronda bu oʻyin qanday atalgan?",
    a: "Shatranj. Oʻzbekcha «shaxmat» ham, ruscha «shaxmati» ham shundan kelib chiqqan.",
  },
  {
    q: "Otning butun taxta boʻylab nechta yopiq yoʻli bor?",
    a: "26 trilliondan ortiq: 26 534 728 821 064 ta.",
  },
  {
    q: "Oʻzbekistonlik qaysi shaxmatchi jahon chempioni boʻlgan?",
    a: "Rustam Qosimjonov — 2004-yilgi FIDE jahon chempioni.",
  },
];

/** Кадры задачи Дилярам: ходы — фигурками, клетки — как есть. */
export const dilaramUz: Uz<typeof DILARAM> = [
  {
    text: "Afsonaga koʻra, oqlar yutqazib turibdi. Lekin yurish navbati oqlarda — va Dilorom shivirlaydi: «Ikkala ruxingni ham ber!»",
  },
  { text: "1. ♖h8+! Birinchi rux oʻzini zarba ostiga tashlaydi." },
  { text: "Shoh uni urib oladi — boshqa iloji yoʻq." },
  { text: "2. ♗f5+ — fil otning ustidan sakraydi (eski qoidalar boʻyicha!) va h1 dagi rux ochiq shoh beradi." },
  { text: "Yagona yurish — g8 ga." },
  { text: "3. ♖h8+! Ikkinchi rux ham — oʻsha yerga." },
  { text: "Shoh yana urib oladi. Oqlarda endi rux qolmadi." },
  { text: "4. g7+ — piyoda shoh beradi. Uni urib boʻlmaydi: f6 dagi piyoda himoya qilyapti." },
  { text: "Shohga faqat g8 qoldi." },
  { text: "5. ♘h6 — mot! h7 ni fil nazorat qiladi, f8 va h8 ni — piyoda. Dilorom qutqarildi!" },
];

export const pieceNamesUz: Uz<typeof PIECE_NAMES_RU> = {
  n: "Ot",
  b: "Fil",
  r: "Rux",
  q: "Farzin",
  k: "Shoh",
  p: "Piyoda",
};

export const turkOptionsUz: Uz<typeof TURK_OPTIONS> = [
  { text: "Mohirona yasalgan prujina va gʻildiraklar" },
  { text: "Quti ichida shaxmatchi yashiringan edi" },
  { text: "Qoʻgʻirchoq sehrlangan edi" },
];

export const turkRevealUz =
  "Quti ichida kuchli shaxmatchi oʻtirgan. Kempelen eshikchalarni ochganda, u toʻsiq ortiga oʻtib olardi, taxta ostidagi magnitlar esa unga raqib qaysi donalarni surganini koʻrsatib turardi. Sir faqat 1820-yillarda fosh boʻldi, 1854-yilda esa «Turk» Filadelfiyadagi yongʻinda yonib ketdi.";
