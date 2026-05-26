import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceBatchConsolidationReportComponent } from './invoice-batch-consolidation-report.component';

describe('InvoiceBatchConsolidationReportComponent', () => {
  let component: InvoiceBatchConsolidationReportComponent;
  let fixture: ComponentFixture<InvoiceBatchConsolidationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceBatchConsolidationReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceBatchConsolidationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
