import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LTDSreportComponent } from './ltdsreport.component';

describe('LTDSreportComponent', () => {
  let component: LTDSreportComponent;
  let fixture: ComponentFixture<LTDSreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LTDSreportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LTDSreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
