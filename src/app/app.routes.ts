import { Routes } from "@angular/router"
import { RecipeList } from "./features/recipes/recipe-list/recipe-list"
import { RecipeDetail } from "./features/recipes/recipe-detail/recipe-detail"
import { SearchResults } from "./features/recipes/search-results/search-results"
import { NotFoundPage } from "./features/errors/not-found-page/not-found-page"

export const routes: Routes = [
    { path: '', component: RecipeList },
    { path: 'search', component: SearchResults },
    { path: 'recipes/:id', component: RecipeDetail },
    { path: '**', component: NotFoundPage },
]