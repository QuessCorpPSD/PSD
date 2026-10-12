import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsurancepolicymappingComponent } from './insurancepolicymapping.component';

describe('InsurancepolicymappingComponent', () => {
  let component: InsurancepolicymappingComponent;
  let fixture: ComponentFixture<InsurancepolicymappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsurancepolicymappingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsurancepolicymappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
