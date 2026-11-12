/**
 * Названия дебютов по-русски и по-узбекски — для строки «Дебют: …» на доске анализа и в разборе партии.
 *
 * Ключ — семейство из открытого списка Lichess (см. scripts/build-opening-book.mjs). Русские названия —
 * принятые в русской шахматной литературе (они часто не совпадают с английскими: Ruy Lopez — испанская партия,
 * Petrov's Defense — русская партия, Benko Gambit — волжский гамбит). Узбекские — как в нашем разделе дебютов
 * (src/content/chess/uz/openings.ts); остальные построены так же: фамилия или страна + «himoyasi», «gambiti»,
 * «debyuti».
 *
 * Семейства, которых здесь нет (редкие и шуточные), на экране не называются: показывается более общее
 * название — например, «Дебют королевской пешки».
 */
export interface OpeningNames {
  ru: string;
  uz: string;
}

const n = (ru: string, uz: string): OpeningNames => ({ ru, uz });

const KINGS_GAMBIT = n("Королевский гамбит", "Shoh gambiti");
const QUEENS_GAMBIT = n("Ферзевый гамбит", "Farzin gambiti");
const VOLGA = n("Волжский гамбит", "Volga gambiti");
const BLACKMAR = n("Гамбит Блэкмара — Димера", "Blekmar–Dimer gambiti");
const BLUMENFELD = n("Гамбит Блюменфельда", "Blyumenfeld gambiti");
const DANISH = n("Датский гамбит", "Daniya gambiti");
const ENGLUND = n("Гамбит Энглунда", "Englund gambiti");
const LATVIAN = n("Латышский гамбит", "Latviya gambiti");
const CENTER = n("Центральный дебют", "Markaziy debyut");
const KINGS_PAWN = n("Дебют королевской пешки", "Shoh piyodasi debyuti");
const KINGS_INDIAN_ATTACK = n("Староиндийское начало", "Shoh hind hujumi");
const LONDON = n("Лондонская система", "London tizimi");
const SOKOLSKY = n("Дебют Сокольского", "Sokolskiy debyuti");
const QUEENS_INDIAN = n("Новоиндийская защита", "Yangi hind himoyasi");
const SEMI_SLAV = n("Полуславянская защита", "Yarim slavyan himoyasi");
const VIENNA = n("Венская партия", "Vena partiyasi");

export const OPENING_NAMES: Record<string, OpeningNames> = {
  "Alekhine Defense": n("Защита Алехина", "Alyoxin himoyasi"),
  "Amar Opening": n("Дебют Амара", "Amar debyuti"),
  "Anderssen's Opening": n("Дебют Андерсена", "Andersen debyuti"),
  "Barnes Defense": n("Защита Барнса", "Barns himoyasi"),
  "Barnes Opening": n("Дебют Барнса", "Barns debyuti"),
  "Benko Gambit": VOLGA,
  "Benko Gambit Accepted": VOLGA,
  "Benko Gambit Declined": VOLGA,
  "Benoni Defense": n("Защита Бенони", "Benoni himoyasi"),
  "Bird Opening": n("Дебют Берда", "Berd debyuti"),
  "Bishop's Opening": n("Дебют слона", "Fil debyuti"),
  "Blackmar-Diemer Gambit": BLACKMAR,
  "Blackmar-Diemer Gambit Accepted": BLACKMAR,
  "Blackmar-Diemer Gambit Declined": BLACKMAR,
  "Blumenfeld Countergambit": BLUMENFELD,
  "Blumenfeld Countergambit Accepted": BLUMENFELD,
  "Bogo-Indian Defense": n("Защита Боголюбова", "Bogolyubov himoyasi"),
  "Caro-Kann Defense": n("Защита Каро-Канн", "Karo-Kann himoyasi"),
  "Catalan Opening": n("Каталонское начало", "Katalon debyuti"),
  "Center Game": CENTER,
  "Center Game Accepted": CENTER,
  "Clemenz Opening": n("Дебют Клеменца", "Klemens debyuti"),
  "Colle System": n("Система Колле", "Kolle tizimi"),
  "Czech Defense": n("Чешская защита", "Chex himoyasi"),
  "Danish Gambit": DANISH,
  "Danish Gambit Accepted": DANISH,
  "Danish Gambit Declined": DANISH,
  "Dutch Defense": n("Голландская защита", "Golland himoyasi"),
  "Elephant Gambit": n("Гамбит слона", "Fil gambiti"),
  "English Defense": n("Английская защита", "Ingliz himoyasi"),
  "English Opening": n("Английское начало", "Ingliz debyuti"),
  "Englund Gambit": ENGLUND,
  "Englund Gambit Declined": ENGLUND,
  "Four Knights Game": n("Дебют четырёх коней", "Toʻrt ot partiyasi"),
  "French Defense": n("Французская защита", "Fransuz himoyasi"),
  "Grob Opening": n("Дебют Гроба", "Grob debyuti"),
  "Grünfeld Defense": n("Защита Грюнфельда", "Gryunfeld himoyasi"),
  "Hippopotamus Defense": n("Защита «Гиппопотам»", "«Begemot» himoyasi"),
  "Hungarian Opening": n("Дебют королевского фианкетто", "Shoh fianketto debyuti"),
  "Indian Defense": n("Индийская защита", "Hind himoyasi"),
  "Italian Game": n("Итальянская партия", "Italyan partiyasi"),
  "King's Gambit": KINGS_GAMBIT,
  "King's Gambit Accepted": n("Принятый королевский гамбит", "Qabul qilingan shoh gambiti"),
  "King's Gambit Declined": n("Отказанный королевский гамбит", "Rad etilgan shoh gambiti"),
  "King's Indian Attack": KINGS_INDIAN_ATTACK,
  "King's Indian Attack, with Bf5": KINGS_INDIAN_ATTACK,
  "King's Indian Attack, with e6": KINGS_INDIAN_ATTACK,
  "King's Indian Defense": n("Староиндийская защита", "Shoh hind himoyasi"),
  "King's Knight Opening": n("Дебют королевского коня", "Shoh oti debyuti"),
  "King's Pawn Game": KINGS_PAWN,
  "King's Pawn Opening": KINGS_PAWN,
  "Latvian Gambit": LATVIAN,
  "Latvian Gambit Accepted": LATVIAN,
  "London System": LONDON,
  "London System, with Bd3": LONDON,
  "London System, with Be2": LONDON,
  "Mexican Defense": n("Мексиканская защита", "Meksika himoyasi"),
  "Mieses Opening": n("Дебют Мизеса", "Mizes debyuti"),
  "Modern Defense": n("Современная защита", "Zamonaviy himoya"),
  "Nimzo-Indian Defense": n("Защита Нимцовича", "Nimsovich himoyasi"),
  "Nimzo-Larsen Attack": n("Дебют Ларсена", "Larsen debyuti"),
  "Nimzowitsch Defense": n("Дебют Нимцовича", "Nimsovich debyuti"),
  "Owen Defense": n("Защита Оуэна", "Ouen himoyasi"),
  "Petrov's Defense": n("Русская партия", "Rus partiyasi"),
  "Philidor Defense": n("Защита Филидора", "Filidor himoyasi"),
  "Pirc Defense": n("Защита Пирца — Уфимцева", "Pirs–Ufimsev himoyasi"),
  "Polish Defense": n("Польская защита", "Polsha himoyasi"),
  "Polish Opening": SOKOLSKY,
  "Polish Opening, with d5": SOKOLSKY,
  "Ponziani Opening": n("Дебют Понциани", "Ponsiani debyuti"),
  "Queen's Gambit": QUEENS_GAMBIT,
  "Queen's Gambit Accepted": n("Принятый ферзевый гамбит", "Qabul qilingan farzin gambiti"),
  "Queen's Gambit Declined": n("Отказанный ферзевый гамбит", "Rad etilgan farzin gambiti"),
  "Queen's Indian Defense": QUEENS_INDIAN,
  "Queen's Indian Defense, with e3": QUEENS_INDIAN,
  "Queen's Indian Defense, with e3, Bb4+ Line": QUEENS_INDIAN,
  "Queen's Pawn Game": n("Дебют ферзевой пешки", "Farzin piyodasi debyuti"),
  "Richter-Veresov Attack": n("Дебют Вересова", "Veresov debyuti"),
  "Robatsch Defense": n("Защита Робача", "Robach himoyasi"),
  "Ruy Lopez": n("Испанская партия", "Ispan partiyasi"),
  "Réti Opening": n("Дебют Рети", "Reti debyuti"),
  "Saragossa Opening": n("Сарагосское начало", "Saragosa debyuti"),
  "Scandinavian Defense": n("Скандинавская защита", "Skandinaviya himoyasi"),
  "Scotch Game": n("Шотландская партия", "Shotland partiyasi"),
  "Semi-Slav Defense": SEMI_SLAV,
  "Semi-Slav Defense Accepted": SEMI_SLAV,
  "Sicilian Defense": n("Сицилианская защита", "Sitsiliya himoyasi"),
  "Slav Defense": n("Славянская защита", "Slavyan himoyasi"),
  "Tarrasch Defense": n("Защита Тарраша", "Tarrash himoyasi"),
  "Three Knights Opening": n("Дебют трёх коней", "Uch ot partiyasi"),
  "Torre Attack": n("Атака Торре", "Torre hujumi"),
  "Trompowsky Attack": n("Атака Тромповского", "Trompovskiy hujumi"),
  "Van Geet Opening": n("Дебют Данста", "Danst debyuti"),
  "Van't Kruijs Opening": n("Дебют ван Круйса", "Van Kruys debyuti"),
  "Vienna Gambit, with Max Lange Defense": VIENNA,
  "Vienna Game": VIENNA,
  "Ware Opening": n("Дебют Уэра", "Uer debyuti"),
  "Zukertort Opening": n("Дебют Цукерторта", "Sukertort debyuti"),
};
