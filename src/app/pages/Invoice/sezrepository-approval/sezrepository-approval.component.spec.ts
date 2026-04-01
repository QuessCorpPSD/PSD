import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SEZRepositoryApprovalComponent } from './sezrepository-approval.component';

describe('SEZRepositoryApprovalComponent', () => {
  let component: SEZRepositoryApprovalComponent;
  let fixture: ComponentFixture<SEZRepositoryApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SEZRepositoryApprovalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SEZRepositoryApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
