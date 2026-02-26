import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavetypemasterComponent } from './leavetypemaster.component';

describe('LeavetypemasterComponent', () => {
  let component: LeavetypemasterComponent;
  let fixture: ComponentFixture<LeavetypemasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeavetypemasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeavetypemasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
