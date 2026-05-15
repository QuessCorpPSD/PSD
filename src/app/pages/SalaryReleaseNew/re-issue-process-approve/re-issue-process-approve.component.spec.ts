import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReIssueProcessApproveComponent } from './re-issue-process-approve.component';

describe('ReIssueProcessApproveComponent', () => {
  let component: ReIssueProcessApproveComponent;
  let fixture: ComponentFixture<ReIssueProcessApproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReIssueProcessApproveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReIssueProcessApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
