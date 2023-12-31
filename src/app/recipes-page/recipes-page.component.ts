import { Component, inject } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';

import { type Observable } from 'rxjs';

import { TopbarComponent } from '../navigation/topbar/topbar.component';
import { FirebaseService } from '../firebase.service';
import { type Recipe } from '../recipe';

@Component({
    selector: 'app-recipes-page',
    standalone: true,
    imports: [RouterModule, TopbarComponent, NgFor, CommonModule],
    templateUrl: './recipes-page.component.html',
})
export class RecipesPageComponent {
    firebaseService = inject(FirebaseService);
    recipes$: Observable<Recipe[]>;

    constructor() {
        this.recipes$ = this.firebaseService.getRecipes();
    }
}
