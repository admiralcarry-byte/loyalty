import { translationService } from '@/services/translationService';

/**
 * Helper function to get translated text with fallback
 * @param key - Translation key
 * @param fallback - Fallback text if translation not found
 * @returns Translated text or fallback
 */
export const t = (key: string, fallback?: string): string => {
  const translated = translationService.translate(key);
  return translated !== key ? translated : (fallback || key);
};

/**
 * Common translation keys that are used across multiple pages
 */
export const commonTranslations = {
  // General actions
  save: 'save',
  cancel: 'cancel',
  edit: 'edit',
  delete: 'delete',
  add: 'add',
  create: 'create',
  update: 'update',
  view: 'view',
  details: 'details',
  search: 'search',
  filter: 'filter',
  export: 'export',
  import: 'import',
  refresh: 'refresh',
  loading: 'loading',
  
  // Status
  status: 'status',
  active: 'active',
  inactive: 'inactive',
  enabled: 'enabled',
  disabled: 'disabled',
  
  // Messages
  error: 'error',
  success: 'success',
  warning: 'warning',
  info: 'info',
  noDataFound: 'no.data.found',
  operationSuccessful: 'operation.successful',
  operationFailed: 'operation.failed',
  pleaseTryAgain: 'please.try.again',
  
  // Common fields
  name: 'name',
  email: 'email',
  phone: 'phone',
  address: 'address',
  date: 'date',
  amount: 'amount',
  description: 'description',
  type: 'type',
  category: 'category',
  
  // Time references
  fromLastMonth: 'from.last.month',
  thisMonth: 'this.month',
  lastMonth: 'last.month',
  today: 'today',
  yesterday: 'yesterday',
  thisWeek: 'this.week',
  thisYear: 'this.year'
};

/**
 * Get a common translation
 * @param key - Key from commonTranslations object
 * @param fallback - Fallback text
 * @returns Translated text
 */
export const tc = (key: keyof typeof commonTranslations, fallback?: string): string => {
  return t(commonTranslations[key], fallback);
};