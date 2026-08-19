/**
 * Decoupled Financial Mathematics Utilities for RealCost Engine
 */

/**
 * Calculates hours of life energy traded for a given purchase.
 * @param expense Transaction amount (e.g. ₹3,000)
 * @param hourlyRate Post-tax net hourly rate (e.g. ₹500/hr)
 * @returns Hours of labor traded (rounded to 1 decimal place)
 */
export function calculateHoursTraded(expense: number, hourlyRate: number): number {
  if (!hourlyRate || hourlyRate <= 0 || !expense || expense <= 0) return 0;
  return Number((expense / hourlyRate).toFixed(1));
}

/**
 * Calculates percentage of a standard work shift spent on an expense.
 * @param hoursTraded Total hours of labor
 * @param shiftLengthHours Length of shift in hours (default 8 hours)
 * @returns Percentage of work shift (0 - 100+)
 */
export function calculateShiftPercentage(hoursTraded: number, shiftLengthHours = 8): number {
  if (!hoursTraded || hoursTraded <= 0 || !shiftLengthHours || shiftLengthHours <= 0) return 0;
  return Math.min(Math.round((hoursTraded / shiftLengthHours) * 100), 100);
}

/**
 * Projects compound investment future value if expense money was invested instead.
 * @param expense Amount spent today
 * @param annualRate Annual return rate (default 10% or 0.10)
 * @param years Projection horizon in years (default 20 years)
 * @returns Future projected value
 */
export function calculateFutureValue(expense: number, annualRate = 0.1, years = 20): number {
  if (!expense || expense <= 0) return 0;
  const fv = expense * Math.pow(1 + annualRate, years);
  return Math.round(fv);
}

/**
 * Calculates lifetime wealth drain of a recurring monthly subscription.
 * @param monthlyCost Monthly recurring charge (e.g. ₹499/mo)
 * @param years Time horizon (default 20 years)
 * @param annualReturnRate Investment opportunity rate (default 8%)
 * @returns Total compounded lifetime wealth drain
 */
export function calculateSubscriptionLifetimeLoss(
  monthlyCost: number,
  years = 20,
  annualReturnRate = 0.08,
): number {
  if (!monthlyCost || monthlyCost <= 0) return 0;
  const months = years * 12;
  const monthlyRate = annualReturnRate / 12;
  // Future value of a monthly annuity series: PMT * (((1 + r)^n - 1) / r)
  const fvAnnuity = monthlyCost * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  return Math.round(fvAnnuity);
}
