import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankTransferHTHStatusComponent } from './bank-transfer-hthstatus.component';

describe('BankTransferHTHStatusComponent', () => {
  let component: BankTransferHTHStatusComponent;
  let fixture: ComponentFixture<BankTransferHTHStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankTransferHTHStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankTransferHTHStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
