import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FandFattendenceComponent } from './fand-fattendence.component';

describe('FandFattendenceComponent', () => {
  let component: FandFattendenceComponent;
  let fixture: ComponentFixture<FandFattendenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FandFattendenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FandFattendenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
