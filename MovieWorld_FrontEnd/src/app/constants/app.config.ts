//Models
import { THEMES } from "../models/types/Theme.model";
import { LANGUAGES } from "../models/types/Language.model";

export const APP_CONFIG = {
    DEFAULT_LANGUAGE: LANGUAGES.ITALIANO,
    SUPPORTED_LANGUAGES: [LANGUAGES.ITALIANO, LANGUAGES.ENGLISH],
    LANG_OPTIONS: [
        { label: "Italiano", value: LANGUAGES.ITALIANO, flag: "https://flagsapi.com/IT/flat/24.png" },
        { label: "English", value: LANGUAGES.ENGLISH, flag: "https://flagsapi.com/GB/flat/24.png" },
    ],
    DEFAULT_THEME: THEMES.DARK,
    MOVIES: {
        SAME_GENRE_QUANTITY: 5,
        CULT_QUANTITY: 6,
        DEFAULT_PAGE_SIZE: 10
    }
} as const;

export const API_BASE_URL = "https://localhost:7163/api";

export const API_ENDPOINTS =  {
    MOVIES: "movies",
    SELL_POINTS: "sellPoints",
    PERSONS: "persons",
    ORDERS: "orders",
    NEWS: "news",
    CART: "cart",
    AUTH: "auth" 
} as const;

export function getApiUrl (key : keyof typeof API_ENDPOINTS) : string {
    return `${API_BASE_URL}/${API_ENDPOINTS[key]}`;
}