import { inject } from '@angular/core';
import {
    Router,
    type CanActivateFn,
    type ActivatedRouteSnapshot,
    type RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = (): CanActivateFn => {
    return (_: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        const authService = inject(AuthService);
        const router = inject(Router);

        if (authService.user()) {
            return true;
        }

        void router.navigate(['login'], { queryParams: { redirect: state.url } });
        return false;
    };
};
