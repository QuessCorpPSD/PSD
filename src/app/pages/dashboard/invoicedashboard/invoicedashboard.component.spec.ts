import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicedashboardComponent } from './invoicedashboard.component';

describe('InvoicedashboardComponent', () => {
  let component: InvoicedashboardComponent;
  let fixture: ComponentFixture<InvoicedashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoicedashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoicedashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
