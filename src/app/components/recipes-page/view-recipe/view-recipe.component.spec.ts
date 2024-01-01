import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRecipeComponent } from './view-recipe.component';

describe('ViewEditRecipeComponent', () => {
    let component: ViewRecipeComponent;
    let fixture: ComponentFixture<ViewRecipeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ViewRecipeComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ViewRecipeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
