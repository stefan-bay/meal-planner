import { Component, effect, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [],
    templateUrl: './login.component.html',
})
export class LoginComponent {
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);

    constructor() {
        effect(() => {
            if (this.authService.user()) {
                void this.router.navigate([this.route.snapshot.queryParamMap.get('redirect') ?? 'home']);
            }
        });
    }
}
