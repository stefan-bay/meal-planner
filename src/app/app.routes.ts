import { type Routes } from '@angular/router';

import { ListRecipesComponent } from './recipes-page/list-recipes/list-recipes.component';
import { ViewRecipeComponent } from './recipes-page/view-recipe/view-recipe.component';
import { EditRecipeComponent } from './recipes-page/edit-recipe/edit-recipe.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/home',
    },
    {
        path: 'recipes',
        component: ListRecipesComponent,
    },
    {
        path: 'recipes/:id',
        component: ViewRecipeComponent,
    },
    {
        path: 'recipes/:id/edit',
        component: EditRecipeComponent,
    },
    {
        path: '**',
        component: PageNotFoundComponent,
    },
];
