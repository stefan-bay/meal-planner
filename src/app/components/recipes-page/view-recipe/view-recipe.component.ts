import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { type Observable } from 'rxjs';

import { type Recipe } from '../../../interfaces/recipe';
import { TopbarComponent } from '../../navigation/topbar/topbar.component';
import { FirestoreService } from '../../../services/firestore.service';

@Component({
    selector: 'app-view-recipe',
    standalone: true,
    imports: [TopbarComponent, RouterModule, CommonModule],
    templateUrl: './view-recipe.component.html',
})
export class ViewRecipeComponent {
    firestoreService = inject(FirestoreService);

    recipe$: Observable<Recipe> | null = null;

    private _id = '';

    get id(): string {
        return this._id;
    }

    @Input()
    set id(recipeId: string) {
        this._id = recipeId;
        this.recipe$ = this.firestoreService.getRecipe(this.id);
    }
}
