import { Component, inject, signal, input, type Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { catchError, EMPTY, switchMap, type Observable } from 'rxjs';

import { TopbarComponent } from '../../navigation/topbar/topbar.component';
import { FirestoreService } from '../../../services/firestore.service';
import { PageNotFoundComponent } from '../../page-not-found/page-not-found.component';
import { type Recipe } from '../../../interfaces/recipe';
import { type AsyncStatus } from '../../../interfaces/async-status';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-view-recipe',
    standalone: true,
    imports: [TopbarComponent, RouterModule, CommonModule, PageNotFoundComponent],
    templateUrl: './view-recipe.component.html',
})
export class ViewRecipeComponent {
    firestoreService = inject(FirestoreService);

    status = signal<AsyncStatus>('pending');
    id: Signal<string> = input.required<string>();

    recipe$: Observable<Recipe> = toObservable(this.id).pipe(
        switchMap((id) =>
            this.firestoreService.getRecipe(id).pipe(
                catchError((err) => {
                    console.error(err);
                    this.status.update(() => 'error');
                    return EMPTY;
                }),
            ),
        ),
    );
}
