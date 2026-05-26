import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditMatrixComponent } from './credit-matrix.component';

describe('CreditMatrixComponent', () => {
  let component: CreditMatrixComponent;
  let fixture: ComponentFixture<CreditMatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditMatrixComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
