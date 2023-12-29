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
        path: 'recipe/new',
        component: EditRecipeComponent,
    },
    {
        path: 'recipe/:id',
        component: ViewRecipeComponent,
    },
];
