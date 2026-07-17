//Angular
import { HttpInterceptorFn, HttpParams } from "@angular/common/http";
import { inject, Injector } from "@angular/core";

//Services
import { LanguageService } from "../services/language.service";

//Constants
import { API_BASE_URL } from "../constants/app.config";

export const langInterceptor: HttpInterceptorFn = (req, next) => {
    const injector = inject(Injector);

    if (req.url.startsWith(API_BASE_URL)) {
        const languageService = injector.get(LanguageService);
        const currentLang = languageService.currentLanguage();

        const newParams = (req.params || new HttpParams()).set('lang', currentLang);

        const authReq = req.clone({
            params: newParams
        });
        
        return next(authReq);
    }

    return next(req);
}