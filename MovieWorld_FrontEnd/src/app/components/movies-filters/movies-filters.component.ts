import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { SliderWithInputComponent } from '../slider-with-input/slider-with-input.component';
import { ThemeService } from '../../services/theme.service';
import { getButtonTypeBasedOnTheme } from '../../utils/themeFunctions';
import { SlideRangeComponent } from "../slide-range/slide-range.component";
import { Genre } from '../../models/Genre.model';

@Component({
  selector: 'movies-filters-component',
  standalone: true,
  imports: [SliderWithInputComponent, SlideRangeComponent, ButtonModule, FormsModule],
  templateUrl: './movies-filters.component.html',
  styleUrl: './movies-filters.component.css',
})
export class MoviesFiltersComponent {
  @Input() filters!: any;
  @Input() filtersTitle!: string;
  @Input() nameTitle!: string;
  @Input() namePlaceholder!: string;
  @Input() priceTitle!: string;
  @Input() genreTitle!: string;
  @Input() yearTitle!: string;
  @Input() directorTitle!: string;
  @Input() directorPlaceholder!: string;
  @Input() actorTitle!: string;
  @Input() actorPlaceholder!: string;
  @Input() resetLabel!: string;
  @Input() allGenresLabel !: string;

  @Input() genres : Genre[] = [];
  @Input() areGenresVisible : boolean = true;

  @Output() filtersChanged = new EventEmitter<void>();
  @Output() filtersReset = new EventEmitter<void>();

  constructor(private themeService: ThemeService) {}

  emitChange() {
    this.filtersChanged.emit();
  }

  onGenreChange() {
    this.filtersChanged.emit();
  }

  onPriceRangeChange(range: number[]) {
    this.filters.priceRange = range;
    this.filtersChanged.emit();
  }

  onYearChange(newValue: number) {
    this.filters.year = newValue ? newValue : null;
    this.filtersChanged.emit();
  }

  handleResetFilters() {
    this.filtersReset.emit();
  }

  handleButtonTheme() {
    return getButtonTypeBasedOnTheme(this.themeService.isDark());
  }
}