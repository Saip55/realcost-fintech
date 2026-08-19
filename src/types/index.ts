export type CategoryType =
  | "food"
  | "subscriptions"
  | "shopping"
  | "transport"
  | "utilities"
  | "entertainment"
  | "health"
  | "housing"
  | "misc";

export interface CategoryInfo {
  id: CategoryType;
  name: string;
  iconName: string;
  color: string;
  bgLight: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: CategoryType;
  date: string; // YYYY-MM-DD
  isRecurring: boolean;
  recurringFrequency?: "monthly" | "yearly";
  notes?: string;
  isCancelled?: boolean; // For interactive subscription shock cancellation
}

export interface UserProfile {
  monthlyIncome: number;
  workingHoursPerMonth: number;
  hourlyWage: number;
  targetReturnRate: number; // e.g. 7 for 7%
  timeHorizonYears: number; // e.g. 20
  currencySymbol: string; // e.g. "₹", "$", "€", "£"
  currencyCode: string; // e.g. "INR", "USD", "EUR", "GBP"
}

export type SortOption =
  "date-desc" | "date-asc" | "amount-desc" | "hours-desc" | "future-value-desc";

export type ActiveTab = "dashboard" | "shock" | "simulator" | "insights";

export type GlobalFramingMode = "all" | "hours" | "future";
