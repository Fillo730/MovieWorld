//Angular
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

//Models
import { User } from '../../models/User.model';

//i18n
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'user-card-component',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatChipsModule,
    TranslatePipe
  ],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.css',
})
export class UserCardComponent {
  @Input() user!: User;

  @Output() userDeleted = new EventEmitter<number>();
  @Output() userUpdated = new EventEmitter<number>();

  handleUserDeleted() {
    this.userDeleted.emit(this.user.userId);
  }

  handleUpdateUser() {
    this.userUpdated.emit(this.user.userId);
  }
}