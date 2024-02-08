import { Component, computed, effect, inject, signal } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Subject, catchError, switchMap } from 'rxjs';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { type AuthCredentials } from '../../../interfaces/auth-credentials';

interface LoginState {
    status: 'pending' | 'logging in' | 'error' | 'success';
}

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './login.component.html',
})
export class LoginComponent {
    formBuilder = inject(FormBuilder);
    authService = inject(AuthService);
    router = inject(Router);
    route = inject(ActivatedRoute);

    formGroup = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
    });

    status = computed(() => this.state().status);

    private error$ = new Subject<any>();
    private login$ = new Subject<AuthCredentials>();

    private loggedIn$ = this.login$.pipe(
        switchMap((credentials) => {
            return this.authService.login(credentials).pipe(
                catchError((err) => {
                    this.error$.next(err);
                    return EMPTY;
                }),
            );
        }),
    );

    private state = signal<LoginState>({
        status: 'pending',
    });

    constructor() {
        this.login$.pipe(takeUntilDestroyed()).subscribe(() => {
            this.state.update((state) => ({ ...state, status: 'logging in' }));
        });

        this.loggedIn$.pipe(takeUntilDestroyed()).subscribe(() => {
            this.state.update((state) => ({ ...state, status: 'success' }));
        });

        this.error$.pipe(takeUntilDestroyed()).subscribe((err) => {
            console.error('Could not login: ' + err);
            this.state.update((state) => ({ ...state, status: 'error' }));
        });

        effect(() => {
            if (this.authService.user()) {
                void this.router.navigate([this.route.snapshot.queryParamMap.get('redirect') ?? 'recipes']);
            }
        });
    }

    get email(): string | null {
        return this.formGroup.value.email ?? null;
    }

    get password(): string | null {
        return this.formGroup.value.password ?? null;
    }

    onSubmit(): void {
        if (!this.email || !this.password) {
            return;
        }
        this.login$.next({ email: this.email, password: this.password });
    }
}
