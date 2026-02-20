import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { OrderState } from '../../models/Order.model';
import { TranslatePipe } from '@ngx-translate/core';
import { OrdersFilter } from '../../models/filters/OrdersFilter.model';
import { getButtonTypeBasedOnTheme } from '../../utils/themeFunctions';
import { ThemeService } from '../../services/theme.service';
import { debounceTime, distinct, distinctUntilChanged, filter } from 'rxjs';

@Component({
  selector: 'order-filter-component',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    MatButtonModule,
    MatIconModule,
    TranslatePipe
  ],
  templateUrl: './order-filter.component.html',
  styleUrl: './order-filter.component.css'
})
export class OrderFilterComponent {
  @Input() filters!: OrdersFilter;
  @Input() orderStates!: OrderState[];
  @Input() minMaxPrices : number[] = [0,1000];

  @Output() filtersChanged = new EventEmitter<OrdersFilter>();
  @Output() resetFilters = new EventEmitter<void>();

  private themeService = inject(ThemeService);

  filtersForm = new FormGroup({
    year: new FormControl<number | null>(null),
    orderStateId: new FormControl<number>(0),
    moviesNumber: new FormControl<number | null>(null),
    minPrice: new FormControl<number>(this.minMaxPrices[0]),
    maxPrice: new FormControl<number>(this.minMaxPrices[1]) 
  })

  readonly minYear = 2000;
  readonly maxYear = new Date().getFullYear();

  ngOnInit() {
    this.filtersForm.patchValue({
      year: this.filters.year,
      orderStateId: this.filters.OrderStateId,
      moviesNumber: this.filters.moviesNumber,
      minPrice: this.filters.totalValue[0],
      maxPrice: this.filters.totalValue[1]
    }, { emitEvent: false });
    this.filtersForm.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(val => {
      this.handleFiltersChanged(val);
    })
  }

  handleFiltersChanged(val : any): void {
    const updatedFilters : OrdersFilter = {
      ...this.filters, 
      year: val.year,
      OrderStateId: val.orderStateId || 0,
      moviesNumber: val.moviesNumber,
      totalValue: [
        val.minPrice ?? this.minMaxPrices[0],
        val.maxPrice ?? this.minMaxPrices[1]
      ]
    }

    this.filtersChanged.emit(updatedFilters);
  }

  handleResetFilters(): void {
    this.resetFilters.emit();
  }

  preventNegative(event: KeyboardEvent): void {
    if (event.key === '-' || event.key === 'e' || event.key === '+') {
      event.preventDefault();
    }
  }

  isDarkTheme() {
    return getButtonTypeBasedOnTheme(this.themeService.isDark());
  }
}