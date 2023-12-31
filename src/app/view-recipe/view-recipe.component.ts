import { Component, Input, inject } from '@angular/core';
import { type Recipe } from '../recipe';
import { TopbarComponent } from '../navigation/topbar/topbar.component';
import { FirebaseService } from '../firebase.service';

@Component({
    selector: 'app-view-recipe',
    standalone: true,
    imports: [TopbarComponent],
    templateUrl: './view-recipe.component.html',
})
export class ViewRecipeComponent {
    firebaseService = inject(FirebaseService);

    recipe: Recipe | null = null;

    private _id = '';

    @Input()
    set id(recipeId: string) {
        this._id = recipeId;
        void this.fetchRecipe();
    }

    get id(): string {
        return this._id;
    }

    async fetchRecipe(): Promise<void> {
        const recipe = await this.firebaseService.getRecipe(this.id);
        this.recipe = recipe;
    }
}
