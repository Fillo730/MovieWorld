//Angular
import { Injectable } from '@angular/core';

// i18n
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private currentLanguage = 'it';
  private readonly storageKey = 'app-language';

  constructor(private translate: TranslateService) {

    this.translate.addLangs(['it', 'en']);

    this.translate.setFallbackLang('it');

    this.translate.use(this.currentLanguage);

    this.loadLanguageSaved();
  }

  setLanguage(lang: string) {
    this.currentLanguage = lang;
    localStorage.setItem(this.storageKey, lang);
    this.translate.use(lang);
  }

  getLanguage() {
    return this.currentLanguage;
  }

  loadLanguageSaved() {
    const currentLanguage = localStorage.getItem(this.storageKey);
    if(currentLanguage) 
      this.setLanguage(currentLanguage);
    else
      this.setLanguage('it');
  }
}
