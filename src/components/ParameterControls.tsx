import React from 'react'

interface ParameterControlsProps {
  params: {
    initialInvestment: number
    investmentYears: number
    savingsRate: number
    inflationRate: number
    volatilityFactor: number
    monthlyTopUp: number
  }
  onParamChange: (key: string, value: string) => void
}

export const ParameterControls: React.FC<ParameterControlsProps> = ({
  params,
  onParamChange,
}) => {
  return (
    <div className='flex flex-wrap justify-center gap-4 mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded'>
      <div className='flex flex-col'>
        <label className='dark:text-gray-200'>Initial Investment (£)</label>
        <input
          type='number'
          value={params.initialInvestment}
          onChange={(e) => onParamChange('initialInvestment', e.target.value)}
          className='border p-2 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600'
        />
      </div>
      <div className='flex flex-col'>
        <label className='dark:text-gray-200'>Investment Years</label>
        <input
          type='number'
          value={params.investmentYears}
          onChange={(e) => onParamChange('investmentYears', e.target.value)}
          className='border p-2 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600'
        />
      </div>
      <div className='flex flex-col'>
        <label className='dark:text-gray-200'>Savings Rate (%)</label>
        <input
          type='number'
          value={params.savingsRate}
          onChange={(e) => onParamChange('savingsRate', e.target.value)}
          className='border p-2 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600'
        />
      </div>
      <div className='flex flex-col'>
        <label className='dark:text-gray-200'>Inflation Rate (%)</label>
        <input
          type='number'
          value={params.inflationRate}
          onChange={(e) => onParamChange('inflationRate', e.target.value)}
          className='border p-2 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600'
        />
      </div>
      <div className='flex flex-col'>
        <label className='dark:text-gray-200'>Volatility Factor</label>
        <input
          type='number'
          step='0.1'
          value={params.volatilityFactor}
          onChange={(e) => onParamChange('volatilityFactor', e.target.value)}
          className='border p-2 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600'
        />
      </div>
      <div className='flex flex-col'>
        <label className='dark:text-gray-200'>Monthly Top-up (£)</label>
        <input
          type='number'
          value={params.monthlyTopUp}
          onChange={(e) => onParamChange('monthlyTopUp', e.target.value)}
          className='border p-2 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600'
        />
      </div>
    </div>
  )
}
