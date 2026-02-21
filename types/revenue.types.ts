// Revenue types
export interface RevenueSummary {
  totalRevenue: number;
  totalPaidFees: number;
  currentMonth: string; // Format: YYYY-MM
  monthlyRevenue: number;
  monthlyPaidFees: number;
  pendingRevenue: number;
  pendingFeeCount: number;
}

export interface MonthlyRevenueData {
  _id: string; // Format: YYYY-MM
  revenue: number;
  count: number;
}

export interface TotalRevenueData {
  totalRevenue: number;
  totalPaidFees: number;
}

export interface CurrentMonthRevenueData {
  month: string; // Format: YYYY-MM
  monthlyRevenue: number;
  monthlyPaidFees: number;
}
