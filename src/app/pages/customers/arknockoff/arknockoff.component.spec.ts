import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ARKnockoffComponent } from './arknockoff.component';

describe('ARKnockoffComponent', () => {
  let component: ARKnockoffComponent;
  let fixture: ComponentFixture<ARKnockoffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ARKnockoffComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ARKnockoffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
