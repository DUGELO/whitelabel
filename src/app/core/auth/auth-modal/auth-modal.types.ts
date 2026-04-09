export type AuthModalMode = 'login' | 'register';

export interface AuthModalData {
  mode: AuthModalMode;
}

export interface AuthModalResult {
  authenticated: boolean;
}
