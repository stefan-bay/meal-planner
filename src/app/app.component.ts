import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

import { SidebarIconComponent } from './components/navigation/sidebar-icon/sidebar-icon.component';
import { SignupComponent } from './components/authentication/signup/signup.component';
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterModule, SignupComponent, RouterOutlet, SidebarIconComponent],
    templateUrl: './app.component.html',
})
export class AppComponent {
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    constructor() {
        effect(() => {
            // undefined = authentication yet to be checked
            // null = unauthenticated
            if (this.authService.user() === null) {
                const signingUp = this.router.url === '/signup';
                if (signingUp) {
                    return;
                }
                void this.router.navigate(['/login']);
            }
        });
    }
}
