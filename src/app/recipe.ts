import { type RecipeItem } from './recipe-item';

export interface Recipe {
    name: string;
    instructions: string;
    items: RecipeItem[];
}
