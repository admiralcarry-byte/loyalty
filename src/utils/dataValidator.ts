// Data validation utilities for ensuring data integrity between frontend and backend

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class DataValidator {
  // Validate API response structure
  static validateApiResponse(response: any, expectedStructure?: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!response) {
      errors.push('Response is null or undefined');
      return { isValid: false, errors, warnings };
    }

    if (typeof response !== 'object') {
      errors.push('Response is not an object');
      return { isValid: false, errors, warnings };
    }

    // Check for success field
    if (typeof response.success !== 'boolean') {
      warnings.push('Response missing or invalid success field');
    }

    // Check for data field
    if (!response.data && response.success) {
      warnings.push('Successful response missing data field');
    }

    // Validate expected structure if provided
    if (expectedStructure && response.data) {
      const structureValidation = this.validateDataStructure(response.data, expectedStructure);
      errors.push(...structureValidation.errors);
      warnings.push(...structureValidation.warnings);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // Validate data structure against expected schema
  static validateDataStructure(data: any, expectedStructure: any, path: string = ''): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!data && expectedStructure) {
      errors.push(`Missing required data at path: ${path}`);
      return { isValid: false, errors, warnings };
    }

    if (typeof expectedStructure === 'object' && expectedStructure !== null) {
      if (Array.isArray(expectedStructure)) {
        // Array validation
        if (!Array.isArray(data)) {
          errors.push(`Expected array at path: ${path}, got ${typeof data}`);
        } else {
          // Validate array items
          data.forEach((item, index) => {
            if (expectedStructure.length > 0) {
              const itemValidation = this.validateDataStructure(item, expectedStructure[0], `${path}[${index}]`);
              errors.push(...itemValidation.errors);
              warnings.push(...itemValidation.warnings);
            }
          });
        }
      } else {
        // Object validation
        if (typeof data !== 'object' || data === null) {
          errors.push(`Expected object at path: ${path}, got ${typeof data}`);
        } else {
          // Check required fields
          Object.keys(expectedStructure).forEach(key => {
            const fieldPath = path ? `${path}.${key}` : key;
            if (!(key in data)) {
              errors.push(`Missing required field: ${fieldPath}`);
            } else {
              const fieldValidation = this.validateDataStructure(data[key], expectedStructure[key], fieldPath);
              errors.push(...fieldValidation.errors);
              warnings.push(...fieldValidation.warnings);
            }
          });
        }
      }
    } else {
      // Primitive type validation
      const expectedType = typeof expectedStructure;
      const actualType = typeof data;
      
      if (expectedType !== actualType) {
        warnings.push(`Type mismatch at path: ${path}, expected ${expectedType}, got ${actualType}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // Validate dashboard data
  static validateDashboardData(data: any): ValidationResult {
    const expectedStructure = {
      userStats: {
        total: 'number',
        active: 'number',
        loyaltyDistribution: {
          lead: 'number',
          silver: 'number',
          gold: 'number',
          platinum: 'number'
        }
      },
      salesStats: {
        total: 'number',
        revenue: 'number',
        growth: 'number'
      },
      storeStats: {
        total: 'number',
        active: 'number'
      },
      commissionStats: {
        total: 'number',
        pending: 'number',
        topInfluencers: [{
          name: 'string',
          network: 'string',
          commission: 'number',
          tier: 'string'
        }]
      },
      campaignStats: {
        total: 'number',
        active: 'number'
      },
      recentActivity: [{
        type: 'string',
        id: 'string',
        first_name: 'string',
        last_name: 'string'
      }]
    };

    return this.validateDataStructure(data, expectedStructure);
  }

  // Validate user data
  static validateUserData(data: any): ValidationResult {
    const expectedStructure = {
      id: 'string',
      username: 'string',
      email: 'string',
      first_name: 'string',
      last_name: 'string',
      role: 'string',
      status: 'string',
      loyalty_tier: 'string'
    };

    return this.validateDataStructure(data, expectedStructure);
  }

  // Validate sales data
  static validateSalesData(data: any): ValidationResult {
    const expectedStructure = {
      id: 'string',
      sale_number: 'string',
      user_id: 'string',
      store_id: 'string',
      product_id: 'string',
      amount: 'number',
      quantity: 'number',
      status: 'string',
      created_at: 'string'
    };

    return this.validateDataStructure(data, expectedStructure);
  }

  // Sanitize and normalize data
  static sanitizeData(data: any): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeData(item));
    }

    const sanitized: any = {};
    Object.keys(data).forEach(key => {
      const value = data[key];
      
      if (value === null || value === undefined) {
        sanitized[key] = null;
      } else if (typeof value === 'string') {
        // Trim strings and handle empty strings
        sanitized[key] = value.trim() || null;
      } else if (typeof value === 'number') {
        // Handle NaN and Infinity
        sanitized[key] = isNaN(value) || !isFinite(value) ? 0 : value;
      } else if (typeof value === 'object') {
        sanitized[key] = this.sanitizeData(value);
      } else {
        sanitized[key] = value;
      }
    });

    return sanitized;
  }

  // Get data summary for debugging
  static getDataSummary(data: any, maxDepth: number = 3, currentDepth: number = 0): any {
    if (currentDepth >= maxDepth) {
      return '[Max depth reached]';
    }

    if (data === null || data === undefined) {
      return data;
    }

    if (typeof data === 'string') {
      return `"${data.length > 50 ? data.substring(0, 50) + '...' : data}"`;
    }

    if (typeof data === 'number' || typeof data === 'boolean') {
      return data;
    }

    if (Array.isArray(data)) {
      return {
        type: 'array',
        length: data.length,
        sample: data.length > 0 ? this.getDataSummary(data[0], maxDepth, currentDepth + 1) : null
      };
    }

    if (typeof data === 'object') {
      const summary: any = { type: 'object' };
      const keys = Object.keys(data);
      summary.keys = keys;
      summary.keyCount = keys.length;
      
      // Include sample of first few keys
      const sampleKeys = keys.slice(0, 3);
      sampleKeys.forEach(key => {
        summary[key] = this.getDataSummary(data[key], maxDepth, currentDepth + 1);
      });

      return summary;
    }

    return typeof data;
  }
}