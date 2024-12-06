import { useDarkMode } from '../contexts/DarkModeContext'

export const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode()

  return (
    <button
      onClick={toggleDarkMode}
      className='fixed top-4 right-4 p-2 rounded-lg bg-gray-200 dark:bg-gray-700'
    >
      {isDarkMode ? '🌞' : '🌙'}
    </button>
  )
}
