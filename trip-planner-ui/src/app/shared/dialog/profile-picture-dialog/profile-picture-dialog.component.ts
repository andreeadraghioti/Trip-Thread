import {Component, Inject, inject, OnInit} from '@angular/core';
import {PROFILE_AVATARS} from "../../constants/profile-avatars.constant";
import {Subscription} from "rxjs";
import {ProfileService} from "../../../services/profile/profile.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-profile-picture-dialog',
  templateUrl: './profile-picture-dialog.component.html',
  styleUrl: './profile-picture-dialog.component.scss'
})
export class ProfilePictureDialogComponent implements OnInit{
  selectedPicture: string = '';
  profilePictures: string[] = [...PROFILE_AVATARS];

  constructor(
    public dialogRef: MatDialogRef<ProfilePictureDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { selectedPicture: string }
  ) {}

  ngOnInit(): void {
    this.selectedPicture = this.data.selectedPicture;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        this.profilePictures = this.profilePictures.filter(pic => !pic.startsWith('data:image/'));
        this.profilePictures.push(dataUrl);
        this.selectedPicture = dataUrl;
      };
      reader.readAsDataURL(file);
    }
  }

  close(): void {
    this.dialogRef.close(this.selectedPicture);
  }
}
