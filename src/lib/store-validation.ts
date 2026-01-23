/**
 * Store Validation Utilities
 *
 * Provides validation helpers for Zustand stores.
 * Keeps validation logic DRY and testable.
 */

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validates a required string field is non-empty
 */
export function validateRequired(value: unknown, fieldName: string): string | null {
  if (value === undefined || value === null) {
    return `${fieldName} is required`;
  }
  if (typeof value === 'string' && value.trim() === '') {
    return `${fieldName} cannot be empty`;
  }
  return null;
}

/**
 * Validates a number is positive
 */
export function validatePositiveNumber(value: unknown, fieldName: string): string | null {
  if (typeof value !== 'number' || isNaN(value)) {
    return `${fieldName} must be a number`;
  }
  if (value <= 0) {
    return `${fieldName} must be positive`;
  }
  return null;
}

/**
 * Validates a number is non-negative
 */
export function validateNonNegativeNumber(value: unknown, fieldName: string): string | null {
  if (typeof value !== 'number' || isNaN(value)) {
    return `${fieldName} must be a number`;
  }
  if (value < 0) {
    return `${fieldName} cannot be negative`;
  }
  return null;
}

/**
 * Validates a value is one of allowed values
 */
export function validateEnum<T>(value: T, allowedValues: readonly T[], fieldName: string): string | null {
  if (!allowedValues.includes(value)) {
    return `${fieldName} must be one of: ${allowedValues.join(', ')}`;
  }
  return null;
}

/**
 * Validates study data for creation
 */
export function validateStudyData(data: {
  name?: string;
  brandId?: string;
  category?: string;
  targetParticipants?: number;
  rebateAmount?: number;
}): ValidationResult {
  const errors: string[] = [];

  // Required fields
  const nameError = validateRequired(data.name, 'Study name');
  if (nameError) errors.push(nameError);

  const brandIdError = validateRequired(data.brandId, 'Brand');
  if (brandIdError) errors.push(brandIdError);

  const categoryError = validateRequired(data.category, 'Category');
  if (categoryError) errors.push(categoryError);

  // Numeric fields
  if (data.targetParticipants !== undefined) {
    const targetError = validatePositiveNumber(data.targetParticipants, 'Target participants');
    if (targetError) errors.push(targetError);
  }

  if (data.rebateAmount !== undefined) {
    const rebateError = validateNonNegativeNumber(data.rebateAmount, 'Rebate amount');
    if (rebateError) errors.push(rebateError);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates brand data for creation
 */
export function validateBrandData(data: {
  name?: string;
  contactEmail?: string;
  contactName?: string;
}): ValidationResult {
  const errors: string[] = [];

  // Required fields
  const nameError = validateRequired(data.name, 'Brand name');
  if (nameError) errors.push(nameError);

  const emailError = validateRequired(data.contactEmail, 'Contact email');
  if (emailError) errors.push(emailError);

  const contactNameError = validateRequired(data.contactName, 'Contact name');
  if (contactNameError) errors.push(contactNameError);

  // Email format validation (basic)
  if (data.contactEmail && typeof data.contactEmail === 'string') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.contactEmail)) {
      errors.push('Contact email must be a valid email address');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Console warning for validation errors in development
 */
export function warnValidationErrors(context: string, errors: string[]): void {
  if (process.env.NODE_ENV === 'development' && errors.length > 0) {
    console.warn(`[${context}] Validation warnings:`, errors);
  }
}
