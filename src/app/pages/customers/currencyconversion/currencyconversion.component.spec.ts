import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyconversionComponent } from './currencyconversion.component';

describe('CurrencyconversionComponent', () => {
  let component: CurrencyconversionComponent;
  let fixture: ComponentFixture<CurrencyconversionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrencyconversionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrencyconversionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
