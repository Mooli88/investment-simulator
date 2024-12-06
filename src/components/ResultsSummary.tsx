interface ResultsSummaryProps {
  investmentYears: number
  totalInvested: number
  finalSavingsValue: number
  finalNasdaqValue: number
  finalNasdaqHistoricalValue: number
}

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({
  investmentYears,
  totalInvested,
  finalSavingsValue,
  finalNasdaqValue,
  finalNasdaqHistoricalValue,
}) => (
  <div className='mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded'>
    <h3 className='text-lg font-bold mb-4 dark:text-gray-200'>
      Final Values After {investmentYears} Years
    </h3>
    <div className='grid grid-cols-4 gap-4'>
      <div>
        <h4 className='font-semibold text-gray-600 dark:text-gray-400'>
          Total Invested
        </h4>
        <p className='dark:text-gray-200'>£{totalInvested.toLocaleString()}</p>
      </div>
      <div>
        <h4 className='font-semibold text-blue-600 dark:text-blue-400'>
          Savings Account
        </h4>
        <p className='dark:text-gray-200'>
          £{finalSavingsValue.toLocaleString()}
        </p>
        <p className='text-sm font-bold text-gray-600 dark:text-gray-400'>
          Profit: £{(finalSavingsValue - totalInvested).toLocaleString()}
        </p>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          Return:{' '}
          {(
            ((finalSavingsValue - totalInvested) / totalInvested) *
            100
          ).toFixed(1)}
          %
        </p>
      </div>
      <div>
        <h4 className='font-semibold text-red-600 dark:text-red-400'>
          NASDAQ Predicted
        </h4>
        <p className='dark:text-gray-200'>
          £{finalNasdaqValue.toLocaleString()}
        </p>
        <p className='text-sm font-bold text-gray-600 dark:text-gray-400'>
          Profit: £{(finalNasdaqValue - totalInvested).toLocaleString()}
        </p>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          Return:{' '}
          {(((finalNasdaqValue - totalInvested) / totalInvested) * 100).toFixed(
            1
          )}
          %
        </p>
      </div>
      <div>
        <h4 className='font-semibold text-green-600 dark:text-green-400'>
          NASDAQ Historical
        </h4>
        <p className='dark:text-gray-200'>
          £{finalNasdaqHistoricalValue.toLocaleString()}
        </p>
        <p className='text-sm font-bold text-gray-600 dark:text-gray-400'>
          Profit: £
          {(finalNasdaqHistoricalValue - totalInvested).toLocaleString()}
        </p>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          Return:{' '}
          {(
            ((finalNasdaqHistoricalValue - totalInvested) / totalInvested) *
            100
          ).toFixed(1)}
          %
        </p>
      </div>
    </div>
  </div>
)
