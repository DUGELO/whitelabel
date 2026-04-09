import { computed, Injectable, signal } from "@angular/core";
import { User } from "./user.model";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    /** Signal to track the current user */
    private _user$ = signal<User | null>(null);
    readonly user$ = this._user$.asReadonly();

    /** Computed signal to track authentication state */
    readonly isAuthenticated$ = computed(() => this._user$() !== null);


    initialize(): void {
        // Simulate loading user from local storage or API
        const data = localStorage.getItem('user');

        if (data) {
            const user: User = JSON.parse(data);
            this._user$.set(user);
        } else {
            this._user$.set(null);
        }
    }


    login(usernameOrEmail: string, password: string): boolean {
        // Simulate authentication logic
        const data = localStorage.getItem('user');

        if (!data) return false;

        const storedUser: User = JSON.parse(data);
        if ((usernameOrEmail === storedUser.username || usernameOrEmail === storedUser.email) && password === atob(storedUser.password)) {
            this._user$.set(storedUser);
            return true;
        }
        return false;
    }

    logout(): void {
        this._user$.set(null);
        localStorage.removeItem('user');
    }

    register(username: string, name: string, email: string, password: string): boolean {
        // Simulate registration logic (in a real app, this would involve an API call)
        const user: User = {
            id: Date.now(),
            username,
            name,
            email,
            password: btoa(password), // Simple encoding for demonstration (not secure)
            avatarUrl: 'https://i.pravatar.cc/150?u=' + username
        };

        localStorage.setItem('user', JSON.stringify(user));
        this._user$.set(user);
        return true;
    }
}