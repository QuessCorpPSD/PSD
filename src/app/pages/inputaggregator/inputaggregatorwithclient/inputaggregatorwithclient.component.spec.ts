import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputaggregatorwithclientComponent } from './inputaggregatorwithclient.component';

describe('InputaggregatorwithclientComponent', () => {
  let component: InputaggregatorwithclientComponent;
  let fixture: ComponentFixture<InputaggregatorwithclientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputaggregatorwithclientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputaggregatorwithclientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
