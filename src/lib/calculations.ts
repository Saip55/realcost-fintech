export interface TransactionItem {
  id: string;
  description: string;
  amount: number;
  category: string;
  isRecurring: boolean;
  date: string; // ISO format YYYY-MM-DD
  notes?: string;
}

export interface ProfileSettings {
  hourlyRate: number;
  expectedReturn: number;
  projectionYears: number;
  currencySymbol: string;
  currencyCode: string;
  darkMode?: boolean;
}

export const DEFAULT_SETTINGS: ProfileSettings = {
  hourlyRate: 500,
  expectedReturn: 7,
  projectionYears: 20,
  currencySymbol: "₹",
  currencyCode: "INR",
  darkMode: false,
};

export const SUPPORTED_CURRENCIES = [
  { symbol: "₹", code: "INR", name: "Indian Rupee (₹)" },
  { symbol: "$", code: "USD", name: "US Dollar ($)" },
  { symbol: "€", code: "EUR", name: "Euro (€)" },
  { symbol: "£", code: "GBP", name: "British Pound (£)" },
  { symbol: "A$", code: "AUD", name: "Australian Dollar (A$)" },
  { symbol: "C$", code: "CAD", name: "Canadian Dollar (C$)" },
];

export const CALCULATIONS = {
  hoursOfWork: (amount: number, hourlyRate: number): number => {
    const rate = Number(hourlyRate) > 0 ? Number(hourlyRate) : 500;
    return Math.round((Number(amount) / rate) * 100) / 100;
  },

  // Single lump sum compound growth
  futureValue: (amount: number, annualReturnRate: number, years: number): number => {
    const rate = Number(annualReturnRate) || 7;
    const y = Number(years) || 20;
    return Math.round(Number(amount) * Math.pow(1 + rate / 100, y) * 100) / 100;
  },

  // Monthly annuity compounding SIP formula: PMT * [((1 + r/12)^(12n) - 1) / (r/12)]
  lifetimeCost: (monthlyAmount: number, months: number, annualReturnRate: number): number => {
    const r = (Number(annualReturnRate) || 7) / 100 / 12;
    const m = Number(months) || 240;
    const amt = Number(monthlyAmount) || 0;

    if (amt <= 0) return 0;
    if (r === 0) return Math.round(amt * m * 100) / 100;

    const compoundFactor = Math.pow(1 + r, m);
    const futureVal = amt * ((compoundFactor - 1) / r);
    return Math.round(futureVal * 100) / 100;
  },
};

// Direct export aliases for legacy components
export const calculateHoursWorked = CALCULATIONS.hoursOfWork;
export const calculateFutureValue = CALCULATIONS.futureValue;

export function calculateSubscriptionLifetimeCost(
  monthlyAmount: number,
  annualReturnRate: number,
  years: number,
) {
  const months = (Number(years) || 20) * 12;
  const futureValueTotal = CALCULATIONS.lifetimeCost(monthlyAmount, months, annualReturnRate);
  const spentTotal = Math.round((Number(monthlyAmount) || 0) * months);
  const opportunityLoss = Math.max(0, futureValueTotal - spentTotal);
  return {
    spentTotal,
    futureValueTotal,
    opportunityLoss,
    hoursWorked: 0,
  };
}

export const formatHours = (hours: number): string => {
  if (isNaN(hours) || hours <= 0) return "0 min";
  if (hours < 1) {
    const mins = Math.max(1, Math.round(hours * 60));
    return `${mins} min`;
  }
  return `${hours.toFixed(1)} hrs`;
};

export const formatCurrency = (
  amount: number,
  symbol: string = "₹",
  code: string = "INR",
): string => {
  const rounded = Math.round(amount || 0);
  const locale = code === "INR" ? "en-IN" : "en-US";
  return `${symbol}${rounded.toLocaleString(locale)}`;
};

export const formatFutureValue = (
  amount: number,
  years: number = 20,
  annualReturnRate: number = 7,
  symbol: string = "₹",
  code: string = "INR",
): string => {
  const fv = CALCULATIONS.futureValue(amount, annualReturnRate, years);
  if (code === "INR") {
    if (fv >= 10000000) {
      return `${symbol}${(fv / 10000000).toFixed(2)} Cr`;
    }
    if (fv >= 100000) {
      return `${symbol}${(fv / 100000).toFixed(1)}L`;
    }
  } else {
    if (fv >= 1000000) {
      return `${symbol}${(fv / 1000000).toFixed(2)}M`;
    }
    if (fv >= 1000) {
      return `${symbol}${(fv / 1000).toFixed(1)}K`;
    }
  }
  return formatCurrency(fv, symbol, code);
};

export const formatDateDisplay = (dateStr?: string): string => {
  if (!dateStr) return "Today";
  const dateObj = new Date(dateStr);
  if (isNaN(dateObj.getTime())) return dateStr;

  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const dateStart = new Date(
    dateObj.getFullYear(),
    dateObj.getMonth(),
    dateObj.getDate(),
  ).getTime();
  const diffDays = Math.round((todayStart - dateStart) / (1000 * 3600 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays > 1 && diffDays < 7) return `${diffDays} days ago`;

  return dateObj.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: dateObj.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
  });
};

export const autoCategorize = (description: string): string => {
  const lower = description.toLowerCase().trim();

  const categoriesMap: Record<string, string[]> = {
    Food: [
      "coffee",
      "cafe",
      "lunch",
      "dinner",
      "breakfast",
      "food",
      "restaurant",
      "pizza",
      "burger",
      "zomato",
      "swiggy",
      "starbucks",
      "tea",
      "chai",
      "icecream",
      "ice cream",
      "diner",
      "baking",
      "bakery",
      "subway",
      "dominos",
      "mcdonalds",
      "kfc",
      "boba",
      "snack",
      "groceries",
      "supermarket",
    ],
    Subscriptions: [
      "netflix",
      "spotify",
      "streaming",
      "subs",
      "prime",
      "youtube",
      "hulu",
      "disney",
      "apple music",
      "icloud",
      "chatgpt",
      "midjourney",
      "patreon",
      "nytimes",
      "wsj",
      "medium",
      "github",
      "aws",
      "cursor",
      "claude",
    ],
    Health: [
      "gym",
      "health",
      "fitness",
      "doctor",
      "medicine",
      "pharmacy",
      "dentist",
      "hospital",
      "clinic",
      "workout",
      "protein",
      "supplement",
      "cult.fit",
    ],
    Shopping: [
      "shopping",
      "amazon",
      "flipkart",
      "clothes",
      "shoes",
      "apparel",
      "zara",
      "h&m",
      "myntra",
      "electronics",
      "gadget",
      "apple",
      "nike",
      "adidas",
      "book",
      "kindle",
      "ikea",
    ],
    Transport: [
      "gas",
      "fuel",
      "petrol",
      "diesel",
      "transport",
      "uber",
      "ola",
      "metro",
      "flight",
      "airline",
      "train",
      "bus",
      "cab",
      "parking",
      "toll",
      "rapido",
    ],
    Entertainment: [
      "movie",
      "cinema",
      "game",
      "steam",
      "playstation",
      "xbox",
      "concert",
      "event",
      "ticket",
      "bookmyshow",
      "bowling",
      "club",
      "bar",
      "pub",
    ],
  };

  for (const [category, keywords] of Object.entries(categoriesMap)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return category;
    }
  }

  return "Other";
};

export const CATEGORIES = [
  "Food",
  "Subscriptions",
  "Transport",
  "Shopping",
  "Health",
  "Entertainment",
  "Other",
] as const;

const getISOStringDate = (daysAgo = 0): string => {
  const d = new Date(Date.now() - daysAgo * 86400000);
  return d.toISOString().split("T")[0] || "";
};

export const SEED_DATA: TransactionItem[] = [
  {
    id: "1",
    description: "Coffee shop",
    amount: 150,
    category: "Food",
    isRecurring: false,
    date: getISOStringDate(0),
  },
  {
    id: "2",
    description: "Lunch at restaurant",
    amount: 350,
    category: "Food",
    isRecurring: false,
    date: getISOStringDate(0),
  },
  {
    id: "3",
    description: "Netflix subscription",
    amount: 199,
    category: "Subscriptions",
    isRecurring: true,
    date: getISOStringDate(1),
  },
  {
    id: "4",
    description: "Spotify premium",
    amount: 150,
    category: "Subscriptions",
    isRecurring: true,
    date: getISOStringDate(3),
  },
  {
    id: "5",
    description: "Uber ride",
    amount: 200,
    category: "Transport",
    isRecurring: false,
    date: getISOStringDate(3),
  },
  {
    id: "6",
    description: "Amazon shopping",
    amount: 800,
    category: "Shopping",
    isRecurring: false,
    date: getISOStringDate(4),
  },
  {
    id: "7",
    description: "Monthly gym membership",
    amount: 800,
    category: "Health",
    isRecurring: true,
    date: getISOStringDate(5),
  },
  {
    id: "8",
    description: "Food delivery",
    amount: 400,
    category: "Food",
    isRecurring: false,
    date: getISOStringDate(7),
  },
  {
    id: "9",
    description: "Movie tickets",
    amount: 450,
    category: "Entertainment",
    isRecurring: false,
    date: getISOStringDate(7),
  },
  {
    id: "10",
    description: "Gas for car",
    amount: 1200,
    category: "Transport",
    isRecurring: false,
    date: getISOStringDate(10),
  },
  {
    id: "11",
    description: "Ice cream treat",
    amount: 150,
    category: "Food",
    isRecurring: false,
    date: getISOStringDate(14),
  },
  {
    id: "12",
    description: "Book purchase",
    amount: 600,
    category: "Shopping",
    isRecurring: false,
    date: getISOStringDate(15),
  },
];

export const exportToCSV = (transactions: TransactionItem[], settings: ProfileSettings): void => {
  const headers = [
    "ID",
    "Description",
    "Amount",
    "Category",
    "Is Recurring",
    "Date",
    "Hours Worked",
    "Opportunity Cost",
  ];
  const rows = transactions.map((t) => {
    const hours = CALCULATIONS.hoursOfWork(t.amount, settings.hourlyRate);
    const fv = CALCULATIONS.futureValue(
      t.amount,
      settings.expectedReturn,
      settings.projectionYears,
    );
    return [
      `"${t.id}"`,
      `"${t.description.replace(/"/g, '""')}"`,
      t.amount,
      `"${t.category}"`,
      t.isRecurring ? "Yes" : "No",
      `"${t.date}"`,
      hours,
      fv,
    ].join(",");
  });

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `realcost_export_${new Date().toISOString().split("T")[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
