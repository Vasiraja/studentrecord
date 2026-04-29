import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterclassesComponent } from './filterclasses.component';

describe('FilterclassesComponent', () => {
  let component: FilterclassesComponent;
  let fixture: ComponentFixture<FilterclassesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterclassesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterclassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
