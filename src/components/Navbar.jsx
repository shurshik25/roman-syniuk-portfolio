import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useContent } from '../hooks/useContent'
import { useTheme } from '../hooks/useTheme'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const { content } = useContent()
  const { isDark, toggleTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      // Check scroll on the actual scroll container
      const rootElement = document.querySelector('#root')
      const scrollTop = rootElement ? rootElement.scrollTop : window.scrollY
      setIsScrolled(scrollTop > 50)
    }

    // Listen to scroll events on both window and root
    window.addEventListener('scroll', handleScroll)
    
    const rootElement = document.querySelector('#root')
    if (rootElement) {
      rootElement.addEventListener('scroll', handleScroll)
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rootElement) {
        rootElement.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  const scrollToSection = href => {
    setIsMobileMenuOpen(false)
    
    setTimeout(() => {
      const element = document.querySelector(href)
      if (element) {
        // Find the actual scroll container (same logic as BackToTop)
        const rootElement = document.querySelector('#root')
        const mainElement = document.querySelector('main')
        
        // Check which container has scroll capability
        const scrollContainers = [
          { name: 'window', element: window, scrollTop: window.pageYOffset },
          { name: 'root', element: rootElement, scrollTop: rootElement?.scrollTop || 0 },
          { name: 'main', element: mainElement, scrollTop: mainElement?.scrollTop || 0 }
        ]
        
        // Find active scroll container or use root as default for mobile
        const isMobile = window.innerWidth <= 768
        let scrollContainer = scrollContainers.find(c => c.scrollTop > 0)
        
        if (!scrollContainer && isMobile && rootElement) {
          scrollContainer = { name: 'root', element: rootElement, scrollTop: rootElement.scrollTop }
        }
        
        if (!scrollContainer) {
          scrollContainer = { name: 'window', element: window, scrollTop: window.pageYOffset }
        }
        
        // Calculate position relative to the scroll container
        const navbarHeight = isMobile ? 64 : 80
        let elementPosition
        
        if (scrollContainer.name === 'window') {
          elementPosition = element.getBoundingClientRect().top + window.pageYOffset
        } else {
          // For root/main containers, calculate position relative to container
          const containerRect = scrollContainer.element.getBoundingClientRect()
          const elementRect = element.getBoundingClientRect()
          elementPosition = elementRect.top - containerRect.top + scrollContainer.element.scrollTop
        }
        
        const offsetPosition = Math.max(0, elementPosition - navbarHeight - 20)
        
        // Perform scroll on correct container
        if (scrollContainer.name === 'window') {
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          })
        } else if (scrollContainer.element.scrollTo) {
          scrollContainer.element.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          })
        } else {
          // Custom smooth scroll for containers without scrollTo
          smoothScrollTo(scrollContainer.element, offsetPosition, 400)
        }
      }
    }, isMobileMenuOpen ? 300 : 0) // Only delay if mobile menu was open
  }
  
  // Custom smooth scroll function (same as BackToTop)
  const smoothScrollTo = (element, target, duration) => {
    const start = element.scrollTop
    const change = target - start
    const startTime = performance.now()

    const animateScroll = (currentTime) => {
      const timeElapsed = currentTime - startTime
      const progress = Math.min(timeElapsed / duration, 1)
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      
      element.scrollTop = start + (change * easeOut)
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll)
      }
    }
    
    requestAnimationFrame(animateScroll)
  }

  const handleLogoClick = () => {
    setClickCount(prev => prev + 1)
    
    if (clickCount === 4) {
      const event = new CustomEvent('openAdminPanel')
      window.dispatchEvent(event)
      setClickCount(0)
    }

    setTimeout(() => {
      setClickCount(0)
    }, 3000)
  }

  const navItems = [
    { href: '#hero', label: 'Головна' },
    { href: '#about', label: 'Про мене' },
    { href: '#portfolio', label: 'Портфоліо' },
    { href: '#repertoire', label: 'Репертуар' },
    { href: '#contact', label: 'Контакти' },
  ]

  const getInitials = name => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200'
            : 'bg-black/80 backdrop-blur-sm'
        }`}
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          height: '64px',
          minHeight: '64px',
          maxHeight: '64px'
        }}
      >
        <div className="container-custom h-full">
          <div className="flex items-center justify-between h-full px-2">
            {/* Logo Section - Left */}
            <div className="flex items-center flex-shrink-0">
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                className="flex items-center space-x-2 cursor-pointer"
                onClick={handleLogoClick}
                title={clickCount > 0 ? `${clickCount}/5 кліків` : ''}
              >
                <div
                  className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex-shrink-0 ${
                    isScrolled ? 'bg-purple-600' : 'bg-white/30'
                  } flex items-center justify-center transition-all duration-300 ${
                    clickCount > 0 ? 'ring-2 ring-purple-400 ring-opacity-50' : ''
                  }`}
                >
                  <span className={`text-sm lg:text-xl font-bold ${isScrolled ? 'text-white' : 'text-white'}`}>
                    {getInitials(content.hero.name)}
                  </span>
                </div>
                <span className={`text-sm lg:text-xl font-bold hidden sm:block truncate max-w-[120px] lg:max-w-none select-none ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                  {content.hero.name}
                </span>
              </motion.div>
            </div>

            {/* Desktop Navigation - Center */}
            <div className="hidden lg:flex items-center justify-center flex-1">
              <div className="flex items-center space-x-6">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.href}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    onClick={() => scrollToSection(item.href)}
                    className={`font-medium transition-colors duration-300 whitespace-nowrap select-none ${
                      isScrolled
                        ? 'text-gray-700 hover:text-purple-600'
                        : 'text-white hover:text-purple-200'
                    }`}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              {/* Theme Toggle - Desktop Only */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                onClick={toggleTheme}
                className={`hidden lg:block p-2 rounded-lg transition-colors ${
                  isScrolled
                    ? 'text-gray-700 hover:bg-gray-100'
                    : 'text-white hover:bg-white/30'
                }`}
                title={isDark ? 'Світла тема' : 'Темна тема'}
              >
                {isDark ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </motion.button>

              {              /* Contact Button - Desktop Only */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                onClick={() => scrollToSection('#contact')}
                className={`hidden lg:block px-4 py-2 rounded-lg font-semibold transition-all duration-300 whitespace-nowrap select-none ${
                  isScrolled
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-white/30 text-white hover:bg-white/40 backdrop-blur-sm'
                }`}
              >
                Зв&rsquo;язатися
              </motion.button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`lg:hidden p-3 rounded-lg transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center ${
                  isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/30'
                }`}
                aria-label={isMobileMenuOpen ? 'Закрити меню' : 'Відкрити меню'}
                aria-expanded={isMobileMenuOpen}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-white border-t border-gray-200 overflow-hidden"
              style={{ zIndex: 51 }}
            >
              <div className="container-custom py-6 space-y-4">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    onClick={() => scrollToSection(item.href)}
                    className="block w-full text-left px-4 py-4 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors touch-manipulation min-h-[48px] flex items-center select-none"
                    aria-label={`Перейти до секції ${item.label}`}
                  >
                    {item.label}
                  </motion.button>
                ))}

                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: navItems.length * 0.1 }}
                  onClick={() => scrollToSection('#contact')}
                  className="w-full mt-4 px-6 py-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors touch-manipulation min-h-[48px] flex items-center justify-center select-none"
                  aria-label="Перейти до секції контактів"
                >
                  Зв&rsquo;язатися
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  )
}

export default Navbar