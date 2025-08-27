
import { motion } from 'framer-motion'

const AdminHeader = ({
  onClose,
  lastSaved,
  autoSaveEnabled,
  setAutoSaveEnabled,
  onQuickAction,
  canUndo,
  canRedo,
  onOpenMobileSidebar,
  onSave,
  hasChanges,
}) => {
  const formatLastSaved = date => {
    if (!date) return 'Ніколи'

    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)

    if (minutes < 1) return 'Щойно'
    if (minutes < 60) return `${minutes} хв тому`

    return date.toLocaleTimeString('uk-UA', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white p-2 md:p-4 shadow-lg">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Mobile menu button */}
          <button
            onClick={onOpenMobileSidebar}
            className="md:hidden w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
            title="Відкрити меню"
          >
            ☰
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="text-base md:text-xl font-bold truncate select-none">Адмін панель</h1>
            {lastSaved && (
              <p className="text-purple-100 text-xs hidden lg:block truncate select-none">
                Збережено: {formatLastSaved(lastSaved)}
              </p>
            )}
          </div>

          {/* Auto-save toggle - hidden on small screens */}
          <div className="hidden lg:flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg">
            <span className="text-sm select-none">Автозбереження</span>
            <button
              onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
              className={`relative w-10 h-5 rounded-full transition-colors ${
                autoSaveEnabled ? 'bg-green-400' : 'bg-gray-400'
              }`}
            >
              <motion.div
                className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm"
                animate={{ x: autoSaveEnabled ? 20 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          

          {/* Quick Actions - Only essential ones */}
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onQuickAction('undo')}
              disabled={!canUndo}
              className="w-8 h-8 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center text-sm"
              title="Скасувати (Ctrl+Z)"
            >
              ↶
            </button>

            <button
              onClick={() => onQuickAction('search')}
              className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center justify-center text-sm"
              title="Пошук (Ctrl+F)"
            >
              🔍
            </button>

            {/* Save Button */}
            <button
              onClick={onSave}
              disabled={!hasChanges}
              className={`w-8 h-8 rounded-lg transition-colors flex items-center justify-center text-sm ${
                hasChanges 
                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                  : 'bg-white/10 text-white/50 cursor-not-allowed'
              }`}
              title={hasChanges ? 'Зберегти зміни (Ctrl+S)' : 'Немає змін для збереження'}
            >
              💾
            </button>
          </div>
        </div>

        {/* Close button - Top right corner */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 md:top-3 md:right-3 w-8 h-8 md:w-9 md:h-9 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center justify-center text-lg hover:scale-110"
          title="Закрити (Esc)"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export default AdminHeader
