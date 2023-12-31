import { type OnInit, Component, Input, inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { type FormArray, type FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { getDoc } from '@angular/fire/firestore';

import { TopbarComponent } from '../../navigation/topbar/topbar.component';
import { FirebaseService } from '../../services/firebase.service';
import { type Recipe } from '../../interfaces/recipe';
import { type RecipeItem } from '../../interfaces/recipe-item';

@Component({
    selector: 'app-edit-recipe',
    standalone: true,
    imports: [TopbarComponent, ReactiveFormsModule, NgFor],
    templateUrl: './edit-recipe.component.html',
})
export class EditRecipeComponent implements OnInit {
    formBuiler = inject(FormBuilder);
    firebaseService = inject(FirebaseService);

    recipeForm: FormGroup = this.formBuiler.group({
        name: ['', Validators.required],
        instructions: [''],
        items: this.formBuiler.array([]),
    });

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
    }

    async ngOnInit(): Promise<void> {
        if (this.id === undefined) {
            return;
        }

        const recipe = await this.getRecipe();
        this.initForm(recipe);
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

        if (this.id === '') {
            await this.firebaseService.addRecipe(recipe);
            return;
        }

        await this.firebaseService.updateRecipe(this.id, recipe);
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
    }

    /**
     * Get recipe only once
     */
    private async getRecipe(): Promise<Recipe> {
        const recipeRef = this.firebaseService.getRecipe(this.id);
        const recipe = (await getDoc(recipeRef)).data() as Recipe;

        return recipe;
    }
}
