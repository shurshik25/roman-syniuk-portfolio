
import { motion } from 'framer-motion'
import FormField from './FormField'

const StatsEditor = ({ stats, onChange, fields }) => {
  const handleStatChange = (key, value) => {
    const newStats = { ...stats, [key]: value }
    onChange(newStats)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {fields.map((field, index) => (
        <motion.div
          key={field.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">
                {field.key === 'roles'
                  ? '🎭'
                  : field.key === 'experience'
                    ? '📅'
                    : field.key === 'availability'
                      ? '✅'
                      : '📊'}
              </span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{field.label}</h4>
              <p className="text-sm text-gray-600">
                {field.key === 'roles'
                  ? 'Кількість зіграних ролей'
                  : field.key === 'experience'
                    ? 'Років професійного досвіду'
                    : field.key === 'availability'
                      ? 'Відсоток доступності для проектів'
                      : 'Статистичне значення'}
              </p>
            </div>
          </div>

          <FormField
            value={stats[field.key] || ''}
            onChange={value => handleStatChange(field.key, value)}
            type={field.type}
            placeholder={`Введіть ${field.label.toLowerCase()}`}
            validation={[
              { type: 'number', message: 'Має бути числом' },
              ...(field.max
                ? [{ type: 'positiveNumber', message: 'Має бути позитивним числом' }]
                : []),
            ]}
          />

          {/* Preview */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {stats[field.key] || '0'}
                {field.suffix || ''}
              </div>
              <div className="text-sm text-gray-700">{field.label}</div>
            </div>
          </div>

          {/* Tips */}
          {field.key === 'availability' && (
            <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-800">
              💡 100% = повністю доступний для нових проектів
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}

export default StatsEditor
