const DARK_TYPE = "success";
const LIGHT_TYPE = "info"

export function getButtonTypeBasedOnTheme(isDark : boolean) {
    return isDark ? DARK_TYPE : LIGHT_TYPE;
}

export function getDownloadButtonTheme(isDark : boolean)  {
    return isDark ? 'info' : 'success';
}