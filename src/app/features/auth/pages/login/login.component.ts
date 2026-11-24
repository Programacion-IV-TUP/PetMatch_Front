import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { TranslocoModule } from '@ngneat/transloco';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterLink,
        InputTextModule,
        TranslocoModule,
        PasswordModule,
        ButtonModule
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    // Reactive signal tracking network operation state
    isLoading = signal<boolean>(false);

    // Login form definition mapping to OpenAPI /login specification
    loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]]
    });

    // Helper method to evaluate field validation status in template
    isFieldInvalid(fieldName: string): boolean {
        const control = this.loginForm.get(fieldName);
        return !!(control && control.invalid && (control.dirty || control.touched));
    }

    onSubmit(): void {
        if (this.loginForm.invalid) return;

        this.isLoading.set(true);
        const credentials = this.loginForm.getRawValue();

        // Dispatch authentication payload to Rails backend
        this.authService.login({
            email: credentials.email || '',
            password: credentials.password || ''
        }).subscribe({
            next: () => {
                this.isLoading.set(false);
                this.router.navigate(['/pets']);
            },
            error: (err) => {
                this.isLoading.set(false);
                console.error('Error logging in:', err);
            }
        });
    }
}