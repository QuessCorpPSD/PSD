import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReIssueProcessReportComponent } from './re-issue-process-report.component';

describe('ReIssueProcessReportComponent', () => {
  let component: ReIssueProcessReportComponent;
  let fixture: ComponentFixture<ReIssueProcessReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReIssueProcessReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReIssueProcessReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
