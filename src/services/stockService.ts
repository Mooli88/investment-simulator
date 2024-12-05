import historicalData from './data.json';

interface MonthlyTimeSeriesData {
  chart: {
    result: Array<{
      meta: {
        currency: string;
        symbol: string;
        // ... other meta fields
      };
      timestamp: number[];
      indicators: {
        quote: Array<{
          close: number[];
        }>;
      };
    }>;
    error: null;
  };
}

export async function fetchNasdaqData(years: number) {
  try {
    const data = historicalData as MonthlyTimeSeriesData;
    const timestamps = data.chart.result[0].timestamp;
    const prices = data.chart.result[0].indicators.quote[0].close;

    // Reverse arrays to get chronological order (oldest to newest)
    const timeArray = [...timestamps].reverse();
    const priceArray = [...prices].reverse();

    // Calculate monthly returns from the historical data
    const monthlyReturns = priceArray.map((price, index) => {
      if (index === 0) {
        return {
          date: new Date(timeArray[index] * 1000).toISOString(),
          return: 0
        };
      }
      
      const currentPrice = price;
      const previousPrice = priceArray[index - 1];
      const monthlyReturn = (currentPrice - previousPrice) / previousPrice;

      return {
        date: new Date(timeArray[index] * 1000).toISOString(),
        return: monthlyReturn
      };
    });

    // Filter for requested number of years
    const cutoffDate = new Date();
    cutoffDate.setFullYear(cutoffDate.getFullYear() - years);
    
    return monthlyReturns.filter(item => 
      new Date(item.date) >= cutoffDate
    );

  } catch (error) {
    console.error('Error processing NASDAQ data:', error);
    throw error;
  }
} 