# Hisobga kirish: Google va Telegram

Kirish ixtiyoriy. Hisobsiz ham hammasi ishlaydi — natijalar shu brauzerda saqlanadi.
Kirilsa, natijalar hisobda ham saqlanadi va telefon, planshet, kompyuterda bir xil boʻladi.

Kirish tugmalari faqat quyidagi sozlamalar berilganda koʻrinadi (Vercel → Project → Settings →
Environment Variables). Birortasi boʻlmasa, sayt avvalgidek hisobsiz ishlayveradi.

| Oʻzgaruvchi                                | Nima uchun                                                                                      |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| `AUTH_SECRET`                              | Sessiya cookie imzosi uchun tasodifiy satr, kamida 32 belgi (`openssl rand -base64 48`).        |
| `DATABASE_URL`                             | Neon bazasiga ulanish satri (`postgresql://…`). Vercel orqali ulansa, oʻzi qoʻshiladi (pastda). |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google orqali kirish uchun (pastda).                                                            |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_BOT_NAME`  | Telegram orqali kirish uchun (pastda).                                                          |
| `CRON_SECRET`                              | Haftalik hisobot uchun tasodifiy satr, kamida 16 belgi (pastda, 5-boʻlim).                      |
| `APP_URL`                                  | Ixtiyoriy: sayt manzili, masalan `https://parvozedu.uz` (proksi xost nomini almashtirsa).       |

Kamida bitta kirish usuli kerak: Google yoki Telegram. Oʻzgaruvchilarni qoʻshgandan keyin saytni qayta
joylang (**Deployments → Redeploy**) — Vercel ularni faqat yangi joylashda oladi.

## 1. Neon: natijalar bazasi

Eng oson yoʻli — Vercel’ning oʻzida:

1. Vercel → loyiha → **Storage** → **Create Database** → **Neon**, tarif **Free**.
   Hududni Vercel funksiyalari turgan joyga yaqin tanlang (**Settings → Functions → Region**;
   odatda bu Washington — `iad1`, Neon’da unga **US East (N. Virginia)** mos keladi).
2. Baza tayyor boʻlgach, **Connect Project** → loyihangiz (Production va Preview).
   Vercel `DATABASE_URL` ni oʻzi qoʻshadi. Agar ulashda prefiks yozilgan boʻlsa
   (masalan, `STORAGE_DATABASE_URL`), shu qiymatni `DATABASE_URL` nomi bilan qoʻlda ham qoʻshing.

Boshqa yoʻl: [console.neon.tech](https://console.neon.tech) → yangi loyiha → **Connect** →
ulanish satrini (`postgresql://…`) nusxalab, Vercel’da `DATABASE_URL` ga yozing.

Jadvalni qoʻlda yaratish shart emas: birinchi kirishdayoq sayt `lab_progress` jadvalini oʻzi yaratadi.
Ulanish satri ichida bazaning paroli bor: u faqat serverda ishlatiladi, nomiga `NEXT_PUBLIC_` qoʻshmang.

Jadval tuzilishi (bilib qoʻyish uchun):

```sql
create table if not exists lab_progress (
  user_id text primary key,                  -- google:… yoki tg:…
  state jsonb not null default '{}'::jsonb,  -- bolaning butun natijasi
  updated_at timestamptz not null default now()
);
```

## 2. Google orqali kirish

1. [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → **Create credentials → OAuth client ID** → _Web application_.
2. **Authorized redirect URIs**: `https://<sayt-manzili>/api/auth/google/callback`
   (sinov uchun `http://localhost:3000/api/auth/google/callback` ham qoʻshsa boʻladi).
3. Client ID va Client secret’ni `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` ga yozing.
4. OAuth consent screen’da ilova nomi: «Parvoz Edu», scopes: `openid`, `email`, `profile`.

## 3. Telegram orqali kirish

1. Telegram’da [@BotFather](https://t.me/BotFather) → `/newbot` → bot nomi va username (masalan `parvozedu_bot`).
2. Token’ni `TELEGRAM_BOT_TOKEN` ga, username’ni (`@`siz) `TELEGRAM_BOT_NAME` ga yozing.
3. BotFather’da `/setdomain` → botni tanlang → sayt domeni (masalan `parvozedu.uz`).
   Domen koʻrsatilmasa, Telegram tugmasi «Bot domain invalid» deydi.

## 4. Tekshirish

Qayta joylangandan keyin `https://parvozedu.uz/api/auth/me` ni oching. `"google": true` yoki
`"telegram": true` koʻrinsa, hammasi ulangan. `false` boʻlsa: `AUTH_SECRET` 32 belgidan qisqa emasmi,
`DATABASE_URL` bormi, kirish usulining ikkala oʻzgaruvchisi ham yozilganmi — va sayt qayta joylanganmi.

## 5. Haftalik hisobot Telegram'da (ixtiyoriy)

Ota-ona Telegram orqali kirgan va **Ota-onalar uchun → Hafta yakunlari** sahifasida «Yuborilsin» ni tanlagan boʻlsa,
bot har yakshanba kechqurun (16:00 UTC, Toshkent vaqti bilan 21:00) qisqa xulosa yuboradi. Xabarda bolaning ismi,
baholar va foizlar yoʻq; mashgʻulot boʻlmagan haftada xabar yuborilmaydi.

1. Vercel → Environment Variables: `CRON_SECRET` = tasodifiy satr (`openssl rand -base64 24`), kamida 16 belgi.
   Tokenni va bu qiymatni chatga yozmang — faqat Vercel’ga qoʻying.
2. Qayta joylang. `vercel.json` dagi `crons` Vercel Cron’ni har yakshanba `/api/cron/weekly` ga yuboradi;
   Vercel soʻrovga `Authorization: Bearer <CRON_SECRET>` qoʻshadi, sirsiz soʻrov rad etiladi.
3. Telegram’da bot sizga yozishi uchun kirishda ruxsat berish kerak (kirish tugmasi buni soʻraydi). Avval kirgan boʻlsangiz —
   chiqib, qaytadan kiring yoki botga `/start` yuboring.
4. Sahifada «Sinov xabarini yuborish» tugmasi bor — xabar darhol sizning Telegram’ingizga keladi.

Tekshirish: `https://parvozedu.uz/api/auth/me` javobida `"reports": true` boʻlishi kerak.

## Qanday ishlaydi

- Kirish tugmalari: **Ota-onalar uchun → Sozlamalar → Hisob**.
- Google: OAuth 2.0 (kod + PKCE), Telegram: Login Widget imzosi (HMAC-SHA256) serverda tekshiriladi.
- Kirgandan keyin brauzerga imzolangan `httpOnly` cookie beriladi (180 kun).
- Natijalar Neon’dagi `lab_progress` jadvalida saqlanadi. Brauzer bazaga toʻgʻridan-toʻgʻri ulanmaydi —
  faqat sayt serveri orqali.
- Natijalar bir necha soniyada bir marta va sahifa yopilayotganda yuboriladi. Server kelgan natijani
  hisobdagisi bilan **birlashtiradi**: yechilgan masala yechilgan boʻlib qoladi, rekordlar eng kattasi olinadi,
  partiyalar va kundalik yozuvlari qoʻshiladi — ikki qurilma bir-birining natijasini oʻchirib yubormaydi.
- Google va Telegram — ikki alohida hisob. Bitta usulni tanlab, hamma qurilmada shu bilan kiring.
- Hisobdan chiqilsa, natijalar shu qurilmada qoladi.
