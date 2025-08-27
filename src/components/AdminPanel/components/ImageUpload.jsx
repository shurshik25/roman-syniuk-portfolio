import { useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ImageUpload = ({
  currentImage,
  onImageChange,
  aspectRatio = '16:9',
  maxSize = 5, // MB
  acceptedFormats = ['JPG', 'PNG', 'WebP'],
  placeholder = 'Додайте зображення',
  disabled = false,
  showPreview = true,
  className = '',
}) => {
  const fileInputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const validateFile = useCallback(
    file => {
      // Перевірка типу файлу
      if (!file.type.startsWith('image/')) {
        return 'Оберіть файл зображення'
      }

      // Перевірка формату
      const fileExtension = file.name.split('.').pop().toLowerCase()
      const allowedExtensions = acceptedFormats.map(format => format.toLowerCase())
      if (!allowedExtensions.some(ext => ext === fileExtension || `${ext}g` === fileExtension)) {
        return `Дозволені формати: ${acceptedFormats.join(', ')}`
      }

      // Перевірка розміру
      const maxBytes = maxSize * 1024 * 1024
      if (file.size > maxBytes) {
        return `Максимальний розмір файлу: ${maxSize}MB`
      }

      return null
    },
    [acceptedFormats, maxSize]
  )

  const handleFileSelect = useCallback(
    async file => {
      setError('')
      setSuccess(false)

      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        return
      }

      setUploading(true)

      try {
        await onImageChange(file)
        setError('')
        setSuccess(true)
        // Автоматично приховуємо повідомлення про успіх через 3 секунди
        setTimeout(() => setSuccess(false), 3000)
      } catch (err) {
        if (err.message) {
          setError(err.message)
        } else {
          setError('Помилка завантаження файлу')
        }
        console.error('Upload error:', err)
      } finally {
        setUploading(false)
      }
    },
    [validateFile, onImageChange]
  )

  const handleDrop = useCallback(
    e => {
      e.preventDefault()
      setDragOver(false)

      if (disabled) return

      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) {
        handleFileSelect(files[0])
      }
    },
    [disabled, handleFileSelect]
  )

  const handleDragOver = useCallback(
    e => {
      e.preventDefault()
      if (!disabled) {
        setDragOver(true)
      }
    },
    [disabled]
  )

  const handleDragLeave = useCallback(e => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const handleInputChange = useCallback(
    e => {
      const files = Array.from(e.target.files)
      if (files.length > 0) {
        handleFileSelect(files[0])
      }
    },
    [handleFileSelect]
  )

  const openFileDialog = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }, [disabled])

  const removeImage = useCallback(() => {
    onImageChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setError('')
    setSuccess(false)
  }, [onImageChange])

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case '1:1':
        return 'aspect-square'
      case '4:3':
        return 'aspect-[4/3]'
      case '3:2':
        return 'aspect-[3/2]'
      case '16:9':
        return 'aspect-video'
      default:
        return 'aspect-video'
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-xl transition-all duration-200
          ${getAspectRatioClass()}
          ${
            dragOver
              ? 'border-purple-400 bg-purple-50'
              : error
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300 bg-gray-50 hover:border-gray-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          disabled={disabled}
          className="hidden"
        />

        {uploading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"
            />
            <span className="ml-3 text-purple-600">Завантаження...</span>
          </div>
        ) : currentImage && showPreview ? (
          <div className="relative w-full h-full group">
            <img
              src={currentImage}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
              <div className="flex gap-2">
                <button
                  onClick={e => {
                    e.stopPropagation()
                    openFileDialog()
                  }}
                  className="px-3 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                >
                  ✏️ Змінити
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation()
                    removeImage()
                  }}
                  className="px-3 py-2 bg-red-500/80 text-white rounded-lg hover:bg-red-500 transition-colors"
                >
                  🗑️ Видалити
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600">
            <motion.div
              animate={dragOver ? { scale: 1.1 } : { scale: 1 }}
              className="text-4xl mb-3"
            >
              📸
            </motion.div>
            <div className="text-center">
              <p className="font-medium mb-1">{placeholder}</p>
              <p className="text-sm">Перетягніть файл сюди або клацніть для вибору</p>
              <p className="text-xs mt-2">
                Формати: {acceptedFormats.join(', ')} • Макс. {maxSize}MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-3"
          >
            <p className="text-red-600 text-sm flex items-center gap-2">⚠️ {error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Message */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-green-50 border border-green-200 rounded-lg p-3"
          >
            <p className="text-green-600 text-sm flex items-center gap-2">
              ✅ Зображення успішно завантажено!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h4 className="font-medium text-blue-900 mb-1">📝 Рекомендації:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Співвідношення сторін: {aspectRatio}</li>
          <li>• Оптимальна роздільність: 1920x1080px або вище</li>
          <li>• Використовуйте якісні зображення з хорошим освітленням</li>
          <li>• Уникайте розмитих або темних фотографій</li>
        </ul>
      </div>
    </div>
  )
}

export default ImageUpload
