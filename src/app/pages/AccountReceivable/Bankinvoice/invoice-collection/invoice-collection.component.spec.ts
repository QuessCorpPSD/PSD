import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceCollectionComponent } from './invoice-collection.component';

describe('InvoiceCollectionComponent', () => {
  let component: InvoiceCollectionComponent;
  let fixture: ComponentFixture<InvoiceCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceCollectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
