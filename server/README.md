# Portfolio Backend API

Backend сервер для адмін панелі портфоліо з SQLite базою даних.

## 🚀 Швидкий старт

### Встановлення залежностей
```bash
npm install
```

### Запуск сервера
```bash
# Розробка (з автоперезавантаженням)
npm run dev

# Продакшн
npm start
```

Сервер запуститься на порту 3001: `http://localhost:3001`

## 📊 База даних

### Структура таблиць

#### `content` - основні поля контенту
- `id` - унікальний ідентифікатор
- `section` - секція (hero, about, contact, portfolio, videoRepertoire)
- `field` - поле в секції
- `value` - значення (JSON або текст)
- `created_at` - час створення
- `updated_at` - час останнього оновлення

#### `array_items` - елементи масивів
- `id` - унікальний ідентифікатор
- `section` - секція
- `field` - поле масиву
- `item_index` - індекс елемента
- `item_data` - дані елемента (JSON)

## 🔌 API Endpoints

### Отримання контенту
- `GET /api/content` - весь контент
- `GET /api/content/:section` - контент конкретної секції

### Оновлення контенту
- `PUT /api/content/:section/:field` - оновлення поля
- `PUT /api/content/:section/:field/:subField` - оновлення вкладеного поля
- `PUT /api/content/:section/:field/:index` - оновлення елемента масиву

### Робота з масивами
- `POST /api/content/:section/:field` - додавання елемента
- `DELETE /api/content/:section/:field/:index` - видалення елемента

### Статус
- `GET /api/health` - перевірка стану сервера

## 🔧 Налаштування

### Змінні середовища
- `PORT` - порт сервера (за замовчуванням 3001)

### CORS
Сервер налаштований для роботи з фронтендом на `localhost:3000`

## 📁 Структура проекту
```
server/
├── server.js          # Основний файл сервера
├── package.json       # Залежності
├── portfolio.db       # SQLite база даних (створюється автоматично)
└── README.md          # Ця документація
```

## 🚀 Деплой

### Локальний розвиток
```bash
npm run dev
```

### Продакшн
```bash
npm start
```

### Docker (опціонально)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 🔒 Безпека

- CORS налаштований для локальної розробки
- Валідація вхідних даних
- SQL injection захист через параметризовані запити

## 📝 Приклади використання

### Оновлення імені в Hero секції
```bash
curl -X PUT http://localhost:3001/api/content/hero/name \
  -H "Content-Type: application/json" \
  -d '{"value": "Нове ім\'я"}'
```

### Додавання роботи в Portfolio
```bash
curl -X POST http://localhost:3001/api/content/portfolio/works \
  -H "Content-Type: application/json" \
  -d '{"item": {"title": "Нова робота", "description": "Опис"}}'
```

## 🐛 Відладка

### Логи
Сервер виводить детальні логи в консоль:
- Підключення до бази даних
- API запити
- Помилки та попередження

### База даних
SQLite файл `portfolio.db` створюється автоматично при першому запуску.

## 📞 Підтримка

При проблемах перевірте:
1. Чи запущений сервер
2. Чи доступний порт 3001
3. Логи в консолі сервера
4. Статус API: `GET /api/health`
