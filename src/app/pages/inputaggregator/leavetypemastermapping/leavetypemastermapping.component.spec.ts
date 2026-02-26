import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavetypemastermappingComponent } from './leavetypemastermapping.component';

describe('LeavetypemastermappingComponent', () => {
  let component: LeavetypemastermappingComponent;
  let fixture: ComponentFixture<LeavetypemastermappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeavetypemastermappingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeavetypemastermappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
