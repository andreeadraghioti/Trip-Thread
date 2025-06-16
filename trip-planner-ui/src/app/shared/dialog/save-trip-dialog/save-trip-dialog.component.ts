import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-save-trip-dialog',
  templateUrl: './save-trip-dialog.component.html',
  styleUrl: './save-trip-dialog.component.scss'
})
export class SaveTripDialogComponent {
  tripName: string = '';

  constructor(
    private dialogRef: MatDialogRef<SaveTripDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  close(): void {
    this.dialogRef.close(this.tripName);
  }

  cancel(): void {
    this.dialogRef.close();
  }

}
