import { Component, Input, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, switchMap, catchError, EMPTY } from 'rxjs';

import { TopbarComponent } from '../../navigation/topbar/topbar.component';
import { FirestoreService } from '../../../services/firestore.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PageNotFoundComponent } from '../../page-not-found/page-not-found.component';
import { type RecipeState } from '../../../interfaces/recipe-state';

@Component({
    selector: 'app-view-recipe',
    standalone: true,
    imports: [TopbarComponent, RouterModule, CommonModule, PageNotFoundComponent],
    templateUrl: './view-recipe.component.html',
})
export class ViewRecipeComponent {
    firestoreService = inject(FirestoreService);

    error$ = new Subject<any>();
    recipeId$ = new Subject<string>(); // nexted from input setter

    recipe$ = this.recipeId$.pipe(
        switchMap((id) => {
            return this.firestoreService.getRecipe(id).pipe(
                catchError((err) => {
                    this.error$.next(err);
                    return EMPTY;
                }),
            );
        }),
    );

    recipe = computed(() => this.state().recipe);
    error = computed(() => this.state().error);
    status = computed(() => this.state().status);

    private state = signal<RecipeState>({
        recipe: null,
        status: 'pending',
        error: null,
    });

    private _id = '';

    constructor() {
        this.recipe$.pipe(takeUntilDestroyed()).subscribe((recipe) => {
            this.state.update((state) => ({
                ...state,
                recipe: recipe ?? null,
                status: recipe ? 'success' : 'error',
            }));
        });

        this.error$.pipe(takeUntilDestroyed()).subscribe({
            next: (error) => {
                console.error(error);
                this.state.update((state) => ({ ...state, error }));
            },
        });
    }

    get id(): string {
        return this._id;
    }

    @Input()
    set id(recipeId: string) {
        this.recipeId$.next(recipeId);
        this._id = recipeId;
    }
}
