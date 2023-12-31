import { Injectable, inject } from '@angular/core';
import {
    type CollectionReference,
    Firestore,
    collection,
    collectionData,
    doc,
    addDoc,
    type DocumentReference,
    getDoc,
} from '@angular/fire/firestore';
import { type Observable } from 'rxjs';

import { type Recipe } from './recipe';

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

    async getRecipe(id: string): Promise<Recipe> {
        const docRef: DocumentReference = doc(this.firestore, this.recipesPath + `/${id}`);
        const d = await getDoc(docRef);

        return d.data() as Recipe;
    }

    async addRecipe(recipe: Recipe): Promise<void> {
        await addDoc(this.recipesCollection, recipe);
    }
}
