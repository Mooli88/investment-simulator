import historicalData from './data.json';

interface YearlyDataPoint {
  year: number
  value: number
  cumulativeInvestment: number
  monthlyInvestment: number
}

export function getHistoricalReturns(
  years: number,
  monthlyTopUp: number
): YearlyDataPoint[] {
  const data = historicalData.chart.result[0]
  const prices = data.indicators.quote[0].close
  const timestamps = data.timestamp

  let yearlyData: YearlyDataPoint[] = []
  let currentIndex = prices.length - 1
  const latestTimestamp = timestamps[currentIndex]
  const yearInSeconds = 365 * 24 * 60 * 60

  for (let year = 0; year <= years; year++) {
    const targetTimestamp = latestTimestamp - year * yearInSeconds
    while (currentIndex > 0 && timestamps[currentIndex] > targetTimestamp) {
      currentIndex--
    }
    yearlyData.unshift({
      year: years - year,
      value: prices[currentIndex],
      cumulativeInvestment: monthlyTopUp * 12 * year,
      monthlyInvestment: monthlyTopUp,
    })
  }

  return yearlyData
} 