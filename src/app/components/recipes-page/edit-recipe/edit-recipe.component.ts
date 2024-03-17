import {
    Component,
    inject,
    signal,
    type Signal,
    input,
    computed,
    viewChild,
    effect,
    untracked,
    type ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { type FormArray, type FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { type Observable, take, catchError, EMPTY, Subject, filter, switchMap, iif } from 'rxjs';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';

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
    instructionsText = viewChild.required<ElementRef>('instructionsTextArea');

    route = inject(ActivatedRoute);
    router = inject(Router);
    formBuiler = inject(FormBuilder);
    firestoreService = inject(FirestoreService);

    recipeForm: FormGroup = this.formBuiler.group({
        name: ['', Validators.required],
        instructions: [''],
        items: this.formBuiler.array([]),
    });

    status = signal<AsyncStatus>('pending');
    id: Signal<string> = input.required<string>();
    newRecipe = computed(() => this.id() === 'new');

    id$ = toObservable(this.id);

    save$ = new Subject<void>();
    savedRecipe$ = this.save$.pipe(
        switchMap(() =>
            iif(
                this.newRecipe,
                this.firestoreService.addRecipe(this.recipeFormValue), // TODO: error handling
                this.firestoreService.updateRecipe(this.id(), this.recipeFormValue), // TODO: error handling
            ),
        ),
    );

    recipe$: Observable<Recipe> = this.id$.pipe(
        filter(() => !this.newRecipe()),
        switchMap((id) =>
            this.firestoreService.getRecipe(id).pipe(
                take(1),
                catchError(() => {
                    this.status.update(() => 'error');
                    return EMPTY;
                }),
            ),
        ),
    );

    recipe = toSignal(this.recipe$);

    constructor() {
        this.id$.pipe(takeUntilDestroyed()).subscribe((id) => {
            if (this.newRecipe()) {
                this.status.set('success');
                return;
            }
            this.status.set('in progress');
        });

        this.recipe$.pipe(takeUntilDestroyed()).subscribe((recipe) => {
            this.initForm(recipe);
            this.status.set('success');
        });

        this.save$.pipe(takeUntilDestroyed()).subscribe(() => {
            this.status.set('in progress');
        });

        this.savedRecipe$.pipe(takeUntilDestroyed()).subscribe((doc) => {
            this.status.set('success');
            if (doc) {
                void this.router.navigate([`../../${doc.id}`], { relativeTo: this.route });
                return;
            }
            void this.router.navigate(['../'], { relativeTo: this.route });
        });

        // Auto update text area after recipe loaded
        const updateInstructions = effect(() => {
            const it = this.instructionsText();
            const recipe = untracked(this.recipe);
            if (it && recipe) {
                it.nativeElement.parentNode.dataset.replicatedValue = recipe.instructions;
                updateInstructions.destroy();
            }
        });
    }

    get recipeFormValue(): Recipe {
        return this.recipeForm.value;
    }

    get items(): FormArray {
        return this.recipeForm.controls['items'] as FormArray;
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
}
