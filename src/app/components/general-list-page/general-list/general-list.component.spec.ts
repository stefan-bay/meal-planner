import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralListComponent } from './general-list.component';

describe('GeneralListComponent', () => {
    let component: GeneralListComponent;
    let fixture: ComponentFixture<GeneralListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GeneralListComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(GeneralListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
