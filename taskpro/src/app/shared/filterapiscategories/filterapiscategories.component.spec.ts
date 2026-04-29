import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterapiscategoriesComponent } from './filterapiscategories.component';

describe('FilterapiscategoriesComponent', () => {
  let component: FilterapiscategoriesComponent;
  let fixture: ComponentFixture<FilterapiscategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterapiscategoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterapiscategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
