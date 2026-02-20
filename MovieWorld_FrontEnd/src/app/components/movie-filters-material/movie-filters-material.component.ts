import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


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
export class MoviesFiltersMaterialComponent {
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

  @Input() genres: Genre[] = [];
  @Input() areGenresVisible: boolean = true;

  @Output() filtersChanged = new EventEmitter<void>();
  @Output() filtersReset = new EventEmitter<void>();

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
}