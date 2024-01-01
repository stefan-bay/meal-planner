import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { SidebarIconComponent } from './components/navigation/sidebar-icon/sidebar-icon.component';

const USER_ID = 'vi9c6IYy65nw3I8Bo2bJ';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterModule, RouterOutlet, SidebarIconComponent],
    templateUrl: './app.component.html',
})
export class AppComponent {
    constructor() {
        localStorage.setItem('userId', USER_ID);
    }
}
