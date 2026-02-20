import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NewsFilter } from '../../models/filters/NewsFilter';
import { TranslatePipe } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { YEARS } from '../../utils/constants';

@Component({
  selector: 'news-filter-component',
  standalone: true,
  imports: [
    CommonModule, 
  ReactiveFormsModule,
    MatInputModule, 
    MatFormFieldModule, 
    MatSelectModule, 
    MatIconModule, 
    MatButtonModule, 
    TranslatePipe
  ],
  templateUrl: './news-filter.component.html',
  styleUrl: './news-filter.component.css'
})
export class NewsFilterComponent {
  @Input() filters!: NewsFilter;
  
  @Output() filterChanged = new EventEmitter<NewsFilter>();
  @Output() filterReset = new EventEmitter<void>();

  filtersForm = new FormGroup({
    query: new FormControl<string | null>(null),
    movieQuery: new FormControl<string | null>(null),
    actorQuery: new FormControl<string | null>(null),
    year: new FormControl<number>(0)
  });

  ngOnInit() {
    this.filtersForm.patchValue({
      query: this.filters.query,
      actorQuery: this.filters.actorQuery,
      movieQuery: this.filters.movieQuery,
      year: this.filters.year
    })
    this.filtersForm.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(val => {
      this.handleFiltersChange(val);
    })
  }

  ngOnChanges(changes : SimpleChanges) {
    if(changes['filters'] && this.filtersForm) {
      this.filtersForm.patchValue(this.filters);
    }
  }

  handleFiltersChange(val : any) {
    const updatedFilters : NewsFilter = {
      ...this.filters, 
      query: val.query,
      movieQuery: val.movieQuery,
      actorQuery: val.actorQuery,
      year: val.year
    };
    console.log(updatedFilters);
    this.filterChanged.emit(updatedFilters);
  }

  onResetClick() : void{
    this.filterReset.emit();
  }

  getYearsForFilters() : number[] {
    return YEARS;
  }
}