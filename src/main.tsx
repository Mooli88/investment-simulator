import { useEffect, useState } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

// Probability distributions for market losses
const generateLossProbability = (volatility: number) => {
  return {
    tenPercent: {
      probability: 0.3 * volatility,
      severity: 0.9,
      duration: 4,
    },
    thirtyPercent: {
      probability: 0.05 * volatility,
      severity: 0.7,
      duration: 12,
    },
    blackSwan: {
      probability: 0.01 * volatility,
      severity: 0.5,
      duration: 24,
    },
  }
}

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

  // State to hold the computed results
  const [results, setResults] = useState(() => generateData(params))

  // Debounced computation effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setResults(generateData(params))
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [params])

  // Move generateData outside of component and make it take params as argument
  function generateData(params: {
    initialInvestment: number
    investmentYears: number
    savingsRate: number
    stockMarketRate: number
    inflationRate: number
    volatilityFactor: number
    monthlyTopUp: number
  }) {
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

    let yearlyData = [
      {
        year: 0,
        savingsAccount: initialInvestment,
        nasdaqWithLosses: initialInvestment,
      },
    ]

    for (let month = 0; month < investmentYears * 12; month++) {
      const year = month / 12

      savingsBalance += monthlyTopUp
      nasdaqBalance += monthlyTopUp

      // Apply inflation
      const inflationFactor = Math.pow(1 + inflationRate / 100, 1 / 12)

      // Savings account growth (adjusted for inflation)
      savingsBalance *=
        Math.pow(1 + savingsRate / 100 / 12, 1) / inflationFactor

      // NASDAQ simulation
      let nasdaqMonthlyRate = params.stockMarketRate / 100 / 12
      Object.values(lossProbabilities).forEach((event) => {
        if (Math.random() < event.probability) {
          if (month % (event.duration * 2) < event.duration) {
            nasdaqMonthlyRate *= event.severity
          }
        }
      })
      nasdaqBalance *= Math.pow(1 + nasdaqMonthlyRate, 1) / inflationFactor

      // Only store data points at the end of each year
      if (month % 12 === 11 || month === investmentYears * 12 - 1) {
        yearlyData.push({
          year: Math.round(year),
          savingsAccount: Math.round(savingsBalance),
          nasdaqWithLosses: Math.round(nasdaqBalance),
        })
      }
    }

    return {
      yearlyData,
      finalSavingsValue: Math.round(savingsBalance),
      finalNasdaqValue: Math.round(nasdaqBalance),
      totalInvested: initialInvestment + monthlyTopUp * investmentYears * 12,
    }
  }

  const handleParamChange = (key: string, value: string) => {
    setParams((prev) => ({
      ...prev,
      [key]: Number(value),
    }))
  }

  // Use results instead of useMemo
  const { yearlyData, finalSavingsValue, finalNasdaqValue, totalInvested } =
    results

  return (
    <div className='w-full'>
      {/* Parameter Controls */}
      <div className='flex flex-wrap justify-center gap-4 mb-6 p-4 bg-gray-100 rounded'>
        <div className='flex flex-col'>
          <label>Initial Investment (£)</label>
          <input
            type='number'
            value={params.initialInvestment}
            onChange={(e) =>
              handleParamChange('initialInvestment', e.target.value)
            }
            className='border p-2'
          />
        </div>
        <div className='flex flex-col'>
          <label>Investment Years</label>
          <input
            type='number'
            value={params.investmentYears}
            onChange={(e) =>
              handleParamChange('investmentYears', e.target.value)
            }
            className='border p-2'
          />
        </div>
        <div className='flex flex-col'>
          <label>Savings Rate (%)</label>
          <input
            type='number'
            value={params.savingsRate}
            onChange={(e) => handleParamChange('savingsRate', e.target.value)}
            className='border p-2'
          />
        </div>
        <div className='flex flex-col'>
          <label>Inflation Rate (%)</label>
          <input
            type='number'
            value={params.inflationRate}
            onChange={(e) => handleParamChange('inflationRate', e.target.value)}
            className='border p-2'
          />
        </div>
        <div className='flex flex-col'>
          <label>Volatility Factor</label>
          <input
            type='number'
            step='0.1'
            value={params.volatilityFactor}
            onChange={(e) =>
              handleParamChange('volatilityFactor', e.target.value)
            }
            className='border p-2'
          />
        </div>
        <div className='flex flex-col'>
          <label>Monthly Top-up (£)</label>
          <input
            type='number'
            value={params.monthlyTopUp}
            onChange={(e) => handleParamChange('monthlyTopUp', e.target.value)}
            className='border p-2'
          />
        </div>
      </div>

      {/* Main Investment Comparison Chart */}
      <div className='w-full h-96'>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart
            data={yearlyData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis
              dataKey='year'
              label={{
                value: 'Years',
                position: 'insideBottomRight',
                offset: -10,
              }}
            />
            <YAxis
              label={{
                value: 'Total Balance (£)',
                angle: -90,
                position: 'insideLeft',
              }}
            />
            <Tooltip />
            <Legend />
            <Line
              strokeWidth={3}
              type='monotone'
              dataKey='savingsAccount'
              stroke='#0000FF'
              activeDot={{ r: 8 }}
              name='Savings Account (Inflation-Adjusted)'
            />
            <Line
              strokeWidth={3}
              type='monotone'
              dataKey='nasdaqWithLosses'
              stroke='#FF0000'
              name='NASDAQ Historical Performance'
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Cumulative Returns Breakdown */}
      <div className='mt-8 p-4 bg-gray-50 rounded'>
        <h3 className='text-lg font-bold mb-4'>
          Final Values After {params.investmentYears} Years
        </h3>
        <div className='grid grid-cols-3 gap-4'>
          <div>
            <h4 className='font-semibold text-gray-600'>Total Invested</h4>
            <p>£{totalInvested.toLocaleString()}</p>
          </div>
          <div>
            <h4 className='font-semibold text-blue-600'>Savings Account</h4>
            <p>£{finalSavingsValue.toLocaleString()}</p>
            <p className='text-sm font-bold text-gray-600'>
              Profit: £{(finalSavingsValue - totalInvested).toLocaleString()}
            </p>
            <p className='text-sm text-gray-600'>
              Return:{' '}
              {(
                ((finalSavingsValue - totalInvested) / totalInvested) *
                100
              ).toFixed(1)}
              %
            </p>
          </div>
          <div>
            <h4 className='font-semibold text-red-600'>NASDAQ Performance</h4>
            <p>£{finalNasdaqValue.toLocaleString()}</p>
            <p className='text-sm font-bold text-gray-600'>
              Profit: £{(finalNasdaqValue - totalInvested).toLocaleString()}
            </p>
            <p className='text-sm text-gray-600'>
              Return:{' '}
              {(
                ((finalNasdaqValue - totalInvested) / totalInvested) *
                100
              ).toFixed(1)}
              %
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdvancedInvestmentSimulation
