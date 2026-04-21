# DEPLOY.md — RealEstate AI Platform

Bilingual deploy guide: **O'zbekcha birinchi, English second**.

Domain: `uzrealestatepro.com` (Namecheap)
GitHub user: `1nurbek`
Stack: Next.js (Vercel) + Node/Express + Prisma + Postgres (Railway)

---

## BO'LIM 1 / SECTION 1: GitHub'ga yuklash (~5 min)

### O'zbekcha
1. Browser'da oching: https://github.com/new
2. Repository name: `realestate-ai-platform`
3. Visibility: **Public** (Private ham bo'ladi, lekin Vercel free plan uchun Public osonroq)
4. **README, .gitignore, license qo'shmang** — loyihada allaqachon bor.
5. "Create repository" tugmasini bosing.
6. Terminal'da quyidagi buyruqlarni ishga tushiring:

```bash
cd /Users/macbook/Projects/realestate-ai-platform
git remote add origin https://github.com/1nurbek/realestate-ai-platform.git
git branch -M main
git push -u origin main
```

7. Agar GitHub parol so'rasa — **oddiy parol ishlamaydi**. Personal Access Token (PAT) kerak:
   - https://github.com/settings/tokens ga o'ting
   - "Generate new token (classic)" → `repo` scope'ni belgilang → Generate
   - Tokenni nusxalab oling (faqat bir marta ko'rsatiladi!)
   - `git push` parol so'raganda, parol o'rniga **tokenni** joylang.

### English
1. Open https://github.com/new in your browser.
2. Repository name: `realestate-ai-platform`
3. Visibility: **Public** (Private works too, but Public is easier on Vercel free plan)
4. **Do NOT add README, .gitignore, or license** — the project already has them.
5. Click "Create repository".
6. Run in your terminal:

```bash
cd /Users/macbook/Projects/realestate-ai-platform
git remote add origin https://github.com/1nurbek/realestate-ai-platform.git
git branch -M main
git push -u origin main
```

7. If GitHub asks for a password — **regular password won't work**. You need a Personal Access Token (PAT):
   - Go to https://github.com/settings/tokens
   - "Generate new token (classic)" → check `repo` scope → Generate
   - Copy the token (shown only once!)
   - When `git push` asks for password, paste the **token** instead.

---

## BO'LIM 2 / SECTION 2: Railway'ga backend deploy (~10 min)

### O'zbekcha
1. https://railway.app/new ga o'ting.
2. **"Deploy from GitHub repo"** ni tanlang → `1nurbek/realestate-ai-platform` repository'ni tanlang.
3. Service yaratilgach, uni oching → **Settings** tab → **Root Directory** = `backend` (muhim!).
4. Postgres database qo'shing: dashboard'da **"New"** → **"Database"** → **"Add PostgreSQL"**.
5. Postgres service'ga kiring → **Variables** tab → `DATABASE_URL` qiymatini nusxalang.
6. Backend service'ga qayting → **Variables** tab → quyidagilarni qo'shing:

   | Variable | Value |
   |---|---|
   | `DATABASE_URL` | (Postgres'dan nusxalangan qiymat) |
   | `JWT_SECRET` | tasodifiy 32+ belgili string |
   | `NODE_ENV` | `production` |
   | `CORS_ORIGIN` | `https://uzrealestatepro.com,https://www.uzrealestatepro.com` |
   | `CLOUDINARY_CLOUD_NAME` | (ixtiyoriy — rasm yuklash uchun) |
   | `CLOUDINARY_API_KEY` | (ixtiyoriy) |
   | `CLOUDINARY_API_SECRET` | (ixtiyoriy) |
   | `GOOGLE_MAPS_API_KEY` | (ixtiyoriy) |

   **JWT_SECRET generatsiya qilish uchun terminal'da:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   ```
   Chiqqan natijani nusxalab `JWT_SECRET` ga joylang.

   **Eslatma:** Cloudinary kalitlarisiz rasm yuklash ishlamaydi. https://cloudinary.com da bepul akkaunt oching va Dashboard'dan kalitlarni oling.

7. **Deploy** tugmasini bosing. ~3 daqiqa kuting.
8. **Settings → Networking → Generate Domain** tugmasini bosing. Generatsiya qilingan URL'ni nusxalang (masalan: `realestate-backend-production.up.railway.app`). Keyingi bo'limda kerak.

### English
1. Go to https://railway.app/new
2. Select **"Deploy from GitHub repo"** → pick `1nurbek/realestate-ai-platform`.
3. Once the service is created, open it → **Settings** tab → **Root Directory** = `backend` (important!).
4. Add a Postgres database: on the dashboard click **"New"** → **"Database"** → **"Add PostgreSQL"**.
5. Open the Postgres service → **Variables** tab → copy the `DATABASE_URL` value.
6. Back to the backend service → **Variables** tab → add:

   | Variable | Value |
   |---|---|
   | `DATABASE_URL` | (pasted from Postgres) |
   | `JWT_SECRET` | random 32+ char string |
   | `NODE_ENV` | `production` |
   | `CORS_ORIGIN` | `https://uzrealestatepro.com,https://www.uzrealestatepro.com` |
   | `CLOUDINARY_CLOUD_NAME` | (optional — needed for image upload) |
   | `CLOUDINARY_API_KEY` | (optional) |
   | `CLOUDINARY_API_SECRET` | (optional) |
   | `GOOGLE_MAPS_API_KEY` | (optional) |

   **Generate a JWT_SECRET in your terminal:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   ```
   Copy the output and paste as `JWT_SECRET`.

   **Note:** Without Cloudinary keys, image upload will not work. Create a free account at https://cloudinary.com and grab the keys from the Dashboard.

7. Click **Deploy**. Wait ~3 minutes.
8. Click **Settings → Networking → Generate Domain**. Copy the generated URL (e.g. `realestate-backend-production.up.railway.app`). You'll need it in the next section.

---

## BO'LIM 3 / SECTION 3: Vercel'ga frontend deploy (~5 min)

### O'zbekcha
1. https://vercel.com/new ga o'ting.
2. **"Import Git Repository"** → `1nurbek/realestate-ai-platform` ni tanlang.
3. Configure Project:
   - **Root Directory**: `frontend` ni tanlang (Edit tugmasini bosib)
   - **Framework Preset**: Next.js (avto aniqlanadi)
4. **Environment Variables** bo'limida qo'shing:

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_API_URL` | `https://<railway-url>/api` |
   | `NEXT_PUBLIC_SOCKET_URL` | `https://<railway-url>` |
   | `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | (kalit yoki bo'sh qoldiring) |

   `<railway-url>` o'rniga 2-bo'limdan olingan Railway URL'ni qo'ying (masalan `realestate-backend-production.up.railway.app`).

5. **Deploy** tugmasini bosing. ~2 daqiqa kuting.
6. `xxx.vercel.app` URL'ini olasiz. Brauzer'da ochib, ishlashini tekshiring.

### English
1. Go to https://vercel.com/new
2. **"Import Git Repository"** → pick `1nurbek/realestate-ai-platform`.
3. Configure Project:
   - **Root Directory**: click Edit and select `frontend`
   - **Framework Preset**: Next.js (auto-detected)
4. Under **Environment Variables** add:

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_API_URL` | `https://<railway-url>/api` |
   | `NEXT_PUBLIC_SOCKET_URL` | `https://<railway-url>` |
   | `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | (your key or leave empty) |

   Replace `<railway-url>` with the Railway URL from Section 2 (e.g. `realestate-backend-production.up.railway.app`).

5. Click **Deploy**. Wait ~2 minutes.
6. You'll get an `xxx.vercel.app` URL. Open it in a browser to verify.

---

## BO'LIM 4 / SECTION 4: Domain'ni Namecheap'da ulash (~5 min + DNS 10-30 min)

### O'zbekcha
1. Vercel dashboard → Project → **Settings** → **Domains** → **Add** tugmasi.
2. `uzrealestatepro.com` qo'shing, keyin `www.uzrealestatepro.com` ni ham qo'shing.
3. Vercel sizga DNS yozuvlari ko'rsatadi — ularni eslab turing.
4. Yangi tab'da https://namecheap.com ga kiring → **Domain List** → `uzrealestatepro.com` yonidagi **Manage** tugmasini bosing.
5. **Advanced DNS** tab'iga o'ting.
6. **MUHIM:** `@` va `www` uchun mavjud barcha **A** va **CNAME** yozuvlarini o'chiring. Eski yozuvlarni o'chirish muhim — aks holda domain ishlamaydi.
7. Quyidagi yangi yozuvlarni qo'shing:

   | Type | Host | Value | TTL |
   |---|---|---|---|
   | A Record | `@` | `76.76.21.21` | Automatic |
   | CNAME Record | `www` | `cname.vercel-dns.com` | Automatic |

8. Har bir yozuv yonidagi **yashil tasdiqlash (✓)** tugmasini bosib saqlang. Yuqoridagi **"Save All Changes"** tugmasi bo'lsa, uni ham bosing.
9. 10-30 daqiqa kuting — DNS tarqalishi uchun. Vercel SSL sertifikatini avtomatik o'rnatadi.
10. Tekshirish: https://dnschecker.org da `uzrealestatepro.com` ni qidiring — A record `76.76.21.21` ni ko'rsatishi kerak.

### English
1. Vercel dashboard → Project → **Settings** → **Domains** → **Add**.
2. Add `uzrealestatepro.com`, then also add `www.uzrealestatepro.com`.
3. Vercel will show DNS records — note them.
4. In a new tab go to https://namecheap.com → **Domain List** → click **Manage** next to `uzrealestatepro.com`.
5. Go to the **Advanced DNS** tab.
6. **IMPORTANT:** Delete all existing **A** and **CNAME** records for `@` and `www`. Removing old records is critical — otherwise the domain will not work.
7. Add these new records:

   | Type | Host | Value | TTL |
   |---|---|---|---|
   | A Record | `@` | `76.76.21.21` | Automatic |
   | CNAME Record | `www` | `cname.vercel-dns.com` | Automatic |

8. Save each row with the green **✓** check button. If there's a **"Save All Changes"** button at the top, click that too.
9. Wait 10-30 minutes for DNS propagation. Vercel auto-provisions the SSL certificate.
10. Verify at https://dnschecker.org — search `uzrealestatepro.com`, the A record should resolve to `76.76.21.21`.

---

## BO'LIM 5 / SECTION 5: Backend CORS'ni yangilash

### O'zbekcha
Agar frontend backend'ga murojaat qila olmasa (browser console'da CORS xatosi):

1. Railway → backend service → **Variables** tab.
2. `CORS_ORIGIN` ni shunday yangilang:
   ```
   https://uzrealestatepro.com,https://www.uzrealestatepro.com
   ```
   (vergul bilan ajratilgan, bo'shliqsiz)
3. Railway avtomatik qayta deploy qiladi.

Backend kodi allaqachon vergul bilan ajratilgan bir nechta origin'larni qo'llab-quvvatlaydi (`backend/src/app.js`).

### English
If the frontend cannot reach the backend (CORS error in browser console):

1. Railway → backend service → **Variables** tab.
2. Update `CORS_ORIGIN` to:
   ```
   https://uzrealestatepro.com,https://www.uzrealestatepro.com
   ```
   (comma-separated, no spaces)
3. Railway auto-redeploys.

The backend already supports multiple comma-separated origins (`backend/src/app.js`).

---

## BO'LIM 6 / SECTION 6: Tekshirish / Verification

### O'zbekcha
1. https://uzrealestatepro.com ni ochng — homepage ko'rinishi kerak.
2. Backend health check:
   ```bash
   curl https://<railway-url>/api/health
   ```
   Javob: `{"status":"ok"}`
3. Frontend'da signup/signin qilib ko'ring — bu DB ulanishini tekshiradi.
4. Brauzer DevTools → Network tab'ida API so'rovlari 200 status qaytarayotganini tasdiqlang.

### English
1. Open https://uzrealestatepro.com — homepage should load.
2. Backend health check:
   ```bash
   curl https://<railway-url>/api/health
   ```
   Expected: `{"status":"ok"}`
3. Try signup/signin on the frontend — this tests the DB connection.
4. Browser DevTools → Network tab: verify API requests return 200 status.

---

## Muammolar / Troubleshooting

### CORS errors
- **Belgi / Symptom:** Browser console: `blocked by CORS policy`
- **Yechim / Fix:** Railway'da `CORS_ORIGIN` aniq domain bilan mos kelishini tekshiring (`https://` prefix bilan, `/` suffixsiz). Bir nechta origin uchun vergul bilan ajrating.

### 502 Bad Gateway on Railway
- **Belgi / Symptom:** Railway URL 502 qaytaradi
- **Yechim / Fix:** Railway → backend service → **Deployments** → oxirgi deploy → **View Logs**. Odatda Prisma migrate muvaffaqiyatsiz (noto'g'ri `DATABASE_URL`) yoki `JWT_SECRET` yo'q.

### DNS not propagating
- **Belgi / Symptom:** `uzrealestatepro.com` ochilmaydi
- **Yechim / Fix:** https://dnschecker.org da tekshiring. Agar barcha region'larda `76.76.21.21` ko'rinsa — DNS tayyor. Aks holda yana 15-30 daqiqa kuting. Ba'zan Namecheap'da 1 soatgacha vaqt ketadi.

### SSL not ready (NET::ERR_CERT_AUTHORITY_INVALID)
- **Belgi / Symptom:** HTTPS ishlamaydi, HTTP ishlaydi
- **Yechim / Fix:** DNS tarqalgach 5-10 daqiqa kuting — Vercel sertifikatni avtomatik o'rnatadi. Vercel → Domains sahifasida yashil qulf belgisi paydo bo'ladi.

### "Could not resolve host: github.com" in git push
- **Yechim / Fix:** Internet ulanishini tekshiring. Agar `Permission denied` bo'lsa — Personal Access Token (PAT) ishlatilganini tasdiqlang (1-bo'limga qarang) yoki SSH kalitni sozlang.

### Frontend build fails on Vercel
- **Yechim / Fix:** Vercel build log'ini tekshiring. `Root Directory = frontend` to'g'ri sozlanganligiga ishonch hosil qiling.

### Railway: "Prisma schema not found"
- **Yechim / Fix:** **Root Directory = backend** sozlanmagan. Settings → Root Directory → `backend` qiling va redeploy bosing.

---

## Keyingi qadamlar / Next Steps

- Cloudinary hisobini sozlang (rasm yuklash uchun)
- Google Maps API kalitini oling (xarita komponenti uchun)
- Railway'da log monitoring'ni sozlang
- Production DB backup strategy'sini o'ylang
