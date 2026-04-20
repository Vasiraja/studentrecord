import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsideComponent } from './productside.component';

describe('ProductsideComponent', () => {
  let component: ProductsideComponent;
  let fixture: ComponentFixture<ProductsideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsideComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
