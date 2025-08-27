import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

const SearchAndFilter = ({
  searchQuery,
  setSearchQuery,
  onClose,
  searchResults,
  onResultClick,
}) => {
  const inputRef = useRef(null)

  useEffect(() => {
    // Фокус на input при відкритті
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleKeyDown = e => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white border-b border-gray-200 shadow-sm"
    >
      <div className="p-4">
        <div className="flex items-center gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">🔍</span>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Пошук по всьому контенту... (Ctrl+F)"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
            title="Закрити пошук (Esc)"
          >
            ✕
          </button>
        </div>

        {/* Search Results Summary */}
        {searchQuery && (
          <div className="mt-3 text-sm text-gray-700">
            {searchResults && searchResults.length > 0 ? (
              <span>
                Знайдено{' '}
                {searchResults.reduce((total, section) => total + section.matches.length, 0)}{' '}
                результатів у {searchResults.length} секціях
              </span>
            ) : searchQuery.length > 2 ? (
              <span>Нічого не знайдено для запиту &ldquo;{searchQuery}&rdquo;</span>
            ) : (
              <span>Введіть принаймні 3 символи для пошуку</span>
            )}
          </div>
        )}

        {/* Quick Search Results */}
        {searchQuery && searchResults && searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 bg-gray-50 rounded-xl p-4 max-h-60 overflow-y-auto"
          >
            <div className="space-y-3">
              {searchResults.slice(0, 5).map((result, index) => (
                <div key={index}>
                  <div className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    {result.section}
                  </div>
                  <div className="space-y-1 ml-4">
                    {result.matches.slice(0, 3).map((match, matchIndex) => (
                      <button
                        key={matchIndex}
                        onClick={() => onResultClick(match.path)}
                        className="block w-full text-left text-sm text-gray-600 hover:text-purple-700 hover:bg-white p-2 rounded-lg transition-colors"
                      >
                        <div className="font-mono text-xs text-gray-500 mb-1">{match.path}</div>
                        <div className="truncate">
                          {highlightSearchTerm(match.value, searchQuery)}
                        </div>
                      </button>
                    ))}
                    {result.matches.length > 3 && (
                      <div className="text-xs text-gray-500 pl-2">
                        ще {result.matches.length - 3} результатів...
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {searchResults.length > 5 && (
                <div className="text-center pt-2 border-t border-gray-200">
                  <span className="text-sm text-gray-500">
                    Показано 5 з {searchResults.length} секцій
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

// Функція для підсвічування знайденого тексту
const highlightSearchTerm = (text, searchTerm) => {
  if (!searchTerm) return text

  const regex = new RegExp(`(${searchTerm})`, 'gi')
  const parts = text.split(regex)

  return parts.map((part, index) => {
    if (part.toLowerCase() === searchTerm.toLowerCase()) {
      return (
        <mark key={index} className="bg-yellow-200 text-yellow-800 px-1 rounded">
          {part}
        </mark>
      )
    }
    return part
  })
}

export default SearchAndFilter
