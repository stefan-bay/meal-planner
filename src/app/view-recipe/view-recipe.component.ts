import { Component, Input, inject } from '@angular/core';
import { type Recipe } from '../recipe';
import { TopbarComponent } from '../navigation/topbar/topbar.component';
import { FirebaseService } from '../firebase.service';
import { onSnapshot } from '@angular/fire/firestore';

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

    get id(): string {
        return this._id;
    }

    @Input()
    set id(recipeId: string) {
        this._id = recipeId;
        this.linkRecipe();
    }

    /**
     * Automatically update recipe when it changes
     */
    linkRecipe(): void {
        const recipeRef = this.firebaseService.getRecipe(this.id);

        onSnapshot(recipeRef, (snapshot) => {
            this.recipe = snapshot.data() as Recipe;
        });
    }
}
