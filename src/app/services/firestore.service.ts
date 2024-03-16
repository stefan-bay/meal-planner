import { Injectable, inject } from '@angular/core';
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
} from '@angular/fire/firestore';
import { map, type Observable, from, defer } from 'rxjs';

import { type Recipe } from '../interfaces/recipe';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class FirestoreService {
    private readonly firestore = inject(Firestore);
    private readonly authService = inject(AuthService);

    private get recipesPath(): string {
        return `users/${this.authService.user()?.uid}/recipes`;
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

    addRecipe(recipe: Recipe): Observable<DocumentReference> {
        return from(defer(() => addDoc(this.getRecipesCollectionRef(), recipe)));
    }

    updateRecipe(id: string, recipe: Recipe): Observable<void> {
        return from(defer(() => setDoc(this.getRecipeDocumentRef(id), recipe)));
    }

    private getRecipesCollectionRef(): CollectionReference {
        return collection(this.firestore, this.recipesPath);
    }

    private getRecipeDocumentRef(id: string): DocumentReference {
        return doc(this.firestore, this.recipesPath, id);
    }
}
