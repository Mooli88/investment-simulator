import { useState, useEffect } from 'react'
import {
  generateMarketConditions,
  MarketConditions,
} from '../utils/probabilityUtils'
import { getHistoricalReturns } from '../services/stockService'

interface InvestmentParams {
  initialInvestment: number
  investmentYears: number
  savingsRate: number
  stockMarketRate: number
  inflationRate: number
  marketStatus: number
  monthlyTopUp: number
}

export function useInvestmentCalculator(params: InvestmentParams) {
  const [marketConditions, setMarketConditions] = useState<MarketConditions>(
    () => generateMarketConditions(params.marketStatus)
  )

  useEffect(() => {
    setMarketConditions(generateMarketConditions(params.marketStatus))
  }, [params.marketStatus])

  const [results, setResults] = useState(() =>
    generateData(params, marketConditions)
  )

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setResults(generateData(params, marketConditions))
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [params, marketConditions])

  return results
}

function generateData(
  params: InvestmentParams,
  marketConditions: MarketConditions
) {
  const {
    initialInvestment,
    investmentYears,
    savingsRate,
    inflationRate,
    monthlyTopUp,
  } = params

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

    // Increase base volatility range significantly
    nasdaqMonthlyRate *= 0.9 + 0.2 * Math.random()

    // Apply market conditions with stronger cumulative effects
    let monthlyMultiplier = 1
    Object.values(marketConditions).forEach((condition) => {
      // Remove the duration check to allow more frequent changes
      if (Math.random() < condition.probability) {
        monthlyMultiplier *= condition.severity
      }
    })

    // Apply the cumulative effect to the monthly rate
    nasdaqMonthlyRate *= monthlyMultiplier

    // Increase random noise significantly
    nasdaqMonthlyRate += (Math.random() - 0.5) * 0.05

    // Add occasional sharp movements
    if (Math.random() < 0.15) {
      // 15% chance of sharp movement
      nasdaqMonthlyRate *= 0.85 + 0.3 * Math.random() // Can move 85%-115% of current rate
    }

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
