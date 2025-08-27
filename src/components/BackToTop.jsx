import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Custom smooth scroll function for fallback
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

  useEffect(() => {
    // Check mobile status
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    const toggleVisibility = () => {
      // Show button when scrolled down 300px
      const windowScrollTop = window.pageYOffset || 
                              document.documentElement.scrollTop || 
                              document.body.scrollTop || 0
      
      // Check main element scroll on mobile (main content area)
      // Try multiple selectors for main content
      const mainElement = document.getElementById('main-content') || 
                          document.querySelector('main') ||
                          document.querySelector('.main-content')
      const mainScrollTop = mainElement ? mainElement.scrollTop : 0
      
             // Use state mobile status
       const currentIsMobile = window.innerWidth <= 768
      
             // On mobile, prioritize main element scroll, on desktop - window scroll
       let totalScrollTop
       if (currentIsMobile && mainScrollTop > 0) {
         totalScrollTop = mainScrollTop
       } else {
         totalScrollTop = Math.max(windowScrollTop, mainScrollTop)
       }
       
       // Fallback: check if page is scrollable and has content below fold
       if (totalScrollTop === 0 && currentIsMobile) {
        // Check if page has scrollable content
        const documentHeight = Math.max(
          document.body.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.clientHeight,
          document.documentElement.scrollHeight,
          document.documentElement.offsetHeight
        )
        const windowHeight = window.innerHeight
        
        // If page is taller than viewport but no scroll detected, force show after small delay
        if (documentHeight > windowHeight + 100) {
          totalScrollTop = 1 // Minimal non-zero value
        }
      }
      

      
             // Simplified show logic - always show on mobile after any scroll or if content is long
       let shouldShow = false
       
       if (currentIsMobile) {
         // On mobile: show if ANY scroll detected OR if page is long
         const isLongPage = document.documentElement.scrollHeight > window.innerHeight + 200
         shouldShow = totalScrollTop > 0 || isLongPage
       } else {
         // On desktop: normal logic
         shouldShow = totalScrollTop > 200
       }
       
       setIsVisible(shouldShow)
    }

    // Check initial scroll position
    toggleVisibility()

    // Listen to both window and main element scroll
    window.addEventListener('scroll', toggleVisibility, { passive: true })
    window.addEventListener('resize', toggleVisibility, { passive: true })
    
    // Find main scrollable element
    const mainElement = document.getElementById('main-content') || 
                        document.querySelector('main') ||
                        document.querySelector('.main-content')
    if (mainElement) {
      mainElement.addEventListener('scroll', toggleVisibility, { passive: true })
    }
    
    // Also listen to document scroll events
    document.addEventListener('scroll', toggleVisibility, { passive: true })
    
         return () => {
       window.removeEventListener('resize', checkMobile)
       window.removeEventListener('scroll', toggleVisibility)
       window.removeEventListener('resize', toggleVisibility)
       document.removeEventListener('scroll', toggleVisibility)
       if (mainElement) {
         mainElement.removeEventListener('scroll', toggleVisibility)
       }
     }
  }, [])

  const scrollToTop = () => {
    const currentIsMobile = window.innerWidth <= 768
    
    // Find main scrollable element
    const mainElement = document.getElementById('main-content') || 
                        document.querySelector('main') ||
                        document.querySelector('.main-content')
    

    console.log('ScrollToTop clicked:', { currentIsMobile, mainElement })
    
    // Try multiple scroll methods simultaneously
    try {
      // First, identify which container actually has scroll
      const rootElement = document.querySelector('#root')
      const appElement = document.querySelector('.App')
      
      const scrollContainers = [
        { name: 'window', element: window, scrollTop: window.pageYOffset },
        { name: 'documentElement', element: document.documentElement, scrollTop: document.documentElement.scrollTop },
        { name: 'body', element: document.body, scrollTop: document.body.scrollTop },
        { name: 'root', element: rootElement, scrollTop: rootElement?.scrollTop || 0 },
        { name: 'app', element: appElement, scrollTop: appElement?.scrollTop || 0 },
        { name: 'main', element: mainElement, scrollTop: mainElement?.scrollTop || 0 }
      ]
      
      const activeContainer = scrollContainers.find(c => c.scrollTop > 0)
      if (activeContainer && activeContainer.element) {
        
        // Try smooth scroll first
        if (activeContainer.name === 'window') {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        } else if (activeContainer.element && activeContainer.element.scrollTo) {
          activeContainer.element.scrollTo({ top: 0, behavior: 'smooth' })
        } else if (activeContainer.element) {
          // Custom smooth scroll for elements without scrollTo

          smoothScrollTo(activeContainer.element, 0, 400)
        }
        
        // Backup instant scroll if smooth doesn't work
        setTimeout(() => {
          const currentScrollCheck = activeContainer.name === 'window' ? window.pageYOffset : 
                                    activeContainer.element ? activeContainer.element.scrollTop : 0
          
          if (currentScrollCheck > 50) {

            if (activeContainer.name === 'window') {
              window.scrollTo(0, 0)
            } else if (activeContainer.element) {
              activeContainer.element.scrollTop = 0
            }
          }
        }, 500)
      } else {
        // No active scroll detected, try all methods

        
        // Try all possible containers
        window.scrollTo({ top: 0, behavior: 'smooth' })
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
        
        if (rootElement) {

          if (rootElement.scrollTo) {
            rootElement.scrollTo({ top: 0, behavior: 'smooth' })
          } else {
            smoothScrollTo(rootElement, 0, 400)
          }
          rootElement.scrollTop = 0
        }
        
        if (appElement) {

          if (appElement.scrollTo) {
            appElement.scrollTo({ top: 0, behavior: 'smooth' })
          }
          appElement.scrollTop = 0
        }
        
        if (currentIsMobile && mainElement) {

          if (mainElement.scrollTo) {
            mainElement.scrollTo({ top: 0, behavior: 'smooth' })
          }
          mainElement.scrollTop = 0
        }
      }
      
      // Backup methods (only if primary method fails)
      setTimeout(() => {
        const currentScroll = currentIsMobile ? (mainElement?.scrollTop || 0) : window.pageYOffset
        if (currentScroll > 50) {

          
          // Method 2: Document scroll
          if (document.documentElement.scrollTo) {
            document.documentElement.scrollTo({ top: 0, behavior: 'smooth' })
          }
          
          // Method 3: Body scroll
          if (document.body.scrollTo) {
            document.body.scrollTo({ top: 0, behavior: 'smooth' })
          }
        }
      }, 200)
      
      // Only use instant fallback if smooth scroll completely fails
      setTimeout(() => {
        const currentScroll = currentIsMobile ? (mainElement?.scrollTop || 0) : window.pageYOffset
        if (currentScroll > 100) {

          if (currentIsMobile && mainElement) {
            mainElement.scrollTop = 0
          } else {
            window.scrollTo(0, 0)
            document.documentElement.scrollTop = 0
            document.body.scrollTop = 0
          }
        }
      }, 800) // Give smooth scroll more time to complete
      
      // Final diagnostic check (for development only)
      if (import.meta.env.DEV) {
        setTimeout(() => {
          // Check ALL possible scroll containers
          const scrollValues = {
            window: window.pageYOffset,
            documentElement: document.documentElement.scrollTop,
            body: document.body.scrollTop,
            main: mainElement?.scrollTop || 0,
            root: document.querySelector('#root')?.scrollTop || 0,
            app: document.querySelector('.App')?.scrollTop || 0
          }
          
          const totalScroll = Math.max(...Object.values(scrollValues))
          
          console.log('DETAILED scroll check:', {
            mobile: currentIsMobile,
            scrollValues,
            maxScroll: totalScroll,
            success: totalScroll < 10,
            actuallyScrolled: totalScroll > 0
          })
          
          // If still scrolled, try one more aggressive scroll
          if (totalScroll > 10) {

            Object.entries(scrollValues).forEach(([name, value]) => {
              if (value > 0) {
                const element = name === 'window' ? window : 
                              name === 'documentElement' ? document.documentElement :
                              name === 'body' ? document.body :
                              name === 'main' ? mainElement :
                              name === 'root' ? document.querySelector('#root') :
                              name === 'app' ? document.querySelector('.App') : null
                
                if (element) {

                  try {
                    if (element.scrollTo) {
                      element.scrollTo(0, 0)
                    }
                    if (element.scrollTop !== undefined) {
                      element.scrollTop = 0
                    }
                  } catch (e) {

                  }
                }
              }
            })
          }
        }, 1000)
      }
      
    } catch (error) {
      console.error('ScrollToTop error:', error)
    }
  }

  return (
    <>

      
      <AnimatePresence>
        {(isVisible || (isMobile && import.meta.env.DEV)) && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-[9998] w-12 h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group touch-manipulation"
          aria-label="Повернутися вгору"
          title="Повернутися вгору"
          style={{ 
            minWidth: '48px', 
            minHeight: '48px',
            WebkitTapHighlightColor: 'transparent',
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9998
          }}
        >
          <svg 
            className="w-6 h-6 transition-transform duration-300 group-hover:-translate-y-0.5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 10l7-7m0 0l7 7m-7-7v18" 
            />
          </svg>
        </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}

export default BackToTop
