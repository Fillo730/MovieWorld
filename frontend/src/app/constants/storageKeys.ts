export const STORAGE_KEYS = {
    LANGUAGE: 'app_language',
    USER_DATA: 'app_user_data',
    THEME: "app_theme",
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];