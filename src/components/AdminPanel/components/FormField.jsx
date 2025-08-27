import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { validationRules } from '../constants'

const FormField = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  required = false,
  disabled = false,
  rows = 3,
  maxLength,
  minLength,
  validation = [],
  options = [], // для select
  multiple = false, // для select
  showCharCount = false,
  helpText = '',
  className = '',
}) => {
  const [errors, setErrors] = useState([])
  const [isFocused, setIsFocused] = useState(false)
  const [isTouched, setIsTouched] = useState(false)

  // Мемоізуємо валідацію, щоб уникнути нескінченного циклу
  const memoizedValidation = useMemo(() => {
    if (!Array.isArray(validation)) return []
    return validation
  }, [JSON.stringify(validation)])

  // Валідація
  const validateField = useCallback(() => {
    if (!isTouched) return []

    const newErrors = []

    // Обов'язкове поле
    if (required) {
      const isValid = validationRules.required(value)
      if (!isValid) {
        newErrors.push("Це поле обов'язкове")
      }
    }

    // Кастомна валідація
    memoizedValidation.forEach(rule => {
      if (typeof rule === 'function') {
        const result = rule(value)
        if (result !== true && typeof result === 'string') {
          newErrors.push(result)
        }
      } else if (typeof rule === 'object') {
        const { type: ruleType, message, ...params } = rule
        const validator = validationRules[ruleType]
        if (validator && typeof validator === 'function') {
          try {
            let isValid

            // Визначаємо функції вищого порядку
            const higherOrderValidators = ['maxLength', 'minLength']

            if (Object.keys(params).length > 0 && higherOrderValidators.includes(ruleType)) {
              // Для функцій вищого порядку передаємо параметри
              const paramValues = Object.values(params)
              if (paramValues.length === 1) {
                isValid = validator(paramValues[0])(value)
              } else {
                // Якщо кілька параметрів, передаємо їх як об'єкт
                isValid = validator(params)(value)
              }
            } else {
              // Для звичайних функцій просто передаємо значення
              isValid = validator(value)
            }

            if (!isValid) {
              newErrors.push(message || `Невірне значення для ${label}`)
            }
          } catch (error) {
            console.warn(`Validation error for ${ruleType}:`, error)
            newErrors.push(message || `Помилка валідації для ${label}`)
          }
        }
      }
    })

    // Валідація довжини
    if (maxLength && value && typeof value === 'string' && value.length > maxLength) {
      newErrors.push(`Максимальна довжина: ${maxLength} символів`)
    }

    if (minLength && value && typeof value === 'string' && value.length < minLength) {
      newErrors.push(`Мінімальна довжина: ${minLength} символів`)
    }

    return newErrors
  }, [value, required, memoizedValidation, maxLength, minLength, label, isTouched])

  useEffect(() => {
    const newErrors = validateField()
    setErrors(newErrors)
  }, [validateField])

  const handleChange = e => {
    const newValue = multiple
      ? Array.from(e.target.selectedOptions, option => option.value)
      : e.target.value

    if (onChange && typeof onChange === 'function') {
      onChange(newValue)
    } else {
      console.error(`FormField: onChange is not a function for ${label}`)
    }

    if (!isTouched) setIsTouched(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
    if (!isTouched) setIsTouched(true)
  }

  const hasError = errors.length > 0
  const characterCount = value && typeof value === 'string' ? value.length : 0

  const baseInputClasses = `
    w-full px-4 py-3 border rounded-xl transition-all duration-200
    focus:ring-2 focus:ring-purple-500 focus:border-transparent
    ${
      hasError
        ? 'border-red-300 bg-red-50 focus:ring-red-500'
        : isFocused
          ? 'border-purple-300 bg-purple-50'
          : 'border-gray-300 bg-white hover:border-gray-400'
    }
    ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}
    ${className}
  `

  const renderInput = () => {
    const commonProps = {
      value: value || '',
      onChange: handleChange,
      onFocus: () => setIsFocused(true),
      onBlur: handleBlur,
      placeholder,
      required,
      disabled,
      className: type === 'textarea' ? `${baseInputClasses} resize-none` : baseInputClasses
    }

    switch (type) {
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            rows={rows}
            maxLength={maxLength}
          />
        )

      case 'select':
        return (
          <select
            {...commonProps}
            value={multiple ? (value || []) : (value || '')}
            multiple={multiple}
          >
            {!multiple && <option value="">Оберіть опцію...</option>}
            {Array.isArray(options) && options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )

      case 'number':
        return (
          <input
            {...commonProps}
            type="number"
            max={maxLength}
            min={minLength}
          />
        )

      default:
        return (
          <input
            {...commonProps}
            type={type}
            maxLength={maxLength}
            minLength={minLength}
          />
        )
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2 form-field"
    >
      {/* Label */}
      <label className="block text-sm font-medium text-gray-900 select-none">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Input */}
      <div className="relative">
        {renderInput()}

        {/* Character count */}
        {showCharCount && maxLength && (
          <div
            className={`absolute right-3 top-3 text-xs select-none ${
              characterCount > maxLength * 0.9 ? 'text-red-500' : 'text-gray-600'
            }`}
          >
            {characterCount}/{maxLength}
          </div>
        )}
      </div>

      {/* Help text */}
      {helpText && <p className="text-sm text-gray-700 help-text select-none">{helpText}</p>}

      {/* Errors */}
      {hasError && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-1"
        >
          {errors.map((error, index) => (
            <p key={index} className="text-sm text-red-600 flex items-center gap-1 select-none">
              ⚠️ {error}
            </p>
          ))}
        </motion.div>
      )}

      {/* Success indicator */}
      {isTouched && !hasError && value && value.toString().trim() !== '' && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-green-600 flex items-center gap-1 select-none"
        >
          ✓ Поле заповнено правильно
        </motion.p>
      )}
    </motion.div>
  )
}

export default FormField
