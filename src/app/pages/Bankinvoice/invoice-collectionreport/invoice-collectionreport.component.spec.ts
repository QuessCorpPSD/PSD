import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceCollectionreportComponent } from './invoice-collectionreport.component';

describe('InvoiceCollectionreportComponent', () => {
  let component: InvoiceCollectionreportComponent;
  let fixture: ComponentFixture<InvoiceCollectionreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceCollectionreportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceCollectionreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
