import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { ApiResponseError } from '@core/models/api-response-error.model';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  loginForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  constructor() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return field != null && field.invalid && (field.dirty || field.touched);
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    try {
      const { email, password } = this.loginForm.value;
      await this.authService.login(email, password);

      this.successMessage.set('Connexion réussie! Redirection...');

      setTimeout(() => {
        this.router.navigate(['/prayer-time']);
      }, 1000);
    } catch (error) {
      const apiResponseError: ApiResponseError = error as ApiResponseError;
      this.errorMessage.set(apiResponseError.content);
    } finally {
      this.isLoading.set(false);
    }
  }
}
