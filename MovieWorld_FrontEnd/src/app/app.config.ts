import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { provideAnimations } from '@angular/platform-browser/animations';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';

import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { provideTranslateService } from "@ngx-translate/core";
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

// PrimeNG Toast
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { authInterceptor } from './interceptor/authInterception.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    providePrimeNG({
      theme: { preset: Aura }
    }),

    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    provideTranslateService({
      loader: provideTranslateHttpLoader({ prefix: './i18n/', suffix: '.json' }),
      fallbackLang: 'it'
    }),

    importProvidersFrom(ToastModule),
    MessageService
  ]
};
