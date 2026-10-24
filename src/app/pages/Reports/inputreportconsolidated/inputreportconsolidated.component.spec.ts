import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputreportconsolidatedComponent } from './inputreportconsolidated.component';

describe('InputreportconsolidatedComponent', () => {
  let component: InputreportconsolidatedComponent;
  let fixture: ComponentFixture<InputreportconsolidatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputreportconsolidatedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputreportconsolidatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
