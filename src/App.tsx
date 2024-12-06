import './App.css'
import AdvancedInvestmentSimulation from './main'
import { DarkModeProvider } from './contexts/DarkModeContext'
import { DarkModeToggle } from './components/DarkModeToggle'

function App() {
  return (
    <DarkModeProvider>
      <div className='min-h-screen bg-white dark:bg-gray-900 transition-colors'>
        <DarkModeToggle />
        <AdvancedInvestmentSimulation />
      </div>
    </DarkModeProvider>
  )
}

export default App
