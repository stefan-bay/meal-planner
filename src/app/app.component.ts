import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';

import { SidebarIconComponent } from './components/navigation/sidebar-icon/sidebar-icon.component';
import { SignupComponent } from './components/authentication/signup/signup.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterModule, SignupComponent, RouterOutlet, SidebarIconComponent],
    templateUrl: './app.component.html',
})
export class AppComponent {}
