import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxremittancedetailComponent } from './taxremittancedetail.component';

describe('TaxremittancedetailComponent', () => {
  let component: TaxremittancedetailComponent;
  let fixture: ComponentFixture<TaxremittancedetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxremittancedetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxremittancedetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
