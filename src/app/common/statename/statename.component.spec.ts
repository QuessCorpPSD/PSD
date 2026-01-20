import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatenameComponent } from './statename.component';

describe('StatenameComponent', () => {
  let component: StatenameComponent;
  let fixture: ComponentFixture<StatenameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatenameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatenameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
