import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayperiodallComponent } from './payperiodall.component';

describe('PayperiodallComponent', () => {
  let component: PayperiodallComponent;
  let fixture: ComponentFixture<PayperiodallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayperiodallComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayperiodallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
