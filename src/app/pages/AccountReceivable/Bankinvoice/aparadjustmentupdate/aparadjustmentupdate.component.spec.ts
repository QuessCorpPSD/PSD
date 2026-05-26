import { ComponentFixture, TestBed } from '@angular/core/testing';

import { APARAdjustmentupdateComponent } from './aparadjustmentupdate.component';

describe('APARAdjustmentupdateComponent', () => {
  let component: APARAdjustmentupdateComponent;
  let fixture: ComponentFixture<APARAdjustmentupdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [APARAdjustmentupdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(APARAdjustmentupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
