import { useState } from 'react'
import { motion } from 'framer-motion'
import { useContent } from '../hooks/useContent'
import { useTheme } from '../hooks/useTheme'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const { content } = useContent()
  const { isDark } = useTheme()

  // Debug logging
  console.log('Contact component - content:', content)
  console.log('Contact component - social data:', content?.contact?.social)

  const handleInputChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })

      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000)
    }, 2000)
  }

  return (
    <section id="contact" className={`section-padding ${
      isDark ? 'bg-slate-900' : 'bg-white'
    }`}>
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className={`text-4xl lg:text-5xl font-bold mb-6 select-none ${
            isDark ? 'text-slate-100' : 'text-gray-900'
          }`}>
            <span className="inline-block mr-3">📞</span>
            Зв&rsquo;язатися з <span className="text-gradient select-none">{content.hero.name}</span>
          </h2>
          <p className={`text-xl max-w-3xl mx-auto select-none ${
            isDark ? 'text-slate-300' : 'text-gray-600'
          }`}>
            Готовий до нових проектів та співпраці. Зв&rsquo;яжіться для обговорення деталей
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isDark ? 'bg-slate-700' : 'bg-blue-100'
                }`}>
                  <span className={`text-lg ${
                    isDark ? 'text-blue-400' : 'text-blue-600'
                  }`}>📍</span>
                </div>
                <h3 className={`text-2xl font-bold select-none ${
                  isDark ? 'text-slate-100' : 'text-gray-900'
                }`}>Контактна інформація</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isDark ? 'bg-slate-700' : 'bg-blue-100'
                  }`}>
                    <svg
                      className={`w-5 h-5 ${
                        isDark ? 'text-blue-400' : 'text-blue-600'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className={`font-semibold select-none ${
                      isDark ? 'text-slate-100' : 'text-gray-900'
                    }`}>Місцезнаходження</h4>
                    <p className={`select-none ${
                      isDark ? 'text-slate-300' : 'text-gray-600'
                    }`}>{content.contact.location}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isDark ? 'bg-slate-700' : 'bg-green-100'
                  }`}>
                    <svg
                      className={`w-5 h-5 ${
                        isDark ? 'text-green-400' : 'text-green-600'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className={`font-semibold select-none ${
                      isDark ? 'text-slate-100' : 'text-gray-900'
                    }`}>Email</h4>
                    <p className={`select-none ${
                      isDark ? 'text-slate-300' : 'text-gray-600'
                    }`}>{content.contact.email}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isDark ? 'bg-slate-700' : 'bg-purple-100'
                  }`}>
                    <svg
                      className={`w-5 h-5 ${
                        isDark ? 'text-purple-400' : 'text-purple-600'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className={`font-semibold select-none ${
                      isDark ? 'text-slate-100' : 'text-gray-900'
                    }`}>Телефон</h4>
                    <p className={`select-none ${
                      isDark ? 'text-slate-300' : 'text-gray-600'
                    }`}>{content.contact.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h3 className={`text-2xl font-bold mb-6 select-none ${
                isDark ? 'text-slate-100' : 'text-gray-900'
              }`}>Соціальні мережі</h3>

              {/* Debug button */}
              <div className="mb-4">

              </div>

              <div className="space-y-4">
                {content.contact.social.facebook?.url && 
                 content.contact.social.facebook.url.trim() !== '' && (
                  <a
                    href={content.contact.social.facebook.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center space-x-4 p-4 rounded-lg transition-colors group ${
                      isDark 
                        ? 'bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600' 
                        : 'bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100'
                    }`}
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className={`font-semibold group-hover:text-blue-600 ${
                        isDark ? 'text-slate-100' : 'text-gray-900'
                      }`}>
                        Facebook
                      </h4>
                      <p className={isDark ? 'text-slate-300' : 'text-gray-600'}>{content.contact.social.facebook.username}</p>
                      <p className="text-sm text-blue-600">
                        {content.contact.social.facebook.followers}
                      </p>
                    </div>
                  </a>
                )}

                {content.contact.social.instagram?.url && 
                 content.contact.social.instagram.url.trim() !== '' && (
                  <a
                    href={content.contact.social.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center space-x-4 p-4 rounded-lg transition-colors group ${
                      isDark 
                        ? 'bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600' 
                        : 'bg-gradient-to-r from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100'
                    }`}
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className={`font-semibold group-hover:text-pink-600 ${
                        isDark ? 'text-slate-100' : 'text-gray-900'
                      }`}>
                        Instagram
                      </h4>
                      <p className={isDark ? 'text-slate-300' : 'text-gray-600'}>{content.contact.social.instagram.username}</p>
                      <p className="text-sm text-pink-600">
                        {content.contact.social.instagram.followers}
                      </p>
                    </div>
                  </a>
                )}

                {content.contact.social.tiktok?.url && 
                 content.contact.social.tiktok.url.trim() !== '' && (
                  <a
                    href={content.contact.social.tiktok.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center space-x-4 p-4 rounded-lg transition-colors group ${
                      isDark 
                        ? 'bg-slate-800 hover:bg-slate-700' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.11V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 4.2 15.6a6.34 6.34 0 0 0 10.48-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className={`font-semibold group-hover:text-gray-700 ${
                        isDark ? 'text-slate-100' : 'text-gray-900'
                      }`}>
                        TikTok
                      </h4>
                      <p className={isDark ? 'text-slate-300' : 'text-gray-600'}>{content.contact.social.tiktok.username}</p>
                      <p className={`text-sm ${
                        isDark ? 'text-slate-400' : 'text-gray-600'
                      }`}>
                        {content.contact.social.tiktok.followers}
                      </p>
                    </div>
                  </a>
                )}
              </div>

              {/* Показуємо повідомлення, якщо немає соціальних мереж */}
              {(() => {
                const hasValidSocial = 
                  (content.contact.social.facebook?.url && 
                   content.contact.social.facebook.url.trim() !== '') ||
                  (content.contact.social.instagram?.url && 
                   content.contact.social.instagram.url.trim() !== '') ||
                  (content.contact.social.tiktok?.url && 
                   content.contact.social.tiktok.url.trim() !== '')

                if (!hasValidSocial) {
                  return (
                    <div className={`text-center py-6 rounded-lg ${
                      isDark ? 'bg-slate-800' : 'bg-gray-50'
                    }`}>
                      <p className={`text-sm ${
                        isDark ? 'text-slate-400' : 'text-gray-500'
                      }`}>
                        Соціальні мережі ще не налаштовані. Використовуйте форму вище для зв&rsquo;язку.
                      </p>
                    </div>
                  )
                }
                return null
              })()}
            </div>

            {/* Project Availability */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isDark ? 'bg-slate-700' : 'bg-green-100'
                }`}>
                  <span className={`text-lg ${
                    isDark ? 'text-green-400' : 'text-green-600'
                  }`}>💼</span>
                </div>
                <h3 className={`text-2xl font-bold select-none ${
                  isDark ? 'text-slate-100' : 'text-gray-900'
                }`}>Доступність для проектів</h3>
              </div>

              <div className="space-y-4">
                {content.contact.projectAvailability && Array.isArray(content.contact.projectAvailability) && content.contact.projectAvailability.map((service, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        typeof service === 'object' && service.available ? 'bg-green-500' : 'bg-yellow-500'
                      }`}
                    ></div>
                    <span className={isDark ? 'text-slate-300' : 'text-gray-700'}>
                      {typeof service === 'string' ? service : service.service || 'Послуга'}
                    </span>
                  </div>
                ))}
              </div>

              <div className={`mt-6 p-4 rounded-lg ${
                isDark ? 'bg-slate-800' : 'bg-purple-50'
              }`}>
                <p className={`text-sm ${
                  isDark ? 'text-purple-300' : 'text-purple-800'
                }`}>
                  <strong>Примітка:</strong> {content.contact.note}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className={`bg-gradient-to-br p-8 rounded-2xl border ${
              isDark 
                ? 'from-slate-800 to-slate-700 border-slate-600' 
                : 'from-purple-50 to-pink-50 border-purple-100'
            }`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isDark ? 'bg-slate-700' : 'bg-purple-100'
              }`}>
                <span className={`text-lg ${
                  isDark ? 'text-purple-400' : 'text-purple-600'
                }`}>✉️</span>
              </div>
              <h3 className={`text-2xl font-bold select-none ${
                isDark ? 'text-slate-100' : 'text-gray-900'
              }`}>Написати повідомлення</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className={`block text-sm font-medium mb-2 select-none ${
                  isDark ? 'text-slate-200' : 'text-gray-700'
                }`}>
                  Ім&rsquo;я *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                    isDark 
                      ? 'border-slate-500 bg-slate-700 text-slate-100 placeholder-slate-400' 
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-600'
                  }`}
                  placeholder="Ваше ім&rsquo;я"
                />
              </div>

              <div>
                <label htmlFor="email" className={`block text-sm font-medium mb-2 select-none ${
                  isDark ? 'text-slate-200' : 'text-gray-700'
                }`}>
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                    isDark 
                      ? 'border-slate-500 bg-slate-700 text-slate-100 placeholder-slate-400' 
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-600'
                  }`}
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className={`block text-sm font-medium mb-2 select-none ${
                  isDark ? 'text-slate-200' : 'text-gray-700'
                }`}>
                  Тема *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                    isDark 
                      ? 'border-slate-500 bg-slate-700 text-slate-100 placeholder-slate-400' 
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-600'
                  }`}
                  placeholder="Тема повідомлення"
                />
              </div>

              <div>
                <label htmlFor="message" className={`block text-sm font-medium mb-2 select-none ${
                  isDark ? 'text-slate-200' : 'text-gray-700'
                }`}>
                  Повідомлення *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none ${
                    isDark 
                      ? 'border-slate-500 bg-slate-700 text-slate-100 placeholder-slate-400' 
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-600'
                  }`}
                  placeholder="Опишіть ваш проект або запит..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="select-none">
                  {isSubmitting ? 'Відправляється...' : 'Надіслати повідомлення'}
                </span>
              </button>

              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 border rounded-lg ${
                    isDark 
                      ? 'bg-green-900/20 border-green-600' 
                      : 'bg-green-100 border-green-300'
                  }`}
                >
                  <p className={`text-center select-none ${
                    isDark ? 'text-green-300' : 'text-green-800'
                  }`}>
                    ✅ Повідомлення успішно надіслано! {content.hero.name} зв&rsquo;яжеться з вами
                    найближчим часом.
                  </p>
                </motion.div>
              )}
            </form>

            <div className="mt-6 text-center">
              {(() => {
                const hasValidSocial = 
                  (content.contact.social.facebook?.url && 
                   content.contact.social.facebook.url.trim() !== '') ||
                  (content.contact.social.instagram?.url && 
                   content.contact.social.instagram.url.trim() !== '') ||
                  (content.contact.social.tiktok?.url && 
                   content.contact.social.tiktok.url.trim() !== '')

                if (hasValidSocial) {
                  return (
                    <p className={`text-sm select-none ${
                      isDark ? 'text-slate-300' : 'text-gray-700'
                    }`}>
                      Або зв&rsquo;яжіться безпосередньо через соціальні мережі:{' '}
                      {content.contact.social.facebook?.url && 
                       content.contact.social.facebook.url.trim() !== '' && (
                        <a
                          href={content.contact.social.facebook.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 font-medium underline mx-1"
                        >
                          Facebook
                        </a>
                      )}
                      {content.contact.social.instagram?.url && 
                       content.contact.social.instagram.url.trim() !== '' && (
                        <a
                          href={content.contact.social.instagram.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-600 hover:text-pink-700 font-medium underline mx-1"
                        >
                          Instagram
                        </a>
                      )}
                      {content.contact.social.tiktok?.url && 
                       content.contact.social.tiktok.url.trim() !== '' && (
                        <a
                          href={content.contact.social.tiktok.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-700 hover:text-black font-medium underline mx-1"
                        >
                          TikTok
                        </a>
                      )}
                    </p>
                  )
                } else {
                  return (
                    <p className={`text-sm select-none ${
                      isDark ? 'text-slate-400' : 'text-gray-600'
                    }`}>Соціальні мережі ще не налаштовані. Використовуйте форму вище для зв&rsquo;язку.</p>
                  )
                }
              })()}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact