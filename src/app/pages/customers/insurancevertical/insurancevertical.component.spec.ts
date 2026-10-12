import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceverticalComponent } from './insurancevertical.component';

describe('InsuranceverticalComponent', () => {
  let component: InsuranceverticalComponent;
  let fixture: ComponentFixture<InsuranceverticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsuranceverticalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsuranceverticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
