import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FormField from '../components/FormField'
import ImageUpload from '../components/ImageUpload'
import { portfolioCategories } from '../constants'
import {
  getImageWithFallback,
  handleImageError,
  generateAltText,
} from '../../../utils/imageHelpers'

const PortfolioSection = ({
  data,
  subTab,
  setSubTab,
  updateArrayContent,
  addArrayItem,
  removeArrayItem,
  onImageUpload,
  addToHistory,
}) => {
  const [editingItem, setEditingItem] = useState(null)

  if (!data) return null

  const getFilteredWorks = () => {
    if (!data.works || !Array.isArray(data.works)) return []
    if (subTab === 'all') return data.works
    return data.works.filter(work => work && work.category === subTab)
  }

  const handleAddWork = () => {
    const newWork = {
      id: Date.now(),
      title: '',
      category: subTab === 'all' ? 'photo' : subTab,
      image: '',
      description: '',
    }
    addArrayItem('works', newWork)
    setEditingItem(data.works ? data.works.length : 0)
    addToHistory('add', `Додано нову роботу в портфоліо`)
  }

  const handleUpdateWork = (index, updatedWork) => {
    updateArrayContent('works', index, updatedWork)
    addToHistory('edit', `Оновлено роботу "${updatedWork.title}"`)
  }

  const handleRemoveWork = (index, work) => {
    if (confirm(`Ви впевнені, що хочете видалити роботу "${work.title}"?`)) {
      removeArrayItem('works', index)
      setEditingItem(null)
      addToHistory('delete', `Видалено роботу "${work.title}"`)
    }
  }

  const handleImageChange = (file, workIndex, work) => {
    onImageUpload(file, {
      section: 'portfolio',
      field: 'works',
      index: workIndex,
      imageType: 'portfolio',
      category: work.category,
    })
  }

  const WorkCard = ({ work, index, isEditing }) => {
    if (isEditing) {
      return (
        <motion.div layout className="bg-white border-2 border-purple-300 rounded-xl p-6 shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-purple-700">✏️ Редагування роботи</h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <FormField
              label="Назва роботи"
              value={work.title || ''}
              onChange={value => handleUpdateWork(index, { ...work, title: value })}
              placeholder="Введіть назву роботи..."
              required
            />

            <FormField
              label="Категорія"
              type="select"
              value={work.category || ''}
              onChange={value => handleUpdateWork(index, { ...work, category: value })}
              options={portfolioCategories
                .filter(cat => cat.id !== 'all')
                .map(cat => ({
                  value: cat.id,
                  label: cat.label,
                }))}
              required
            />

            <FormField
              label="Опис роботи"
              type="textarea"
              value={work.description || ''}
              onChange={value => handleUpdateWork(index, { ...work, description: value })}
              placeholder="Розкажіть про цю роботу..."
              rows={3}
              maxLength={300}
              showCharCount
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Зображення роботи
              </label>
              <ImageUpload
                currentImage={work.image}
                onImageChange={file => handleImageChange(file, index, work)}
                aspectRatio="16:9"
                placeholder="Додайте зображення роботи"
              />
            </div>

            <div className="flex justify-between pt-4 border-t">
              <button
                onClick={() => handleRemoveWork(index, work)}
                className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
              >
                🗑️ Видалити
              </button>
              <button
                onClick={() => setEditingItem(null)}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                ✓ Готово
              </button>
            </div>
          </div>
        </motion.div>
      )
    }

    return (
      <motion.div
        layout
        className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all group cursor-pointer"
        onClick={() => setEditingItem(index)}
      >
        {getImageWithFallback(work.image) !== '/images/placeholder.svg' ? (
          <div className="aspect-video bg-gray-100 relative overflow-hidden">
            <img
              src={getImageWithFallback(work.image)}
              alt={generateAltText(work.title, work.category)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={e => handleImageError(e)}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                ✏️ Редагувати
              </span>
            </div>
          </div>
        ) : (
          <div className="aspect-video bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-gray-200 transition-colors">
            <div className="text-center">
              <div className="text-4xl mb-2">📸</div>
              <div className="text-sm">Додайте зображення</div>
            </div>
          </div>
        )}

        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
              {work.title || 'Без назви'}
            </h3>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {portfolioCategories.find(cat => cat.id === work.category)?.label || work.category}
            </span>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2">
            {work.description || 'Опис не додано'}
          </p>
        </div>
      </motion.div>
    )
  }

  const filteredWorks = getFilteredWorks()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Портфоліо</h2>
        <p className="text-gray-600">Управляйте своїми роботами та проектами</p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {portfolioCategories.map(category => (
          <button
            key={category.id}
            onClick={() => setSubTab(category.id)}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
              subTab === category.id
                ? 'bg-purple-100 text-purple-700 shadow-sm border border-purple-200'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            <span className="text-sm">{category.icon}</span>
            {category.label}
          </button>
        ))}
      </div>

      {/* Add Work Button */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {filteredWorks.length > 0 && (
            <>
              Показано {filteredWorks.length} з {data.works?.length || 0} робіт
            </>
          )}
        </div>
        <button
          onClick={handleAddWork}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          ➕ Додати роботу
        </button>
      </div>

      {/* Works Grid */}
      {filteredWorks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredWorks.map((work, index) => {
              const originalIndex = data.works?.findIndex(w => w.id === work.id) ?? index
              return (
                <WorkCard
                  key={work.id || index}
                  work={work}
                  index={originalIndex}
                  isEditing={editingItem === originalIndex}
                />
              )
            })}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500">
          <div className="text-6xl mb-4">🖼️</div>
          <h3 className="text-xl font-semibold mb-2">
            {subTab === 'all'
              ? 'Портфоліо порожнє'
              : `Немає робіт в категорії "${portfolioCategories.find(cat => cat.id === subTab)?.label}"`}
          </h3>
          <p className="text-sm mb-6">
            Додайте свої роботи, щоб показати свої професійні досягнення
          </p>
          <button
            onClick={handleAddWork}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 mx-auto"
          >
            ➕ Додати першу роботу
          </button>
        </div>
      )}

      {/* Statistics */}
      {data.works && data.works.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Статистика портфоліо</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {portfolioCategories
              .filter(cat => cat.id !== 'all')
              .map(category => {
                const count = data.works.filter(work => work.category === category.id).length
                return (
                  <div key={category.id} className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl mb-1">{category.icon}</div>
                    <div className="text-2xl font-bold text-purple-600">{count}</div>
                    <div className="text-sm text-gray-600">{category.label}</div>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-3">💡 Поради для портфоліо:</h4>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>• Використовуйте якісні зображення з хорошою роздільністю</li>
          <li>• Додавайте описи, що розкривають суть та значення роботи</li>
          <li>• Групуйте роботи за категоріями для зручності перегляду</li>
          <li>• Регулярно оновлюйте портфоліо новими проектами</li>
          <li>• Використовуйте зображення в співвідношенні 16:9 для кращого відображення</li>
        </ul>
      </div>
    </div>
  )
}

export default PortfolioSection
