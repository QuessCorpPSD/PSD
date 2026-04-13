import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorServiceChargeComponent } from './vendor-service-charge.component';

describe('VendorServiceChargeComponent', () => {
  let component: VendorServiceChargeComponent;
  let fixture: ComponentFixture<VendorServiceChargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorServiceChargeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorServiceChargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
