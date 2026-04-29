import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditNoteUpdateComponent } from './credit-note-update.component';

describe('CreditNoteUpdateComponent', () => {
  let component: CreditNoteUpdateComponent;
  let fixture: ComponentFixture<CreditNoteUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditNoteUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditNoteUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
