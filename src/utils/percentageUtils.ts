/**
 * Utility functions for handling dynamic percentage displays
 */

export interface PercentageData {
  [key: string]: string | number | undefined;
}

/**
 * Format percentage for display with fallback
 * @param percentage - The percentage value (string or number)
 * @param fallback - Fallback value if percentage is not available
 * @returns Formatted percentage string
 */
export const formatPercentage = (percentage: string | number | undefined, fallback: string = '0.0'): string => {
  if (percentage === undefined || percentage === null || percentage === '') {
    return fallback;
  }
  
  const numValue = typeof percentage === 'string' ? parseFloat(percentage) : percentage;
  
  if (isNaN(numValue)) {
    return fallback;
  }
  
  return numValue.toFixed(1);
};

/**
 * Get percentage display text with trend indicator
 * @param percentage - The percentage value
 * @param fallback - Fallback value if percentage is not available
 * @returns Formatted percentage text with trend
 */
export const getPercentageDisplay = (percentage: string | number | undefined, fallback: string = '0.0'): string => {
  const formattedPercentage = formatPercentage(percentage, fallback);
  const numValue = parseFloat(formattedPercentage);
  
  if (numValue > 0) {
    return `+${formattedPercentage}%`;
  } else if (numValue < 0) {
    return `${formattedPercentage}%`;
  } else {
    return `${formattedPercentage}%`;
  }
};

/**
 * Get percentage display with "from last month" suffix
 * @param percentage - The percentage value
 * @param fallback - Fallback value if percentage is not available
 * @returns Complete percentage display text
 */
export const getPercentageWithSuffix = (percentage: string | number | undefined, fallback: string = '0.0'): string => {
  return `${getPercentageDisplay(percentage, fallback)} from last month`;
};

/**
 * Common percentage field mappings for different services
 */
export const PERCENTAGE_FIELD_MAPPINGS = {
  // Dashboard/General
  userGrowth: 'userGrowthPercentage',
  salesGrowth: 'salesGrowth',
  revenueGrowth: 'revenueGrowth',
  
  // Influencer Levels
  influencerGrowth: 'influencer_growth_percentage',
  networkGrowth: 'network_growth_percentage',
  commissionGrowth: 'commission_growth_percentage',
  
  // AI Insights
  recommendationsGrowth: 'recommendations_growth_percentage',
  engagementGrowth: 'engagement_growth_percentage',
  conversionGrowth: 'conversion_growth_percentage',
  
  // Purchase Entry
  entriesGrowth: 'entries_growth_percentage',
  litersGrowth: 'liters_growth_percentage',
  valueGrowth: 'value_growth_percentage',
  
  // Campaigns
  campaignGrowth: 'campaign_growth_percentage',
  engagementGrowth: 'engagement_growth_percentage',
  conversionGrowth: 'conversion_growth_percentage',
  
  // Online Purchases
  ordersGrowth: 'orders_growth_percentage',
  revenueGrowth: 'revenue_growth_percentage',
  customersGrowth: 'customers_growth_percentage',
  avgOrderGrowth: 'avg_order_growth_percentage',
  
  // Commission
  commissionGrowth: 'commission_growth_percentage',
  payoutGrowth: 'payout_growth_percentage',
  
  // Wallet Integration
  transactionsGrowth: 'transactions_growth_percentage',
  balanceGrowth: 'balance_growth_percentage',
  feesGrowth: 'fees_growth_percentage',
  
  // Bank Details
  accountsGrowth: 'accounts_growth_percentage',
  transactionsGrowth: 'transactions_growth_percentage',
  
  // Settings
  systemGrowth: 'system_growth_percentage',
  performanceGrowth: 'performance_growth_percentage',
  
  // Profile
  activityGrowth: 'activity_growth_percentage',
  engagementGrowth: 'engagement_growth_percentage',
  performanceGrowth: 'performance_growth_percentage'
};

/**
 * Get percentage value from data object using field mapping
 * @param data - The data object containing percentage values
 * @param fieldKey - The key to look up in PERCENTAGE_FIELD_MAPPINGS
 * @returns The percentage value or undefined
 */
export const getPercentageValue = (data: PercentageData | undefined, fieldKey: keyof typeof PERCENTAGE_FIELD_MAPPINGS): string | number | undefined => {
  if (!data) return undefined;
  
  const fieldName = PERCENTAGE_FIELD_MAPPINGS[fieldKey];
  return data[fieldName];
};

/**
 * Create a percentage display component props
 * @param data - The data object containing percentage values
 * @param fieldKey - The key to look up in PERCENTAGE_FIELD_MAPPINGS
 * @param fallback - Fallback value if percentage is not available
 * @returns Object with percentage display text
 */
export const createPercentageDisplay = (
  data: PercentageData | undefined, 
  fieldKey: keyof typeof PERCENTAGE_FIELD_MAPPINGS, 
  fallback: string = '0.0'
) => {
  const percentage = getPercentageValue(data, fieldKey);
  return {
    percentageText: getPercentageWithSuffix(percentage, fallback),
    percentageValue: formatPercentage(percentage, fallback),
    hasData: percentage !== undefined && percentage !== null && percentage !== ''
  };
};