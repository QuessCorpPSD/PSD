import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingtypeComponent } from './billingtype.component';

describe('BillingtypeComponent', () => {
  let component: BillingtypeComponent;
  let fixture: ComponentFixture<BillingtypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillingtypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillingtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
