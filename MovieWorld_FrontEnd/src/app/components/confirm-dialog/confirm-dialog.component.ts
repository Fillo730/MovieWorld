//Angular
import { Component, Inject} from '@angular/core';

//Angular Material
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'confirm-dialog-component',
  imports: [MatDialogModule,MatButtonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css',
})

export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: {title: string, text: string, cancelButtonLabel: string, 
      successButtonLabel: string}
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }
}