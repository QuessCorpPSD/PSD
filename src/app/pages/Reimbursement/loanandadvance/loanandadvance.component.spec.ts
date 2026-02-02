import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanandadvanceComponent } from './loanandadvance.component';

describe('LoanandadvanceComponent', () => {
  let component: LoanandadvanceComponent;
  let fixture: ComponentFixture<LoanandadvanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanandadvanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanandadvanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
