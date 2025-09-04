import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreakdetailsComponent } from './breakdetails.component';

describe('BreakdetailsComponent', () => {
  let component: BreakdetailsComponent;
  let fixture: ComponentFixture<BreakdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreakdetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BreakdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
