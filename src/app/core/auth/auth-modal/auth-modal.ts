import { ChangeDetectionStrategy, Component, ElementRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../auth.service';
import { AuthModalData, AuthModalMode, AuthModalResult } from './auth-modal.types';

@Component({
  selector: 'app-auth-modal',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './auth-modal.html',
  styleUrl: './auth-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthModal {
  private readonly dialogRef = inject<MatDialogRef<AuthModal, AuthModalResult>>(MatDialogRef);
  private readonly data = inject<AuthModalData>(MAT_DIALOG_DATA);
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly elementRef = inject(ElementRef);

  protected readonly mode = signal<AuthModalMode>(this.data.mode);
  protected readonly error = signal<string | null>(null);
  protected readonly showPassword = signal(false);
  protected readonly showConfirmPassword = signal(false);

  protected readonly loginForm = this.fb.nonNullable.group({
    usernameOrEmail: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  protected readonly registerForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  });

  protected switchMode(target: AuthModalMode): void {
    this.mode.set(target);
    this.error.set(null);
  }

  protected togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }

  protected toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update(v => !v);
  }

  protected submitLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.scrollToFirstInvalidField();
      return;
    }

    const { usernameOrEmail, password } = this.loginForm.getRawValue();
    const success = this.authService.login(usernameOrEmail, password);

    if (success) {
      this.dialogRef.close({ authenticated: true });
    } else {
      this.error.set('Invalid credentials. Please try again.');
      this.scrollToError();
    }
  }

  protected submitRegister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.scrollToFirstInvalidField();
      return;
    }

    const { username, fullName, email, password, confirmPassword } = this.registerForm.getRawValue();

    if (password !== confirmPassword) {
      this.error.set('Passwords do not match.');
      this.scrollToError();
      return;
    }

    const success = this.authService.register(username, fullName, email, password);

    if (success) {
      this.dialogRef.close({ authenticated: true });
    } else {
      this.error.set('Registration failed. Please try again.');
      this.scrollToError();
    }
  }

  protected continueAsGuest(): void {
    this.dialogRef.close({ authenticated: false });
  }

  protected close(): void {
    this.dialogRef.close();
  }

  private scrollToError(): void {
    requestAnimationFrame(() => {
      const el = this.elementRef.nativeElement.querySelector('.form-error');
      el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  private scrollToFirstInvalidField(): void {
    requestAnimationFrame(() => {
      const el = this.elementRef.nativeElement.querySelector('.mat-form-field-invalid');
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
}
