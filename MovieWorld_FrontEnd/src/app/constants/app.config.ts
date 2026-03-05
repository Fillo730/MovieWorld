export const APP_CONFIG = {
    DEFAULT_LANGUAGE: "it",
    SUPPORTED_LANGUAGES: ["it", "en"],
    LANG_OPTIONS: [
        { label: "Italiano", value: "it", flag: "https://flagsapi.com/IT/flat/24.png" },
        { label: "English", value: "en", flag: "https://flagsapi.com/GB/flat/24.png" },
    ]
} as const;