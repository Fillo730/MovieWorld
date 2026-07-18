import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { SlideRangeComponent } from '../slide-range/slide-range.component';
import { SliderWithInputComponent } from '../slider-with-input/slider-with-input.component';
import { ThemeService } from '../../services/theme.service';
import { getButtonTypeBasedOnTheme } from '../../utils/themeFunctions';
import { OrderState } from '../../models/Order.model';
import { OrdersFilter } from '../../models/filters/OrdersFilter.model';

@Component({
  selector: 'your-orders-filters-component',
  standalone: true,
  imports: [SlideRangeComponent, SliderWithInputComponent, ButtonModule, FormsModule],
  templateUrl: './your-orders-filters.component.html',
  styleUrl: './your-orders-filters.component.css',
})
export class YourOrdersFiltersComponent {
  @Input() filters!: OrdersFilter;
  @Input() orderStates: OrderState[] = [];
  @Input() minMaxPrices: number[] = [0, 1000];

  @Input() filtersTitle!: string;
  @Input() stateTitle!: string;
  @Input() allStatesLabel!: string;
  @Input() yearTitle!: string;
  @Input() moviesNumberTitle!: string;
  @Input() priceTitle!: string;
  @Input() resetLabel!: string;

  @Output() filtersChanged = new EventEmitter<OrdersFilter>();
  @Output() filtersReset = new EventEmitter<void>();

  constructor(private themeService: ThemeService) {}

  onStateChange(): void {
    this.emitChanges();
  }

  onYearChange(newValue: number): void {
    this.filters.year = newValue ? newValue : null;
    this.emitChanges();
  }

  onMoviesNumberChange(): void {
    this.emitChanges();
  }

  onPriceRangeChange(range: number[]): void {
    this.filters.totalValue = range;
    this.emitChanges();
  }

  private emitChanges(): void {
    this.filtersChanged.emit({ ...this.filters });
  }

  handleResetFilters(): void {
    this.filtersReset.emit();
  }

  handleButtonTheme() {
    return getButtonTypeBasedOnTheme(this.themeService.isDark());
  }
}
