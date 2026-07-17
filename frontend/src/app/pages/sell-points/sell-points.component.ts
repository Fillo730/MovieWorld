import { Component, inject, OnInit } from '@angular/core';
import { Header } from '../../components/header/header.component';
import { Footer } from '../../components/footer/footer.component';
import { SellPointsFilterComponent } from '../../components/sell-points-filter/sell-points-filter.component';
import { NearestSellFinderComponent } from '../../components/nearest-sell-finder/nearest-sell-finder.component';
import { SellPointsListComponent } from "../../components/sell-points-list/sell-points-list.component";
import { StateHandlerComponent } from '../../components/state-handler/state-handler.component';
import { ThemeService } from '../../services/theme.service';
import { SellPointsService } from '../../services/sell-points.service';
import { LanguageService } from '../../services/language.service';
import { ButtonModule } from 'primeng/button';
import { TranslatePipe } from '@ngx-translate/core';
import { getButtonTypeBasedOnTheme } from '../../utils/themeFunctions';
import { SellPoint } from '../../models/SellPoint.model';
import { DEFAULT_SELLPOINTS_FILTERS, SellPointsFilter } from '../../models/filters/SellPointsFilter.model';
import { getDownloadButtonTheme } from '../../utils/themeFunctions';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'sell-points-component',
  standalone: true,
  imports: [
    Header, 
    Footer, 
    SellPointsFilterComponent, 
    SellPointsListComponent, 
    NearestSellFinderComponent, 
    StateHandlerComponent,
    TranslatePipe, 
    ButtonModule
  ],
  templateUrl: './sell-points.component.html',
  styleUrl: './sell-points.component.css',
})
export class SellPoints implements OnInit {
  private themeService = inject(ThemeService);
  private languageService = inject(LanguageService);
  private sellPointsService = inject(SellPointsService);
  private translateService = inject(TranslateService);

  sellPoints: SellPoint[] = []; 
  filters: SellPointsFilter = { ...DEFAULT_SELLPOINTS_FILTERS };
  totalCount: number = 0;
  pageIndex: number = 0;
  pageSize: number = 10;

  public lang = this.languageService.currentLanguage;

  isLoadingButton = false;

  isLoading: boolean = true;
  error: boolean = false;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.error = false;

    this.sellPointsService.getSellPoints(this.pageIndex, this.pageSize, this.filters).subscribe({
      next: (response) => {
        if(response.success) {
          this.sellPoints = response.data.items;
          this.totalCount = response.data.totalCount;
        } else {
          this.error = true;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = true;
        this.isLoading = false;
      }
    });
  }

  downloadExcel() {
    this.isLoadingButton = true;
    this.sellPointsService.exportToExcel(this.filters).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.translateService.instant("SellPoints.FileExcelName");
      a.click();
      window.URL.revokeObjectURL(url);
      this.isLoadingButton = false;
    })
  }

  onPageChanged(event: any) {
    this.pageIndex = event.first / event.rows;
    this.pageSize = event.rows;
    this.loadData();
  }

  onFiltersChanged() {
    this.pageIndex = 0;
    this.loadData();
  }

  handleResetFilters() {
    this.filters = { ...DEFAULT_SELLPOINTS_FILTERS };
    this.onFiltersChanged();
  }

  getDownloadButtonTheme() {
    return getDownloadButtonTheme(this.themeService.isDark());
  }

  getButtonTheme() {
    return getButtonTypeBasedOnTheme(this.themeService.isDark());
  }
}