import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReimbrusementComponent } from './reimbrusement.component';

describe('ReimbrusementComponent', () => {
  let component: ReimbrusementComponent;
  let fixture: ComponentFixture<ReimbrusementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReimbrusementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReimbrusementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
