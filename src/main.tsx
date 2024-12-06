import { useState } from 'react'
import { ParameterControls } from './components/ParameterControls'
import { InvestmentChart } from './components/InvestmentChart'
import { useInvestmentCalculator } from './hooks/useInvestmentCalculator'
import { ResultsSummary } from './components/ResultsSummary'

const AdvancedInvestmentSimulation = () => {
  const [params, setParams] = useState({
    initialInvestment: 10000,
    investmentYears: 5,
    savingsRate: 5,
    stockMarketRate: 10,
    inflationRate: 2,
    volatilityFactor: 1,
    monthlyTopUp: 100,
  })

  const {
    // monthlyData,
    yearlyData,
    finalSavingsValue,
    finalNasdaqValue,
    finalNasdaqHistoricalValue,
    totalInvested,
  } = useInvestmentCalculator(params)

  const handleParamChange = (key: string, value: string) => {
    setParams((prev) => ({
      ...prev,
      [key]: Number(value),
    }))
  }

  return (
    <div className='w-full'>
      <ParameterControls params={params} onParamChange={handleParamChange} />
      <InvestmentChart
        data={{ yearlyData }}
        investmentYears={params.investmentYears}
      />
      <ResultsSummary
        investmentYears={params.investmentYears}
        totalInvested={totalInvested}
        finalSavingsValue={finalSavingsValue}
        finalNasdaqValue={finalNasdaqValue}
        finalNasdaqHistoricalValue={finalNasdaqHistoricalValue}
      />
    </div>
  )
}

export default AdvancedInvestmentSimulation
