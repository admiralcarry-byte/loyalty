// Wallet Integration Configuration
// Set this to 'simulation' for development/testing or 'api' for production with real wallet providers

export const WALLET_CONFIG = {
  // Mode: 'simulation' | 'api'
  mode: 'simulation' as const,
  
  // API Configuration (used when mode is 'api')
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'https://loyalty-backend-production-8e32.up.railway.app/api',
    timeout: 10000, // 10 seconds
    retryAttempts: 3,
  },
  
  // Simulation Configuration (used when mode is 'simulation')
  simulation: {
    enableRandomErrors: true, // Simulate network errors (5% chance)
    enableDelays: true, // Simulate API response delays
    defaultDelay: 500, // Default delay in milliseconds
    errorRate: 0.05, // 5% error rate
  },
  
  // Feature flags
  features: {
    enableRealTimeUpdates: false, // WebSocket updates (future feature)
    enableWebhooks: false, // Webhook processing (future feature)
    enableAnalytics: true, // Analytics and reporting
    enableAuditLogs: true, // Audit trail
  },
  
  // Supported wallet providers (for future integration)
  supportedProviders: {
    pix: {
      name: 'PIX',
      type: 'digital_wallet',
      supportedCurrencies: ['BRL', 'USD'],
      commissionRate: 2.5,
      status: 'planned' // planned | active | inactive
    },
    mobileMoney: {
      name: 'Mobile Money',
      type: 'mobile_money',
      supportedCurrencies: ['AOA', 'USD'],
      commissionRate: 3.0,
      status: 'planned'
    },
    bankTransfer: {
      name: 'Bank Transfer',
      type: 'bank_wallet',
      supportedCurrencies: ['AOA', 'USD', 'EUR'],
      commissionRate: 1.8,
      status: 'planned'
    },
    crypto: {
      name: 'Cryptocurrency',
      type: 'crypto_wallet',
      supportedCurrencies: ['BTC', 'ETH', 'USDT'],
      commissionRate: 4.5,
      status: 'planned'
    }
  }
};

// Helper function to get the current wallet service
export const getWalletService = () => {
  if (WALLET_CONFIG.mode === 'simulation') {
    return import('@/services/walletSimulation').then(module => module.walletSimulationService);
  } else {
    return import('@/services/walletIntegration').then(module => module.walletIntegrationService);
  }
};

// Helper function to check if we're in simulation mode
export const isSimulationMode = () => WALLET_CONFIG.mode === 'simulation';

// Helper function to check if we're in API mode
export const isApiMode = () => WALLET_CONFIG.mode === 'api';

// Environment-specific configuration
export const getEnvironmentConfig = () => {
  const isDevelopment = import.meta.env.MODE === 'development';
  const isProduction = import.meta.env.MODE === 'production';
  
  return {
    isDevelopment,
    isProduction,
    shouldUseSimulation: isDevelopment || WALLET_CONFIG.mode === 'simulation',
    shouldUseRealApi: isProduction && WALLET_CONFIG.mode === 'api'
  };
}; 