import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useContent } from '../hooks/useContent'
import { getYouTubeId, getYouTubeEmbedUrl, isYouTubeUrl } from '../utils/youtubeUtils'

const Repertoire = () => {
  const [activeTab, setActiveTab] = useState('theater')
  const { content, isLoading } = useContent()



  // Показуємо loading state
  if (isLoading) {
    return (
      <section id="repertoire" className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-xl text-gray-600">Завантаження відео-репертуару...</p>
            <div className="mt-4 text-sm text-gray-500">
              <p>Статус: Завантаження даних...</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Перевірка на існування даних
  if (!content || !content.videoRepertoire) {

    return (
      <section id="repertoire" className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚠️</div>
            <p className="text-xl text-gray-600">Помилка завантаження відео-репертуару</p>
            <div className="mt-4 text-sm text-gray-500">
              <p>Content: {content ? '✅ Завантажено' : '❌ Не завантажено'}</p>
              <p>
                VideoRepertoire: {content?.videoRepertoire ? '✅ Завантажено' : '❌ Не завантажено'}
              </p>
              <p>Структура content: {content ? Object.keys(content).join(', ') : 'Немає'}</p>
            </div>
            <div className="mt-6 space-x-4">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Перезавантажити сторінку
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('portfolio-content')
                  window.location.reload()
                }}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Очистити кеш та перезавантажити
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const tabs = content.videoRepertoire.categories || []
  const allVideos = content.videoRepertoire.videos || []

  // Фільтруємо відео за активною категорією
  const currentVideos = allVideos.filter(video => video.category === activeTab)

  // Підраховуємо кількість відео для кожної категорії
  const getCategoryCount = categoryId => {
    return allVideos.filter(video => video.category === categoryId).length
  }



  // Функція для рендерингу відео плеєра
  const renderVideoPlayer = video => {
    // Якщо є YouTube посилання
    if (video.youtubeUrl && isYouTubeUrl(video.youtubeUrl)) {
      const youtubeId = getYouTubeId(video.youtubeUrl)
      if (youtubeId) {
        return (
          <div className="w-full h-64 md:h-80">
            <iframe
              src={getYouTubeEmbedUrl(youtubeId)}
              title={video.title}
              className="w-full h-full rounded-lg"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )
      }
    }

    // Якщо є локальне відео (HTML файл)
    if (video.videoUrl && video.videoUrl.endsWith('.html')) {
      return (
        <div className="w-full h-64 md:h-80 flex items-center justify-center relative bg-gradient-to-br from-purple-500 to-pink-500">
          <div className="text-center text-white z-10">
            <div className="text-6xl mb-4">🎬</div>
            <p className="text-xl font-semibold mb-2">{video.title}</p>
            <p className="text-sm opacity-80">Тривалість: {video.duration}</p>
            <a
              href={video.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full border-2 border-white/30 hover:bg-white/30 transition-all"
            >
              Відкрити деталі
            </a>
          </div>
        </div>
      )
    }

    // Якщо є локальне відео (MP4)
    if (video.videoUrl && video.videoUrl.endsWith('.mp4')) {
      return (
        <video
          className="w-full h-64 md:h-80 object-cover"
          poster={video.thumbnail}
          controls
          preload="metadata"
        >
          <source src={video.videoUrl} type="video/mp4" />
          Ваш браузер не підтримує відео.
        </video>
      )
    }

    // Placeholder якщо немає відео
    return (
      <div className="w-full h-64 md:h-80 flex items-center justify-center relative">
        <div className="text-center text-white z-10">
          <div className="text-6xl mb-4">🎬</div>
          <p className="text-xl font-semibold mb-2">{video.title}</p>
          <p className="text-sm opacity-80">Відео: {video.duration}</p>
          <p className="text-xs opacity-60">Додайте URL відео або YouTube посилання</p>
        </div>

        {/* Кнопка play */}
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
            <div className="w-0 h-0 border-l-[12px] border-l-white ml-1"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section id="repertoire" className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Відео-репертуар</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Перегляньте найкращі моменти з моїх виступів та ролей
          </p>
        </motion.div>

        {/* Таби з лічильниками */}
        {tabs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {tabs.map(tab => {
              const count = getCategoryCount(tab.id)
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span>{tab.label}</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold ${
                      activeTab === tab.id
                        ? 'bg-white/20 text-white'
                        : 'bg-purple-100 text-purple-600'
                    }`}
                  >
                    {count}
                  </span>
                </motion.button>
              )
            })}
          </motion.div>
        )}

        {/* Відео */}
        <div className="space-y-8">
          <AnimatePresence mode="wait">
            {currentVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow"
              >
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  {/* Інформація про роль */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">{video.title}</h3>
                      <p className="text-lg text-gray-600 mb-1">
                        <strong>Автор:</strong> {video.author}
                      </p>
                      <p className="text-lg text-gray-600 mb-1">
                        <strong>Театр/Студія:</strong> {video.theater}
                      </p>
                      <p className="text-lg text-gray-600 mb-1">
                        <strong>Режисер:</strong> {video.director}
                      </p>
                      <p className="text-lg text-gray-600 mb-1">
                        <strong>Рік:</strong> {video.year}
                      </p>
                      <p className="text-lg text-gray-600 mb-1">
                        <strong>Роль:</strong> {video.role}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">Опис ролі:</h4>
                      <p className="text-gray-600 leading-relaxed">{video.description}</p>
                    </div>

                    {/* Теги */}
                    {video.tags && video.tags.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">Теги:</h4>
                        <div className="flex flex-wrap gap-2">
                          {video.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Тип відео */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Тип відео:</span>
                      {video.youtubeUrl && isYouTubeUrl(video.youtubeUrl) ? (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex items-center gap-1">
                          <span className="text-red-500">▶️</span> YouTube
                        </span>
                      ) : video.videoUrl && video.videoUrl.endsWith('.html') ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
                          <span className="text-green-500">📄</span> HTML
                        </span>
                      ) : video.videoUrl && video.videoUrl.endsWith('.mp4') ? (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium flex items-center gap-1">
                          <span className="text-blue-500">🎬</span> MP4
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium flex items-center gap-1">
                          <span className="text-gray-500">❓</span> Не вказано
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Відео плеєр */}
                  <div className="relative">
                    <div className="bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl overflow-hidden shadow-lg">
                      {renderVideoPlayer(video)}
                    </div>

                    {/* Індикатор тривалості */}
                    {video.duration && (
                      <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                        {video.duration}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Повідомлення про відсутність відео */}
        {currentVideos.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">😔</div>
            <p className="text-xl text-gray-600">
              Наразі немає відео у категорії &ldquo;
              {tabs.find(tab => tab.id === activeTab)?.label || activeTab}&rdquo;
            </p>
            <p className="text-gray-500 mt-2">
              Додайте відео через адмін-панель або переключіться на іншу категорію
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default Repertoire
