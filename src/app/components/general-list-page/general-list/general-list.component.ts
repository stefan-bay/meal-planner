import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, switchMap } from 'rxjs';

import { TopbarComponent } from '../../navigation/topbar/topbar.component';
import { FirestoreService } from '../../../services/firestore.service';
import { type CompletableItem, type CompletableRecipe } from '../../../interfaces/completable';

@Component({
    selector: 'app-general-list',
    standalone: true,
    imports: [TopbarComponent, CommonModule, FormsModule],
    templateUrl: './general-list.component.html',
})
export class GeneralListComponent {
    firestoreService = inject(FirestoreService);

    addItem$ = new Subject<void>();
    save$ = new Subject<void>();
    savedList$ = this.save$.pipe(switchMap(() => this.firestoreService.updateGeneralList(this.localList())));

    generalList$ = this.firestoreService.getGeneralList();

    items = signal<CompletableItem[]>([]);
    recipes = signal<CompletableRecipe[]>([]);

    localList = computed(() => {
        return {
            items: this.items(),
            recipes: this.recipes(),
        };
    });

    constructor() {
        this.generalList$.pipe(takeUntilDestroyed()).subscribe((generalList) => {
            console.log('general list:', generalList);
            this.items.update((value) => [...value, ...(generalList?.items || [])]);
            this.recipes.update((value) => [...value, ...(generalList?.recipes || [])]);
        });

        this.savedList$.pipe(takeUntilDestroyed()).subscribe(() => {
            console.log('saving...');
        });

        this.addItem$.pipe(takeUntilDestroyed()).subscribe(() => {
            this.items.update((items) => [...items, this.blankCompletableItem()]);
        });
    }

    private blankCompletableItem(): CompletableItem {
        return {
            category: '',
            completed: false,
            name: '',
            quantity: 0,
            unit: '',
        };
    }
}
