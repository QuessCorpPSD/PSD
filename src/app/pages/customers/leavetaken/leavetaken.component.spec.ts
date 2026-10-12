import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavetakenComponent } from './leavetaken.component';

describe('LeavetakenComponent', () => {
  let component: LeavetakenComponent;
  let fixture: ComponentFixture<LeavetakenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeavetakenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeavetakenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
