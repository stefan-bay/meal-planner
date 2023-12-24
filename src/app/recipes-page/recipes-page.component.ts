import { Component } from '@angular/core';
import { TopbarComponent } from '../navigation/topbar/topbar.component';

@Component({
    selector: 'app-recipes-page',
    standalone: true,
    imports: [TopbarComponent],
    templateUrl: './recipes-page.component.html',
})
export class RecipesPageComponent {
    rec = {
        name: 'Beer Brats',
        instructions:
            'Cover brats, chopped onion, and butter with beer. Bring to a boil, simmer on medium for 10-15 mins',
        items: [
            {
                name: 'Bratwurst',
                quantity: '1',
                unit: 'lb',
                category: 'Meat',
            },
            {
                name: 'Onion',
                quantity: '1',
                unit: '',
                category: 'Meat',
            },
            {
                name: 'Butter',
                quantity: '4',
                unit: 'tbsp',
                category: 'Dairy',
            },
            {
                name: 'Beers',
                quantity: '2',
                unit: '',
                category: 'Alcohol',
            },
        ],
    };
}
