import {APP_INITIALIZER, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {MaterialModule} from "./shared/material.module";
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {HttpTokenInterceptor} from "./services/interceptor/http-token.interceptor";
import {KeycloakService} from "./services/keycloak/keycloak.service";
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import {NgOptimizedImage} from "@angular/common";
import { TripsComponent } from './trips/trips.component';
import {MatAutocomplete, MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatCardModule} from "@angular/material/card";
import {ErrorDialogComponent} from "./shared/dialog/error-dialog/error-dialog.component";
import {MatButtonToggle} from "@angular/material/button-toggle";
import {ProfilePictureDialogComponent} from "./shared/dialog/profile-picture-dialog/profile-picture-dialog.component";
import {SaveTripDialogComponent} from "./shared/dialog/save-trip-dialog/save-trip-dialog.component";
import {DeleteTripDialogComponent} from "./shared/dialog/delete-trip-dialog/delete-trip-dialog.component";

export function kcFactory(kcService: KeycloakService): () => Promise<void> {
  return () => kcService.init();
}
@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    HomeComponent,
    TripsComponent,
    ErrorDialogComponent,
    ProfilePictureDialogComponent,
    SaveTripDialogComponent,
    DeleteTripDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    NgOptimizedImage,
    HttpClientModule,
    MatAutocomplete,
    ReactiveFormsModule,
    MatAutocompleteTrigger,
    MatButtonToggle,
    FormsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpTokenInterceptor,
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      deps: [KeycloakService],
      useFactory: kcFactory,
      multi: true
    },
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
