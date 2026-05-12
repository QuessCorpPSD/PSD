import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftInvoiceQCComponent } from './draft-invoice-qc.component';

describe('DraftInvoiceQCComponent', () => {
  let component: DraftInvoiceQCComponent;
  let fixture: ComponentFixture<DraftInvoiceQCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DraftInvoiceQCComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DraftInvoiceQCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
