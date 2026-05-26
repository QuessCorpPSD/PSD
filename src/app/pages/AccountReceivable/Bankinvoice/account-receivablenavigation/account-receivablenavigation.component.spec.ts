import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountReceivablenavigationComponent } from './account-receivablenavigation.component';

describe('AccountReceivablenavigationComponent', () => {
  let component: AccountReceivablenavigationComponent;
  let fixture: ComponentFixture<AccountReceivablenavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountReceivablenavigationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountReceivablenavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
