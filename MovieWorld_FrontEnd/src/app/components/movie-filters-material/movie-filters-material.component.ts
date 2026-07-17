import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

//RxJS
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { Genre } from '../../models/Genre.model';

@Component({
  selector: 'movies-filters-component',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './movie-filters-material.component.html',
  styleUrl: './movie-filters-material.component.css'
})
export class MoviesFiltersMaterialComponent implements OnInit, OnDestroy {
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
  @Input() allGenresLabel: string = '';

  @Input() genres: Genre[] = [];
  @Input() areGenresVisible: boolean = true;

  @Output() filtersChanged = new EventEmitter<void>();
  @Output() filtersReset = new EventEmitter<void>();

  private inputChanged$ = new Subject<void>();
  private inputChangedSubscription?: Subscription;

  ngOnInit(): void {
    this.inputChangedSubscription = this.inputChanged$
      .pipe(debounceTime(300))
      .subscribe(() => this.filtersChanged.emit());
  }

  ngOnDestroy(): void {
    this.inputChangedSubscription?.unsubscribe();
  }

  emitChange() {
    this.inputChanged$.next();
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
}