export const STORAGE_KEYS = {
    LANGUAGE: 'app_language',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];