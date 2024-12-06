import { useState, useEffect } from 'react'
import { generateLossProbability } from '../utils/probabilityUtils'
import { getHistoricalReturns } from '../services/stockService'

interface InvestmentParams {
  initialInvestment: number
  investmentYears: number
  savingsRate: number
  stockMarketRate: number
  inflationRate: number
  volatilityFactor: number
  monthlyTopUp: number
}

export function useInvestmentCalculator(params: InvestmentParams) {
  const [results, setResults] = useState(() => generateData(params))

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setResults(generateData(params))
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [params])

  return results
}

function generateData(params: InvestmentParams) {
  const {
    initialInvestment,
    investmentYears,
    savingsRate,
    inflationRate,
    volatilityFactor,
    monthlyTopUp,
  } = params

  const lossProbabilities = generateLossProbability(volatilityFactor)

  let savingsBalance = initialInvestment
  let nasdaqBalance = initialInvestment
  let nasdaqHistoricalBalance = 0

  const historicalReturns = getHistoricalReturns(
    params.investmentYears,
    monthlyTopUp
  )
  const initialNasdaqValue = historicalReturns[0].value
  const scaleFactor = initialInvestment / initialNasdaqValue

  let yearlyData = [
    {
      year: 0,
      savingsAccount: initialInvestment,
      nasdaqWithLosses: initialInvestment,
      nasdaqHistorical: initialInvestment,
    },
  ]

  for (let month = 0; month < investmentYears * 12; month++) {
    const year = month / 12

    savingsBalance += monthlyTopUp
    nasdaqBalance += monthlyTopUp

    const inflationFactor = Math.pow(1 + inflationRate / 100, 1 / 12)

    savingsBalance *= Math.pow(1 + savingsRate / 100 / 12, 1) / inflationFactor

    let nasdaqMonthlyRate = params.stockMarketRate / 100 / 12
    Object.values(lossProbabilities).forEach((event) => {
      if (Math.random() < event.probability) {
        if (month % (event.duration * 2) < event.duration) {
          nasdaqMonthlyRate *= event.severity
        }
      }
    })
    nasdaqBalance *= Math.pow(1 + nasdaqMonthlyRate, 1) / inflationFactor

    if (month % 12 === 11 || month === investmentYears * 12 - 1) {
      const yearIndex = Math.round(year)
      const historicalDataPoint = historicalReturns[yearIndex]

      nasdaqHistoricalBalance =
        historicalDataPoint.value * scaleFactor + monthlyTopUp * 12 * yearIndex

      yearlyData.push({
        year: yearIndex,
        savingsAccount: Math.round(savingsBalance),
        nasdaqWithLosses: Math.round(nasdaqBalance),
        nasdaqHistorical: Math.round(
          historicalDataPoint.value * scaleFactor +
            monthlyTopUp * 12 * yearIndex
        ),
      })
    }
  }

  return {
    yearlyData,
    finalSavingsValue: Math.round(savingsBalance),
    finalNasdaqValue: Math.round(nasdaqBalance),
    finalNasdaqHistoricalValue: Math.round(nasdaqHistoricalBalance),
    totalInvested: initialInvestment + monthlyTopUp * investmentYears * 12,
  }
}
