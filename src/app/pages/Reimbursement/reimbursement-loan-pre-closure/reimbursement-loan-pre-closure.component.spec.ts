import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReimbursementLoanPreClosureComponent } from './reimbursement-loan-pre-closure.component';

describe('ReimbursementLoanPreClosureComponent', () => {
  let component: ReimbursementLoanPreClosureComponent;
  let fixture: ComponentFixture<ReimbursementLoanPreClosureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReimbursementLoanPreClosureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReimbursementLoanPreClosureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
