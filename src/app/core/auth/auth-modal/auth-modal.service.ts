import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, from, switchMap, map } from 'rxjs';

import { AuthModalMode, AuthModalData, AuthModalResult } from './auth-modal.types';

@Injectable({ providedIn: 'root' })
export class AuthModalService {
  private readonly dialog = inject(MatDialog);

  open(mode: AuthModalMode = 'login'): Observable<boolean> {
    return from(import('./auth-modal')).pipe(
      switchMap(({ AuthModal }) => {
        const ref = this.dialog.open<InstanceType<typeof AuthModal>, AuthModalData, AuthModalResult>(
          AuthModal,
          {
            data: { mode },
            panelClass: 'auth-modal-panel',
            maxWidth: '460px',
            maxHeight: '90dvh',
            width: 'calc(100% - 32px)',
            autoFocus: 'first-tabbable',
            restoreFocus: true,
          },
        );
        return ref.afterClosed();
      }),
      map(result => result?.authenticated ?? false),
    );
  }

  openLogin(): Observable<boolean> {
    return this.open('login');
  }

  openRegister(): Observable<boolean> {
    return this.open('register');
  }
}
