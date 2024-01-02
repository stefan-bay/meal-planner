import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { type Observable } from 'rxjs';

import { TopbarComponent } from '../../navigation/topbar/topbar.component';
import { FirestoreService } from '../../../services/firestore.service';
import { type Recipe } from '../../../interfaces/recipe';

@Component({
    selector: 'app-list-recipes',
    standalone: true,
    imports: [RouterModule, TopbarComponent, CommonModule],
    templateUrl: './list-recipes.component.html',
})
export class ListRecipesComponent {
    firestoreService = inject(FirestoreService);
    recipes$: Observable<Recipe[]>;

    constructor() {
        this.recipes$ = this.firestoreService.getRecipes();
    }
}
