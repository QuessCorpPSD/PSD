import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HthbankstatusComponent } from './hthbankstatus.component';

describe('HthbankstatusComponent', () => {
  let component: HthbankstatusComponent;
  let fixture: ComponentFixture<HthbankstatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HthbankstatusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HthbankstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
