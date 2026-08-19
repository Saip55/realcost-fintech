/**
 * Formatting helpers for currency, hours, numbers, and dates
 */

export function formatCurrency(amount: number, symbol: string = "₹"): string {
  const absAmount = Math.abs(amount);
  const formatted = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(absAmount);

  return `${amount < 0 ? "-" : ""}${symbol}${formatted}`;
}

export function formatCompactCurrency(amount: number, symbol: string = "₹"): string {
  const abs = Math.abs(amount);
  if (symbol === "₹") {
    if (abs >= 10000000) {
      return `${symbol}${(abs / 10000000).toFixed(2)} Cr`;
    }
    if (abs >= 100000) {
      return `${symbol}${(abs / 100000).toFixed(2)} L`;
    }
    if (abs >= 1000) {
      return `${symbol}${(abs / 1000).toFixed(1)} K`;
    }
  } else {
    if (abs >= 1000000) {
      return `${symbol}${(abs / 1000000).toFixed(2)}M`;
    }
    if (abs >= 1000) {
      return `${symbol}${(abs / 1000).toFixed(1)}K`;
    }
  }
  return formatCurrency(amount, symbol);
}

export function formatHours(hours: number): string {
  if (hours <= 0) return "0 hrs";

  if (hours < 1) {
    const mins = Math.round(hours * 60);
    return `${mins} mins`;
  }

  const wholeHours = Math.floor(hours);
  const remainingMins = Math.round((hours - wholeHours) * 60);

  if (remainingMins === 0) {
    return `${wholeHours} ${wholeHours === 1 ? "hr" : "hrs"}`;
  }

  return `${wholeHours}h ${remainingMins}m`;
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}
