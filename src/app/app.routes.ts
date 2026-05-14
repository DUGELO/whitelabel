import { Routes } from "@angular/router"
import { SearchResults } from "./features/product/search-results/search-results"
import { NotFoundPage } from "./features/errors/not-found-page/not-found-page"
import { ProductList } from "./features/product/product-list/product-list"
import { ProductDetail } from "./features/product/product-detail/product-detail"
import { adminAuthGuard } from "./features/admin/guards/admin-auth.guard"

export const routes: Routes = [
    { path: '', component: ProductList },
    { path: 'search', component: SearchResults },
    { path: 'products/:id', component: ProductDetail },
    {
        path: 'admin/login',
        loadComponent: () =>
            import('./features/admin/admin-login/admin-login').then((m) => m.AdminLogin),
    },
    {
        path: 'admin',
        canActivate: [adminAuthGuard],
        loadComponent: () =>
            import('./features/admin/admin-shell/admin-shell').then((m) => m.AdminShell),
    },
    { path: '**', component: NotFoundPage },
]
