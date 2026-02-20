//Angular Core
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

//Services
import { SellPointsService } from '../../services/sell-points.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'sell-points-filter-component',
  standalone: true,
  templateUrl: './sell-points-filter.component.html',
  styleUrls: ['./sell-points-filter.component.css'],
})
export class SellPointsFilterComponent implements OnInit {
  @Input() mainTitle!: string;
  @Input() filterCityLabel!: string;
  @Input() allCitiesLabel!: string;
  @Input() filters!: any;
  
  @Output() filtersChanged = new EventEmitter<void>();

  availableCities: string[] = [];

  constructor(private sellPointsService : SellPointsService, private languageService : LanguageService) {}

  ngOnInit() {
    const currentLang = this.languageService.getLanguage();
    this.sellPointsService.getCities(currentLang).subscribe(response => {
      if(response.success) {
        this.availableCities = response.data;
      } else {
        console.error(response.message);
      }
    })
  }

  onCitySelect(city: string) {
    this.filters.city = city;
    this.filtersChanged.emit();
  }
}
