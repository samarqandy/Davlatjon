# «Shaxmat shohnomasi» — rasm, illyustratsiya va media uchun promtlar

Bu faylda uch qism bor:

1. **Claude web uchun bosh promt.** Uni Claude’ga bir marta berasiz; Claude butun kitob uchun rasm va media rejasini va har bir rasm uchun tayyor promtni tuzib beradi.
2. **Uslub qo‘llanmasi.** Barcha rasmlar bitta kitobdan chiqqandek ko‘rinishi uchun har bir promtning boshiga qo‘shiladigan blok.
3. **ChatGPT uchun tayyor namuna promtlar.** Muqova, qahramonlar, qatorlar, belgilar va interfeys rasmlari. Bularni darhol sinab ko‘rish mumkin.

Promtlar ingliz tilida: rasm modellari inglizchani aniqroq tushunadi. Rasm ichida **matn yozdirmang** — yozuvlarni saytda yoki maketda o‘zimiz qo‘yamiz (modellar o‘zbekcha harflarni buzadi).

---

## 1. Claude web uchun bosh promt

Quyidagini Claude’ga to‘liq nusxalab bering:

```text
You are the art director of «Shaxmat shohnomasi» ("The Chess Shahnameh — a book you play"), a free interactive chess textbook for children aged 6–14 in Uzbek (Latin script) and Russian, published on the website parvozedu.uz. The book is played on a board: every page is a chess position and one action.

STRUCTURE OF THE BOOK
The book is the journey of a pawn from the 1st rank to the 8th. Each rank is a land and an era, and a skill level. At the end the pawn becomes a queen and the child prints a diploma.
- Prologue — Samarkand, today: the seven ivory chess pieces found at Afrasiyab (Samarkand) in 1977, dated 7th–8th century.
- Rank 1 — India, «To‘rt qo‘shin» (Four armies): chaturanga, the board and how each piece moves.
- Rank 2 — Iran, «Buzurgmehr jumbog‘i» (Buzurgmehr's riddle): check, checkmate, castling, exchanges, first full game. (The riddle story is a legend and must be shown as a legend.)
- Rank 3 — Baghdad, «Aliyat» (the masters of shatranj): simple mates, first opening rules, first tournament.
- Rank 4 — Samarkand, «Sohibqiron taxtasi» (Timur's court): forks, pins, double attack, calculation.
- Rank 5 — Europe, «Yangi farzin» (the new queen): combinations.
- Rank 6 — The age of champions, «Toj uchun» (For the crown): positional play, rook endgames.
- Rank 7 — The machines, «Temir raqib» (The iron opponent): computers, analysing your own games.
- Rank 8 — Uzbekistan, «Sening shohnomang» (Your own Shahnameh): plans, tournaments, the final exam.
Characters: Parvoz — the platform's mascot, a friendly blue-to-cyan gradient bird (storybook version, no circuit patterns, small graduation cap optional); Bo‘ta — a curious baby camel who travels with the reader; Piyoda — the white pawn hero who walks the eight ranks.

YOUR TASK
1. Write a one-page visual style bible (palette, line, light, character proportions, how chess boards and pieces are drawn, what is forbidden).
2. Produce the complete list of images the book needs, as a table: id, where it is used (cover / rank opener / chapter spot / badge / UI state / print), size and aspect ratio, transparent background or not, priority (P1 for the first preview: Prologue and Rank 1; P2 Ranks 2–3; P3 later).
3. For every image write a ready-to-paste prompt for ChatGPT image generation, in English, each starting with the style block below and ending with the negative rules. Keep the same characters identical across prompts (describe them the same way every time).
4. Produce a short media plan: 30–45 second animated intros for the Prologue and each rank (storyboard of 5–7 shots with a video-model prompt per shot), and a list of sound effects (move, capture, check, success, gentle mistake, chapter complete) described for a sound designer.

HARD RULES
- Original art only. Do not imitate a named living artist, a specific existing book, film, game or brand style. Historical inspiration is allowed in general terms (Persian and Timurid miniature colour and composition, Samarkand tilework patterns).
- No real person's likeness. World champions and Uzbek grandmasters appear only as anonymous silhouettes or from behind; real photos will be licensed separately.
- Chess must be correct: an 8×8 board, light square in each player's bottom-right corner (h1 light), pieces upright and recognisable, never more pieces than a real set. In historical scenes (India, Iran, Baghdad, Timur) use abstract shatranj-style pieces, not modern Staunton pieces; in teaching images use simple modern pieces.
- No text, letters or numbers inside the images (we add them in the layout), except board coordinates when explicitly requested.
- Child-safe: no weapons pointed at anyone, no blood, no frightening faces, no gambling, no adult themes; no depiction of religious figures; respectful, accurate dress for each culture and era.
- Legends must look like legends (storybook framing, scroll or lantern light), history like history (museum, map, real objects).
- Everything must read clearly at 360 px wide on a phone and also work on a 65-inch classroom panel and in print; leave calm space where the layout will place text.

STYLE BLOCK (paste at the start of every image prompt)
[see section 2 of this file — I will paste it here]

Return the style bible, the table, all prompts grouped by priority, and the media plan. Ask me no questions; where a choice is open, choose and say why in one line.
```

> Oxiridagi `[see section 2 ...]` o‘rniga quyidagi 2-bo‘limdagi uslub blokini qo‘ying.

---

## 2. Uslub bloki (har bir rasm promtining boshiga)

```text
STYLE: warm, modern children's storybook illustration with a hint of Timurid miniature art: flat shapes with soft gradients, clean confident outlines, gentle paper grain, soft daylight, rounded friendly forms. Palette anchored on deep indigo #4F46E5 and #3730A3, warm saffron #F59E0B, fresh mint #10B981, cream paper #FAF8F3 and ink navy #1D2140, plus turquoise of Samarkand tiles as an accent. Characters have big readable silhouettes and expressive but simple faces. Chess boards are drawn flat or in a slight three-quarter view, 8×8, light square at each player's bottom-right, with clear upright pieces.
NEGATIVE: no text, no letters, no numbers, no watermark, no logo, no real-person likeness, no photorealism, no weapons in use, no blood, no scary faces, no extra or missing board squares, no melted or duplicated chess pieces.
```

**Qahramonlarni bir xil chizdirish uchun** promtda ularni har safar aynan shunday ta’riflang:

- **Parvoz:** `Parvoz, a small round friendly bird with a blue-to-cyan gradient body, large kind dark eyes, short wings, a tiny dark-indigo graduation cap tilted on its head`
- **Bo‘ta:** `Bo‘ta, a baby Bactrian camel calf with two small soft humps, sandy-beige fur, oversized curious eyes, a little turquoise-and-saffron woven blanket on its back`
- **Piyoda:** `Piyoda, a white chess pawn hero with a simple friendly face, small arms, and a tiny satchel; it walks upright and is about knee-high to Bo‘ta`

---

## 3. ChatGPT uchun tayyor namuna promtlar

Har birining oldiga 2-bo‘limdagi uslub blokini qo‘shing. O‘lchamlar ChatGPT beradigan formatlarda: kvadrat 1024×1024, yotiq 1536×1024, tik 1024×1536.

### 3.1. Qahramonlar varag‘i (avval shuni qiling)

Qolgan rasmlarda qahramonlar bir xil chiqishi uchun shu varaqlarni namuna sifatida ChatGPT’ga qayta yuklaysiz.

```text
Character turnaround sheet, 1536×1024, plain cream background. Three characters side by side, each shown from the front, three-quarter and side: Parvoz, a small round friendly bird with a blue-to-cyan gradient body, large kind dark eyes, short wings, a tiny dark-indigo graduation cap tilted on its head; Bo‘ta, a baby Bactrian camel calf with two small soft humps, sandy-beige fur, oversized curious eyes, a little turquoise-and-saffron woven blanket on its back; Piyoda, a white chess pawn hero with a simple friendly face, small arms and a tiny satchel, about knee-high to Bo‘ta. Below them, a row of four expressions for each: happy, thinking, surprised, proud.
```

### 3.2. Kitob muqovasi

```text
Book cover illustration, portrait 1024×1536. A long road made of chessboard squares rises from the bottom of the picture toward a glowing horizon, passing eight small distant landscapes that hint at India, Persia, Baghdad, Timurid Samarkand with turquoise domes, a European town, a grand tournament hall, a soft glowing computer screen, and modern Tashkent. In the foreground Piyoda, the white pawn hero, takes the first step onto the road with Bo‘ta the baby camel beside it and Parvoz the bird flying ahead. Far at the top of the road a faint golden crown shape glows. Leave the top third calm and uncluttered for the title.
```

### 3.3. Muqaddima — Samarqand, Afrosiyob

```text
Wide scene 1536×1024. A sunlit museum hall in Samarkand with a single glass display case in the centre holding seven small, simple, carved ivory chess pieces from the early medieval period (abstract shapes: a little king, a vizier, an elephant, a horse, a chariot, foot soldiers). A child-sized Piyoda and Bo‘ta press their noses to the glass in wonder; Parvoz sits on top of the case. Through a tall window, the turquoise domes of Samarkand. Calm, documentary feeling, warm afternoon light.
```

### 3.4. 1-qator — Hindiston, «To‘rt qo‘shin»

```text
Rank opener, 1536×1024. A storybook vision of an ancient Indian army arranged like pieces on a giant 8×8 board in a palace courtyard: elephants, horses, chariots and foot soldiers standing in four neat groups, all shown as gentle, toy-like figures, no weapons raised. Piyoda, Bo‘ta and Parvoz watch from the edge of the board. Framed like a legend: soft lantern light and a decorative border inspired by old Indian manuscripts. Leave calm space at the left for text.
```

### 3.5. 2-qator — Eron, «Buzurgmehr jumbog‘i» (afsona)

```text
Rank opener, 1536×1024, clearly framed as a legend inside an unrolled storybook scroll. In a Persian royal hall, a wise court scholar in modest robes studies an abstract shatranj board brought by a visiting envoy; around them, curious courtiers. Piyoda and Bo‘ta peek from behind a carved column, Parvoz sits on the scroll's edge. Colours of Persian miniature painting: lapis blue, saffron, rose and gold, flat perspective. Nobody is a recognisable real person.
```

### 3.6. 4-qator — Samarqand, «Sohibqiron taxtasi»

```text
Rank opener, 1536×1024. A Timurid-era garden pavilion in Samarkand with turquoise and cobalt tilework; on a low carpet sits a large rectangular board with more squares than a normal chessboard and abstract carved pieces, two players seen only from behind in courtly robes. Piyoda and Bo‘ta sit at the edge of the carpet and count the squares; Parvoz perches on the pavilion arch. Golden late-afternoon light, peaceful atmosphere.
```

### 3.7. 7-qator — «Temir raqib»

```text
Rank opener, 1536×1024. A friendly, rounded retro-futuristic robot sits across a modern chessboard from Piyoda; the robot has a soft glowing face screen showing a simple smile, no menacing features. Bo‘ta watches with a notebook, Parvoz hovers above the board. Cool indigo and mint lighting with a warm saffron lamp, clean modern room.
```

### 3.8. 8-qator — O‘zbekiston, «Sening shohnomang»

```text
Rank opener, 1536×1024. A bright modern school chess club in Uzbekistan: children of different ages playing at several boards with chess clocks, a coach at a large interactive screen, a window with a modern city skyline and a turquoise dome in the distance. In the foreground Piyoda stands on the last rank of a board, glowing as it begins to transform into a queen, with Bo‘ta and Parvoz cheering. Children are generic, not real people.
```

### 3.9. Belgilar: muhr, toj, diplom (shaffof fon)

```text
Set of three badge icons on a transparent background, 1024×1024, arranged in a row, flat illustration with a soft inner shadow: 1) "Muhr" — a round wax-style seal in saffron with a simple pawn silhouette pressed into it; 2) "Toj" — a small golden crown with turquoise gems, slightly glowing; 3) a rolled diploma tied with an indigo ribbon and a tiny pawn-to-queen emblem. Each badge must read clearly at 48 px.
```

### 3.10. Interfeys holatlari (shaffof fon, kvadrat)

```text
Set of four small character spot illustrations on a transparent background, 1024×1024 sheet, 2×2 grid, each with clear empty space around it: 1) Parvoz celebrating with wings up and tiny confetti (lesson complete); 2) Bo‘ta thinking with a curious tilted head and a small question-like swirl, not a question mark (think again); 3) Piyoda and Bo‘ta gently laughing after a stumble, encouraging, no sadness (gentle mistake); 4) Parvoz asleep on a closed book under a crescent moon (come back tomorrow).
```

### 3.11. Sayohat xaritasi

```text
Illustrated journey map, landscape 1536×1024, drawn as a giant chessboard seen from above: eight horizontal ranks, each rank decorated as a different land in order from bottom to top — India, Persia, Baghdad, Timurid Samarkand, a European town, a tournament hall, a room of computers, modern Uzbekistan. A dotted path climbs from the bottom rank to the top, with a small Piyoda at the start and a golden crown at the end. Leave each rank with a calm strip for a label added later.
```

---

## 4. Media: qisqa video va tovushlar

**Video** (Sora, Veo, Kling va shunga o‘xshash modellar uchun; har bir kadr alohida promt, 5–8 soniya):

```text
Shot 1/5, 6 seconds, gentle camera push-in. Storybook animation in the style block above. A museum display case in Samarkand; seven small carved ivory chess pieces glow softly; Piyoda, a white pawn hero, steps up to the glass. Calm, wondrous mood, no text.
```

Keyingi kadrlarni Claude bosh promt orqali har bir qator uchun tuzib beradi (5–7 kadr, jami 30–45 soniya).

**Tovushlar** (ovoz rejissyori yoki tovush kutubxonasi uchun ta’rif):

- yurish — yog‘och taxtaga yog‘och donaning yumshoq «chiq»i;
- olish — biroz chuqurroq va to‘liqroq «taq»;
- shoh — qisqa, yengil ikki notali signal, qo‘rqitmaydigan;
- to‘g‘ri javob — iliq, ko‘tariluvchi uch nota;
- xato — past, yumshoq bitta nota, jazolovchi emas;
- bob tugadi — doira va qo‘ng‘iroqchalar bilan 2 soniyalik bayram.

Ovozli o‘qish (diktor) kerak bo‘lsa, uni alohida qilamiz: ElevenLabs limiti tugagan va brauzerning o‘z nutqi saytda taqiqlangan.

---

## 5. Rasmlarni olgandan keyin

1. Har bir rasmni promti bilan birga saqlang (fayl nomi: `rank1-opener.png` va promt `rank1-opener.txt`).
2. Shaxmatni tekshiring: taxta 8×8, o‘ng pastki katak oq, donalar to‘g‘ri va ortiqcha emas. Xato bo‘lsa — qayta yaratish.
3. Rasm ichida tasodifiy harflar chiqib qolsa — o‘chirish yoki qayta yaratish.
4. Tayyorlarini menga yuboring: WebP’ga o‘tkazaman, telefon va panel uchun o‘lchamlarini tayyorlayman va kitob sahifalariga joylayman.
