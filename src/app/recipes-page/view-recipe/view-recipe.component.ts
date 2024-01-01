import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { type Observable } from 'rxjs';

import { type Recipe } from '../../interfaces/recipe';
import { TopbarComponent } from '../../navigation/topbar/topbar.component';
import { FirebaseService } from '../../services/firebase.service';

@Component({
    selector: 'app-view-recipe',
    standalone: true,
    imports: [TopbarComponent, CommonModule],
    templateUrl: './view-recipe.component.html',
})
export class ViewRecipeComponent {
    firebaseService = inject(FirebaseService);

    recipe$: Observable<Recipe> | null = null;

    private _id = '';

    get id(): string {
        return this._id;
    }

    @Input()
    set id(recipeId: string) {
        this._id = recipeId;
        this.recipe$ = this.firebaseService.getRecipe(this.id);
    }
}
