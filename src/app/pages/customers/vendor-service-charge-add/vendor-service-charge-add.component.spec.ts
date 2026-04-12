import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorServiceChargeAddComponent } from './vendor-service-charge-add.component';

describe('VendorServiceChargeAddComponent', () => {
  let component: VendorServiceChargeAddComponent;
  let fixture: ComponentFixture<VendorServiceChargeAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorServiceChargeAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorServiceChargeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
