import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftInvoiceComponent } from './draft-invoice.component';

describe('DraftInvoiceComponent', () => {
  let component: DraftInvoiceComponent;
  let fixture: ComponentFixture<DraftInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DraftInvoiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DraftInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
