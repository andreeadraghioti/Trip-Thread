import {ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot} from '@angular/router';
import {inject} from '@angular/core';
import {KeycloakService} from '../keycloak/keycloak.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const tokenService = inject(KeycloakService);

  if (!tokenService.keycloak.authenticated) {
    void tokenService.loginRedirectTo(state.url);
    return false;
  }
  return true;
};
