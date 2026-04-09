import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { vi, type Mock } from 'vitest';

import { AuthModal } from './auth-modal';
import { AuthService } from '../auth.service';
import { AuthModalData } from './auth-modal.types';

describe('AuthModal', () => {
  let component: AuthModal;
  let fixture: ComponentFixture<AuthModal>;
  let closeFn: Mock;
  let authService: AuthService;

  function setup(mode: AuthModalData['mode'] = 'login') {
    closeFn = vi.fn();

    TestBed.configureTestingModule({
      imports: [AuthModal],
      providers: [
        provideNoopAnimations(),
        { provide: MatDialogRef, useValue: { close: closeFn } },
        { provide: MAT_DIALOG_DATA, useValue: { mode } satisfies AuthModalData },
      ],
    });

    fixture = TestBed.createComponent(AuthModal);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  }

  describe('Login mode', () => {
    beforeEach(() => setup('login'));

    it('should create in login mode', () => {
      expect(component).toBeTruthy();
    });

    it('should show login form fields', () => {
      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector('.modal-title')?.textContent).toContain('Login required');
    });

    it('should not submit when form is invalid', () => {
      component['submitLogin']();
      expect(closeFn).not.toHaveBeenCalled();
    });

    it('should show error on failed login', () => {
      vi.spyOn(authService, 'login').mockReturnValue(false);
      component['loginForm'].setValue({ usernameOrEmail: 'testeUsername', password: '123456' });
      component['submitLogin']();
      expect(component['error']()).toBe('Invalid credentials. Please try again.');
    });

    it('should close with authenticated on success', () => {
      vi.spyOn(authService, 'login').mockReturnValue(true);
      component['loginForm'].setValue({ usernameOrEmail: 'testeUsername@email.com', password: 'teste678910' });
      component['submitLogin']();
      expect(closeFn).toHaveBeenCalledWith({ authenticated: true });
    });
  });

  describe('Register mode', () => {
    beforeEach(() => setup('register'));

    it('should create in register mode', () => {
      expect(component).toBeTruthy();
    });

    it('should show register form fields', () => {
      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector('.modal-title')?.textContent).toContain('Create your account');
    });

    it('should show error when passwords do not match', () => {
      component['registerForm'].setValue({
        username: 'testeUsername',
        fullName: 'Test User',
        email: 'test@test.com',
        password: '123456',
        confirmPassword: 'different',
      });
      component['submitRegister']();
      expect(component['error']()).toBe('Passwords do not match.');
    });

    it('should close with authenticated on successful register', () => {
      vi.spyOn(authService, 'register').mockReturnValue(true);
      component['registerForm'].setValue({
        username: 'testeUsername',
        fullName: 'Test User',
        email: 'test@test.com',
        password: '123456',
        confirmPassword: '123456',
      });
      component['submitRegister']();
      expect(closeFn).toHaveBeenCalledWith({ authenticated: true });
    });
  });

  describe('Mode switching', () => {
    beforeEach(() => setup('login'));

    it('should switch to register mode', () => {
      component['switchMode']('register');
      expect(component['mode']()).toBe('register');
    });

    it('should clear error when switching modes', () => {
      component['error'].set('Some error');
      component['switchMode']('register');
      expect(component['error']()).toBeNull();
    });
  });

  describe('Guest flow', () => {
    beforeEach(() => setup('login'));

    it('should close with unauthenticated on continue as guest', () => {
      component['continueAsGuest']();
      expect(closeFn).toHaveBeenCalledWith({ authenticated: false });
    });

    it('should close without result on close button', () => {
      component['close']();
      expect(closeFn).toHaveBeenCalledWith();
    });
  });
});
