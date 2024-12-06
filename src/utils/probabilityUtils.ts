export const generateLossProbability = (volatility: number) => {
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
