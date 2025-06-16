import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-delete-trip-dialog',
  templateUrl: './delete-trip-dialog.component.html',
  styleUrl: './delete-trip-dialog.component.scss'
})
export class DeleteTripDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteTripDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  close(value: boolean): void {
    this.dialogRef.close(value);
  }

}
