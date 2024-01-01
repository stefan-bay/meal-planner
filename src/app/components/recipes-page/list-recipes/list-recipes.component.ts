import { Component, inject } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';

import { type Observable } from 'rxjs';

import { TopbarComponent } from '../../navigation/topbar/topbar.component';
import { FirebaseService } from '../../../services/firebase.service';
import { type Recipe } from '../../../interfaces/recipe';

@Component({
    selector: 'app-list-recipes',
    standalone: true,
    imports: [RouterModule, TopbarComponent, NgFor, CommonModule],
    templateUrl: './list-recipes.component.html',
})
export class ListRecipesComponent {
    firebaseService = inject(FirebaseService);
    recipes$: Observable<Recipe[]>;

    constructor() {
        this.recipes$ = this.firebaseService.getRecipes();
    }
}
