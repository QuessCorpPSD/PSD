import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderNumberComponent } from './purchase-order-number.component';

describe('PurchaseOrderNumberComponent', () => {
  let component: PurchaseOrderNumberComponent;
  let fixture: ComponentFixture<PurchaseOrderNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseOrderNumberComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseOrderNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
