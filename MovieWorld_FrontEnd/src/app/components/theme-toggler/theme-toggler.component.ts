//Angular Core
import { Component } from '@angular/core';

//Services
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'theme-toggler',
  imports: [],
  templateUrl: './theme-toggler.component.html',
  styleUrl: './theme-toggler.component.css',
})

export class ThemeTogglerComponent {
  constructor(private themeService : ThemeService) {}

  isDarkTheme() : boolean  {
    return this.themeService.isDark();
  }

  toggleTheme() : void {
    this.themeService.toggleTheme();
  }
}
