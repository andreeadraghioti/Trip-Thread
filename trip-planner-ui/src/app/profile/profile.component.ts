import {Component, inject, OnInit} from '@angular/core';
import {KeycloakService} from "../services/keycloak/keycloak.service";
import {ProfileService} from "../services/profile/profile.service";
import {Subscription} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {ProfilePictureDialogComponent} from "../shared/dialog/profile-picture-dialog/profile-picture-dialog.component";
import {Trip} from "../shared/models/trip.model";
import {ErrorDialogComponent} from "../shared/dialog/error-dialog/error-dialog.component";
import {DeleteTripDialogComponent} from "../shared/dialog/delete-trip-dialog/delete-trip-dialog.component";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  keycloakService=inject(KeycloakService);
  profileService = inject(ProfileService);
  getProfilePictureSub!: Subscription;
  saveProfilePictureSub!: Subscription;
  getUserTripsSub!: Subscription;
  deleteTripSub!: Subscription;
  dialog = inject(MatDialog);
  userId?: string = '';
  firstName?: string = '';
  lastName?: string = '';
  username?: string = '';
  email?: string = '';
  edit: boolean = false;
  selectedPicture: string = '';
  trips: Trip[] = [];
  expandedTripIds: Set<number> = new Set;


  ngOnInit(): void {
    this.getUserData();
    this.getProfilePicture();
    this.getTrips();
  }

  getProfilePicture(): void {
    this.getProfilePictureSub = this.profileService.getProfilePicture().subscribe((url) => {
      this.selectedPicture = url || '';
    });
  }

  getTrips(): void {
    this.getUserTripsSub = this.profileService.getUserTrips().subscribe((trips) => {
      this.trips = trips;
    })
  }

  getUserData(): void {
    this.userId = this.keycloakService.keycloak.tokenParsed?.sub;
    this.firstName = this.keycloakService.profile?.firstName;
    this.lastName = this.keycloakService.profile?.lastName;
    this.username = this.keycloakService.profile?.username;
    this.email = this.keycloakService.profile?.email;
  }

  saveProfilePicture(): void {
    this.saveProfilePictureSub = this.profileService.setProfilePicture(this.selectedPicture).subscribe();
  }

  logout(): void {
    void this.keycloakService.logout();
  }

  toggleEditMode(value: boolean) {
    this.edit = value;
  }

  openProfilePictureDialog() {
    const dialogRef = this.dialog.open(ProfilePictureDialogComponent, {
      data: { selectedPicture: this.selectedPicture },
      width: '1000px'
    });
    dialogRef.afterClosed().subscribe((result: string | undefined) => {
      if (result) {
        this.selectedPicture = result;
        this.saveProfilePicture();
      }
    });
  }

  toggleExpand(tripId: number): void {
    if (this.expandedTripIds.has(tripId)) {
      this.expandedTripIds.delete(tripId);
    } else {
      this.expandedTripIds.add(tripId);
    }
  }

  isExpanded(tripId: number): boolean {
    return this.expandedTripIds.has(tripId);
  }

  deleteTrip(id: number, name: string): void {
    const message = `Are you sure you want to delete "${name}"?`
    const dialogRef = this.dialog.open(DeleteTripDialogComponent, {
      data: { message },
      width: '300px'
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res === true) {
        this.deleteTripSub = this.profileService.deleteTrip(id).subscribe({
          next: () => {
            this.trips = this.trips.filter(trip => trip.id !== id);
          }
        })
      }
    });
  }

  exportTripPdf(id: number, name: string): void {
    this.profileService.exportTripPdf(id).subscribe((pdfBlob) => {
      const blob = new Blob([pdfBlob], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `${name}.pdf`;
      a.click();

      window.URL.revokeObjectURL(url);
    });
  }

  changePassword(): void {
    void this.keycloakService.accountManagement();
  }
}
