
import { motion, AnimatePresence } from 'framer-motion'
import { quickActions } from './constants'

const QuickActions = ({ visible, onAction, canUndo, canRedo }) => {
  if (!visible) return null

  const isDisabled = actionId => {
    if (actionId === 'undo') return !canUndo
    if (actionId === 'redo') return !canRedo
    return false
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, x: 20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.8, x: 20 }}
        className="fixed right-6 top-1/2 transform -translate-y-1/2 z-60"
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-2 space-y-1">
          {quickActions.map(action => (
            <motion.button
              key={action.id}
              onClick={() => onAction(action.id)}
              disabled={isDisabled(action.id)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg transition-all ${
                isDisabled(action.id)
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:text-white hover:bg-purple-600 hover:shadow-lg'
              }`}
              whileHover={!isDisabled(action.id) ? { scale: 1.1 } : {}}
              whileTap={!isDisabled(action.id) ? { scale: 0.95 } : {}}
              title={`${action.label} (${action.shortcut})`}
            >
              {action.icon}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default QuickActions
