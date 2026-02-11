import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxRemittanceGenerationComponent } from './tax-remittance-generation.component';

describe('TaxRemittanceGenerationComponent', () => {
  let component: TaxRemittanceGenerationComponent;
  let fixture: ComponentFixture<TaxRemittanceGenerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxRemittanceGenerationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxRemittanceGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
