import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UsersFilter } from '../../models/filters/UsersFilter.model';
import { YEARS } from '../../utils/constants';

//RxJS
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

//i18n
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'users-filter-component',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatIconModule, MatButtonModule, 
    TranslatePipe
  ],
  templateUrl: './users-filter.component.html',
  styleUrl: './users-filter.component.css'
})
export class UsersFilterComponent implements OnInit, OnDestroy {
  @Input() filters!: UsersFilter;
  @Output() filterChanged = new EventEmitter<UsersFilter>();
  @Output() filterReset = new EventEmitter<void>();

  private queryChanged$ = new Subject<string>();
  private queryChangedSubscription?: Subscription;

  ngOnInit(): void {
    this.queryChangedSubscription = this.queryChanged$
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(query => {
        this.filters.query = query;
        this.notifyChange();
      });
  }

  ngOnDestroy(): void {
    this.queryChangedSubscription?.unsubscribe();
  }

  onQueryInput(query: string) {
    this.queryChanged$.next(query);
  }

  notifyChange() {
    this.filterChanged.emit({ ...this.filters });
  }

  onResetClick() {
    this.filterReset.emit();
  }

  getFiltersYear() : number[] {
    return YEARS;
  }
}