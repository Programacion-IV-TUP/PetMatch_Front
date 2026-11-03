import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { TranslocoModule } from '@ngneat/transloco';
import { AuthService } from '../../../../core/services/auth.service';
import { RegisterPayload } from '../../../../core/models/auth.model';

@Component({
    selector: 'app-register',
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
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss'
})
export class RegisterComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    isLoading = false;

    // Reactive form controls aligned with backend expectations
    registerForm = this.fb.group({
        first_name: ['', [Validators.required]],
        last_name: ['', [Validators.required]],
        email_address: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        password_confirmation: ['', [Validators.required]]
    });

    onSubmit(): void {
        if (this.registerForm.invalid) return;

        this.isLoading = true;
        const formValues = this.registerForm.getRawValue();

        // Construct payload wrapped under 'user' key matching RegisterPayload model
        const payload: RegisterPayload = {
            user: {
                first_name: formValues.first_name || '',
                last_name: formValues.last_name || '',
                email_address: formValues.email_address || '',
                password: formValues.password || '',
                password_confirmation: formValues.password_confirmation || ''
            }
        };

        // Dispatch registration HTTP request to Rails backend
        this.authService.register(payload).subscribe({
            next: () => {
                this.isLoading = false;
                this.router.navigate(['/auth/login']);
            },
            error: (err) => {
                this.isLoading = false;
                console.error('Error registering user:', err);
            }
        });
    }
}