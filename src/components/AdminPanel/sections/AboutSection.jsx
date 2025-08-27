import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FormField from '../components/FormField'

const AboutSection = ({
  data,
  updateContent,
  updateArrayContent,
  addArrayItem,
  removeArrayItem,
  addToHistory,
}) => {
  const [activeSubTab, setActiveSubTab] = useState('personalInfo')

  if (!data) return null

  const subTabs = [
    { id: 'personalInfo', label: 'Персональна інформація', icon: '👤' },
    { id: 'biography', label: 'Біографія', icon: '📝' },
    { id: 'education', label: 'Освіта', icon: '🎓' },
    { id: 'experience', label: 'Досвід', icon: '💼' },
    { id: 'skills', label: 'Навички', icon: '⚡' },
    { id: 'achievements', label: 'Досягнення', icon: '🏆' },
  ]

  const handleFieldChange = (field, value) => {
    updateContent(field, value)
    addToHistory('edit', `Змінено "${field}" в секції "Про мене"`)
  }

  const handleArrayItemAdd = (field, newItem) => {
    addArrayItem(field, newItem)
    addToHistory('add', `Додано новий елемент до "${field}"`)
  }

  const handleArrayItemUpdate = (field, index, updatedItem) => {
    updateArrayContent(field, index, updatedItem)
    addToHistory('edit', `Оновлено елемент в "${field}"`)
  }

  const handleArrayItemRemove = (field, index) => {
    removeArrayItem(field, index)
    addToHistory('edit', `Видалено елемент з "${field}"`)
  }

  const handlePersonalInfoChange = (field, value) => {
    const personalInfo = { ...data.personalInfo, [field]: value }
    updateContent('personalInfo', personalInfo)
    addToHistory('edit', `Змінено "${field}" в персональній інформації`)
  }

  const handleLanguageChange = (index, field, value) => {
    const languages = [...(data.personalInfo?.languages || [])]
    languages[index] = { ...languages[index], [field]: value }
    handlePersonalInfoChange('languages', languages)
  }

  const addLanguage = () => {
    const languages = [...(data.personalInfo?.languages || []), { language: '', level: '' }]
    handlePersonalInfoChange('languages', languages)
    addToHistory('add', 'Додано нову мову')
  }

  const removeLanguage = (index) => {
    const languages = data.personalInfo?.languages?.filter((_, i) => i !== index) || []
    handlePersonalInfoChange('languages', languages)
    addToHistory('delete', 'Видалено мову')
  }

  const addSpecialSkill = () => {
    const skills = [...(data.personalInfo?.specialSkills || []), '']
    handlePersonalInfoChange('specialSkills', skills)
    addToHistory('add', 'Додано нову спеціальну навичку')
  }

  const updateSpecialSkill = (index, value) => {
    const skills = [...(data.personalInfo?.specialSkills || [])]
    skills[index] = value
    handlePersonalInfoChange('specialSkills', skills)
  }

  const removeSpecialSkill = (index) => {
    const skills = data.personalInfo?.specialSkills?.filter((_, i) => i !== index) || []
    handlePersonalInfoChange('specialSkills', skills)
    addToHistory('delete', 'Видалено спеціальну навичку')
  }

  const renderPersonalInfoTab = () => (
    <div className="space-y-8">
      {/* Основна інформація */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
          ℹ️ Основна інформація
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FormField
            label="Вік"
            type="number"
            value={data.personalInfo?.age || ''}
            onChange={value => handlePersonalInfoChange('age', value)}
            placeholder="25"
          />
          <FormField
            label="Дата народження"
            type="date"
            value={data.personalInfo?.birthDate || ''}
            onChange={value => handlePersonalInfoChange('birthDate', value)}
          />
          <FormField
            label="Місце народження"
            value={data.personalInfo?.birthPlace || ''}
            onChange={value => handlePersonalInfoChange('birthPlace', value)}
            placeholder="Місто, країна"
          />
        </div>
      </div>

      {/* Фізичні характеристики */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
          📏 Фізичні характеристики
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FormField
            label="Зріст (см)"
            type="number"
            value={data.personalInfo?.height || ''}
            onChange={value => handlePersonalInfoChange('height', value)}
            placeholder="178"
          />
          <FormField
            label="Вага (кг)"
            type="number"
            value={data.personalInfo?.weight || ''}
            onChange={value => handlePersonalInfoChange('weight', value)}
            placeholder="72"
          />
          <FormField
            label="Колір очей"
            value={data.personalInfo?.eyeColor || ''}
            onChange={value => handlePersonalInfoChange('eyeColor', value)}
            placeholder="Карі"
          />
          <FormField
            label="Колір волосся"
            value={data.personalInfo?.hairColor || ''}
            onChange={value => handlePersonalInfoChange('hairColor', value)}
            placeholder="Темно-каштанові"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <FormField
            label="Статура"
            value={data.personalInfo?.physique || ''}
            onChange={value => handlePersonalInfoChange('physique', value)}
            placeholder="Атлетичний"
          />
          <FormField
            label="Розмір сорочки"
            value={data.personalInfo?.shirtSize || ''}
            onChange={value => handlePersonalInfoChange('shirtSize', value)}
            placeholder="L"
          />
          <FormField
            label="Розмір штанів"
            value={data.personalInfo?.pantsSize || ''}
            onChange={value => handlePersonalInfoChange('pantsSize', value)}
            placeholder="32"
          />
          <FormField
            label="Розмір взуття"
            value={data.personalInfo?.shoeSize || ''}
            onChange={value => handlePersonalInfoChange('shoeSize', value)}
            placeholder="43"
          />
        </div>
      </div>

      {/* Мови */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            🌍 Знання мов
          </h3>
          <button
            onClick={addLanguage}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            ➕ Додати мову
          </button>
        </div>
        <div className="space-y-4">
          {data.personalInfo?.languages?.map((lang, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg"
            >
              <FormField
                label="Мова"
                value={lang.language || ''}
                onChange={value => handleLanguageChange(index, 'language', value)}
                placeholder="Українська"
              />
              <div className="flex gap-4 items-end">
                <FormField
                  label="Рівень"
                  type="select"
                  value={lang.level || ''}
                  onChange={value => handleLanguageChange(index, 'level', value)}
                  options={[
                    { value: '', label: 'Оберіть рівень' },
                    { value: 'Рідна', label: 'Рідна' },
                    { value: 'Вільно', label: 'Вільно' },
                    { value: 'Добре', label: 'Добре' },
                    { value: 'Середній', label: 'Середній' },
                    { value: 'Базовий', label: 'Базовий' }
                  ]}
                />
                <button
                  onClick={() => removeLanguage(index)}
                  className="mb-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  🗑️
                </button>
              </div>
            </motion.div>
          ))}
          {(!data.personalInfo?.languages || data.personalInfo.languages.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-3xl mb-2">🌍</div>
              <p>Додайте мови, якими ви володієте</p>
            </div>
          )}
        </div>
      </div>

      {/* Спеціальні навички */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            🎯 Спеціальні навички
          </h3>
          <button
            onClick={addSpecialSkill}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            ➕ Додати навичку
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.personalInfo?.specialSkills?.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-50 rounded-lg p-4 flex items-center gap-3 group"
            >
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-sm">🎯</span>
              </div>
              <input
                type="text"
                value={skill}
                onChange={e => updateSpecialSkill(index, e.target.value)}
                className="flex-1 border-none bg-transparent focus:outline-none font-medium text-gray-900"
                placeholder="Навичка..."
              />
              <button
                onClick={() => removeSpecialSkill(index)}
                className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:text-red-700 transition-all"
              >
                ✕
              </button>
            </motion.div>
          ))}
          {(!data.personalInfo?.specialSkills || data.personalInfo.specialSkills.length === 0) && (
            <div className="col-span-full text-center py-8 text-gray-500">
              <div className="text-3xl mb-2">🎯</div>
              <p>Додайте свої спеціальні навички</p>
            </div>
          )}
        </div>
      </div>

      {/* Додаткова інформація */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
          📄 Додаткова інформація
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="drivingLicense"
              checked={data.personalInfo?.drivingLicense || false}
              onChange={e => handlePersonalInfoChange('drivingLicense', e.target.checked)}
              className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <label htmlFor="drivingLicense" className="text-gray-900 font-medium">
              Наявність водійських прав
            </label>
          </div>
          <FormField
            label="Статус паспорта"
            value={data.personalInfo?.passportStatus || ''}
            onChange={value => handlePersonalInfoChange('passportStatus', value)}
            placeholder="Дійсний закордонний паспорт"
          />
        </div>
      </div>
    </div>
  )

  const renderBiographyTab = () => (
    <div className="space-y-6">
      <FormField
        label="Біографія"
        type="textarea"
        value={data.biography || ''}
        onChange={value => handleFieldChange('biography', value)}
        placeholder="Розкажіть свою історію, досягнення та що вас вирізняє..."
        rows={8}
        maxLength={2000}
        showCharCount
        helpText="Опишіть свій творчий шлях, важливі моменти кар'єри та особисті якості"
      />

      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">👁️ Попередній перегляд</h3>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-gray-800 leading-relaxed">
            {data.biography || 'Тут буде відображена ваша біографія...'}
          </p>
        </div>
      </div>
    </div>
  )

  const renderEducationTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Освіта</h3>
        <button
          onClick={() => handleArrayItemAdd('education', { institution: '', degree: '' })}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          ➕ Додати освіту
        </button>
      </div>

      <div className="space-y-4">
        {data.education?.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormField
                label="Навчальний заклад"
                value={item.institution || ''}
                onChange={value =>
                  handleArrayItemUpdate('education', index, { ...item, institution: value })
                }
                placeholder="Назва університету, коледжу, школи..."
                required
              />

              <FormField
                label="Ступінь/Кваліфікація"
                value={item.degree || ''}
                onChange={value =>
                  handleArrayItemUpdate('education', index, { ...item, degree: value })
                }
                placeholder="Бакалавр, магістр, спеціаліст..."
                required
              />
            </div>

            <button
              onClick={() => handleArrayItemRemove('education', index)}
              className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
            >
              🗑️ Видалити
            </button>
          </motion.div>
        ))}

        {(!data.education || data.education.length === 0) && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">🎓</div>
            <p className="text-lg font-medium mb-2">Додайте інформацію про освіту</p>
            <p className="text-sm">Натисніть кнопку вище, щоб додати перший запис</p>
          </div>
        )}
      </div>
    </div>
  )

  const renderExperienceTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Професійний досвід</h3>
        <button
          onClick={() => handleArrayItemAdd('experience', { title: '', description: '' })}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          ➕ Додати досвід
        </button>
      </div>

      <div className="space-y-4">
        {data.experience?.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <div className="space-y-4">
              <FormField
                label="Назва/Тип діяльності"
                value={item.title || ''}
                onChange={value =>
                  handleArrayItemUpdate('experience', index, { ...item, title: value })
                }
                placeholder="Театральні постановки, кінофільми..."
                required
              />

              <FormField
                label="Опис"
                type="textarea"
                value={item.description || ''}
                onChange={value =>
                  handleArrayItemUpdate('experience', index, { ...item, description: value })
                }
                placeholder="Деталі досвіду, важливі проекти..."
                rows={3}
                maxLength={500}
                showCharCount
              />
            </div>

            <button
              onClick={() => handleArrayItemRemove('experience', index)}
              className="mt-4 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
            >
              🗑️ Видалити
            </button>
          </motion.div>
        ))}

        {(!data.experience || data.experience.length === 0) && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">💼</div>
            <p className="text-lg font-medium mb-2">Додайте професійний досвід</p>
            <p className="text-sm">Поділіться своїми найважливішими проектами</p>
          </div>
        )}
      </div>
    </div>
  )

  const renderSkillsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Професійні навички</h3>
        <button
          onClick={() => handleArrayItemAdd('skills', '')}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          ➕ Додати навичку
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.skills?.map((skill, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">⚡</span>
              </div>
              <input
                type="text"
                value={skill}
                onChange={e => handleArrayItemUpdate('skills', index, e.target.value)}
                className="flex-1 border-none bg-transparent focus:outline-none font-medium text-gray-900"
                placeholder="Назва навички..."
              />
              <button
                onClick={() => handleArrayItemRemove('skills', index)}
                className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:text-red-700 transition-all"
              >
                ✕
              </button>
            </div>
          </motion.div>
        ))}

        {(!data.skills || data.skills.length === 0) && (
          <div className="col-span-full text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">⚡</div>
            <p className="text-lg font-medium mb-2">Додайте свої навички</p>
            <p className="text-sm">Розкажіть про свої професійні вміння</p>
          </div>
        )}
      </div>
    </div>
  )

  const renderAchievementsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Досягнення та нагороди</h3>
        <button
          onClick={() => handleArrayItemAdd('achievements', { title: '', description: '' })}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          ➕ Додати досягнення
        </button>
      </div>

      <div className="space-y-4">
        {data.achievements?.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <div className="space-y-4">
              <FormField
                label="Назва досягнення"
                value={item.title || ''}
                onChange={value =>
                  handleArrayItemUpdate('achievements', index, { ...item, title: value })
                }
                placeholder="Нагорода, визнання, досягнення..."
                required
              />

              <FormField
                label="Опис"
                type="textarea"
                value={item.description || ''}
                onChange={value =>
                  handleArrayItemUpdate('achievements', index, { ...item, description: value })
                }
                placeholder="Деталі досягнення, його значення..."
                rows={3}
                maxLength={300}
                showCharCount
              />
            </div>

            <button
              onClick={() => handleArrayItemRemove('achievements', index)}
              className="mt-4 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
            >
              🗑️ Видалити
            </button>
          </motion.div>
        ))}

        {(!data.achievements || data.achievements.length === 0) && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">🏆</div>
            <p className="text-lg font-medium mb-2">Додайте досягнення</p>
            <p className="text-sm">Поділіться своїми професійними успіхами</p>
          </div>
        )}
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeSubTab) {
      case 'personalInfo':
        return renderPersonalInfoTab()
      case 'biography':
        return renderBiographyTab()
      case 'education':
        return renderEducationTab()
      case 'experience':
        return renderExperienceTab()
      case 'skills':
        return renderSkillsTab()
      case 'achievements':
        return renderAchievementsTab()
      default:
        return renderPersonalInfoTab()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Про мене</h2>
        <p className="text-gray-600">
          Управляйте інформацією про себе, освіту, досвід та досягнення
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
                ? 'bg-purple-100 text-purple-700 shadow-sm border border-purple-200'
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

export default AboutSection
