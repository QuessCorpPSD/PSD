import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceUtilizationReportComponent } from './advance-utilization-report.component';

describe('AdvanceUtilizationReportComponent', () => {
  let component: AdvanceUtilizationReportComponent;
  let fixture: ComponentFixture<AdvanceUtilizationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvanceUtilizationReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvanceUtilizationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
