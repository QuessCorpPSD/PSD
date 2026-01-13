import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayperiodunlockComponent } from './payperiodunlock.component';

describe('PayperiodunlockComponent', () => {
  let component: PayperiodunlockComponent;
  let fixture: ComponentFixture<PayperiodunlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayperiodunlockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayperiodunlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
