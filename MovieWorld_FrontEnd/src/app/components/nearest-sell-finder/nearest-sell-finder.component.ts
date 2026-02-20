import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SellPointCardComponent } from '../sell-point-card/sell-point-card.component';
import { StateHandlerComponent } from '../state-handler/state-handler.component';
import { ThemeService } from '../../services/theme.service';
import { SellPointsService } from '../../services/sell-points.service';
import { LanguageService } from '../../services/language.service';
import { getButtonTypeBasedOnTheme } from '../../utils/themeFunctions';
import { SellPoint } from '../../models/SellPoint.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'nearest-sell-finder-component',
  standalone: true,
  imports: [ButtonModule, SellPointCardComponent, StateHandlerComponent, TranslateModule],
  templateUrl: './nearest-sell-finder.component.html',
  styleUrl: './nearest-sell-finder.component.css',
})
export class NearestSellFinderComponent {
  @Input() mainTitle!: string;
  @Input() text!: string;
  @Input() buttonLabel!: string;
  @Input() searchOnMapPointsLabel!: string;

  closest: SellPoint[] = [];
  isLoading: boolean = false;
  error: boolean = false;

  constructor(
    private themeService: ThemeService,
    private sellPointsService: SellPointsService,
    private languageService: LanguageService
  ) {}

  findNearSellPoints() {
    this.isLoading = true;
    this.error = false;
    this.closest = [];

    if (!navigator.geolocation) {
      this.handleError();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const lang = this.languageService.getLanguage();
        const limit = 5;

        this.sellPointsService.getNearest(lat, lng, limit, lang).subscribe({
          next: (response) => {
            if (response.success) {
              this.closest = response.data;
            } else {
              this.error = true;
            }
            this.isLoading = false;
          },
          error: () => this.handleError()
        });
      },
      (err) => {
        console.error('Geolocation error:', err);
        this.handleError();
      },
      { timeout: 10000 }
    );
  }

  private handleError() {
    this.error = true;
    this.isLoading = false;
  }

  handleButtonTheme() {
    return getButtonTypeBasedOnTheme(this.themeService.isDark());
  }
}