import { Injectable, computed, inject, signal } from '@angular/core';
import {
    Auth,
    type User,
    user,
    signInWithEmailAndPassword,
    type UserCredential,
    signOut,
    createUserWithEmailAndPassword,
} from '@angular/fire/auth';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { type Observable, defer, from } from 'rxjs';

import { type AuthCredentials } from '../interfaces/auth-credentials';

interface AuthState {
    user: User | undefined | null;
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    user = computed(() => this.state().user);

    private readonly auth = inject(Auth);

    private readonly user$ = user(this.auth);

    private readonly state = signal<AuthState>({
        user: undefined,
    });

    constructor() {
        this.user$.pipe(takeUntilDestroyed()).subscribe((user) => {
            this.state.update((state) => ({
                ...state,
                user,
            }));
        });
    }

    login(credentials: AuthCredentials): Observable<UserCredential> {
        return from(
            defer(() => signInWithEmailAndPassword(this.auth, credentials.email, credentials.password)),
        );
    }

    async logout(): Promise<void> {
        await signOut(this.auth);
    }

    createAccount(credentials: AuthCredentials): Observable<UserCredential> {
        return from(
            defer(() => createUserWithEmailAndPassword(this.auth, credentials.email, credentials.password)),
        );
    }
}
