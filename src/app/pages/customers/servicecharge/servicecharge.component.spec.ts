import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicechargeComponent } from './servicecharge.component';

describe('ServicechargeComponent', () => {
  let component: ServicechargeComponent;
  let fixture: ComponentFixture<ServicechargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicechargeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicechargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
