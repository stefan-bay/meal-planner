import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { map } from 'rxjs';

import { TopbarComponent } from '../../navigation/topbar/topbar.component';
import { FirestoreService } from '../../../services/firestore.service';

@Component({
    selector: 'app-list-recipes',
    standalone: true,
    imports: [RouterModule, TopbarComponent, CommonModule],
    templateUrl: './list-recipes.component.html',
})
export class ListRecipesComponent {
    firestoreService = inject(FirestoreService);
    recipes$ = this.firestoreService
        .getRecipes()
        .pipe(
            map((recipe) => recipe.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))),
        );
}
