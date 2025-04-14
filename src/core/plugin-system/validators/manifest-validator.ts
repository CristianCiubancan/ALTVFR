/**
 * Plugin manifest validator
 * Validates plugin manifests against the required schema
 */
import { PluginManifest } from '../interfaces';
import { PLUGIN } from '../../common/constants';
import { createLogger } from '../../common/utils/logger';

const logger = createLogger('ManifestValidator');

/**
 * Validation error types
 */
export enum ValidationErrorType {
  MISSING_FIELD = 'missing_field',
  INVALID_TYPE = 'invalid_type',
  INVALID_VALUE = 'invalid_value',
  INVALID_DEPENDENCY = 'invalid_dependency',
}

/**
 * Validation error
 */
export interface ValidationError {
  type: ValidationErrorType;
  field: string;
  message: string;
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Validate a plugin manifest
 * @param manifest The plugin manifest to validate
 * @returns Validation result object
 */
export function validateManifest(manifest: any): ValidationResult {
  const errors: ValidationError[] = [];
  
  // Check that manifest is an object
  if (!manifest || typeof manifest !== 'object') {
    errors.push({
      type: ValidationErrorType.INVALID_TYPE,
      field: 'manifest',
      message: 'Manifest must be an object',
    });
    return { valid: false, errors };
  }
  
  // Check required fields
  for (const field of PLUGIN.REQUIRED_FIELDS) {
    if (!manifest[field]) {
      errors.push({
        type: ValidationErrorType.MISSING_FIELD,
        field,
        message: `Required field "${field}" is missing`,
      });
    }
  }
  
  // Validate entry point
  if (!manifest.entry || typeof manifest.entry !== 'object') {
    errors.push({
      type: ValidationErrorType.MISSING_FIELD,
      field: 'entry',
      message: 'Entry field is required and must be an object',
    });
  } else {
    // At least one entry point must be specified
    if (!manifest.entry.server && !manifest.entry.client) {
      errors.push({
        type: ValidationErrorType.INVALID_VALUE,
        field: 'entry',
        message: 'At least one entry point (server or client) must be specified',
      });
    }
    
    // Validate server entry point
    if (manifest.entry.server && typeof manifest.entry.server !== 'string') {
      errors.push({
        type: ValidationErrorType.INVALID_TYPE,
        field: 'entry.server',
        message: 'Server entry point must be a string',
      });
    }
    
    // Validate client entry point
    if (manifest.entry.client && typeof manifest.entry.client !== 'string') {
      errors.push({
        type: ValidationErrorType.INVALID_TYPE,
        field: 'entry.client',
        message: 'Client entry point must be a string',
      });
    }
  }
  
  // Validate dependencies
  if (manifest.dependencies) {
    if (typeof manifest.dependencies !== 'object') {
      errors.push({
        type: ValidationErrorType.INVALID_TYPE,
        field: 'dependencies',
        message: 'Dependencies must be an object',
      });
    } else {
      // Validate each dependency
      for (const [dependency, version] of Object.entries(manifest.dependencies)) {
        if (typeof dependency !== 'string' || typeof version !== 'string') {
          errors.push({
            type: ValidationErrorType.INVALID_TYPE,
            field: `dependencies.${dependency}`,
            message: 'Dependency name and version must be strings',
          });
        }
      }
    }
  }
  
  // Validate UI configuration
  if (manifest.ui) {
    if (typeof manifest.ui !== 'object') {
      errors.push({
        type: ValidationErrorType.INVALID_TYPE,
        field: 'ui',
        message: 'UI configuration must be an object',
      });
    } else {
      // Validate main UI entry point
      if (manifest.ui.main && typeof manifest.ui.main !== 'string') {
        errors.push({
          type: ValidationErrorType.INVALID_TYPE,
          field: 'ui.main',
          message: 'UI main entry point must be a string',
        });
      }
      
      // Validate routes
      if (manifest.ui.routes) {
        if (!Array.isArray(manifest.ui.routes)) {
          errors.push({
            type: ValidationErrorType.INVALID_TYPE,
            field: 'ui.routes',
            message: 'UI routes must be an array',
          });
        } else {
          // Validate each route
          for (let i = 0; i < manifest.ui.routes.length; i++) {
            const route = manifest.ui.routes[i];
            
            if (!route.path || typeof route.path !== 'string') {
              errors.push({
                type: ValidationErrorType.INVALID_VALUE,
                field: `ui.routes[${i}].path`,
                message: 'Route path must be a non-empty string',
              });
            }
            
            if (!route.component || typeof route.component !== 'string') {
              errors.push({
                type: ValidationErrorType.INVALID_VALUE,
                field: `ui.routes[${i}].component`,
                message: 'Route component must be a non-empty string',
              });
            }
          }
        }
      }
    }
  }
  
  // Log validation results
  if (errors.length > 0) {
    logger.error(`Manifest validation failed with ${errors.length} errors`);
    errors.forEach(error => logger.debug(`Validation error: ${error.message}`));
  } else {
    logger.debug('Manifest validation successful');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate and normalize a plugin manifest
 * @param manifest The plugin manifest to validate and normalize
 * @returns The normalized manifest, or null if validation fails
 */
export function normalizeManifest(manifest: any): PluginManifest | null {
  const { valid, errors } = validateManifest(manifest);
  
  if (!valid) {
    return null;
  }
  
  // Create a normalized copy of the manifest
  const normalized: PluginManifest = {
    name: manifest.name,
    version: manifest.version || PLUGIN.DEFAULT_VERSION,
    description: manifest.description,
    author: manifest.author,
    dependencies: manifest.dependencies || {},
    entry: {
      server: manifest.entry.server || undefined,
      client: manifest.entry.client || undefined,
    },
  };
  
  // Add UI configuration if present
  if (manifest.ui) {
    normalized.ui = {
      main: manifest.ui.main,
      routes: manifest.ui.routes,
    };
  }
  
  return normalized;
}