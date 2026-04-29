import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditNoteApproveComponent } from './credit-note-approve.component';

describe('CreditNoteApproveComponent', () => {
  let component: CreditNoteApproveComponent;
  let fixture: ComponentFixture<CreditNoteApproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditNoteApproveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditNoteApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
