import { type Recipe } from './recipe';
import { type RecipeItem } from './recipe-item';

export type Completeable<T> = T & { completed: boolean };

export type CompletableItem = Completeable<RecipeItem>;
export type CompletableRecipe = Recipe & { items: CompletableItem[] };
