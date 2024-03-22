import { Injectable, computed, inject } from '@angular/core';
import {
    type CollectionReference,
    type DocumentReference,
    Firestore,
    collection,
    doc,
    collectionData,
    docData,
    addDoc,
    setDoc,
    updateDoc,
} from '@angular/fire/firestore';
import { map, type Observable, from, defer, switchMap, of, concatMap } from 'rxjs';

import { type Recipe } from '../interfaces/recipe';
import { type GeneralList } from '../interfaces/general-list';
import { AuthService } from './auth.service';

const generalListDocumentId = '0general_list';

@Injectable({
    providedIn: 'root',
})
export class FirestoreService {
    private readonly firestore = inject(Firestore);
    private readonly authService = inject(AuthService);

    private userPath = computed(() => `users/${this.authService.user()?.uid}`);
    private recipesPath = computed(() => `${this.userPath()}/recipes`);
    private planPath = computed(() => `${this.userPath()}/plan`);

    getGeneralList(): Observable<GeneralList> {
        return docData(this.getGeneralListDocumentRef()).pipe(
            switchMap((generalList) => {
                if (!generalList) {
                    return this.createGeneralList().pipe(concatMap(() => this.getGeneralList())); // TODO: error handling
                }
                return of(generalList);
            }),
        ) as Observable<GeneralList>;
    }

    getRecipes(): Observable<Recipe[]> {
        return collectionData(this.getRecipesCollectionRef(), { idField: 'id' }) as Observable<Recipe[]>;
    }

    getRecipe(id: string): Observable<Recipe> {
        return docData(this.getRecipeDocumentRef(id)).pipe(
            map((recipe) => {
                if (recipe === undefined) {
                    throw new Error('Recipe not found');
                }
                return recipe;
            }),
        ) as Observable<Recipe>;
    }

    createGeneralList(): Observable<void> {
        return from(defer(() => setDoc(this.getGeneralListDocumentRef(), { items: [], recipes: [] })));
    }

    updateGeneralList(generalList: Record<keyof GeneralList, unknown[]>): Observable<void> {
        return from(defer(() => updateDoc(this.getGeneralListDocumentRef(), generalList)));
    }

    addRecipe(recipe: Recipe): Observable<DocumentReference> {
        return from(defer(() => addDoc(this.getRecipesCollectionRef(), recipe)));
    }

    updateRecipe(id: string, recipe: Recipe): Observable<void> {
        return from(defer(() => setDoc(this.getRecipeDocumentRef(id), recipe)));
    }

    private getGeneralListDocumentRef(): DocumentReference {
        return doc(this.firestore, this.planPath(), generalListDocumentId);
    }

    private getRecipesCollectionRef(): CollectionReference {
        return collection(this.firestore, this.recipesPath());
    }

    private getRecipeDocumentRef(id: string): DocumentReference {
        return doc(this.firestore, this.recipesPath(), id);
    }
}
