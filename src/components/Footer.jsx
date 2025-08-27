
import { motion } from 'framer-motion'
import { useContent } from '../hooks/useContent'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const { content, isLoading } = useContent()

  // Показуємо заглушку, поки дані завантажуються
  if (isLoading || !content) {
    return (
      <footer className="bg-gray-950 text-gray-300">
        <div className="container-custom py-12">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-800 rounded mb-4 mx-auto w-48"></div>
              <div className="h-4 bg-gray-800 rounded mb-2 mx-auto w-96"></div>
              <div className="h-4 bg-gray-800 rounded mx-auto w-80"></div>
            </div>
          </div>
        </div>
      </footer>
    )
  }

  const quickLinks = [
    { name: 'Головна', href: '#home' },
    { name: 'Про мене', href: '#about' },
    { name: 'Портфоліо', href: '#portfolio' },
    { name: 'Репертуар', href: '#repertoire' },
    { name: 'Контакти', href: '#contact' },
  ]

  const scrollToSection = href => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="container-custom py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Логотип та опис */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="md:col-span-2"
          >
            <div className="text-2xl font-bold mb-4">
              <span className="text-white">Актор</span>
              <span className="text-purple-500">Портфоліо</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              {content?.hero?.description ||
                'Професійний актор театру та кіно з багаторічним досвідом. Спеціалізуюся на драматичних та комедійних ролях. Готовий до нових проектів та творчих викликів.'}
            </p>
            <div className="flex gap-4">
              {content?.contact?.social?.facebook?.url && (
                <motion.a
                  href={content.contact.social.facebook.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                  title="Facebook"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </motion.a>
              )}
              {content?.contact?.social?.instagram?.url && (
                <motion.a
                  href={content.contact.social.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center hover:from-pink-600 hover:to-purple-700 transition-colors"
                  title="Instagram"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </motion.a>
              )}
              {content?.contact?.social?.tiktok?.url && (
                <motion.a
                  href={content.contact.social.tiktok.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
                  title="TikTok"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.11V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 4.2 15.6a6.34 6.34 0 0 0 10.48-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </motion.a>
              )}
              {/* Показуємо заглушку, якщо немає соціальних мереж */}
              {!content?.contact?.social?.facebook?.url &&
                !content?.contact?.social?.instagram?.url &&
                !content?.contact?.social?.tiktok?.url && (
                  <div className="text-gray-400 text-sm italic">
                    Соціальні мережі не налаштовані
                  </div>
                )}
            </div>
          </motion.div>

          {/* Швидкі посилання */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Швидкі посилання</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-gray-400 hover:text-purple-400 transition-colors hover:translate-x-1 transform duration-200"
                  >
                    {link.name}
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Контакти */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Контакти</h3>
            <div className="space-y-3">
              {content?.contact?.email && (
                <div className="flex items-center gap-2">
                  <span className="text-purple-400">📧</span>
                  <a
                    href={`mailto:${content.contact.email}`}
                    className="hover:text-purple-400 transition-colors"
                  >
                    {content.contact.email}
                  </a>
                </div>
              )}
              {content?.contact?.phone && (
                <div className="flex items-center gap-2">
                  <span className="text-purple-400">📱</span>
                  <span>{content.contact.phone}</span>
                </div>
              )}
              {content?.contact?.location && (
                <div className="flex items-center gap-2">
                  <span className="text-purple-400">📍</span>
                  <span>{content.contact.location}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Розділювач */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 mt-8 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} {content?.hero?.name || 'Олександр Петренко'}. Всі права захищені.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                Політика конфіденційності
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                Умови використання
              </a>
            </div>
          </div>
        </motion.div>


      </div>
    </footer>
  )
}

export default Footer
