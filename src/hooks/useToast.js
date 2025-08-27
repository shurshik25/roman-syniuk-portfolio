import { useState } from 'react'

export const useToast = () => {
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now()
    const newToast = { id, message, type, duration }
    setToasts(prev => [...prev, newToast])
    
    setTimeout(() => {
      removeToast(id)
    }, duration)
    
    return id
  }

  const removeToast = id => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const showSuccess = message => addToast(message, 'success')
  const showError = message => addToast(message, 'error')
  const showWarning = message => addToast(message, 'warning')
  const showInfo = message => addToast(message, 'info')

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  }
}
