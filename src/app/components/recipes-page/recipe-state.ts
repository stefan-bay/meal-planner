import { type AsyncStatus } from '../../interfaces/async-status';
import { type Recipe } from '../../interfaces/recipe';

export interface RecipeState {
    recipe: Recipe | null;
    status: AsyncStatus;
    error: any;
}
