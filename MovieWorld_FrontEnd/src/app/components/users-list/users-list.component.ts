import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserCardComponent } from '../user-card/user-card.component';
import { User } from '../../models/User.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'users-list-component',
  standalone: true,
  imports: [UserCardComponent, MatIconModule, MatButtonModule, TranslatePipe, PaginatorModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css',
})
export class UsersListComponent {
  @Input() users: User[] = [];
  @Input() first!: number;
  @Input() rows !: number;
  @Input() totalRecords !: number;
  @Input() paginatorElements : number[] = [10,15,20]

  @Output() onDeleteUser = new EventEmitter<number>();
  @Output() onUpdateUser = new EventEmitter<number>();
  @Output() onReset = new EventEmitter<void>();
  @Output() onPageChange = new EventEmitter<any>();
  
  deleteUser(userId: number): void {
    this.onDeleteUser.emit(userId);
  }

  updateUser(userId : number): void {
    this.onUpdateUser.emit(userId);
  }

  handlePageChange(event : any) : void {
    this.onPageChange.emit(event);
  }

  resetFilters(): void {
    this.onReset.emit();
  }
}