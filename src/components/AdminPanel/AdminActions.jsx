
import { motion } from 'framer-motion'
import { resetToCleanState } from '../../utils/cleanContent'

const AdminActions = ({ onSave, onReset, onReload, isLoading, hasChanges, autoSaveEnabled = true }) => {
  return (
    <div className="bg-gray-50 border-t border-gray-200 p-2 md:p-4">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 md:gap-0">
        {/* Status Info - Simplified, only show when there are unsaved changes */}
        {hasChanges && (
          <div className="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-lg border border-orange-200">
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
            <span className="text-sm font-medium text-orange-700 select-none">Незбережені зміни</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          {/* Save Button - Primary action, always visible */}
          <motion.button
            onClick={onSave}
            disabled={isLoading}
            className={`px-6 py-3 md:px-8 md:py-3 rounded-lg font-semibold transition-all flex items-center gap-2 text-base ${
              hasChanges
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl'
                : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md'
            } disabled:opacity-50 disabled:cursor-not-allowed order-1 md:order-last`}
            whileHover={{ scale: hasChanges ? 1.02 : 1 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <>
                <motion.div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                <span className="select-none">Збереження...</span>
              </>
            ) : (
              <>
                <span className="text-lg">💾</span>
                <span className="select-none">
                  {hasChanges ? 'Зберегти зміни' : 'Збережено'}
                </span>
              </>
            )}
          </motion.button>

          {/* Secondary Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onReload}
              disabled={isLoading}
              className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
              title="Перезавантажити дані з сервера"
            >
              <motion.span
                animate={isLoading ? { rotate: 360 } : {}}
                transition={{ duration: 1, repeat: isLoading ? Infinity : 0, ease: 'linear' }}
                className="text-base"
              >
                ↻
              </motion.span>
              <span className="hidden lg:inline text-sm select-none">Оновити</span>
            </button>

            {/* Desktop-only buttons */}
            <div className="hidden xl:flex items-center gap-1">
              {/* Storage Info Button */}
              <button
                onClick={async () => {
                  const { logStorageStats } = await import('../../utils/storageUtils')
                  logStorageStats()
                  alert('Статистика localStorage виведена в консоль (F12 → Console)')
                }}
                disabled={isLoading}
                className="px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2 text-sm"
                title="Показати статистику localStorage"
              >
                <span className="select-none">📊 Статистика</span>
              </button>

              {/* Clear Storage Button */}
              <button
                onClick={() => {
                  if (confirm('Очистити localStorage? Це вирішить проблеми з переповненням сховища.')) {
                    localStorage.clear()
                    window.location.reload()
                  }
                }}
                disabled={isLoading}
                className="px-3 py-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2 text-sm"
                title="Очистити localStorage"
              >
                <span className="select-none">🧹 Кеш</span>
              </button>

              {/* Reset Button */}
              <button
                onClick={() => {
                  if (confirm('Ви впевнені, що хочете скинути всі зміни до початкового стану?')) {
                    resetToCleanState()
                    onReset()
                  }
                }}
                disabled={isLoading}
                className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2 text-sm"
                title="Скинути до початкових налаштувань"
              >
                <span className="select-none">🔄 Скинути</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Help Text - simplified */}
      {autoSaveEnabled && (
        <div className="mt-2 text-xs text-gray-500 text-center hidden md:block">
          <span className="select-none">Автозбереження увімкнено</span>
        </div>
      )}
    </div>
  )
}

export default AdminActions
