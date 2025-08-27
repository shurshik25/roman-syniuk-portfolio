import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FormField from '../components/FormField'
import ImageUpload from '../components/ImageUpload'
import { videoCategories } from '../constants'
import {
  getYouTubeId,
  getYouTubeThumbnail,
  isYouTubeUrl,
  validateYouTubeUrl,
} from '../../../utils/youtubeUtils'

const VideoRepertoireSection = ({
  data,
  category,
  setCategory,
  updateArrayContent,
  addArrayItem,
  removeArrayItem,
  onImageUpload,
  addToHistory,
}) => {
  const [editingItem, setEditingItem] = useState(null)

  if (!data) return null

  const getFilteredVideos = () => {
    if (!data.videos || !Array.isArray(data.videos)) return []
    if (category === 'all') return data.videos
    return data.videos.filter(video => video && video.category === category)
  }

  const handleAddVideo = () => {
    const newVideo = {
      id: Date.now(),
      title: '',
      author: '',
      theater: '',
      year: new Date().getFullYear().toString(),
      director: '',
      role: '',
      category: category === 'all' ? 'theater' : category,
      description: '',
      videoUrl: '',
      youtubeUrl: '',
      videoType: 'both',
      thumbnail: '',
      duration: '',
      tags: [],
    }
    addArrayItem('videos', newVideo)
    setEditingItem(data.videos ? data.videos.length : 0)
    addToHistory('add', `Додано нове відео в репертуар`)
  }

  const handleUpdateVideo = (index, updatedVideo) => {
    updateArrayContent('videos', index, updatedVideo)
    addToHistory('edit', `Оновлено відео "${updatedVideo.title}"`)
  }

  const handleRemoveVideo = (index, video) => {
    if (confirm(`Ви впевнені, що хочете видалити відео "${video.title}"?`)) {
      removeArrayItem('videos', index)
      setEditingItem(null)
      addToHistory('delete', `Видалено відео "${video.title}"`)
    }
  }

  const handleImageChange = (file, videoIndex, video) => {
    onImageUpload(file, {
      section: 'videoRepertoire',
      field: 'thumbnail',
      index: videoIndex,
      imageType: 'thumbnail',
      category: video.category,
    })
  }

  const handleYouTubeUrlChange = (index, video, url) => {
    const updatedVideo = { ...video, youtubeUrl: url }

    if (isYouTubeUrl(url) && validateYouTubeUrl(url)) {
      const videoId = getYouTubeId(url)
      const thumbnail = getYouTubeThumbnail(videoId)
      updatedVideo.thumbnail = thumbnail
    }

    handleUpdateVideo(index, updatedVideo)
  }

  const VideoCard = ({ video, index, isEditing }) => {
    if (isEditing) {
      return (
        <motion.div
          layout
          className="bg-white border-2 border-purple-300 rounded-xl p-6 shadow-lg col-span-full"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-purple-700">✏️ Редагування відео</h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <FormField
                  label="Назва твору"
                  value={video.title || ''}
                  onChange={value => handleUpdateVideo(index, { ...video, title: value })}
                  placeholder="Гамлет, Ромео і Джульєтта..."
                  required
                />

                <FormField
                  label="Автор твору"
                  value={video.author || ''}
                  onChange={value => handleUpdateVideo(index, { ...video, author: value })}
                  placeholder="В. Шекспір, А. Чехов..."
                />

                <FormField
                  label="Театр/Студія"
                  value={video.theater || ''}
                  onChange={value => handleUpdateVideo(index, { ...video, theater: value })}
                  placeholder="Національний театр..."
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Рік"
                    type="number"
                    value={video.year || ''}
                    onChange={value => handleUpdateVideo(index, { ...video, year: value })}
                    placeholder="2023"
                    minLength={4}
                    maxLength={4}
                  />

                  <FormField
                    label="Тривалість"
                    value={video.duration || ''}
                    onChange={value => handleUpdateVideo(index, { ...video, duration: value })}
                    placeholder="3:45"
                    helpText="Формат: mm:ss"
                  />
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-4">
                <FormField
                  label="Режисер"
                  value={video.director || ''}
                  onChange={value => handleUpdateVideo(index, { ...video, director: value })}
                  placeholder="Ім'я режисера..."
                />

                <FormField
                  label="Ваша роль"
                  value={video.role || ''}
                  onChange={value => handleUpdateVideo(index, { ...video, role: value })}
                  placeholder="Головна роль, епізод..."
                />

                <FormField
                  label="Категорія"
                  type="select"
                  value={video.category || ''}
                  onChange={value => handleUpdateVideo(index, { ...video, category: value })}
                  options={videoCategories
                    .filter(cat => cat.id !== 'all')
                    .map(cat => ({
                      value: cat.id,
                      label: cat.label,
                    }))}
                  required
                />

                <FormField
                  label="Тип відео"
                  type="select"
                  value={video.videoType || 'both'}
                  onChange={value => handleUpdateVideo(index, { ...video, videoType: value })}
                  options={[
                    { value: 'youtube', label: 'Тільки YouTube' },
                    { value: 'local', label: 'Тільки локальне відео' },
                    { value: 'both', label: 'YouTube + локальне' },
                  ]}
                />
              </div>
            </div>

            {/* Description */}
            <FormField
              label="Опис ролі та відео"
              type="textarea"
              value={video.description || ''}
              onChange={value => handleUpdateVideo(index, { ...video, description: value })}
              placeholder="Розкажіть про роль, особливості виконання..."
              rows={4}
              maxLength={800}
              showCharCount
            />

            {/* Video URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(video.videoType === 'youtube' || video.videoType === 'both') && (
                <FormField
                  label="YouTube URL"
                  type="url"
                  value={video.youtubeUrl || ''}
                  onChange={value => handleYouTubeUrlChange(index, video, value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  validation={[
                    {
                      type: 'custom',
                      validate: value => !value || isYouTubeUrl(value),
                      message: 'Введіть правильний YouTube URL',
                    },
                  ]}
                />
              )}

              {(video.videoType === 'local' || video.videoType === 'both') && (
                <FormField
                  label="Локальне відео URL"
                  value={video.videoUrl || ''}
                  onChange={value => handleUpdateVideo(index, { ...video, videoUrl: value })}
                  placeholder="/videos/video_file.html"
                  helpText="Відносний шлях до HTML файлу з відео"
                />
              )}
            </div>

            {/* Thumbnail */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Превью зображення
              </label>
              {video.youtubeUrl && isYouTubeUrl(video.youtubeUrl) ? (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-blue-800 text-sm">
                    ℹ️ Превью автоматично завантажується з YouTube
                  </p>
                  {video.thumbnail && (
                    <img
                      src={video.thumbnail}
                      alt="YouTube thumbnail"
                      className="mt-2 w-32 h-18 object-cover rounded"
                    />
                  )}
                </div>
              ) : (
                <ImageUpload
                  currentImage={video.thumbnail}
                  onImageChange={file => handleImageChange(file, index, video)}
                  aspectRatio="16:9"
                  placeholder="Додайте превью відео"
                />
              )}
            </div>

            {/* Tags */}
            <FormField
              label="Теги (через кому)"
              value={video.tags?.join(', ') || ''}
              onChange={value => {
                const tags = value
                  .split(',')
                  .map(tag => tag.trim())
                  .filter(tag => tag)
                handleUpdateVideo(index, { ...video, tags })
              }}
              placeholder="драма, класика, шекспір"
              helpText="Розділяйте теги комами"
            />

            <div className="flex justify-between pt-4 border-t">
              <button
                onClick={() => handleRemoveVideo(index, video)}
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
        {video.thumbnail ? (
          <div className="aspect-video bg-gray-100 relative overflow-hidden">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                ▶️ Редагувати
              </span>
            </div>
            {video.duration && (
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {video.duration}
              </div>
            )}
          </div>
        ) : (
          <div className="aspect-video bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-gray-200 transition-colors">
            <div className="text-center">
              <div className="text-4xl mb-2">🎬</div>
              <div className="text-sm">Додайте превью</div>
            </div>
          </div>
        )}

        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
              {video.title || 'Без назви'}
            </h3>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {videoCategories.find(cat => cat.id === video.category)?.label || video.category}
            </span>
          </div>

          <div className="text-sm text-gray-600 space-y-1">
            {video.author && <div>Автор: {video.author}</div>}
            {video.role && <div>Роль: {video.role}</div>}
            {video.year && <div>Рік: {video.year}</div>}
          </div>

          {video.tags && video.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {video.tags.slice(0, 3).map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
              {video.tags.length > 3 && (
                <span className="text-xs text-gray-500">+{video.tags.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </motion.div>
    )
  }

  const filteredVideos = getFilteredVideos()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Відео-репертуар</h2>
        <p className="text-gray-600">Управляйте своїми відео роботами та виступами</p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {videoCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
              category === cat.id
                ? 'bg-purple-100 text-purple-700 shadow-sm border border-purple-200'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            <span className="text-sm">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Add Video Button */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {filteredVideos.length > 0 && (
            <>
              Показано {filteredVideos.length} з {data.videos?.length || 0} відео
            </>
          )}
        </div>
        <button
          onClick={handleAddVideo}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          ➕ Додати відео
        </button>
      </div>

      {/* Videos Grid */}
      {filteredVideos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredVideos.map((video, index) => {
              const originalIndex = data.videos?.findIndex(v => v.id === video.id) ?? index
              return (
                <VideoCard
                  key={video.id || index}
                  video={video}
                  index={originalIndex}
                  isEditing={editingItem === originalIndex}
                />
              )
            })}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500">
          <div className="text-6xl mb-4">🎬</div>
          <h3 className="text-xl font-semibold mb-2">
            {category === 'all'
              ? 'Репертуар порожній'
              : `Немає відео в категорії "${videoCategories.find(cat => cat.id === category)?.label}"`}
          </h3>
          <p className="text-sm mb-6">Додайте відео своїх виступів та ролей</p>
          <button
            onClick={handleAddVideo}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 mx-auto"
          >
            ➕ Додати перше відео
          </button>
        </div>
      )}

      {/* Statistics */}
      {data.videos && data.videos.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Статистика репертуару</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {videoCategories
              .filter(cat => cat.id !== 'all')
              .map(cat => {
                const count = data.videos.filter(video => video.category === cat.id).length
                return (
                  <div key={cat.id} className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl mb-1">{cat.icon}</div>
                    <div className="text-2xl font-bold text-purple-600">{count}</div>
                    <div className="text-sm text-gray-600">{cat.label}</div>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-3">💡 Поради для відео:</h4>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>• Використовуйте YouTube для кращої швидкості завантаження</li>
          <li>• Додавайте описи ролей та контекст виступів</li>
          <li>• Використовуйте теги для кращої організації контенту</li>
          <li>• Превью автоматично завантажується з YouTube</li>
          <li>• Локальні відео файли повинні бути в форматі HTML</li>
        </ul>
      </div>
    </div>
  )
}

export default VideoRepertoireSection
