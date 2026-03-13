import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitybystateComponent } from './citybystate.component';

describe('CitybystateComponent', () => {
  let component: CitybystateComponent;
  let fixture: ComponentFixture<CitybystateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitybystateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitybystateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
