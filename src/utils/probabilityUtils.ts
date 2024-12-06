export interface MarketCondition {
  probability: number
  severity: number
  duration: number
}

export interface MarketConditions {
  [key: string]: MarketCondition
}

export const generateMarketConditions = (
  marketStatus: number
): MarketConditions => {
  const normalizedStatus = marketStatus / 100

  return {
    dailyFluctuation: {
      probability: 0.95,
      severity: 0.95 + 0.1 * Math.random(),
      duration: 1,
    },
    smallDip: {
      probability: 0.7 * (1 - normalizedStatus),
      severity: 0.9 - 0.1 * (1 - normalizedStatus),
      duration: 1,
    },
    mediumDip: {
      probability: 0.5 * (1 - normalizedStatus),
      severity: 0.8 - 0.2 * (1 - normalizedStatus),
      duration: 1,
    },
    largeDip: {
      probability: 0.3 * (1 - normalizedStatus),
      severity: 0.6 - 0.3 * (1 - normalizedStatus),
      duration: 2,
    },
    smallRally: {
      probability: 0.7 * normalizedStatus,
      severity: 1.1 + 0.1 * normalizedStatus,
      duration: 1,
    },
    mediumRally: {
      probability: 0.5 * normalizedStatus,
      severity: 1.2 + 0.2 * normalizedStatus,
      duration: 1,
    },
    strongRally: {
      probability: 0.3 * normalizedStatus,
      severity: 1.4 + 0.3 * normalizedStatus,
      duration: 2,
    },
  }
}
