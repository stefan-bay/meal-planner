import { type Routes } from '@angular/router';
import { RecipesPageComponent } from './recipes-page/recipes-page.component';
import { ViewRecipeComponent } from './view-recipe/view-recipe.component';
import { EditRecipeComponent } from './edit-recipe/edit-recipe.component';

export const routes: Routes = [
    {
        path: 'recipes',
        component: RecipesPageComponent,
    },
    {
        path: 'recipes/new',
        component: EditRecipeComponent,
    },
    {
        path: 'recipes/:id',
        component: ViewRecipeComponent,
    },
    {
        path: 'recipes/:id/edit',
        component: EditRecipeComponent,
    },
];
