import { Injectable, inject } from '@angular/core';
import {
    type CollectionReference,
    Firestore,
    collection,
    collectionData,
    addDoc,
} from '@angular/fire/firestore';
import { type Observable } from 'rxjs';

import { type Recipe } from './recipe';

@Injectable({
    providedIn: 'root',
})
export class FirebaseService {
    firestore: Firestore = inject(Firestore);

    userId = '';

    get recipesCollection(): CollectionReference {
        return collection(this.firestore, `users/${this.userId}/recipes`);
    }

    constructor() {
        const id = localStorage.getItem('userId');
        if (id !== null) {
            this.userId = id;
        }
    }

    getRecipes(): Observable<Recipe[]> {
        return collectionData(this.recipesCollection) as Observable<Recipe[]>;
    }

    async addRecipe(recipe: Recipe): Promise<void> {
        await addDoc(this.recipesCollection, recipe);
    }
}
