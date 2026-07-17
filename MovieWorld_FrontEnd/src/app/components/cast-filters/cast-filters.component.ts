//Angular Core
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

//RxJS
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

//Angular Material
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

//Models
import { Role } from '../../models/Person.model';
import { PersonsFilter } from '../../models/filters/PersonsFilter.model';

//Services
import { ThemeService } from '../../services/theme.service';

//i18n
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'cast-filters-component',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatIconModule, MatButtonModule,
    TranslatePipe
  ],
  templateUrl: './cast-filters.component.html',
  styleUrl: './cast-filters.component.css'
})
export class CastFiltersComponent implements OnInit, OnDestroy {
  @Input() filters!: PersonsFilter;
  @Output() filterChanged = new EventEmitter<PersonsFilter>();
  @Output() filterReset = new EventEmitter<void>();

  public readonly Roles = Role;

  private queryChanged$ = new Subject<string>();
  private queryChangedSubscription?: Subscription;

  constructor(private themeService : ThemeService) {}

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

  isDarkTheme() : boolean {
    return this.themeService.isDark();
  }
}