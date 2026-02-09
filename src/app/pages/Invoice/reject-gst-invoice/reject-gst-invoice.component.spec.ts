import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectGstInvoiceComponent } from './reject-gst-invoice.component';

describe('RejectGstInvoiceComponent', () => {
  let component: RejectGstInvoiceComponent;
  let fixture: ComponentFixture<RejectGstInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectGstInvoiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectGstInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
