//Angular Core
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
export class CastFiltersComponent {
  @Input() filters!: PersonsFilter;
  @Output() filterChanged = new EventEmitter<PersonsFilter>();
  @Output() filterReset = new EventEmitter<void>();

  public readonly Roles = Role;

  constructor(private themeService : ThemeService) {}

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