import {inject, Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {City} from "../../shared/models/city.model";
import {Place, PlacesRequest, TripRequest} from "../../shared/models/trip.model";

@Injectable({
  providedIn: 'root'
})
export class TripService {
  http = inject(HttpClient)

  getCities(): Observable<City[]> {
    const url = "/api/v1/cities"
    return this.http.get<City[]>(url);
  }

  recommendPlaces(body: PlacesRequest): Observable<Place[]> {
    const url = '/api/v1/places/recommend';
    return this.http.post<Place[]>(url, body);
  }

  saveTrip(trip: TripRequest): Observable<any> {
    return this.http.post('/api/v1/trips/save', trip);
  }

}
