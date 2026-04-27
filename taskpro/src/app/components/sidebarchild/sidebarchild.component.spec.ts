import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarchildComponent } from './sidebarchild.component';

describe('SidebarchildComponent', () => {
  let component: SidebarchildComponent;
  let fixture: ComponentFixture<SidebarchildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarchildComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarchildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
