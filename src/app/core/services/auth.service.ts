import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginCredentials, LoginResponse, RegisterPayload, User } from '../models/auth.model';
import { TokenStorageService } from './token-storage.service';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private tokenStorage = inject(TokenStorageService);
    private router = inject(Router);

    private readonly API_URL = environment.apiUrl;

    currentUserSignal = signal<User | null>(this.tokenStorage.getUser());
    isAuthenticated = computed(() => !!this.currentUserSignal() && !!this.tokenStorage.getToken());

    // Dispatch login request to POST /login
    login(credentials: LoginCredentials): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials).pipe(
            tap(response => {
                this.tokenStorage.saveToken(response.token);
                this.tokenStorage.saveUser(response.user);
                this.currentUserSignal.set(response.user);
            })
        );
    }

    // Dispatch registration payload to POST /signup
    register(payload: RegisterPayload): Observable<{ message: string; user: User }> {
        return this.http.post<{ message: string; user: User }>(`${this.API_URL}/signup`, payload);
    }

    // Terminate session on server and clear local storage
    logout(): void {
        this.http.delete(`${this.API_URL}/logout`).subscribe({
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