import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
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

    getRecipes(): Observable<Recipe[]> {
        const aCollection = collection(this.firestore, `users/${this.userId}/recipes`);

        return collectionData(aCollection) as Observable<Recipe[]>;
    }
}
