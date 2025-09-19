// Admin Configuration for ÁGUA TWEZAH
// This file controls which features use simulation vs real APIs

export const ADMIN_CONFIG = {
  // Global configuration
  global: {
    appName: 'ÁGUA TWEZAH Admin',
    version: '1.0.0',
    environment: import.meta.env.MODE || 'development',
    apiBaseUrl: import.meta.env.VITE_API_URL || 'https://loyalty-backend-production-8e32.up.railway.app/api',
    timeout: 10000, // 10 seconds
    retryAttempts: 3
  },

  // Simulation mode configuration
  simulation: {
    enabled: false, // Set to false to use real APIs
    mode: 'production' as const, // 'simulation' | 'hybrid' | 'production'
    
    // Simulation behavior
    behavior: {
      enableDelays: true,
      defaultDelay: 500,
      enableRandomErrors: true,
      errorRate: 0.05, // 5% error rate
      enableRealisticData: true
    },

    // Data persistence
    persistence: {
      enabled: false, // Data resets on page refresh
      type: 'memory' as const, // 'memory' | 'localStorage' | 'sessionStorage'
      key: 'aguatwezah_simulation_data'
    }
  },

  // Feature-specific configurations
  features: {
    // Dashboard
    dashboard: {
      enabled: true,
      useSimulation: false,
      realApiEndpoint: '/dashboard',
      simulationDelay: 300,
      refreshInterval: 30000 // 30 seconds
    },

    // User Management
    users: {
      enabled: true,
      useSimulation: false,
      realApiEndpoint: '/users',
      simulationDelay: 500,
      pagination: {
        defaultPageSize: 10,
        maxPageSize: 100
      }
    },

    // Store Management
    stores: {
      enabled: true,
      useSimulation: false,
      realApiEndpoint: '/stores',
      simulationDelay: 600,
      features: {
        geolocation: true,
        inventory: true,
        staff: true
      }
    },

    // Campaign Management
    campaigns: {
      enabled: true,
      useSimulation: false,
      realApiEndpoint: '/campaigns',
      simulationDelay: 800,
      features: {
        analytics: true,
        targeting: true,
        automation: true
      }
    },

    // Sales Management
    sales: {
      enabled: true,
      useSimulation: false,
      realApiEndpoint: '/sales',
      simulationDelay: 700,
      features: {
        reporting: true,
        analytics: true,
        forecasting: true
      }
    },

    // Commission System
    commissions: {
      enabled: true,
      useSimulation: false,
      realApiEndpoint: '/commissions',
      simulationDelay: 1000,
      features: {
        calculation: true,
        payout: true,
        reporting: true
      }
    },

    // Billing System
    billing: {
      enabled: true,
      useSimulation: false,
      realApiEndpoint: '/billing',
      simulationDelay: 1200,
      features: {
        invoicing: true,
        payment: true,
        reconciliation: true
      }
    },

    // Notification System
    notifications: {
      enabled: true,
      useSimulation: false,
      realApiEndpoint: '/notifications',
      simulationDelay: 400,
      features: {
        email: true,
        sms: true,
        push: true,
        inApp: true
      }
    },

    // Reporting System
    reports: {
      enabled: true,
      useSimulation: false,
      realApiEndpoint: '/reports',
      simulationDelay: 1500,
      features: {
        sales: true,
        customers: true,
        performance: true,
        financial: true
      }
    },

    // Points System
    points: {
      enabled: true,
      useSimulation: false,
      realApiEndpoint: '/points',
      simulationDelay: 600,
      features: {
        earning: true,
        redemption: true,
        expiration: true,
        analytics: true
      }
    },

    // Cashback System
    cashback: {
      enabled: true,
      useSimulation: false,
      realApiEndpoint: '/cashback',
      simulationDelay: 800,
      features: {
        calculation: true,
        payout: true,
        tracking: true
      }
    },

    // Purchase Management
    purchases: {
      enabled: true,
      useSimulation: false,
      realApiEndpoint: '/purchases',
      simulationDelay: 1000,
      features: {
        tracking: true,
        fulfillment: true,
        returns: true
      }
    },

    // Online Purchase System
    onlinePurchases: {
      enabled: true,
      useSimulation: false,
      realApiEndpoint: '/online-purchases',
      simulationDelay: 1200,
      features: {
        ecommerce: true,
        delivery: true,
        tracking: true
      }
    },

    // Wallet Integration
    wallets: {
      enabled: true,
      useSimulation: false,
      realApiEndpoint: '/wallets',
      simulationDelay: 1000,
      features: {
        providers: true,
        transactions: true,
        analytics: true,
        webhooks: true
      },
      // External wallet providers (for future integration)
      externalProviders: {
        pix: {
          name: 'PIX',
          status: 'planned' as const,
          supportedCurrencies: ['BRL', 'USD'],
          commissionRate: 2.5
        },
        mobileMoney: {
          name: 'Mobile Money',
          status: 'planned' as const,
          supportedCurrencies: ['AOA', 'USD'],
          commissionRate: 3.0
        },
        bankTransfer: {
          name: 'Bank Transfer',
          status: 'planned' as const,
          supportedCurrencies: ['AOA', 'USD', 'EUR'],
          commissionRate: 1.8
        },
        crypto: {
          name: 'Cryptocurrency',
          status: 'planned' as const,
          supportedCurrencies: ['BTC', 'ETH', 'USDT'],
          commissionRate: 4.5
        }
      }
    },

    // Influencer Management
    influencers: {
      enabled: true,
      useSimulation: false,
      realApiEndpoint: '/influencers',
      simulationDelay: 800,
      features: {
        levels: true,
        analytics: true,
        payouts: true
      }
    },

    // Geolocation Services
    geolocation: {
      enabled: true,
      useSimulation: false,
      realApiEndpoint: '/geolocation',
      simulationDelay: 600,
      features: {
        mapping: true,
        tracking: true,
        analytics: true
      },
      // External mapping services (for future integration)
      externalServices: {
        googleMaps: {
          name: 'Google Maps',
          status: 'planned' as const,
          apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
        },
        openStreetMap: {
          name: 'OpenStreetMap',
          status: 'planned' as const,
          apiUrl: 'https://nominatim.openstreetmap.org'
        }
      }
    },

    // Audit System
    audit: {
      enabled: true,
      useSimulation: false,
      realApiEndpoint: '/audit',
      simulationDelay: 300,
      features: {
        logs: true,
        stats: true,
        real_time: true
      }
    },

    // Analytics System
    analytics: {
      enabled: true,
      useSimulation: false,
      realApiEndpoint: '/analytics',
      simulationDelay: 800,
      features: {
        overview: true,
        trends: true,
        performance: true,
        geographic: true,
        real_time: true
      }
    },

    // Export System
    export: {
      enabled: true,
      useSimulation: false,
      realApiEndpoint: '/export',
      simulationDelay: 500,
      features: {
        csv: true,
        json: true,
        users: true,
        sales: true,
        points: true,
        commissions: true
      }
    },

    // Health Monitoring
    health: {
      enabled: true,
      useSimulation: false,
      realApiEndpoint: '/health',
      simulationDelay: 200,
      features: {
        system_status: true,
        database_health: true,
        performance_metrics: true,
        health_tests: true
      }
    },

    // Search System
    search: {
      enabled: true,
      useSimulation: false,
      realApiEndpoint: '/search',
      simulationDelay: 400,
      features: {
        global_search: true,
        user_search: true,
        sales_search: true,
        advanced_filters: true
      }
    },

    // Bulk Operations
    bulk: {
      enabled: true,
      useSimulation: false,
      realApiEndpoint: '/bulk',
      simulationDelay: 600,
      features: {
        user_operations: true,
        sales_operations: true,
        notifications: true,
        points_adjustments: true
      }
    }
  },

  // UI/UX Configuration
  ui: {
    theme: {
      primary: '#2563eb',
      secondary: '#64748b',
      accent: '#0ea5e9',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    },
    
    layout: {
      sidebar: {
        collapsed: false,
        width: 280,
        collapsedWidth: 80
      },
      header: {
        height: 64,
        showBreadcrumbs: true
      },
      content: {
        padding: 24,
        maxWidth: 1200
      }
    },

    responsive: {
      breakpoints: {
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
        '2xl': 1536
      }
    },

    animations: {
      enabled: true,
      duration: 200,
      easing: 'ease-in-out'
    }
  },

  // External service integrations (for future use)
  externalServices: {
    // Payment gateways
    paymentGateways: {
      stripe: {
        enabled: false,
        publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
      },
      paypal: {
        enabled: false,
        clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID
      }
    },

    // Analytics services
    analytics: {
      googleAnalytics: {
        enabled: false,
        trackingId: import.meta.env.VITE_GA_TRACKING_ID
      },
      mixpanel: {
        enabled: false,
        token: import.meta.env.VITE_MIXPANEL_TOKEN
      }
    },

    // Monitoring services
    monitoring: {
      sentry: {
        enabled: false,
        dsn: import.meta.env.VITE_SENTRY_DSN
      }
    }
  },

  // Development and testing settings
  development: {
    // Mock data settings
    mockData: {
      enabled: true,
      users: 50,
      stores: 10,
      campaigns: 5,
      sales: 100,
      transactions: 200
    },

    // Testing settings
    testing: {
      enabled: import.meta.env.MODE === 'test',
      mockApi: true,
      seedData: true
    },

    // Debug settings
    debug: {
      enabled: import.meta.env.MODE === 'development',
      logLevel: 'info' as const, // 'error' | 'warn' | 'info' | 'debug'
      logApiCalls: true,
      logSimulationCalls: true,
      showPerformanceMetrics: true
    }
  }
};

// Helper functions
export const isSimulationEnabled = (feature?: string): boolean => {
  if (!ADMIN_CONFIG.simulation.enabled) return false;
  if (!feature) return true;
  return ADMIN_CONFIG.features[feature as keyof typeof ADMIN_CONFIG.features]?.useSimulation || false;
};

export const getSimulationDelay = (feature?: string): number => {
  if (feature && ADMIN_CONFIG.features[feature as keyof typeof ADMIN_CONFIG.features]) {
    return ADMIN_CONFIG.features[feature as keyof typeof ADMIN_CONFIG.features].simulationDelay;
  }
  return ADMIN_CONFIG.simulation.behavior.defaultDelay;
};

export const shouldSimulateError = (): boolean => {
  return ADMIN_CONFIG.simulation.behavior.enableRandomErrors && 
         Math.random() < ADMIN_CONFIG.simulation.behavior.errorRate;
};

export const isFeatureEnabled = (feature: string): boolean => {
  return ADMIN_CONFIG.features[feature as keyof typeof ADMIN_CONFIG.features]?.enabled || false;
};

export const getRealApiEndpoint = (feature: string): string => {
  const config = ADMIN_CONFIG.features[feature as keyof typeof ADMIN_CONFIG.features];
  return config?.realApiEndpoint || `/api/${feature}`;
};

export const getApiBaseUrl = (): string => {
  return ADMIN_CONFIG.global.apiBaseUrl;
};

export const getFeatureConfig = (feature: string) => {
  return ADMIN_CONFIG.features[feature as keyof typeof ADMIN_CONFIG.features];
};

// Environment-specific configuration
export const getEnvironmentConfig = () => {
  const env = import.meta.env.MODE || 'development';
  
  switch (env) {
    case 'production':
      return {
        ...ADMIN_CONFIG,
        simulation: {
          ...ADMIN_CONFIG.simulation,
          enabled: false,
          mode: 'production'
        }
      };
    
    case 'staging':
      return {
        ...ADMIN_CONFIG,
        simulation: {
          ...ADMIN_CONFIG.simulation,
          enabled: true,
          mode: 'hybrid'
        }
      };
    
    case 'test':
      return {
        ...ADMIN_CONFIG,
        simulation: {
          ...ADMIN_CONFIG.simulation,
          enabled: true,
          mode: 'simulation'
        },
        development: {
          ...ADMIN_CONFIG.development,
          testing: {
            enabled: true,
            mockApi: true,
            seedData: true
          }
        }
      };
    
    default: // development
      return ADMIN_CONFIG;
  }
};

// Type definitions
export type SimulationMode = 'simulation' | 'hybrid' | 'production';
export type FeatureStatus = 'enabled' | 'disabled' | 'planned' | 'active' | 'inactive';
export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export interface FeatureConfig {
  enabled: boolean;
  useSimulation: boolean;
  realApiEndpoint: string;
  simulationDelay: number;
  features?: Record<string, boolean>;
  externalProviders?: Record<string, any>;
  externalServices?: Record<string, any>;
}

export interface SimulationConfig {
  enabled: boolean;
  mode: SimulationMode;
  behavior: {
    enableDelays: boolean;
    defaultDelay: number;
    enableRandomErrors: boolean;
    errorRate: number;
    enableRealisticData: boolean;
  };
  persistence: {
    enabled: boolean;
    type: 'memory' | 'localStorage' | 'sessionStorage';
    key: string;
  };
}

// Export the current configuration
export const currentConfig = getEnvironmentConfig(); 