import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EMPTY, Subject, catchError, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { sameAs } from '../../../utils/validators';
import { AuthService } from '../../../services/auth.service';
import { type AuthCredentials } from '../../../interfaces/auth-credentials';

interface SignupState {
    status: 'pending' | 'signing up' | 'error' | 'success';
}

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './signup.component.html',
})
export class SignupComponent {
    authService = inject(AuthService);
    router = inject(Router);
    formBuilder = inject(FormBuilder);

    formGroup = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, sameAs('password', 'confirmPassword')]],
    });

    status = computed(() => this.state().status);

    private error$ = new Subject<any>();
    private signup$ = new Subject<AuthCredentials>();

    private signedUp$ = this.signup$.pipe(
        switchMap((credentials) => {
            return this.authService.createAccount(credentials).pipe(
                catchError((err) => {
                    this.error$.next(err);
                    return EMPTY;
                }),
            );
        }),
    );

    private state = signal<SignupState>({
        status: 'pending',
    });

    constructor() {
        this.signup$.pipe(takeUntilDestroyed()).subscribe(() => {
            this.state.update((state) => ({ ...state, status: 'signing up' }));
        });

        this.signedUp$.pipe(takeUntilDestroyed()).subscribe(() => {
            this.state.update((state) => ({ ...state, status: 'success' }));
        });

        this.error$.pipe(takeUntilDestroyed()).subscribe((err) => {
            console.error('Could not login: ' + err);
            this.state.update((state) => ({ ...state, status: 'error' }));
        });

        effect(() => {
            if (this.authService.user()) {
                void this.router.navigate(['recipes']);
            }
        });
    }

    get email(): string | null {
        return this.formGroup.value.email ?? null;
    }

    get password(): string | null {
        return this.formGroup.value.password ?? null;
    }

    async onSubmit(): Promise<void> {
        if (!this.email || !this.password) {
            return;
        }

        this.signup$.next({ email: this.email, password: this.password });
    }
}
