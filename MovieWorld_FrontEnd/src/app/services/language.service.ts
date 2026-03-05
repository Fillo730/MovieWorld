//Angular
import { inject, Injectable, signal } from '@angular/core';

//Services
import { StorageService } from './storage.service';

//Contants
import { APP_CONFIG } from '../constants/app.config';
import { STORAGE_KEYS } from '../constants/storageKeys';

// i18n
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})

export class LanguageService {
  private readonly storageKey = STORAGE_KEYS.LANGUAGE;

  private storageService = inject(StorageService);
  private translate = inject(TranslateService);

  private readonly _currentLanguage = signal<string>(
    this.storageService.getItem<string>(this.storageKey) ?? APP_CONFIG.DEFAULT_LANGUAGE
  );

  public readonly currentLanguage = this._currentLanguage.asReadonly();

  constructor() {
    this.initLanguageConfiguration();
  }

  public setLanguage(lang: string) : void{
    if(this._currentLanguage() === lang) return;
    this._currentLanguage.set(lang);
    this.storageService.setItem(this.storageKey, lang);
    this.translate.use(lang);
  }

  private initLanguageConfiguration() : void {
    this.translate.addLangs([...APP_CONFIG.SUPPORTED_LANGUAGES]);

    this.translate.setFallbackLang(APP_CONFIG.DEFAULT_LANGUAGE);

    this.translate.use(this._currentLanguage());
  }
}
