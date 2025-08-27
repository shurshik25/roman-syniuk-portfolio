# 🎨 UI/UX Покращення для Портфоліо

## ✨ Що додано

### 1. 🎭 Анімації переходів між сторінками
- **Framer Motion** інтеграція
- **PageTransition** компонент для плавних переходів
- Анімації `fadeIn`, `slideUp`, `scale` ефекти

### 2. 💀 Skeleton Loading стани
- **Skeleton** компоненти для різних типів контенту
- **SkeletonText**, **SkeletonCard**, **SkeletonGrid**
- Анімовані `pulse` ефекти під час завантаження

### 3. 🍞 Toast повідомлення
- **Toast** система з різними типами (success, error, warning, info)
- **useToast** хук для легкого використання
- Автоматичне закриття та ручне управління

### 4. 🔲 Модальні вікна
- **Modal** компонент з різними розмірами
- Анімовані відкриття/закриття
- Блокування скролу body
- Responsive дизайн

### 5. 🌙 Dark Mode тема
- **ThemeContext** для управління темою
- Автоматичне збереження в localStorage
- Перевірка системних налаштувань
- Toggle кнопка в Navbar

### 6. 📱 Responsive дизайн
- Mobile-first підхід
- Адаптивні компоненти
- Touch-friendly інтерфейс

## 🚀 Як використовувати

### Анімації
```jsx
import PageTransition from './components/PageTransition'

<PageTransition>
  <YourComponent />
</PageTransition>
```

### Skeleton Loading
```jsx
import { SkeletonGrid, SkeletonCard } from './components/Skeleton'

{isLoading ? (
  <SkeletonGrid items={6} />
) : (
  <YourContent />
)}
```

### Toast повідомлення
```jsx
import { useToast } from './components/Toast'

const { showSuccess, showError, showWarning, showInfo } = useToast()

// Використання
showSuccess('Успішно збережено!')
showError('Щось пішло не так')
```

### Модальні вікна
```jsx
import Modal from './components/Modal'

<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Заголовок"
  size="lg"
>
  <YourModalContent />
</Modal>
```

### Dark Mode
```jsx
import { useTheme } from './contexts/ThemeContext'

const { isDark, toggleTheme } = useTheme()

// Toggle кнопка
<button onClick={toggleTheme}>
  {isDark ? '☀️' : '🌙'}
</button>
```

## 🎨 Tailwind CSS класи

### Dark Mode
```css
.dark .bg-white { @apply bg-dark-surface; }
.dark .text-gray-900 { @apply text-dark-text; }
.dark .border-gray-200 { @apply border-dark-border; }
```

### Анімації
```css
.animate-fadeIn { animation: fadeIn 0.6s ease-out; }
.animate-slideUp { animation: slideUp 0.8s ease-out; }
.animate-pulse-slow { animation: pulse 3s infinite; }
```

## 🔧 Налаштування

### 1. Встановлення залежностей
```bash
npm install framer-motion
```

### 2. Tailwind конфіг
```js
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0f172a',
          surface: '#1e293b',
          border: '#334155',
          text: '#f1f5f9',
          'text-secondary': '#94a3b8',
        }
      }
    }
  }
}
```

### 3. CSS змінні
```css
/* index.css */
.dark body {
  @apply bg-dark-bg text-dark-text;
}

.dark .gradient-bg {
  @apply bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900;
}
```

## 📱 Responsive Breakpoints

- **Mobile**: `< 768px`
- **Tablet**: `768px - 1024px`
- **Desktop**: `> 1024px`

## 🎯 Best Practices

1. **Анімації**: Використовуй `whileInView` для елементів, що з'являються при скролі
2. **Skeleton**: Показуй skeleton під час завантаження даних
3. **Toast**: Використовуй для важливих дій користувача
4. **Modal**: Блокуй скрол body при відкритому модалі
5. **Dark Mode**: Зберігай вибір користувача в localStorage

## 🐛 Відомі проблеми

- Framer Motion може сповільнити рендеринг на слабких пристроях
- Dark mode toggle може блимати при першому завантаженні
- Skeleton анімації можуть не працювати в деяких браузерах

## 🔮 Майбутні покращення

- [ ] Lazy loading для анімацій
- [ ] Prefers-reduced-motion підтримка
- [ ] Більше анімаційних варіантів
- [ ] Кастомні easing функції
- [ ] Intersection Observer оптимізація
