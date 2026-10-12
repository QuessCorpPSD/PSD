import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicechargeuploadComponent } from './servicechargeupload.component';

describe('ServicechargeuploadComponent', () => {
  let component: ServicechargeuploadComponent;
  let fixture: ComponentFixture<ServicechargeuploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicechargeuploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicechargeuploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
