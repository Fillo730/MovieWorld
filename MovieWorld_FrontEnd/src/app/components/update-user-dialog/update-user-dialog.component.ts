import { Component, OnInit, Inject, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../models/User.model';
import { TranslatePipe } from '@ngx-translate/core';
import { DEFAULT_AVATAR } from '../../utils/validURLPath';

@Component({
  selector: 'update-user-dialog-component',
  standalone: true,
  imports: [
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    FormsModule,
    MatButtonModule,
    TranslatePipe
  ],
  templateUrl: './update-user-dialog.component.html',
  styleUrl: './update-user-dialog.component.css',
})
export class UpdateUserDialogComponent implements OnInit {
  
  public userUpdate!: User;
  
  constructor(
    public dialogRef: MatDialogRef<UpdateUserDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: {
      user: User,
      title: string,
      text: string,
      cancelButtonLabel: string,
      successButtonLabel: string
    }
  ) {}

  ngOnInit() {
    this.userUpdate = { ...this.data.user };
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onUpdateClick() {
    this.dialogRef.close(this.userUpdate);
  }

  handleImageError(event: any) {
    event.target.src = DEFAULT_AVATAR;
  }
}