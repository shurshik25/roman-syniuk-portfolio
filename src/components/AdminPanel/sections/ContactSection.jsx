import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FormField from '../components/FormField'

const ContactSection = ({
  data,
  updateContent,
  updateNestedContent,
  updateArrayContent,
  addToHistory,
}) => {
  const [activeSubTab, setActiveSubTab] = useState('basic')
  const [localSocialData, setLocalSocialData] = useState(null)

  // Ініціалізуємо локальний стан соціальних мереж
  useEffect(() => {
    if (data?.social && !localSocialData) {
      console.log('ContactSection - ініціалізація localSocialData:', data.social)
      setLocalSocialData({ ...data.social })
    }
  }, [data?.social, localSocialData])

  if (!data) return null

  const subTabs = [
    { id: 'basic', label: 'Основна інформація', icon: '📧', color: 'bg-blue-100 text-blue-600' },
    { id: 'social', label: 'Соціальні мережі', icon: '🌐', color: 'bg-purple-100 text-purple-600' },
    { id: 'services', label: 'Послуги', icon: '💼', color: 'bg-green-100 text-green-600' },
  ]

  const handleFieldChange = (field, value) => {
    updateContent(field, value)
    addToHistory('edit', `Змінено "${field}" в контактах`)
  }

  const handleSocialChange = (platform, field, value) => {
    updateNestedContent('social', `${platform}.${field}`, value)
    addToHistory('edit', `Оновлено ${platform} в соціальних мережах`)
  }

  const handleServiceToggle = (index, service) => {
    const updatedService = { ...service, available: !service.available }
    updateArrayContent('projectAvailability', index, updatedService)
    addToHistory('edit', `Змінено доступність послуги "${service.service}"`)
  }

  const renderBasicTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Місцезнаходження"
          value={data.location || ''}
          onChange={value => handleFieldChange('location', value)}
          placeholder="Місто, країна"
          required
        />

        <FormField
          label="Email адреса"
          type="email"
          value={data.email || ''}
          onChange={value => handleFieldChange('email', value)}
          placeholder="your.email@example.com"
          required
          validation={[{ type: 'email', message: 'Введіть правильну email адресу' }]}
        />

        <FormField
          label="Номер телефону"
          value={data.phone || ''}
          onChange={value => handleFieldChange('phone', value)}
          placeholder="+380 XX XXX XX XX"
          helpText="Формат: +380 XX XXX XX XX"
        />
      </div>

      <FormField
        label="Додаткова інформація"
        type="textarea"
        value={data.note || ''}
        onChange={value => handleFieldChange('note', value)}
        placeholder="Додаткова інформація про співпрацю, доступність тощо..."
        rows={4}
        maxLength={500}
        showCharCount
      />

      {/* Preview */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <span className="text-purple-600">👁️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Попередній перегляд</h3>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600">📍</span>
            </div>
            <span className="text-gray-800">{data.location || 'Не вказано'}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600">📧</span>
            </div>
            <span className="text-gray-800">{data.email || 'Не вказано'}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600">📞</span>
            </div>
            <span className="text-gray-800">{data.phone || 'Не вказано'}</span>
          </div>
          {data.note && (
            <div className="pt-4 border-t border-gray-100">
              <p className="text-gray-700 text-sm">{data.note}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderSocialTab = () => {
    const socialPlatforms = [
      {
        key: 'facebook',
        label: 'Facebook',
        icon: '🔵',
        placeholder: 'https://facebook.com/username',
        usernamePrefix: '@',
        color: 'bg-blue-100 text-blue-600',
        hoverColor: 'hover:bg-blue-200',
      },
      {
        key: 'instagram',
        label: 'Instagram',
        icon: '🌈',
        placeholder: 'https://instagram.com/username',
        usernamePrefix: '@',
        color: 'bg-gradient-to-r from-pink-100 to-purple-100 text-pink-600',
        hoverColor: 'hover:from-pink-200 hover:to-purple-200',
      },
      {
        key: 'tiktok',
        label: 'TikTok',
        icon: '⚫',
        placeholder: 'https://tiktok.com/@username',
        usernamePrefix: '@',
        color: 'bg-gray-100 text-gray-800',
        hoverColor: 'hover:bg-gray-200',
      },
    ]

    return (
      <div className="space-y-6">
        {socialPlatforms.map(platform => {
          // Використовуємо локальний стан для тестування
          const socialData = localSocialData?.[platform.key] || data?.social?.[platform.key] || {}

          return (
            <motion.div
              key={platform.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${platform.color} ${platform.hoverColor} transition-colors`}>
                  <span className="text-xl">{platform.icon}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{platform.label}</h3>
                  <p className="text-sm text-gray-500">Налаштування профілю</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="URL профілю"
                  type="url"
                  value={socialData.url || ''}
                  onChange={value => handleSocialChange(platform.key, 'url', value)}
                  placeholder={platform.placeholder}
                  validation={[{ type: 'url', message: 'Введіть правильний URL' }]}
                />

                <FormField
                  label="Ім'я користувача"
                  value={socialData.username || ''}
                  onChange={value => handleSocialChange(platform.key, 'username', value)}
                  placeholder={`${platform.usernamePrefix}username`}
                />
              </div>

              <FormField
                label="Кількість підписників/Опис"
                value={socialData.followers || ''}
                onChange={value => handleSocialChange(platform.key, 'followers', value)}
                placeholder="2,4 тис. читачів або короткий опис"
              />

              {/* Preview */}
              {(socialData.url || socialData.username || socialData.followers) && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${platform.color} ${platform.hoverColor} transition-colors`}>
                        <span className="text-sm">{platform.icon}</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {socialData.username || platform.label}
                        </div>
                        <div className="text-sm text-gray-500">
                          {socialData.followers || 'Профіль'}
                        </div>
                      </div>
                    </div>
                    {socialData.url && (
                      <a
                        href={socialData.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                      >
                        Переглянути →
                      </a>
                    )}
                  </div>
                </div>
              )}


            </motion.div>
          )
        })}
      </div>
    )
  }

  const renderServicesTab = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl text-purple-600">💼</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Доступність послуг</h3>
        <p className="text-gray-600">Вкажіть, які послуги ви надаєте</p>
      </div>

      <div className="space-y-4">
        {data.projectAvailability?.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    service.available ? 'bg-green-100' : 'bg-gray-100'
                  }`}
                >
                  <span className={`text-xl ${
                    service.available ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {service.service.includes('Театральні')
                      ? '🎭'
                      : service.service.includes('Кінофільми')
                        ? '🎬'
                        : service.service.includes('Рекламні')
                          ? '📺'
                          : service.service.includes('Голосове')
                            ? '🎤'
                            : service.service.includes('Модельні')
                              ? '📸'
                              : '💼'}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{service.service}</h4>
                  <p className="text-sm text-gray-500">
                    {service.available ? 'Доступно для замовлення' : 'Наразі недоступно'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleServiceToggle(index, service)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  service.available ? 'bg-green-400' : 'bg-gray-300'
                }`}
              >
                <motion.div
                  className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm"
                  animate={{ x: service.available ? 24 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Statistics */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <span className="text-purple-600">📊</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Статистика послуг</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-white rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-600">
              {data.projectAvailability?.filter(s => s.available).length || 0}
            </div>
            <div className="text-sm text-gray-600">Доступно</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-gray-400">
              {data.projectAvailability?.filter(s => !s.available).length || 0}
            </div>
            <div className="text-sm text-gray-600">Недоступно</div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeSubTab) {
      case 'basic':
        return renderBasicTab()
      case 'social':
        return renderSocialTab()
      case 'services':
        return renderServicesTab()
      default:
        return renderBasicTab()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <span className="text-purple-600">📞</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Контактна інформація</h2>
        </div>
        <p className="text-gray-600">
          Управляйте своєю контактною інформацією та доступністю послуг
        </p>
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap gap-2">
        {subTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
              activeSubTab === tab.id
                ? `${tab.color} shadow-sm border border-current border-opacity-20`
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            <span className="text-sm">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default ContactSection
