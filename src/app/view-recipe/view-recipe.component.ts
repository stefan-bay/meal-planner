import { Component, Input } from '@angular/core';
import { type Recipe } from '../recipe';
import { TopbarComponent } from '../navigation/topbar/topbar.component';

@Component({
    selector: 'app-view-recipe',
    standalone: true,
    imports: [TopbarComponent],
    templateUrl: './view-recipe.component.html',
})
export class ViewRecipeComponent {
    recipe: Recipe | null = null;

    private _id = '';

    constructor() {
        this.recipe = {
            name: 'Beer Brats',
            instructions:
                'Cover brats, chopped onion, and butter with beer. Bring to a boil, simmer on medium for 10-15 mins',
            items: [
                {
                    name: 'Bratwurst',
                    quantity: 1,
                    unit: 'lb',
                    category: 'Meat',
                },
                {
                    name: 'Onion',
                    quantity: 1,
                    unit: '',
                    category: 'Meat',
                },
                {
                    name: 'Butter',
                    quantity: 4,
                    unit: 'tbsp',
                    category: 'Dairy',
                },
                {
                    name: 'Beers',
                    quantity: 2,
                    unit: '',
                    category: 'Alcohol',
                },
            ],
        };
    }

    @Input()
    set id(recipeId: string) {
        this._id = recipeId;
    }

    get id(): string {
        return this._id;
    }
}
