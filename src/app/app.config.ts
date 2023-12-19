import { type ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        importProvidersFrom(
            provideFirebaseApp(() =>
                initializeApp({
                    projectId: 'meal-planner-57314',
                    appId: '1:737424009673:web:74e4618fa733662393a018',
                    storageBucket: 'meal-planner-57314.appspot.com',
                    apiKey: 'AIzaSyC600hwokS0-rPKqOt3LI_8Vl5lvlUJtvY',
                    authDomain: 'meal-planner-57314.firebaseapp.com',
                    messagingSenderId: '737424009673',
                }),
            ),
        ),
        importProvidersFrom(provideAuth(() => getAuth())),
        importProvidersFrom(provideFirestore(() => getFirestore())),
    ],
};
