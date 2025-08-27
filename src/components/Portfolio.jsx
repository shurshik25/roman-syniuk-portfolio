import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useContent } from '../hooks/useContent'
import { SkeletonGrid } from './Skeleton'
import Modal from './Modal'

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedWork, setSelectedWork] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(8) // Початкова кількість показаних робіт
  const { content } = useContent()

  // Debug logging
  console.log('Portfolio component - content:', content)
  console.log('Portfolio component - works:', content?.portfolio?.works)

  // Simulate loading
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const filteredWorks =
    activeFilter === 'all'
      ? content.portfolio?.works || []
      : content.portfolio?.works?.filter(work => work.category === activeFilter) || []

  // Скидаємо лічільник при зміні фільтра
  React.useEffect(() => {
    setVisibleCount(8)
  }, [activeFilter])

  // Функція для завантаження більше робіт
  const loadMoreWorks = () => {
    setVisibleCount(prev => prev + 8)
  }

  // Перевіряємо, чи є ще роботи для показу
  const hasMoreWorks = visibleCount < filteredWorks.length

  return (
    <section id="portfolio" className="section-padding gradient-bg">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Портфоліо <span className="text-gradient">{content.hero.name}</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Колекція найкращих робіт у театрі, кіно та професійних фотосесіях
          </p>
        </motion.div>

        {/* Debug button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex justify-center mb-6"
        >

        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {(
            content.portfolio?.categories || [
              { id: 'all', label: 'Всі роботи' },
              { id: 'theater', label: 'Театр' },
              { id: 'cinema', label: 'Кіно' },
              { id: 'photo', label: 'Фотосесії' },
            ]
          ).map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeFilter === filter.id
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </motion.div>

        {/* Portfolio Grid */}
        {isLoading ? (
          <SkeletonGrid items={8} />
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredWorks.slice(0, visibleCount).map((work, index) => (
                <motion.div
                  key={work.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedWork(work)}
                >
                  <div className="relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 group-hover:border-purple-400/50 transition-all duration-300">
                    <img
                      src={work.image}
                      alt={work.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h3 className="font-semibold text-lg mb-2">{work.title}</h3>
                        <p className="text-sm text-gray-300">{work.description}</p>
                      </div>
                    </div>

                    {/* Category badge */}
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          work.category === 'theater'
                            ? 'bg-blue-500/80'
                            : work.category === 'cinema'
                              ? 'bg-green-500/80'
                              : 'bg-purple-500/80'
                        } text-white backdrop-blur-sm`}
                      >
                        {work.category === 'theater'
                          ? 'Театр'
                          : work.category === 'cinema'
                            ? 'Кіно'
                            : 'Фото'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Load More Button */}
        {hasMoreWorks && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <button onClick={loadMoreWorks} className="btn-primary">
              Завантажити більше робіт ({filteredWorks.length - visibleCount} залишилось)
            </button>
          </motion.div>
        )}

        {/* Показуємо інформацію про завантажені роботи */}
        {!isLoading && filteredWorks.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-8"
          >
            <p className="text-gray-300 text-sm">
              Показано {Math.min(visibleCount, filteredWorks.length)} з {filteredWorks.length} робіт
              {activeFilter !== 'all' && (
                <span className="text-purple-300">
                  {' '}
                  у категорії &ldquo;
                  {content.portfolio?.categories?.find(c => c.id === activeFilter)?.label}&rdquo;
                </span>
              )}
            </p>
          </motion.div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={!!selectedWork}
        onClose={() => setSelectedWork(null)}
        title={selectedWork?.title}
        size="lg"
      >
        {selectedWork && (
          <div className="space-y-4">
            <img
              src={selectedWork.image}
              alt={selectedWork.title}
              className="w-full rounded-lg"
            />
            <div>
              <h3 className="text-xl font-semibold mb-2">{selectedWork.title}</h3>
              <p className="text-gray-600 mb-4">{selectedWork.description}</p>
              {selectedWork.details && (
                <div className="space-y-2">
                  <h4 className="font-medium">Деталі:</h4>
                  <p className="text-gray-600 text-sm">{selectedWork.details}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </section>
  )
}

export default Portfolio