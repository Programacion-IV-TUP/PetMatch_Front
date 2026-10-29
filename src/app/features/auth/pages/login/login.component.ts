import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        RouterLink,
        InputTextModule,
        PasswordModule,
        ButtonModule,
        TranslocoPipe
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private messageService = inject(MessageService);
    private translocoService = inject(TranslocoService);
    private router = inject(Router);

    isLoading = signal<boolean>(false);

    loginForm: FormGroup = this.fb.group({
        email_address: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]]
    });

    isFieldInvalid(field: string): boolean {
        const control = this.loginForm.get(field);
        return !!(control && control.invalid && (control.dirty || control.touched));
    }

    onSubmit(): void {
        if (this.loginForm.invalid || this.isLoading()) return;

        this.isLoading.set(true);
        this.loginForm.disable();

        this.authService.login(this.loginForm.value).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'PetMatch',
                    detail: this.translocoService.translate('AUTH.LOGIN_SUCCESS')
                });
                this.router.navigate(['/pets']);
            },
            error: () => {
                this.isLoading.set(false);
                this.loginForm.enable();
            }
        });
    }
}