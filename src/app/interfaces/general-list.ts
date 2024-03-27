import { type CompletableItem, type CompletableRecipe } from './completable';

export interface GeneralList {
    recipes: CompletableRecipe[];
    items: CompletableItem[];
}
