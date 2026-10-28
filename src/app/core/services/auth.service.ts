import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginCredentials, LoginResponse, RegisterPayload, User } from '../models/auth.model';
import { TokenStorageService } from './token-storage.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private tokenStorage = inject(TokenStorageService);
    private router = inject(Router);

    private readonly API_URL = 'http://localhost:3000/api/v1';

    currentUserSignal = signal<User | null>(this.tokenStorage.getUser());
    isAuthenticated = computed(() => !!this.currentUserSignal() && !!this.tokenStorage.getToken());

    login(credentials: LoginCredentials): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.API_URL}/sessions`, credentials).pipe(
            tap(response => {
                this.tokenStorage.saveToken(response.token);
                this.tokenStorage.saveUser(response.user);
                this.currentUserSignal.set(response.user);
            })
        );
    }

    register(payload: RegisterPayload): Observable<{ message: string; user: User }> {
        return this.http.post<{ message: string; user: User }>(`${this.API_URL}/users`, payload);
    }

    logout(): void {
        this.http.delete(`${this.API_URL}/sessions`).subscribe({
            next: () => this.clearSessionAndRedirect(),
            error: () => this.clearSessionAndRedirect()
        });
    }

    private clearSessionAndRedirect(): void {
        this.tokenStorage.clearSession();
        this.currentUserSignal.set(null);
        this.router.navigate(['/auth/login']);
    }
}