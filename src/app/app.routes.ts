import { type Routes } from '@angular/router';
import { RecipesPageComponent } from './recipes-page/recipes-page.component';

export const routes: Routes = [
    {
        path: 'recipes',
        component: RecipesPageComponent,
    },
];
