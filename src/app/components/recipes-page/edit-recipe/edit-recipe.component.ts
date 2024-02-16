import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { type FormArray, type FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { type Observable, take } from 'rxjs';

import { TopbarComponent } from '../../navigation/topbar/topbar.component';
import { FirestoreService } from '../../../services/firestore.service';
import { type Recipe } from '../../../interfaces/recipe';
import { type RecipeItem } from '../../../interfaces/recipe-item';
import { type AsyncStatus } from '../../../interfaces/async-status';
import { PageNotFoundComponent } from '../../page-not-found/page-not-found.component';

@Component({
    selector: 'app-edit-recipe',
    standalone: true,
    imports: [TopbarComponent, ReactiveFormsModule, CommonModule, PageNotFoundComponent],
    templateUrl: './edit-recipe.component.html',
})
export class EditRecipeComponent {
    route = inject(ActivatedRoute);
    router = inject(Router);
    formBuiler = inject(FormBuilder);
    firestoreService = inject(FirestoreService);

    loading = false;

    recipeForm: FormGroup = this.formBuiler.group({
        name: ['', Validators.required],
        instructions: [''],
        items: this.formBuiler.array([]),
    });

    status = signal<AsyncStatus>('pending');

    recipe$: Observable<Recipe | undefined> | null = null;

    private _id = '';

    get items(): FormArray {
        return this.recipeForm.controls['items'] as FormArray;
    }

    get id(): string {
        return this._id;
    }

    @Input()
    set id(recipeId: string) {
        if (recipeId === 'new') {
            return;
        }
        this._id = recipeId;

        this.recipe$ = this.firestoreService.getRecipe(this.id).pipe(take(1));
        this.recipe$.subscribe({
            next: (recipe) => {
                if (!recipe) {
                    this.status.update(() => 'error');
                    return;
                }
                this.initForm(recipe);
            },
        });
    }

    addItem(index = -1): void {
        const itemForm = this.formBuiler.group({
            name: ['', Validators.required],
            quantity: ['', Validators.required],
            unit: [''],
            category: [''],
        });

        if (index >= 0) {
            this.items.insert(index, itemForm);
            return;
        }

        this.items.push(itemForm);
    }

    removeItem(itemIndex: number): void {
        this.items.removeAt(itemIndex);
    }

    async saveClicked(): Promise<void> {
        if (this.recipeForm.invalid) {
            return;
        }
        const recipe = this.recipeForm.value as Recipe;

        this.loading = true;

        if (this.id === '') {
            const doc = await this.firestoreService.addRecipe(recipe);
            await this.router.navigate([`../../${doc.id}`], { relativeTo: this.route });
        } else {
            await this.firestoreService.updateRecipe(this.id, recipe);
            await this.router.navigate(['../'], { relativeTo: this.route });
        }

        this.loading = false;
    }

    private initForm(recipe: Recipe): void {
        const itemFormBuilder = (item: RecipeItem): FormGroup => {
            return this.formBuiler.group({
                name: [item.name, Validators.required],
                quantity: [item.quantity, Validators.required],
                unit: [item.unit || ''],
                category: [item.category || ''],
            });
        };

        const itemForms = recipe.items.map(itemFormBuilder);

        this.recipeForm = this.formBuiler.group({
            name: [recipe.name, Validators.required],
            instructions: [recipe.instructions],
            items: this.formBuiler.array(itemForms),
        });

        // Automatically resize instructions text-area after loading
        const instructionsEl = document.getElementById('instructions');
        if (instructionsEl) {
            (instructionsEl.parentNode as HTMLElement).dataset['replicatedValue'] = recipe.instructions;
        }
    }
}
