import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Trip} from "../../shared/models/trip.model";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  http = inject(HttpClient);

  setProfilePicture(url: string) {
    return this.http.post('/api/v1/user/profile-picture', {pictureUrl: url});
  }

  getProfilePicture(): Observable<string> {
    return this.http.get('/api/v1/user/profile-picture', {responseType: 'text'});
  }

  getUserTrips(): Observable<Trip[]> {
    const url = '/api/v1/trips';
    return this.http.get<Trip[]>(url);
  }

  exportTripPdf(id: number) {
    const url = '/api/v1/trips';
    return this.http.get(`${url}/${id}/export-pdf`, {
      responseType: 'blob',
    });
  }

  deleteTrip(id: number) {
    const url = '/api/v1/trips';
    return this.http.delete(`${url}/${id}`);
  }

}
