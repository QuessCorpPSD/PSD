import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingdashboardComponent } from './billingdashboard.component';

describe('BillingdashboardComponent', () => {
  let component: BillingdashboardComponent;
  let fixture: ComponentFixture<BillingdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillingdashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillingdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
