import { Routes } from "@angular/router"
import { SearchResults } from "./features/product/search-results/search-results"
import { NotFoundPage } from "./features/errors/not-found-page/not-found-page"
import { ProductList } from "./features/product/product-list/product-list"
import { ProductDetail } from "./features/product/product-detail/product-detail"

export const routes: Routes = [
    { path: '', component: ProductList },
    { path: 'search', component: SearchResults },
    { path: 'products/:id', component: ProductDetail },
    { path: '**', component: NotFoundPage },
]