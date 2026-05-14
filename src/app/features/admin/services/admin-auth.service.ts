import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

import { auth } from '../../../core/firebase/firebase.config';
import { AdminAuthenticatedUser, AdminAuthStatus, AdminTenantAccess } from '../models/admin-auth.models';
import { AdminTenantId, isAdminTenantRole } from '../models/admin-firestore.models';
import { AdminFirestoreService } from './admin-firestore.service';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly adminFirestore = inject(AdminFirestoreService);
  private readonly userState = signal<AdminAuthenticatedUser | null>(null);
  private readonly authStatusState = signal<AdminAuthStatus>('checking');
  private readonly tenantAccessState = signal<AdminTenantAccess | null>(null);
  private readonly authReadyPromise: Promise<void>;
  private resolveAuthReady!: () => void;
  private hasResolvedAuthReady = false;

  readonly user = this.userState.asReadonly();
  readonly authStatus = this.authStatusState.asReadonly();
  readonly tenantAccess = this.tenantAccessState.asReadonly();
  readonly isAuthenticated = computed(() => this.userState() !== null);

  constructor() {
    this.authReadyPromise = new Promise((resolve) => {
      this.resolveAuthReady = resolve;
    });

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      this.userState.set(firebaseUser ? this.mapFirebaseUser(firebaseUser) : null);
      this.authStatusState.set(firebaseUser ? 'authenticated' : 'anonymous');

      if (!firebaseUser) {
        this.tenantAccessState.set(null);
      }

      this.markAuthReady();
    });

    this.destroyRef.onDestroy(unsubscribe);
  }

  waitForAuthReady(): Promise<void> {
    return this.authReadyPromise;
  }

  async signIn(email: string, password: string): Promise<AdminAuthenticatedUser> {
    const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
    const user = this.mapFirebaseUser(credential.user);

    this.userState.set(user);
    this.authStatusState.set('authenticated');

    return user;
  }

  async signOutAdmin(): Promise<void> {
    await signOut(auth);
    this.userState.set(null);
    this.authStatusState.set('anonymous');
    this.tenantAccessState.set(null);
  }

  async ensureTenantAccess(tenantId: AdminTenantId): Promise<AdminTenantAccess | null> {
    const normalizedTenantId = tenantId.trim();
    const currentAccess = this.tenantAccessState();

    if (currentAccess?.tenantId === normalizedTenantId) {
      return currentAccess;
    }

    return this.validateTenantAccess(normalizedTenantId);
  }

  async validateTenantAccess(tenantId: AdminTenantId): Promise<AdminTenantAccess | null> {
    await this.waitForAuthReady();

    const user = this.userState();

    if (!user) {
      this.tenantAccessState.set(null);
      return null;
    }

    const tenantUser = await this.adminFirestore.getTenantUser(tenantId, user.uid);

    if (!tenantUser || tenantUser.active === false || !isAdminTenantRole(tenantUser.role)) {
      this.tenantAccessState.set(null);
      return null;
    }

    const access: AdminTenantAccess = {
      tenantId,
      uid: user.uid,
      email: user.email,
      role: tenantUser.role,
      tenantUser,
    };

    this.tenantAccessState.set(access);
    return access;
  }

  private mapFirebaseUser(firebaseUser: User): AdminAuthenticatedUser {
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
    };
  }

  private markAuthReady(): void {
    if (this.hasResolvedAuthReady) {
      return;
    }

    this.hasResolvedAuthReady = true;
    this.resolveAuthReady();
  }
}
