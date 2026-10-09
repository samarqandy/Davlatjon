# UI/UX audit: qisqa hisobot

Sana: 2026-10-08. Batafsil roʻyxat (har bir topilma, dalil, yechim, tekshiruv natijasi): [ui-ux-audit-details.md](ui-ux-audit-details.md).

## Qanday oʻtkazildi

- **6 tadqiqotchi** internetdan manbalarni ochib oʻqidi: Duolingo va Duolingo ABC, Khan Academy Kids, Lingokids, Epic!, Sago Mini va Toca Boca, Kahoot, Brilliant, Prodigy, Mathigon, DragonBox, Desmos, Zearn, ChessKid, Chess.com, Lichess, Chessable. Ular bilan birga bola psixologiyasi va oʻqish ilmi (SDT, flow, process praise, ortiqcha rag'batlantirish effekti, kognitiv yuklama), Nielsen Norman Group bolalar UX qoidalari, WCAG 2.2, Buyuk Britaniya bolalar kodeksi va Oʻzbekiston konteksti ham koʻrildi. Tasdiqlanmagan da'volar «unverified» deb belgilandi.
- **8 yoʻnalishda audit**: ilovaning oʻzi telefonda (Pixel 7) va kompyuterda ishga tushirildi, ~220 skrinshot va raqamli oʻlchovlar (tegish maydoni, shrift, sahifa uzunligi) olindi, kod oʻqildi, Playwright bilan jonli holatlar tekshirildi. Ikki shaxs nuqtai nazaridan: Aziz (7 yosh, sekin oʻqiydi) va Dilnoza (10 yosh, tanlov va raqobatni yaxshi koʻradi).
- Har yoʻnalish uchun yechimlar tuzildi (jami 125 ta), keyin **ikki mustaqil skeptik** tekshirdi: biri topilmalarni rad etishga urindi, ikkinchisi yechimlarni kod, yosh mosligi va manipulyatsiya xavfi nuqtai nazaridan baholadi. Natija: 96 topilmadan 37 tasi toʻliq tasdiqlandi, 59 tasi «qisman» (kuchi yoki doirasi aniqlashtirildi), hech biri toʻliq rad etilmadi. 125 yechimdan 107 tasi oʻzgartirildi, 16 tasi tashlandi, 2 tasi oʻzgarishsiz qoldi.

## Eng muhim xulosa

Platforma mazmunan kuchli (yumshoq fikr-mulohaza, birma-bir maslahat, xotirjam ohang), lekin **7 yoshli bola uchun «eshik» baland**: birinchi ishga tushirishda matn devori, 9 ekran uzunlikdagi bosh sahifa, faqat ikonkali tugmalar, 25 daqiqalik dars. Bunga qoʻshimcha: ovozli oʻqish bor, lekin u kichik tugma va faqat topshiriq shartini oʻqiydi (maslahatlar va mashqlar ovozsiz). Mukofotlar esa yordam soʻraganda kichrayadi.

## Haqiqiy xatolar (kod darajasida topildi)

1. **Partiyada taslim boʻlib, keyin «Ortga» bosilsa**, eski magʻlubiyat yozuvi qoladi va keyingi gʻalaba saqlanmaydi (`PlayBoard.tsx`: `undo()` `recorded.current` ni tiklamaydi).
2. **`/chess/history` telefonda 869 px kenglikda** (ekran 412 px), shuning uchun sahifa ikki baravar kichik koʻrinadi. Sabab: mualliflik ro'yxatidagi katak kengligi.
3. **Ota-onalar PIN-kodi himoyasiz**: tiklash soʻzi ekranda yozib qoʻyilgan, qurilmada PIN boʻlmasa bola oʻzi yaratib ota-onani qulflab qoʻyishi mumkin. Bu 4-bosqichdagi vaqt chegarasi uchun toʻsiq: chegarani bola oʻchira olsa, ma'nosi yoʻq.
4. **Rus tilidagi matn bolaga erkak jinsida** murojaat qiladi («Я объяснил решение», «справился», «застрял», «нашёл всё»). Bu egasining qoidasiga zid.
5. **Har bir sovuq ochilishda ~1,8 soniya boʻsh sahifa** (oʻzbekcha va ismli bolalar uchun), aynan sekin telefonda.
6. Yangi ichki sahifalar tepadan emas, oʻrtasidan ochiladi (sarlavha va «Ortga» ekrandan tashqarida).
7. Toʻgʻri javobdan keyingi lahza «xira»: fikr-mulohaza paneli quyi panel tagida qoladi, XP bildirishnomasi «Дальше» tugmasini yopadi.
8. 3-hafta kirish matnlarida xom `**` belgilari.

## 10 mavzu va qaror qilingan yechimlar

1. **Xotirjam eshik**: ikki bosqichli xush kelibsiz (til, yosh, ixtiyoriy ism, har doim faol tugma), telefonda pastki tab paneli, bitta «Keyingi qadam» (hamma joyda bir xil funksiya), qisqa bosh sahifa.
2. **Qisqa sessiyalar va xotirjam toʻxtash**: 3 ta topshiriqdan keyin teng oʻlchamli «Dam olish» / «Yana» tugmalari, hisoblagich yoʻq. Bu keyinchalik 4-bosqichdagi vaqt chegarasining asosi boʻladi.
3. **Fikr-mulohaza**: toʻgʻri javob lahzasi har doim koʻrinadi, yordam bepul.
4. **Quloq birinchi**: 56 px «Tinglash» tugmasi, ovoz holatlari (yuklanmoqda / ijro / xato / oflayn), keyin maslahatlar va mashq savollariga ovoz.
5. **Katta qoʻllar, oʻqiladigan matn**: 44 / 48 / 56 px yagona shkala, 12 px dan kichik matn yoʻq, oʻzbekcha oʻ / gʻ belgilari bitta harf sifatida.
6. **Hammaga mos soʻzlar**: rus matnini jinsga bogʻlanmagan qilib tozalash va uni tekshiradigan test (yangi yozuv yozishdan oldin).
7. **Shaxmat — sayohat**: katta «Davom etish» kartasi, daraja sahifasida taxta birinchi, endshpil — bir vaqtda bitta mavzu.
8. **Oʻyin va masalalar**: tez va xavfsiz chiqish, «Yangi partiya» va «Taslim» tasdiq bilan, maslahat bosqichma-bosqich.
9. **Bosimsiz ma'no**: mukofot yordam soʻraganda kamaymaydi, daraja nomlari, Dilnoza uchun «oldingidan yaxshiroq».
10. **Ishonch va chidamlilik** (4-bosqich uchun poydevor): haqiqiy ota-ona qulfi, doimiy saqlash, tarmoqsiz ishlash.

## Tashlab yuboriladigan gʻoyalar (tadqiqot ularni rad etdi)

Yurakchalar, jonlar, yoʻqotiladigan streak va «0 kun» ekrani; «yordamsiz yechgan» uchun yulduz yoki bonus; sukut boʻyicha avtomatik oʻqish; ochiq reytinglar va peshqadamlar jadvali; bola tomonidan ulashish; aybdorlik bildiruvchi maskot, bildirishnoma va oʻrnatish taklifi; 25 daqiqa kabi oʻylab topilgan vaqtni bolaga koʻrsatish; sirli yashirin osonlashtirish; yangi alifboga oʻtish; qorongʻi rejim; yosh boʻyicha alohida CSS tizimi. Sabablari batafsil faylda.

## Tavsiya etilgan tartib

- **Tezkor gʻalabalar** (har biri S, yarim kundan kam): rus matni tozalash va tekshiruv testi, bo'sh ekran o'rniga CSS splash, ichki sahifa tepadan ochilishi, `/chess/history` kengligi, partiyada taslim/ortga xatosi, «Проверить» tugmasi tushuntirishi, katta «Tinglash» tugmasi, yumshoq daraja qulfi (7 dan 5 mashq), oʻzbekcha oʻ/gʻ, xom `**`, safe-area.
- **Keyingi sprint** (M): yagona tegish shkalasi, natija paneli, bosqichli xush kelibsiz, telefonda pastki tab paneli, «Keyingi qadam» hero, dam olish ekrani, kun oxiri, ovoz holatlari, shaxmat «Davom etish», daraja sahifasi, **haqiqiy ota-ona qulfi (4-bosqich uchun majburiy)**, mukofotlar yordamni jazolamasligi.
- **Katta ishlar** (L): maslahat va mashq ovozlari, raqamli sonlar oʻqi bilan javoblar, 6–8 yosh uchun qisqa matn qatlami, robot hamroh, daraja nomlari, endshpil pleyeri.

## 4-bosqichga ta'siri

- Vaqt chegarasi «Dam olish» ekraniga quriladi: bola hisoblagich yoki «blok» koʻrmaydi, joriy topshiriqni tugatadi va xotirjam kartani koʻradi.
- Avval PIN haqiqiy qulf boʻlishi kerak (3-band). Aks holda chegara va hisobotlar bola uchun ochiq.
- Maqsadlar «taklif», qarz emas: bola ularni toʻldirilgan nuqtalar sifatida koʻradi, muddat va «oʻtkazib yubording» yoʻq.
- Haftalik hisobot daqiqalarni ball sifatida, foizlarni va reytinglarni sanamaydi. Yordam soʻrashni ijobiy odat sifatida yozadi.
- 4-bosqich uchun hozirgi bola oqimi saqlamaydigan ma'lumotlar kerak (topshiriqning median vaqti, maslahat soni). Ularni UX ishlari bilan birga qoʻshish arzon.
- Bir qurilmada bir nechta bola (Aziz va Dilnoza bitta telefonda) masalasini hisobot sxemasidan oldin hal qilish kerak.
- Telegram: faqat ota-ona roziligi bilan, sukut boʻyicha ismsiz, bolaning qoʻlidan hech qanday ulashish yoʻq.

## Auditning cheklovlari (halol)

Tanqidchi agent quyidagilar koʻrilmaganini qayd etdi: ochilgan ota-ona boʻlimi (faqat PIN yaratish ekrani koʻrildi), yutib olingan sertifikat holati, planshet va keng ekranlar, oʻzbekcha holatlarning katta qismi, ovozning sekin tarmoqda real ijrosi, tugallangan partiya tahlili. Ikkinchi bosqich auditi bularni qamrab olishi kerak. Ba'zi raqamli da'volar (masalan, «topshiriqlarning 60% — raqam kiritish») kontentdan sanalgan, bola koʻradigan holatdan emas. Tadqiqotdagi korxona raqamlari (Duolingo'ning +0,38% va +1,7%) kompaniyaning oʻz hisobotlari boʻlib, sabab-oqibat dalili emas. Eng muhimi: **hammasi kompyuterdagi modellashtirish, haqiqiy bolalar bilan sinov emas**. 6–7 yoshli 5 bola bilan qisqa sinov (telefon, 4G) eng foydali keyingi qadam boʻladi.

## Ochiq savollar (egasi hal qiladi)

1. Bir qurilmada bir nechta bola profili boʻlsinmi (4-bosqich hisobotlari va chegaralariga ta'sir qiladi)?
2. «10 yoshgacha reyting raqamlari yoʻq» qoidasi XP va daraja raqamlariga ham tegishlimi? (Tavsiya: ha, daraja nomlari.)
3. Yumshoq daraja qulfi pedagogik jihatdan maqbulmi: keyingi daraja 7 dan 5 mashqda ochiladi, unvon esa 7 dan 7 da?
4. Yosh 6–7 uchun sukut boʻyicha avtomatik oʻqish: sinovdan keyin yoqamizmi?
5. Parol tiklash: ota-ona tanlagan tiklash soʻzi + 24 soatlik kechikish maqbulmi?
6. Yangi oʻzbekcha matnlarni kim tekshiradi va yangi ovozlarni kim yozadi?
7. Robot hamroh uchun rasm (3 holat) bormi?
8. Sinov guruhi (5 ta bola, 6–7 yosh) topiladimi?
