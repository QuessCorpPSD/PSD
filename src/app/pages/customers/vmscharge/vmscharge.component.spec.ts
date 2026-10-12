import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VMSchargeComponent } from './vmscharge.component';

describe('VMSchargeComponent', () => {
  let component: VMSchargeComponent;
  let fixture: ComponentFixture<VMSchargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VMSchargeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VMSchargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
