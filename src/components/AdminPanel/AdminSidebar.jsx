
import { motion, AnimatePresence } from 'framer-motion'
import { adminTabs } from './constants'

const AdminSidebar = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  searchQuery,
  searchResults,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  return (
    <motion.div
      className={`bg-gray-50 border-r border-gray-200 flex flex-col transition-all duration-300 sidebar ${
        isCollapsed ? 'w-16' : 'w-80'
      } ${isMobileOpen ? 'mobile-open' : ''}`}
      initial={false}
      animate={{ width: isCollapsed ? 64 : 320 }}
    >
      {/* Header with collapse/close buttons */}
      <div className="p-2 md:p-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {/* Desktop collapse button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex items-center justify-center p-1.5 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <motion.span 
              animate={{ rotate: isCollapsed ? 0 : 180 }} 
              transition={{ duration: 0.3 }}
              className="text-lg"
            >
              ☰
            </motion.span>
            {!isCollapsed && <span className="ml-2 text-sm">Згорнути</span>}
          </button>

          {/* Mobile close button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden flex items-center justify-center p-1.5 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors ml-auto"
          >
            <span className="text-xl">×</span>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 md:p-4 space-y-1 md:space-y-2">
        {adminTabs.map(tab => (
          <motion.button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id)
              // Close mobile sidebar after selection on mobile
              if (isMobileOpen) {
                setIsMobileOpen(false)
              }
            }}
            className={`w-full flex items-center gap-2 md:gap-3 p-2.5 md:p-3 rounded-lg md:rounded-xl font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-purple-100 text-purple-800 shadow-sm border border-purple-200'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            title={isCollapsed ? tab.label : undefined}
          >
            <span className="text-lg md:text-xl flex-shrink-0">{tab.icon}</span>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex flex-col items-start overflow-hidden min-w-0 flex-1"
                >
                  <span className="font-medium text-base md:text-lg truncate w-full">{tab.label}</span>
                  <span className="text-xs text-gray-500 leading-tight hidden lg:block truncate w-full">{tab.description}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </nav>

      {/* Search Results */}
      <AnimatePresence>
        {!isCollapsed && searchQuery && searchResults && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-200 p-2 md:p-4 max-h-48 md:max-h-64 overflow-y-auto"
          >
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Результати пошуку</h3>
            {searchResults.length > 0 ? (
              <div className="space-y-2">
                {searchResults.map((result, index) => (
                  <div key={index} className="text-xs">
                    <div className="font-medium text-gray-800 mb-1">{result.section}</div>
                    {result.matches.slice(0, 3).map((match, matchIndex) => (
                      <div
                        key={matchIndex}
                        className="text-gray-700 pl-2 py-1 hover:bg-gray-100 rounded cursor-pointer truncate"
                        onClick={() => {
                          // Navigate to result
                          // console.log('Navigate to:', match.path)
                        }}
                      >
                        {match.path}: {match.value.substring(0, 50)}...
                      </div>
                    ))}
                    {result.matches.length > 3 && (
                      <div className="text-gray-500 text-xs pl-2">
                        +{result.matches.length - 3} більше
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Нічого не знайдено</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer - hidden on mobile to save space */}
      {!isCollapsed && (
        <div className="hidden lg:block p-4 border-t border-gray-200 text-xs text-gray-500">
          <div className="flex items-center justify-between mb-2">
            <span>Швидкі клавіші:</span>
          </div>
          <div className="space-y-1">
            <div>Ctrl+S - Зберегти</div>
            <div>Ctrl+Z - Скасувати</div>
            <div>Ctrl+F - Пошук</div>
            <div>Esc - Закрити</div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default AdminSidebar
