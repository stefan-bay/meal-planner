import { Component, Input, inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { type FormArray, type FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { type Observable, take } from 'rxjs';

import { TopbarComponent } from '../../navigation/topbar/topbar.component';
import { FirebaseService } from '../../../services/firebase.service';
import { type Recipe } from '../../../interfaces/recipe';
import { type RecipeItem } from '../../../interfaces/recipe-item';

@Component({
    selector: 'app-edit-recipe',
    standalone: true,
    imports: [TopbarComponent, ReactiveFormsModule, NgFor],
    templateUrl: './edit-recipe.component.html',
})
export class EditRecipeComponent {
    route = inject(ActivatedRoute);
    router = inject(Router);
    formBuiler = inject(FormBuilder);
    firebaseService = inject(FirebaseService);

    loading = false;

    recipeForm: FormGroup = this.formBuiler.group({
        name: ['', Validators.required],
        instructions: [''],
        items: this.formBuiler.array([]),
    });

    private recipe$: Observable<Recipe> | null = null;

    private _id = '';

    get items(): FormArray {
        return this.recipeForm.controls['items'] as FormArray;
    }

    get id(): string {
        return this._id;
    }

    @Input()
    set id(recipeId: string) {
        this._id = recipeId;
        if (this.id === 'new') {
            return;
        }

        this.recipe$ = this.firebaseService.getRecipe(this.id).pipe(take(1));
        this.recipe$.subscribe({
            next: (recipe) => {
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
            await this.firebaseService.addRecipe(recipe);
        } else {
            await this.firebaseService.updateRecipe(this.id, recipe);
        }

        await this.router.navigate(['../'], { relativeTo: this.route });

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
