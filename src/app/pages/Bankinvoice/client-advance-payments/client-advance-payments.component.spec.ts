import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAdvancePaymentsComponent } from './client-advance-payments.component';

describe('ClientAdvancePaymentsComponent', () => {
  let component: ClientAdvancePaymentsComponent;
  let fixture: ComponentFixture<ClientAdvancePaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientAdvancePaymentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientAdvancePaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
