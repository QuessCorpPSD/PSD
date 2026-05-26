import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnpaidInvoiceReportComponent } from './unpaid-invoice-report.component';

describe('UnpaidInvoiceReportComponent', () => {
  let component: UnpaidInvoiceReportComponent;
  let fixture: ComponentFixture<UnpaidInvoiceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnpaidInvoiceReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnpaidInvoiceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
