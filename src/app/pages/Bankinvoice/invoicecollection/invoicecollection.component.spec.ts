import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicecollectionComponent } from './invoicecollection.component';

describe('InvoicecollectionComponent', () => {
  let component: InvoicecollectionComponent;
  let fixture: ComponentFixture<InvoicecollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoicecollectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoicecollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
