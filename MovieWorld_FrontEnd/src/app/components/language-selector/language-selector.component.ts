//Angular Core
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms'

//External Libraries
import { SelectModule } from 'primeng/select';

//Services
import { LanguageService } from '../../services/language.service';

//Constants
import { APP_CONFIG } from '../../constants/app.config';

@Component({
  selector: 'language-selector',
  imports: [SelectModule, FormsModule],
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.css',
})

export class LanguageSelectorComponent {
  private readonly languageService = inject(LanguageService);

  public readonly languages = [...APP_CONFIG.LANG_OPTIONS];

  public lang = this.languageService.currentLanguage;

  onLanguageChangeFromPrime(event: { value: string}) {
    this.languageService.setLanguage(event.value);
  }
}
