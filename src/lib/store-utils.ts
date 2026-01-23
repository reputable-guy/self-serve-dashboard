/**
 * Store Utilities
 *
 * Shared utilities for Zustand stores.
 * Consolidates common patterns to reduce duplication.
 */

/**
 * Merges seed data with persisted data, ensuring new seed items are added.
 * This is used during rehydration to add any new seed data that was added
 * after the user's localStorage was created.
 *
 * @param persistedItems - Items from localStorage (user's persisted state)
 * @param seedItems - Default seed data that should always exist
 * @param getId - Function to extract ID from an item
 * @returns Merged array with seed items prepended
 *
 * @example
 * // In onRehydrateStorage callback:
 * state.studies = mergeSeedData(state.studies, SEED_STUDIES, s => s.id);
 */
export function mergeSeedData<T>(
  persistedItems: T[],
  seedItems: T[],
  getId: (item: T) => string
): T[] {
  const existingIds = new Set(persistedItems.map(getId));
  const newSeedItems = seedItems.filter(item => !existingIds.has(getId(item)));

  if (newSeedItems.length > 0) {
    return [...newSeedItems, ...persistedItems];
  }

  return persistedItems;
}

/**
 * Generates a unique ID with a prefix.
 * Used by stores to create IDs for new items.
 *
 * @param prefix - Prefix for the ID (e.g., 'study', 'brand')
 * @returns Unique ID string
 *
 * @example
 * generateId('study') // 'study-1642234567890-abc123xyz'
 */
export function generateStoreId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Creates a safe rehydration handler that wraps the logic in try-catch.
 * If rehydration fails, logs the error and returns gracefully.
 *
 * @param storeName - Name of the store (for logging)
 * @param handler - The rehydration handler function
 * @returns A safe version of the handler
 *
 * @example
 * onRehydrateStorage: () => createSafeRehydrationHandler('studies', (state) => {
 *   state.studies = mergeSeedData(state.studies, SEED_STUDIES, s => s.id);
 *   state.setHasHydrated(true);
 * })
 */
export function createSafeRehydrationHandler<T extends { setHasHydrated: (val: boolean) => void }>(
  storeName: string,
  handler: (state: T) => void
): (state: T | undefined) => void {
  return (state) => {
    if (!state) {
      console.warn(`[${storeName}] Rehydration failed: state is undefined`);
      return;
    }

    try {
      handler(state);
    } catch (error) {
      console.error(`[${storeName}] Error during rehydration:`, error);
      // Still mark hydration as complete to prevent infinite loading states
      try {
        state.setHasHydrated(true);
      } catch {
        // If even setHasHydrated fails, there's a serious problem
        console.error(`[${storeName}] Critical error: could not set hydration state`);
      }
    }
  };
}

/**
 * Safely parses a date, returning a fallback if parsing fails.
 *
 * @param value - The value to parse as a date
 * @param fallback - Fallback date if parsing fails (defaults to now)
 * @returns Parsed Date object or fallback
 */
export function safeParseDateField(value: unknown, fallback: Date = new Date()): Date {
  if (value instanceof Date) {
    return value;
  }
  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  return fallback;
}
