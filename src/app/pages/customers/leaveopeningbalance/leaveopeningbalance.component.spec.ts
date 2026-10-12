import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveopeningbalanceComponent } from './leaveopeningbalance.component';

describe('LeaveopeningbalanceComponent', () => {
  let component: LeaveopeningbalanceComponent;
  let fixture: ComponentFixture<LeaveopeningbalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveopeningbalanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveopeningbalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
