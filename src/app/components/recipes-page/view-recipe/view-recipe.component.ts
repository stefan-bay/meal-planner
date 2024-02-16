import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { catchError, EMPTY, type Observable } from 'rxjs';

import { TopbarComponent } from '../../navigation/topbar/topbar.component';
import { FirestoreService } from '../../../services/firestore.service';
import { PageNotFoundComponent } from '../../page-not-found/page-not-found.component';
import { type Recipe } from '../../../interfaces/recipe';
import { type AsyncStatus } from '../../../interfaces/async-status';

@Component({
    selector: 'app-view-recipe',
    standalone: true,
    imports: [TopbarComponent, RouterModule, CommonModule, PageNotFoundComponent],
    templateUrl: './view-recipe.component.html',
})
export class ViewRecipeComponent {
    firestoreService = inject(FirestoreService);

    status = signal<AsyncStatus>('pending');

    recipe$: Observable<Recipe> | null = null;

    private _id = '';

    get id(): string {
        return this._id;
    }

    @Input()
    set id(recipeId: string) {
        this.recipe$ = this.firestoreService.getRecipe(recipeId).pipe(
            catchError((err) => {
                console.error(err);
                this.status.update(() => 'error');
                return EMPTY;
            }),
        );
        this._id = recipeId;
    }
}
