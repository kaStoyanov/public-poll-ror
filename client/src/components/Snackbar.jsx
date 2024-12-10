import { useState, useEffect } from 'react'

export default function Snackbar({ message, isError = false, duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(true)
  const [shouldRender, setShouldRender] = useState(true)

  useEffect(() => {
    const hideTimer = setTimeout(() => {
      setIsVisible(false)
    }, duration)

    const removeTimer = setTimeout(() => {
      setShouldRender(false)
      onClose?.()
    }, duration + 500) 
    return () => {
      clearTimeout(hideTimer)
      clearTimeout(removeTimer)
    }
  }, [duration, onClose])

  if (!shouldRender) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div 
        className={`
          px-6 py-3 rounded-lg shadow-lg
          ${isError ? 'bg-red-500' : 'bg-green-500'}
          text-white
          ${isVisible ? 'snackbar-enter' : 'snackbar-exit'}
        `}
      >
        {message}
      </div>
    </div>
  )
}