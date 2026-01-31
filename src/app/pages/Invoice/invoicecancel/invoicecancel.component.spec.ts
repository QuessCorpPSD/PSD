import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceCancelComponent } from './invoicecancel.component';

describe('InvoicecancelComponent', () => {
  let component: InvoiceCancelComponent;
  let fixture: ComponentFixture<InvoiceCancelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceCancelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
