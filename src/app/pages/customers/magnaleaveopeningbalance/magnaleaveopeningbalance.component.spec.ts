import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MagnaleaveopeningbalanceComponent } from './magnaleaveopeningbalance.component';

describe('MagnaleaveopeningbalanceComponent', () => {
  let component: MagnaleaveopeningbalanceComponent;
  let fixture: ComponentFixture<MagnaleaveopeningbalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MagnaleaveopeningbalanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MagnaleaveopeningbalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
