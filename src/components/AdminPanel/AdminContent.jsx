
import { motion } from 'framer-motion'
import HeroSection from './sections/HeroSection'
import AboutSection from './sections/AboutSection'
import PortfolioSection from './sections/PortfolioSection'
import VideoRepertoireSection from './sections/VideoRepertoireSection'
import ContactSection from './sections/ContactSection'


const AdminContent = ({
  activeTab,
  content,
  updateContent,
  updateNestedContent,
  updateArrayContent,
  addArrayItem,
  removeArrayItem,
  portfolioSubTab,
  setPortfolioSubTab,
  videoRepertoireCategory,
  setVideoRepertoireCategory,
  onImageUpload,
  addToHistory,
}) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case 'hero':
        return (
          <HeroSection
            data={content.hero}
            updateContent={(field, value) => updateContent('hero', field, value)}
            onImageUpload={onImageUpload}
            addToHistory={addToHistory}
          />
        )

      case 'about':
        return (
          <AboutSection
            data={content.about}
            updateContent={(field, value) => updateContent('about', field, value)}
            updateNestedContent={(field, subField, value) =>
              updateNestedContent('about', field, subField, value)
            }
            updateArrayContent={(field, index, value) =>
              updateArrayContent('about', field, index, value)
            }
            addArrayItem={(field, item) => addArrayItem('about', field, item)}
            removeArrayItem={(field, index) => removeArrayItem('about', field, index)}
            addToHistory={addToHistory}
          />
        )

      case 'portfolio':
        return (
          <PortfolioSection
            data={content.portfolio}
            subTab={portfolioSubTab}
            setSubTab={setPortfolioSubTab}
            updateArrayContent={(field, index, value) =>
              updateArrayContent('portfolio', field, index, value)
            }
            addArrayItem={(field, item) => addArrayItem('portfolio', field, item)}
            removeArrayItem={(field, index) => removeArrayItem('portfolio', field, index)}
            onImageUpload={onImageUpload}
            addToHistory={addToHistory}
          />
        )

      case 'videoRepertoire':
        return (
          <VideoRepertoireSection
            data={content.videoRepertoire}
            category={videoRepertoireCategory}
            setCategory={setVideoRepertoireCategory}
            updateArrayContent={(field, index, value) =>
              updateArrayContent('videoRepertoire', field, index, value)
            }
            addArrayItem={(field, item) => addArrayItem('videoRepertoire', field, item)}
            removeArrayItem={(field, index) => removeArrayItem('videoRepertoire', field, index)}
            onImageUpload={onImageUpload}
            addToHistory={addToHistory}
          />
        )

      case 'contact':
        return (
          <ContactSection
            data={content.contact}
            updateContent={(field, value) => updateContent('contact', field, value)}
            updateNestedContent={(field, subField, value) =>
              updateNestedContent('contact', field, subField, value)
            }
            updateArrayContent={(field, index, value) =>
              updateArrayContent('contact', field, index, value)
            }
            addToHistory={addToHistory}
          />
        )

      case 'export':
        return (
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Експорт/Імпорт</h2>
            <p className="text-gray-600">Функція експорту/імпорту в розробці</p>
          </div>
        )

      default:
        return (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">🚧</div>
            <h3 className="text-xl font-semibold mb-2">Секція в розробці</h3>
            <p>Цю секцію буде додано найближчим часом.</p>
          </div>
        )
    }
  }

  return (
    <motion.div
      key={activeTab}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      {renderTabContent()}
    </motion.div>
  )
}

export default AdminContent
