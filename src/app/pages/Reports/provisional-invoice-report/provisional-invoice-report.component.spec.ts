import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvisionalInvoiceReportComponent } from './provisional-invoice-report.component';

describe('ProvisionalInvoiceReportComponent', () => {
  let component: ProvisionalInvoiceReportComponent;
  let fixture: ComponentFixture<ProvisionalInvoiceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProvisionalInvoiceReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProvisionalInvoiceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
