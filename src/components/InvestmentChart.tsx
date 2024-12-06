import React from 'react'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
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
    <div className='max-w-[1536px] mx-auto w-full h-96'>
      <ResponsiveContainer width='100%' height='100%'>
        <ComposedChart
          data={data.yearlyData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray='0'
            stroke={isDarkMode ? '#374151' : '#e5e7eb'}
            horizontal
            vertical={false}
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
              fill: isDarkMode ? '#34D399' : '#059669',
            }}
            stroke={isDarkMode ? '#34D399' : '#059669'}
            tickFormatter={(value) =>
              (currentYear - investmentYears + value).toString()
            }
            xAxisId='top'
          />
          <YAxis
            label={{
              value: 'Total Balance (£)',
              angle: -90,
              position: 'left',
              offset: 15,
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
          <Area
            strokeWidth={3}
            type='monotone'
            dataKey='nasdaqHistorical'
            fill={isDarkMode ? '#34D39940' : '#05966940'}
            stroke={isDarkMode ? '#34D399' : '#059669'}
            strokeDasharray='5 5'
            name='NASDAQ Historical Data'
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
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
