import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReimbursementnavigationComponent } from './reimbursementnavigation.component';

describe('ReimbursementnavigationComponent', () => {
  let component: ReimbursementnavigationComponent;
  let fixture: ComponentFixture<ReimbursementnavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReimbursementnavigationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReimbursementnavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
