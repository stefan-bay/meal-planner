import { Component } from '@angular/core';
import { TopbarComponent } from '../../navigation/topbar/topbar.component';

@Component({
    selector: 'app-general-list',
    standalone: true,
    imports: [TopbarComponent],
    templateUrl: './general-list.component.html',
})
export class GeneralListComponent {}
