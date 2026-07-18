import { isDevMode } from "@angular/core";

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
        TOP_RATED_QUANTITY: 6,
        DEFAULT_PAGE_SIZE: 10
    }
} as const;

// Backend e frontend sono serviti dallo stesso container/host (l'API .NET
// pubblica anche i file statici di Angular), quindi in produzione basta un
// percorso relativo. In sviluppo (ng serve su :4200) l'API gira separatamente
// su :5246.
export const API_BASE_URL = isDevMode() ? "http://localhost:5246/api" : "/api";

export const API_ENDPOINTS =  {
    MOVIES: "movies",
    SELL_POINTS: "sellPoints",
    PERSONS: "persons",
    ORDERS: "orders",
    NEWS: "news",
    CART: "cart",
    AUTH: "auth",
    USERS: "users",
    REVIEWS: "reviews",
    WISHLIST: "wishlist",
    COUPONS: "coupons"
} as const;

export function getApiUrl (key : keyof typeof API_ENDPOINTS) : string {
    return `${API_BASE_URL}/${API_ENDPOINTS[key]}`;
}