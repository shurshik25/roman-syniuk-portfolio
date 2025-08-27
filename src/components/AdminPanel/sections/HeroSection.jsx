
import { motion } from 'framer-motion'
import FormField from '../components/FormField'
import ImageUpload from '../components/ImageUpload'
import StatsEditor from '../components/StatsEditor'
import { getImageWithFallback, handleImageError } from '../../../utils/imageHelpers'

const HeroSection = ({ data, updateContent, onImageUpload, addToHistory }) => {
  if (!data) return null

  const handleFieldChange = (field, value) => {
    if (updateContent && typeof updateContent === 'function') {
      updateContent(field, value)
      addToHistory('edit', `Змінено поле "${field}" в головній секції`)
    } else {
      console.error('HeroSection: updateContent is not a function!')
    }
  }

  const handleImageChange = file => {
    onImageUpload(file, {
      section: 'hero',
      field: 'profileImage',
      imageType: 'profile',
    })
  }

  const handleStatsChange = stats => {
    updateContent('stats', stats)
    addToHistory('edit', 'Оновлено статистику в головній секції')
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Головна секція</h2>
        <p className="text-gray-700">
          Основна інформація, яка відображається на головній сторінці вашого портфоліо
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Info */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            📝 Основна інформація
          </h3>

          <FormField
            label="Ім'я"
            value={data.name || ''}
            onChange={value => handleFieldChange('name', value)}
            placeholder="Ваше повне ім'я"
            required
          />

          <FormField
            label="Заголовок/Професія"
            value={data.title || ''}
            onChange={value => handleFieldChange('title', value)}
            placeholder="Наприклад: Актор театру та кіно"
            required
          />

          <FormField
            label="Опис"
            type="textarea"
            value={data.description || ''}
            onChange={value => handleFieldChange('description', value)}
            placeholder="Короткий опис вашої діяльності та досягнень"
            rows={4}
            maxLength={500}
            showCharCount
          />
        </div>

        {/* Profile Image */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            🖼️ Профільне зображення
          </h3>

          <ImageUpload
            currentImage={data.profileImage}
            onImageChange={handleImageChange}
            aspectRatio="1:1"
            maxSize={5}
            acceptedFormats={['JPG', 'PNG', 'WebP']}
            placeholder="Додайте ваше професійне фото"
          />

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">💡 Поради для фото:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Використовуйте професійне освітлення</li>
              <li>• Оберіть нейтральний фон</li>
              <li>• Розмір зображення: мінімум 400x400px</li>
              <li>• Формат: JPG або PNG</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          📊 Статистика досягнень
        </h3>

        <StatsEditor
          stats={data.stats || {}}
          onChange={handleStatsChange}
          fields={[
            { key: 'roles', label: 'Зіграні ролі', suffix: '+', type: 'number' },
            { key: 'experience', label: 'Років досвіду', suffix: '+', type: 'number' },
            { key: 'availability', label: 'Доступність', suffix: '%', type: 'number', max: 100 },
          ]}
        />

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">ℹ️ Інформація:</h4>
          <p className="text-sm text-gray-700">
            Статистика відображається у вигляді анімованих лічильників на головній сторінці.
            Використовуйте округлені числа для кращого сприйняття.
          </p>
        </div>
      </div>

      {/* Preview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          👁️ Попередній перегляд
        </h3>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-6">
            {getImageWithFallback(data.profileImage, 'profile') !== '/images/placeholder.svg' && (
              <img
                src={getImageWithFallback(data.profileImage, 'profile')}
                alt="Профільне фото"
                className="w-20 h-20 rounded-full object-cover border-2 border-purple-200"
                onError={e => handleImageError(e)}
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{data.name}</h1>
              <p className="text-purple-600 font-medium">{data.title}</p>
              <p className="text-gray-700 mt-2 text-sm">{data.description}</p>
            </div>
          </div>

          {data.stats && (
            <div className="flex gap-6 mt-6 pt-6 border-t border-gray-100">
              {Object.entries(data.stats).map(([key, value]) => (
                <div key={key} className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{value}</div>
                  <div className="text-sm text-gray-500 capitalize">{key}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default HeroSection
