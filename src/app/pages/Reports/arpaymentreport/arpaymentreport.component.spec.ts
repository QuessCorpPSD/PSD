import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArpaymentreportComponent } from './arpaymentreport.component';

describe('ArpaymentreportComponent', () => {
  let component: ArpaymentreportComponent;
  let fixture: ComponentFixture<ArpaymentreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArpaymentreportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArpaymentreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
