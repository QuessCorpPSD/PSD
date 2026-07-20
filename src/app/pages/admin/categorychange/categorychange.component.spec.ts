import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorychangeComponent } from './categorychange.component';

describe('CategorychangeComponent', () => {
  let component: CategorychangeComponent;
  let fixture: ComponentFixture<CategorychangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategorychangeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategorychangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
