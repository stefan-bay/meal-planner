import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { type Observable } from 'rxjs';
import { SidebarIconComponent } from './sidebar-icon/sidebar-icon.component';

const userId = 'vi9c6IYy65nw3I8Bo2bJ';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet, SidebarIconComponent],
    templateUrl: './app.component.html',
})
export class AppComponent {
    firestore: Firestore = inject(Firestore);
    items$: Observable<any[]>;

    constructor() {
        const aCollection = collection(this.firestore, `users/${userId}/recipes`);
        this.items$ = collectionData(aCollection);
    }
}
