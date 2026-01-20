import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitynameComponent } from './cityname.component';

describe('CitynameComponent', () => {
  let component: CitynameComponent;
  let fixture: ComponentFixture<CitynameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitynameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitynameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
