import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ChangeHistory = ({ history, onRevert }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [filter, setFilter] = useState('all') // all, save, edit, delete, upload

  const getActionIcon = action => {
    switch (action) {
      case 'save':
        return '💾'
      case 'edit':
        return '✏️'
      case 'delete':
        return '🗑️'
      case 'upload':
        return '📁'
      case 'image_upload':
        return '🖼️'
      case 'add':
        return '➕'
      case 'reset':
        return '🔄'
      case 'reload':
        return '↻'
      case 'revert':
        return '↶'
      default:
        return '📝'
    }
  }

  const getActionColor = action => {
    switch (action) {
      case 'save':
        return 'text-green-600'
      case 'edit':
        return 'text-blue-600'
      case 'delete':
        return 'text-red-600'
      case 'upload':
        return 'text-purple-600'
      case 'image_upload':
        return 'text-purple-600'
      case 'add':
        return 'text-emerald-600'
      case 'reset':
        return 'text-orange-600'
      case 'reload':
        return 'text-indigo-600'
      case 'revert':
        return 'text-yellow-600'
      default:
        return 'text-gray-600'
    }
  }

  const filteredHistory = history.filter(item => {
    if (filter === 'all') return true
    return item.action.includes(filter)
  })

  const formatTime = date => {
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)

    if (minutes < 1) return 'Щойно'
    if (minutes < 60) return `${minutes}хв`
    if (minutes < 1440) return `${Math.floor(minutes / 60)}г`
    return date.toLocaleDateString('uk-UA', { month: 'short', day: 'numeric' })
  }

  return (
    <motion.div
      className={`bg-gray-50 border-l border-gray-200 transition-all duration-300 ${
        isExpanded ? 'w-80' : 'w-12'
      }`}
      initial={false}
      animate={{ width: isExpanded ? 320 : 48 }}
    >
      {/* Toggle Button */}
      <div className="p-3 border-b border-gray-200">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          title={isExpanded ? 'Згорнути історію' : 'Показати історію змін'}
        >
          <motion.span animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
            📋
          </motion.span>
          {isExpanded && <span className="ml-2 text-sm">Історія</span>}
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-full"
          >
            {/* Filter */}
            <div className="p-3 border-b border-gray-200">
              <select
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="w-full text-xs p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">Всі дії</option>
                <option value="save">Збереження</option>
                <option value="edit">Редагування</option>
                <option value="upload">Завантаження</option>
                <option value="delete">Видалення</option>
              </select>
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filteredHistory.length > 0 ? (
                filteredHistory.map(item => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="group bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all border border-gray-100"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2 flex-1">
                        <span className={`text-lg ${getActionColor(item.action)}`}>
                          {getActionIcon(item.action)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-gray-800 truncate">
                            {item.details}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {formatTime(item.timestamp)}
                          </div>
                        </div>
                      </div>

                      {/* Revert Button */}
                      {item.action !== 'revert' && (
                        <button
                          onClick={() => onRevert(item)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-purple-600 transition-all"
                          title="Повернутися до цього стану"
                        >
                          ↶
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-2xl mb-2">📝</div>
                  <div className="text-sm">
                    {filter === 'all' ? 'Історія порожня' : 'Немає дій цього типу'}
                  </div>
                </div>
              )}
            </div>

            {/* Stats */}
            {history.length > 0 && (
              <div className="p-3 border-t border-gray-200 text-xs text-gray-500">
                <div className="flex justify-between items-center">
                  <span>Всього дій: {history.length}</span>
                  <span>Показано: {filteredHistory.length}</span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default ChangeHistory
