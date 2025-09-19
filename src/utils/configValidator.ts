import { ADMIN_CONFIG } from '@/config/adminConfig';

export interface ConfigValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class ConfigValidator {
  static validate(): ConfigValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate API base URL
    if (!ADMIN_CONFIG.global.apiBaseUrl) {
      errors.push('API base URL is not configured');
    } else {
      try {
        new URL(ADMIN_CONFIG.global.apiBaseUrl);
      } catch {
        errors.push('API base URL is not a valid URL');
      }
    }

    // Validate timeout
    if (ADMIN_CONFIG.global.timeout < 1000) {
      warnings.push('API timeout is very low (< 1 second)');
    }

    if (ADMIN_CONFIG.global.timeout > 60000) {
      warnings.push('API timeout is very high (> 60 seconds)');
    }

    // Validate retry attempts
    if (ADMIN_CONFIG.global.retryAttempts < 1) {
      errors.push('Retry attempts must be at least 1');
    }

    if (ADMIN_CONFIG.global.retryAttempts > 10) {
      warnings.push('Retry attempts is very high (> 10)');
    }

    // Check if simulation mode is enabled in production
    if (ADMIN_CONFIG.global.environment === 'production' && ADMIN_CONFIG.simulation.enabled) {
      warnings.push('Simulation mode is enabled in production environment');
    }

    // Validate simulation configuration
    if (ADMIN_CONFIG.simulation.enabled) {
      if (ADMIN_CONFIG.simulation.behavior.errorRate > 0.5) {
        warnings.push('Simulation error rate is very high (> 50%)');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  static async testApiConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${ADMIN_CONFIG.global.apiBaseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(ADMIN_CONFIG.global.timeout)
      });

      return response.ok;
    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  }

  static getConfigSummary() {
    return {
      environment: ADMIN_CONFIG.global.environment,
      apiBaseUrl: ADMIN_CONFIG.global.apiBaseUrl,
      simulationEnabled: ADMIN_CONFIG.simulation.enabled,
      simulationMode: ADMIN_CONFIG.simulation.mode,
      timeout: ADMIN_CONFIG.global.timeout,
      retryAttempts: ADMIN_CONFIG.global.retryAttempts
    };
  }
}