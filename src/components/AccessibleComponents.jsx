import { forwardRef } from 'react'
import { motion } from 'framer-motion'

// Доступна кнопка
export const AccessibleButton = forwardRef(
  (
    {
      children,
      onClick,
      disabled = false,
      variant = 'primary',
      size = 'md',
      ariaLabel,
      ariaDescribedBy,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'

    const variants = {
      primary:
        'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500 disabled:bg-purple-300',
      secondary:
        'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 disabled:bg-gray-100',
      outline:
        'border-2 border-purple-600 text-purple-600 hover:bg-purple-50 focus:ring-purple-500 disabled:border-purple-300 disabled:text-purple-300',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    }

    return (
      <button
        ref={ref}
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
        }`}
        {...props}
      >
        {children}
      </button>
    )
  }
)

AccessibleButton.displayName = 'AccessibleButton'

// Доступне поле вводу
export const AccessibleInput = forwardRef(
  (
    { label, type = 'text', error, helperText, required = false, className = '', ...props },
    ref
  ) => {
    const id = props.id || `input-${Math.random().toString(36).substr(2, 9)}`
    const errorId = error ? `${id}-error` : undefined
    const helperId = helperText ? `${id}-helper` : undefined

    return (
      <div className={className}>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-label="обов'язкове поле">
              *
            </span>
          )}
        </label>

        <input
          ref={ref}
          id={id}
          type={type}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={[errorId, helperId].filter(Boolean).join(' ') || undefined}
          className={`w-full px-3 py-2 border rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
            error
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 hover:border-gray-400 focus:border-purple-500'
          }`}
          {...props}
        />

        {error && (
          <p id={errorId} role="alert" className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={helperId} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

AccessibleInput.displayName = 'AccessibleInput'

// Доступний модальний діалог
export const AccessibleModal = ({ isOpen, onClose, title, children, className = '' }) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`relative bg-white rounded-lg shadow-xl max-w-lg w-full p-6 ${className}`}
          role="document"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 id="modal-title" className="text-lg font-semibold">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label="Закрити модальне вікно"
              data-close
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {children}
        </motion.div>
      </div>
    </div>
  )
}

// Доступна навігація
export const AccessibleNav = ({ items, currentSection, className = '' }) => {
  return (
    <nav role="navigation" aria-label="Головна навігація" className={className}>
      <ul className="flex space-x-6">
        {items.map(item => (
          <li key={item.href}>
            <a
              href={item.href}
              className={`text-sm font-medium transition-colors duration-200 hover:text-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-md px-2 py-1 ${
                currentSection === item.section ? 'text-purple-600' : 'text-gray-700'
              }`}
              aria-current={currentSection === item.section ? 'page' : undefined}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

// Компонент для пропуску до контенту
export const SkipToContent = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-purple-600 focus:text-white focus:rounded-md focus:no-underline focus:shadow-lg"
    >
      Перейти до основного контенту
    </a>
  )
}

// Доступний progress bar
export const AccessibleProgressBar = ({ value, max = 100, label, className = '' }) => {
  const percentage = Math.round((value / max) * 100)

  return (
    <div className={className}>
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">{label}</span>
          <span className="text-sm text-gray-500">{percentage}%</span>
        </div>
      )}

      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || `Прогрес: ${percentage}%`}
        className="w-full bg-gray-200 rounded-full h-2"
      >
        <div
          className="bg-purple-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
