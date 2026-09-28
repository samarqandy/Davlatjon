# Hisobga kirish: Google va Telegram

Kirish ixtiyoriy. Hisobsiz ham hammasi ishlaydi — natijalar shu brauzerda saqlanadi.
Kirilsa, natijalar hisobda ham saqlanadi va telefon, planshet, kompyuterda bir xil boʻladi.

Kirish tugmalari faqat quyidagi sozlamalar berilganda koʻrinadi (Vercel → Project → Settings →
Environment Variables). Birortasi boʻlmasa, sayt avvalgidek hisobsiz ishlayveradi.

| Oʻzgaruvchi                                | Nima uchun                                                                                        |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| `AUTH_SECRET`                              | Sessiya cookie imzosi uchun tasodifiy satr, kamida 32 belgi (`openssl rand -base64 48`).          |
| `SUPABASE_URL`                             | Supabase loyiha manzili, masalan `https://abcd.supabase.co`.                                      |
| `SUPABASE_SERVICE_ROLE_KEY`                | Supabase → Project Settings → API → `service_role` kaliti. Faqat serverda ishlatiladi.            |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google orqali kirish uchun (pastda).                                                              |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_BOT_NAME`  | Telegram orqali kirish uchun (pastda).                                                            |
| `APP_URL`                                  | Ixtiyoriy: sayt manzili, masalan `https://davlatjon.vercel.app` (proksi xost nomini almashtirsa). |

## 1. Supabase: natijalar jadvali

1. Supabase’da loyiha oching (yoki mavjudini tanlang).
2. SQL Editor’da `supabase/migrations/20260928000000_lab_progress.sql` faylini ishga tushiring —
   `lab_progress` jadvali yaratiladi. RLS yoqilgan, siyosatlar yoʻq: jadvalga faqat sayt serveri
   `service_role` kaliti bilan kira oladi, brauzer esa yoʻq.

## 2. Google orqali kirish

1. [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → **Create credentials → OAuth client ID** → _Web application_.
2. **Authorized redirect URIs**: `https://<sayt-manzili>/api/auth/google/callback`
   (sinov uchun `http://localhost:3000/api/auth/google/callback` ham qoʻshsa boʻladi).
3. Client ID va Client secret’ni `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` ga yozing.
4. OAuth consent screen’da ilova nomi: «Davlatjon laboratoriyasi», scopes: `openid`, `email`, `profile`.

## 3. Telegram orqali kirish

1. Telegram’da [@BotFather](https://t.me/BotFather) → `/newbot` → bot nomi va username (masalan `davlatjon_lab_bot`).
2. Token’ni `TELEGRAM_BOT_TOKEN` ga, username’ni (`@`siz) `TELEGRAM_BOT_NAME` ga yozing.
3. BotFather’da `/setdomain` → botni tanlang → sayt domeni (masalan `davlatjon.vercel.app`).
   Domen koʻrsatilmasa, Telegram tugmasi «Bot domain invalid» deydi.

## Qanday ishlaydi

- Kirish tugmalari: **Ota-onalar uchun → Sozlamalar → Hisob**.
- Google: OAuth 2.0 (kod + PKCE), Telegram: Login Widget imzosi (HMAC-SHA256) serverda tekshiriladi.
- Kirgandan keyin brauzerga imzolangan `httpOnly` cookie beriladi (180 kun).
- Natijalar bir necha soniyada bir marta va sahifa yopilayotganda yuboriladi. Server kelgan natijani
  hisobdagisi bilan **birlashtiradi**: yechilgan masala yechilgan boʻlib qoladi, rekordlar eng kattasi olinadi,
  partiyalar va kundalik yozuvlari qoʻshiladi — ikki qurilma bir-birining natijasini oʻchirib yubormaydi.
- Google va Telegram — ikki alohida hisob. Bitta usulni tanlab, hamma qurilmada shu bilan kiring.
- Hisobdan chiqilsa, natijalar shu qurilmada qoladi.
