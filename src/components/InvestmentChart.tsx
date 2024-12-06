import React from 'react'
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
import { useDarkMode } from '../contexts/DarkModeContext'

const currentYear = new Date().getFullYear()

interface InvestmentChartProps {
  data: {
    // monthlyData: any[]
    yearlyData: any[]
  }
  investmentYears: number
}

export const InvestmentChart: React.FC<InvestmentChartProps> = ({
  data,
  investmentYears,
}) => {
  const { isDarkMode } = useDarkMode()

  const formatXAxis = (value: any) => {
    const year = Math.floor(value)
    return `${year + currentYear}`
  }

  return (
    <div className='w-full h-96'>
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart
          data={data.yearlyData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray='3 3'
            stroke={isDarkMode ? '#374151' : '#e5e7eb'}
          />
          <XAxis
            dataKey='year'
            label={{
              value: 'Calendar Year',
              position: 'insideBottomRight',
              offset: -10,
              fill: isDarkMode ? '#9CA3AF' : '#4B5563',
            }}
            stroke={isDarkMode ? '#9CA3AF' : '#4B5563'}
            tickFormatter={formatXAxis}
          />
          <XAxis
            dataKey='year'
            orientation='top'
            label={{
              value: 'NASDAQ',
              position: 'insideTopRight',
              offset: -10,
              fill: isDarkMode ? '#9CA3AF' : '#4B5563',
            }}
            stroke={isDarkMode ? '#9CA3AF' : '#4B5563'}
            tickFormatter={(value) =>
              (currentYear - investmentYears + value).toString()
            }
            xAxisId='top'
          />
          <YAxis
            label={{
              value: 'Total Balance (£)',
              angle: -90,
              position: 'insideLeft',
              fill: isDarkMode ? '#9CA3AF' : '#4B5563',
            }}
            stroke={isDarkMode ? '#9CA3AF' : '#4B5563'}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
              borderColor: isDarkMode ? '#374151' : '#E5E7EB',
              color: isDarkMode ? '#F3F4F6' : '#111827',
            }}
          />
          <Legend
            wrapperStyle={{
              color: isDarkMode ? '#F3F4F6' : '#111827',
            }}
          />
          <Line
            strokeWidth={3}
            type='monotone'
            dataKey='savingsAccount'
            stroke={isDarkMode ? '#60A5FA' : '#2563EB'}
            activeDot={{ r: 8 }}
            name='Savings Account (Inflation-Adjusted)'
          />
          <Line
            strokeWidth={3}
            type='monotone'
            dataKey='nasdaqWithLosses'
            stroke={isDarkMode ? '#F87171' : '#DC2626'}
            name='NASDAQ Prediction'
          />
          <Line
            strokeWidth={3}
            type='monotone'
            dataKey='nasdaqHistorical'
            stroke={isDarkMode ? '#34D399' : '#059669'}
            strokeDasharray='5 5'
            name='NASDAQ Historical Data'
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
