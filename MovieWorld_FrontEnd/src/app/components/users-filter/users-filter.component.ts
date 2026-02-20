import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UsersFilter } from '../../models/filters/UsersFilter.model';
import { YEARS } from '../../utils/constants';

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
export class UsersFilterComponent {
  @Input() filters!: UsersFilter;
  @Output() filterChanged = new EventEmitter<UsersFilter>();
  @Output() filterReset = new EventEmitter<void>();

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