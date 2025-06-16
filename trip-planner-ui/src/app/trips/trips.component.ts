import {Component, inject, OnInit} from '@angular/core';
import {debounceTime, distinctUntilChanged, map, Observable, startWith, Subscription} from "rxjs";
import {TripService} from "../services/trip/trip.service";
import {City} from "../shared/models/city.model";
import {FormControl} from "@angular/forms";
import {GROUP_OPTIONS} from "../shared/constants/group.constant";
import {BUDGET_OPTIONS} from "../shared/constants/budget.constant";
import {ACTIVITIES_OPTIONS} from "../shared/constants/activities.constant";
import {Place, PlacesRequest, TripRequest} from "../shared/models/trip.model";
import {ErrorDialogComponent} from "../shared/dialog/error-dialog/error-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {SaveTripDialogComponent} from "../shared/dialog/save-trip-dialog/save-trip-dialog.component";
import {KeycloakService} from "../services/keycloak/keycloak.service";

@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrl: './trips.component.scss'
})
export class TripsComponent implements OnInit{
  citiesSub!: Subscription;
  placesSub!: Subscription;
  saveTripSub!: Subscription;
  keycloakService = inject(KeycloakService);
  tripService = inject(TripService);
  dialog = inject(MatDialog);
  cities: City[] = [];
  city = new FormControl;
  filteredCities!: Observable<City[]>;
  groupOptions = GROUP_OPTIONS;
  selectedGroup: string = '';
  budgetOptions = BUDGET_OPTIONS;
  selectedBudget: string = '';
  activitiesOptions = ACTIVITIES_OPTIONS;
  selectedActivities: string[] = [];
  places: Place[] = [];
  placesGenerated: boolean = false;
  isLoading: boolean = false;
  isSaving: boolean = false
  doneSaving: boolean = false;

  ngOnInit(): void {
    this.getCities();
    this.searchCity();
    this.recoverDataFromLocalStorage();
  }

  recoverDataFromLocalStorage(): void {
    const tripStr = localStorage.getItem('tripThread.trip');
    const placesGeneratedStr = localStorage.getItem('tripThread.placesGenerated');
    const selectedCityStr = localStorage.getItem('tripThread.selectedCity');
    const placesStr = localStorage.getItem('tripThread.places')

    if (tripStr && placesGeneratedStr && selectedCityStr && placesStr) {
      this.saveTrip(JSON.parse(tripStr));
      this.placesGenerated = JSON.parse(placesGeneratedStr);
      this.city.setValue(JSON.parse(selectedCityStr));
      this.places = (JSON.parse(placesStr));
      localStorage.removeItem('tripThread.selectedCity');
      localStorage.removeItem('tripThread.tripStr');
      localStorage.removeItem('tripThread.placesGenerated');
      localStorage.removeItem('tripThread.places');
    }
  }

  getCities(): void {
    this.citiesSub = this.tripService.getCities().subscribe({
      next: (res) => {
        this.cities = res;
      },
      error: (err) => console.error('Could not load cities', err)
    });
  }

  searchCity(): void {
    this.filteredCities = this.city.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      map((value) => {
        const inputValue = typeof value === 'string' ? value : value?.city ?? '';
        return this.cities
          .sort((a, b) => a.city.localeCompare(b.city))
          .filter(city =>
            city.city.toLowerCase().includes(inputValue.toLowerCase())
          );
      })
    );
  }

  displayCity(city: City): string {
    return city ? `${city.city}, ${city.country}` : '';
  }

  selectGroup(value: string) {
    this.selectedGroup = value;
  }

  mapGroupOption(selectedGroup: string): string {
    switch(selectedGroup) {
      case 'solo traveler':
        return 'person traveling alone';
      case 'couple':
        return 'couple (two adults)'
      case 'family':
        return 'family with kids';
      case 'group of friends':
        return 'group of friends';
      default:
        return '';
    }
  }

  selectBudget(value: string) {
    this.selectedBudget = value;
  }

  selectActivities(value: string) {
    const index = this.selectedActivities.indexOf(value);
    if (index > -1) {
      this.selectedActivities.splice(index, 1);
    } else if (this.selectedActivities.length < 3) {
      this.selectedActivities.push(value);
    }
  }

  getRecommendations(): void {
    this.isLoading = true;

    const placeRequest: PlacesRequest = {
      activities: this.selectedActivities,
      city: this.city.value.city.toLowerCase(),
      group: this.mapGroupOption(this.selectedGroup),
      budget: this.selectedBudget
    }

    this.placesSub = this.tripService.recommendPlaces(placeRequest).subscribe({
      next: (places) => {
        this.places = places;
        this.placesGenerated = true;
        this.isLoading = false;
      },
      error: (err) => {
        this.showError('Looks like we have encountered an error. Please try again.')
        this.isLoading = false;
      }
    });
  }

  showError(message: string) {
    this.dialog.open(ErrorDialogComponent, {
      data: { message },
      width: '300px'
    });
  }

  openSaveTripDialog(): void {
    const dialogRef = this.dialog.open(SaveTripDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe((tripName: string | undefined) => {
      if (tripName) {
        const tripToSave: TripRequest = {
          tripName: tripName,
          city: this.city.value.city.toLowerCase(),
          places: this.places
        };
        if(!this.keycloakService.keycloak.authenticated) {
          localStorage.setItem('tripThread.trip', JSON.stringify(tripToSave));
          localStorage.setItem('tripThread.places', JSON.stringify(this.places));
          localStorage.setItem('tripThread.placesGenerated', JSON.stringify(this.placesGenerated));
          localStorage.setItem('tripThread.selectedCity', JSON.stringify(this.city.value));
          void this.keycloakService.login();
        } else {
          this.saveTrip(tripToSave);
        }
      }
    });
  }

  saveTrip(trip: TripRequest): void {
    this.isSaving = true;

    this.saveTripSub = this.tripService.saveTrip(trip).subscribe({
      next: async () => {
        this.isSaving = false;
        this.doneSaving = true;
      },error: () => {
        this.isSaving = false;
      }
    });
  }

  changePlacesGenerated(): void { this.placesGenerated = false }

}
