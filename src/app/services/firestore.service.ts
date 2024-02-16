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
import { map, type Observable } from 'rxjs';

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

    async addRecipe(recipe: Recipe): Promise<DocumentReference> {
        return await addDoc(this.getRecipesCollectionRef(), recipe);
    }

    async updateRecipe(id: string, recipe: Recipe): Promise<void> {
        await setDoc(this.getRecipeDocumentRef(id), recipe);
    }

    private getRecipesCollectionRef(): CollectionReference {
        return collection(this.firestore, this.recipesPath);
    }

    private getRecipeDocumentRef(id: string): DocumentReference {
        return doc(this.firestore, this.recipesPath, id);
    }
}
