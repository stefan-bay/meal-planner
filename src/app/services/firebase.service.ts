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
import { type Observable } from 'rxjs';

import { type Recipe } from '../interfaces/recipe';

@Injectable({
    providedIn: 'root',
})
export class FirebaseService {
    firestore: Firestore = inject(Firestore);

    userId = '';

    constructor() {
        const id = localStorage.getItem('userId');
        if (id === null) {
            return;
        }

        this.userId = id;
    }

    private get recipesPath(): string {
        return `users/${this.userId}/recipes`;
    }

    getRecipes(): Observable<Recipe[]> {
        return collectionData(this.getRecipesCollectionRef(), { idField: 'id' }) as Observable<Recipe[]>;
    }

    getRecipe(id: string): Observable<Recipe> {
        return docData(this.getRecipeDocumentRef(id)) as Observable<Recipe>;
    }

    async addRecipe(recipe: Recipe): Promise<void> {
        await addDoc(this.getRecipesCollectionRef(), recipe);
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
