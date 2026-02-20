//Angular Core
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'

//External Libraries
import { SelectModule } from 'primeng/select';

//Services
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'language-selector',
  imports: [SelectModule, FormsModule],
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.css',
})

export class LanguageSelectorComponent {

  constructor(private languageService : LanguageService) {}

  selectedLanguage = 'it';

  languages = [
    { label: "Italiano", value: "it", flag: "https://flagsapi.com/IT/flat/24.png" },
    { label: "English", value: "en", flag: "https://flagsapi.com/GB/flat/24.png" },
  ];

  ngOnInit() {
    this.selectedLanguage = this.languageService.getLanguage();
  }

  onLanguageChangeFromPrime(event: any) {
    this.selectedLanguage = event.value;
    this.languageService.setLanguage(event.value);
  }
}
