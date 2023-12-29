import { Component, inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { type FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TopbarComponent } from '../navigation/topbar/topbar.component';

@Component({
    selector: 'app-edit-recipe',
    standalone: true,
    imports: [TopbarComponent, ReactiveFormsModule, NgFor],
    templateUrl: './edit-recipe.component.html',
})
export class EditRecipeComponent {
    formBuiler = inject(FormBuilder);

    recipeForm = this.formBuiler.group({
        name: ['', Validators.required],
        instructions: [''],
        items: this.formBuiler.array([]),
    });

    get items(): FormArray {
        return this.recipeForm.controls.items as FormArray;
    }

    addItem(index = -1): void {
        const itemForm = this.formBuiler.group({
            name: ['', Validators.required],
            quantity: ['', Validators.required],
            unit: [''],
            category: [''],
        });
        console.log('index', index);

        if (index >= 0) {
            this.items.insert(index, itemForm);
            return;
        }

        this.items.push(itemForm);
    }

    removeItem(itemIndex: number): void {
        this.items.removeAt(itemIndex);
    }

    saveClicked(): void {
        console.log(this.recipeForm);
    }

    focusId(id: number): void {
        const el = document.getElementById(`item@${id}`);
        console.log(el);
        if (el !== null) {
            el.focus();
        }
    }
}
