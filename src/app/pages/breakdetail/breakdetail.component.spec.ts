import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreakdetailComponent } from './breakdetail.component';

describe('BreakdetailComponent', () => {
  let component: BreakdetailComponent;
  let fixture: ComponentFixture<BreakdetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreakdetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BreakdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
