import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PtcircleComponent } from './ptcircle.component';

describe('PtcircleComponent', () => {
  let component: PtcircleComponent;
  let fixture: ComponentFixture<PtcircleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PtcircleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PtcircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
