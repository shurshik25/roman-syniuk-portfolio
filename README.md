# 🎭 Портфоліо Актора - Роман Синюк

Професійне портфоліо актора театру та кіно з Хмельницького, створене на React та Vite.

## ✨ Особливості

- 🎨 **Сучасний дизайн** - адаптивний інтерфейс з анімаціями
- 📱 **PWA підтримка** - можна встановити як додаток
- 🛠️ **Адмін панель** - управління контентом без коду
- 🖼️ **Галерея робіт** - театр, кіно, фотосесії
- 📹 **Відео репертуар** - з підтримкою YouTube
- 🌐 **Соціальні мережі** - інтеграція з Facebook, Instagram, TikTok

## 🚀 Технології

- **Frontend**: React 18, Vite 5
- **Стилі**: Tailwind CSS
- **Анімації**: Framer Motion
- **PWA**: Workbox
- **Зображення**: Responsive Image Optimization

## 📦 Встановлення

   ```bash
# Клонувати репозиторій
git clone https://github.com/your-username/actor-portfolio.git

# Перейти в папку проекту
cd actor-portfolio

# Встановити залежності
   npm install

# Запустити в режимі розробки
npm run dev

# Зібрати для продакшену
npm run build
```

## 🎯 Використання

### Розробка
   ```bash
npm run dev          # Запуск dev сервера
npm run build        # Збірка проекту
npm run lint         # Перевірка коду
npm run preview      # Попередній перегляд збірки
```

### Адмін панель
- Натисніть `Ctrl + Shift + A` для відкриття адмін панелі
- Редагуйте контент без необхідності знати код
- Змінюйте тексти, зображення, додавайте нові роботи

## 📁 Структура проекту

```
src/
├── components/          # React компоненти
│   ├── AdminPanel/     # Адмін панель
│   ├── Hero.jsx        # Головна секція
│   ├── About.jsx       # Про мене
│   ├── Portfolio.jsx   # Портфоліо робіт
│   ├── Contact.jsx     # Контакти
│   └── ...
├── hooks/              # React хуки
├── utils/              # Утиліти
├── constants.js        # Константи
└── App.jsx            # Головний компонент
```

## 🌐 Розгортання

### GitHub Pages
```bash
# Встановити gh-pages
npm install --save-dev gh-pages

# Додати в package.json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}

# Розгорнути
npm run deploy
```

### Admin Panel Content Updates
Для оновлення контенту через Адмін панель:

1. **Створіть GitHub Personal Access Token:**
   - Перейдіть на https://github.com/settings/tokens
   - Створіть новий токен з правами `repo` та `workflow`
   - Скопіюйте токен

2. **Створіть .env файл:**
   ```bash
   REACT_APP_GITHUB_TOKEN=your_token_here
   ```

3. **Перезапустіть dev сервер:**
   ```bash
   npm run dev
   ```

4. **Тепер зміни в Адмін панелі автоматично:**
   - Зберігаються в localStorage
   - Відправляються в GitHub через API
   - Запускають GitHub Actions для оновлення content.json
   - Перебудовують та деплоять сайт

**Важливо:** Токен має бути секретним! Не комітьте .env файл!

### Netlify
- Підключити GitHub репозиторій
- Build command: `npm run build`
- Publish directory: `dist`

### Vercel
- Підключити GitHub репозиторій
- Framework preset: Vite
- Build command: `npm run build`

## 📝 Ліцензія

MIT License - дивіться [LICENSE](LICENSE) файл для деталей.

## 👨‍💻 Автор

**Роман Синюк** - актор театру та кіно з Хмельницького

- 📧 Email: roma.sinuk@example.com
- 📍 Локація: Хмельницький, Україна
- 🌐 Соцмережі: Facebook, Instagram, TikTok

## 🤝 Внесок

Вітаються внески! Будь ласка:

1. Форкніть репозиторій
2. Створіть feature branch (`git checkout -b feature/AmazingFeature`)
3. Зробіть commit змін (`git commit -m 'Add some AmazingFeature'`)
4. Push в branch (`git push origin feature/AmazingFeature`)
5. Відкрийте Pull Request

## 📞 Підтримка

Якщо у вас є питання або пропозиції, створіть [Issue](https://github.com/your-username/actor-portfolio/issues) або зверніться безпосередньо.

---

⭐ **Не забудьте поставити зірку репозиторію, якщо він вам сподобався!**
