import { type Routes } from '@angular/router';

import { LoginComponent } from './components/authentication/login/login.component';
import { SignupComponent } from './components/authentication/signup/signup.component';
import { ListRecipesComponent } from './components/recipes-page/list-recipes/list-recipes.component';
import { ViewRecipeComponent } from './components/recipes-page/view-recipe/view-recipe.component';
import { EditRecipeComponent } from './components/recipes-page/edit-recipe/edit-recipe.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/home',
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'signup',
        component: SignupComponent,
    },
    {
        path: 'recipes',
        canActivate: [authGuard()],
        component: ListRecipesComponent,
    },
    {
        path: 'recipes/:id',
        canActivate: [authGuard()],
        component: ViewRecipeComponent,
    },
    {
        path: 'recipes/:id/edit',
        canActivate: [authGuard()],
        component: EditRecipeComponent,
    },
    {
        path: '**',
        canActivate: [authGuard()],
        component: PageNotFoundComponent,
    },
];
