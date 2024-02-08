import { Component, inject } from '@angular/core';
import { TopbarComponent } from '../navigation/topbar/topbar.component';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [TopbarComponent],
    templateUrl: './settings.component.html',
})
export class SettingsComponent {
    public authService = inject(AuthService);
}
