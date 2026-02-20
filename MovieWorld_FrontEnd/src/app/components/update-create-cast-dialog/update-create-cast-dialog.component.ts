import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { Person } from '../../models/Person.model';
import { DEFAULT_AVATAR } from '../../utils/validURLPath';

@Component({
  selector: 'app-update-cast-dialog',
  standalone: true,
  imports: [
    MatDialogModule, MatInputModule, MatFormFieldModule, 
    MatSelectModule, MatIconModule, FormsModule, 
    MatButtonModule, TranslatePipe
  ],
  templateUrl: './update-create-cast-dialog.component.html',
  styleUrl: './update-create-cast-dialog.component.css'
})
export class UpdateCreateCastDialogComponent implements OnInit {
  
  public castUpdate!: Person;

  constructor(
    public dialogRef: MatDialogRef<UpdateCreateCastDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: {
      person: Person,
      title: string,
      text: string,
      cancelButtonLabel: string,
      successButtonLabel: string
    }
  ) {}

  ngOnInit() {
    this.castUpdate = { ...this.data.person };
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onUpdateClick() {
    this.dialogRef.close(this.castUpdate);
  }

  handleImageError(event: any) {
    event.target.src = DEFAULT_AVATAR;
  }
}