import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputnavigationComponent } from './inputnavigation.component';

describe('InputnavigationComponent', () => {
  let component: InputnavigationComponent;
  let fixture: ComponentFixture<InputnavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputnavigationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputnavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
