# 🚀 Deployment Guide

Цей документ описує процес деплою портфоліо актора на різні платформи.

## 📋 Передумови

- Node.js 18+ 
- npm або yarn
- Git

## 🏗️ Збірка для продакшн

```bash
# Встановлення залежностей
npm install

# Збірка для продакшн
npm run build

# Локальний прев'ю
npm run preview
```

## 🌐 Платформи для деплою

### 1. Netlify (Рекомендовано)

```bash
# Встановлення Netlify CLI
npm install -g netlify-cli

# Логін
netlify login

# Деплой
netlify deploy --prod --dir=dist
```

**Автоматичний деплой:**
1. Підключіть GitHub репозиторій до Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`

### 2. Vercel

```bash
# Встановлення Vercel CLI
npm install -g vercel

# Деплой
vercel --prod
```

### 3. GitHub Pages

Включено в GitHub Actions workflow. Автоматично деплоїться на кожний push до main.

### 4. Firebase Hosting

```bash
# Встановлення Firebase CLI
npm install -g firebase-tools

# Логін
firebase login

# Ініціалізація
firebase init hosting

# Деплой
firebase deploy --only hosting
```

**firebase.json:**
```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### 5. AWS S3 + CloudFront

```bash
# Встановлення AWS CLI
pip install awscli

# Конфігурація
aws configure

# Синхронізація з S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Інвалідація CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## 🔧 Налаштування середовища

### Environment Variables

Створіть `.env.production` файл:

```env
# Google Analytics
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX

# Site URL
VITE_SITE_URL=https://your-domain.com

# Contact API
VITE_CONTACT_API_URL=https://api.your-domain.com/contact

# Features
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_PWA=true
```

### Кастомний домен

**Netlify:**
```bash
# Додати кастомний домен
netlify domains:create your-domain.com
```

**GitHub Pages:**
```bash
# Додати CNAME файл
echo "your-domain.com" > dist/CNAME
```

## 🎯 SEO оптимізація

### Обов'язкові кроки:

1. **Оновити meta теги** в `src/components/SEO.jsx`
2. **Налаштувати sitemap** в CI/CD pipeline
3. **Додати Google Analytics** ID
4. **Налаштувати robots.txt**

### Приклад robots.txt:
```
User-agent: *
Allow: /

Sitemap: https://your-domain.com/sitemap.xml

# Заборонити доступ до адмін панелі
Disallow: /admin
```

## 📊 Моніторинг

### Google Analytics 4
1. Створіть GA4 property
2. Отримайте Measurement ID
3. Додайте до `.env.production`

### Web Vitals
Автоматично відстежуються через встроєний код в `src/utils/analytics.js`

### Error Tracking
Налаштуйте Sentry або аналогічний сервіс:

```javascript
// src/utils/errorTracking.js
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: process.env.NODE_ENV,
});
```

## 🔒 Безпека

### CSP Headers

**Netlify (_headers файл):**
```
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
```

### HTTPS
Завжди використовуйте HTTPS в продакшн. Всі рекомендовані платформи автоматично надають SSL сертифікати.

## 🚀 CI/CD Pipeline

GitHub Actions автоматично:
- ✅ Запускає тести
- ✅ Перевіряє код (lint)
- ✅ Будує додаток
- ✅ Деплоїть на продакшн
- ✅ Запускає Lighthouse аудит
- ✅ Створює preview для PR

### Налаштування секретів

Додайте в GitHub Secrets:
```
NETLIFY_AUTH_TOKEN=your_netlify_token
NETLIFY_SITE_ID=your_site_id
SNYK_TOKEN=your_snyk_token (опціонально)
```

## 📱 PWA

Додаток автоматично підтримує PWA:
- ✅ Service Worker
- ✅ Web App Manifest
- ✅ Offline support
- ✅ Install prompt

## 🐛 Troubleshooting

### Поширені проблеми:

**1. Build fails with memory error:**
```bash
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

**2. Routing не працює після деплою:**
Переконайтеся що налаштовані redirects для SPA:

**Netlify (_redirects файл):**
```
/*    /index.html   200
```

**3. Зображення не завантажуються:**
Перевірте що всі зображення в папці `public/` і використовуються абсолютні шляхи.

## 📈 Performance Tips

1. **Preload критичних ресурсів**
2. **Lazy load зображень**
3. **Code splitting**
4. **Compression (gzip/brotli)**
5. **CDN для статичних файлів**

## 🔧 Maintenance

### Регулярні завдання:
- Оновлення залежностей (`npm audit`)
- Моніторинг Core Web Vitals
- Перевірка accessibility scores
- Backup контенту

---

**💡 Tip:** Використовуйте `npm run analyze` для аналізу розміру bundle перед деплоєм.
