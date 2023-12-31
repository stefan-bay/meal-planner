import { Injectable, inject } from '@angular/core';
import {
    type CollectionReference,
    type DocumentReference,
    Firestore,
    collection,
    collectionData,
    doc,
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
        if (id !== null) {
            this.userId = id;
        }
    }

    get recipesPath(): string {
        return `users/${this.userId}/recipes`;
    }

    get recipesCollection(): CollectionReference {
        return collection(this.firestore, this.recipesPath);
    }

    getRecipes(): Observable<Recipe[]> {
        return collectionData(this.recipesCollection, { idField: 'id' }) as Observable<Recipe[]>;
    }

    getRecipe(id: string): DocumentReference {
        return doc(this.firestore, this.recipesPath + `/${id}`);
    }

    async addRecipe(recipe: Recipe): Promise<void> {
        await addDoc(this.recipesCollection, recipe);
    }

    async updateRecipe(id: string, recipe: Recipe): Promise<void> {
        await setDoc(this.getRecipe(id), recipe);
    }
}
