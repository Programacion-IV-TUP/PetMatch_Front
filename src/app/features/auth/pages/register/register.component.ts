import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { TranslocoModule } from '@ngneat/transloco';
import { AuthService } from '../../../../core/services/auth.service';
import { RegisterPayload } from '../../../../core/models/auth.model';

export const passwordsMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('password_confirmation')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
        return { passwordsMismatch: true };
    }
    return null;
};

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

    isLoading = signal<boolean>(false);

    // Reactive form controls mapping to flat Swagger specification
    registerForm = this.fb.group({
        first_name: ['', [Validators.required]],
        last_name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        password_confirmation: ['', [Validators.required]]
    }, { validators: passwordsMatchValidator });

    // Helper method to evaluate field validation status in template
    isFieldInvalid(fieldName: string): boolean {
        const control = this.registerForm.get(fieldName);
        return !!(control && control.invalid && (control.dirty || control.touched));
    }

    onSubmit(): void {
        if (this.registerForm.invalid) return;

        this.isLoading.set(true);
        const formValues = this.registerForm.getRawValue();

        // Construct flat payload matching Swagger /signup schema
        const payload: RegisterPayload = {
            first_name: formValues.first_name || '',
            last_name: formValues.last_name || '',
            email: formValues.email || '',
            password: formValues.password || ''
        };

        // Dispatch registration request
        this.authService.register(payload).subscribe({
            next: () => {
                this.isLoading.set(false);
                this.router.navigate(['/auth/login']);
            },
            error: (err) => {
                this.isLoading.set(false);
                console.error('Error registering user:', err);
            }
        });
    }
}